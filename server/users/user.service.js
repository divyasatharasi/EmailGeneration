const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
var randtoken = require('rand-token');
const readXlsxFile = require("read-excel-file/node");
const path = require('path')

const config = require('../config.json');
const mailer = require('../helper/mailer');

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

// Retrieve all users 
async function getCustomerList() {
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.execute('SELECT * FROM customer_info');
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
			mailer.sendMail(defaultPassword,params.email);
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
                return { error:true, message: "Wrong username/password combination!" };
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
		const defaultPassword = randtoken.generate(8);
		console.log("One Time Password : ", defaultPassword)
		const [rows, fields] = await dbConn.execute(`UPDATE user_details SET  otp="${defaultPassword}" WHERE email ="${email}"`);
        console.log("register rows : ", rows)
        if (rows && rows.affectedRows) {
			mailer.sendMail(defaultPassword, email);
            return { error: false, message: 'New user has been created successfully.' };
        } else { 
            return {error: true, message: "Something went wrong!"}
        };
        //console.log("One Time Password : ", randtoken.generate(8))
        //send mail
        //return { error: false, message: "success" }
    } else {
        return { error: true, message: 'Incorrect Username and/or Password!' }
    }			
}

// Change Password
async function updatePassword(email, currentPassword, newPassword) {
    const dbConn = await mysql.createConnection(config.database);
    // const res = await bcrypt.hash(currentPassword, saltRounds, async (err, hash) => {
    //     if (err) {
    //         console.log(err);
    //         return { error: true, message: err }
    //     }
        const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

        if (rows.length > 0) {
            const update_res = await bcrypt.compare(currentPassword, rows[0].password).then( async (isMatch) => {
                if (isMatch) {
                    const newPwdRes = await bcrypt.hash(newPassword, saltRounds).then( async (newPwdHash) => {
                        const [rows, fields] = await dbConn.execute(`UPDATE user_details SET password = "${newPwdHash}" WHERE email="${email}"`);
                        if (rows && rows.affectedRows > 0) {
                            return { error: false, data: rows, message: 'Password has been changed successfully.' };
                        } else {
                            return {error: true, message: "Something went wrong!"};
                        }
                    });
                    return newPwdRes;
                } else {
                    return { error:true, message: "Wrong username/password combination!" };
                }
            });
            return update_res;
        } else {
            return { error: true, message: "User doesn't exist" }
        }
    // });
    // return res;
}

//File Upload
async function fileUpload(file, fileContentType) {
    console.log("file in service : ", path.dirname(file.path))
    try {
        if (file == undefined) {
          return res.status(400).send("Please upload an excel file!");
        }
    
        let filePath = path.normalize(__dirname + "/../uploads/" + file.filename);
        console.log("asd path : ", filePath)
        readXlsxFile(filePath).then(async (rows) => {
            // skip header
            rows.shift();
      
            let customer_data = [];
      
            rows.forEach((row) => {
                let data = {
                id: row[0],
                title: row[1],
                description: row[2],
                published: row[3],
                };
        
                customer_data.push(data);
            });
            console.log("rows length : ", rows[0])

            const resultRows = insertCustomerRecords(rows, fileContentType);

            /* ResultSetHeader {
                    fieldCount: 0,
                    affectedRows: 10,
                    insertId: 1,
                    info: 'Records: 10  Duplicates: 0  Warnings: 0',
                    serverStatus: 2,
                    warningStatus: 0
                } */
            if (resultRows.affectedRows > 0) {
                return { error: true, message: "Processed customer records successfully!." }
            }
        });
    } catch (error) {
        console.log(error);
        return { error: true, message: "Could not process the file, error has occured ", message: error };
    }
}

async function insertCustomerRecords (rows, fileContentType) {
    const dbConn = await mysql.createConnection(config.database);
    if(fileContentType === 'customer') {
        const [resultRows, fields] = await dbConn.query('INSERT INTO customer_info (company_name, lead_full_name, lead_first_name, lead_middle_name, lead_last_name, designation, industry, city, country, course) VALUES ?', [rows], true);

        return resultRows;
    } else {
        const [resultRows, fields] = await dbConn.query('INSERT INTO domain_info (company_name, domain, format1, format2, format3) VALUES ?', [rows], true);

        return resultRows;
    }
    
}

module.exports = {
    create,
    getUsers,
    login,
    resetPassword,
    updatePassword,
    fileUpload,
    getCustomerList,
};