import { useState, useEffect } from "react";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import clientesService from '@/services/clientesService'; // Usando apenas mock para frontend puro
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
    purchases: { count: 32, total: 18450.00 },
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
    purchases: { count: 8, total: 2340.00 },
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
    purchases: { count: 24, total: 12780.00 },
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
    purchases: { count: 3, total: 750.00 },
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
    purchases: { count: 17, total: 9650.00 },
    status: "active"
  },
  {
    id: 6,
    name: "Maria Oliveira",
    type: "person",
    email: "maria.oliveira@email.com",
    phone: "(21) 91234-5678",
    document: "234.567.890-11",
    registrationDate: "18/06/2023",
    purchases: { count: 12, total: 3200.00 },
    status: "active"
  },
  {
    id: 7,
    name: "Padaria Pão Doce",
    type: "company",
    email: "contato@paodoce.com",
    phone: "(21) 3344-5566",
    document: "23.456.789/0001-22",
    registrationDate: "09/02/2023",
    purchases: { count: 5, total: 1800.00 },
    status: "inactive"
  },
  {
    id: 8,
    name: "Carlos Mendes",
    type: "person",
    email: "carlos.mendes@email.com",
    phone: "(31) 98877-6655",
    document: "345.678.901-22",
    registrationDate: "11/07/2023",
    purchases: { count: 7, total: 950.00 },
    status: "pending"
  },
  {
    id: 9,
    name: "Supermercado Bom Preço",
    type: "company",
    email: "suporte@bompreco.com",
    phone: "(31) 4002-8922",
    document: "67.890.123/0001-33",
    registrationDate: "20/03/2023",
    purchases: { count: 44, total: 22200.00 },
    status: "active"
  },
  {
    id: 10,
    name: "Fernanda Lima",
    type: "person",
    email: "fernanda.lima@email.com",
    phone: "(41) 98765-1234",
    document: "456.789.012-33",
    registrationDate: "25/08/2023",
    purchases: { count: 2, total: 320.00 },
    status: "inactive"
  },
  {
    id: 11,
    name: "Auto Peças Rápido",
    type: "company",
    email: "contato@autorapido.com",
    phone: "(41) 3232-3232",
    document: "78.901.234/0001-44",
    registrationDate: "13/04/2023",
    purchases: { count: 21, total: 7650.00 },
    status: "active"
  },
  {
    id: 12,
    name: "Juliana Prado",
    type: "person",
    email: "juliana.prado@email.com",
    phone: "(51) 99881-1122",
    document: "567.890.123-44",
    registrationDate: "30/09/2023",
    purchases: { count: 4, total: 580.00 },
    status: "pending"
  },
  {
    id: 13,
    name: "Restaurante Sabor Caseiro",
    type: "company",
    email: "sac@saborcaseiro.com",
    phone: "(51) 3030-4040",
    document: "89.012.345/0001-55",
    registrationDate: "06/05/2023",
    purchases: { count: 16, total: 4300.00 },
    status: "active"
  },
  {
    id: 14,
    name: "Lucas Almeida",
    type: "person",
    email: "lucas.almeida@email.com",
    phone: "(61) 91122-3344",
    document: "678.901.234-55",
    registrationDate: "01/10/2023",
    purchases: { count: 9, total: 1750.00 },
    status: "active"
  },
  {
    id: 15,
    name: "Papelaria Criativa",
    type: "company",
    email: "contato@criativa.com",
    phone: "(61) 3322-4455",
    document: "90.123.456/0001-66",
    registrationDate: "17/06/2023",
    purchases: { count: 11, total: 2100.00 },
    status: "inactive"
  },
  {
    id: 16,
    name: "Patrícia Gomes",
    type: "person",
    email: "patricia.gomes@email.com",
    phone: "(71) 98822-3344",
    document: "789.012.345-66",
    registrationDate: "08/11/2023",
    purchases: { count: 6, total: 1100.00 },
    status: "pending"
  },
  {
    id: 17,
    name: "Farmácia Vida",
    type: "company",
    email: "atendimento@farmaciavida.com",
    phone: "(71) 3030-5050",
    document: "12.345.678/0001-77",
    registrationDate: "29/07/2023",
    purchases: { count: 29, total: 15500.00 },
    status: "active"
  },
  {
    id: 18,
    name: "Rafael Torres",
    type: "person",
    email: "rafael.torres@email.com",
    phone: "(81) 98712-3456",
    document: "890.123.456-77",
    registrationDate: "14/12/2023",
    purchases: { count: 5, total: 870.00 },
    status: "inactive"
  },
  {
    id: 19,
    name: "Pet Shop Amigo",
    type: "company",
    email: "contato@petamigo.com",
    phone: "(81) 3456-7890",
    document: "23.456.789/0001-88",
    registrationDate: "03/09/2023",
    purchases: { count: 14, total: 4100.00 },
    status: "pending"
  },
  {
    id: 20,
    name: "Gabriela Martins",
    type: "person",
    email: "gabriela.martins@email.com",
    phone: "(91) 91234-5678",
    document: "901.234.567-88",
    registrationDate: "27/10/2023",
    purchases: { count: 10, total: 1450.00 },
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
  const [totalClientes, setTotalClientes] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [novosClientesMes, setNovosClientesMes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { toast } = useToast();

  // Função para carregar os clientes do mock
  const loadClientes = () => {
    // Estatísticas simples baseadas no mock
    setTotalClientes(mockClients.length);
    setClientesAtivos(mockClients.filter(c => c.status === "active").length);
    setTicketMedio(
      mockClients.reduce((acc, c) => acc + c.purchases.total, 0) / mockClients.length
    );
    setNovosClientesMes(
      mockClients.filter(c => {
        const [day, month, year] = c.registrationDate.split("/");
        const regDate = new Date(`${year}-${month}-${day}`);
        const now = new Date();
        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
      }).length
    );
    setClientes(
      mockClients.map(client => ({
        id: String(client.id),
        created_at: client.registrationDate,
        updated_at: new Date().toISOString(),
        tipo_pessoa: client.type === "company" ? "juridica" : "fisica",
        name: client.name,
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
      })) as Cliente[]
    );
    setTotalPages(1);
  };
  
  // Carregar clientes do mock quando a página for carregada ou quando os filtros mudarem
  useEffect(() => {
    loadClientes();
  }, [currentPage, selectedStatus, selectedClassification, selectedSortBy]);
  
  // Recarregar clientes do mock quando o usuário pesquisar
  useEffect(() => {
    const timer = setTimeout(() => {
      loadClientes();
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

      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
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
        
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
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
        
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
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
        
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
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
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg mb-6">
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
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg mb-6">
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
                {clientes.length === 0 ? (
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
              disabled={currentPage === 1}
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
      

      

    </DashboardLayout>
  );
};

export default Clientes;
