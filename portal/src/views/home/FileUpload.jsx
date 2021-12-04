import React, { useState } from 'react'
import axios from 'axios';
import authHeader from '../../common/authHeader';
import './Home.css'
 
export default function FileUpload(){

    const [fileContentType, setFileContentType] = useState("customer");
 
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
 
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };
    
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
            .then(function (response) {
                //handle success
                console.log("file upload api response : ", response)
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
        } catch (ex) {
            console.log(ex);
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
                        checked={fileContentType == "customer"}
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
                        checked={fileContentType == "domain"}
                    />
                    Domain List
                </div>
            </div>
            <div>
                <input type="file" onChange={saveFile} />
                <button onClick={uploadFile}>Upload</button>
          </div>
        </div>
      );
}
 