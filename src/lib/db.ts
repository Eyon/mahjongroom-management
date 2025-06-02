import { D1Database } from '@cloudflare/workers-types';

// 类型定义
export interface Table {
  id: number;
  tenant_id: number;
  name: string;
  type: 'private_room' | 'hall';
  status: 'idle' | 'in_use';
}

export interface TableSession {
  id: number;
  table_id: number;
  billing_method_id: number;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed';
}

export interface BillingMethod {
  id: number;
  tenant_id: number;
  name: string;
  type: 'hourly' | 'fixed' | 'package';
  base_price: number;
  package_hours?: number;
  package_price?: number;
  extra_hour_price?: number;
}

export interface Product {
  id: number;
  tenant_id: number;
  name: string;
  price: number;
  category: string;
}

export interface Consumption {
  id: number;
  table_session_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// 数据库操作函数
export async function getActiveTables(db: D1Database, tenantId: number) {
  const tables = await db.prepare(`
    SELECT t.*, ts.id as session_id, ts.start_time, bm.name as billing_method_name, 
           bm.type as billing_method_type, bm.base_price, bm.package_hours, 
           bm.package_price, bm.extra_hour_price
    FROM tables t
    LEFT JOIN table_sessions ts ON t.id = ts.table_id AND ts.status = 'active'
    LEFT JOIN billing_methods bm ON ts.billing_method_id = bm.id
    WHERE t.tenant_id = ?
  `).bind(tenantId).all();

  // 获取每个台桌的消费记录
  for (const table of tables.results) {
    if (table.session_id) {
      const consumptions = await db.prepare(`
        SELECT c.*, p.name as product_name
        FROM consumptions c
        JOIN products p ON c.product_id = p.id
        WHERE c.table_session_id = ?
      `).bind(table.session_id).all();
      table.consumptions = consumptions.results;
    } else {
      table.consumptions = [];
    }
  }

  return tables.results;
}

export async function startTableSession(
  db: D1Database, 
  tableId: number, 
  billingMethodId: number
) {
  // 开始事务
  const result = await db.prepare(`
    INSERT INTO table_sessions (table_id, billing_method_id, start_time, status)
    VALUES (?, ?, datetime('now'), 'active')
  `).bind(tableId, billingMethodId).run();

  // 更新台桌状态
  await db.prepare(`
    UPDATE tables 
    SET status = 'in_use', updated_at = datetime('now')
    WHERE id = ?
  `).bind(tableId).run();

  return result;
}

export async function addConsumption(
  db: D1Database,
  tableSessionId: number,
  productId: number,
  quantity: number
) {
  // 获取商品价格
  const product = await db.prepare(`
    SELECT price FROM products WHERE id = ?
  `).bind(productId).first();

  if (!product) {
    throw new Error('Product not found');
  }

  // 添加消费记录
  return await db.prepare(`
    INSERT INTO consumptions (table_session_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `).bind(tableSessionId, productId, quantity, product.price).run();
}

export async function endTableSession(
  db: D1Database,
  tableSessionId: number
) {
  // 开始事务
  const session = await db.prepare(`
    SELECT table_id FROM table_sessions WHERE id = ?
  `).bind(tableSessionId).first();

  if (!session) {
    throw new Error('Session not found');
  }

  // 更新会话状态
  await db.prepare(`
    UPDATE table_sessions 
    SET end_time = datetime('now'), status = 'completed'
    WHERE id = ?
  `).bind(tableSessionId).run();

  // 更新台桌状态
  await db.prepare(`
    UPDATE tables 
    SET status = 'idle', updated_at = datetime('now')
    WHERE id = ?
  `).bind(session.table_id).run();

  // 获取结算信息
  const bill = await db.prepare(`
    SELECT 
      ts.*,
      bm.type as billing_method_type,
      bm.base_price,
      bm.package_hours,
      bm.package_price,
      bm.extra_hour_price,
      (
        SELECT SUM(quantity * price)
        FROM consumptions
        WHERE table_session_id = ?
      ) as total_consumption
    FROM table_sessions ts
    JOIN billing_methods bm ON ts.billing_method_id = bm.id
    WHERE ts.id = ?
  `).bind(tableSessionId, tableSessionId).first();

  return bill;
}

export async function getBillingMethods(db: D1Database, tenantId: number) {
  return await db.prepare(`
    SELECT * FROM billing_methods WHERE tenant_id = ?
  `).bind(tenantId).all();
}

export async function getProducts(db: D1Database, tenantId: number) {
  return await db.prepare(`
    SELECT * FROM products WHERE tenant_id = ?
  `).bind(tenantId).all();
} 