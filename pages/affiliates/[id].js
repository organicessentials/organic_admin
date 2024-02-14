import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useRef, useState } from "react";
import {
  showAffiliateUserId,
  updateAffilateId,
} from "../../service/api/affilates";
import { Toast } from "primereact/toast";
const statusArray = ["Active", "InActive", "Pendding"];

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    showAffiliateUserId(id)
      .then((data) => {
        setData(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitData = (e) => {
    e.preventDefault();
    updateAffilateId(data)
      .then((result) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Updated Successfully",
          life: 3000,
        });
        setTimeout(() => {
          router.push("/affiliates");
        }, 1000);
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "error",
          detail: `${error.message}`, // Custom error message
          life: 3000,
        });
      });
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <form onSubmit={submitData}>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Affiliate Name</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.name}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Affiliate ID</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.affiliateId}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Affiliate URL</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.affiliateUrl}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">User ID</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data._id}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Username</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.userName}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">
            Registration Date
          </label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.createdAt}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">
            Affiliate Status
          </label>
          <div className="col-12 md:col-10">
            <Dropdown
              placeholder="Select Status"
              name="status"
              options={statusArray}
              value={data.status}
              onChange={handleChange}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Website</label>
          <div className="col-12 md:col-10">
            <InputText
              disabled
              value={data.webUrl}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">
            Referral Rate Type
          </label>
          <div className="col-12 md:col-10">
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  name="rateType"
                  value="Default"
                  onChange={handleChange}
                  checked={data.rateType === "Default"}
                />
                <label className="ml-2">Site Default</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  name="rateType"
                  value="Percentage"
                  onChange={handleChange}
                  checked={data.rateType === "Percentage"}
                />
                <label className="ml-2">Percentage (%)</label>
              </div>
            </div>
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Referral Rate</label>
          <div className="col-12 md:col-10">
            <InputText
              name="rate"
              onChange={handleChange}
              value={data.rate}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Account Email</label>
          <div className="col-12 md:col-10">
            <InputText
              name="email"
              onChange={handleChange}
              value={data.email}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Payment Email</label>
          <div className="col-12 md:col-10">
            <InputText
              name="paymentEmail"
              onChange={handleChange}
              value={data.paymentEmail}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Notes</label>
          <div className="col-12 md:col-10">
            <InputTextarea
              name="note"
              onChange={handleChange}
              value={data.note}
              className="w-28rem"
              type="text"
            />
          </div>
        </div>

        <div className="field grid">
          <div className="col-12 md:col-10">
            <Button type="submit" label="Update Affiliate" />
          </div>
        </div>
      </form>
    </div>
  );
};

Edit.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: "/affilates", name: "Affilates Edit Page" } };
};

export default Edit;
