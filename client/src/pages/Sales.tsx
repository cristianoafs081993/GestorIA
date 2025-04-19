import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2,
  Search, 
  Plus, 
  ShoppingBag, 
  CreditCard,
  DollarSign,
  Users,
  Check,
  X,
  Eye,
  ArrowUpDown,
  Calendar,
  Download,
  ChevronDown,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data - in a real app this would come from the API
const mockSales = [
  {
    id: 1,
    customer: {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
    },
    total: 1250.0,
    tax: 125.0,
    discount: 50.0,
    paymentMethod: "credit_card",
    status: "completed",
    createdAt: "2025-04-10T14:30:00Z",
    items: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Smartphone XS",
          sku: "PHN-001",
        },
        quantity: 1,
        price: 1300.0,
        totalPrice: 1300.0,
      },
    ],
  },
  {
    id: 2,
    customer: {
      id: 2,
      name: "Maria Oliveira",
      email: "maria@example.com",
    },
    total: 350.0,
    tax: 35.0,
    discount: 0,
    paymentMethod: "money",
    status: "completed",
    createdAt: "2025-04-12T10:15:00Z",
    items: [
      {
        id: 2,
        product: {
          id: 2,
          name: "Fones de Ouvido Bluetooth",
          sku: "AUD-002",
        },
        quantity: 1,
        price: 350.0,
        totalPrice: 350.0,
      },
    ],
  },
  {
    id: 3,
    customer: {
      id: 3,
      name: "Carlos Pereira",
      email: "carlos@example.com",
    },
    total: 2700.0,
    tax: 270.0,
    discount: 100.0,
    paymentMethod: "pix",
    status: "pending",
    createdAt: "2025-04-15T16:45:00Z",
    items: [
      {
        id: 3,
        product: {
          id: 3,
          name: "Notebook Pro",
          sku: "NTB-003",
        },
        quantity: 1,
        price: 2800.0,
        totalPrice: 2800.0,
      },
    ],
  },
  {
    id: 4,
    customer: null,
    total: 450.0,
    tax: 45.0,
    discount: 0,
    paymentMethod: "money",
    status: "completed",
    createdAt: "2025-04-17T09:20:00Z",
    items: [
      {
        id: 4,
        product: {
          id: 4,
          name: "Mouse sem fio",
          sku: "PER-004",
        },
        quantity: 3,
        price: 150.0,
        totalPrice: 450.0,
      },
    ],
  },
  {
    id: 5,
    customer: {
      id: 5,
      name: "Ana Souza",
      email: "ana@example.com",
    },
    total: 520.0,
    tax: 52.0,
    discount: 30.0,
    paymentMethod: "credit_card",
    status: "completed",
    createdAt: "2025-04-18T13:10:00Z",
    items: [
      {
        id: 5,
        product: {
          id: 5,
          name: "Teclado Mecânico",
          sku: "PER-005",
        },
        quantity: 1,
        price: 550.0,
        totalPrice: 550.0,
      },
    ],
  },
];

const Sales = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Normally we'd fetch from API
  // const { data: sales, isLoading } = useQuery<any[]>({
  //   queryKey: ['/api/sales'],
  // });
  
  // Using mock data for now
  const sales = mockSales;
  const isLoading = false;

  // Sort sales
  const sortedSales = sales
    ? [...sales].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "total") {
          return sortConfig.direction === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }

        if (sortConfig.key === "createdAt") {
          return sortConfig.direction === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      })
    : [];

  // Filter sales by search query and tab
  const filteredSales = sortedSales?.filter((sale) => {
    const matchesSearch =
      (sale.customer?.name && 
        sale.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sale.id.toString().includes(searchQuery) ||
      (sale.paymentMethod && 
        getPaymentMethodName(sale.paymentMethod).toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentTab === "all") return matchesSearch;
    if (currentTab === "completed" && sale.status === "completed") return matchesSearch;
    if (currentTab === "pending" && sale.status === "pending") return matchesSearch;
    if (currentTab === "cancelled" && sale.status === "cancelled") return matchesSearch;

    return false;
  });

  // Stats for sales overview
  const totalSales = sales ? sales.length : 0;
  const completedSales = sales ? sales.filter(s => s.status === "completed").length : 0;
  const pendingSales = sales ? sales.filter(s => s.status === "pending").length : 0;
  const cancelledSales = sales ? sales.filter(s => s.status === "cancelled").length : 0;
  
  const totalRevenue = sales
    ? sales
        .filter(s => s.status === "completed")
        .reduce((sum, sale) => sum + sale.total, 0)
    : 0;

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // View sale details
  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setIsDetailDialogOpen(true);
  };

  // Export sales to CSV
  const exportToCSV = () => {
    if (!sales || sales.length === 0) return;

    const headers = [
      "ID",
      "Cliente",
      "Total",
      "Imposto",
      "Desconto",
      "Método de Pagamento",
      "Status",
      "Data",
    ];
    
    const rows = sales.map((sale) => [
      sale.id,
      sale.customer?.name || "Cliente não cadastrado",
      sale.total,
      sale.tax,
      sale.discount,
      getPaymentMethodName(sale.paymentMethod),
      getStatusName(sale.status),
      format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper functions for formatting
  function getPaymentMethodName(method: string) {
    switch (method) {
      case "credit_card": return "Cartão de Crédito";
      case "debit_card": return "Cartão de Débito";
      case "money": return "Dinheiro";
      case "pix": return "PIX";
      case "bank_transfer": return "Transferência Bancária";
      default: return method;
    }
  }

  function getPaymentMethodIcon(method: string) {
    switch (method) {
      case "credit_card": return <CreditCard className="h-4 w-4" />;
      case "debit_card": return <CreditCard className="h-4 w-4" />;
      case "money": return <DollarSign className="h-4 w-4" />;
      case "pix": return <CreditCard className="h-4 w-4" />;
      case "bank_transfer": return <CreditCard className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  }

  function getStatusName(status: string) {
    switch (status) {
      case "completed": return "Concluída";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelada";
      default: return status;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="mr-1 h-3 w-3" />
            Concluída
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Pendente
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="mr-1 h-3 w-3" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  }

  return (
    <DashboardLayout title="Vendas">
      <div className="space-y-6">
        {/* Sales Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Vendas
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vendas Concluídas
              </CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vendas Pendentes
              </CardTitle>
              <Loader2 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vendas..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentTab("all")}>
                  Todas as vendas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentTab("completed")}>
                  Vendas concluídas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentTab("pending")}>
                  Vendas pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentTab("cancelled")}>
                  Vendas canceladas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select
              defaultValue="createdAt"
              onValueChange={(value) => handleSort(value)}
            >
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Data (Recente-Antiga)</SelectItem>
                <SelectItem value="total">Valor (Maior-Menor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={exportToCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Todas
              <span className="ml-1 rounded bg-muted px-1 text-xs">
                {totalSales}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídas
              <span className="ml-1 rounded bg-green-100 text-green-800 px-1 text-xs">
                {completedSales}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes
              <span className="ml-1 rounded bg-amber-100 text-amber-800 px-1 text-xs">
                {pendingSales}
              </span>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Canceladas
              <span className="ml-1 rounded bg-red-100 text-red-800 px-1 text-xs">
                {cancelledSales}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-6">
            <SalesTable
              sales={filteredSales}
              isLoading={isLoading}
              handleViewSale={handleViewSale}
              getStatusBadge={getStatusBadge}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getPaymentMethodName={getPaymentMethodName}
            />
          </TabsContent>
          <TabsContent value="completed" className="pt-6">
            <SalesTable
              sales={filteredSales}
              isLoading={isLoading}
              handleViewSale={handleViewSale}
              getStatusBadge={getStatusBadge}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getPaymentMethodName={getPaymentMethodName}
            />
          </TabsContent>
          <TabsContent value="pending" className="pt-6">
            <SalesTable
              sales={filteredSales}
              isLoading={isLoading}
              handleViewSale={handleViewSale}
              getStatusBadge={getStatusBadge}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getPaymentMethodName={getPaymentMethodName}
            />
          </TabsContent>
          <TabsContent value="cancelled" className="pt-6">
            <SalesTable
              sales={filteredSales}
              isLoading={isLoading}
              handleViewSale={handleViewSale}
              getStatusBadge={getStatusBadge}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getPaymentMethodName={getPaymentMethodName}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sale Detail Dialog */}
      {selectedSale && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Venda #{selectedSale.id}</DialogTitle>
              <DialogDescription>
                {format(new Date(selectedSale.createdAt), "PPP", { locale: ptBR })} às{" "}
                {format(new Date(selectedSale.createdAt), "p", { locale: ptBR })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedSale.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Pagamento</h3>
                  <div className="mt-1 flex items-center">
                    {getPaymentMethodIcon(selectedSale.paymentMethod)}
                    <span className="ml-1">{getPaymentMethodName(selectedSale.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                <div className="mt-1">
                  {selectedSale.customer ? (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{selectedSale.customer.name}</span>
                      {selectedSale.customer.email && (
                        <span className="ml-1 text-sm text-muted-foreground">
                          ({selectedSale.customer.email})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Cliente não cadastrado</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Itens</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qtd.</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{item.product.name}</span>
                            {item.product.sku && (
                              <div className="text-xs text-muted-foreground">
                                SKU: {item.product.sku}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(selectedSale.total + selectedSale.discount - selectedSale.tax)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="text-green-500">-{formatCurrency(selectedSale.discount)}</span>
                  </div>
                )}
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impostos:</span>
                    <span>{formatCurrency(selectedSale.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

// Sales table component
const SalesTable = ({
  sales,
  isLoading,
  handleViewSale,
  getStatusBadge,
  getPaymentMethodIcon,
  getPaymentMethodName,
}: {
  sales: any[];
  isLoading: boolean;
  handleViewSale: (sale: any) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPaymentMethodIcon: (method: string) => React.ReactNode;
  getPaymentMethodName: (method: string) => string;
}) => {
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando vendas...</p>
        </div>
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma venda encontrada</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Não foram encontradas vendas correspondentes ao seu filtro.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">#{sale.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    {format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </TableCell>
                <TableCell>
                  {sale.customer ? (
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{sale.customer.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Cliente não cadastrado</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(sale.paymentMethod)}
                    <span className="ml-1">{getPaymentMethodName(sale.paymentMethod)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(sale.total)}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewSale(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalhes</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Sales;