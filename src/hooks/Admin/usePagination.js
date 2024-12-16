// hooks/usePagination.js
import { useState } from "react";

export const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage, totalPages) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return { currentPage, handlePageChange };
};
