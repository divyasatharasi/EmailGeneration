const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const mailer = require('../helper/mailer')
var randtoken = require('rand-token');

async function sendMail() {
    await mailer.sendMail();
}

// Retrieve all users 
async function getUsers() {
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.execute('SELECT * FROM user_details');
    return rows;
}

// Add a new user  
async function create(params) {
    console.log("params : ", params)
    if (!params) {
        return { status: 400, error:true, message: 'Please provide user' };
    }
    //generate default password
    const dbConn = await mysql.createConnection(config.database);
    dbConn.config.namedPlaceholders = true;
    const [rows, fields] = await dbConn.execute(`INSERT INTO user_details (first_name,last_name, email, is_admin) VALUES ("${params.first_name}", "${params.last_name}", "${params.email}", ${params.is_admin}) `);

    if (rows && rows.affectedRows) throw error;
    return { error: false, data: results, message: 'New user has been created successfully.' };
}

// Authenticate User
async function login(username, password) {
    console.log("login ", username, password)
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${username}" AND password = "${password}"`) 

    if (rows.length > 0) {
        return { error: false, message: "success" }
    } else {
        return { error: true, message: 'Incorrect Username and/or Password!' }
    }			
}

// Reset Password
async function resetPassword(email) {
    console.log("resetPassword ", email)
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

    if (rows.length > 0) {
        console.log("One Time Password : ", randtoken.generate(20))
        //send mail
        return { error: false, message: "success" }
    } else {
        return { error: true, message: 'Incorrect Username and/or Password!' }
    }			
}

// Change Password
async function updatePassword(email, currentPassword, newPassword) {
    console.log("updatePassword ", email)
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}" AND password = "${currentPassword}"`) 

    if (rows.length > 0) {
        const [rows, fields] = await dbConn.execute(`UPDATE user_details SET password = "${params.first_name}" WHERE email="${email}"`);

        if (rows && rows.affectedRows) throw error;
        return { error: false, data: results, message: 'Password has been changed successfully.' };
    } else {
        return { error: true, message: 'Incorrect Username and/or Password!' }
    }			
}

module.exports = {
    create,
    getUsers,
    login,
    resetPassword,
    updatePassword,
};