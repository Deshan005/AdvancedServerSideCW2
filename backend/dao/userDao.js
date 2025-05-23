const db = require('../config/db');

/*Check if a user email already exists in the database*/
const checkEmailExists = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0);
  });
};

/*Create a new user with name, email, and hashed password*/
const createUser = (name, email, hashedPassword, callback) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

/*Retrieve user data by email*/
const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0 ? results[0] : null);
  });
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail
};
