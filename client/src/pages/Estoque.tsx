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
  Box,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  FileUp,
  Filter,
  History,
  MinusCircle,
  Package,
  PlusCircle,
  RefreshCw,
  Search,
  Shirt,
  ShoppingBag,
  Warehouse,
} from "lucide-react";
import { useEffect, useRef } from "react";

// Mock data for products
const mockProducts = [
  {
    code: "PROD001",
    name: "Camiseta Básica - Tam P",
    category: "Vestuário",
    currentQuantity: 25,
    minQuantity: 10,
    maxQuantity: 50,
    lastSupplier: "Distribuidor A",
    lastRestock: "2023-05-10",
    status: "normal",
    icon: "shirt"
  },
  {
    code: "PROD002",
    name: "Camiseta Básica - Tam M",
    category: "Vestuário",
    currentQuantity: 3,
    minQuantity: 10,
    maxQuantity: 50,
    lastSupplier: "Distribuidor A",
    lastRestock: "2023-05-02",
    status: "critical",
    icon: "shirt"
  },
  {
    code: "PROD003",
    name: "Camiseta Básica - Tam G",
    category: "Vestuário",
    currentQuantity: 18,
    minQuantity: 10,
    maxQuantity: 50,
    lastSupplier: "Distribuidor A",
    lastRestock: "2023-05-10",
    status: "normal",
    icon: "shirt"
  },
  {
    code: "PROD004",
    name: "Tênis Esportivo - Tam 38",
    category: "Calçados",
    currentQuantity: 12,
    minQuantity: 5,
    maxQuantity: 30,
    lastSupplier: "Importadora B",
    lastRestock: "2023-04-28",
    status: "normal",
    icon: "shoe"
  },
  {
    code: "PROD005",
    name: "Tênis Esportivo - Tam 42",
    category: "Calçados",
    currentQuantity: 2,
    minQuantity: 5,
    maxQuantity: 30,
    lastSupplier: "Importadora B",
    lastRestock: "2023-04-28",
    status: "critical",
    icon: "shoe"
  },
  {
    code: "PROD006",
    name: "Boné Estampado - Adulto",
    category: "Acessórios",
    currentQuantity: 8,
    minQuantity: 15,
    maxQuantity: 40,
    lastSupplier: "Fábrica C",
    lastRestock: "2023-04-15",
    status: "low",
    icon: "hat"
  }
];

// Mock data for stock alerts
const mockAlerts = [
  {
    id: 1,
    product: "Tênis Esportivo - Tam 42",
    currentStock: 2,
    minStock: 5,
    status: "critical"
  },
  {
    id: 2,
    product: "Camiseta Básica - Tam M",
    currentStock: 3,
    minStock: 10,
    status: "critical"
  },
  {
    id: 3,
    product: "Boné Estampado - Adulto",
    currentStock: 8,
    minStock: 15,
    status: "low"
  },
  {
    id: 4,
    product: "Relógio Inteligente",
    currentStock: 5,
    minStock: 8,
    status: "low"
  }
];

const Estoque = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeChartPeriod, setActiveChartPeriod] = useState("30");
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Function to get product icon
  const getProductIcon = (icon: string) => {
    switch (icon) {
      case "shirt":
        return <Shirt className="h-5 w-5 text-gray-500" />;
      case "shoe":
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
      case "hat":
        return <Package className="h-5 w-5 text-gray-500" />;
      default:
        return <Box className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Baixo
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            Crítico
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
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  // Initialize chart when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current) {
      // This is a placeholder for Chart.js initialization
      // In a real implementation, you would import Chart.js and initialize it here
      console.log('Chart would be initialized here');
    }
  }, [activeChartPeriod]);

  return (
    <DashboardLayout>
      {/* Cabeçalho da página */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Estoque</h1>
            <p className="text-sm text-gray-600">Gerencie e monitore o estoque de produtos da sua empresa.</p>
          </div>
          
          <div className="flex items-center">
            {/* Botão de pesquisa */}
            <div className="relative mr-4 hidden md:block">
              <Input
                type="text"
                placeholder="Pesquisar produto..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Alertas e botões de ação */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Alertas de estoque */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start flex-grow">
          <AlertTriangle className="text-red-500 mr-3 mt-1 h-5 w-5" />
          <div>
            <h3 className="font-semibold text-red-800">Alerta de estoque crítico</h3>
            <p className="text-red-700">3 produtos estão com estoque crítico e precisam de reposição imediata.</p>
          </div>
          <Button variant="ghost" className="ml-auto text-red-500 hover:text-red-700 p-0">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Botões de ação */}
        <div className="flex flex-wrap gap-2">
          <Button className="bg-[#4338ca] hover:bg-[#6d28d9] text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Entrada</span>
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <MinusCircle className="mr-2 h-4 w-4" />
            <span>Saída</span>
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-800 text-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Ajustar</span>
          </Button>
        </div>
      </div>
      
      {/* Filtros de pesquisa */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">Todas as categorias</SelectItem>
                <SelectItem value="vestuario">Vestuário</SelectItem>
                <SelectItem value="calcados">Calçados</SelectItem>
                <SelectItem value="acessorios">Acessórios</SelectItem>
                <SelectItem value="eletronicos">Eletrônicos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os fornecedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-suppliers">Todos os fornecedores</SelectItem>
                <SelectItem value="distribuidor-a">Distribuidor A</SelectItem>
                <SelectItem value="importadora-b">Importadora B</SelectItem>
                <SelectItem value="fabrica-c">Fábrica C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Todos os status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ações</label>
            <div className="flex gap-2">
              <Button className="flex-grow bg-[#4338ca] hover:bg-[#6d28d9] text-white">
                Filtrar
              </Button>
              <Button variant="outline" className="flex-grow">
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumo de estoque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Total de produtos */}
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total de Produtos</h3>
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">324</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 5%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">42 categorias diferentes</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Valor em estoque */}
        <Card className="border-l-4 border-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Valor em Estoque</h3>
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(86450)}</p>
              <p className="ml-2 text-red-500 text-sm flex items-center">
                <ArrowDown className="mr-1 h-3 w-3" /> 3%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Valor de compra dos produtos</p>
          </CardContent>
        </Card>
        
        {/* Card 3: Giro de estoque */}
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Giro de Estoque</h3>
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <RefreshCw className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">4.3</p>
              <p className="ml-2 text-green-500 text-sm flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" /> 8%
              </p>
            </div>
            <p className="text-gray-600 text-xs mt-2">Rotações por ano (média)</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos e alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico de movimentação de estoque */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Movimentação de Estoque</CardTitle>
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
                variant={activeChartPeriod === "30" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartPeriod("30")}
                className={activeChartPeriod === "30" ? "bg-[#6d28d9]" : ""}
              >
                30 dias
              </Button>
              <Button 
                variant={activeChartPeriod === "90" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveChartPeriod("90")}
                className={activeChartPeriod === "90" ? "bg-[#6d28d9]" : ""}
              >
                90 dias
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-60 w-full">
              <canvas ref={chartRef} />
              {/* Placeholder for chart */}
              <div className="h-full w-full flex items-end justify-between px-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20;
                  const isHighlight = i === 10 || i === 20;
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
                <span>01/05</span>
                <span>06/05</span>
                <span>11/05</span>
                <span>16/05</span>
                <span>21/05</span>
                <span>26/05</span>
                <span>31/05</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Alertas de estoque */}
        <Card>
          <CardHeader className="p-4 border-b border-gray-200">
            <CardTitle className="text-base font-semibold text-gray-800">Alertas de Estoque</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {mockAlerts.map((alert) => (
                <li key={alert.id} className="py-3 px-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${
                      alert.status === 'critical' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{alert.product}</p>
                      <p className="text-xs text-gray-500">
                        Estoque: {alert.currentStock} | Mínimo: {alert.minStock}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(alert.status)}
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-200">
              <Button variant="link" className="w-full text-[#4338ca] hover:text-[#6d28d9] flex items-center justify-center">
                <span>Ver todos os alertas</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela de produtos em estoque */}
      <Card className="mb-6">
        <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Produtos em Estoque</CardTitle>
          <div className="flex items-center">
            <div className="relative mr-2">
              <Input 
                type="text" 
                placeholder="Buscar produto..." 
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-[#4338ca] hover:bg-[#6d28d9] text-white">
              <FileUp className="mr-2 h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </CardHeader>
        
        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Código</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Produto</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Quantidade Atual</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Mínimo</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Máximo</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Último Fornecedor</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Última Reposição</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.code} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-500">
                    {product.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        {getProductIcon(product.icon)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {product.currentQuantity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {product.minQuantity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {product.maxQuantity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {product.lastSupplier}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(product.lastRestock)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-900">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900">
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                        <History className="h-4 w-4" />
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
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">6</span> de <span className="font-medium">324</span> resultados
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
                    54
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

// Missing ArrowRight component
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

export default Estoque;
