
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  FileDown, 
  X, 
  Eye, 
  Clock, 
  CalendarDays,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { InvoiceHistory } from "@/types/invoice";
import { CurrencyType } from "./CalculatorState";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
        <p>{t("invoice:noInvoicesFound")}</p>
      </div>
    );
  }

  const getCurrencySymbol = (currency: CurrencyType) => {
    return currency === 'EUR' ? '€' : '$';
  };

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
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="py-3 px-4 text-left">{t("invoice:invoiceNumber")}</th>
                <th className="py-3 px-4 text-left">{t("invoice:date")}</th>
                <th className="py-3 px-4 text-left">{t("invoice:client")}</th>
                <th className="py-3 px-4 text-right">{t("invoice:amount")}</th>
                <th className="py-3 px-4 text-center">{t("invoice:actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <tr 
                    className={`hover:bg-gray-50 ${editingInvoiceId === invoice.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleRowExpand(invoice.id)}
                          className="mr-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <Eye size={16} />
                        </button>
                        {invoice.invoice_number}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(invoice.created_at), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      {invoice.client_info.name}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {getCurrencySymbol(currency)} {invoice.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onExportPDF(invoice.id)}
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          title={t("exportPDF")}
                        >
                          <FileDown size={16} />
                        </Button>
                        
                        {editingInvoiceId === invoice.id ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={onCancelEdit}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            title={t("cancelEdit")}
                          >
                            <X size={16} />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onStartEdit(invoice)}
                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            title={t("edit")}
                          >
                            <Edit size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(invoice.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          title={t("delete")}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === invoice.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-4 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:clientDetails")}</h4>
                            <p className="text-sm text-gray-600">{invoice.client_info.name}</p>
                            <p className="text-sm text-gray-600">{invoice.client_info.address}</p>
                            <p className="text-sm text-gray-600">{t("tvaNumber")}: {invoice.client_info.tvaNumber}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:invoiceDetails")}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <CalendarDays size={14} className="mr-1" /> {t("invoice:created")}: {format(new Date(invoice.created_at), 'PPP')}
                            </p>
                            {invoice.last_exported_at && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Clock size={14} className="mr-1" /> {t("invoice:lastExported")}: {format(new Date(invoice.last_exported_at), 'PPP')}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">{t("invoice:setupCost")}: {getCurrencySymbol(currency)} {invoice.setup_cost.toFixed(2)}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">{t("invoice:summary")}</h4>
                            <p className="text-sm text-gray-600">{t("invoice:totalMinutes")}: {invoice.total_minutes}</p>
                            <p className="text-sm text-gray-600">{t("invoice:callDuration")}: {invoice.call_duration} min</p>
                            <p className="text-sm text-gray-600">{t("margin")}: {invoice.margin}%</p>
                            <p className="text-sm text-gray-600">{t("taxRate")}: {invoice.tax_rate}%</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 flex justify-center border-t border-gray-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      <AlertDialog open={invoiceToDelete !== null} onOpenChange={() => setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("invoice:confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("invoice:deleteInvoiceConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>{t("invoice:cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("invoice:delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
