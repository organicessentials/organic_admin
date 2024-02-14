import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

const getSeverity = (value) => {
    switch (value) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
export  function handleRequestError(error, message) {
    if (error.response) {
        console.error(message, error.response.data);
    } else if (error.request) {
        console.error(message, 'No response received');
    } else {
        console.error(message, error.message);
    }
    throw error;
}


export const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
        return false;
    }

    str = str.replace(/^0+/, '') || '0';
    let n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
};

export const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
        case 'quantity':
        case 'price':
            if (isPositiveInteger(newValue)) rowData[field] = newValue;
            else event.preventDefault();
            break;

        default:
            if (newValue.trim().length > 0) rowData[field] = newValue;
            else event.preventDefault();
            break;
    }
};

export const cellEditor = (options) => {
    if (options.field === 'price') return priceEditor(options);
    else return textEditor(options);
};

export const textEditor = (options) => {
    return <InputText  required type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
};

export const priceEditor = (options) => {
    return <InputNumber required value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
};

export const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
};
export const statusEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Status"
            itemTemplate={(option) => {
                return <Tag value={option} severity={getSeverity(option)}></Tag>;
            }}
        />
    );
};

export const slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
export const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
};
