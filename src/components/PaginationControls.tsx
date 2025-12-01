import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  className?: string;
  label?: string;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  totalItems,
  className,
  label = "Rows",
}: PaginationControlsProps) => {
  const safeTotalPages = Math.max(totalPages || 1, 1);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(safeTotalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < safeTotalPages - 2) pages.push("ellipsis");
    pages.push(safeTotalPages);

    return pages;
  };

  const rangeLabel =
    pageSize && totalItems
      ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
          currentPage * pageSize,
          totalItems
        )} of ${totalItems}`
      : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <Pagination className="!w-auto sm:order-1">
        <PaginationContent className="gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 shadow-sm">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={cn(
                "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                currentPage === 1
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis className="text-gray-400" />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNum as number);
                  }}
                  isActive={pageNum === currentPage}
                  className={cn(
                    "cursor-pointer rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                    pageNum === currentPage &&
                      "border-transparent bg-[#8A5BD5] text-white hover:bg-[#7A4EC3]"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < safeTotalPages)
                  onPageChange(currentPage + 1);
              }}
              className={cn(
                "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                currentPage >= safeTotalPages
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {onPageSizeChange && pageSize && (
        <div className="flex items-center gap-3 sm:order-2 sm:justify-end">
          <span className="text-sm text-gray-600">{label}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-10 rounded-lg cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {rangeLabel && (
            <span className="text-sm text-gray-500">{rangeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
