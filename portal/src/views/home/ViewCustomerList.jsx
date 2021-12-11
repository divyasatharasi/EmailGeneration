import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import columns from '../../common/table-config';
import './Home.css'

const PAGE_SIZE = [100, 500, 1000, 2000];

function ViewCustomerList() {
    const [customerList, setCustomerList] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [sortByColumn, setSortByColumn] = useState([{ dataField: 'company_name', sort: 'asc' }]);

    useEffect(() => {
        getCustomerList();
    }, []);

    const getCustomerList = () => {
        axios.get("http://localhost:8080/api/customerList", {headers: authHeader()})
        .then((response) => {
            setCustomerList(response.data.data);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <BootstrapTableComponent columns={columns} data={customerList} pageSize={PAGE_SIZE} sortByColumn={sortByColumn} />
        </>
    )
}

export default ViewCustomerList;