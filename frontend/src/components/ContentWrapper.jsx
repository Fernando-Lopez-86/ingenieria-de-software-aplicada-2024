import React from 'react';
import TopBar from './TopBar';
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
                    {/* <Footer /> */}
                </div>
            </div>
        </React.Fragment>
    );
}
export default ContentWrapper;