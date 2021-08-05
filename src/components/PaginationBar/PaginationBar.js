import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import useQuery from "../../utils/useQuery";
import "./PaginationBar.css";
const PaginationBar = ({
  rowsPerPage,
  handlePagingTable,
  isLoading,
  isFiltering,
}) => {
  const [listLiTag, setListLiTag] = useState([]);
  const history = useHistory();
  const query = useQuery();
  const pagingListTable = (currentPage) => {
    history.push({
      pathname: history.location.pathname,
      search: `?page=${currentPage}`,
    });
  };
  useEffect(() => {
    if (!isLoading) {
      const page = parseInt(query.get("page"));
      if (page) {
        handlePagingTable(page, rowsPerPage);
        renderListPageNumber(page);
        return;
      }
      renderListPageNumber(1);
    }
  }, [query.get("page"), isLoading]);
  const createPagingPrevButton = (page) => {
    const liTag = (
      <li
        key="prev"
        onClick={() => pagingListTable(page - 1, rowsPerPage)}
        className="page-btn prev"
      >
        <span>
          <i className="fas fa-angle-left"></i>
          Prev
        </span>
      </li>
    );
    return liTag;
  };
  const createPagingNextButton = (page) => {
    const liTag = (
      <li
        key="next"
        onClick={() => pagingListTable(page + 1, rowsPerPage)}
        className="page-btn next"
      >
        <span>
          Next
          <i className="fas fa-angle-left"></i>
        </span>
      </li>
    );
    return liTag;
  };
  const createPageNumber = (num, page) => {
    const liTag = (
      <li
        key={num}
        onClick={() => pagingListTable(num, rowsPerPage)}
        className={page === num ? "page-item is-active" : "page-item"}
      >
        <span> {num}</span>
      </li>
    );
    return liTag;
  };
  const createPagingDot = (key) => {
    const liTag = (
      <li key={key} className="page-item">
        <span>...</span>
      </li>
    );
    return liTag;
  };
  const renderListPageNumber = (page = 0) => {
    const totalPages = 10;
    let listLiTag = [];
    let numsBeforeCurrentPage = page - 1;
    let numsAfterCurrentPage = page + 1;
    if (page > 1) {
      const prevButton = createPagingPrevButton(page);
      listLiTag.push(prevButton);
    }
    if (page > 2) {
      const pageNumber = createPageNumber(1);
      listLiTag.push(pageNumber);
      if (page > 3) {
        const dots = createPagingDot("dot-r");
        listLiTag.push(dots);
      }
    }
    if (page === totalPages) {
      numsBeforeCurrentPage = numsBeforeCurrentPage - 2;
    } else if (page === totalPages - 1) {
      numsBeforeCurrentPage = numsBeforeCurrentPage - 1;
    }
    if (page === 1) {
      numsAfterCurrentPage = numsAfterCurrentPage + 2;
    } else if (page === 2) {
      numsAfterCurrentPage = numsAfterCurrentPage + 1;
    }
    for (
      let pageNum = numsBeforeCurrentPage;
      pageNum <= numsAfterCurrentPage;
      pageNum++
    ) {
      if (pageNum > totalPages) {
        continue;
      }
      if (pageNum === 0) {
        pageNum = pageNum + 1;
      }
      const pageNumber = createPageNumber(pageNum, page);
      listLiTag.push(pageNumber);
    }
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        const dots = createPagingDot("dot-l");
        listLiTag.push(dots);
      }
      const pageNumber = createPageNumber(totalPages);
      listLiTag.push(pageNumber);
    }
    if (page < totalPages) {
      const nextBtn = createPagingNextButton(page);
      listLiTag.push(nextBtn);
    }
    setListLiTag([...listLiTag]);
  };
  return (
    <div className="pagination-bar">
      <ul className="page-list">{listLiTag}</ul>
    </div>
  );
};

export default PaginationBar;
