import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
  Truck,
  CreditCard,
  HelpCircle,
  Bell,
  MessageCircle,
  ArrowLeft,
  BarChart,
  PieChart,
  Warehouse,
  UserCircle,
  Store,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/produtos', label: 'Produtos', icon: Package },
  { href: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { href: '/pos', label: 'PDV', icon: Store },
  { href: '/estoque', label: 'Estoque', icon: Warehouse },
  { href: '/notas-fiscais', label: 'Notas Fiscais', icon: FileText },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/whatsapp', label: 'WhatsApp', icon: MessageCircle, badge: 'Novo' },
];

const analysisNav = [
  { href: '/reports', label: 'Relatórios', icon: BarChart },
  { href: '/insights', label: 'IA Insights', icon: PieChart },
];

const configNav = [
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/support', label: 'Suporte', icon: HelpCircle },
];

function Sidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  // Function to handle navigation
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col text-gray-900 select-none">
      <div className="flex flex-col items-center pt-6 pb-2 border-b border-gray-200">
      </div>

      <nav className="flex-1 flex flex-col px-2 py-4 gap-2 overflow-auto">
        <SidebarSection title="MENU PRINCIPAL">
          {mainNav.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <a 
                key={item.href} 
                href={item.href}
                onClick={(e) => handleNavigation(item.href, e)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-[#8B5CF6] text-white' : 'text-gray-700 hover:bg-gray-100',
                  isActive && 'shadow'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">{item.badge}</Badge>
                )}
              </a>
            );
          })}
        </SidebarSection>
        <SidebarSection title="ANÁLISES">
          {analysisNav.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <a 
                key={item.href} 
                href={item.href}
                onClick={(e) => handleNavigation(item.href, e)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-[#8B5CF6] text-white' : 'text-gray-700 hover:bg-gray-100',
                  isActive && 'shadow'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </SidebarSection>
        <SidebarSection title="CONFIGURAÇÕES">
          {configNav.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <a 
                key={item.href} 
                href={item.href}
                onClick={(e) => handleNavigation(item.href, e)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-[#8B5CF6] text-white' : 'text-gray-700 hover:bg-gray-100',
                  isActive && 'shadow'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </SidebarSection>
      </nav>

      <div className="mt-auto border-t border-gray-200 px-6 py-4">
        <a 
          href="/"
          onClick={(e) => handleNavigation('/', e)}
          className="flex items-center gap-2 text-sm text-[#1E293B] hover:text-[#6D28D9]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à landing page
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-2 mt-4 text-sm text-gray-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default Sidebar;
export { Sidebar };