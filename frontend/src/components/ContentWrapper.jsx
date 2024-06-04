import React from 'react';
//import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';

function ContentWrapper(){
    return (
        <React.Fragment>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <TopBar />
                    <div className="container-fluid">
                        <Content />
                    </div>
                    <Footer />
                </div>
            </div>
        </React.Fragment>

        // <React.Fragment>
        //     {/*<!-- Content Wrapper -->*/}
        //     <div id="content-wrapper" className="d-flex flex-column">
        //         {/*<!-- Main Content -->*/}
        //         <div id="content">
        //             <TopBar />
        //             <div className="container-fluid">
        //                 <Outlet />
        //             </div>
        //             <Footer />
        //         </div>
        //     </div>    
        // </React.Fragment>
    );
}
export default ContentWrapper;