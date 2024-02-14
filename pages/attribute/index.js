
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import RedirectButton from '../../components/RedirectButton';
import { index, destroy } from '../../service/api/attribute';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import Add from './add';
import Update from "./update";
const List =() => {
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState([]);
    const toast = useRef(null);
    const [editId, setEditId] = useState(null);

    const getData=() => {
        index().then(data => setRecords(data));
    }

    const [deleteDialog, setDeleteDialog] = useState(false);
    const confirmDelete = (record) => {
        setRecord(record);
        setDeleteDialog(true);
    };
    const deleteAction = () => {
        if(record){
            destroy(record._id).then(data => getData())
            setDeleteDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
        }
    };
    const editAction = (data) => {
    };

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteAction} />
        </React.Fragment>
    );

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/attribute/add" label="Add Attribute" icon="pi pi-plus" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined  onClick={() => setEditId(rowData._id)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
            </React.Fragment>
        );
    };
    const attributeValueTemplate = (rowData) => {
        console.log(rowData);
        return (
            <React.Fragment>
                {
                    rowData.AttributeValues &&  rowData.AttributeValues.map(function(item, i){
                        return <li key={i}>{item.val}</li>
                    })
                }
                <a href={'/attribute/'+rowData._id}>Configure Attribute Values</a>
            </React.Fragment>
        );
    };
    useEffect(() => {
        getData();
    },[]);
    return (
        <div className="mt-8">
            <Toast ref={toast}  />
            {/*<Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>*/}

            <div >
                <div className="grid">
                    <div className="col-4">
                        {editId ? <Update id={editId} setEditId={setEditId} updated={getData}  toast={toast}/> : <Add added={getData} toast={toast}/>}
                    </div>
                    <div>
                        <Divider layout="vertical">
                        </Divider>
                    </div>
                    <div className="col-7">
                        <DataTable stripedRows value={records} paginator rows={10} tableStyle={{ minWidth: '20rem' }}>
                            {/*<DataTable value={products} tableStyle={{ minWidth: '50rem' }}>*/}
                            <Column field="name" header="Name"></Column>
                            <Column body={attributeValueTemplate} header="Attribute Values"></Column>

                            <Column body={actionBodyTemplate} exportable={false}></Column>
                        </DataTable>
                        <Dialog visible={deleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>
                            Are you sure you want to delete?
                        </span>
                            </div>
                        </Dialog>

                    </div>

                </div>

            </div>

        </div>
    );
}
List.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle:{url:'/attribute',name:"Attribute Page"} };
};

export default List;
