import React from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

function PrivateLayout() {
    return (
        <div id="wrapper" className="d-flex">
            {/* <SideBar /> */}
            <div id="content-wrapper" className="d-flex flex-column container-fluid">
            <TopBar />
                <div id="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default PrivateLayout;