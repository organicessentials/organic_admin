import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { deleteComments, showComments, updateComments } from '../../service/api/review';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

export default function index() {
    const [products, setProducts] = useState([]);
    console.log(products);
    const [statuses] = useState(['Approve', 'Proccessing']);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [record,setRecord] = useState("")
    const toast = useRef(null);
    useEffect(() => {
        getData()
    }, []); 

    const getData=()=> {
        showComments().then((data) => setProducts(data));
    }

    const getSeverity = (value) => {
        switch (value) {
            case 'Approve':
                return 'success';

            case 'Proccessing':
                return 'warning';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;
        _products[index] = newData;
        console.log(newData);
        updateComments(newData)
        setProducts(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)}  />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag onClick={()=>approve(rowData)} value={rowData.status} severity={getSeverity(rowData.status)}></Tag>;
    };

    const approve = (data) => {
        let updataData = {
            id:data.id,
            status:"approve",
        }
        updateComments(updataData).then((res)=>{
            getData()
        })
    }
    const reject = (data) => {
        let updataData = {
            id:data.id,
            status:"processing",
        }
        updateComments(updataData).then((res)=>{
            getData()
        })
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.review} readOnly cancel={false} />;
    };
    const deleteAction = () => {
        if (record) {
          console.log(record);
          deleteComments(record.id).then((data)=>getData())
          setDeleteDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Record Deleted",
            life: 3000,
          });
        }
    };

    const deleteDialogFooter = (
        <React.Fragment>
          <Button
            label="No"
            icon="pi pi-times"
            outlined
            onClick={() => setDeleteDialog(false)}
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            severity="danger"
            onClick={deleteAction}
          />
        </React.Fragment>
    );


    const deleteBodyTemplate = (rowData)=> {
        return <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDelete(rowData)}
      />
    }

    const confirmDelete = (record) => {
        setRecord(record)
        setDeleteDialog(true);
    };

    const buttonApprove = (data) => {
          return <>
          {data.status==="processing"?
            <Button severity="success"  onClick={()=>approve(data)}>Approve</Button>:
            <Button severity="danger" onClick={()=>reject(data)} >Reject</Button>}
          </>
    }
    

    return (
        <div className="card p-fluid">
        <Toast ref={toast} />
            <DataTable value={products} paginator rows={10} dataKey="id" editMode="row"  onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name"  style={{ width: '10%' }}></Column>
                <Column field="email" header="Email Id"  style={{ width: '20%' }}></Column>
                <Column field="productName" header="ProductName" style={{ width: '30%' }}></Column>
                <Column field="comment" header="Comment" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="review" header="Review" body={ratingBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="status" header="Status" body={statusBodyTemplate}  style={{ width: '20%' }}></Column>
                <Column field="" header="Select Status" body={buttonApprove}   style={{ width: '20%' }}></Column>
                <Column header="Edit" rowEditor headerStyle={{ width: '10%' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column header="Delete" body={deleteBodyTemplate}   style={{ width: '10%' }}></Column>
            </DataTable>
            <Dialog
                visible={deleteDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialog(false)}
              >
                <div className="confirmation-content">
                  <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                  />
                  <span>Are you sure you want to delete?</span>
                </div>
              </Dialog>
        </div>
    );
}

index.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle: { url: "/reviews", name: "Reviews Page" } };
};
  
