const db = require('../config/db');

class Section {
  static async getByPageId(pageId) {
    const [rows] = await db.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY order_position ASC',
      [pageId]
    );
    return rows.map(row => ({
      ...row,
      content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content
    }));
  }

  static async create(sectionData) {
    const { page_id, section_type, title, content, order_position, is_active = true } = sectionData;
    
    // Ensure content is stringified JSON
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content || {});
    
    const [result] = await db.query(
      'INSERT INTO sections (page_id, section_type, title, content, order_position, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [page_id, section_type, title, contentStr, order_position || 0, is_active]
    );
    return result.insertId;
  }

  static async update(id, sectionData) {
    const { title, content, order_position, is_active } = sectionData;
    
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content || {});
    
    const [result] = await db.query(
      'UPDATE sections SET title = ?, content = ?, order_position = ?, is_active = ? WHERE id = ?',
      [title, contentStr, order_position, is_active, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM sections WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async reorder(sections) {
    for (const section of sections) {
      await db.query('UPDATE sections SET order_position = ? WHERE id = ?', [section.order, section.id]);
    }
    return true;
  }
}

module.exports = Section;