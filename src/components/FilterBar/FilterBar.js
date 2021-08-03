import React from "react";
import { useEffect } from "react";
import "./FilterBar.css";
import FilterItem from "./FilterItem/FilterItem";
const FilterBar = ({
  filterList,
  handleOnChangeFilter,
  handleOnApplyFilter,
  setFilterList,
}) => {
  const dropdownRef = React.createRef();

  const hanldeToggleFilterCard = (filter) => {
    setFilterList({
      ...filterList,
      [filter]: {
        ...filterList[filter],
        isOpen: !filterList[filter].isOpen,
      },
    });
  };
  const renderListFilter = () => {
    const output = [];
    for (const filter in filterList) {
      const filterItem = (
        <FilterItem
          key={filterList[filter].name}
          name={filterList[filter].name}
          hanldeToggleFilterCard={hanldeToggleFilterCard}
          label={filterList[filter].label}
          isOpen={filterList[filter].isOpen}
          value={filterList[filter].value}
          onChange={handleOnChangeFilter}
          type={filterList[filter].type}
          options={filterList[filter].options}
          optionLabel={filterList[filter].optionLabel}
        />
      );
      output.push(filterItem);
    }
    return output;
  };
  const renderListFilterDropdown = () => {
    const output = [];
    for (const filter in filterList) {
      const filterItem = (
        <div
        key={filterList[filter].label}
          onClick={() => hanldeToggleFilterCard(filter)}
          className="filterDropItem"
        >
          {filterList[filter].label}
        </div>
      );
      output.push(filterItem);
    }
    return output;
  };
  const toggleListFilterDropdown = (e) => {
    e.stopPropagation();
    dropdownRef.current.classList.toggle("isOpen");
  };
  useEffect(() => {
    const hideListFilterDropdown = () => {
      if (dropdownRef && dropdownRef.current) {
        dropdownRef.current.classList.remove("isOpen");
      }
    };
    document.body.addEventListener("click", hideListFilterDropdown);
    return () => {
      document.body.removeEventListener("click", hideListFilterDropdown);
    };
  }, [dropdownRef]);
  return (
    <form onSubmit={handleOnApplyFilter} className="filterBar">
      {renderListFilter()}
      <div onClick={toggleListFilterDropdown} className="filterItem addFilter">
        <i className="fas fa-plus"></i>
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          className="filterDropdown"
        >
          {renderListFilterDropdown()}
        </div>
      </div>
      <div className="filterItem addFilter">
        <button>Apply</button>
      </div>
    </form>
  );
};

export default FilterBar;
