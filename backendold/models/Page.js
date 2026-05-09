const db = require('../config/db');

class Page {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT p.*, COUNT(s.id) as sections_count 
      FROM pages p 
      LEFT JOIN sections s ON p.id = s.page_id 
      GROUP BY p.id 
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM pages WHERE id = ?', [id]);
    return rows[0];
  }

  static async getBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM pages WHERE slug = ?', [slug]);
    return rows[0];
  }

  static async create(pageData) {
    const { name, slug, is_active = true } = pageData;
    const [result] = await db.query(
      'INSERT INTO pages (name, slug, is_active) VALUES (?, ?, ?)',
      [name, slug, is_active]
    );
    return result.insertId;
  }

  static async update(id, pageData) {
    const { name, slug, is_active } = pageData;
    const [result] = await db.query(
      'UPDATE pages SET name = ?, slug = ?, is_active = ? WHERE id = ?',
      [name, slug, is_active, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    await db.query('DELETE FROM sections WHERE page_id = ?', [id]);
    const [result] = await db.query('DELETE FROM pages WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Page;