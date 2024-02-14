import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { create } from "../../service/api/post";
import { Toast } from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import { Toolbar } from "primereact/toolbar";
import List from "./index";
import { Chips } from "primereact/chips";
import { Editor } from "@tinymce/tinymce-react";
import { slugify } from "../../service/common";
import FeaturedImage from "../../components/FeaturedImage";
import { useRouter } from "next/navigation";
import { index as getCategories } from "../../service/api/post-category";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import Multiselect from "multiselect-react-dropdown";

const Add = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tags: [],
    content: "",
    category:[],
    seoTitle: "",
    seoDescription: "",
    status: "",
  });

  console.log(formData);
  const [categories, setCategories] = useState([]);

  const getData = () => {
    getCategories().then((data) => setCategories(data));
  };

  const router = useRouter();

  const statuses = [
    { name: "Draft" },
    { name: "Active" },
    { name: "Scheduled" },
  ];

  const toast = useRef(null);
  const [slugAdded, setSlugAdded] = useState(false);

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
    console.log(selectedItem);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category:JSON.stringify(selectedItem),
    }));
  };


  const removeCategory = (selectedItem) => {
    const remainingCategories = selectedItem.map((doc) => doc.name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: remainingCategories
    }));
  }


  console.log(formData);
  const handleSubmit = (event) => {
    const formVal = new FormData();
    for (const key in formData) {
      formVal.append(key, formData[key]);
    }
    formVal.append("image", image);
    event.preventDefault();
    setIsLoading(true);
    create(formVal).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
      router.push("/post/");

      setIsLoading(false);
      setFormData({
        name: "",
        slug: "",
        tags: "",
        content: "",
        category: "",
        seoTitle: "",
        seoDescription: "",
        status: "",
      });
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <RedirectButton
          route="/post"
          label="All Posts"
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
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
      </div>
      <form style={{ display: "inline-flex" }}>
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
                // selectedValues={formData.category} // Preselected value to persist in dropdown
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
                required
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
                name="publishAt"
                value={formData.publishAt}
                onChange={handleChange}
                showTime
                hourFormat="12"
                className="w-full"
              />
            </div>
            <Card title="Media" className="card">
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image ? <img width={"100%"} height={200} src={URL.createObjectURL(image)} alt="" /> : null}
            </Card>

            <div className="flex justify-content-center">
              <Button
                onClick={handleSubmit}
                label={isLoading ? "Creating..." : "Create"}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

Add.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/post/add", name: "Add Post" } };
};

export default Add;
