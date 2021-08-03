import React from "react";
import { useHistory } from "react-router-dom";
const TableBody = ({ tablePropertyList, tableDataList, rowHandlers }) => {
  const history = useHistory();
  return (
    <tbody>
      {tableDataList.length >0 ? tableDataList.map((rowData, index) => {
        return (
          <tr key={rowData.id}>
            {tablePropertyList.map((label) => (
              <td key={label.label} data-label={label.label}>
                {label.render({ rowData, index, rowHandlers, history })}
              </td>
            ))}
          </tr>
        );
      }):
      <tr className="tableNoResult" >
        <td colSpan={tablePropertyList.length} data-label="No results found">
          No results found
        </td>
      </tr>
      }
    </tbody>
  );
};

export default TableBody;
