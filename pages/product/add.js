import { Card } from "primereact/card";
// import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useRef, useState, useEffect } from "react";
import FileUploader from "../../components/FileUploader";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { index as getCategories } from "../../service/api/category";
import RedirectButton from "../../components/RedirectButton";
import { createEssay } from "../../service/api/product";
import { InputTextarea } from "primereact/inputtextarea";
import { slugify } from "../../service/common";
import { Message } from "primereact/message";
import { Editor } from "@tinymce/tinymce-react";
import Multiselect from "multiselect-react-dropdown";
const statuses = [{ name: "Draft" }, { name: "Active" }];

const add = () => {
  const toast = useRef(null);
  const editorRef = useRef(null);
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const [categories, setCategories] = useState([]);
  const [slugAdded, setSlugAdded] = useState(false);
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const inputEl = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category:[],
    status: "",
    price: "",
    comparePrice: "",
    sku: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
    image: null,
  });
  console.log(formData);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    getCategories().then((data) => setCategories(data));
  };
  
  const addCategory = (selectedItem) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category:JSON.stringify(selectedItem),
    }));
  };

  


  const removeCategory = (selectedItem) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedItem
    }));
  }

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

  const onCheck = (e) => {
    const requiredFields = [];

    // Check if title, description, category, or status is empty and add their names to the requiredFields array
    if (!formData.name) {
      requiredFields.push("Title");
    }
    if (!formData.description) {
      requiredFields.push("Description");
    }
    if (!formData.category) {
      requiredFields.push("Category");
    }
    if (!formData.status) {
      requiredFields.push("Status");
    }

    // Check if any required field is empty
    if (requiredFields.length > 0) {
      // Construct the alert message with the names of the required fields
      const alertMessage = `fields are required: ${requiredFields.join(", ")}`;
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: `${alertMessage}`,
        life: 3000,
      });
    } else {
      setChecked(e.checked);
      setIsLoading(true);
      const formVal = new FormData();
      for (const key in formData) {
        formVal.append(key, formData[key]);
      }
      formVal.append("image", image);
      // formVal.append("category",formData.category);
      createEssay(formVal)
        .then((res) => {
          setFormData(res.result);
          setId(res.result._id);
          setIsLoading(false);
          setShow(true);
        })
        .catch((error) => {
          console.log(error);
          toast.current.show({
            severity: "error",
            summary: "error",
            detail: `${error.message}`,
            life: 3000,
          });
        });
    }
  };

  const withoutVarinat = () => {
    // Define an array to store the names of required fields that are empty
    const requiredFields = [];

    // Check if title, description, category, or status is empty and add their names to the requiredFields array
    if (!formData.name) {
      requiredFields.push("Title");
    }
    if (!formData.description) {
      requiredFields.push("Description");
    }
    if (!formData.category) {
      requiredFields.push("Category");
    }
    if (!formData.status) {
      requiredFields.push("Status");
    }

    // Check if any required field is empty
    if (requiredFields.length > 0) {
      // Construct the alert message with the names of the required fields
      const alertMessage = `fields are required: ${requiredFields.join(", ")}`;
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: `${alertMessage}`,
        life: 3000,
      });
    } else {
      // All fields are filled, proceed with form submission
      const formVal = new FormData();
      for (const key in formData) {
        formVal.append(key, formData[key]);
      }
      formVal.append("image", image);
      createEssay(formVal)
        .then((res) => {
          setFormData(res.result);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Add products Successfully",
            life: 3000,
          });
          router.push(`/product`);
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "error",
            detail: `${error.message}`,
            life: 3000,
          });
          router.push(`/product/add`);
        });
    }
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

  const navigate = () => {
    if (id) {
      setTimeout(() => {
        router.push(`/product/view/${id}`);
      });
    } else {
      router.push(`/product/add`);
    }
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <RedirectButton
          route="/product"
          label="All Products"
          icon="pi pi-chevron-right"
          severity="sucess"
          className="mr-2"
        />
      </React.Fragment>
    );
  };
  return (
    <div className="grid">
      <div className="col-12">
        <Toolbar end={rightToolbarTemplate}></Toolbar>
      </div>
      <div style={{ display: "inline-flex" }}>
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
                  onEditorChange={(content) =>
                    handleChange({
                      target: { name: "description", value: content },
                    })
                  }
                  value={formData.description}
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
              accept="image"
              onChange={uploadImage}
            />
            <Button
              label="Upload Image"
              icon="pi pi-upload"
              onClick={() => inputEl.current.click()}
            />
            {image ? (
              <img
                width={300}
                height={200}
                src={URL.createObjectURL(image)}
                alt=""
              />
            ) : null}
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
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card className="my-4">
            <div className="flex align-items-center ">
              <Checkbox onChange={onCheck} checked={checked} />{" "}
              <label style={{ marginLeft: "4px" }} htmlFor="">
                <Message text="Select Variants" />
              </label>
              {isLoading ? (
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem" }}
                ></i>
              ) : null}
              <label htmlFor="ingredient1" className="ml-2">
                {" "}
                {show ? <Button onClick={navigate}>Add Variants</Button> : null}
              </label>
            </div>
          </Card>
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
        <div className="col-4">
          <div className="card">
            <div className="field col-12">
              <label htmlFor="status">Product Status</label>
              <Dropdown
                optionLabel="name"
                value={formData.status}
                name="status"
                onChange={(e) => handleChange(e)}
                options={statuses}
                placeholder={
                  formData.status ? `${formData.status}` : "Select a status"
                }
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
                placeholder={
                  formData.category
                    ? `${formData.category}`
                    : "Select a Category"
                }
                className="w-full"
              /> */}
              {/* <MultiSelect value={selectedCities} onChange={handleCitySelection} options={categories} optionLabel="name" 
                placeholder={
                  formData.category
                    ? `${formData.category}`
                    : "Select a Category"
                } maxSelectedLabels={3} className="w-full" /> */}
              <Multiselect
                options={categories} // Options to display in the dropdown
                // selectedValues={formData.category} // Preselected value to persist in dropdown
                onSelect={addCategory} // Function will trigger on select event
                onRemove={removeCategory} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
              />
            </div>
            <div className="flex justify-content-center">
              <Button
                onClick={withoutVarinat}
                label={isLoading ? "Saving..." : "Save"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default add;
