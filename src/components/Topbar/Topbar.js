import React from 'react';
import Avatar from '../Avatar/Avatar';
import SearchBar from '../SearchBar/SearchBar';
import "./Topbar.css"
import avatar from '../../assets/images/logo.png'
const Topbar = () => {
    return (
        <div className="topBar">
            <SearchBar label="Search"/>
            <Avatar picture={avatar}/>
        </div>
    );
};

export default Topbar;