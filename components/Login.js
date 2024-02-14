import React, { useRef, useState } from "react";
import { adminLogin, resetPasswordApi } from "../service/api/admin";
import { Toast } from "primereact/toast";

const Login = () => {
  const toast = useRef(null);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible,setVisible] = useState(false)

  const login = (e) => {
    e.preventDefault()
    adminLogin(email, password)
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.accessToken);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Login Successfully",
          life: 3000,
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: "error",
          detail: `${err.response.data.message}`, // Custom error message
          life: 3000,
        });
      });
  };

  const resetPassword = async (e) => {
    e.preventDefault()
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      await resetPasswordApi(email);
      setShow(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Email sent successfully",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };
  
  

  return (
    <>
      <Toast ref={toast} />
      {!show ? (
        <form onSubmit={login}>
        <div className="px-5 min-h-screen flex justify-content-center align-items-center">
          <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
            <div className="mb-4">
              <div className="text-900 text-xl font-bold mb-2">Log in</div>
              <span className="text-600 font-medium">
                Please enter your details
              </span>
            </div>
            <div className="flex flex-column">
              <span className="p-input-icon-left w-full mb-4">
                <i className="pi pi-envelope"></i>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-inputtext p-component w-full md:w-25rem w-full md:w-25rem"
                  id="email"
                  type="text"
                  placeholder="Email"
                  data-pc-name="inputtext"
                  data-pc-section="root"
                />
              </span>
              <span className="p-input-icon-left w-full mb-4">
                <i className="pi pi-lock"></i>
                {visible?<i style={{marginLeft:"92%",cursor:"pointer"}} onClick={()=>setVisible(false)} className="pi pi-eye"></i>:
                <i style={{marginLeft:"92%",cursor:"pointer"}} onClick={()=>setVisible(true)} className="pi pi-eye-slash"></i>}
                <input
                 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-inputtext p-component w-full md:w-25rem w-full md:w-25rem"
                  id="password"
                  type={!visible?"password":"text"}
                  placeholder="Password"
                  data-pc-name="inputtext"
                  data-pc-section="root"
                />
                
              </span>
              <div className="mb-4 flex flex-wrap gap-3">
                <div>
                  <div
                    className="p-checkbox p-component mr-2"
                    data-pc-name="checkbox"
                    data-pc-section="root"
                  >
                    <div
                      className="p-hidden-accessible"
                      data-pc-section="hiddeninputwrapper"
                    >
                      <input
                        type="checkbox"
                        data-pc-section="hiddeninput"
                        name="checkbox"
                      />
                    </div>
                    <div
                      className="p-checkbox-box"
                      data-pc-section="input"
                    ></div>
                  </div>
                  <label for="checkbox" className="text-900 font-medium mr-8">
                    Remember Me
                  </label>
                </div>
                <a
                  onClick={() => setShow(true)}
                  className="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300"
                >
                  Reset password
                </a>
              </div>
              <button
                // onClick={login}
                type="submit"
                aria-label="Log In"
                className="p-button p-component w-full"
                data-pc-name="button"
                data-pc-section="root"
              >
                <span className="p-button-label p-c" data-pc-section="label">
                  Log In
                </span>
              </button>
            </div>
          </div>
        </div>
        </form>
      ) : (
        <form onSubmit={resetPassword}>
        <div className="px-5 min-h-screen flex justify-content-center align-items-center">
          <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
            <div className="mb-4">
              <div className="text-900 text-xl font-bold mb-2">
                Forgot Password
              </div>
              <span className="text-600 font-medium">
                Enter your email to reset your password
              </span>
            </div>
            <div className="flex flex-column">
              <span className="p-input-icon-left w-full mb-4">
                <i className="pi pi-envelope"></i>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-inputtext p-component w-full md:w-25rem w-full md:w-25rem"
                  id="email"
                  type="text"
                  placeholder="Email"
                  data-pc-name="inputtext"
                  data-pc-section="root"
                />
              </span>
              <div className="flex flex-wrap gap-2 justify-content-between">
                <button
                  onClick={() => setShow(false)}
                  aria-label="Cancel"
                  className="p-button p-component flex-auto p-button-outlined"
                  data-pc-name="button"
                  data-pc-section="root"
                >
                  <span className="p-button-label p-c" data-pc-section="label">
                    Cancel
                  </span>
                </button>
                <button
                  type="submit"
                  aria-label="Submit"
                  className="p-button p-component flex-auto"
                  data-pc-name="button"
                  data-pc-section="root"
                >
                  <span className="p-button-label p-c" data-pc-section="label">
                    Submit
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </form>
      )}
    </>
  );
};

export default Login;
