import { useState, useEffect } from "react";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import clientesService from "@/services/clientesService";
import { Cliente } from "@/types/clientes";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatCurrency } from "@/lib/utils";
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
  ArrowDown,
  ArrowUp,
  Building,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Filter,
  MapPin,
  PieChart,
  Plus,
  Search,
  Tags,
  Trash2,
  User,
  UserPlus,
  UserX,
} from "lucide-react";

// Estado para armazenar os clientes do banco de dados
// Usaremos os dados mockados como fallback enquanto os dados reais são carregados
const mockClients = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    type: "company",
    email: "contato@techsolutions.com.br",
    phone: "(11) 3456-7890",
    document: "12.345.678/0001-90",
    registrationDate: "10/04/2023",
    purchases: {
      count: 32,
      total: 18450.00
    },
    status: "active"
  },
  {
    id: 2,
    name: "João Pereira",
    type: "person",
    email: "joao.pereira@email.com",
    phone: "(11) 99876-5432",
    document: "123.456.789-00",
    registrationDate: "22/05/2023",
    purchases: {
      count: 8,
      total: 2340.00
    },
    status: "active"
  },
  {
    id: 3,
    name: "Mercado Central",
    type: "company",
    email: "compras@mercadocentral.com",
    phone: "(11) 2468-1357",
    document: "98.765.432/0001-10",
    registrationDate: "15/01/2023",
    purchases: {
      count: 24,
      total: 12780.00
    },
    status: "pending"
  },
  {
    id: 4,
    name: "Ana Souza",
    type: "person",
    email: "ana.souza@email.com",
    phone: "(11) 97654-3210",
    document: "987.654.321-00",
    registrationDate: "02/06/2023",
    purchases: {
      count: 3,
      total: 750.00
    },
    status: "inactive"
  },
  {
    id: 5,
    name: "Constrular Materiais",
    type: "company",
    email: "vendas@constrular.com.br",
    phone: "(11) 4321-8765",
    document: "56.789.123/0001-45",
    registrationDate: "08/03/2023",
    purchases: {
      count: 17,
      total: 9650.00
    },
    status: "active"
  }
];

// Mock data for recent activities
const mockActivities = [
  {
    id: 1,
    type: "new",
    title: "Novo cliente cadastrado",
    description: "Restaurante Sabor Caseiro (CNPJ: 45.678.901/0001-23)",
    time: "Há 2 horas"
  },
  {
    id: 2,
    type: "update",
    title: "Cliente atualizado",
    description: "Mercado Central - Informações de contato atualizadas",
    time: "Há 5 horas"
  },
  {
    id: 3,
    type: "category",
    title: "Cliente categorizado",
    description: "Tech Solutions Ltda - Movido para categoria \"Premium\"",
    time: "Há 1 dia"
  },
  {
    id: 4,
    type: "inactive",
    title: "Cliente inativado",
    description: "Ana Souza - Inativado por solicitação do cliente",
    time: "Há 2 dias"
  }
];

const Clientes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [selectedRegistrationDate, setSelectedRegistrationDate] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState("tab1");
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  
  // Estados para os dados do banco
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalClientes, setTotalClientes] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [novosClientesMes, setNovosClientesMes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Função para carregar os clientes do banco de dados
  const loadClientes = async () => {
    setIsLoading(true);
    try {
      // Tentar carregar os dados diretamente, sem verificar a conexão primeiro
      try {
        // Carregar estatísticas
        const stats = await clientesService.getStats();
        setTotalClientes(stats.totalClientes);
        setClientesAtivos(stats.clientesAtivos);
        setTicketMedio(stats.ticketMedio);
        setNovosClientesMes(stats.novosClientesMes);
        
        // Carregar lista de clientes com paginação e filtros
        const result = await clientesService.getAll({
          page: currentPage,
          limit: 10,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          search: searchQuery || undefined,
          sortBy: selectedSortBy,
          sortOrder: "asc",
          classificacao: selectedClassification !== "all" ? selectedClassification : undefined,
        });
        
        setClientes(result.data);
        setTotalPages(result.totalPages);
      } catch (dataError) {
        console.error("Erro ao carregar dados de clientes:", dataError);
        
        // Se falhar ao carregar dados, verificar a conexão para diagnóstico
        const supabaseModule = await import('@/lib/supabase');
        await supabaseModule.checkClientesTable();
        
        // Se chegou até aqui, o problema não é de conexão, mas pode ser de permissões ou estrutura da tabela
        throw new Error("Erro ao acessar os dados de clientes. Verifique se a tabela existe e se você tem permissões adequadas.");
      }
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setError("Erro ao carregar clientes. Verifique a estrutura da tabela no Supabase.");
      toast({
        title: "Erro ao carregar clientes",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao carregar os clientes. Verifique a estrutura da tabela no Supabase.",
        variant: "destructive",
      });
      
      // Usar dados mockados como fallback quando há erro de conexão
      setClientes(mockClients.map(client => ({
        id: String(client.id),
        created_at: client.registrationDate,
        updated_at: new Date().toISOString(),
        tipo_pessoa: client.type === "company" ? "juridica" : "fisica",
        nome: client.name,
        email: client.email,
        telefone: client.phone,
        cpf: client.type === "person" ? client.document : undefined,
        cnpj: client.type === "company" ? client.document : undefined,
        status: client.status,
        classificacao: "bronze",
        total_compras: client.purchases.count,
        valor_total_compras: client.purchases.total,
        endereco_cobranca_igual: true,
        consentimento_lgpd: false,
        marketing_consent: false,
        tipo_cliente: "final",
        tabela_preco: "default"
      })) as Cliente[]);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar clientes quando a página for carregada ou quando os filtros mudarem
  useEffect(() => {
    loadClientes();
  }, [currentPage, selectedStatus, selectedClassification, selectedSortBy]);
  
  // Recarregar clientes quando o usuário pesquisar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        loadClientes();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Função para excluir um cliente
  const handleDeleteCliente = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o cliente ${nome}?`)) {
      try {
        await clientesService.delete(id);
        toast({
          title: "Cliente excluído com sucesso",
          description: `${nome} foi removido da base de clientes.`,
          variant: "default",
        });
        loadClientes();
      } catch (err) {
        console.error("Erro ao excluir cliente:", err);
        toast({
          title: "Erro ao excluir cliente",
          description: err instanceof Error ? err.message : "Ocorreu um erro ao excluir o cliente.",
          variant: "destructive",
        });
      }
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Inativo
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pendente
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

  // Function to get icon for client type
  const getClientTypeIcon = (type: string) => {
    return type === "company" ? (
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
        <Building className="h-5 w-5" />
      </div>
    ) : (
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
        <User className="h-5 w-5" />
      </div>
    );
  };

  // Function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <UserPlus className="h-5 w-5" />
          </div>
        );
      case "update":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <Edit className="h-5 w-5" />
          </div>
        );
      case "category":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
            <Tags className="h-5 w-5" />
          </div>
        );
      case "inactive":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <UserX className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <User className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
            <p className="text-sm text-gray-600">Gerencie todos os seus clientes em um só lugar</p>
          </div>
          
          <div className="flex items-center">
            {/* Search button */}
            <div className="relative mr-4 hidden md:block">
              <Input 
                type="text" 
                placeholder="Buscar clientes..." 
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium">Total de Clientes</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">{totalClientes}</div>
              <div className="text-green-500 text-sm font-medium flex items-center">
                +12% <ArrowUp className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium">Clientes Ativos</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">{clientesAtivos}</div>
              <div className="text-green-500 text-sm font-medium flex items-center">
                +5% <ArrowUp className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium">Ticket Médio</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">{formatCurrency(ticketMedio)}</div>
              <div className="text-green-500 text-sm font-medium flex items-center">
                +8% <ArrowUp className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium">Novos este mês</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">{novosClientesMes}</div>
              <div className="text-red-500 text-sm font-medium flex items-center">
                -3% <ArrowDown className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Actions and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <Button 
              className="bg-[#4338ca] hover:bg-[#6d28d9] text-white mb-4 md:mb-0"
              onClick={() => setShowNovoClienteModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
            
            {/* Modal de Novo Cliente */}
            <NovoClienteModal 
              isOpen={showNovoClienteModal} 
              onClose={() => setShowNovoClienteModal(false)} 
            />
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Buscar clientes..." 
                  className="pl-10 pr-4 py-2 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-gray-100 text-gray-700"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" className="bg-white hover:bg-gray-100 text-gray-700">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classificação</label>
                <Select value={selectedClassification} onValueChange={setSelectedClassification}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="gold">Ouro</SelectItem>
                    <SelectItem value="silver">Prata</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de cadastro</label>
                <Select value={selectedRegistrationDate} onValueChange={setSelectedRegistrationDate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Qualquer data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer data</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <Select value={selectedSortBy} onValueChange={setSelectedSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="date_desc">Data de cadastro (recente)</SelectItem>
                    <SelectItem value="date_asc">Data de cadastro (antigo)</SelectItem>
                    <SelectItem value="purchases">Total de compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Client List */}
      <Card className="mb-6">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">Lista de Clientes</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Cliente</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Contato</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">CNPJ/CPF</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Data Cadastro</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Compras</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-8 w-8 text-[#4338ca]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="mt-2 text-gray-500">Carregando clientes...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 mx-auto block"
                        onClick={() => loadClientes()}
                      >
                        Tentar novamente
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        {client.tipo_pessoa === "juridica" ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-gray-500 text-sm">{client.tipo_pessoa === "juridica" ? "Empresa" : "Pessoa Física"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.telefone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.tipo_pessoa === "juridica" ? client.cnpj : client.cpf}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(client.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.total_compras} compras</div>
                    <div className="text-xs text-gray-500">{formatCurrency(client.valor_total_compras)}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-900 hover:bg-green-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                        onClick={() => handleDeleteCliente(client.id, client.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
                )}
              </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {clientes.length > 0 ? `1-${clientes.length} de ${totalClientes}` : '0 de 0'} clientes
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Anterior
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Lógica para mostrar as páginas corretas quando há muitas páginas
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
                  }
                }
              }
              
              return (
                <Button 
                  key={pageNum}
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${currentPage === pageNum ? 'bg-blue-100 text-blue-600' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button variant="outline" size="sm" className="text-xs" disabled>
                ...
              </Button>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs ${currentPage === totalPages ? 'bg-blue-100 text-blue-600' : ''}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={isLoading}
              >
                {totalPages}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Próximo
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Client Analysis */}
      <Card className="mb-6">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">Análise de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex border-b">
            <div 
              className={`cursor-pointer px-4 py-2 ${activeTab === "tab1" ? "text-[#4338ca] border-b-2 border-[#4338ca]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("tab1")}
            >
              Comportamento de Compra
            </div>
            <div 
              className={`cursor-pointer px-4 py-2 ${activeTab === "tab2" ? "text-[#4338ca] border-b-2 border-[#4338ca]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("tab2")}
            >
              Segmentação
            </div>
            <div 
              className={`cursor-pointer px-4 py-2 ${activeTab === "tab3" ? "text-[#4338ca] border-b-2 border-[#4338ca]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("tab3")}
            >
              Fidelização
            </div>
          </div>
          
          {activeTab === "tab1" && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Frequência de Compras</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de Frequência de Compras</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Valor Médio por Cliente</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de Valor Médio por Cliente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "tab2" && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Clientes por Categoria</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de Segmentação por Categoria</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Distribuição Geográfica</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Mapa de Distribuição Geográfica</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "tab3" && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Taxa de Retenção</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de Taxa de Retenção</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Clientes Recorrentes vs. Novos</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-60 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Comparativo de Clientes Recorrentes vs. Novos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activities */}
      <Card className="mb-6">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="divide-y divide-gray-200">
            {mockActivities.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex items-start">
                  {getActivityIcon(activity.type)}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Clientes;
