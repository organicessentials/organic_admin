import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

const RedirectButton = ({ route, label ,...other }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(route);
    };

    return (
        <Button {...other} label={label} onClick={handleClick}  />
    );
};

export default RedirectButton;
