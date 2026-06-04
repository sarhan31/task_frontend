import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@utils/cn';
import Button from "@components/ui/Button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-[#ead8cb]', className)}>
      <div className="flex flex-1 justify-between sm:hidden">
        <Button variant="custom" size="none"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-xl border border-[#e6d6ca] bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-[#fffaf6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button variant="custom" size="none"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-[#e6d6ca] bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-[#fffaf6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-2xl shadow-sm gap-1" aria-label="Pagination">
            <Button variant="custom" size="none"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-xl border border-[#e6d6ca] bg-white p-2 text-slate-400 hover:bg-[#e8f6f2] hover:text-[#13856f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {pages.map((p) => (
              <Button variant="custom" size="none"
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={currentPage === p ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center rounded-xl border px-3.5 py-2 text-sm font-semibold transition',
                  currentPage === p
                    ? 'z-10 bg-[#13856f] border-[#13856f] text-white shadow-[0_4px_12px_rgba(19,133,111,0.22)]'
                    : 'bg-white border-[#e6d6ca] text-slate-500 hover:bg-[#fffaf6] hover:border-[#13856f]'
                )}
              >
                {p}
              </Button>
            ))}

            <Button variant="custom" size="none"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-xl border border-[#e6d6ca] bg-white p-2 text-slate-400 hover:bg-[#e8f6f2] hover:text-[#13856f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
