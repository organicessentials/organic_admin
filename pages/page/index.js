
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import RedirectButton from '../../components/RedirectButton';
import { index, destroy } from '../../service/api/page';
import { Dialog } from 'primereact/dialog';
import {Tag} from "primereact/tag";

const List =() => {
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState([]);
    const toast = useRef(null);
    console.log(records);

    useEffect(() => {
        getData();
    }, []);

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
                <RedirectButton route="/page/add" label="Add Page" icon="pi pi-plus" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <RedirectButton route={"/page/"+rowData._id} icon="pi pi-pencil" rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={rowData.status} />;
    };
    return (
        <>
            <Toast ref={toast} />
            <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
            <DataTable showGridlines value={records} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                {/*<DataTable value={products} tableStyle={{ minWidth: '50rem' }}>*/}
                <Column field="slug" header="Slug"></Column>
                <Column field="name" header="Title"></Column>
                <Column field="status" header="Status" body={statusBodyTemplate} ></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
            <Dialog visible={deleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        <span>
                            Are you sure you want to delete?
                        </span>
                </div>
            </Dialog>

        </>
    );
}
List.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle:{url:'/page',name:"Page"} };
};

export default List;
