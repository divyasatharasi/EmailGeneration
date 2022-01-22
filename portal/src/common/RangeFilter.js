import React, {useRef} from "react";

export default function RangeFilter(props) {
    const fromDate = useRef(null);
    const toDate = useRef(null);

    const handleFilterClick = () => {
        props.getFilteredData(fromDate.current.value, toDate.current.value);
    }

    const handleClear = () => {
        props.getCustomerList();
    }

    return (
        <div className="rangeFilter">
            From : <input ref={fromDate} type="date" className="filter" /> {" "}
            To: <input ref={toDate} type="date" className="filter" />
            <button type="button" value="Filter" onClick={handleFilterClick}>Filter</button>
            <button type="button" value="Filter" onClick={handleClear}>Clear</button>
        </div>
    );
};


