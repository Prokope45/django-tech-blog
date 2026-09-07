import { Fragment } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageWindow(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter(p => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return `${location.pathname}${qs ? `?${qs}` : ''}`;
  };

  const scrollTop = () => window.scrollTo(0, 0);

  const pageWindow = getPageWindow(currentPage, totalPages);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        {currentPage > 1 && (
          <li className="page-item">
            <Link
              className="page-link"
              to={buildHref(currentPage - 1)}
              onClick={scrollTop}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </Link>
          </li>
        )}
        {pageWindow.map((pageNum, idx) => {
          const prev = pageWindow[idx - 1];
          const needsEllipsis = prev !== undefined && pageNum - prev > 1;
          return (
            <Fragment key={pageNum}>
              {needsEllipsis && (
                <li className="page-item disabled">
                  <span className="page-link">&hellip;</span>
                </li>
              )}
              <li className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                <Link className="page-link" to={buildHref(pageNum)} onClick={scrollTop}>
                  {pageNum}
                </Link>
              </li>
            </Fragment>
          );
        })}
        {currentPage < totalPages && (
          <li className="page-item">
            <Link
              className="page-link"
              to={buildHref(currentPage + 1)}
              onClick={scrollTop}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}