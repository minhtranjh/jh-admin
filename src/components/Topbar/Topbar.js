import React from "react";
import Avatar from "../Avatar/Avatar";
import SearchBar from "../SearchBar/SearchBar";
import "./Topbar.css";
import avatar from "../../assets/images/logo.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getListMembersFromFirebase,
  searchMember,
} from "../../redux/actions/member";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";
const categories = [
  {
    id: "member",
    name: "Member Management",
    path: "/",
    type: "category",
  },
  {
    id: "team",
    name: "Team Management",
    path: "/team",
    type: "category",
  },
  {
    id: "user",
    name: "User Management",
    path: "/user",
    type: "category",
  },
  {
    id: "position",
    name: "Position Management",
    type: "category",
    path: "/position",
  },
];
const Topbar = () => {
  const dispatch = useDispatch();
  const [suggestion, setSuggestion] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { searchedList, fetchState } = useSelector((state) => state.member);
  const ref = useRef(null);
  
  const handleSearchSuggestion = (e) => {
    if (ref.current) {
      ref.current.style.display = "initital";
    }
      if (!e.target.value) {
        setSearchValue(e.target.value);
        dispatch(
          searchMember({
            name: {
              value: "123asdsd12esd21",
            },
          })
        );
        return setSuggestion([]);
      }
      const newList = categories.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      dispatch(
        searchMember({
          name: {
            value: e.target.value,
          },
        })
      );
      setSearchValue(e.target.value);
      setSuggestion(newList);
  };
  useEffect(() => {
    window.addEventListener("click", () => {
      if (ref.current) {
        ref.current.style.display = "none";
      }
    });
  }, [ref.current]);
  useEffect(() => {
    if (!fetchState) {
      dispatch(getListMembersFromFirebase(1, 10));
    }
  }, [fetchState]);
  return (
    <div className="topBar">
      <div className="searchWrapper">
        <SearchBar
          searchValue={searchValue}
          onChange={handleSearchSuggestion}
          label="Search"
        />
      </div>
      {searchValue && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={ref}
          className="suggestionBox"
        >
          {suggestion.length <= 0 && searchedList.length <= 0 ? (
            <p className="noResult">
              <i className="far fa-sad-tear"></i>No results found
            </p>
          ) : (
            ""
          )}
          <div className="suggestSep">
            {suggestion.length > 0 && <h4>Category</h4>}
            {suggestion.map((item) => (
              <NavLink to={item.path}>{item.name}</NavLink>
            ))}
          </div>
          <div className="suggestSep">
            {searchedList.length > 0 && <h4>Member</h4>}
            {searchedList.slice(0, 5).map((item) => (
              <NavLink to={`/member/${item.id}`}>
                <p className="searchedName">{item.name}</p>
                <p className="searchedPos">{item.position}</p>
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <div className="userAvatar">
        <Avatar picture={avatar} />
        <div className="profileDropdown">
          <p>Mint</p>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
