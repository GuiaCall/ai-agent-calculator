
import React, { useState } from "react";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { useTranslation } from "react-i18next";
import { InvoiceTableHeader } from "./InvoiceTableHeader";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { InvoiceExpandedDetails } from "./InvoiceExpandedDetails";
import { InvoicePagination } from "./InvoicePagination";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface InvoiceHistoryTableProps {
  invoices: InvoiceHistory[];
  onExportPDF: (id: string) => void;
  onStartEdit: (invoice: InvoiceHistory) => void;
  onCancelEdit: () => void;
  onDeleteInvoice?: (id: string) => void;
  editingInvoiceId: string | null;
  currency: CurrencyType;
}

export function InvoiceHistoryTable({
  invoices,
  onExportPDF,
  onStartEdit,
  onCancelEdit,
  onDeleteInvoice = () => {},
  editingInvoiceId,
  currency
}: InvoiceHistoryTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { t } = useTranslation();
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  
  // Get current invoices for pagination
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  
  if (!invoices || invoices.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>{t("noInvoicesFound")}</p>
      </div>
    );
  }

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      onDeleteInvoice(invoiceToDelete);
      setInvoiceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setInvoiceToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm mt-8 animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <InvoiceTableHeader />
            <tbody className="divide-y divide-gray-200">
              {currentInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <InvoiceTableRow
                    invoice={invoice}
                    isEditing={editingInvoiceId === invoice.id}
                    onToggleExpand={toggleRowExpand}
                    isExpanded={expandedRowId === invoice.id}
                    onDelete={handleDeleteClick}
                    onExport={onExportPDF}
                    onEdit={onStartEdit}
                    onCancelEdit={onCancelEdit}
                    currency={currency}
                  />
                  
                  {expandedRowId === invoice.id && (
                    <InvoiceExpandedDetails invoice={invoice} currency={currency} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <InvoicePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      
      <DeleteConfirmationDialog
        isOpen={invoiceToDelete !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
