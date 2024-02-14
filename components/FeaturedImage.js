import { Card } from 'primereact/card';
import React, {useEffect, useState} from "react";
import { Toast } from 'primereact/toast';
import { FileUpload} from 'primereact/fileupload';
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {ProgressBar} from "primereact/progressbar";
import config from "../service/config"
const { baseApiURL } = config;

const FeaturedImage = ({handleUpload,toast , oldImage, setOldImage}) => {
    let [oldImageF, setOldImageF] = useState( null);

    const [selectedFile, setselectedFile] = useState(null);
    const onTemplateSelect = (e) => {
        let files = e.files;
        let newFile =null;
        Object.keys(files).forEach((key) => {
            const fileSize=files[key].size || 0;
            if(fileSize){
                newFile=files[key];
            }
        });
     setselectedFile(newFile);

    };
    const onTemplateRemove = (file, callback) => {
        setselectedFile(null)
        callback();
    };

    const onOldFileRemove = () => {
        setOldImageF(null)
        setOldImage(null)
    };
    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
            </div>
        );
    };
    const onTemplateClear = () => {
        setselectedFile(null);
    };
    useEffect(() => {
        handleUpload(selectedFile,oldImageF);

    },[selectedFile]);
    useEffect(() => {
        setOldImageF(oldImage);
        console.log(oldImageF,'oldImageF');

    },[oldImage]);
    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '60%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={150}  />
                </div>
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)}
                        style={{width: "20px",height: "20px",marginRight:"-20px"}}
                />
            </div>
        );
    };
    const itemEmptyTemplate = () => {
        return (
           <>
               {
                   !selectedFile  && oldImageF ? (
                       <div className="flex align-items-center flex-wrap">
                           <div className="flex align-items-center" style={{ width: '60%' }}>
                               <img alt={oldImageF.title} role="presentation" src={baseApiURL+oldImageF.url} width={150}  />
                           </div>
                           <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() =>onOldFileRemove()}
                                   style={{width: "20px",height: "20px",marginRight:"-20px"}}
                           />
                       </div>
                   ):'Drag and Drop Image Here'

               }
           </>
        );
    };
    return (
        <Card title="Featured Image" className="card">
            <Toast ref={toast}></Toast>
            <FileUpload  name="imageuploader" accept="image/*" maxFileSize={1000000} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}  itemTemplate={itemTemplate}  headerTemplate={headerTemplate} emptyTemplate={itemEmptyTemplate}/>

        </Card>

    );
};

export default FeaturedImage;
