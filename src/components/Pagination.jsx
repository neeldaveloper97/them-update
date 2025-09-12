// components/shared/PaginationBar.jsx
'use client';
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination'; // shadcn/ui

const DOTS = 'dots';
const classNames = (...xs) => xs.filter(Boolean).join(' ');

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function getPaginationRange(
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1
) {
  const totalNumbers = siblingCount * 2 + 1; // around current
  const totalBlocks = totalNumbers + boundaryCount * 2 + 2; // +2 for two DOTS

  if (totalPages <= totalBlocks) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots = rightSibling < totalPages - boundaryCount - 1;

  const firstPages = range(1, boundaryCount);
  const lastPages = range(totalPages - boundaryCount + 1, totalPages);

  if (!showLeftDots && showRightDots) {
    const leftItemCount = boundaryCount + totalNumbers + 1;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, ...lastPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = boundaryCount + totalNumbers + 1;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [...firstPages, DOTS, ...rightRange];
  }

  const middleRange = range(leftSibling, rightSibling);
  return [...firstPages, DOTS, ...middleRange, DOTS, ...lastPages];
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  className,
  disabled = false,
  labels = {
    prev: 'Prev',
    next: 'Next',
    page: (n) => `Go to page ${n}`,
  },
}) {
  if (!totalPages || totalPages <= 1) return null;

  const items = getPaginationRange(
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount
  );
  const canGoPrev = !disabled && currentPage > 1;
  const canGoNext = !disabled && currentPage < totalPages;

  const baseBtn =
    'px-3 py-1 text-sm rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const normalBtn = 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100';
  const activeBtn = 'bg-org-primary text-white border-org-primary';
  const disabledBtn =
    'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-300';

  const goTo = (page) => {
    if (page === currentPage || page < 1 || page > totalPages || disabled)
      return;
    onChange(page);
  };

  return (
    <div className={classNames('p-3.5 lg:p-5', className)}>
      <Pagination className="justify-end">
        <PaginationContent className="gap-1.5">
          {/* Prev */}
          <PaginationItem>
            <button
              type="button"
              className={classNames(
                baseBtn,
                canGoPrev ? normalBtn : disabledBtn
              )}
              onClick={() => canGoPrev && goTo(currentPage - 1)}
              aria-label="Previous page"
              disabled={!canGoPrev}
            >
              {labels.prev || 'Prev'}
            </button>
          </PaginationItem>

          {/* Pages */}
          {items.map((it, idx) => {
            if (it === DOTS) {
              return (
                <PaginationItem key={`dots-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            const isActive = it === currentPage;
            return (
              <PaginationItem key={`page-${it}`}>
                <button
                  type="button"
                  className={classNames(
                    baseBtn,
                    isActive ? activeBtn : normalBtn
                  )}
                  onClick={() => goTo(it)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={
                    labels.page ? labels.page(it) : `Go to page ${it}`
                  }
                >
                  {it}
                </button>
              </PaginationItem>
            );
          })}

          {/* Next */}
          <PaginationItem>
            <button
              type="button"
              className={classNames(
                baseBtn,
                canGoNext ? normalBtn : disabledBtn
              )}
              onClick={() => canGoNext && goTo(currentPage + 1)}
              aria-label="Next page"
              disabled={!canGoNext}
            >
              {labels.next || 'Next'}
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
