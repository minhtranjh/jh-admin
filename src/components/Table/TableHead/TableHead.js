import React from "react";

const TableHead = ({ tablePropertyList }) => {
  return (
    <thead>
      <tr>
        {tablePropertyList.map((item) => (
          <th key={item.label}>{item.label}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
