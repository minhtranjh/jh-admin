import React from "react";
import "./Table.css";
import TableBody from "./TableBody/TableBody";
import TableHead from "./TableHead/TableHead";
const Table = ({
  tablePropertyList,
  tableDataList,
  rowHandlers,
  currentPage,
  rowsPerPage,
}) => {
  return (
    <table className="table">
      <TableHead tablePropertyList={tablePropertyList} />
      <TableBody
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        rowHandlers={rowHandlers}
        tableDataList={tableDataList}
        tablePropertyList={tablePropertyList}
      />
    </table>
  );
};

export default Table;
