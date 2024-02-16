import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import FileUploader from "../../components/FileUploader";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import RedirectButton from "../../components/RedirectButton";
import { index as getCategories } from "../../service/api/category";
import { Message } from "primereact/message";
import {
  update,
  show,
  showVariant,
  deleteVariant,
} from "../../service/api/product";
import { slugify } from "../../service/common";
import {
  createVarinat,
  showAttribute,
  showVarinats,
  updateVariants,
  showAttributeValue,
} from "../../service/api/variants";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { index } from "../../service/api/attribute-value";
import { Editor } from "@tinymce/tinymce-react";
import Multiselect from "multiselect-react-dropdown";

const statuses = [{ name: "Draft" }, { name: "Active" }];

const Edit = () => {
  const router = useRouter();
  const editorRef = useRef(null);
  const { id } = router.query; // Access the value of the "id" parameter
  const toast = useRef(null);
  const inputEl = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [slugAdded, setSlugAdded] = useState(false);
  const [image, setImage] = useState("");
  console.log(image);
  const [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState("");
  const [attribute, setAttribute] = useState("");
  console.log(attribute, "dose value");
  const [selectVariant, setSelectVariant] = useState([]);
  const [selectAttribute, setSelectAttribute] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectValue, setSelectValue] = useState([]);
  const [variantValue, setVariantValue] = useState([]);
  const [varainatVal, setVarainatval] = useState("");
  console.log(varainatVal.name, "table va");

  const [record, setRecord] = useState("");
  const [value, setValue] = useState("");
  console.log(value.name, "table");
  const [showCard, setShowCard] = useState(false);
  console.log(variant.name, "dose");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: [],
    status: "",
    price: "",
    comparePrice: "",
    sku: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
    shortDescription: "",
  });

  console.log(formData);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    showAttribute().then((res) => setSelectVariant(res));
  }, []);

  useEffect(() => {
    const attributeData = selectVariant.find(
      (doc) => doc.name === variant.name
    );
    setSelectAttribute(attributeData?.attributeValue || []);
  }, [selectVariant, variant.name]);

  // useEffect(() => {
  //   const attributeValue = selectAttribute.find((doc) => doc.name === attribute);
  //   setSelectValue(attributeValue?.value);
  // }, [selectAttribute, attribute]);

  useEffect(() => {
    index().then((data) => setSelectValue(data));
  }, []);

  useEffect(() => {
    const variantData = selectValue.find((doc) => doc.name === value.name);
    setVariantValue(variantData?.attributeValue || []);
  }, [selectValue, value.name]);
  console.log(variantValue);

  const getData = async () => {
    getCategories().then((data) => setCategories(data));
    if (id) {
      show(id).then((data) => {
        setFormData(data);
      });
    }
    showVarinats(id).then((data) => setVariants(data));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "name" && !slugAdded) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        slug: slugify(value),
      }));
    }
    if (name === "slug") {
      if (value == "") {
        setSlugAdded(false);
      } else {
        setSlugAdded(true);
      }
    }
    if (name === "status") {
      value = value.name;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addCategory = (selectedItem) => {
    let items = selectedItem.map((doc) => ({ name: doc.name, _id: doc._id }));
    setFormData({ ...formData, category: items });
  };

  console.log(formData.category);

  const removeCategory = (selectedItem) => {
    setFormData({ ...formData, category: selectedItem });
  };

  // const handleUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const imageDataUrl = event.target.result;
  //       setFormData({
  //         ...formData,
  //         image: imageDataUrl,
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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
        variant: value.name,
        variantValue: varainatVal.name,
      };
      createVarinat(data)
        .then((res) => {
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

  const handleSubmit = (event) => {
    const zeroPriceProducts = variants.filter((doc) => doc.price === 0);
    console.log(zeroPriceProducts);

    if (zeroPriceProducts.length > 0) {
      // Show an error message if there are products with a price of 0
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Variants Price Not Added",
        life: 3000,
      });
    } else {
      const formVal = new FormData();
      // for (const key in formData) {
      //   formVal.append(key, formData[key]);
      // }
      formVal.append("name", formData.name);
      formVal.append("_id", formData._id);
      formVal.append("description", formData.description);
      formVal.append("shortDescription", formData.shortDescription);
      formVal.append("status", formData.status);
      formVal.append("category", JSON.stringify(formData.category));
      formVal.append("price", formData.price);
      formVal.append("comparePrice", formData.comparePrice);
      formVal.append("sku", formData.sku);
      formVal.append("seoTitle", formData.seoTitle);
      formVal.append("seoDescription", formData.seoDescription);
      formVal.append("slug", formData.slug);
      formVal.append("oldImage", formData.image);
      formVal.append("image", image);
      console.log(formVal);
      event.preventDefault();
      update(formVal);
      setIsLoading(true);
      setTimeout(() => {
        window.location.replace("/product");
        // router.push("/product");
      }, 2000);
    }
  };
  console.log(formData.status);
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <RedirectButton
          route="/category"
          label="All Products"
          icon="pi pi-chevron-right"
          severity="sucess"
          className="mr-2"
        />
      </React.Fragment>
    );
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
    console.log(record);
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

  const onRowEditComplete = (e) => {
    let _products = [...variants];
    let { newData, index } = e;
    _products[index] = newData;
    if (!newData.comparePrice) {
      updateVariants(newData);
      setVariants(_products);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
    } else if (newData.comparePrice <= newData.price) {
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "ComparePrice Less Then",
        life: 3000,
      });
    } else {
      updateVariants(newData);
      setVariants(_products);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
    }
  };

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

  const descriptionBodyTemplate = (rowData) => {
    console.log(rowData);
    return <div>{rowData.description}</div>;
  };

  const priceEditor = (options) => {
    console.log(options);
    return (
      <InputNumber
        style={{ width: "80px" }}
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const uploadImage = (e) => {
    const file = e.target.files[0]; // Get the uploaded file from the event
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Please select an image file only",
        life: 3000,
      });
      return;
    }
    setImage(file);
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
  const comparePriceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.comparePrice);
  };

  return (
    <>
      <div className="grid">
        {/* <div className="col-11">
        <Toolbar end={rightToolbarTemplate}></Toolbar>
      </div> */}

        <div className="col-8">
          <div className="card">
            <Toast ref={toast} />
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="title">Title</label>
                <InputText
                  id="title"
                  type="text"
                  value={formData.name}
                  name="name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="slug">Slug</label>
                <InputText
                  id="slug"
                  type="text"
                  value={formData.slug}
                  name="slug"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="field col-12">
                <label htmlFor="description">Description</label>

                <Editor
                  apiKey="qhkkmd4pfgr2xdtss7u4x19t3ah0m39q16z24oljukztket5"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  // initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  value={formData.description}
                  onEditorChange={(content) =>
                    handleChange({
                      target: { name: "description", value: content },
                    })
                  }
                />
              </div>
              <div className="field col-12">
                <label htmlFor="description">Short Description</label>

                <Editor
                  apiKey="qhkkmd4pfgr2xdtss7u4x19t3ah0m39q16z24oljukztket5"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  // initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  value={formData.shortDescription}
                  onEditorChange={(content) =>
                    handleChange({
                      target: { name: "shortDescription", value: content },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <Card title="Media" className="card">
            <input
              style={{ display: "none" }}
              ref={inputEl}
              type="file"
              onChange={uploadImage}
            />
            <Button
              label="Upload Image"
              icon="pi pi-upload"
              onClick={() => inputEl.current.click()}
            />
            {!image ? (
              <img height={200} width={300} src={formData.image} alt="" />
            ) : image ? (
              <img src={URL.createObjectURL(image)} alt="" />
            ) : (
              <p>No image selected</p>
            )}
          </Card>
          <Card title="Pricing" className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-4">
                <label htmlFor="price">Price</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">$</span>
                  <InputText
                    id="price"
                    type="text"
                    keyfilter="money"
                    value={formData.price}
                    name="price"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field col-4">
                <label htmlFor="comparePrice">Compare at Price</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">$</span>
                  <InputText
                    id="comparePrice"
                    type="text"
                    keyfilter="money"
                    value={formData.comparePrice}
                    name="comparePrice"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field col-4">
                <label htmlFor="sku">SKU</label>
                <div className="p-inputgroup">
                  <InputText
                    id="sku"
                    type="text"
                    value={formData.sku}
                    name="sku"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="field col-12">
              <label htmlFor="status">Product Status</label>
              <Dropdown
                value={formData.status}
                name="status"
                onChange={handleChange}
                options={statuses}
                optionLabel="name"
                placeholder={formData.status}
                className="w-full"
              />
            </div>
            <div className="field col-12">
              <label htmlFor="category">Product Category</label>
              {/* <Dropdown
                value={formData.category}
                name="category"
                onChange={handleChange}
                options={categories}
                optionLabel="name"
                placeholder={formData.category}
                className="w-full"
              /> */}
              <Multiselect
                options={categories} // Options to display in the dropdown
                selectedValues={formData.category} // Preselected value to persist in dropdown
                onSelect={addCategory} // Function will trigger on select event
                onRemove={removeCategory} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
              />
            </div>
            <div className="flex justify-content-center">
              <Button
                onClick={handleSubmit}
                label={isLoading ? "Updating..." : "Update"}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {showCard ? (
          <Card className="my-4">
            <div className="col-6">
              <div className="field col-12">
                <label htmlFor="status">Select Attributes</label>
                <Dropdown
                  value={variant}
                  onChange={(e) => setVariant(e.value)}
                  options={selectVariant}
                  optionLabel="name"
                  placeholder="Select Attributes"
                  className="w-full"
                />
              </div>
              <div className="field col-12">
                <label htmlFor="category">Select Attributes Value</label>
                <br />
                <select
                  onChange={(e) => setAttribute(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    borderColor: "#ced4da",
                  }}
                  name=""
                  id=""
                >
                  <option value="">Select Attributes Value</option>
                  {selectAttribute.map((doc) => (
                    <option value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div className="field col-12">
                <label htmlFor="category">Select Variants</label>
                <Dropdown
                  value={value}
                  onChange={(e) => setValue(e.value)}
                  options={selectValue}
                  name="Value"
                  optionLabel="name"
                  placeholder="Select Variants"
                  className="w-full"
                />
              </div>
              <div className="field col-12">
                <label htmlFor="category">Select Variants Value</label>
                <Dropdown
                  value={varainatVal}
                  onChange={(e) => setVarainatval(e.value)}
                  options={variantValue}
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
          </Card>
        ) : null}
        <div className="card p-fluid">
          <div class="flex align-content-start flex-wrap">
            <div class="flex align-items-center justify-content-center w-4rem h-4rem font-bold border-round m-2">
              <Checkbox
                onChange={(e) => setShowCard(e.checked)}
                checked={showCard}
              ></Checkbox>
            </div>
            <div class="flex align-items-center justify-content-start w-16rem h-4rem font-bold border-round m-2">
              <Message text="Select Variants" />
            </div>
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
        <DataTable
          value={variants}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column rowEditor bodyStyle={{ textAlign: "center" }}></Column>
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
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
      <div className="my-4">
        <Card title="SEO" className="card">
          <div className="flex flex-column gap-2">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-column gap-2">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="seoDescription"
              value={formData.seoDescription}
              rows={5}
              cols={30}
              name="seoDescription"
              onChange={handleChange}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

Edit.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/product/[id]", name: "Update Product" } };
};

export default Edit;
