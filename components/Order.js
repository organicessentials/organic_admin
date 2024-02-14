import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { updateOrder, show, applyCoupon } from "../service/api/orders";

const Order = ({ order, getData }) => {
  console.log(order);
  const toast = useRef(null);

  const apply = () => {
    let name = prompt(
      "Enter a coupon code to apply. Discounts are applied to line totals, before taxes."
    );
    let couponData = {
      coupon: name,
      totalAmount: order?.order?.totalPrice,
      userId: order?.order?.userId,
    };
    applyCoupon(couponData)
      .then((response) => {
        console.log(response.data.type);
        toast.current.show({
          severity: `${response.data.type}`,
          summary: `${response.data.type}`,
          detail: response.data.message,
          life: 3000,
        });
        let data = {
          _id: order?.order._id,
          couponName: response.data.coupon.name,
          couponDiscount: response.data.coupon.discountedPrice,
        };
        updateOrder(data);
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3000,
        });
      });
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const recalculate = () => {
    //window.location.reload()
    getData();
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

  const totalPriceTemplate = (rowData) => {
    return <>{formatter.format(rowData.quantity * rowData.price)}</>;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-8">
          <div className="card border-noround">
            <DataTable value={order?.order?.orderItems}>
              <Column field="name" header="Name"></Column>
              <Column
                body={productImageTemplate}
                field="image"
                header="Image"
              ></Column>
              <Column field="price" header="Cost"></Column>
              <Column field="quantity" header="Qty"></Column>
              <Column
                body={totalPriceTemplate}
                field="quantity"
                header="Total"
              ></Column>
            </DataTable>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
      <div className="grid">
        <div className="col-8">
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
                <div className="flex align-items-center justify-content-center  font-bold border-round">
                  $ {order?.order?.paypalAmount}
                </div>
              </div>
            ) : null}
            <hr />
            <div className="flex justify-content-between flex-wrap">
              <div className="flex align-items-center justify-content-center  font-bold border-round">
                <i
                  className="pi pi-shopping-bag"
                  style={{ fontSize: "1.3rem", padding: "2px" }}
                ></i>
                <p className="ml-8">Free Express Shipping</p>
              </div>
              <div className="flex align-items-center justify-content-center  font-bold border-round">
                {formatter.format(order?.order?.shippingPrice)}
              </div>
            </div>
            <hr />
            <div className="flex justify-content-end flex-wrap">
              <div style={{ textAlign: "right", width: "250px" }}>
                <p>Items Subtotal:</p>
                {order?.order?.couponDiscount && <p>Coupon:</p>}
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
                <p>${order?.order?.totalPrice}</p>
                {order?.order?.couponDiscount && (
                  <p>
                    
                    {order?.order?.couponDiscount &&
                      formatter.format(order?.order?.couponDiscount)}
                  </p>
                )}
                <p>{formatter.format(order?.order?.shippingPrice)}</p>
                <p>
                  
                  {formatter.format(order?.order?.totalPrice+order?.order?.shippingPrice-order?.order?.couponDiscount)}
                </p>
              </div>
            </div>
            <hr />
            <div className="flex justify-content-between">
              <Button onClick={apply}>Apply Coupon</Button>
              <Button onClick={recalculate}>Recalculate</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
