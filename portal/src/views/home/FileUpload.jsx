import React, { useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTableComponent from "../../common/BootstrapTableComponent";
import authHeader from '../../common/authHeader';
import ViewCustomerList from "./ViewCustomerList";
import columns from "../../common/table-config";
import './Home.css'
 
export default function FileUpload(){

    const [fileContentType, setFileContentType] = useState("customer");
    const tableColumns = columns.slice(0, -3);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [unProcessedRows, setUnProcessedRows] = useState([]);
 
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };
    
    const processReposnse = (unProcessedRows) => {
        let fields = tableColumns.map(a=> a['dataField']);
        const unProcessedObj = [];
        for(let i = 0; i <unProcessedRows.length; i++ ) {
            const res = {}
            for(let j = 0; j < fields.length; j++){
                res[fields[j]] = unProcessedRows[i][j]
            }
            unProcessedObj.push(res);
        }
         
        console.log("unProcessedObj : ", unProcessedObj)
        setUnProcessedRows(unProcessedObj);
    }

    const uploadFile = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("fileContentType", fileContentType)

        const defaultHeaders = authHeader();

        try {
            axios({
                method: "post",
                url: "http://localhost:8080/api/fileUpload",
                data: formData,
                headers: { ...defaultHeaders, "Content-Type": "multipart/form-data" },
            })
            .then(function ({data}) {
                //handle success
                console.log("file upload api response : ", data);
                if (!data.error && data.unProcessedRows && data.unProcessedRows.length > 0) {
                    processReposnse(data.unProcessedRows);
                }
            })
            .catch(function (err) {
                //handle error
                console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
    };
 
      return (
        <div className="App">
            <div className="radio-btn-container">
                <div
                className="radio-btn"
                onClick={() => {
                    setFileContentType("customer");
                }}
                >
                    <input
                        type="radio"
                        value={fileContentType}
                        name="fileContentType"
                        checked={fileContentType === "customer"}
                    />
                    Customer Information
                </div>
                <div
                className="radio-btn"
                onClick={() => {
                    setFileContentType("domain");
                }}
                >
                    <input
                        type="radio"
                        value={fileContentType}
                        name="fileContentType"
                        checked={fileContentType === "domain"}
                    />
                    Domain List
                </div>
            </div>
            <div>
                <input type="file" onChange={saveFile} />
                <button onClick={uploadFile}>Upload</button>
            </div>
            {unProcessedRows.length > 0 && 
                <BootstrapTableComponent columns={tableColumns} data={unProcessedRows} pageSize={5} showSearch={false} />
            }
        </div>
      );
}
 