import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { createCreative } from "../../service/api/creative";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { Dropdown } from "primereact/dropdown";

const status = ["Active", "Inactive"];

const add = () => {
  const toast = useRef(null);
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    category: "",
    description: "",
    image:null,
    altText: "",
    url: "",
    status: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setData({
      ...data,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const addCreatives = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("image", data.image); // Assuming data.image is a File object
    formData.append("altText", data.altText);
    formData.append("url", data.url);
    formData.append("status", data.status);
    formData.append("notes", data.notes);
    createCreative(formData).then((result) => {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
      router.push("/creatives");
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <form onSubmit={addCreatives}>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Name</label>
            <div className="col-12 md:col-10">
              <InputText
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Category</label>
            <div className="col-12 md:col-10">
              <InputText
                name="category"
                value={data.category}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
            <div className="col-12 md:col-10">
              <InputText
                name="description"
                value={data.description}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Image</label>
            <div className="col-12 md:col-10">
              <InputText
                name="image"
                className="w-28rem"
                onChange={handleChange}
                type="file"
                required
              />
            </div>
          </div>
          <div className="field grid">
            {data.image?<img height={300} width={560} src={URL.createObjectURL(data.image)} alt="user" />:null}
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Alt Text</label>
            <div className="col-12 md:col-10">
              <InputText
                name="altText"
                value={data.altText}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">URL</label>
            <div className="col-12 md:col-10">
              <InputText
                name="url"
                value={data.url}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Status</label>
            <div className="col-12 md:col-10">
              <Dropdown
                name="status"
                options={status}
                value={data.status}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">Notes</label>
            <div className="col-12 md:col-10">
              <InputText
                name="notes"
                value={data.notes}
                onChange={handleChange}
                className="w-28rem"
                type="text"
                required
              />
            </div>
          </div>
          <div className="field grid">
            <div className="col-12 md:col-10">
              <Button label="Add Creative" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

add.getInitialProps = async () => {
  // You can set the value  getInitialProps
  return { pageTitle: { url: "/creatives/add", name: "Add Creatives" } };
};

export default add;
