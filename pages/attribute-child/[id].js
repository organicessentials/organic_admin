"use clinet";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect, useRef } from "react";
import { index, create } from "../../service/api/attribute-child";
import { Dialog } from "primereact/dialog";
import { Toast } from 'primereact/toast';
import { destroy } from "../../service/api/attribute-child";

const List = () => {
  const router = useRouter();
  const { id ,name} = router.query;
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [record,setRecord] =useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  console.log(id,name)

  useEffect(() => {
    fetchData(); // Call the async function immediately
    // You can add [id] to the dependency array if necessary, depending on your use case.
  }, [id]);

  const fetchData = async () => {
    if (id) {
      // const color = id.slice(24)
      // const Id = id.slice(0,24);
      let data = { id: id, name: name };

      try {
        const res = await index(data);
        let result = await res.attributeValue.filter(
          (doc) => doc.name === name
        );
        let x = result[0].value;
        setData(x);
      } catch (error) {
        // Handle errors here, e.g., show an error message
        console.error("Error fetching data:", error);
      }
    }
  };


  const submit = async (e) => {
    e.preventDefault();
    if (id) {
      // const color = id.slice(24);
      // const Id = id.slice(0, 24);
      let data = { id:id, name: name, value: input };
      try {
        const res = await create(data);
        console.log(res);
        let result = await res.attribute.attributeValue.filter(
          (doc) => doc.name === name
        );
        let x = result[0].value;
        setData(x);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Added', life: 3000 });
        setIsLoading(false);
        setInput("");
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "error",
          detail: `Attribute already exists`,
          life: 3000,
      });
      setIsLoading(false);
      setInput("");
      }
    }
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
  console.log(record);
  const confirmDelete = (record) => {
    setRecord(record);
    setDeleteDialog(true);
  };
  const deleteAction = () => {
    let data = {id:id,name:name,deleteId:record._id}
    destroy(data).then((data)=>fetchData())
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
  
  return (
    
    <div class="grid">
    <Toast ref={toast}  />
      <div class="col-5">
        <div class="mt-8 border-round-sm font-bold">
          <h2>Add Value</h2>
          <form onSubmit={submit} className="flex flex-column gap-2">
            <div className="p-fluid formgrid grid">
              <div className="field col-12">
                <label htmlFor="title">Title</label>
                <InputText
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  id="title"
                  type="text"
                  name="value"
                  required
                />
              </div>
              <div className="field col-12">
                <Button
                  type="submit"
                  label={isLoading ? "Creating..." : "Create"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="col-7">
        <div class="text-center mt-8 border-round-sm font-bold ">
          <DataTable value={data}>
            <Column field="name" header="Name"></Column>
            <Column
              className="col-2"
              body={actionBodyTemplate}
              exportable={false}
            ></Column>
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
  );
};

List.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/attribute-child", name: "Add Variants" } };
};

export default List;
