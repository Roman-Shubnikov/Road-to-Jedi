const mysql = require('mysql');
const { pool } = require('./config');


module.exports.db_query = async (query, placeholders) => {
    let query_formatted = mysql.format(query, placeholders)
    try {
        let resp = new Promise((resolve) => {
            pool.query(query_formatted, (err, result) => {
                if (err) {
                    console.log(err)
                    resolve([]);
                }
                resolve(result);
            })
        })
        return await resp;
    } catch (e) {
        return [];
    }
}