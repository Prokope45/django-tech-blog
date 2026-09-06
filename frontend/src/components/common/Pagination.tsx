import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
    window.scrollTo(0, 0);
  };

  const pageWindow = getPageWindow(currentPage, totalPages);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        {currentPage > 1 && (
          <li className="page-item">
            <button className="page-link" onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
        )}
        {pageWindow.map((pageNum, idx) => {
          const prev = pageWindow[idx - 1];
          const needsEllipsis = prev !== undefined && pageNum - prev > 1;
          return (
            <span key={pageNum}>
              {needsEllipsis && (
                <li className="page-item disabled">
                  <span className="page-link">&hellip;</span>
                </li>
              )}
              <li className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => goToPage(pageNum)}>
                  {pageNum}
                </button>
              </li>
            </span>
          );
        })}
        {currentPage < totalPages && (
          <li className="page-item">
            <button className="page-link" onClick={() => goToPage(currentPage + 1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}