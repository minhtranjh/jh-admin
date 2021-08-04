import { useState } from "react";
import useQuery from "./useQuery";

const useFilter = (initialFilterList, submitApplyFilter) => {
  const [filterList, setFilterList] = useState(initialFilterList);
  const query = useQuery();
  const handleOnChangeFilter = (e) => {
    let value = e.target.value;
    if (e.target.type === "checkbox") {
      value = value === "false" ? true : false;
    }
    setFilterList((filterList) => ({
      ...filterList,
      [e.target.name]: { ...filterList[e.target.name], value: value },
    }));
  };
  const clearFilterForm = () => {
    const newList = { ...filterList };
    for (const input in newList) {
      newList[input].value = "";
    }
    setFilterList(newList);
  };
  const handleCreateFilterObject = () => {
    const newFilterList = { ...filterList };
    const filterObj = {};
    for (const filter in newFilterList) {
      if (query.get(filter)) {
        typeof newFilterList[filter].value !== "boolean"
          ? (newFilterList[filter].value = query.get(filter))
          : (newFilterList[filter].value =
              newFilterList[filter].value === true);
        newFilterList[filter].isOpen = true;
        filterObj[filter] = { ...newFilterList[filter] };
      } else {
        typeof newFilterList[filter].value !== "boolean"
          ? (newFilterList[filter].value = "")
          : (newFilterList[filter].value = false);
        newFilterList[filter].isOpen = false;
      }
    }
    setFilterList(newFilterList);
    return filterObj;
  };
  const handleOnAppyFilter = (e) => {
    e.preventDefault();
    let searchParams = "search=true&";
    for (const filter in filterList) {
      if (filterList[filter].isOpen) {
        searchParams += `${filter}=${filterList[filter].value}&`;
      }
    }
    submitApplyFilter(searchParams);
  };
  return {
    filterList,
    setFilterList,
    handleOnChangeFilter,
    handleOnAppyFilter,
    handleCreateFilterObject,
    clearFilterForm,
  };
};

export default useFilter;
