import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { showIdData, updateCreativeData } from "../../service/api/creative";
import { Dropdown } from "primereact/dropdown";
const status = ["Active", "Inactive"];

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  console.log(data.image);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    showIdData(id)
      .then((data) => setData(data))
      .catch((err) => err);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setData({
      ...data,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const updateData = (e) => {
   
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", data._id);
    formData.append("name",data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("image", data.image); 
    formData.append("altText", data.altText);
    formData.append("url", data.url);
    formData.append("status", data.status);
    formData.append("notes", data.notes);
    updateCreativeData(formData)
      .then((result) => {
        console.log(result);
        router.push('/creatives')
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card">
      <form onSubmit={updateData}>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Name</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              value={data.name}
              className="w-28rem"
              name="name"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Category</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              value={data.category}
              className="w-28rem"
              name="category"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              value={data.description}
              className="w-28rem"
              name="description"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Image</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              name="image"
              className="w-28rem"
              type="file"
            />
          </div>
        </div>
        <div className="field grid">
          <img height={300} width={560} src={data.image} alt="user" />
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Alt Text</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              name="altText"
              value={data.altText}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">URL</label>
          <div className="col-12 md:col-10">
            <InputText
              onChange={handleChange}
              name="url"
              value={data.url}
              className="w-28rem"
              type="text"
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
              onChange={handleChange}
              name="notes"
              value={data.notes}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <div className="col-12 md:col-10">
            <Button label="Update Creative" />
          </div>
        </div>
      </form>
    </div>
  );
};

Edit.getInitialProps = async () => {
  // You can set the value  getInitialProps
  return { pageTitle: { url: `/creatives`, name: "Update Creatives" } };
};
export default Edit;
