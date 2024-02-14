import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { update, show } from "../../service/api/coupon";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const Update = () => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query; 
  console.log(id);
  const toast = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    date: "",
    minimum: "",
    maximum: "",
    amount: "",
    discount: "",
  });
  console.log(formData);

  useEffect(() => {
     getData()
  }, [id])

  const getData = () => {
    if (id) {
      show(id).then((data)=>{
        setFormData(data)
    })
    }
  }
  

  const publishOptions = [
    { name: "Active", code: "Active" },
    { name: "Draft", code: "Draft" },
  ];

  const discountOptions = [
    { name: "Percentage Discount", code: "Percentage Discount" },
  ];

  const handleDropdownChange = (e, field) => {
    setFormData({ ...formData, [field]: e.value });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "status" || name === "discount") {
      value = e.value; // Use e.value if it's a dropdown change
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleCalendarChange = (e) => {
    setFormData({ ...formData, date: e.value });
  };

  const handleSave = () => {
        update(formData)
        .then((res) => {
          console.log(res);
          setIsLoading(true);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Update Coupon Successfully",
            life: 3000,
          });
          router.push(`/coupons`);
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "error",
            detail:`${err.message}`, // Custom error message
            life: 3000,
          });
          setFormData({
            name: "",
          });
        });
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-8">
        <div className="card">
          <InputText
            onChange={handleInputChange}
            name="name"
            placeholder="Coupon Code"
            className="w-full"
            value={formData.name}
          />
        </div>
        <div className="card">
          <div className="field col-12">
            <label htmlFor="Discount type">Discount type</label>
            <Dropdown
              onChange={(e) => handleDropdownChange(e, "discount")}
              value={formData.discount}
              options={discountOptions}
              optionLabel="name"
              placeholder={formData.discount}
              className="w-full"
            />
          </div>
          <div className="field col-12">
            <label htmlFor="Coupon amount">Coupon amount</label>
            <InputText
              name="amount"
              onChange={handleInputChange}
              value={formData.amount}
              className="w-full"
              placeholder="0"
            />
          </div>
          <div className="field col-12">
          <label htmlFor="Coupon expiry date">Coupon expiry date</label>
<Calendar
  className="w-full"
  value={new Date(formData.date)} // Use "new Date" instead of "new date"
  onChange={handleCalendarChange}
/>

          </div>
          <div className="field col-12">
            <label htmlFor="Coupon amount">Minimum spend</label>
            <InputText
              name="minimum"
              onChange={handleInputChange}
              value={formData.minimum}
              className="w-full"
              placeholder="No Minimum"
            />
          </div>
          <div className="field col-12">
            <label htmlFor="Coupon amount">Maximum spend</label>
            <InputText
              name="maximum"
              onChange={handleInputChange}
              value={formData.maximum}
              className="w-full"
              placeholder="No Maximum"
            />
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="field col-12">
            <label htmlFor="publish">Publish</label>
            <Dropdown
              value={formData.status}
              onChange={(e) => handleDropdownChange(e, "status")}
              options={publishOptions}
              optionLabel="name"
              placeholder="Select publish"
              className="w-full"
            />
          </div>
          <div className="flex justify-content-center">
            <Button
              label={isLoading ? "Updating..." : "Update"}
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
