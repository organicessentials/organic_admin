import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useRef, useState } from "react";
import { addRefferal, showAffiliateUser } from "../../service/api/referrals";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
const statusArray = ["Unpaid", "Paid", "Pending", "Rejected"];

const add = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    showAffiliateUser()
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(email);

  const submitData = (e) => {
    e.preventDefault();
  
    // Check if email and amount are not blank
    if (!email || !amount) {
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Email and Amount are required fields",
        life: 3000,
      });
      return;
    }
  
    addRefferal({ email, description, status, userId, date, amount })
      .then((result) => {
        toast.current.show({
          severity: "success",
          summary: "success",
          detail: "Record Added",
          life: 3000,
        });
        setTimeout(() => {
          router.push("/referrals");
        }, 1000);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "error",
          detail: `${err.message}`,
          life: 3000,
        });
      });
  };
  

  return (
    <div className="card">
      <Toast ref={toast} />
      <form onSubmit={submitData}>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Affiliate</label>
          <div className="col-12 md:col-10">
            <Dropdown
              placeholder="Name"
              name="status"
              options={items.map((item) => item.email)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-28rem"
              type="text"
              
              filter
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Amount</label>
          <div className="col-12 md:col-10">
            <InputText
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Referral Type</label>
          <div className="col-12 md:col-10">
            <InputText disabled value="Sale" className="w-28rem" type="text" />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Date</label>
          <div className="col-12 md:col-10">
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              className="w-28rem"
            />
          </div>
        </div>

        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
          <div className="col-12 md:col-10">
            <InputText
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>

        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Reference</label>
          <div className="col-12 md:col-10">
            <InputText
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              rows={4}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Status</label>
          <div className="col-12 md:col-10">
            <Dropdown
              placeholder="Select Status"
              name="status"
              options={statusArray}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-28rem"
              type="text"
              
            />
          </div>
        </div>
        <div className="field grid">
          <div className="col-12 md:col-10">
            <Button type="submit" label="Add Referral" />
          </div>
        </div>
      </form>
    </div>
  );
};

add.getInitialProps = async () => {
  // You can set the value  getInitialProps
  return { pageTitle: { url: `/referrals add`, name: "Add Referral" } };
};

export default add;
