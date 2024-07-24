import React from 'react';
import '../assets/css/style.css';
import Logout from './Logout';

function TopBar(){
    return(
        <React.Fragment>
				{/*<!-- Topbar -->*/}
				<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow d-flex justify-content-between py-1">
                    <div className="w-100 d-flex justify-content-center">
                        <h1 className="h3 mb-0 text-gray-800 text-center">GESTION DE PEDIDOS GRAND ESTATE</h1>
                        <Logout />
                    </div>
				</nav>
				{/*<!-- End of Topbar -->*/}
        </React.Fragment>
    )
}
export default TopBar;