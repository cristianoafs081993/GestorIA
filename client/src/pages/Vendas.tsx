import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
  Filter,
  FileText,
  Printer,
  Tag,
  TrendingUp,
  BarChart,
  PieChart,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Zap,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data for sales
const mockSales = [
  {
    id: 8754,
    date: "2023-05-15T14:30:00",
    customer: {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      initials: "JS"
    },
    total: 450.00,
    paymentMethod: "credit_card",
    status: "completed",
  },
  {
    id: 8753,
    date: "2023-05-15T13:45:00",
    customer: {
      id: 2,
      name: "Maria Rodrigues",
      email: "maria@email.com",
      initials: "MR"
    },
    total: 325.50,
    paymentMethod: "pix",
    status: "shipped",
  },
  {
    id: 8752,
    date: "2023-05-15T11:20:00",
    customer: {
      id: 3,
      name: "Carlos Silveira",
      email: "carlos@email.com",
      initials: "CS"
    },
    total: 780.00,
    paymentMethod: "credit_card",
    status: "pending",
  },
  {
    id: 8751,
    date: "2023-05-15T10:05:00",
    customer: {
      id: 4,
      name: "Amanda Ferreira",
      email: "amanda@email.com",
      initials: "AF"
    },
    total: 125.90,
    paymentMethod: "boleto",
    status: "cancelled",
  },
  {
    id: 8750,
    date: "2023-05-15T09:30:00",
    customer: {
      id: 5,
      name: "Ricardo Lima",
      email: "ricardo@email.com",
      initials: "RL"
    },
    total: 550.00,
    paymentMethod: "pix",
    status: "completed",
  }
];

const Vendas = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [activeChartView, setActiveChartView] = useState("daily");

  // Stats for sales overview
  const totalSales = 45250.75;
  const salesCount = 578;
  const averageTicket = 78.29;
  const conversionRate = 67;

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Concluída
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Cancelada
          </span>
        );
      case "shipped":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Enviada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Function to get payment method icon and name
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 text-primary" />;
      case "debit_card":
        return <CreditCard className="h-4 w-4 text-primary" />;
      case "money":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "pix":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "boleto":
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card": return "Cartão de Crédito";
      case "debit_card": return "Cartão de Débito";
      case "money": return "Dinheiro";
      case "pix": return "PIX";
      case "boleto": return "Boleto";
      default: return method;
    }
  };

  // Export sales to CSV
  const exportToCSV = () => {
    if (!mockSales || mockSales.length === 0) return;

    const headers = [
      "ID",
      "Cliente",
      "Total",
      "Método de Pagamento",
      "Status",
      "Data",
    ];
    
    const rows = mockSales.map((sale) => [
      sale.id,
      sale.customer?.name || "Cliente não cadastrado",
      sale.total,
      getPaymentMethodName(sale.paymentMethod),
      getStatusName(sale.status),
      format(new Date(sale.date), "dd/MM/yyyy HH:mm"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function getStatusName(status: string) {
    switch (status) {
      case "completed": return "Concluída";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelada";
      case "shipped": return "Enviada";
      default: return status;
    }
  }

  return (
    <DashboardLayout>
      {/* Cabeçalho da página */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Vendas</h1>
            <p className="text-sm text-gray-600">Gerencie suas vendas e acompanhe o desempenho comercial do seu negócio.</p>
          </div>
          
          <div className="flex items-center">
            {/* Botão de pesquisa */}
            <div className="relative mr-4 hidden md:block">
              <Input
                type="text"
                placeholder="Pesquisar vendas..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros e ações */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Gerenciar Vendas</h2>
          
          <div className="flex flex-wrap gap-2">
            <Button className="bg-[#4338ca] hover:bg-[#6d28d9] text-white">
              <Plus className="mr-2 h-4 w-4" />
              <span>Nova Venda</span>
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              <span>Exportar</span>
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              <span>Imprimir</span>
            </Button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por período */}
          <div>
            <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <div className="relative">
              <Input
                id="filter-date"
                type="text"
                placeholder="Selecione o período"
                className="pl-10 pr-4"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Filtro por status */}
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="filter-status" className="pl-10">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="shipped">Enviada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
            </div>
          </div>
          
          {/* Filtro por cliente */}
          <div>
            <label htmlFor="filter-client" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <div className="relative">
              <Input
                id="filter-client"
                type="text"
                placeholder="Buscar por cliente"
                className="pl-10 pr-4"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              />
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Botão de filtrar */}
          <div className="flex items-end">
            <Button className="w-full bg-[#4338ca] hover:bg-[#6d28d9]">
              <Search className="mr-2 h-4 w-4" />
              <span>Filtrar Resultados</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Resumo financeiro das vendas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Total de vendas */}
        <Card className="border-l-4 border-[#4338ca]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total de Vendas</h3>
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> 12%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Maio 2023</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Quantidade de vendas */}
        <Card className="border-l-4 border-[#6d28d9]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Quantidade de Vendas</h3>
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{salesCount}</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> 8%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Maio 2023</p>
          </CardContent>
        </Card>
        
        {/* Card 3: Ticket médio */}
        <Card className="border-l-4 border-[#8b5cf6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Ticket Médio</h3>
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-500">
                <Tag className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageTicket)}</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> 3%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Maio 2023</p>
          </CardContent>
        </Card>
        
        {/* Card 4: Taxa de conversão */}
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Taxa de Conversão</h3>
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" /> 5%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Maio 2023</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos de desempenho de vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico principal - Desempenho de vendas */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Desempenho de Vendas</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={activeChartView === "daily" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartView("daily")}
                className={activeChartView === "daily" ? "bg-[#6d28d9]" : ""}
              >
                Diário
              </Button>
              <Button 
                variant={activeChartView === "weekly" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartView("weekly")}
                className={activeChartView === "weekly" ? "bg-[#6d28d9]" : ""}
              >
                Semanal
              </Button>
              <Button 
                variant={activeChartView === "monthly" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartView("monthly")}
                className={activeChartView === "monthly" ? "bg-[#6d28d9]" : ""}
              >
                Mensal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Chart simulado para vendas diárias */}
            <div className="h-60 w-full flex items-end justify-between px-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.floor(Math.random() * 80) + 20;
                const isHighlight = i === 10 || i === 28;
                return (
                  <div 
                    key={i} 
                    className={`w-1/30 rounded-t ${isHighlight ? 'bg-[#6d28d9]' : 'bg-[#4338ca]'}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            
            {/* Dias do mês - apenas alguns para não sobrecarregar */}
            <div className="flex justify-between mt-2 text-xs text-gray-500 overflow-x-auto">
              <span>01</span>
              <span>05</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total do período</p>
                <p className="font-bold">{formatCurrency(totalSales)}</p>
              </div>
              <div>
                <p className="text-gray-500">Meta mensal</p>
                <p className="font-bold">{formatCurrency(50000)}</p>
              </div>
              <div>
                <p className="text-gray-500">Progresso</p>
                <p className="font-bold text-green-500">90.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Gráfico de pizza - Vendas por forma de pagamento */}
        <Card>
          <CardHeader className="p-4 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-800">Vendas por Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Gráfico simulado de pizza */}
            <div className="w-40 h-40 mx-auto mb-4 rounded-full relative overflow-hidden">
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: 'conic-gradient(#4338ca 0% 45%, #6d28d9 45% 65%, #8b5cf6 65% 85%, #c4b5fd 85% 100%)',
                  borderRadius: '100%'
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">100%</span>
              </div>
            </div>
            
            {/* Legenda do gráfico */}
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-[#4338ca] rounded mr-2"></span>
                <span className="text-sm text-gray-700">Cartão de Crédito (45%)</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-[#6d28d9] rounded mr-2"></span>
                <span className="text-sm text-gray-700">PIX (20%)</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-[#8b5cf6] rounded mr-2"></span>
                <span className="text-sm text-gray-700">Boleto (20%)</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-[#c4b5fd] rounded mr-2"></span>
                <span className="text-sm text-gray-700">Outros (15%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela de vendas recentes */}
      <Card className="mb-6">
        <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Vendas Recentes</CardTitle>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Exibindo 1-5 de {salesCount}</span>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">ID</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Data</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Cliente</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Valor Total</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Pagamento</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell className="text-gray-500">
                    {format(new Date(sale.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 bg-gray-200">
                        <AvatarFallback>{sale.customer.initials}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{sale.customer.name}</div>
                        <div className="text-xs text-gray-500">{sale.customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(sale.paymentMethod)}
                      <span className="ml-2">{getPaymentMethodName(sale.paymentMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(sale.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-900">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-900">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginação */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">{salesCount}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button variant="outline" size="icon" className="rounded-l-md">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" className="bg-[#4338ca]">
                    1
                  </Button>
                  <Button variant="outline" size="icon">
                    2
                  </Button>
                  <Button variant="outline" size="icon">
                    3
                  </Button>
                  <Button variant="outline" disabled>
                    ...
                  </Button>
                  <Button variant="outline" size="icon">
                    58
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-r-md">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Vendas;
