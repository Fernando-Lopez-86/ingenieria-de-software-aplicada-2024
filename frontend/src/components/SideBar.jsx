import React from 'react';
import { Link } from "react-router-dom";
import image from '../assets/images/logo.png';
import '../assets/css/style.css';

function SideBar(){
    return(
        <nav className="sidebar">
            <ul className="navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion" id="accordionSidebar">

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div className="sidebar-brand-icon">
                        <img className="w-100" src={image} alt=""/>
                    </div>
                </a>

                <hr className="sidebar-divider my-0"/>
                <hr className="sidebar-divider"/>

                <div className="sidebar-heading">Menu</div>

                <li className="nav-item container-fluid p-1 ml-4">
                    <Link className="text-white fw-bold" to={{pathname: "/"}}>Pedidos</Link>
                </li>

                <li className="nav-item container-fluid p-1 ml-4">
                    <Link className="text-white fw-bold" to={{pathname: "/new"}}>Nuevo</Link>
                </li>

                <hr className="sidebar-divider d-none d-md-block"/>
            </ul>
        </nav>
    );
};

export default SideBar;