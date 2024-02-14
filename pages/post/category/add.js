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
import {slugify} from "../../../service/common";

const Add = ({added,toast}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    });
    const [slugAdded, setSlugAdded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name ==='name' && !slugAdded){
            setFormData((prevFormData) => ({
                ...prevFormData,
                slug: slugify(value)
            }));
        }

        if(name ==='slug'){
            if(value == ''){
                setSlugAdded(false)
            }else{
                setSlugAdded(true)

            }
        }
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
                    slug: '',
                });
             })
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <RedirectButton route="/category" label="All Product Categories" icon="pi pi-chevron-right" severity="sucess" className="mr-2"  />
            </React.Fragment>
        );
    };
    return (

                <div>
                    <h3>Add Category</h3>

                    <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                        <div className="p-fluid formgrid grid">
                                <div className="field col-12">
                                    <label htmlFor="title">Title</label>
                                    <InputText id="title" type="text" value={formData.name} name="name" required  onChange={handleChange}/>
                                </div>
                            <div className="field col-12">
                                <label htmlFor="slug">Slug</label>
                                <InputText id="slug" type="text" value={formData.slug} name="slug" required  onChange={handleChange}/>
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
    return { pageTitle:{url:'/category/add',name:"Add Category"} };
};

export default Add;
