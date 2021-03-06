import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./SearchBar.css";
const SearchBar = ({ label, onChange, searchValue,openSuggestionBox }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleSearchBar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`searchBar ${isOpen ? "isOpen" : ""}`}>
      <input
        onClick={(e)=>{
          e.stopPropagation()
          openSuggestionBox()}}
        value={searchValue}
        onChange={onChange}
        type="text"
        placeholder={label}
      />
      <i onClick={handleToggleSearchBar} className="fas fa-search"></i>
    </div>
  );
};

export default SearchBar;
