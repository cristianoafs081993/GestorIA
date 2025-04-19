import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Search,
  Filter,
  BarChart,
  ArrowUpDown,
  AlertTriangle,
  ChevronDown,
  Download,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const Stock = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Fetch products
  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  // Sort products
  const sortedProducts = products
    ? [...products].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "stock" || sortConfig.key === "price") {
          return sortConfig.direction === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      })
    : [];

  // Filter products by search query and tab
  const filteredProducts = sortedProducts?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentTab === "all") return matchesSearch;
    if (currentTab === "low" && product.stock <= product.minStock)
      return matchesSearch;
    if (currentTab === "out" && product.stock === 0) return matchesSearch;

    return false;
  });

  // Stats for stock overview
  const stockStats = {
    total: products?.length || 0,
    lowStock: products?.filter((p) => p.stock <= p.minStock).length || 0,
    outOfStock: products?.filter((p) => p.stock === 0).length || 0,
    totalValue: products
      ? products.reduce(
          (sum, product) => sum + product.stock * product.price,
          0
        )
      : 0,
  };

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

  const exportToCSV = () => {
    if (!products || products.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há produtos para exportar.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Nome",
      "SKU",
      "Categoria",
      "Estoque",
      "Estoque Mínimo",
      "Preço",
      "Valor Total",
    ];
    const rows = products.map((product) => [
      product.name,
      product.sku || "",
      product.category || "",
      product.stock,
      product.minStock,
      product.price,
      product.stock * product.price,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estoque.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Arquivo de estoque exportado com sucesso.",
    });
  };

  return (
    <DashboardLayout title="Estoque">
      <div className="space-y-6">
        {/* Stock Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Produtos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estoque Baixo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sem Estoque
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor em Estoque
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stockStats.totalValue)}
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
                placeholder="Buscar produtos..."
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
                  Todos os produtos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentTab("low")}>
                  Estoque baixo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentTab("out")}>
                  Sem estoque
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select
              defaultValue="name"
              onValueChange={(value) => handleSort(value)}
            >
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="stock">Estoque (Menor-Maior)</SelectItem>
                <SelectItem value="price">Preço (Menor-Maior)</SelectItem>
                <SelectItem value="category">Categoria (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={exportToCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full justify-start border-b pb-px [&>*]:rounded-none">
            <TabsTrigger value="all" className="relative data-[state=active]:bg-background">
              Todos os Produtos
              <span className="ml-1 rounded bg-muted px-1 text-xs">
                {products?.length || 0}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="low"
              className="relative data-[state=active]:bg-background"
            >
              Estoque Baixo
              <span className="ml-1 rounded bg-amber-100 text-amber-800 px-1 text-xs">
                {stockStats.lowStock}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="out"
              className="relative data-[state=active]:bg-background"
            >
              Sem Estoque
              <span className="ml-1 rounded bg-red-100 text-red-800 px-1 text-xs">
                {stockStats.outOfStock}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-6">
            <StockTable
              products={filteredProducts}
              isLoading={isLoading}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
          </TabsContent>
          <TabsContent value="low" className="pt-6">
            <StockTable
              products={filteredProducts}
              isLoading={isLoading}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
          </TabsContent>
          <TabsContent value="out" className="pt-6">
            <StockTable
              products={filteredProducts}
              isLoading={isLoading}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Stock table component
const StockTable = ({
  products,
  isLoading,
  handleSort,
  sortConfig,
}: {
  products: any[];
  isLoading: boolean;
  handleSort: (key: string) => void;
  sortConfig: { key: string; direction: string };
}) => {
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Package className="h-10 w-10 animate-pulse text-muted-foreground" />
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum produto encontrado</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Não foram encontrados produtos correspondentes ao seu filtro.
        </p>
      </div>
    );
  }

  const SortableHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: string;
  }) => (
    <div
      className="flex cursor-pointer items-center hover:text-primary"
      onClick={() => handleSort(sortKey)}
    >
      {label}
      {sortConfig.key === sortKey && (
        <ArrowUpDown
          className={`ml-1 h-4 w-4 ${
            sortConfig.direction === "asc" ? "text-gray-400" : "text-gray-700"
          }`}
        />
      )}
    </div>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader label="Produto" sortKey="name" />
              </TableHead>
              <TableHead>
                <SortableHeader label="SKU / Código" sortKey="sku" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Categoria" sortKey="category" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Estoque" sortKey="stock" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Mínimo" sortKey="minStock" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Preço" sortKey="price" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Valor Total" sortKey="totalValue" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku || "-"}</TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-red-500"
                              : product.stock <= product.minStock
                              ? "text-amber-500"
                              : "text-green-500"
                          }`}
                        >
                          {product.stock}
                          {product.stock === 0 && (
                            <AlertTriangle className="ml-1 inline h-4 w-4" />
                          )}
                          {product.stock > 0 &&
                            product.stock <= product.minStock && (
                              <AlertTriangle className="ml-1 inline h-4 w-4" />
                            )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {product.stock === 0
                          ? "Produto sem estoque"
                          : product.stock <= product.minStock
                          ? "Estoque abaixo do mínimo"
                          : "Estoque adequado"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">
                  {product.minStock || 0}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.stock * product.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Stock;