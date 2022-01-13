import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import columns from '../../common/table-config';
import { dateFilter, Comparator } from 'react-bootstrap-table2-filter';
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

    const formatDate = (yyyyMMdd) => {
        const arrDate = yyyyMMdd.split('-');
        const ddMMyyyy = arrDate[2] + '-' +arrDate[1] + '-' + arrDate[0];
        return ddMMyyyy;
    }

    const date_filter = dateFilter({
        delay: 600,  // how long will trigger filtering after user typing, default is 500 ms
        withoutEmptyComparatorOption: true,  // dont render empty option for comparator
        comparators: [Comparator.EQ],  // Custom the comparators
        style: { display: 'inline-grid' },  // custom the style on date filter
        className: 'custom-dateFilter-class',  // custom the class on date filter
        comparatorStyle: { backgroundColor: 'antiquewhite', display: 'none' }, // custom the style on comparator select
        comparatorClassName: 'custom-comparator-class',  // custom the class on comparator select
        dateStyle: { backgroundColor: 'cadetblue', margin: '0px' },  // custom the style on date input
        dateClassName: 'custom-date-class',  // custom the class on date input
        // defaultValue: { date: new Date(), comparator: Comparator.EQ },  // default value
        id: 'created_date', // assign a unique value for htmlFor attribute, it's useful when you have same dataField across multiple table in one page
    });

    const allColumns = [ {
        dataField: 'created_date',
        text: 'Created on',
        formatter: (cell) => {
            return <>{formatDate(cell.substr(0, 10))}</>
        },
        filter: date_filter
    }, ...columns];

    return (
        <> 
            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
            <BootstrapTableComponent columns={allColumns} data={customerList} pageSize={PAGE_SIZE} sortByColumn={sortByColumn} />
        </>
    )
}

export default ViewCustomerList;