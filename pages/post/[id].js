import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { update, show, index } from "../../service/api/post";
import { Toast } from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/router";
import { slugify } from "../../service/common";
import { Chips } from "primereact/chips";
import { index as getCategories } from "../../service/api/post-category";
import { Calendar } from "primereact/calendar";
import { Editor } from "@tinymce/tinymce-react";
import Multiselect from "multiselect-react-dropdown";
import { Card } from "primereact/card";

const Edit = () => {
  const router = useRouter();
  const editorRef = useRef(null);
  const { id } = router.query; // Access the value of the "id" parameter
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: [],
    status: "",
    seoTitle: "",
    tags: "",
    publishAt: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const toast = useRef(null);
  const [slugAdded, setSlugAdded] = useState(false);


  const statuses = [
    { name: "Draft" },
    { name: "Active" },
    { name: "Scheduled" },
  ];
  const getData = () => {
    if (id) {
      show(id).then((data) => {
        setFormData(data);
      });
    }
    getCategories().then((data) => setCategories(data));
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "status") {
      value = value.name;
    }
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

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addCategory = (selectedItem) => {
    let items = selectedItem.map((doc) => ({ name: doc.name, _id: doc._id }));
    setFormData({ ...formData, category: items });
  };

  const removeCategory = (selectedItem) => {
    setFormData({ ...formData, category: selectedItem });
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
  

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <RedirectButton
          route="/post"
          label="All Post"
          icon="pi pi-chevron-right"
          severity="sucess"
          className="mr-2"
        />
      </React.Fragment>
    );
  };

   console.log(formData);
  const handleSubmit = async(e) => {
    e.preventDefault();
  
    const formVal = new FormData();
    formVal.append("name", formData.name);
    formVal.append("_id", formData._id);
    formVal.append("slug", formData.slug);
    formVal.append("status", formData.status);
    formVal.append("category", JSON.stringify(formData.category));
    formVal.append("tags", formData.tags);
    formVal.append("content", formData.content);
    formVal.append("publishAt", formData.publishAt);
    formVal.append("seoTitle", formData.seoTitle);
    formVal.append("seoDescription", formData.seoDescription);
    formVal.append("oldImage",formData.image);
    formVal.append("image", image);
  
    try {
      setIsLoading(true);
      // Assuming update is a function that returns a promise
      await update(formVal);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
      window.location.replace("/post");
    } catch (error) {
      console.error("Error updating:", error.message);
      // Handle error, show error toast, etc.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
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
              {/*<div className="field col-12 md:col-6">*/}
              {/*    <label htmlFor="tags">Tags</label>*/}
              {/*    <Chips id="tags" type="text" value={formData.tags} name="tags"  separator=","   onChange={handleChange}/>*/}
              {/*</div>*/}
              <div className="field col-12">
                <label htmlFor="content">Content</label>
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
                  name="content"
                  required
                  value={formData.content}
                  onEditorChange={(content) =>
                    handleChange({
                      target: { name: "content", value: content },
                    })
                  }
                  style={{ height: "320px" }}
                />
              </div>
            </div>
          </div>
          <Card title="SEO" className="card">
            <div className="flex flex-column gap-2">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                value={formData.seoTitle}
                name="seoTitle"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                rows={5}
                cols={30}
                value={formData.seoDescription}
                name="seoDescription"
                onChange={handleChange}
              />
            </div>
          </Card>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="field col-12">
              <label htmlFor="category">Category</label>
              {/* <Dropdown
                required
                value={formData.category}
                name="category"
                onChange={(e) => handleChange(e)}
                options={categories}
                optionLabel="name"
                placeholder="Category"
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
            <div className="field col-12">
              <label htmlFor="tags">Tags</label>
              <Chips
                id="tags"
                type="text"
                value={formData.tags}
                name="tags"
                className="w-full"
                separator=","
                onChange={handleChange}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="status">Status</label>
              <Dropdown
                value={formData.status}
                name="status"
                onChange={(e) => handleChange(e)}
                options={statuses}
                optionLabel="name"
                placeholder="Status"
                className="w-full"
              />
            </div>

            <div className="field col-12">
              <label htmlFor="publishAt">Publish At</label>
              <Calendar
                id="publishAt"
                value={formData.publishAt}
                name="publishAt"
                onChange={handleChange}
                showTime
                hourFormat="12"
                className="w-full"
              />
            </div>

            <Card title="Media" className="card">
              <input
                type="file"
                onChange={uploadImage}
              />
              {formData.image ? (
                <img width={"100%"} height={200} src={formData.image} alt="" />
              ) : null}
            </Card>

            {/*<div className="field col-12">*/}
            {/*    <label htmlFor="category"> Category</label>*/}
            {/*    <Dropdown  value={category} name="CategoryId" onChange={(e) => handleChange(e)} options={categories} optionLabel="name"*/}
            {/*               placeholder="Category" className="w-full" />*/}
            {/*</div>*/}

            <div className="flex justify-content-center">
              <Button
                onClick={handleSubmit}
                // type="submit"
                label={isLoading ? "Updating..." : "Update"}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Edit.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "", name: "Edit Post" } };
};

export default Edit;
