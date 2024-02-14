import React, {useRef, useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import {create} from '../../service/api/attribute';
import {Toast} from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import {Toolbar} from "primereact/toolbar";
import List from "./index";

const Add = ({added,toast}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
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
                    name: '',
                });
            }).catch((error)=>{
                toast.current.show({
                    severity: "error",
                    summary: "error",
                    detail: `Attribute already exists`,
                    life: 3000,
                });
                setIsLoading(false);
                setFormData({
                    name: '',
                });
            })
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/attribute" label="All Attributes" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };
    return (

        <div>
            <h3>Add Attribute</h3>

            <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="title">Title</label>
                        <InputText id="title" type="text" value={formData.name} name="name" required  onChange={handleChange}/>
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
    return { pageTitle:{url:'/attribute/add',name:"Add Attribute"} };
};

export default Add;
