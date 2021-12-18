import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import columns from '../../common/table-config';
import './Home.css'

const PAGE_SIZE = [100, 500, 1000, 2000];

function ViewCustomerList() {
    const [errorMessage, setErrorMessage] = useState('');
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
        .catch(({response}) => {
            if (response && response.data) {
                setErrorMessage(response.data.message)
            } else {
                setErrorMessage("Something went wrong!")
            }
        })
    }

    return (
        <> 
            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
            <BootstrapTableComponent columns={columns} data={customerList} pageSize={PAGE_SIZE} sortByColumn={sortByColumn} />
        </>
    )
}

export default ViewCustomerList;