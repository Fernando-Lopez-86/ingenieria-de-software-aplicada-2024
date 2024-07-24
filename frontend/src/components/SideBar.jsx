
import React from 'react';
import { Link } from "react-router-dom";
import image from '../assets/images/logo3.png';
import '../assets/css/style.css';

function SideBar(){
    return(
        <React.Fragment>
            <nav className="">
                <ul className="h-100 d-inline-block navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div className="sidebar-brand-icon">
                            <img className="w-100" src={image} alt=""/>
                        </div>
                    </a>

                    <hr className="sidebar-divider my-0"/>

                    <li className="nav-item container-fluid p-1 ml-4">
                        <Link className="text-white fw-bold" to={{pathname: "/"}} style={{fontSize: '1.3rem'}}>Pedidos</Link>
                    </li>

                    <li className="nav-item container-fluid p-1 ml-4">
                        <Link className="text-white fw-bold" to={{pathname: "/new"}} style={{fontSize: '1.3rem'}}>Nuevo</Link>
                    </li>

                    <li className="nav-item container-fluid p-1 ml-4">
                        <Link className="text-white fw-bold" to={{pathname: "/check"}} style={{fontSize: '1.3rem'}}>Controlar</Link>
                    </li>

                    <hr className="sidebar-divider d-none d-md-block"/>
                </ul>
            </nav>
        </React.Fragment>
    );
};

export default SideBar;