import React, {useRef, useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import {create} from '../../../service/api/post-category';
import {Toast} from "primereact/toast";
import RedirectButton from "../../../components/RedirectButton";
import {Toolbar} from "primereact/toolbar";
import List from "./index";

const Add = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
    });
    const toast = useRef(null);
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
                setFormData({
                    name: '',
                });
             })
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/post/category" label="All Post Categories" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
                    <Toast ref={toast} />
                    <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                        <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="title">Title</label>
                                    <InputText id="title" type="text" value={formData.name} name="name" required  onChange={handleChange}/>
                                </div>
                            <div className="field col-12">

                            </div>
                            <div className="">
                                    <Button type="submit" label={isLoading ? 'Creating...' : 'Create'}/>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

Add.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle:{url:'/post-category/add',name:"Add Category"} };
};

export default Add;
