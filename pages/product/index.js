import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import RedirectButton from "../../components/RedirectButton";
import {
  index,
  destroy,
  multiDestroy,
  exportProducts,
  importProducts,
} from "../../service/api/product";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import config from "../../service/config";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { index as getCategories } from "../../service/api/category";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Badge } from "primereact/badge";

const { baseURLRoot } = config;

const List = () => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toast = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [active, setActive] = useState([]);
  console.log(active);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  useEffect(() => {
    getData();
    
  }, [category.name]);

  const getData = () => {
    setLoading(true)
    index().then((data) => {
      if (category) {
        // Filter records based on the selected category name
        const filteredRecords = data.filter(
          (record) =>
            record.category.toLowerCase() === category?.name?.toLowerCase()
        );
        setRecords(filteredRecords);
        setLoading(false)
      } else {
        // If no category is selected, set all records
        setRecords(data);
        setLoading(false)
      }
    });
    getCategories().then((data) => setCategories(data));
  };


  useEffect(() => {
    index().then((data)=>{
      console.log(data);
      let activeData = data.filter((item)=>item.status==="Active")
      setActive(activeData);
      let deactiveData = data.filter((item)=>item.status==="Draft")
      setDraft(deactiveData)
    })
  }, [])
  

  const checkActive = (active) => {
    console.log(active);
    setLoading(true)
    index().then((data) => {
      console.log(data);
      if (active) {
        // Filter records based on the selected category name
        const filteredRecords = data.filter(
          (record) =>
            record.status.toLowerCase() === active.toLowerCase()
        );
        setRecords(filteredRecords);
        setLoading(false)
      } else {
        // If no category is selected, set all records
        setRecords(data);
        setLoading(false)
      }
    });
  };
  const resetButton = () => {
    window.location.reload(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [deleteDialog, setDeleteDialog] = useState(false);
  const confirmDelete = (record) => {
    setRecord(record);
    setDeleteDialog(true);
  };

  const deleteAction = () => {
    if (record) {
      console.log(record._id);
      destroy(record._id).then((data) => getData());
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

  const rightToolbarTemplate = () => {
    return <React.Fragment></React.Fragment>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <RedirectButton
          route={"/product/" + rowData._id}
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
        />

        {/*<Button icon="pi pi-pencil" rounded outlined  onClick={() => setEditId(rowData.id)} />*/}
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

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={rowData.status} />;
  };

  const categoryBodyTemplate = (rowData) => {
    console.log(rowData);
    const categoryNames = rowData.category.map((doc) => doc.name || "N/A");
    return <>{categoryNames.join(', ')}</>;
    // return <Tag value={rowData.category}  />;
  };
  
  
  const productImageTemplate = (rowData) => {
    console.log(rowData);
    return (
     <>
       {rowData.image? <img
        src={rowData.image}
        className="w-6rem shadow-2 border-round"
        alt="Product Image Default"
      />:<img src="/product/default.jpg" className="w-6rem shadow-2 border-round"alt="Product Image Default" />}
     </>
    );
  };
  const productPriceBodyTemplate = (rowData) => {
    if (rowData) {
      return (
        <>
       {rowData.price? <p>${rowData?.price}</p>:"N/A"}
     </>
      );
    } else {
      return "N/A";
    }
  };
  const productPriceComparePriceBodyTemplate = (rowData) => {
    if (rowData) {
      return (
        <>
       {rowData.comparePrice? <s>${rowData?.comparePrice}</s>:"N/A"}
     </>
      );
    } else {
      return "N/A";
    }
  };
  const productNameBodyTemplate = (rowData) => {
    if (rowData) {
      return <div>{rowData?.name}</div>;
    } else {
      return "N/A";
    }
  };
  const exportFile = async () => {
    const response = await exportProducts();
    const blob = new Blob([response], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.csv"; // Set the filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
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
    importProducts(formdata).then((data) => getData());
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Add Succesfully",
      life: 3000,
    });
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <RedirectButton
          route="/product/add"
          label="Add Product"
          icon="pi pi-plus"
          severity="sucess"
          className="mr-2"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={deleteSelectedProducts}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportFile}
        />
        <input
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
        />
        <Button onClick={handleClick} label="Import" icon="pi pi-plus" />
        <Button
          onClick={() => checkActive("Active")}
          className="p-button-success"
          type="button"
          label="Publish"
        >
          <Badge value={active?.length}></Badge>
        </Button>
        <Button
          onClick={() => checkActive("Draft")}
          type="button"
          label="Draft"
          icon="pi pi-users"
          className="p-button-warning"
        >
          <Badge value={draft?.length} severity="danger"></Badge>
        </Button>
        <Button
          icon="pi pi-times"
          onClick={resetButton}
          label="Clear"
          severity="info"
        />
      </div>
    );
  };

  const deleteSelectedProducts = () => {
    if (selectedRecords.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No products selected for deletion",
        life: 3000,
      });
    } else {
      const productIds = selectedRecords.map((record) => record._id);
      multiDestroy(productIds).then((data) => getData());
      setSelectedRecords([]);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Selected products deleted",
        life: 3000,
      });
    }
  };

  const header = (
    <div className="grid">
      <div className="col-4">
        <Dropdown
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
          optionLabel="name"
          placeholder="Select categories"
          className="w-full md:w-14rem"
        />
      </div>
      <div className="col-8">
        <InputText
          className="w-full"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search products"
        />
      </div>
    </div>
  );
  return (
    <div className="mt-8">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          end={rightToolbarTemplate}
        ></Toolbar>

        <div>
          <div className="grid">
            <div className="col-12">
              <DataTable
                stripedRows
                loading={loading}
                value={records}
                selection={selectedRecords}
                onSelectionChange={(e) => setSelectedRecords(e.value)}
                header={header}
                paginator
                rows={10}
                filters={filters}
                tableStyle={{ minWidth: "20rem" }}
              >
                <Column selectionMode="multiple" exportable={false}></Column>
                {/*<DataTable value={products} tableStyle={{ minWidth: '50rem' }}>*/}
                <Column
                  field="name"
                  header="Name"
                  body={productNameBodyTemplate}
                ></Column>
                <Column
                  field="image"
                  header="Image"
                  body={productImageTemplate}
                ></Column>
                <Column
                  field="price"
                  header="Price"
                  body={productPriceBodyTemplate}
                ></Column>
                <Column
                  field="comparePrice"
                  header="Compare Price"
                  body={productPriceComparePriceBodyTemplate}
                ></Column>
                <Column
                  field="category"
                  header="Category"
                  body={categoryBodyTemplate}
                ></Column>
                <Column
                  field="status"
                  header="Status"
                  body={statusBodyTemplate}
                ></Column>
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
        </div>
      </div>
    </div>
  );
};
List.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/product", name: "Product Page" } };
};

export default List;
