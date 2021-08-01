import React  from "react";
import "./LoadingIcon.css";
const LoadingIcon = ()=> {
    return (
      <div className={`loadingIcon`}>
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export default LoadingIcon;