const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
var randtoken = require('rand-token');
const config = require('../config.json');
const mailer = require('../helper/mailer')

const saltRounds = 10;

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
    const defaultPassword = randtoken.generate(8);
    console.log("One Time Password : ", defaultPassword)

    const dbConn = await mysql.createConnection(config.database);
    dbConn.config.namedPlaceholders = true;
    const res = await bcrypt.hash(defaultPassword, saltRounds).then( async (hash) => {
        const [rows, fields] = await dbConn.execute(`INSERT INTO user_details (first_name,last_name, email, password, is_admin) VALUES ("${params.first_name}", "${params.last_name}", "${params.email}", "${hash}", ${!!params.is_admin}) `);
        console.log("register rows : ", rows)
        if (rows && rows.affectedRows) {
            return { error: false, message: 'New user has been created successfully.' };
        } else { 
            return {error: true, message: "Something went wrong!"}
        };
    });
    return res;
}

// Authenticate User
async function login(username, password) {
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${username}"`) 
    if (rows.length > 0) {
        const res = await bcrypt.compare(password, rows[0].password).then(async (response) => {
            if (response) {
                return { error: false, message: "success", user: rows }
            } else {
                return { message: "Wrong username/password combination!" };
            }
        });
        return res;
    } else {
        return { error: true, message: "User doesn't exist" }
    }			
}

// Reset Password
async function resetPassword(email) {
    console.log("resetPassword ", email)
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

    if (rows.length > 0) {
        console.log("One Time Password : ", randtoken.generate(8))
        //send mail
        return { error: false, message: "success" }
    } else {
        return { error: true, message: 'Incorrect Username and/or Password!' }
    }			
}

// Change Password
async function updatePassword(email, currentPassword, newPassword) {
    const dbConn = await mysql.createConnection(config.database);
    const res = await bcrypt.hash(currentPassword, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        }
        const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

        if (rows.length > 0) {
            const update_res = await bcrypt.compare(hash, rows[0].password).then( async (response) => {
                if (response) {
                    const [rows, fields] = await dbConn.execute(`UPDATE user_details SET password = "${params.first_name}" WHERE email="${email}"`);
                    if (rows && rows.affectedRows > 0) {
                         return { error: false, data: results, message: 'Password has been changed successfully.' };
                    } else {
                        return {error: true, message: "Something went wrong!"};
                    }
                } else {
                    return { message: "Wrong username/password combination!" };
                }
            });
            return update_res;
        } else {
            return { error: true, message: "User doesn't exist" }
        }
    });
    return res;
}

module.exports = {
    create,
    getUsers,
    login,
    resetPassword,
    updatePassword,
};