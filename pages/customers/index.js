
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import RedirectButton from '../../components/RedirectButton';
import { index, destroy } from '../../service/api/customer';
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
                <RedirectButton route="/customer/add" label="Add customer" icon="pi pi-plus" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {

        return (
            <React.Fragment>
                {/*<RedirectButton route={"/category1/"+rowData.id} icon="pi pi-pencil" rounded outlined className="mr-2" />*/}
                <Button icon="pi pi-pencil" rounded outlined  onClick={() => setEditId(rowData._id)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
            </React.Fragment>
        );
    };
    const fullName = (rowData) => {
       return `${rowData.firstName} ${rowData.lastName?rowData.lastName:""}`
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
                            <Column header="Name" body={fullName} ></Column>
                            <Column field="email" header="Email"></Column>
                            <Column field="phone" header="Phone"></Column>
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
    return { pageTitle:{url:'/customer',name:"Customer Page"} };
};

export default List;
