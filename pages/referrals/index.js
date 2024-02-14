import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import {
  deleteReferralsAll,
  deleteReferralsLink,
  showReferralsLinks,
  updateReferralsAllStatus,
  updateReferralsLink,
} from "../../service/api/referrals";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";

const index = () => {
  const [referral, setReferral] = useState([]);
  const [refDeatils, setRefDeatils] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [statusChange, setStatusChange] = useState("");
  const [message, setMessage] = useState("");
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState(false);
  console.log(selectedRecords);
  const [userName, setUserName] = useState("");

  const status = [{ name: "Paid" }, { name: "Unpaid" }];

  const getData = () => {
    setLoading(true);
    showReferralsLinks(message, userName)
      .then((data) => {
        setReferral(data.allReferrals);
        setRefDeatils(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [message, userName]);

  const getSeverity = (rowData) => {
    switch (rowData.status) {
      case "Paid":
        return "success";

      case "Unpaid":
        return "warning";
      default:
        return null;
    }
  };

  const deleteAction = () => {
    const ids = selectedRecords.map((doc) => doc._id);
    if (!ids) {
      toast.current.show({
        severity: "error",
        summary: "Successful",
        detail: "Record Not Selected",
        life: 3000,
      });
    }
    deleteReferralsAll({ ids })
      .then((res) => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Record Deleted",
          life: 3000,
        });
        setDeleteDialog(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
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

  const updateAllStatus = () => {
    const ids = selectedRecords.map((doc) => doc._id);
    const status = statusChange.name;
    updateReferralsAllStatus({ ids, status })
      .then((res) => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Record Updated",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const addRefferal = () => {
    router.push("referrals/add")
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setMessage("")}
          link
          label={`All${
            refDeatils.paidReferralsCount + refDeatils.unPaidReferralsCount
              ? `(${
                  refDeatils.paidReferralsCount +
                  refDeatils.unPaidReferralsCount
                })`
              : ""
          }`}
        />
        <Button
          onClick={() => setMessage("Paid")}
          link
          label={`Paid${
            refDeatils.paidReferralsCount
              ? `(${refDeatils.paidReferralsCount})`
              : ""
          }`}
        />
        <Button
          onClick={() => setMessage("Unpaid")}
          link
          label={`Unpaid${
            refDeatils.unPaidReferralsCount
              ? `(${refDeatils.unPaidReferralsCount})`
              : ""
          }`}
        />

        <Button
          onClick={() => setDeleteDialog(true)}
          link
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
        />

        <Dropdown
          value={statusChange}
          onChange={(e) => setStatusChange(e.value)}
          options={status}
          optionLabel="name"
          placeholder="Change Status"
          className="w-full md:w-14rem"
        />
        <Button onClick={updateAllStatus}>Apply</Button>
      </div>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setUserName(e.target.value)}
          placeholder="Search..."
        />
      </span>
      <Button onClick={addRefferal}>Add</Button>
    </div>
  );

 

  const actionBodyDate = (rowData) => {
    const date = new Date(rowData.createAt);
    const formattedDate = date.toLocaleDateString("en-US");
    return <>{formattedDate}</>;
  };

  const actionBodySale = () => {
    return `Sale`;
  };

  const actionBodyId = (rowData, i) => {
    return `${i.rowIndex + 1}`;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.status === "Unpaid" ? (
          <Button onClick={() => action(rowData)} label="Mark as Paid" />
        ) : (
          <Button onClick={() => action(rowData)} label="Mark as Unpaid" />
        )}
      </>
    );
  };

  const action = (rowData) => {
    console.log(rowData);
    if (rowData.status === "Paid") {
      updateReferralsLink({ status: "Unpaid", id: rowData._id }).then(
        (data) => {
          getData();
        }
      );
    } else {
      updateReferralsLink({ status: "Paid", id: rowData._id }).then((data) => {
        getData();
      });
    }
  };

  const confirmDelete = async (rowData) => {
    try {
      await deleteReferralsLink(rowData._id);
      await getData();
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Deleted",
        life: 3000,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const actionBodyStatus = (rowData) => {
    return (
      <Tag
        value={rowData ? rowData.status : null}
        severity={getSeverity(rowData)}
      ></Tag>
    );
  };

  const bodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => openNew(rowData)}
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

  const openNew = (rowData) => {
    setData(rowData);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const saveProduct = () => {
    setProductDialog(false);
    updateReferralsLink({
      id: data._id,
      amount: data.amount,
      description: data.description,
    })
      .then((res) => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Record Deleted",
          life: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const formatId = (id) => {
    return <a href={`/orders/${id}`}>{id?.substring(0, 6)}</a>;
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={referral}
        stripedRows
        loading={loading}
        selection={selectedRecords}
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
        <Column body={actionBodyId} header="Referral ID"></Column>
        <Column field="amount" header="Amount"></Column>
        <Column field="email" header="Affilate"></Column>
        <Column
          body={(rowData) => formatId(rowData.userId)}
          header="Reference"
        ></Column>
        <Column field="description" header="Description"></Column>
        <Column body={actionBodySale} header="Type"></Column>
        <Column body={actionBodyDate} header="Date"></Column>
        <Column body={actionBodyTemplate} header="Action"></Column>
        <Column body={actionBodyStatus} header="Status"></Column>
        <Column body={bodyTemplate} exportable={false}></Column>
      </DataTable>
      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Referrals Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputText
            value={data.description}
            onChange={handleChange}
            name="description"
            required
            autoFocus
          />
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="amount" className="font-bold">
              Amount
            </label>
            <InputText
              name="amount"
              value={data.amount}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="field col">
            <label htmlFor="quantity" className="font-bold">
              Optional
            </label>
            <InputNumber id="quantity" />
          </div>
        </div>
      </Dialog>
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
  return { pageTitle: { url: "/referrals", name: "Referrals Page" } };
};

export default index;
