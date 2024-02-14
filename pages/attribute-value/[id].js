import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import {
  updateValue,
  destroyValue,
  indexValue,
  createValue,
} from "../../service/api/attribute-value";
const List = () => {
  const router = useRouter();
  const { id } = router.query; // Access the value of the "id" parameter
  const [records, setRecords] = useState([]);
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState("");
  const [formData, setFormData] = useState({
    name: "",
  });
  console.log(formData);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    if (id) {
      indexValue(id).then((data) => setRecords(data));
    } else {
      setRecords([]);
    }
  };

  const createData = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = { ...formData, id };
    createValue(data)
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Record Added",
          life: 3000,
        });
        setIsLoading(false);
        getData();
        setFormData({
          name: "",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: "error",
          detail: `Attribute already exists`,
          life: 3000,
        });
        setIsLoading(false);
        setFormData({
          name: "",
        });
      });
  };

  const setEdit = (record) => {
    setFormData(record);
    setShow(true);
  };

  const updateData = () => {
    setIsLoading(true);
    let data = { id: id, valId: formData._id, name: formData.name };
    updateValue(data).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Added",
        life: 3000,
      });
      setIsLoading(false);
      setFormData({
        name: "",
      });
      getData();
      setShow(false);
    });
  };

  const confirmDelete = (record) => {
    setRecord(record, id);
    setDeleteDialog(true);
  };
  const deleteAction = () => {
    if (record) {
      let data = { valId: record._id, id: id };
      destroyValue(data).then((data) => getData());
      setDeleteDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Deleted",
        life: 3000,
      });
    }
  };
  const editAction = (data) => {};

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

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => setEdit(rowData)}
        />
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-5">
        <h3>Add Attribute</h3>

        <div className="flex flex-column gap-2">
          <div className="p-fluid formgrid grid">
            <div className="field col-12">
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
            <div className="field col-12">
              {!show ? (
                <Button
                  onClick={createData}
                  type="submit"
                  label={isLoading ? "Creating..." : "Create"}
                />
              ) : (
                <Button
                  onClick={updateData}
                  type="submit"
                  label={isLoading ? "updating..." : "Update"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-7">
        <DataTable
          stripedRows
          value={records}
          paginator
          rows={10}
          tableStyle={{ minWidth: "20rem" }}
        >
          {/*<DataTable value={products} tableStyle={{ minWidth: '50rem' }}>*/}
          <Column field="name" header="Name"></Column>
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
    </div>
  );
};

export default List;
