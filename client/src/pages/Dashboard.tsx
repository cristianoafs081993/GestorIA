import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import DashboardCard from "@/components/ui/dashboard-card";
import StatCard from "@/components/ui/stat-card";
import { Calendar, ShoppingCart, User, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<{
    todaySales: number;
    monthlySales: number;
    newCustomers: number;
    lowStockItems: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch recent sales
  const { data: recentSales, isLoading: isLoadingSales } = useQuery<any[]>({
    queryKey: ['/api/sales/recent'],
  });

  // Fetch sales data for chart
  const { data: salesData, isLoading: isLoadingSalesData } = useQuery<any[]>({
    queryKey: ['/api/dashboard/sales-chart'],
  });

  // Fetch category data for chart
  const { data: categoryData, isLoading: isLoadingCategoryData } = useQuery<any[]>({
    queryKey: ['/api/dashboard/category-chart'],
  });

  // Sample data for charts if no data is fetched
  const sampleSalesData = [
    { name: 'Seg', value: 1200 },
    { name: 'Ter', value: 1600 },
    { name: 'Qua', value: 1000 },
    { name: 'Qui', value: 1800 },
    { name: 'Sex', value: 2200 },
    { name: 'Sab', value: 1700 },
    { name: 'Dom', value: 900 },
  ];

  const sampleCategoryData = [
    { name: 'Eletrônicos', value: 40 },
    { name: 'Roupas', value: 25 },
    { name: 'Alimentos', value: 20 },
    { name: 'Serviços', value: 15 },
  ];

  // Sample data for recent sales if no data is fetched
  const sampleRecentSales = [
    { id: 12345, customer: "Maria Santos", date: "2023-04-20", total: 850, status: "completed" },
    { id: 12344, customer: "Lucas Oliveira", date: "2023-04-20", total: 1250, status: "pending" },
    { id: 12343, customer: "Ana Ferreira", date: "2023-04-19", total: 450, status: "completed" },
    { id: 12342, customer: "Carlos Mendes", date: "2023-04-19", total: 1850, status: "completed" },
    { id: 12341, customer: "Patricia Lima", date: "2023-04-18", total: 2350, status: "canceled" },
  ];

  // Colors for pie chart
  const COLORS = ['#4F46E5', '#7C3AED', '#3B82F6', '#8B5CF6'];

  // Status badge color function
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status label function
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center">
              <button className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
                <i className="fas fa-bell"></i>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <span className="hidden sm:block text-sm text-gray-700">{user?.username || 'Usuário'}</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center text-white">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Vendas Hoje"
              value={isLoadingStats ? "..." : formatCurrency(dashboardStats?.todaySales || 4598)}
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatCard
              label="Vendas no Mês"
              value={isLoadingStats ? "..." : formatCurrency(dashboardStats?.monthlySales || 75940)}
              icon={<Calendar className="h-5 w-5" />}
            />
            <StatCard
              label="Novos Clientes (Mês)"
              value={isLoadingStats ? "..." : dashboardStats?.newCustomers || 24}
              icon={<User className="h-5 w-5" />}
            />
            <StatCard
              label="Produtos com Estoque Baixo"
              value={isLoadingStats ? "..." : dashboardStats?.lowStockItems || 8}
              icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
            />
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DashboardCard 
              title="Vendas (Últimos 7 dias)"
              footerLink={{ label: "Ver detalhes", href: "/relatorios" }}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData || sampleSalesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard 
              title="Vendas por Categoria"
              footerLink={{ label: "Ver detalhes", href: "/relatorios" }}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData || sampleCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(categoryData || sampleCategoryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          {/* Recent Sales */}
          <div className="mt-8">
            <Card>
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Últimas Vendas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingSales ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Carregando...
                        </td>
                      </tr>
                    ) : (recentSales && recentSales.length > 0 ? recentSales : sampleRecentSales).map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{sale.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sale.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(sale.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(sale.status)}`}>
                            {getStatusLabel(sale.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm">
                  <Link href="/vendas">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500">
                      Ver todas as vendas
                    </a>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
