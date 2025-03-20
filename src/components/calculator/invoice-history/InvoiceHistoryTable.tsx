
import React, { useState, useEffect } from "react";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "../CalculatorState";
import { useTranslation } from "react-i18next";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { InvoiceExpandedDetails } from "./InvoiceExpandedDetails";
import { InvoicePagination } from "./InvoicePagination";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { InvoiceEmptyState } from "./InvoiceEmptyState";
import { InvoiceTableHeaderRow } from "./InvoiceTableHeaderRow";
import { InvoiceSelectionActions } from "./InvoiceSelectionActions";
import { DEFAULT_ITEMS_PER_PAGE } from "@/utils/paginationUtils";

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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [multipleInvoicesToDelete, setMultipleInvoicesToDelete] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  
  // Get current invoices for pagination
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Reset pagination when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  
  // Reset selection when invoices change
  useEffect(() => {
    setSelectedInvoices([]);
    setIsMultiSelectMode(false);
  }, [invoices]);
  
  if (!invoices || invoices.length === 0) {
    return <InvoiceEmptyState />;
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

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
  };

  const toggleInvoiceSelection = (id: string) => {
    setSelectedInvoices(prev => {
      if (prev.includes(id)) {
        return prev.filter(invoiceId => invoiceId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.length === currentInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(currentInvoices.map(invoice => invoice.id));
    }
  };

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      setSelectedInvoices([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedInvoices.length > 0) {
      setMultipleInvoicesToDelete(selectedInvoices);
    }
  };

  const confirmBulkDelete = () => {
    multipleInvoicesToDelete.forEach(id => {
      onDeleteInvoice(id);
    });
    setMultipleInvoicesToDelete([]);
    setSelectedInvoices([]);
    setIsMultiSelectMode(false);
  };

  const cancelBulkDelete = () => {
    setMultipleInvoicesToDelete([]);
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm mt-8 animate-fadeIn">
        <div className="p-3 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{t("invoice:invoices")}</h3>
          <InvoiceSelectionActions
            isMultiSelectMode={isMultiSelectMode}
            selectedCount={selectedInvoices.length}
            onToggleMultiSelectMode={toggleMultiSelectMode}
            onBulkDelete={handleBulkDelete}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <InvoiceTableHeaderRow 
                isMultiSelectMode={isMultiSelectMode}
                onToggleSelectAll={toggleSelectAll}
                allSelected={currentInvoices.length > 0 && selectedInvoices.length === currentInvoices.length}
                hasInvoices={currentInvoices.length > 0}
              />
            </thead>
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
                    isMultiSelectMode={isMultiSelectMode}
                    isSelected={selectedInvoices.includes(invoice.id)}
                    onToggleSelect={() => toggleInvoiceSelection(invoice.id)}
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
        {totalPages > 0 && (
          <InvoicePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
      
      {/* Single Invoice Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={invoiceToDelete !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
      
      {/* Bulk Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={multipleInvoicesToDelete.length > 0}
        onCancel={cancelBulkDelete}
        onConfirm={confirmBulkDelete}
        count={multipleInvoicesToDelete.length}
      />
    </>
  );
}
