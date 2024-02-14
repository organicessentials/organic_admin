import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useState, useEffect, useRef } from "react";
import {
  createVarinat,
  showAttribute,
  showVarinats,
  updateVariants,
} from "../../../service/api/variants";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { deleteVariant } from "../../../service/api/product";
import { index } from "../../../service/api/attribute-value";
import { InputTextarea } from "primereact/inputtextarea";
const List = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { id } = router.query; // Access the value of the "id" parameter
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [value, setValue] = useState([]);
  const toast = useRef(null);

  const [selectValue, setSelectValue] = useState("");
  const [attribute, setAttribute] = useState("");
  console.log(attribute, "at val");
  const [variant, setVariant] = useState("");
  console.log(variant.name, "att");
  const [record, setRecord] = useState("");
  const [selectVariant, setSelectVariant] = useState([]);
  console.log(products);
  console.log(selectValue.name, "varian");
  const [varainatArray, setVarainatArray] = useState([]);
  const [selectVariantValue, setSelectVariantValue] = useState("");
  console.log(selectVariantValue, "var Val");

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    if (id) {
      showVarinats(id).then((res) => setProducts(res));
    }
  };

  useEffect(() => {
    index().then((data) => setSelectVariant(data));
  }, []);

  useEffect(() => {
    showAttribute().then((res) => setVariants(res));
  }, []);

  useEffect(() => {
    const attributeData = variants.find((doc) => doc.name === variant.name);
    setAttributes(attributeData?.attributeValue || []);
  }, [variants, variant.name]);

  useEffect(() => {
    const attributeValue = selectVariant.find(
      (doc) => doc.name === selectValue.name
    );
    setVarainatArray(attributeValue?.attributeValue || []);
  }, [selectVariant, selectValue]);

  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    if (!newData.comparePrice) {
      updateVariants(newData);
      setProducts(_products);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
    }else if (newData.comparePrice <= newData.price) {
      toast.current.show({
        severity: "error",
        summary: "error",
       detail: "ComparePrice Less Then",
       life: 3000,
      });
    }
     else {
      updateVariants(newData);
      setProducts(_products);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
    }
  };

  const addProduct = () => {
    const zeroPriceProducts = products.filter((doc) => doc.price === 0);
  
    if (zeroPriceProducts.length > 0) {
      // Show an error message if there are products with a price of 0
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Variants Price Not Added",
        life: 3000,
      });
    } else {
      // Redirect to the product page if there are no products with a price of 0
      router.push(`/product/${id}`);
    }
  };

  const saveProduct = ()=> {
    const zeroPriceProducts = products.filter((doc) => doc.price === 0);
  
    if (zeroPriceProducts.length > 0) {
      // Show an error message if there are products with a price of 0
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Variants Price Not Added",
        life: 3000,
      });
    } else {
      // Redirect to the product page if there are no products with a price of 0
      router.push(`/product`);
    }
  }
  

  const textEditor = (options) => {
    return (
      <InputTextarea
        style={{ width: "220px" }}
        rows={3}
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const addVariants = () => {
    if (!variant.name) {
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: `attribute not selected`,
        life: 3000,
      });
    } else {
      let data = {
        productId: id,
        attribute: variant.name,
        attributeValue: attribute,
        variant: selectValue.name,
        variantValue: selectVariantValue.name,
      };
      createVarinat(data)
        .then((res) => {
          setVariants((prevVariants) => [...prevVariants, res]);
          getData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Record Added",
            life: 3000,
          });
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "error",
            detail: `Variant already exists`,
            life: 3000,
          });
        });
    }
  };

  const priceEditor = (options) => {
    console.log(options);
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const comparePriceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.comparePrice);
  };

  const descriptionBodyTemplate = (rowData) => {
    return <div>{rowData.description}</div>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
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
  const confirmDelete = (record) => {
    setRecord(record);
    setDeleteDialog(true);
  };
  const deleteAction = () => {
    deleteVariant(record._id).then((data) => getData());
    setDeleteDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Record Deleted",
      life: 3000,
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

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.price);
  };
  return (
    <div>
      <Toast ref={toast} />
      <div className="col-6">
        <div className="card">
          <div className="field col-12">
            <label htmlFor="status">Select Variants</label>
            <Dropdown
              value={variant}
              onChange={(e) => setVariant(e.value)}
              options={variants}
              optionLabel="name"
              placeholder="Variants"
              className="w-full"
            />
          </div>
          <div className="field col-12">
            <label htmlFor="category">Select Attributes</label>
            <br />
            <select
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                borderColor: "#ced4da",
              }}
              onChange={(e) => setAttribute(e.target.value)}
              name=""
              id=""
            >
              <option value="">Select Attributes</option>
              {attributes.map((doc) => (
                <option value={doc.name}>{doc.name}</option>
              ))}
            </select>
          </div>

          <div className="field col-12">
            <label htmlFor="category">Select Value</label>
            <Dropdown
              value={selectValue}
              onChange={(e) => setSelectValue(e.value)}
              options={selectVariant}
              name="Value"
              optionLabel="name"
              placeholder="Value"
              className="w-full"
            />
          </div>
          <div className="field col-12">
            <label htmlFor="category">Select Value</label>
            <Dropdown
              value={selectVariantValue}
              onChange={(e) => setSelectVariantValue(e.value)}
              options={varainatArray}
              name="Value"
              optionLabel="name"
              placeholder="Value"
              className="w-full"
            />
          </div>
          <div className="flex justify-content-center">
            <Button
              onClick={addVariants}
              type="submit"
              label={isLoading ? "Adding..." : "Add"}
            />
          </div>
        </div>
      </div>
      <div className="card p-fluid">
        <DataTable
          value={products}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column field="attribute" header="Attribute"></Column>
          <Column field="attributeValue" header="AV"></Column>
          <Column field="variant" header="Variant"></Column>
          <Column field="variantValue" header="VV"></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            editor={(options) => priceEditor(options)}
          ></Column>
          <Column
            field="comparePrice"
            header="Compare at Price"
            body={comparePriceBodyTemplate}
            editor={(options) => priceEditor(options)}
          ></Column>
          <Column
            field="description"
            header="Description"
            body={descriptionBodyTemplate}
            editor={(options) => textEditor(options)}
          ></Column>
          <Column rowEditor bodyStyle={{ textAlign: "center" }}></Column>
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
      <div>
        <Button onClick={addProduct}>Edit Product</Button>
        <Button style={{ marginLeft: "20px" }} onClick={saveProduct}>
          Save
        </Button>
      </div>
    </div>
  );
};

List.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/product/view", name: "Variants Page" } };
};

export default List;
