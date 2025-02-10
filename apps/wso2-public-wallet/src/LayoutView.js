import { Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import FooterBar from './components/footer/footer';
import NavBar from './components/navbar/navbar';
import Pages from './pages/pages';


function LayoutView() {

    const {Content} = Layout;
    const  location  = useLocation();
    const [isShowNavBar, setIsShowNavBar] = useState(true);

    useEffect (() => {
        if ( 
            location.pathname === '/wallet-phrase' 
            // || location.pathname === '/create-wallet'
        ){
            setIsShowNavBar(false);
           
        } else {
            setIsShowNavBar(true);

        }
    }, [location]);
    return (
        <Layout>

            {isShowNavBar && <NavBar />}
            <Content>
                <div className="site-layout-content">
                   <Pages />
                </div>
            </Content>
            {/* <FooterBar /> */}
        </Layout>
    )
}

export default LayoutView;