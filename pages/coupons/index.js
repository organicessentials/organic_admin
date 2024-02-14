import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { index, destroy, multiDestroy } from "../../service/api/coupon";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";

function List() {
  const [coupons, setCoupons] = useState([]);
  const router = useRouter();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [record, setRecord] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const data = await index();
    setCoupons(data);
  };

  const openNew = () => {
    router.push(`/coupons/add`);
  };

  const confirmDelete = (record) => {
    setRecord(record);
    setSelectedProducts(selectedProducts);
    setDeleteDialog(true);
  };

  const deleteAction = () => {
    if (selectedProducts.length === 0 && !record) {
      // Neither single record nor multiple records selected for deletion
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No Coupons selected for deletion",
        life: 3000,
      });
    } else {
      if (selectedProducts.length > 0) {
        // Multiple products selected for deletion
        const data = selectedProducts.map((record) => record._id);
        multiDestroy(data)
          .then(() => {
            getData();
            setSelectedProducts([]);
            setDeleteDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Selected Coupons deleted",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error deleting selected Coupons:", error);
          });
      }

      if (record) {
        // Single record selected for deletion
        destroy(record._id)
          .then(() => {
            getData();
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

  const editProduct = (data) => {
    router.push(`/coupons/${data._id}`);
  };

  const confirmDeleteSelected = () => {
    setDeleteDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Add Coupon"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
    );
  };

  // const rightToolbarTemplate = () => {
  //     return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  // };

  const showUserLimit = (rowData) => {
    return <>{rowData.useCoupon.length}</>

  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDelete(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Coupons</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={coupons}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="name" header="Code"></Column>
          <Column field="discount" header="Coupon type"></Column>
          <Column field="amount" header="Coupon amount"></Column>
          <Column body={showUserLimit} header="Usage / Limit"></Column>
          <Column
            field="date"
            header="Expiry date"
            body={(rowData) => {
              const date = new Date(rowData.date);
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
          ></Column>

          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

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

List.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/coupons", name: "Coupons Page" } };
};

export default List;
