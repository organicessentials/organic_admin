import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { updateAffilateStatus,deleteAffilateUser,show, deleteAffilateUserSingle } from "../../service/api/affilates";
import Link from "next/link";

export default function index() {
  const [affilates, setAffilates] = useState([]);
  console.log(affilates);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [record, setRecord] = useState("");
  const [statusChange, setStatusChange] = useState("");
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useRef(null)
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    show().then((data) => {
      if (globalFilter) {
        const filteredRecords = data.filter((record) =>
          record.name && record.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
        setAffilates(filteredRecords);
      } else {
        setAffilates(data);
      }
      setLoading(false);
    });
  };
  



  const getSeverity = (value) => {
    switch (value) {
      case "Approve":
        return "success";

      case "Reject":
        return "danger";

      default:
        return null;
    }
  };

  const status = [
    { name: "Active" },
    { name: "Reject" },
  ];

  const apply = async () => {
    try {
      const ids = selectedRecords.map((doc) => doc._id);
      let status = statusChange.name
      await updateAffilateStatus({ ids, status });
      setSelectedRecords([]);
      await getData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteUser =async () => {
     try {
      const ids = selectedRecords.map((doc) => doc._id);
      console.log(ids);
      await deleteAffilateUser(ids)
      setSelectedRecords([]);
      await getData();
      setLoading(false);
     } catch (error) {
      setLoading(false);
     }
  }

  

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status}
        severity={getSeverity(rowData.status)}
      ></Tag>
    );
  };


  const deleteAction = () => {
    if (record) {
      deleteAffilateUserSingle(record._id).then((data) => getData());
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

  const deleteBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDelete(rowData)}
      />
    );
  };

  const confirmDelete = (record) => {
    setRecord(record);
    setDeleteDialog(true);
  };

  const approve = (rowData)=>{
    console.log(rowData.status);
    setLoading(true)
    if (rowData.status==="Pending"||rowData.status==="Reject") {
      updateAffilateStatus({ ids:rowData._id, status:"Active" }).then((res)=>{
        getData()
        setLoading(false)
      }).catch((err)=>{
        console.log(err);
      })

    }else{
      updateAffilateStatus({ ids:rowData._id, status:"Reject" }).then((res)=>{
        getData()
        setLoading(false)
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  const buttonApprove = (rowData) => {
    return (
      <>
        {rowData.status === "Pending" || rowData.status === "Reject"  ? (
          <Button severity="success" onClick={() => approve(rowData)}>
            Approve
          </Button>
        ) : (
          <Button severity="danger" onClick={() => approve(rowData)}>
            Reject
          </Button>
        )}
      </>
    );
  };


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Delete" severity="danger" className="w-full md:w-6rem" onClick={deleteUser}/>
        <Dropdown
          value={statusChange}
          onChange={(e) => setStatusChange(e.value)}
          options={status}
          optionLabel="name"
          placeholder="Change Status"
          className="w-full md:w-14rem"
        />
        <Button className="w-full md:w-6rem" onClick={apply}>
          Apply
        </Button>
        <span className="w-full md:w-24rem p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className="w-full"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders"
          />
        </span>
      </div>
    );
  };
  
  const paidEarningTemplate = (rowData) => {
    const paidReferrals = rowData.referrals.filter((doc) => doc.status === "Paid");
    const totalPaidAmount = paidReferrals.reduce((total, referral) => {
        return total + parseInt(referral.amount, 10);
    }, 0);
    return <>${totalPaidAmount}</>
};


  const unPaidEarningTemplate = (rowData) => {
    const unPaidReferrals = rowData.referrals.filter((doc) => doc.status === "Unpaid");
    const totalUnPaidAmount = unPaidReferrals.reduce((total, referral) => {
        return total + parseInt(referral.amount, 10);
    }, 0);
    return <>${totalUnPaidAmount}</>
  }

  const paidReferralsTemplate = (rowData) => {
    const unPaidReferrals = rowData.referrals.filter((doc) => doc.status === "Paid");
    return <>{unPaidReferrals.length}</>
  }

  const unPaidReferralsTemplate = (rowData) => {
    const unPaidReferrals = rowData.referrals.filter((doc) => doc.status === "Unpaid");
    return <>{unPaidReferrals.length}</>
  }

  const rate = (rowData) => {
    return <>{rowData.rateType==="Percentage"?`${rowData.rate}%`:`$${rowData.rate}`}</>
  }

  const editCell = (rowData) => {
    return <Link href={`/affiliates/${rowData._id}`}>{rowData.name}</Link>
  }
  

  return (
    <div className="card p-fluid">
      <Toast ref={toast} />
      <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
      <DataTable
        value={affilates}
        stripedRows
        selection={selectedRecords}
        selectionMode="multiple"
        onSelectionChange={(e) => setSelectedRecords(e.value)}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
      >
        <Column selectionMode="multiple" exportable={false}></Column>
        <Column body={editCell} field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="affiliateId" header="Aaffiliate ID"></Column>
        <Column body={paidEarningTemplate} header="Paid Earnings"></Column>
        <Column body={unPaidEarningTemplate} header="Unpaid Earnings"></Column>
        <Column body={rate} header="Rate"></Column>
        <Column body={unPaidReferralsTemplate} header="Unpaid Referrals"></Column>
        <Column body={paidReferralsTemplate} header="Paid Referrals"></Column>
        <Column field="visits.length" header="Visits"></Column>
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
        ></Column>
        <Column field="" header="Select Status" body={buttonApprove}></Column>
        <Column header="Delete" body={deleteBodyTemplate}></Column>
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
  return { pageTitle: { url: "/affilates", name: "Affilates Page" } };
};
