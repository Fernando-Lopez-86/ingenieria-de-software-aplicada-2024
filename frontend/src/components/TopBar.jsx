import React from 'react';
import '../assets/css/style.css';

function TopBar(){
    return(
        <React.Fragment>
				{/*<!-- Topbar -->*/}
				<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow d-flex justify-content-between py-5">
                    <div>
                        <h1 className="h3 mb-0 text-gray-800">GESTION DE PEDIDOS - INGENIERIA DE SOFTWARE APLICADA</h1>
                    </div>

				</nav>
				{/*<!-- End of Topbar -->*/}
        </React.Fragment>
    )
}
export default TopBar;