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
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
 
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };
    
    const resetFormFields = () => {
        setFile();
        setFileName('');
        setErrorMessage('')
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
        if (file) {
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
                        resetFormFields();
                        setSuccessMessage(data.message)
                        processReposnse(data.unProcessedRows);
                    } else {
                        setSuccessMessage('')
                        setErrorMessage(data.message)

                    }
                })
                .catch(function (err) {
                    //handle error
                    console.log(err);
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            setErrorMessage("Please select a file to upload.")
        }
    };
 
      return (
        <div className="file-upload">
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
                <input type="file" className='file-style' onChange={saveFile} />
                <button type="button" className='btn btn-primary' onClick={uploadFile}>Upload</button>
            </div>
            {errorMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "red"}}>{errorMessage}</p></div>}
            {successMessage && <div  style={{"width": "100vh", "justifyContent": "center"}} className="registration-fields"><p style={{"color": "green"}}>{successMessage}</p></div>}
            {unProcessedRows.length > 0 && 
                <BootstrapTableComponent columns={tableColumns} data={unProcessedRows} pageSize={5} showSearch={false} />
            }
        </div>
      );
}
 