import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import {update, show, index} from '../../service/api/customer';
import {Toast} from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import {Toolbar} from "primereact/toolbar";
import { useRouter } from 'next/router';
import Add from "./add";

const Edit = () => {
    const router = useRouter();
    const { id } = router.query; // Access the value of the "id" parameter
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState([]);
    const getData=() => {
        if(id){
            show(id).then(data =>{
                const {name}=data;
                setFormData({name});
            });
        }

    }

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

        update(id,formData)
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
                <RedirectButton route="/customer" label="All customers" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    useEffect(() => {
        getData();
    }, [id]);
    return (
        <div className="grid">
            <div className="col-12">
                <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
                <div className="card">
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
                                <Button type="submit" label={isLoading ? 'Updating...' : 'Update'}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
Edit.getInitialProps = async () => {
    // You can set the value for pageTitle in getInitialProps
    return { pageTitle:{url:'',name:"Edit customer"} };
};

export default Edit;
