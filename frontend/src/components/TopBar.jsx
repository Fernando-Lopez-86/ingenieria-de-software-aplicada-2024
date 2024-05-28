import React from 'react';
import '../assets/css/style.css';
// import Dolar from './Dolar'

function TopBar(){
    return(
        <React.Fragment>
				{/*<!-- Topbar -->*/}
				<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow d-flex justify-content-between py-5">
                    <div>
                        <h1 className="h3 mb-0 text-gray-800">Dashboard Grupo 09</h1>
                    </div>

                    {/* <Dolar/> */}

				</nav>
				{/*<!-- End of Topbar -->*/}
        </React.Fragment>
    )
}
export default TopBar;