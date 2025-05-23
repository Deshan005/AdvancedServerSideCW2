const db = require('../config/db.js');

/**
 * Follow a user
 */
const followUser = (followerEmail, followingEmail, callback) => {
  const sql = `
    INSERT INTO followers (follower_email, following_email)
    VALUES (?, ?)
  `;
  db.query(sql, [followerEmail, followingEmail], callback);
};

/**
 * Unfollow a user
 */
const unfollowUser = (followerEmail, followingEmail, callback) => {
  const sql = `
    DELETE FROM followers
    WHERE follower_email = ? AND following_email = ?
  `;
  db.query(sql, [followerEmail, followingEmail], callback);
};

/**
 * Get a list of users this user is following
 */
const getFollowing = (followerEmail, callback) => {
  const sql = `
    SELECT following_email
    FROM followers
    WHERE follower_email = ?
  `;
  db.query(sql, [followerEmail], callback);
};

/**
 * Get a list of followers for a user
 */
const getFollowers = (followingEmail, callback) => {
  const sql = `
    SELECT follower_email
    FROM followers
    WHERE following_email = ?
  `;
  db.query(sql, [followingEmail], callback);
};

/**
 * Check if a user is already following another user
 */
const isAlreadyFollowing = (followerEmail, followingEmail, callback) => {
  const sql = `
    SELECT 1
    FROM followers
    WHERE follower_email = ? AND following_email = ?
    LIMIT 1
  `;
  db.query(sql, [followerEmail, followingEmail], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0); // true if already following
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  isAlreadyFollowing,
};
