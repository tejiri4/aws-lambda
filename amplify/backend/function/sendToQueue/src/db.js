const mysql = require('mysql');
const { logToSlack, types } = require('./slack');


// configure dotenv
require('dotenv').config()

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

const connection = mysql.createConnection(dbConfig);

const connectDb = () => {
  return new Promise((resolve, reject) => {
    connection.connect(function (err) {
      if (err) {
        reject('error connecting: ' + err.stack);
      }

      resolve('connected as id ' + connection.threadId)
    });
  })
};

const getPendingSavingPlan = async () => {
  await connectDb();

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM saving_plans WHERE status = 'PENDING'`, (error, results, fields) => {
      if (error) reject(error);

      connection.end();

      resolve(results)
    });
  })
}

module.exports = { getPendingSavingPlan };