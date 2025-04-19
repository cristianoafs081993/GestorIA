import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Mail,
  MoreVertical,
  Calendar,
  ArrowUpDown,
  Loader2,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Invoice viewer component
const InvoiceViewer = ({ invoice, onClose }: { invoice: any, onClose: () => void }) => {
  return (
    <div className="bg-white p-8 rounded shadow-md">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NOTA FISCAL</h1>
          <p className="text-gray-600">Nº {invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-indigo-600">GestorIA</h2>
          <p className="text-gray-600">CNPJ: 12.345.678/0001-90</p>
          <p className="text-gray-600">contato@gestoria.com.br</p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Cliente</h3>
            <p className="font-medium">{invoice.sale.customer ? invoice.sale.customer.name : "Cliente não identificado"}</p>
            {invoice.sale.customer && (
              <>
                {invoice.sale.customer.email && <p className="text-sm">{invoice.sale.customer.email}</p>}
                {invoice.sale.customer.phone && <p className="text-sm">{invoice.sale.customer.phone}</p>}
                {invoice.sale.customer.address && (
                  <p className="text-sm">
                    {[
                      invoice.sale.customer.address,
                      invoice.sale.customer.city,
                      invoice.sale.customer.state,
                      invoice.sale.customer.zipCode
                    ].filter(Boolean).join(", ")}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-sm font-medium">Detalhes da Nota</h3>
            <p><span className="font-medium">Data de Emissão:</span> {formatDate(invoice.createdAt)}</p>
            <p><span className="font-medium">Status:</span> {invoice.status === "issued" ? "Emitida" : invoice.status}</p>
            {invoice.dueDate && (
              <p><span className="font-medium">Data de Vencimento:</span> {formatDate(invoice.dueDate)}</p>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-gray-500 text-sm font-medium mb-2">Itens</h3>
      <table className="min-w-full divide-y divide-gray-200 mb-8">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Produto</th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Quantidade</th>
            <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Preço Unitário</th>
            <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoice.sale.items && invoice.sale.items.map((item: any) => (
            <tr key={item.id}>
              <td className="py-4">{item.product.name}</td>
              <td className="py-4 text-center">{item.quantity}</td>
              <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-4 text-right">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-8">
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(invoice.sale.total - (invoice.sale.tax || 0) + (invoice.sale.discount || 0))}</span>
            </div>
            {invoice.sale.tax > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Taxa:</span>
                <span>{formatCurrency(invoice.sale.tax)}</span>
              </div>
            )}
            {invoice.sale.discount > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Desconto:</span>
                <span>-{formatCurrency(invoice.sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span className="text-indigo-600">{formatCurrency(invoice.sale.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 border-t pt-8 text-gray-500 text-sm">
        <p>Esta é uma nota fiscal eletrônica emitida por GestorIA.</p>
        <p className="mt-1">Em caso de dúvidas, entre em contato conosco através do email: contato@gestoria.com.br</p>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button className="gradient-bg hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

const Invoices = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isViewInvoiceDialogOpen, setIsViewInvoiceDialogOpen] = useState(false);
  const [isSendInvoiceDialogOpen, setIsSendInvoiceDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const { toast } = useToast();
  
  // Fetch invoices
  const { data: invoices, isLoading } = useQuery<any[]>({
    queryKey: ['/api/invoices'],
  });

  // Send invoice mutation
  const sendInvoice = useMutation({
    mutationFn: async ({ invoiceId, email }: { invoiceId: number, email: string }) => {
      return apiRequest('POST', `/api/invoices/${invoiceId}/send`, { email });
    },
    onSuccess: () => {
      setIsSendInvoiceDialogOpen(false);
      toast({
        title: "Nota fiscal enviada",
        description: "A nota fiscal foi enviada por email com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar nota fiscal",
        description: error.message || "Ocorreu um erro ao enviar a nota fiscal por email.",
        variant: "destructive",
      });
    }
  });

  // Cancel invoice mutation
  const cancelInvoice = useMutation({
    mutationFn: async (invoiceId: number) => {
      return apiRequest('POST', `/api/invoices/${invoiceId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Nota fiscal cancelada",
        description: "A nota fiscal foi cancelada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cancelar nota fiscal",
        description: error.message || "Ocorreu um erro ao cancelar a nota fiscal.",
        variant: "destructive",
      });
    }
  });

  // Toggle sort
  const toggleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle view invoice
  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewInvoiceDialogOpen(true);
  };

  // Handle send invoice
  const handleSendInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    if (invoice.sale.customer && invoice.sale.customer.email) {
      setEmailAddress(invoice.sale.customer.email);
    } else {
      setEmailAddress("");
    }
    setIsSendInvoiceDialogOpen(true);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'issued':
        return 'Emitida';
      case 'sent':
        return 'Enviada';
      case 'paid':
        return 'Paga';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Filter and sort invoices
  const filteredInvoices = invoices
    ?.filter(invoice => 
      invoice.invoiceNumber.includes(searchQuery) ||
      (invoice.sale.customer && invoice.sale.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      invoice.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "invoiceNumber") {
        return sortDirection === "asc" 
          ? a.invoiceNumber.localeCompare(b.invoiceNumber) 
          : b.invoiceNumber.localeCompare(a.invoiceNumber);
      } else if (sortField === "customer") {
        const customerA = a.sale.customer ? a.sale.customer.name : "";
        const customerB = b.sale.customer ? b.sale.customer.name : "";
        return sortDirection === "asc" 
          ? customerA.localeCompare(customerB) 
          : customerB.localeCompare(customerA);
      } else if (sortField === "total") {
        return sortDirection === "asc" 
          ? a.sale.total - b.sale.total 
          : b.sale.total - a.sale.total;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile view */}
      {isMobile && <Sidebar isMobile={true} />}
      
      {/* Desktop view */}
      {!isMobile && <Sidebar />}
      
      {/* Main Content */}
      <div className="sm:ml-64 pt-4 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Notas Fiscais</h1>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, cliente ou status..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <span className="ml-2 text-lg text-gray-500">Carregando notas fiscais...</span>
                </div>
              ) : filteredInvoices && filteredInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => toggleSort("invoiceNumber")}>
                            Nº da Nota
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => toggleSort("customer")}>
                            Cliente
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => toggleSort("createdAt")}>
                            Data
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => toggleSort("total")}>
                            Valor
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            {invoice.sale.customer ? invoice.sale.customer.name : "Cliente não identificado"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(invoice.createdAt)}</TableCell>
                          <TableCell>{formatCurrency(invoice.sale.total)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(invoice.status)}>
                              {getStatusLabel(invoice.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar por Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                {invoice.status !== 'canceled' && (
                                  <DropdownMenuItem 
                                    className="text-red-600" 
                                    onClick={() => {
                                      if (confirm(`Tem certeza que deseja cancelar a nota fiscal ${invoice.invoiceNumber}?`)) {
                                        cancelInvoice.mutate(invoice.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancelar Nota
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma nota fiscal encontrada</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    {searchQuery ? 
                      `Não encontramos notas fiscais correspondentes à sua busca "${searchQuery}".` : 
                      "Você ainda não emitiu nenhuma nota fiscal. Realize uma venda para gerar notas fiscais."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Invoice Dialog */}
      <Dialog open={isViewInvoiceDialogOpen} onOpenChange={setIsViewInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <InvoiceViewer 
              invoice={selectedInvoice} 
              onClose={() => setIsViewInvoiceDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={isSendInvoiceDialogOpen} onOpenChange={setIsSendInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar Nota Fiscal por Email</DialogTitle>
            <DialogDescription>
              Informe o endereço de email para onde deseja enviar a nota fiscal {selectedInvoice?.invoiceNumber}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Endereço de Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendInvoiceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gradient-bg hover:opacity-90"
              onClick={() => sendInvoice.mutate({ 
                invoiceId: selectedInvoice.id, 
                email: emailAddress 
              })}
              disabled={!emailAddress || sendInvoice.isPending}
            >
              {sendInvoice.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
