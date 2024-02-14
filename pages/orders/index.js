import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import {
  index,
  destroy,
  multiDestroy,
  updateStatusAdmin,
  showUser,
  sendNotification,
  exportOrder,
  importOrderId,
} from "../../service/api/orders";
import { useRouter } from "next/router";

export default function List() {

  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [statusChange, setStatusChange] = useState("");
  const [record, setRecord] = useState("");
  const [message, setMessage] = useState("");
  const [dates, setDates] = useState(null);
  const [user,setUser] = useState([])
  const inputRef = useRef(null);

  useEffect(() => {
    getData(message);
  }, [message, globalFilter]);

  const getData = (message, userName) => {
    setLoading(true);
    index(message, userName,dates)
      .then((response) => {
        if (globalFilter) {
          const filteredRecords = response?.orders?.filter((record) =>
            record.userName.toLowerCase().startsWith(globalFilter.toLowerCase())
          );
          setCount(response);
          setOrder(filteredRecords);
          setLoading(false);
        } else {
          setOrder(response.orders);
          setCount(response);
          
        }
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  };
  

  const getSeverity = (rowData) => {
    console.log(rowData);
    switch (rowData.orderStatus) {
        case 'Completed':
            return 'success';

        case 'Pending Payment':
            return 'warning';

        case 'Cancelled':
            return 'danger';

        default:
            return null;
    }
  };
  
  
  useEffect(() => {
    showUser().then((res)=>{
      setUser(res)
    }).catch((error)=>{
      console.log(error);
    })
  }, [])
  
  const addOrder = () => {
    router.push(`/orders/add`);
  }

  const apply = async () => {
    try {
      const ids = selectedRecords.map((doc) => doc._id);
      let orderStatus = statusChange.name;
      await updateStatusAdmin({ ids, orderStatus });
      setSelectedRecords([]);
      await getData();
      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setLoading(false);
    }
  };

  const status = [
    { name: "Processing" },
    { name: "On Hold" },
    { name: "Completed" },
    { name: "Cancelled" },
    { name: "Failed" },
    { name: "Refunded" },
    { name: "Pending Payment" },
  ];

  const confirmDeleteSelected = () => {
    setDeleteDialog(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    console.log(file);
    if (!file) {
      return toast.current.show({
        severity: "error",
        summary: "error",
        detail: "file not selected",
        life: 3000,
      });
    }
    const formdata = new FormData();
    formdata.append("file", file);
    importOrderId(formdata).then((data) => getData());
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Order Id Updated",
      life: 3000,
    });
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const exportSelectedData = async () => {
    try {
      if (selectedRecords.length === 0) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No Order selected",
          life: 3000,
        });
      } else {
        const data = selectedRecords.map((doc) => doc._id);
        const response = await exportOrder(data);
        const csvData =
          typeof response === "string" ? response : JSON.stringify(response);
        const blob = new Blob([csvData], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "orders.csv"; // Set the filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No Order selected for deletion",
        life: 3000,
      });
    }
  };

  const notification = (rowData) => {
    const data = user.filter((doc)=>doc._id===rowData.userId)
    let email = data[0].email
    let name = rowData.orderStatus
      sendNotification({name,email}).then((res)=>{
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Notification Send",
          life: 3000,
        });
      }).catch((err)=>{
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "wrong email Id",
          life: 3000,
        });
      })
      
  };

  

  const deleteAction = () => {
    if (selectedRecords?.length === 0 && !record) {
      // Neither single record nor multiple records selected for deletion
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No Order selected",
        life: 3000,
      });
    } else {
      if (selectedRecords?.length > 0) {
        // Multiple products selected for deletion
        const data = selectedRecords.map((doc) => doc._id);
        multiDestroy(data)
          .then(() => {
            getData();
            setLoading(false);
            setDeleteDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Selected Orders deleted",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error deleting selected Orders:", error);
          });
      }

      if (record) {
        // Single record selected for deletion
        destroy(record?._id)
          .then(() => {
            getData();
            setLoading(false);
            setDeleteDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Record Deleted",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error deleting record:", error);
          });
      }
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

  const confirmDelete = (rowData) => {
    setRecord(rowData);
    setDeleteDialog(true);
  };

  const NotifyBodyTemplate = (rowData) => {
    return (
      <>
        {rowData ? (
          <Button
            onClick={() => notification(rowData)}
            label="Notify"
          />
        ) : null}
      </>
    );
  };

  const actionBodyTotal = (rowData) => {
    return <>{rowData ? rowData.totalPrice : null}</>;
  };

  const actionBodyStatus = (rowData) => {
    return <Tag value={rowData ? rowData.orderStatus : null} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => editOrder(rowData)}
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
        />
        <Button
          onClick={() => confirmDelete(rowData)}
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
        />
      </React.Fragment>
    );
  };

  const editOrder = (rowData) => {
    router.push(`/orders/${rowData?._id}`);
  };


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setMessage("")}
          link
          label={`All${count.total ? `(${count.total})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Pending Payment")}
          link
          label={`Pending Payment${count.pending ? `(${count.pending})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Processing")}
          link
          label={`Processing${count.processing ? `(${count.processing})` : ""}`}
        />
        <Button
          onClick={() => setMessage("On Hold")}
          link
          label={`On Hold${count.hold ? `(${count.hold})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Completed")}
          link
          label={`Completed${count.completed ? `(${count.completed})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Cancelled")}
          link
          label={`Cancelled${count.cancelled ? `(${count.cancelled})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Refunded")}
          link
          label={`Refunded${count.refunded ? `(${count.refunded})` : ""}`}
        />
        <Button
          onClick={() => setMessage("Failed")}
          link
          label={`Failed${count.failed ? `(${count.failed})` : ""}`}
        />
        <Button
          link
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
        />
        <input
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
        />
        <Button link onClick={handleClick} label="Import" icon="pi pi-plus" />
        <Button
          onClick={exportSelectedData}
          link
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
        />
        <Dropdown
          value={statusChange}
          onChange={(e) => setStatusChange(e.value)}
          options={status}
          optionLabel="name"
          placeholder="Change Status"
          className="w-full md:w-14rem"
        />
        <Button onClick={apply}>Apply</Button>
        {/* <Calendar
          placeholder="All Dates"
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
          readOnlyInput
        /> */}
        <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          className="w-18rem"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search orders"
        />
        </span>
      </div>
    );
  };
  const actionBodyName = (rowData) => {
    return <>{rowData.userName}</>;
  };
  const actionBodyDate = (rowData) => {
    const date = new Date(rowData.createdAt);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return <>{formattedDate}</>;
  };

  

  return (
    <div>
    <div className="m-4 flex justify-content-end">
      <Button onClick={addOrder}><i className="pi pi-caret-right">Add Order</i></Button>
    </div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable
         stripedRows
          value={order}
          loading={loading}
          selection={selectedRecords}
          selectionMode="multiple"
          onSelectionChange={(e) => setSelectedRecords(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
        
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column body={actionBodyName} header="Order"></Column>
          <Column body={actionBodyDate} header="Date"></Column>
          <Column body={actionBodyStatus} header="Status"></Column>
          <Column body={actionBodyTotal} field="total" header="Total"></Column>
          <Column body={NotifyBodyTemplate} header="Notification"></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
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
    </div>
  );
}

List.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: `/orders`, name: "Order Page" } };
};
