import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"
                 className="fixed left-0 top-0 min-h-screen min-w-screen" preserveAspectRatio="none">
                <rect fill="var(--primary-500)" width="1600" height="800"></rect>
                <path fill="var(--primary-400)"
                      d="M0,0L100,50C200,100,400,200,600,300C800,400,1000,500,1200,400C1400,300,1600,200,1600,100L1600,800L0,800Z">
                </path>
            </svg>

            <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                <div className="mb-4">
                    <div className="text-900 text-xl font-bold mb-2">Log in</div>
                    <span className="text-600 font-medium">Please enter your details</span></div>
                <div className="flex flex-column"><span className="p-input-icon-left w-full mb-4"><i
                    className="pi pi-envelope"></i><input id="email" type="text"
                                                          className="p-inputtext p-component w-full md:w-25rem"
                                                          placeholder="Email" /></span><span
                    className="p-input-icon-left w-full mb-4"><i className="pi pi-lock"></i><input id="password"
                                                                                                   type="password"
                                                                                                   className="p-inputtext p-component w-full md:w-25rem"
                                                                                                   placeholder="Password" /></span>
                    <div className="mb-4 flex flex-wrap gap-3">
                        <div>
                            <div className="p-checkbox p-component mr-2">
                                <div className="p-hidden-accessible"><input type="checkbox" name="checkbox" /></div>
                                <div className="p-checkbox-box"><span className="p-checkbox-icon p-c"></span></div>
                            </div>
                            <label htmlFor="checkbox" className="text-900 font-medium mr-8">Remember Me</label></div>
                        <a className="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300">Reset
                            password</a></div>
                    <button aria-label="Log In" className="p-button p-component w-full"><span
                        className="p-button-label p-c">Log In</span><span role="presentation" className="p-ink"></span>
                    </button>
                </div>
            </div>        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
