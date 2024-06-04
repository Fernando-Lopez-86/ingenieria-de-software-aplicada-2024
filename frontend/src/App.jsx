import React from 'react';
//import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './components/SideBar';
import ContentWrapper from './components/ContentWrapper';
import './assets/css/app.css';
import './assets/css/style2.css';

function App() {
    return (
        // <Router>
            <div id="wrapper">
                <SideBar />
                <ContentWrapper />
            </div>
        // </Router>
    );
}

export default App;
