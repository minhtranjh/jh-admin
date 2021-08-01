import { useState } from "react";

const useFilter = (initialFilterList, submitApplyFilter) => {
  const [filterList, setFilterList] = useState(initialFilterList);
  const handleOnChangeFilter = (e) => {
    let value = e.target.value;
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
  const handleOnAppyFilter = (e) => {
    e.preventDefault();
    submitApplyFilter();
  };
  return {
    filterList,
    setFilterList,
    handleOnChangeFilter,
    handleOnAppyFilter,
    clearFilterForm,
  };
};

export default useFilter;
