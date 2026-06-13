'use client';

import css from './Pagination.module.css'; // переконайтеся, що у вас є цей файл стилів

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Якщо сторінка лише одна, пагінацію можна не показувати
  if (totalPages <= 1) return null;

  return (
    <div className={css.paginationContainer}>
      <button
        className={css.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <span className={css.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={css.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
