import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { index } from "../../service/api/product";
import { applyCoupon, createBilling, createOrder, createShipping, showUers } from "../../service/api/orders";
import { nanoid } from 'nanoid'
import { Toast } from "primereact/toast";

const status = [
  { name: "Pending Payment" },
  { name: "Processing" },
  { name: "On Hold" },
  { name: "Completed" },
  { name: "Cancelled" },
  { name: "Failed" },
];

const Add = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
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
  const [search, setSearch] = useState("");
  const toast = useRef(null);
  const [date,setDate] = useState("")
  const [product, setProduct] = useState([]);
  const [qty, setQty] = useState("");
  const [order, setOrder] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [custmer, setCustmer] = useState([]);
  const [coupon, setCoupon] = useState("");
  const id = nanoid(24);

  const userS = () => {
    showUers().then((res) => setCustmer(res));
  };

  useEffect(() => {
    userS();
  }, []);

  const getData = () => {
    let orderItems = JSON.parse(localStorage.getItem("orderItems"));
    setOrder(orderItems);
  };

  useEffect(() => {
    getData();
  }, []);

  const showCoupon = () => {
    let couponData = JSON.parse(localStorage.getItem("coupon"));
    setCoupon(couponData);
  };

  useEffect(() => {
    showCoupon();
  }, []);

  const addItem = () => {
    setVisible(false);
    const orderItem = {
      id: search._id,
      name: search.name,
      price: search.variants[0].price,
      image: search.image,
      cartQuantity: Number(qty),
    };
    let orderItems = JSON.parse(localStorage.getItem("orderItems")) || [];
    orderItems.push(orderItem);
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    getData();
  };

  useEffect(() => {
    index()
      .then((res) => setProduct(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let billingData = JSON.parse(localStorage.getItem("billing"));
    setBilling(billingData);
  }, [])

  useEffect(() => {
    let shippingData = JSON.parse(localStorage.getItem("shipping"));
    setShipping(shippingData);
  }, [])
  

  const productsOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  const usersOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.email}</div>
      </div>
    );
  };

  const selectedCustmerTemplate = (option, props) => {
    console.log(option);
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.email}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const totalPriceTemplate = (rowData) => {
    return <>{rowData.cartQuantity * rowData.price}</>;
  };

  const productImageTemplate = (rowData) => {
    return (
      <>
        {rowData.image ? (
          <img
            src={rowData.image}
            className="w-6rem shadow-2 border-round"
            alt="Product Image Default"
          />
        ) : (
          <img
            src="/product/default.jpg"
            className="w-6rem shadow-2 border-round"
            alt="Product Image Default"
          />
        )}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
        /> */}
        <Button
          onClick={() => removeItem(rowData)}
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
        />
      </React.Fragment>
    );
  };

  const removeItem = (rowData) => {
    const newOrder = order.filter((item) => item.id !== rowData.id);
    setOrder(newOrder);
    localStorage.setItem("orderItems", JSON.stringify(newOrder));
  };

  const actionBodyTemplateQty = (rowData) => {
    return (
      <h5>
        {" "}
        <i
          onClick={() => updateQty(rowData)}
          style={{ fontSize: "1.3rem", cursor: "pointer" }}
          className="pi pi-minus-circle"
        ></i>{" "}
        {rowData.cartQuantity}{" "}
        <i
          onClick={() => updateQty(rowData, "increment")}
          style={{ fontSize: "1.3rem", cursor: "pointer" }}
          className="pi pi-plus-circle"
        ></i>
      </h5>
    );
  };

  const updateQty = (rowData, increment) => {
    const itemIndex = order.findIndex((item) => item.id === rowData.id);
    if (itemIndex !== -1) {
      const updatedOrder = [...order];
      if (increment) {
        updatedOrder[itemIndex].cartQuantity += 1;
      } else {
        updatedOrder[itemIndex].cartQuantity -= 1; // Decrement the quantity
        if (updatedOrder[itemIndex].cartQuantity < 1) {
          // Prevent negative quantity; remove the item if it's less than 1
          updatedOrder.splice(itemIndex, 1);
        }
      }

      // Update the 'order' state with the updated array
      setOrder(updatedOrder);

      // Update local storage with the updated 'order' array
      localStorage.setItem("orderItems", JSON.stringify(updatedOrder));
    }
  };

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
    localStorage.setItem("billing", JSON.stringify(billing));
    
  };

  const handleChangeShipping = (e)=>{
  setShipping({ ...shipping, [e.target.name]: e.target.value });
  localStorage.setItem("shipping", JSON.stringify(shipping));
  }

  const individualTotals = order?.map((item) => item.price * item.cartQuantity);

  // Calculate the grand total by summing up the individual totals
  const grandTotal = individualTotals?.reduce(
    (total, itemTotal) => total + itemTotal,
    0
  );

  const apply = () => {
    let name = prompt(
      "Enter a coupon code to apply. Discounts are applied to line totals, before taxes."
    );
    if (name) {
      const couponData = {
        coupon: name,
        totalAmount: grandTotal,
      };
      applyCoupon(couponData)
        .then((res) => {
          localStorage.setItem("coupon", JSON.stringify(res.coupon));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const saveOrder = () => {
    const requiredFields = [];
    if (!date) requiredFields.push("Date");
    if (!selectStatus) requiredFields.push("SelectStatus");
    if (requiredFields.length > 0) {
      const alertMessage = `Fields are required: ${requiredFields.join(",  ")}`;
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: alertMessage,
        life: 3000,
      });
    }else{
      let data = {
        userName:`${billing.firstName} ${billing.lastName}`,
        userId:id,
        orderStatus:selectStatus.name,
        email:billing.email,
        orderItems:order,
        paypalAmount:"",
        taxPrice:"",
        shippingPrice:"",
        totalPrice:grandTotal,
        totalQuantity:grandTotal,
        couponName:coupon?coupon?.name:"",
        couponDiscount:coupon?coupon?.discountedPrice:"",
        btcAmount:"",
        createdAt:date
      };
      createOrder(data).then((res)=>{
        console.log(res);
        createBilling(billing,id)
        createShipping(shipping,id)
        localStorage.removeItem("coupon");
        localStorage.removeItem("billing");
        localStorage.removeItem("orderItems");
        localStorage.removeItem("shipping");
        router.push('/orders')
      }).catch((err)=>{
        console.log(err);
      })
    }
  };

  return (
    <>
      <div className="card">
      <Toast ref={toast} />
        <h3>Order #312709 details</h3>
        <div className="grid">
          <div className="col-2">
            <h6>General</h6>
            <label htmlFor="">Date created</label>
            <Calendar value={date} onChange={(e)=>setDate(e.value)} className="w-full" />
            <label htmlFor="">Status</label>
            <Dropdown
              value={selectStatus}
              placeholder="Select Status"
              options={status}
              onChange={(e) => setSelectStatus(e.target.value)}
              optionLabel="name"
              className="w-full"
            />
            <label htmlFor="">Customer</label>
            <Dropdown
              value={search}
              onChange={(e) => setSearch(e.value)}
              options={custmer}
              optionLabel="email"
              placeholder="Select a User"
              filter
              valueTemplate={selectedCustmerTemplate}
              itemTemplate={usersOptionTemplate}
              className="w-full"
            />
          </div>
          <div className="col-5">
            <h6>Billing Address</h6>
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
                <label htmlFor="">Provided Note</label>
                <InputText
                  value={billing?.note}
                  onChange={handleChange}
                  className="w-full"
                  name="note"
                />
              </div>
            </div>
          </div>
          <div className="col-5">
            <h6>Shipping Address</h6>
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
                  className="w-full"
                  name="city"
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
                <label htmlFor="">Provided Note</label>
                <InputText
                  value={shipping?.note}
                  onChange={handleChangeShipping}
                  className="w-full"
                  name="note"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <DataTable value={order}>
          <Column field="name" header="Name"></Column>
          <Column
            field="image"
            body={productImageTemplate}
            header="Image"
          ></Column>
          <Column field="price" header="Cost"></Column>
          <Column
            body={actionBodyTemplateQty}
            field="cartQuantity"
            header="Qty"
          ></Column>
          <Column
            field="quantity"
            body={totalPriceTemplate}
            header="Total"
          ></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
      <div className="card">
        <div className="grid">
          <div className="col-12">
            <div className="card border-noround">
              {order?.order?.paymentMethod === "paypal" ? (
                <div class="flex justify-content-between flex-wrap">
                  <div class="flex align-items-center justify-content-center  font-bold border-round">
                    <i
                      className="pi pi-plus"
                      style={{
                        fontSize: "1.3rem",
                        border: "1px solid gray",
                        borderRadius: "12px",
                        padding: "2px",
                      }}
                    ></i>
                    <p className="ml-8">Paypal</p>
                  </div>
                  <div class="flex align-items-center justify-content-center  font-bold border-round">
                    $ {order?.order?.paypalAmount}
                  </div>
                </div>
              ) : null}
              <hr />
              <div class="flex justify-content-between flex-wrap">
                <div class="flex align-items-center justify-content-center  font-bold border-round">
                  <i
                    className="pi pi-shopping-bag"
                    style={{ fontSize: "1.3rem", padding: "2px" }}
                  ></i>
                  <p className="ml-8">Free Express Shipping</p>
                </div>
                <div class="flex align-items-center justify-content-center  font-bold border-round">
                  $0.00
                </div>
              </div>
              <hr />
              <div class="flex justify-content-end flex-wrap">
                <div style={{ textAlign: "right", width: "250px" }}>
                  <p>Items Subtotal:</p>
                  {coupon && <p>Coupon: {coupon.name}</p>}
                  <p>Shipping:</p>
                  <p>Order Total:</p>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    width: "150px",
                    fontWeight: "bold",
                  }}
                >
                  <p>$ {grandTotal}.00</p>
                  <p>{coupon && <p>${coupon.discountedPrice}.00</p>}</p>
                  <p>$.00</p>
                  <p>
                    ${" "}
                    {coupon ? grandTotal - coupon.discountedPrice : grandTotal}
                    .00
                  </p>
                </div>
              </div>
              <hr />
              <div className="flex justify-content-between">
                <div className="flex gap-4">
                  <Button onClick={() => setVisible(true)}>Add Item</Button>
                  <Button onClick={apply}>Apply Coupon</Button>
                </div>
                <Button onClick={saveOrder}>Save</Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header="Add Items"
          visible={visible}
          style={{ width: "40vw" }}
          onHide={() => setVisible(false)}
        >
          <div className="grid">
            <div className="col-6">
              <label htmlFor="">Product</label>
              <Dropdown
                value={search}
                onChange={(e) => setSearch(e.value)}
                options={product}
                optionLabel="name"
                placeholder="Select a Item"
                filter
                valueTemplate={selectedCountryTemplate}
                itemTemplate={productsOptionTemplate}
                className="w-full"
              />
            </div>
            <div className="col-4">
              <label htmlFor="">Qty</label>
              <InputText
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full"
                type="number"
              />
            </div>
          </div>
          <div className="flex justify-content-end">
            <Button onClick={addItem}>Add</Button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Add;

Add.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: ``, name: "Order Add" } };
};
