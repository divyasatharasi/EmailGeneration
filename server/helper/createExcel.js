const excel = require("exceljs");

let workbook = new excel.Workbook();
let worksheet = workbook.addWorksheet("Tutorials");

function generateExcel (rows, request, response) {
    worksheet.columns = [
        { header: 'Company', key: 'company_name' },
        { header: 'Lead Full Name', key: 'lead_full_name' },
        { header: 'Lead First Name', key: 'lead_first_name' },
        { header: 'Lead Middle Name', key: 'lead_middle_name' },
        { header: 'Lead Last Name', key: 'lead_last_name' },
        { header: 'Designation', key: 'designation' },
        { header: 'Industry', key: 'industry' },
        { header: 'City', key: 'city' },
        { header: 'Country', key: 'country' },
        { header: 'Course', key: 'course' }
    ];
    
    // Add Array Rows
    worksheet.addRows(rows);
    
    return workbook.xlsx.write(response).then(function () {
      response.status(200).end();
    });
}

module.exports = {
    generateExcel,
};
