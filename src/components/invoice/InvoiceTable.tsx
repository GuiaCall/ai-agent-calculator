
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceHistory } from "@/types/invoice";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ITEMS_PER_PAGE_OPTIONS, DEFAULT_ITEMS_PER_PAGE } from "@/utils/paginationUtils";

interface InvoiceTableProps {
  invoices: InvoiceHistory[];
  onDelete: (id: string) => void;
  onPrint: (invoice: InvoiceHistory) => void;
  currencySymbol: string;
}

export function InvoiceTable({
  invoices,
  onDelete,
  onPrint,
  currencySymbol,
}: InvoiceTableProps) {
  const { t } = useTranslation();
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  
  // Reset to page 1 when itemsPerPage changes
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t("itemsPerPage")}:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
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
      </div>
    
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Last Export</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            currentInvoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                onDelete={onDelete}
                onPrint={onPrint}
                currencySymbol={currencySymbol}
              />
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <button
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
