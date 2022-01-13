const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
var randtoken = require('rand-token');
const readXlsxFile = require("read-excel-file/node");
const path = require('path')

const config = require('../config.json');
const mailer = require('../helper/mailer');

const saltRounds = 10;

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
    try {
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
            if (rows && rows.affectedRows) {
                mailer.sendMail(defaultPassword,params.email);
                return { success: true, message: 'New user has been created successfully.' };
            } else { 
                return {error: true, message: "Something went wrong!"}
            };
        });
        return res;
    } catch (error) {
        console.log(error);
        return { error: true, message: "Error occured in user creation ", error };
    }
}

// Authenticate User
async function login(username, password) {
    const dbConn = await mysql.createConnection(config.database);
    const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${username}"`) 
    if (rows.length > 0) {
        if (rows[0].otp != null)
        {
            if (rows[0].otp == password) {
                return { error: false, message: "success", user: rows, redirect:"change-password"}
            } else {
                return { error:true, message: "Wrong username/OTP combination!" };
            }
        } else {
            const res = await bcrypt.compare(password, rows[0].password).then(async (response) => {
                if (response) {
                    return { error: false, message: "success", user: rows }
                } else {
                    return { error:true, message: "Wrong username/password combination!" };
                }
            });
            return res;
        }
    } else {
        return { error: true, message: "User doesn't exist" }
    }			
}

// Reset Password
async function resetPassword(email) {
    try {
        const dbConn = await mysql.createConnection(config.database);
        const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

        if (rows.length > 0) {
            const defaultPassword = randtoken.generate(8);
            console.log("One Time Password : ", defaultPassword)
            const [rows, fields] = await dbConn.execute(`UPDATE user_details SET  otp="${defaultPassword}" WHERE email ="${email}"`);
            if (rows && rows.affectedRows) {
                mailer.sendMail(defaultPassword, email);
                return { error: false, message: 'New user has been created successfully.' };
            } else { 
                return {error: true, message: "Something went wrong!"}
            };
        } else {
            return { error: true, message: 'User/email does not exist' }
        }
    } catch (error) {
        console.log(error);
        return { error: true, message: "Error occured while resetting password ", error };
    }
}

// Change Password
async function updatePassword(email, currentPassword, newPassword) {
    const dbConn = await mysql.createConnection(config.database);
        const [rows, fields] = await dbConn.query(`SELECT * FROM user_details WHERE email = "${email}"`) 

        if (rows.length > 0) {
            if(rows[0].otp !=null)
            {
                if (currentPassword == rows[0].otp) {
                    const newPwdRes = await bcrypt.hash(newPassword, saltRounds).then( async (newPwdHash) => {
                        const [rows, fields] = await dbConn.execute(`UPDATE user_details SET password = "${newPwdHash}",  otp = NULL WHERE email="${email}"`);
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
 
            }
            else 
            {
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
            }
        } else {
            return { error: true, message: "User doesn't exist" }
        }
}

//File Upload
async function fileUpload(file, fileContentType, request, response) {
    console.log("file in service : ", path.dirname(file.path))
    try {
        if (file == undefined) {
          return res.status(400).send("Please upload an excel file!");
        }
    
        let filePath = path.normalize(__dirname + "/../uploads/" + file.filename);
        const result = await readXlsxFile(filePath).then(async (rows) => {
            if(rows.length > 0 && validateFile(rows[0], fileContentType)) {
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
                
                const { res_insert_data: resultRows, res_insert_data, res_unprocessed_rows: unProcessedRows} = await processData(rows, fileContentType, request, response);
                console.log("fileUpload - resultRows : ", res_insert_data)
                if (resultRows && resultRows.affectedRows > 0) {
                    return { error: false, message: `Processed ${resultRows.affectedRows} records successfully!.`, unProcessedRows }
                } else {
                    return {error: true, message: resultRows, unProcessedRows }
                }
            } else {
                return {error: true, message: "Please upload a valid file.!"}
            }
            
        });
        return result;
    } catch (error) {
        console.log(error);
        return { error: true, message: "Could not process the file, error has occured ", error };
    }
}

async function processData (rows, fileContentType, request, response) {
    let res_insert_data = undefined;
    let res_unprocessed_rows = undefined;
    if (fileContentType === 'customer') {
        const distinctCompanies = [...new Set(rows.map(r => r[0]))];
        const strCompany = JSON.stringify(distinctCompanies)
        const companyList = strCompany.substring(1,strCompany.length - 1);

        const dbConn = await mysql.createConnection(config.database);
        const [resultRows, fields] = await dbConn.query(`SELECT company_name, domain, format1, format2, format3 FROM domain_info WHERE company_name in ( ${[companyList]} )`);

        if (resultRows.length > 0) {
            console.log('asd :asd :', resultRows)
            const { processedRows, unProcessedRows } = await createMailFormats(rows, resultRows, request, response);
            res_unprocessed_rows = unProcessedRows;

           res_insert_data = await insertFileData (processedRows, fileContentType);
        } else {
            res_insert_data = "Processed 0 records, matching domains not available!";
        }
    } else {
        res_insert_data = await insertFileData (rows, fileContentType);
    }
    return { res_insert_data, res_unprocessed_rows };
}

async function createMailFormats(rows, domainlist, request, response) {
    const processedRows = [];
    const unProcessedRows = [];
    for(let i=0; i < rows.length; i++) {
        const domain = domainlist.find(d => d["company_name"] == rows[i][0]);
        if (domain && Object.keys(domain).length != 0) {
            const newRow = generateEmailFormats(rows[i], domain);
            processedRows.push(newRow);
        } else {
            unProcessedRows.push(rows[i]);
        }
    }
    
    return {processedRows, unProcessedRows};
}

function generateEmailFormats(row, domainInfo) {
    for(let j = 1; j < 4; j++) {
        email = null;
        const format = domainInfo[`format${j}`]
        const domain = domainInfo.domain;
        if(format != null) {
            if (format == 'F' || format == 'FN') {
                email = row[2] + '@' + domain
            } else if (format == 'FDotL' || format == 'FN.LN') {
                email = row[2] + '.' + row[4] + '@' + domain
            } else if (format == 'FIL' || format == 'FILN') {
                email = row[2][0] + row[4] + '@' + domain
            } else if (format == 'FIDotL' || format ==  'FI.LN') {
                email = row[2][0] + '.' + row[4] + '@' + domain
            } else if (format == 'L' || format == 'LN') {
                email = row[4] + '@' + domain
            } else if (format == 'F_L' || format == 'FN_LN') {
                email = row[2] + '_' + row[4] + '@' + domain
            } else if (format == 'LDotF') {
                email = row[4] + '.' + row[2] + '@' + domain
            } else if (format == 'FILI') {
                email = row[2][0] + row[4][0] + '@' + domain
            } else if (format == 'LIF') {
                email = row[4][0] + row[2] + '@' + domain
            } else if (format == 'L_F' || format == 'LN_FN' ) {
                email = row[4] + '_' + row[2] + '@' + domain
            } else if (format == 'FL' || format == 'FNLN') {
                email = row[2] + row[4] + '@' + domain
            } else if (format == 'FLI' || format == 'FNLI') {
                email = row[2] + row[4][0] + '@' + domain
            } else if (format == 'LFI' || format == 'LNFI') {
                email = row[4] + row[2][0] + '@' + domain
            } else if (format == 'FDotLI' || format == 'FN.LI') {
                email = row[2] + '.' + row[4][0] + '@' + domain
            } else if (format == 'FIDotLI') {
                email = row[2][0] + '.' + row[4][0] + '@' + domain
            } else if (format == 'LIDotFI') {
                email = row[4][0] + '.' + row[2][0] + '@' + domain
            } else if (format == 'FHpynenL' || format == 'FN-LN') {
                email = row[2] + '-' + row[4] + '@' + domain
            } else if (format == 'LHpynenF' || format == 'LN-FN') {
                email = row[4] + '-' + row[2] + '@' + domain
            } else if (format == 'LF') {
                email = row[4] + row[2] + '@' + domain
            } else if (format == 'FIUnderL' || format == 'FI_LN') {
                email = row[2][0] + '_' + row[4] + '@' + domain
            } else if (format == 'LIUnderF') {
                email = row[4][0] + '_' + row[2] + '@' + domain
            } else if (format == 'LN_FI') {
                email = row[4] + '_' + row[2][0] + '@' + domain
            } else if (format == 'FI-L') {
                email = row[2][0] + '_' + row[4] + '@' + domain
            } else if (format == 'FIHpynenL') {
                email =  row[2][0] + '-' + row[4] + '@' + domain
            } else if (format == 'L_FI') {
                email =  row[4] + '_' + row[2][0] + '@' + domain
            } else if (format == 'F_LI') {
                email =  row[2] + '_' + row[4][0] + '@' + domain
            } else if (format == 'LDotFI') {
                email =  row[4] + '.' + row[2][0] + '@' + domain
            }
        }
        row[9 + j] = email;
    }
    return row;
}

async function insertFileData (rows, fileContentType) {
    const dbConn = await mysql.createConnection(config.database);
    if(fileContentType === 'customer') {
        const [resultRows, fields] = await dbConn.query('INSERT INTO customer_info (company_name, lead_full_name, lead_first_name, lead_middle_name, lead_last_name, designation, industry, city, country, course, email_1, email_2, email_3) VALUES ?', [rows], true);
        return resultRows;
    } else {
        const [resultRows, fields] = await dbConn.query('INSERT INTO domain_info (company_name, domain, format1, format2, format3) VALUES ?', [rows], true);
        return resultRows;
    }
    
}

function validateFile(headerRow, fileContentType) {
    if(fileContentType === 'customer' && headerRow.length === 10) {
        return true;
    } else if(fileContentType === 'domain' && headerRow.length === 5) {
        return true;
    } else {
        return false;
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