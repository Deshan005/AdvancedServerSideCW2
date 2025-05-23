const db = require('../config/db.js');

// Fetch all blogs
const getAllBlogs = (callback) => {
  const sql = `
    SELECT id, title, content, country, image, author_email AS author, created_at
    FROM blogs
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

// Create a new blog
const createBlog = (title, content, country, image, authorEmail, visitedDate, callback) => {
  const sql = `
    INSERT INTO blogs (title, content, country, image, author_email, visited_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, content, country, image, authorEmail, visitedDate], callback);
};

// Find a single blog by ID
const findBlogById = (id, callback) => {
  const sql = "SELECT * FROM blogs WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Update a blog by ID and author email
const updateBlog = (id, title, content, country, image, authorEmail, callback) => {
  const sql = `
    UPDATE blogs
    SET title = ?, content = ?, country = ?, image = ?
    WHERE id = ? AND author_email = ?
  `;
  db.query(sql, [title, content, country, image, id, authorEmail], callback);
};

// Delete a blog by ID
const deleteBlog = (id, callback) => {
  const sql = "DELETE FROM blogs WHERE id = ?";
  db.query(sql, [id], callback);
};

// Get blogs by author's email
const getBlogsByAuthorEmail = (authorEmail, callback) => {
  const sql = "SELECT * FROM blogs WHERE author_email LIKE ? ORDER BY created_at DESC";
  db.query(sql, [`%${authorEmail}%`], callback);
};

// Get blogs by country
const getBlogsByCountry = (country, callback) => {
  const sql = "SELECT * FROM blogs WHERE country = ? ORDER BY created_at DESC";
  db.query(sql, [country], callback);
};

// Get blogs by author name and country
const getBlogsByAuthorAndCountry = (authorName, country, callback) => {
  const sql = "SELECT * FROM blogs WHERE author_name LIKE ? AND country = ? ORDER BY created_at DESC";
  db.query(sql, [`%${authorName}%`, country], callback);
};

// Advanced filtering using custom SQL
const filterBlogs = (sql, values, callback) => {
  db.query(sql, values, callback);
};

// Get blogs from followed users
const getFollowingFeed = (userEmail, callback) => {
  const sql = `
    SELECT blogs.*
    FROM blogs
    JOIN followers ON blogs.author_email = followers.following_email
    WHERE followers.follower_email = ?
    ORDER BY blogs.created_at DESC
  `;
  db.query(sql, [userEmail], callback);
};

module.exports = {
  getAllBlogs,
  createBlog,
  findBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByAuthorEmail,
  getBlogsByCountry,
  getBlogsByAuthorAndCountry,
  filterBlogs,
  getFollowingFeed,
};
