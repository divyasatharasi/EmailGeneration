import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import tableConfig from '../../common/table-config.json';
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

    return (
        <>
            <BootstrapTableComponent columns={tableConfig.columns} data={customerList} pageSize={pageSize} sortByColumn={sortByColumn} />
        </>
    )
}

export default ViewCustomerList;