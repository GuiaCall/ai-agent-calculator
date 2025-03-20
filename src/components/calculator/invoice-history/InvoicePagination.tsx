
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITEMS_PER_PAGE_OPTIONS } from "@/utils/paginationUtils";

interface InvoicePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
}

export function InvoicePagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: InvoicePaginationProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{t("invoice:itemsPerPage")}:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue placeholder={itemsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {totalPages > 1 && (
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; {t("invoice:previous")}
          </button>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            // Show pages around current page if there are many pages
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else {
              if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
            }
            
            return (
              <button
                key={pageToShow}
                className={`px-3 py-1 rounded ${
                  currentPage === pageToShow 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
                onClick={() => onPageChange(pageToShow)}
              >
                {pageToShow}
              </button>
            );
          })}
          
          <button
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {t("invoice:next")} &gt;
          </button>
        </div>
      )}
    </div>
  );
}
