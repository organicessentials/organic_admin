import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import moment from "moment";
import {
  showBilling,
  showShipping,
  updateShipping,
  updateBilling,
  updateStatusAdmin,
  show,
  showUers,
} from "../service/api/orders";

const User = ({ order }) => {
  const toast = useRef(null);
  const [date, setDate] = useState(null);
  const [selectStatus, setSelectStatus] = useState("");
  const [data, setData] = useState({});
  const [trackingId,setTrackingId] = useState("")
  const [billing, setBilling] = useState({
    apartment: "",
    city: "",
    companyName: "",
    country: "",
    createdAt: "",
    firstName: "",
    lastName: "",
    state: "",
    street: "",
    updatedAt: "",
    userId: "",
    zipCode: "",
    phone: "",
    email: "",
    note: "",
  });
  const [shipping, setShipping] = useState({
    apartment: "",
    city: "",
    companyName: "",
    country: "",
    createdAt: "",
    firstName: "",
    lastName: "",
    state: "",
    street: "",
    updatedAt: "",
    userId: "",
    zipCode: "",
    phone: "",
    email: "",
    note: "",
  });

  const [visible, setVisible] = useState(false);
  const [shippingVisible, setShippingVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custmer, setCustmer] = useState([]);
    

  useEffect(() => {
    getData();
  }, [order?.billing]);


  const getData = async () => {
    if (order && order?.billing && order?.billing._id) {
      const id = order?.billing._id;
      try {
        const res = await showBilling(id);
        setBilling(res);
      } catch (error) {
        console.error("Error fetching billing data?:", error);
      }
    }
  };

  const getDataShipping = async () => {
    if (order && order?.shipping && order?.shipping._id) {
      const id = order?.shipping._id;
      try {
        const res = await showShipping(id);
        setShipping(res);
      } catch (error) {
        console.error("Error fetching billing data?:", error);
      }
    }
  };

  useEffect(() => {
    getDataShipping();
  }, [order?.shipping]);

  const showData = () => {
    if (order && order.order && order.order._id) {
      let id = order?.order?._id;
      show(id)
        .then((res) => {
          setData(res.order);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const userS = () => {
    showUers().then((res) => setCustmer(res));
  };

  useEffect(() => {
    userS();
  }, []);

  useEffect(() => {
    showData();
  }, [order?.order?._id]);

  const status = [
    { name: "Pending Payment" },
    { name: "Processing" },
    { name: "On Hold" },
    { name: "Completed" },
    { name: "Cancelled" },
    { name: "Failed" },
  ];
  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };
  const handleChangeShipping = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const editAddress = () => {
    setVisible(true);
  };
  const editAddressshipping = () => {
    setShippingVisible(true);
  };

  const updateBillingAdd = () => {
    updateBilling(billing)
      .then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "update Billing Successfully",
          life: 3000,
        });
        setVisible(false);
        getData();
      })
      .catch((err) => {
        toast.current.show({
          severity: "danger",
          summary: "Danger",
          detail: "Can not update",
          life: 3,
        });
      });
  };

  const updateShippingAddress = () => {
    updateShipping(shipping)
      .then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "update Shipping Successfully",
          life: 3000,
        });
        setShippingVisible(false);
        getDataShipping();
      })
      .catch((err) => {
        toast.current.show({
          severity: "danger",
          summary: "Danger",
          detail: "Can not update",
          life: 3,
        });
      });
  };

  const updateData = () => {
    if (selectStatus || order || createdAt) {
      let orderStatus = selectStatus.name;
      let ids = order.order._id;
      let createdAt = date;
      let userId = selectedCustomer?._id 
      updateStatusAdmin({ orderStatus, ids, createdAt,trackingId,userId })
        .then((res) => {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "update Successfully",
            life: 3000,
          });
        })
        .catch((err) => {
          toast.current.show({
            severity: "danger",
            summary: "Danger",
            detail: "Can not update",
            life: 3,
          });
        });
    }
  };

  useEffect(() => {
     setTrackingId(data?.trackingId)
  }, [data?.trackingId])
  

  const usersOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.email}</div>
      </div>
    );
  };

  const selectedCustmerTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.email}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-8">
          <div className="card border-noround">
            <h4>Order #{order?.order?.orderId} details</h4>
            <p style={{ fontSize: "14px" }}>
              Payment {data?.paymentMethod}{" "}
              {moment(data?.createdAt).format("LLL")} Customer IP:
              {order?.order?.ipAddress}
            </p>
            <div className="grid">
              <div className="col-4">
                <h6>General</h6>
                <p></p>
                <span>Date created:</span>
                <Calendar
                  className="w-full md:w-14rem"
                  value={date ? new Date(date) : new Date(data?.createdAt)}
                  onChange={(e) => setDate(e.value)}
                  showButtonBar
                />
                <span>Status:</span>
                <Dropdown
                  value={data?.orderStatus}
                  onChange={(e) => setSelectStatus(e.value)}
                  options={status}
                  optionLabel="name"
                  placeholder={
                    selectStatus.name
                      ? `${selectStatus.name}`
                      : `${data?.orderStatus}`
                  }
                  className="w-full md:w-14rem"
                />
                <span>Customer:</span>
                <Dropdown
                  filter
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.value)}
                  options={custmer}
                  placeholder="Select a Customer"
                  optionLabel="email"
                  className="w-full md:w-14rem"
                  valueTemplate={selectedCustmerTemplate}
                  itemTemplate={usersOptionTemplate}
                />
              </div>

              <div className="col-4">
                <div className="flex justify-content-between">
                  <h6>Billing</h6>
                  <Button
                    onClick={editAddress}
                    className="w-2rem h-2rem"
                    type="button"
                    icon="pi pi-pencil"
                    rounded
                  ></Button>
                </div>
                <p></p>
                <p>
                {order.billing?.firstName} {order.billing?.lastName}
                  {order?.billing?.apartment}
                  <br />
                  {order?.billing?.street} <br />
                  {order?.billing?.city} {order?.billing?.zipCode}
                </p>
                <span>Email address:</span>
                <p>{order.billing?.email}</p>
                <span>Phone:</span>
                <p>{order.billing?.phone}</p>
              </div>
              <div className="col-4">
                <div className="flex justify-content-between">
                  <h6>Shipping</h6>
                  <Button
                    onClick={editAddressshipping}
                    className="w-2rem h-2rem"
                    type="button"
                    icon="pi pi-pencil"
                    rounded
                  ></Button>
                </div>
                <p></p>
                <p>
                {order.shipping?.firstName} {order.shipping?.lastName}
                  {order?.shipping?.apartment}
                  <br />
                  {order?.shipping?.street} <br />
                  {order?.shipping?.city} {order?.shipping?.zipCode}
                </p>
                <span>Email address:</span>
                <p>{order.shipping?.email}</p>
                <span>Phone:</span>
                <p>{order.shipping?.phone}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-noround">
            <h6>Order</h6>
            <span>tracing</span>
            <p></p>
            <InputText onChange={(e)=>setTrackingId(e.target.value)} value={trackingId}  className="w-full " />
            <div className="flex justify-content-center mt-4">
              <Button onClick={updateData} label="Update" />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header="billing address"
        visible={visible}
        style={{ width: "40vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">FirstName</label>
            <InputText
              value={billing?.firstName}
              onChange={handleChange}
              className="w-full"
              name="firstName"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">LastName</label>
            <InputText
              value={billing?.lastName}
              onChange={handleChange}
              className="w-full"
              name="lastName"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Company</label>
            <InputText
              value={billing?.companyName}
              onChange={handleChange}
              className="w-full"
              name="companyName"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Street</label>
            <InputText
              value={billing?.street}
              onChange={handleChange}
              className="w-full"
              name="street"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Apartment</label>
            <InputText
              value={billing?.apartment}
              onChange={handleChange}
              className="w-full"
              name="apartment"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Country</label>
            <InputText
              value={billing?.country}
              onChange={handleChange}
              className="w-full"
              name="country"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">City</label>
            <InputText
              value={billing?.city}
              onChange={handleChange}
              className="w-full"
              name="city"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">State</label>
            <InputText
              value={billing?.state}
              onChange={handleChange}
              className="w-full"
              name="state"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Zip Code</label>
            <InputText
              value={billing?.zipCode}
              onChange={handleChange}
              className="w-full"
              name="zipCode"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Phone</label>
            <InputText
              value={billing?.phone}
              onChange={handleChange}
              className="w-full"
              name="phone"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Email Address</label>
            <InputText
              value={billing?.email}
              onChange={handleChange}
              className="w-full"
              name="email"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Customer Provided Note</label>
            <InputText
              value={billing?.note}
              onChange={handleChange}
              className="w-full"
              name="note"
            />
          </div>
        </div>
        <div className="flex justify-content-center mt-5">
          <Button onClick={updateBillingAdd}>Update</Button>
        </div>
      </Dialog>
      <Dialog
        header="Shipping address"
        visible={shippingVisible}
        style={{ width: "40vw" }}
        onHide={() => setShippingVisible(false)}
      >
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">FirstName</label>
            <InputText
              value={shipping?.firstName}
              onChange={handleChangeShipping}
              className="w-full"
              name="firstName"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">LastName</label>
            <InputText
              value={shipping?.lastName}
              onChange={handleChangeShipping}
              className="w-full"
              name="lastName"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Company</label>
            <InputText
              value={shipping?.companyName}
              onChange={handleChangeShipping}
              className="w-full"
              name="companyName"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Street</label>
            <InputText
              value={shipping?.street}
              onChange={handleChangeShipping}
              className="w-full"
              name="street"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Apartment</label>
            <InputText
              value={shipping?.apartment}
              onChange={handleChangeShipping}
              className="w-full"
              name="apartment"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Country</label>
            <InputText
              value={shipping?.country}
              onChange={handleChangeShipping}
              className="w-full"
              name="country"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">City</label>
            <InputText
              value={shipping?.city}
              onChange={handleChangeShipping}
              name="city"
              className="w-full"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">State</label>
            <InputText
              value={shipping?.state}
              onChange={handleChangeShipping}
              className="w-full"
              name="state"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Zip Code</label>
            <InputText
              value={shipping?.zipCode}
              onChange={handleChangeShipping}
              className="w-full"
              name="zipCode"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Phone</label>
            <InputText
              value={shipping?.phone}
              onChange={handleChangeShipping}
              className="w-full"
              name="phone"
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="">Email Address</label>
            <InputText
              value={shipping?.email}
              onChange={handleChangeShipping}
              className="w-full"
              name="email"
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Customer Provided Note</label>
            <InputText
              value={shipping?.note}
              onChange={handleChangeShipping}
              className="w-full"
              name="note"
            />
          </div>
        </div>
        <div className="flex justify-content-center mt-5">
          <Button onClick={updateShippingAddress}>Update</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default User;
