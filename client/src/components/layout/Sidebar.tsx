import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/stock', label: 'Estoque', icon: ShoppingCart },
  { href: '/sales', label: 'Vendas', icon: ShoppingCart },
  { href: '/invoices', label: 'Notas Fiscais', icon: FileText },
  { href: '/customers', label: 'Clientes', icon: Users },
  { href: '/reports', label: 'Relatórios', icon: BarChart2 },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-primary border-r border-r-primary/10 text-white">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-10 mt-4">
          <span className="text-xl font-bold">GestorIA</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive 
                      ? 'bg-white/20 text-white font-medium' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
export { Sidebar };