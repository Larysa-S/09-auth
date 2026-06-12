'use client'; // Обов'язково вказуємо, що це клієнтський компонент

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Захист від невалідних даних (NaN, undefined, 0, null):
  if (!totalPages || Number.isNaN(totalPages) || totalPages <= 1) {
    return null;
  }

  const handlePageClick = (selectedItem: { selected: number }): void => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={totalPages}
      onPageChange={handlePageClick}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.prevItem}
      nextClassName={css.nextItem}
      disabledClassName={css.disabled}
    />
  );
}
