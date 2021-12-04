import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';

import './table-style.css';

const { SearchBar, ClearSearchButton } = Search;

function BootstrapTableComponent({ columns, data, pageSize, sortByColumn }) {
    const pagination = paginationFactory({
        page: 2,
        sizePerPage: pageSize,
        lastPageText: '>>',
        firstPageText: '<<',
        nextPageText: '>',
        prePageText: '<',
        showTotal: true,
        alwaysShowAllBtns: true,
        onPageChange: function (page, sizePerPage) {
          console.log('page', page);
          console.log('sizePerPage', sizePerPage);
        },
        onSizePerPageChange: function (page, sizePerPage) {
          console.log('page', page);
          console.log('sizePerPage', sizePerPage);
        }
      });

      const DataExportCSV = (props) => {
        const handleClick = () => {
          props.onExport();
        };
        return (
          <div>
            <button className="btn btn-success" onClick={handleClick}>Export to CSV</button>
          </div>
        );
      };
      
    return (
        <ToolkitProvider
        bootstrap4
        keyField='id'
        data={data}
        columns={columns}
        search
        exportCSV
      >
        {
          props => (
            <div>
                <div className="table-options">
                    <div className="table-search">
                        <SearchBar style={{right: 0}} srText="" {...props.searchProps} />
                        <ClearSearchButton {...props.searchProps} />
                    </div>
                    <div className="table-export">
                        <DataExportCSV {...props.csvProps} />
                    </div>
                </div>
                <hr />
                <BootstrapTable
                    pagination={pagination}
                    defaultSorted={sortByColumn}
                    {...props.baseProps}
                />
            </div>
          )
        }
      </ToolkitProvider>
    )
}

export default BootstrapTableComponent;