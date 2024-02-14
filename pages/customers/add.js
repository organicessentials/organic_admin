import React, {useRef, useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import {create} from '../../service/api/customer';
import {Toast} from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import {Toolbar} from "primereact/toolbar";
import List from "./index";

const Add = ({added,toast}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

         create(formData)
             .then(() => {
                 toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Added', life: 3000 });
                 setIsLoading(false);
                 added();
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                });
             })
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/customer" label="All customers" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };
    return (

                <div>
                    <h3>Add Customer</h3>

                    <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                        <div className="p-fluid formgrid grid">
                                <div className="field col-12">
                                    <label htmlFor="firstname">First Name</label>
                                    <InputText id="firstName" type="text" value={formData.firstName} name="firstName" required  onChange={handleChange}/>
                                </div>
                            <div className="field col-12">
                                <label htmlFor="lastName">Last Name</label>
                                <InputText id="lastName" type="text" value={formData.lastName} name="lastName" required  onChange={handleChange}/>
                            </div>
                            <div className="field col-12">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" type="email" value={formData.email} name="email" required  onChange={handleChange}/>
                            </div>
                            <div className="field col-12">
                                <label htmlFor="phone">Phone</label>
                                <InputText id="phone" type="text" value={formData.phone} name="phone" required  onChange={handleChange}/>
                            </div>
                            <div className="field col-12">
                                <label htmlFor="password">Password</label>
                                <InputText id="password" type="password" value={formData.password} name="password" required  onChange={handleChange}/>
                            </div>
                            <div className="field col-12">
                                <Button type="submit" label={isLoading ? 'Creating...' : 'Create'}/>

                            </div>

                        </div>
                    </form>
                </div>

    );
};

Add.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle:{url:'/customer/add',name:"Add Customer"} };
};

export default Add;
