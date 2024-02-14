import React, { useEffect, useState } from "react";
import { showVisitsLink } from "../../service/api/affilates";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

const index = () => {
  const [data, setData] = useState([]);
  console.log(data);
  const [globalFilter, setGlobalFilter] = useState(null);

  const getData = () => {
    showVisitsLink()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Visits</h4>
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

  const actionBodyDate = (rowData) => {
    const date = new Date(rowData.createAt);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return <>{formattedDate}</>;
  };

  const formatId = (id) => {
    return id.substring(0,6);
  };

  const refferalUrl = (data) => {
    return data.referringUrl ? data.referringUrl : "Direct Traffic";
  };
  

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      globalFilter={globalFilter}
      header={header}
    >
      <Column field="_id" header="Visits ID" body={(rowData) => formatId(rowData._id)}></Column>
      <Column field="pageUrl" header="Landing Page"></Column>
      <Column  body={refferalUrl}field="referringUrl" header="Referring URL"></Column>
      <Column field="referralId" header="Referral ID"></Column>
      <Column body={actionBodyDate}  header="Date"></Column>
    </DataTable>
  );
};

index.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/visits", name: "Visits Page" } };
};

export default index;
