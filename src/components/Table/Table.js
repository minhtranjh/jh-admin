import React from "react";
import "./Table.css"
import TableBody from "./TableBody/TableBody";
import TableHead from "./TableHead/TableHead";
const Table = ({tablePropertyList,tableDataList,handleRemoveItem}) => {
  return (
    <table className="table">
      <TableHead tablePropertyList={tablePropertyList}/>
      <TableBody handleRemoveItem={handleRemoveItem} tableDataList={tableDataList} tablePropertyList={tablePropertyList}/>
    </table>
  );
};

export default Table;
