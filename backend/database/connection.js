require("dotenv").config();
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

const connectionFunctions = {
    getAllReservations: () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM reservations";
            pool.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    },
    saveReservation: (body) => {
        return new Promise((resolve, reject) => {
            console.log("body", body, typeof body);
            const sql = "INSERT INTO reservations (date, time) VALUES (?, ?)";
            pool.query(sql, [body.date, body.time], (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    },
    getDefaultSchedule: () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM default_schedule";
            pool.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    },
    getExceptionSchedule: () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM exception_schedule";
            pool.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    },
};

module.exports = connectionFunctions;
