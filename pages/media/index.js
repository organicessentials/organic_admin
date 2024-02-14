import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { deleteId, show, showId, updateId, upload } from "../../service/api/media";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function index() {
  const [productDialog, setProductDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const toast = useRef(null);
  const inputEl = useRef(null);
  const [addFile,setAddFile] = useState(false)
  const [image,setImage] = useState("")

  const getData = () => {
    show()
      .then((result) => {
        setProducts(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    showId(id)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const openNew = (id) => {
    setId(id);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setProductDialog(false);
    setAddFile(false)
  };
  
  const copy = () => {
    navigator.clipboard.writeText(data.fileUrl)
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Copy Image Url",
        life: 3000,
      });
  }

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setImage(file)

  }
  const deleteData = ()=> {
    deleteId(data._id).then(()=>{
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Deleted Successfully",
        life: 3000,
      });
      window.location.reload()
    }).catch((err)=>{
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "error",
        life: 3000,
      });
    })
  }
  const saveData = (e) => {
    setProductDialog(false);
    e.preventDefault();
    updateId({id, data})
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Updated Successfully",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveImage = () => {
    const imageData = new FormData()
    imageData.append("image",image)
    upload(imageData)
    .then((result) => {
      setAddFile(false);
      getData();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Upload Image Successfully',
        life: 3000,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const gridItem = (product) => {
    return (
      <div
        onClick={() => openNew(product._id)}
        className="col-12 sm:col-6 lg:col-12 xl:col-3 p-2"
      >
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-column align-items-center gap-3">
            <img
              style={{ height: "100px" }}
              className="w-8shadow-2 border-round"
              src={product.fileUrl}
              alt={product.name}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product) => {
    return gridItem(product);
  };

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <Button onClick={()=>setAddFile(true)}>Add New Media File</Button>
      </div>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
    <Button label="Delete permanently" severity="danger" icon="pi pi-trash" outlined onClick={deleteData} />
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button severity="success" label="Save" icon="pi pi-check" onClick={saveData} />
    </React.Fragment>
  );

  return (
    <div style={{ cursor: "pointer" }} className="card">
     <Toast ref={toast} />
      <DataView
        value={products}
        itemTemplate={itemTemplate}
        header={header()}
      />

      <Dialog
        visible={productDialog}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Attachment Details"
        modal
        className="p-fluid w-11"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: "6" }}>
            <img style={{ width: "80%" }} src={data.fileUrl} alt="ss" />
          </div>
          <div style={{ flex: "4" }}>
            <div className="mt-8">
              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">
                  Alternative Text
                </label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="alterNativeText"
                    value={data.alterNativeText}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Caption</label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="caption"
                    value={data.caption}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">
                  Description
                </label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">
                  File URL:
                </label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="fileUrl"
                    value={data.fileUrl}
                    onChange={handleChange}
                    type="text"
                    required
                  />
                </div>
                <div className="mt-2">
                <Button onClick={copy} >Copy URL to clipboard</Button>
                </div>
      
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog onHide={hideDialog} modal visible={addFile}>
      <div style={{display:"flex",justifyContent:"center",margin:"20px"}}>
         <input style={{ display: "none" }}
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
            </div>
            {image ? (
              <div className="card">
              <img
                width={300}
                height={200}
                src={URL.createObjectURL(image)}
                alt=""
              />
              </div>
            ) : null}
        
        <div style={{display:"flex",justifyContent:"center"}}>
        <Button onClick={saveImage} severity="success">Save Image</Button>
        </div>
      </Dialog>
      
    </div>
  );
}

index.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: `/media`, name: "Media Page" } };
};
