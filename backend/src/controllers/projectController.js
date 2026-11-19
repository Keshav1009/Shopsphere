const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Get all collaborative projects / storefront initiatives
const getProjects = async (req, res, next) => {
  try {
    const { status, skill } = req.query;
    let sql = `
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.role as creator_role, u.tech_stack as creator_tech_stack
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ` AND p.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const projects = await db.allAsync(sql, params);

    const formatted = projects.map(proj => {
      try {
        proj.required_technologies = JSON.parse(proj.required_technologies || '[]');
      } catch {
        proj.required_technologies = [];
      }
      try {
        proj.creator_tech_stack = JSON.parse(proj.creator_tech_stack || '[]');
      } catch {
        proj.creator_tech_stack = [];
      }
      return proj;
    });

    // In-memory filter for skill if specified
    const filtered = skill
      ? formatted.filter(p => p.required_technologies.some(t => t.toLowerCase().includes(skill.toLowerCase())))
      : formatted;

    return res.status(200).json({
      success: true,
      count: filtered.length,
      projects: filtered
    });
  } catch (error) {
    next(error);
  }
};

// Get single project
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await db.getAsync(`
      SELECT p.*, u.name as creator_name, u.email as creator_email, u.bio as creator_bio, u.portfolio_url as creator_portfolio, u.tech_stack as creator_tech_stack
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project initiative not found.' });
    }

    try {
      project.required_technologies = JSON.parse(project.required_technologies || '[]');
    } catch {
      project.required_technologies = [];
    }

    // Fetch related messages
    const messages = await db.allAsync(`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM connections_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.reference_id = ?
      ORDER BY m.timestamp ASC
    `, [id]);

    return res.status(200).json({
      success: true,
      project,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// Create a collaborative project
const createProject = async (req, res, next) => {
  try {
    const { title, description, required_technologies = [], status = 'Open' } = req.body;
    const creatorId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const id = `proj_${uuidv4().substring(0, 8)}`;
    const formattedTech = JSON.stringify(Array.isArray(required_technologies) ? required_technologies : []);

    await db.runAsync(`
      INSERT INTO projects (id, title, description, required_technologies, status, creator_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, title.trim(), description.trim(), formattedTech, status, creatorId]);

    const created = await db.getAsync(`
      SELECT p.*, u.name as creator_name
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      WHERE p.id = ?
    `, [id]);

    try {
      created.required_technologies = JSON.parse(created.required_technologies || '[]');
    } catch {
      created.required_technologies = [];
    }

    return res.status(201).json({
      success: true,
      message: 'Collaborative initiative created successfully.',
      project: created
    });
  } catch (error) {
    next(error);
  }
};

// Update project status or details
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, required_technologies, status } = req.body;

    const existing = await db.getAsync(`SELECT * FROM projects WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Only creator or admin can update
    if (req.user.role !== 'admin' && existing.creator_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not own this initiative.' });
    }

    const formattedTech = required_technologies !== undefined
      ? JSON.stringify(Array.isArray(required_technologies) ? required_technologies : [])
      : undefined;

    await db.runAsync(`
      UPDATE projects SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        required_technologies = COALESCE(?, required_technologies),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [title, description, formattedTech, status, id]);

    const updated = await db.getAsync(`SELECT * FROM projects WHERE id = ?`, [id]);
    try {
      updated.required_technologies = JSON.parse(updated.required_technologies || '[]');
    } catch {
      updated.required_technologies = [];
    }

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project: updated
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db.getAsync(`SELECT * FROM projects WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (req.user.role !== 'admin' && existing.creator_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not own this initiative.' });
    }

    await db.runAsync(`DELETE FROM projects WHERE id = ?`, [id]);
    await db.runAsync(`DELETE FROM connections_messages WHERE reference_id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
