import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { update, show, index } from "../../service/api/page";
import { Toast } from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/router";
import Add from "./add";
import { slugify } from "../../service/common";
import Seo from "../../components/Seo";
import { Chips } from "primereact/chips";
import { Card } from "primereact/card";
import { Editor } from "@tinymce/tinymce-react";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query; // Access the value of the "id" parameter
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slugAdded, setSlugAdded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    status: "",
  });

  const statuses = [{ name: "Draft" }, { name: "Active" }];
  const getData = () => {
    if (id) {
      show(id).then((data) => {
        setFormData(data);
      });
    }
  };

  const toast = useRef(null);

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
  console.log(formData);
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    update(formData).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
      setIsLoading(false);
    });
  };
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <RedirectButton
          route="/page"
          label="All Pages"
          icon="pi pi-chevron-right"
          severity="sucess"
          className="mr-2"
        />
      </React.Fragment>
    );
  };

  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div className="grid">
      <div className="col-12">
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "inline-flex" }}>
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
            {/*<div className="field col-12">*/}
            {/*    <label htmlFor="tags">Tags</label>*/}
            {/*    <Chips id="tags" type="text" value={formData.tags} name="tags"  className="w-full"  separator=","   onChange={handleChange}/>*/}
            {/*</div>*/}
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
            {/*<div className="field col-12">*/}
            {/*    <label htmlFor="category"> Category</label>*/}
            {/*    <Dropdown  value={category} name="CategoryId" onChange={(e) => handleChange(e)} options={categories} optionLabel="name"*/}
            {/*               placeholder="Category" className="w-full" />*/}
            {/*</div>*/}
            <div className="flex justify-content-center">
              <Button
                type="submit"
                label={isLoading ? "Updating..." : "Update"}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
Edit.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "", name: "Edit Page" } };
};

export default Edit;
