import React, { useContext }  from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import '../assets/css/style.css';
import '../assets/css/style2.css';
import Logout from './Logout';
import image from '../assets/images/logo3.png';

function TopBar(){
    const { user } = useContext(UserContext);
    return(
        <React.Fragment>
				{/*<!-- Topbar -->*/}
                    <div className="w-100 d-flex justify-content-between align-items-center bg-dark">
                        <div className="w-25 sidebar-brand-icon ml-3 mt-3">
                            <img className="" src={image} alt=""/>
                        </div>
                        <div className="text-center flex-grow-1">
                            <h2 className="mb-0 text-white text-center">GESTION DE PEDIDOS GRAND ESTATE</h2>
                        </div>
                        <div className="w-25 mt-3">
                            <Logout />
                        </div>
                    </div>
				{/* <nav className="navbar navbar-expand-lg navbar-light bg-light border"> */}
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar mt-0 mb-0 pt-0 pb-2">
                    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul class="navbar-nav">
                            <li className="nav-item active">
                            <Link className="nav-link" to={{pathname: "/"}} style={{fontSize: '1.6rem'}}>Pedidos</Link>
                            </li>

                            <li className="nav-item active">
                                <Link className="nav-link" to={{pathname: "/new"}} style={{fontSize: '1.6rem'}}>Nuevo</Link>
                            </li>

                            {user && user.rol !== 'vendedor' && (
                                <li className="nav-item active">
                                    <Link className="nav-link" to={{pathname: "/check"}} style={{fontSize: '1.6rem'}}>Controlar</Link>
                                </li>
                            )}
                        </ul>
                    </div>
				</nav>
				{/*<!-- End of Topbar -->*/}
        </React.Fragment>
    )
}
export default TopBar;