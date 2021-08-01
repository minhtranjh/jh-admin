import React from 'react';
import "./Avatar.css"
const Avatar = ({picture,alt}) => {
    return (
            <img className="avatar" src={picture} alt={alt} />
    );
};

export default Avatar;