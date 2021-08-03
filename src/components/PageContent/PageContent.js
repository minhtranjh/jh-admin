import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import "./PageContent.css"
const PageContent = ({children}) => {
    return (
        <div className="pageContent">
            {children}
        </div>
    );
};

export default PageContent;