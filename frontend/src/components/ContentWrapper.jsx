import React from 'react';
import TopBar from './TopBar';
import Content from './Content';

function ContentWrapper(){
    return (
        <React.Fragment>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="">
                        <Content />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default ContentWrapper;