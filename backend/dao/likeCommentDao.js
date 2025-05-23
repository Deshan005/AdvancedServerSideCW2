const db = require('../config/db.js');

/* Add or update a reaction to a blog*/
exports.upsertReaction = (blogId, email, reaction, callback) => {
  const query = `
    INSERT INTO blog_reactions (blog_id, user_email, reaction)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE reaction = ?
  `;
  db.query(query, [blogId, email, reaction, reaction], callback);
};

/*Get total number of likes and dislikes for a blog*/
exports.getReactionCounts = (blogId, callback) => {
  const query = `
    SELECT
      SUM(reaction = 'like') AS likes,
      SUM(reaction = 'dislike') AS dislikes
    FROM blog_reactions
    WHERE blog_id = ?
  `;
  db.query(query, [blogId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

/*Get current user's reaction to a blog*/
exports.getUserReaction = (blogId, email, callback) => {
  const query = `
    SELECT reaction
    FROM blog_reactions
    WHERE blog_id = ? AND user_email = ?
  `;
  db.query(query, [blogId, email], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0].reaction);
  });
};

/*Add a comment to a blog*/
exports.addComment = (blogId, email, text, callback) => {
  const query = `
    INSERT INTO blog_comments (blog_id, user_email, comment_text)
    VALUES (?, ?, ?)
  `;
  db.query(query, [blogId, email, text], callback);
};

/*Get all comments for a blog*/
exports.getComments = (blogId, callback) => {
  const query = `
    SELECT user_email, comment_text, created_at
    FROM blog_comments
    WHERE blog_id = ?
    ORDER BY created_at DESC
  `;
  db.query(query, [blogId], callback);
};
