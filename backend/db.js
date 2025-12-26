const mysql=require('mysql');
const util=require('util');

const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'car_rental_system_node',
});

const exe=util.promisify(conn.query).bind(conn);
module.exports={conn,exe};
