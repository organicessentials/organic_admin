import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Link from "next/link";

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"*/}
            {/*     className="fixed left-0 top-0 min-h-screen min-w-screen" preserveAspectRatio="none">*/}
            {/*    <rect fill="var(--primary-500)" width="1600" height="800"></rect>*/}
            {/*    <path fill="var(--primary-400)"*/}
            {/*          d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z"></path>*/}
            {/*    <path fill="var(--primary-300)"*/}
            {/*          d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"></path>*/}
            {/*    <path fill="var(--primary-200)"*/}
            {/*          d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"></path>*/}
            {/*    <path fill="var(--primary-100)"*/}
            {/*          d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"></path>*/}
            {/*</svg>*/}
            {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"*/}
            {/*     class="fixed left-0 top-0 min-h-screen min-w-screen" preserveAspectRatio="none">*/}
            {/*    <rect fill="var(--primary-500)" width="1600" height="800"></rect>*/}
            {/*    <path fill="var(--primary-400)"*/}
            {/*          d="M394.3,563.4c59.6,20.5,122.8,35.1,188.1,42.5c163.3,17.9,329.4-22.1,479.9-112.4c171.5-97.5,317.9-252.2,522.1-322.2c173.6-60.9,362-33.7,529.4,36.9V0H0v581.7C47.3,577.6,94.2,572.4,140.7,566C258.8,546.1,326,540.3,394.3,563.4z"></path>*/}
            {/*    <path fill="var(--primary-300)"*/}
            {/*          d="M136.4,394.4c68.5,11.8,136.6,30.8,202.7,55.5c59.7,22.6,119.3,47.8,174.2,78.2c94.7,53.8,176.8,125.2,280.7,159.3c137.4,40.8,280.6,10.7,411.1-38.5V0H0v433.8C51.8,415.5,93.5,402.1,136.4,394.4z"></path>*/}
            {/*    <path fill="var(--primary-200)"*/}
            {/*          d="M356.3,296.9c97.8,28.8,193.9,64.2,290.6,102.8c81.4,30.7,163.1,63,246.4,94c131.7,47.2,269.3,81.3,408.8,95.6c148.9,14.8,299.3,7.1,446.3-32.2V0H0v311.6C50.5,304.3,153.5,284.4,356.3,296.9z"></path>*/}
            {/*    <path fill="var(--primary-100)"*/}
            {/*          d="M1098.3,116.3c47.5-17.1,97-32.5,147.4-44.7c45.1-11.1,91.3-19,137.4-25.2c93.5-12.8,189.1-22.7,284.5-18.7c150.7,6.3,296.4,54.7,447.5,98.3v-226H0v240.5c43.9-14.4,88.8-25.9,135.1-34.4C249.4,128.9,373.4,127.2,498.3,120.7C779.6,104.5,939.3,123.4,1098.3,116.3z"></path>*/}
            {/*</svg>*/}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"
                 className="fixed left-0 top-0 min-h-screen min-w-screen" preserveAspectRatio="none">
                <rect fill="var(--primary-500)" width="1600" height="800"></rect>
                <path fill="var(--primary-400)"
                      d="M0,0L100,50C200,100,400,200,600,300C800,400,1000,500,1200,400C1400,300,1600,200,1600,100L1600,800L0,800Z">
                </path>
            </svg>


            <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                <div className="mb-4">
                    <div className="text-900 text-xl font-bold mb-2">Register</div>
                    <span className="text-600 font-medium">Let‘s get started</span></div>
                <div className="flex flex-column"><span className="p-input-icon-left w-full mb-4"><i
                    className="pi pi-user"></i><input id="username" type="text"
                                                      className="p-inputtext p-component w-full md:w-25rem"
                                                      placeholder="Username" /></span><span
                    className="p-input-icon-left w-full mb-4"><i className="pi pi-envelope"></i><input id="email"
                                                                                                       type="text"
                                                                                                       className="p-inputtext p-component w-full md:w-25rem"
                                                                                                       placeholder="Email" /></span><span
                    className="p-input-icon-left w-full mb-4"><i className="pi pi-lock"></i><input id="password"
                                                                                                   type="password"
                                                                                                   className="p-inputtext p-component w-full md:w-25rem"
                                                                                                   placeholder="Password" /></span>
                    <div className="mb-4 flex flex-wrap">
                        <div className="p-checkbox p-component mr-2">
                            <div className="p-hidden-accessible"><input type="checkbox" name="checkbox" /></div>
                            <div className="p-checkbox-box"><span className="p-checkbox-icon p-c"></span></div>
                        </div>
                        <label htmlFor="checkbox" className="text-900 font-medium mr-2">I have read the</label><a
                        className="text-600 cursor-pointer hover:text-primary cursor-pointer">Terms and Conditions</a>
                    </div>
                    <button aria-label="Sign Up" className="p-button p-component w-full mb-4"><span
                        className="p-button-label p-c">Sign Up</span><span role="presentation" className="p-ink"></span>
                    </button>
                    <span className="font-medium text-600">Already have an account? <Link
                        className="font-semibold cursor-pointer text-900 hover:text-primary transition-colors transition-duration-300" href="/auth/login">Login</Link></span>
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
