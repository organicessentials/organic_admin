import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import {
  creativeIdData,
  creativeIdDelete,
  multiCreativeDelete,
  multiStatusUpdate,
  show,
} from "../../service/api/creative";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
const status = ["Active", "Inactive"];
const index = () => {
  const toast = useRef(null);
  const [creatives, setCreatives] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectStatus,setSelectStatus] = useState('')
  const [count, setCount] = useState([]);
  const router = useRouter();
  const [record, setRecord] = useState("");
  const [message,setMessage] = useState("")
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true)
    show(message).then((result) => {
      setCreatives(result.data);
      setCount(result);
      setLoading(false)
    });
  };
  useEffect(() => {
    getData();
  }, [message]);

  const productImageTemplate = (rowData) => {
    return (
      <>
        {rowData.image ? (
          <img
            src={rowData.image}
            className="w-6rem shadow-2 border-round"
            alt="Product Image Default"
          />
        ) : (
          <img
            src="/product/default.jpg"
            className="w-6rem shadow-2 border-round"
            alt="Product Image Default"
          />
        )}
      </>
    );
  };

  const formatId = (id) => {
    return <p>{id.substring(0, 6)}</p>;
  };

  const deleteAction = (rowData) => {
    setDeleteDialog(true);
    setRecord(rowData);
  };

  const confirmDelete = () => {
    const ids = selectedRecords.map((doc) => doc._id);
    if (ids.length > 0) {
      multiCreativeDelete({ ids })
        .then((data) => {
          setDeleteDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Record Deleted",
            life: 3000,
          });
          getData();
        })
        .catch((err) => {
         console.log(err);
        });
    } else {
      creativeIdDelete(record._id)
        .then((data) => {
          setDeleteDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Record Deleted",
            life: 3000,
          });
          getData();
        })
        .catch((err) => {
          console.log(err);
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
        onClick={confirmDelete}
      />
    </React.Fragment>
  );

  const editCreatves = (rowData) => {
    console.log(rowData);
    router.push(`/creatives/${rowData._id}`);
  };

  const bodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => editCreatves(rowData)}
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => deleteAction(rowData)}
        />
      </React.Fragment>
    );
  };

  const newCreatives = () => {
    router.push("/creatives/add");
  };

  const applyMultiStatus = () => {
    setLoading(true)
    const ids = selectedRecords.map((doc) => doc._id);
    multiStatusUpdate({ids,selectStatus}).then((data)=>{
      getData()
      setLoading(false)
    }).catch((error)=>{
      console.log(error);
    })
  }

  const multipleDelete = () => {
    setDeleteDialog(true);

  }
  console.log(selectedRecords);
  //multiCreativeDelete

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={()=>setMessage("")}
          label={`all${creatives.length ? `(${creatives.length})` : ""}`}
          link
        />
        <Button
         onClick={()=>setMessage("Active")}
          label={`Active${
            count.active?.length ? `(${count.active?.length})` : ""
          }`}
          link
        />
        <Button
         onClick={()=>setMessage("Inactive")}
          label={`Inactive${
            count.inActive?.length ? `(${count.inActive?.length})` : ""
          }`}
          link
        />

        <Button onClick={multipleDelete} link label="Delete" icon="pi pi-trash" severity="danger" />

        <Dropdown
          name="status"
          options={status}
          value={selectStatus}
          onChange={(e)=>setSelectStatus(e.target.value)}
          placeholder="Change Status"
          className="w-full md:w-14rem"
        />
        <Button onClick={applyMultiStatus}>Apply</Button>
      </div>
      {/* <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          
          placeholder="Search..."
        />
      </span> */}
      <Button onClick={newCreatives}>Add New</Button>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={creatives}
        stripedRows
        selection={selectedRecords}
        loading={loading}
        selectionMode="multiple"
        onSelectionChange={(e) => setSelectedRecords(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        header={header}
      >
        <Column selectionMode="multiple" exportable={false}></Column>
        <Column field="name" header="Name"></Column>
        <Column body={(rowData) => formatId(rowData._id)} header="ID"></Column>
        {/* <Column field="type" header="Type"></Column> */}
        <Column field="url" header="URL"></Column>
        <Column field="category" header="Categories"></Column>
        <Column field="status" header="Status"></Column>
        <Column body={productImageTemplate} header="Preview"></Column>
        <Column body={bodyTemplate} exportable={false}></Column>
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
    </>
  );
};

index.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/creatives", name: "Creatives Page" } };
};

export default index;
