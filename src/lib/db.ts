import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Define tables
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  username: text('username').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['creator', 'admin', 'staff'] }).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const tables = sqliteTable('tables', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  type: text('type', { enum: ['private_room', 'hall'] }).notNull(),
  status: text('status', { enum: ['idle', 'in_use'] }).default('idle').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const billingMethods = sqliteTable('billing_methods', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  type: text('type', { enum: ['hourly', 'fixed', 'package'] }).notNull(),
  basePrice: integer('base_price').notNull(),
  packageHours: integer('package_hours'),
  packagePrice: integer('package_price'),
  extraHourPrice: integer('extra_hour_price'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  category: text('category').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const tableSessions = sqliteTable('table_sessions', {
  id: integer('id').primaryKey(),
  tableId: integer('table_id').notNull().references(() => tables.id),
  billingMethodId: integer('billing_method_id').notNull().references(() => billingMethods.id),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  status: text('status', { enum: ['active', 'completed'] }).default('active').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const consumptions = sqliteTable('consumptions', {
  id: integer('id').primaryKey(),
  tableSessionId: integer('table_session_id').notNull().references(() => tableSessions.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const otherTransactions = sqliteTable('other_transactions', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Database interface
export interface DB {
  prepare: (query: string) => any;
  run: (query: string, params?: any[]) => Promise<any>;
  all: (query: string, params?: any[]) => Promise<any[]>;
  get: (query: string, params?: any[]) => Promise<any>;
}

// Initialize database
export function getDb(db: D1Database) {
  return drizzle(db);
}

// Database operations
export async function getBillingMethods(db: DB, tenantId: number) {
  const query = `
    SELECT * FROM billing_methods 
    WHERE tenant_id = ?
    ORDER BY created_at DESC
  `;
  const results = await db.all(query, [tenantId]);
  return { results };
}

export async function getProducts(db: DB, tenantId: number) {
  const query = `
    SELECT * FROM products 
    WHERE tenant_id = ?
    ORDER BY category, name
  `;
  const results = await db.all(query, [tenantId]);
  return { results };
}

export async function getActiveTables(db: DB, tenantId: number) {
  const query = `
    SELECT 
      t.*,
      ts.id as session_id,
      ts.start_time,
      bm.name as billing_method_name,
      bm.type as billing_method_type,
      bm.base_price,
      bm.package_hours,
      bm.package_price,
      bm.extra_hour_price
    FROM tables t
    LEFT JOIN table_sessions ts ON t.id = ts.table_id AND ts.status = 'active'
    LEFT JOIN billing_methods bm ON ts.billing_method_id = bm.id
    WHERE t.tenant_id = ?
    ORDER BY t.name
  `;
  const tables = await db.all(query, [tenantId]);

  // Get consumptions for active sessions
  for (const table of tables) {
    if (table.session_id) {
      const consumptionsQuery = `
        SELECT 
          c.*,
          p.name as product_name
        FROM consumptions c
        JOIN products p ON c.product_id = p.id
        WHERE c.table_session_id = ?
        ORDER BY c.created_at DESC
      `;
      table.consumptions = await db.all(consumptionsQuery, [table.session_id]);
    } else {
      table.consumptions = [];
    }
  }

  return tables;
}

export async function startTableSession(db: DB, tableId: number, billingMethodId: number) {
  // Start transaction
  await db.run('BEGIN TRANSACTION');

  try {
    // Check if table is available
    const tableQuery = `
      SELECT * FROM tables 
      WHERE id = ? AND status = 'idle'
    `;
    const table = await db.get(tableQuery, [tableId]);
    if (!table) {
      throw new Error('Table is not available');
    }

    // Update table status
    await db.run(
      'UPDATE tables SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['in_use', tableId]
    );

    // Create session
    const sessionQuery = `
      INSERT INTO table_sessions (
        table_id, 
        billing_method_id, 
        start_time,
        status
      ) VALUES (?, ?, CURRENT_TIMESTAMP, 'active')
    `;
    const result = await db.run(sessionQuery, [tableId, billingMethodId]);

    await db.run('COMMIT');
    return { success: true, sessionId: result.lastID };
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

export async function addConsumption(
  db: DB,
  tableSessionId: number,
  productId: number,
  quantity: number
) {
  // Get product price
  const productQuery = `
    SELECT price FROM products WHERE id = ?
  `;
  const product = await db.get(productQuery, [productId]);
  if (!product) {
    throw new Error('Product not found');
  }

  // Add consumption
  const query = `
    INSERT INTO consumptions (
      table_session_id,
      product_id,
      quantity,
      price
    ) VALUES (?, ?, ?, ?)
  `;
  
  const result = await db.run(query, [
    tableSessionId,
    productId,
    quantity,
    product.price
  ]);

  return { success: true, consumptionId: result.lastID };
}

export async function endTableSession(db: DB, sessionId: number) {
  // Start transaction
  await db.run('BEGIN TRANSACTION');

  try {
    // Get session details
    const sessionQuery = `
      SELECT 
        ts.*,
        t.id as table_id,
        bm.type as billing_type,
        bm.base_price,
        bm.package_hours,
        bm.package_price,
        bm.extra_hour_price
      FROM table_sessions ts
      JOIN tables t ON ts.table_id = t.id
      JOIN billing_methods bm ON ts.billing_method_id = bm.id
      WHERE ts.id = ? AND ts.status = 'active'
    `;
    const session = await db.get(sessionQuery, [sessionId]);
    if (!session) {
      throw new Error('Active session not found');
    }

    // Calculate time-based charges
    const startTime = new Date(session.start_time);
    const endTime = new Date();
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    let timeCharge = 0;
    if (session.billing_type === 'hourly') {
      timeCharge = Math.ceil(hours * session.base_price);
    } else if (session.billing_type === 'fixed') {
      timeCharge = session.base_price;
    } else if (session.billing_type === 'package') {
      if (hours <= session.package_hours) {
        timeCharge = session.package_price;
      } else {
        const extraHours = Math.ceil(hours - session.package_hours);
        timeCharge = session.package_price + (extraHours * session.extra_hour_price);
      }
    }

    // Get consumptions
    const consumptionsQuery = `
      SELECT SUM(quantity * price) as total
      FROM consumptions
      WHERE table_session_id = ?
    `;
    const consumptions = await db.get(consumptionsQuery, [sessionId]);
    const consumptionCharge = consumptions.total || 0;

    // Update session
    await db.run(
      `UPDATE table_sessions 
       SET status = 'completed', 
           end_time = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [sessionId]
    );

    // Update table
    await db.run(
      `UPDATE tables 
       SET status = 'idle',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [session.table_id]
    );

    await db.run('COMMIT');

    return {
      success: true,
      timeCharge,
      consumptionCharge,
      totalAmount: timeCharge + consumptionCharge
    };
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}