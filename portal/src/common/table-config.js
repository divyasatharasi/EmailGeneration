const columns = [
    {
        "text": "Company",
        "dataField": "company_name",
        "sort": true
    },
    {
        "text": "Lead Full Name",
        "dataField": "lead_full_name",
        "sort": true
    },
    {
        "text": "Lead First Name",
        "dataField": "lead_first_name",
        "sort": true
    },
    {
        "text": "Lead Middle Name",
        "dataField": "lead_middle_name"
    },
    {
        "text": "Lead Last Name",
        "dataField": "lead_last_name"
    },
    {
        "text": "Designation",
        "dataField": "designation",
        "sort": true
    },
    {
        "text": "Industry",
        "dataField": "industry",
        "sort": true
    },
    {
        "text": "City",
        "dataField": "city",
        "sort": true
    },
    {
        "text": "Country",
        "dataField": "country",
        "sort": true
    },
    {
        "text": "Course",
        "dataField": "course",
        "sort": true
    },
    {
        "text": "Email 1",
        "dataField": "email_1",
        "headerStyle": (colum, colIndex) => {
            return { width: '400px', textAlign: 'center' };
        }
    },
    {
        "text": "Email 2",
        "dataField": "email_2",
        "headerStyle": (colum, colIndex) => {
            return { width: '400px', textAlign: 'center' };
        }
    },
    {
        "text": "Email 3",
        "dataField": "email_3",
        "headerStyle": (colum, colIndex) => {
            return { width: '400px', textAlign: 'center' };
        }
    }
];

export default columns;