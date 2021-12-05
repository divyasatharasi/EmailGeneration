import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import './Home.css'


function ViewCustomerList() {

    const [customerList, setCustomerList] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [sortByColumn, setSortByColumn] = useState([{ dataField: 'company_name', sort: 'asc' }]);

    useEffect(() => {
        console.log("view customer list useeffect called");
        getCustomerList();
    }, []);

    const getCustomerList = () => {
        axios.get("http://localhost:8080/api/customerList", {headers: authHeader()})
        .then((response) => {
            console.log("customerList response data : ", response.data.data)
            setCustomerList(response.data.data);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const columns = [
        {
            text: 'Company',
            dataField: 'company_name',
            sort: true
        },
        {
            text: 'Lead Full Name',
            dataField: 'lead_full_name',
            sort: true
        },
        {
            text: 'Lead First Name',
            dataField: 'lead_first_name',
            sort: true
        },
        {
            text: 'Lead Middle Name',
            dataField: 'lead_middle_name',
        },
        {
            text: 'Lead Last Name',
            dataField: 'lead_last_name',
        },
        {
            text: 'Designation',
            dataField: 'designation',
            sort: true
        },
        {
            text: 'Industry',
            dataField: 'industry',
            sort: true
        },
        {
            text: 'City',
            dataField: 'city',
            sort: true
        },
        {
            text: 'Country',
            dataField: 'country',
            sort: true
        },
        {
            text: 'Course',
            dataField: 'course',
            sort: true
        },
        {
            text: 'Email 1',
            dataField: 'email_1',
            classes: 'email-cell'
        },
        {
            text: 'Email 2',
            dataField: 'email_2',
            classes: 'email-cell'
        },
        {
            text: 'Email 3',
            dataField: 'email_3',
            classes: 'email-cell'
        }
    ];
    console.log("customer list : ", customerList)
    return (
        <>
            <BootstrapTableComponent columns={columns} data={customerList} pageSize={pageSize} sortByColumn={sortByColumn} />
        </>
    )
}

export default ViewCustomerList;