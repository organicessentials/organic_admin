import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import {useEffect, useState} from "react";

const Seo = ({handleSeo, toast,seo}) => {
    let [seoData, setSeoData] = useState({title: '', description:''});

    const handleChange = (e) => {
        let { name, value } = e.target;
        setSeoData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    useEffect(() => {
        handleSeo(seoData);
    },[seoData]);

    useEffect(() => {
        setSeoData(seo);
    },[seo]);
    return (
        <Card title="SEO" className="card">
            <div className="flex flex-column gap-2">
                <label htmlFor="title">Title</label>
                <InputText id="title"   value={seoData.title} name="title"   onChange={handleChange} />
            </div>
            <div className="flex flex-column gap-2">
                <label htmlFor="description">Description</label>
                <InputTextarea id="description"  rows={5} cols={30}  value={seoData.description} name="description"   onChange={handleChange}/>
            </div>

        </Card>

    );
};

export default Seo;
