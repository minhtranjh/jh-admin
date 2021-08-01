import React from 'react';
import "./PageContent.css"
const PageContent = ({children}) => {
    return (
        <div className="pageContent">
            {children}
        </div>
    );
};

export default PageContent;