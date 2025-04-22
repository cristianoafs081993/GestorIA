import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Ban,
  Building,
  ChevronLeft,
  ChevronRight,
  Copy,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Mail,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Tag,
  Truck,
  X,
} from "lucide-react";

// Mock data for invoices
const mockInvoices = [
  {
    id: "#54376",
    series: "001",
    date: "2023-05-15T08:45:00",
    customer: {
      name: "Supermercado ABC",
      document: "12.345.678/0001-99"
    },
    total: 1250.0,
    status: "authorized"
  },
  {
    id: "#54375",
    series: "001",
    date: "2023-05-15T08:30:00",
    customer: {
      name: "Farmácia Saúde",
      document: "23.456.789/0001-88"
    },
    total: 850.0,
    status: "authorized"
  },
  {
    id: "#54374",
    series: "001",
    date: "2023-05-14T16:20:00",
    customer: {
      name: "Academia Fitness",
      document: "34.567.890/0001-77"
    },
    total: 1500.0,
    status: "authorized"
  },
  {
    id: "#54373",
    series: "001",
    date: "2023-05-14T15:45:00",
    customer: {
      name: "Restaurante Sabor",
      document: "45.678.901/0001-66"
    },
    total: 720.0,
    status: "processing"
  },
  {
    id: "#54372",
    series: "001",
    date: "2023-05-14T14:10:00",
    customer: {
      name: "Padaria Aroma",
      document: "56.789.012/0001-55"
    },
    total: 450.0,
    status: "authorized"
  },
  {
    id: "#54321",
    series: "001",
    date: "2023-05-10T10:15:00",
    customer: {
      name: "Farmácia Saúde",
      document: "23.456.789/0001-88"
    },
    total: 1250.0,
    status: "rejected"
  },
  {
    id: "#54356",
    series: "001",
    date: "2023-05-15T09:30:00",
    customer: {
      name: "Restaurante Sabor",
      document: "45.678.901/0001-66"
    },
    total: 950.0,
    status: "cancelled"
  }
];

// Mock data for problem invoices
const mockProblemInvoices = [
  {
    id: "#54321",
    date: "2023-05-10",
    customer: "Farmácia Saúde",
    total: 1250.0,
    status: "rejected",
    reason: "Código 226 - Rejeição: Código da UF do emitente diverge da UF autorizadora"
  },
  {
    id: "#54302",
    date: "2023-05-08",
    customer: "Academia Fitness",
    total: 850.0,
    status: "rejected",
    reason: "Código 510 - Rejeição: CNPJ do destinatário inválido"
  },
  {
    id: "#54356",
    date: "2023-05-15",
    customer: "Restaurante Sabor",
    total: 950.0,
    status: "cancelled",
    reason: "Cancelado a pedido do cliente por duplicidade."
  }
];

const NotasFiscais = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [activeChartPeriod, setActiveChartPeriod] = useState("30");

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "authorized":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Autorizada
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Processando
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            Cancelada
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            Rejeitada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Notas Fiscais</h1>
            <p className="text-sm text-gray-600">Gerencie todas as suas notas fiscais em um só lugar</p>
          </div>
          
          <div className="flex items-center">
            {/* Search button */}
            <div className="relative mr-4 hidden md:block">
              <Input 
                type="text" 
                placeholder="Pesquisar nota fiscal..." 
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
        <AlertTriangle className="text-red-500 mr-3 mt-1 h-5 w-5" />
        <div>
          <h3 className="font-semibold text-red-800">Atenção: Notas fiscais com problemas</h3>
          <p className="text-red-700">Existem 2 notas fiscais rejeitadas que precisam de sua atenção.</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto text-red-500 hover:text-red-700">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* New Invoice Button + Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button className="bg-[#4338ca] hover:bg-[#6d28d9] text-white px-4 py-3">
          <Plus className="mr-2 h-4 w-4" />
          <span>Emitir Nova Nota Fiscal</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            <span>Filtros</span>
          </Button>
          <Button variant="outline" className="bg-white hover:bg-gray-100 text-gray-700">
            <FileText className="mr-2 h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Filters section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Period filter */}
            <div>
              <label htmlFor="period-filter" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="this_week">Esta semana</SelectItem>
                  <SelectItem value="last_week">Semana passada</SelectItem>
                  <SelectItem value="this_month">Este mês</SelectItem>
                  <SelectItem value="last_month">Mês passado</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Client filter */}
            <div>
              <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Supermercado ABC</SelectItem>
                  <SelectItem value="2">Farmácia Saúde</SelectItem>
                  <SelectItem value="3">Academia Fitness</SelectItem>
                  <SelectItem value="4">Restaurante Sabor</SelectItem>
                  <SelectItem value="5">Padaria Aroma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Status filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="authorized">Autorizada</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Value filter */}
            <div>
              <label htmlFor="value-filter" className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <div className="flex space-x-2">
                <div className="relative w-1/2">
                  <Input
                    type="text"
                    id="min-value"
                    placeholder="Mín"
                    className="pl-8"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-400 text-sm">
                    R$
                  </span>
                </div>
                <div className="relative w-1/2">
                  <Input
                    type="text"
                    id="max-value"
                    placeholder="Máx"
                    className="pl-8"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-400 text-sm">
                    R$
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Limpar Filtros
            </Button>
            <Button className="bg-[#4338ca] hover:bg-[#6d28d9] text-white">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Total Invoices */}
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">NFs Emitidas (Mês)</h3>
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">142</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 8%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Comparado com 131 no mês anterior</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Total Value */}
        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Valor Total (Mês)</h3>
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(67850.25)}</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 12%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Comparado com {formatCurrency(60580.10)} no mês anterior</p>
          </CardContent>
        </Card>
        
        {/* Card 3: Cancelled Invoices */}
        <Card className="border-l-4 border-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">NFs Canceladas (Mês)</h3>
              <div className="p-2 rounded-full bg-red-100 text-red-500">
                <Ban className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="ml-2 text-red-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 25%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Comparado com 4 no mês anterior</p>
          </CardContent>
        </Card>
        
        {/* Card 4: Rejected Invoices */}
        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">NFs Rejeitadas (Mês)</h3>
              <div className="p-2 rounded-full bg-orange-100 text-orange-500">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="ml-2 text-red-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 100%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Comparado com 1 no mês anterior</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart and problem invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Invoice chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Emissão de Notas Fiscais</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={activeChartPeriod === "7" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartPeriod("7")}
                className={activeChartPeriod === "7" ? "bg-[#6d28d9]" : ""}
              >
                7 dias
              </Button>
              <Button 
                variant={activeChartPeriod === "15" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartPeriod("15")}
                className={activeChartPeriod === "15" ? "bg-[#6d28d9]" : ""}
              >
                15 dias
              </Button>
              <Button 
                variant={activeChartPeriod === "30" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartPeriod("30")}
                className={activeChartPeriod === "30" ? "bg-[#6d28d9]" : ""}
              >
                30 dias
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-60 w-full">
              {/* Placeholder for chart */}
              <div className="w-full h-full flex items-end justify-between px-2">
                {Array.from({ length: 15 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20;
                  const isHighlight = i === 14;
                  return (
                    <div 
                      key={i} 
                      className={`w-1/15 rounded-t ${isHighlight ? 'bg-[#8b5cf6]' : i > 13 ? 'bg-gray-300' : 'bg-[#4338ca]'}`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
              
              {/* Month days */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>01/05</span>
                <span>05/05</span>
                <span>10/05</span>
                <span>15/05</span>
                <span>20/05</span>
                <span>25/05</span>
                <span>30/05</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Total do período</p>
                <p className="font-bold">142 notas fiscais</p>
              </div>
              <div>
                <p className="text-gray-500">Valor médio</p>
                <p className="font-bold">{formatCurrency(477.82)}</p>
              </div>
              <div>
                <p className="text-gray-500">Valor total</p>
                <p className="font-bold">{formatCurrency(67850.25)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Problem invoices */}
        <Card>
          <CardHeader className="p-4 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="text-red-500 mr-2 h-4 w-4" />
              Notas com problemas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {mockProblemInvoices.map((invoice) => (
                <li key={invoice.id} className={`py-3 px-4 hover:${invoice.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'} rounded-md`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">NF-e {invoice.id}</p>
                      <p className="text-xs text-gray-500">Emitida em: {invoice.date}</p>
                      <p className="text-xs text-gray-500">Cliente: {invoice.customer}</p>
                      <div className={`mt-1 px-2 py-1 ${invoice.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} text-white text-xs rounded-full inline-block`}>
                        {invoice.status === 'rejected' ? 'Rejeitada' : 'Cancelada'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`mt-2 text-xs ${invoice.status === 'rejected' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                      >
                        {invoice.status === 'rejected' ? 'Corrigir' : 'Detalhes'}
                      </Button>
                    </div>
                  </div>
                  <div className={`mt-2 text-xs ${invoice.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border p-2 rounded-md`}>
                    <p className={`font-medium ${invoice.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'}`}>
                      {invoice.status === 'rejected' ? 'Motivo da rejeição:' : 'Motivo do cancelamento:'}
                    </p>
                    <p className={invoice.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'}>
                      {invoice.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-200">
              <Button variant="link" className="w-full text-[#4338ca] hover:text-[#6d28d9] flex items-center justify-center">
                <span>Ver todas as notas com problemas</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Invoices table */}
      <Card>
        <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Notas Fiscais Emitidas</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Printer className="mr-1 h-3 w-3" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="mr-1 h-3 w-3" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-medium text-xs">Nº</TableHead>
                  <TableHead className="font-medium text-xs">Série</TableHead>
                  <TableHead className="font-medium text-xs">Data de Emissão</TableHead>
                  <TableHead className="font-medium text-xs">Cliente</TableHead>
                  <TableHead className="font-medium text-xs">CNPJ/CPF</TableHead>
                  <TableHead className="font-medium text-xs">Valor Total</TableHead>
                  <TableHead className="font-medium text-xs">Status</TableHead>
                  <TableHead className="font-medium text-xs text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="text-xs font-medium">{invoice.id}</TableCell>
                    <TableCell className="text-xs">{invoice.series}</TableCell>
                    <TableCell className="text-xs">{formatDate(invoice.date)}</TableCell>
                    <TableCell className="text-xs">{invoice.customer.name}</TableCell>
                    <TableCell className="text-xs">{invoice.customer.document}</TableCell>
                    <TableCell className="text-xs font-medium">{formatCurrency(invoice.total)}</TableCell>
                    <TableCell className="text-xs">{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Printer className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Mail className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm" className="text-xs">
              <ChevronLeft className="mr-1 h-3 w-3" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Próximo
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">7</span> de <span className="font-medium">142</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button variant="outline" size="sm" className="rounded-l-md text-xs">
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-[#4338ca] text-white hover:bg-[#6d28d9]">1</Button>
                <Button variant="outline" size="sm" className="text-xs">2</Button>
                <Button variant="outline" size="sm" className="text-xs">3</Button>
                <Button variant="outline" size="sm" className="text-xs">...</Button>
                <Button variant="outline" size="sm" className="text-xs">14</Button>
                <Button variant="outline" size="sm" className="text-xs">15</Button>
                <Button variant="outline" size="sm" className="rounded-r-md text-xs">
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

// Missing ArrowRight component for problem invoices section
const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default NotasFiscais;
