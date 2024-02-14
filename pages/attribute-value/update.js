import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import {update, show, index} from '../../service/api/attribute-value';
import {Toast} from "primereact/toast";
import RedirectButton from "../../components/RedirectButton";
import {Toolbar} from "primereact/toolbar";
import { useRouter } from 'next/router';
import Add from "./add";

const Update = ({id,setEditId,updated,toast}) => {
    console.log(id);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState([]);
    const getData=() => {
        if(id){
            show(id).then(data =>{
                console.log(data);
                const {name}=data;
                setFormData({name});
            });
        }

    }

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
                updated();
                setEditId(null);
                setFormData({
                    name: '',
                });
            })
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/category" label="All Categories" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };

    useEffect(() => {
        getData();
    }, [id]);
    return (
        <div>
            <h3>Update Category</h3>

                    <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12">
                                <label htmlFor="title">Title</label>
                                <InputText id="title" type="text" value={formData.name} name="name" required  onChange={handleChange}/>
                            </div>
                            <div className="field col-12">
                                <Button type="submit" label={isLoading ? 'Updating...' : 'Update'}/>

                            </div>

                        </div>
                    </form>
            </div>

            );
};

export default Update;
