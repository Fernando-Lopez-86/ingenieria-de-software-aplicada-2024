import React from 'react';
import { Link } from "react-router-dom";
import image from '../assets/images/logo.png';
import '../assets/css/style.css';

function SideBar(){
    return(
        <React.Fragment>
            {/*<!-- Sidebar -->*/}
            <ul className="navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion" id="accordionSidebar">

                {/*<!-- Sidebar - Brand -->*/}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div className="sidebar-brand-icon">
                        <img className="w-100" src={image} alt="Digital House"/>
                    </div>
                </a>

                {/*<!-- Divider -->*/}
                <hr className="sidebar-divider my-0"/>

                {/*<!-- Divider -->*/}
                <hr className="sidebar-divider"/>

                {/*<!-- Heading -->*/}
                <div className="sidebar-heading">Menu</div>

                {/*<!-- Nav Item - Productos -->*/}
                <li className="nav-item container-fluid p-1 ml-4">
                    <Link className="text-white fw-bold" to={{pathname: "/pedidos"}}>Pedidos</Link>
                </li>

                {/*<!-- Nav Item - Productos -->*/}
                <li className="nav-item container-fluid p-1 ml-4">
                    <Link className="text-white fw-bold" to={{pathname: "/categorias"}}>Categorias</Link>
                </li>

                {/*<!-- Nav Item - Usuarios -->*/}
                <li className="nav-item container-fluid p-1 ml-4">
                    <Link className="text-white fw-bold" to={{pathname: "/usuarios"}}>Usuarios</Link>
                </li>

                {/*<!-- Divider -->*/}
                <hr className="sidebar-divider d-none d-md-block"/>
            </ul>
            {/*<!-- End of Sidebar -->*/}
            
        </React.Fragment>
    )
}

export default SideBar;