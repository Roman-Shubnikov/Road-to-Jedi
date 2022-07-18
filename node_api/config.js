const mysqlLib = require('mysql');

module.exports.pool = mysqlLib.createPool({
    host     : '89.223.126.48',
    user     : 'jedi',
    password : 'Road019283roman22',
    database: 'roadjedi',
});