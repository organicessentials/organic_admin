
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import RedirectButton from '../../../components/RedirectButton';
import { index, destroy } from '../../../service/api/post-category';
import { Dialog } from 'primereact/dialog';

const List =() => {
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState([]);
    const toast = useRef(null);

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
            destroy(record.id).then(data => getData())
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
                <RedirectButton route="/post/category/add" label="Add Category" icon="pi pi-plus" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <RedirectButton route={"/post/category1/"+rowData.id} icon="pi pi-pencil" rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
            </React.Fragment>
        );
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <Toast ref={toast} />
            <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
            <DataTable showGridlines value={records} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                {/*<DataTable value={products} tableStyle={{ minWidth: '50rem' }}>*/}
                <Column field="slug" header="Slug"></Column>
                <Column field="name" header="Title"></Column>
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
    return { pageTitle:{url:'/post/category',name:"Post Category"} };
};

export default List;
