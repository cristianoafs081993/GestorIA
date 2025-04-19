import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  BarChart2, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar = ({ isMobile = false }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/vendas', 
      label: 'Vendas / PDV', 
      icon: <ShoppingCart className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/produtos', 
      label: 'Produtos', 
      icon: <Package className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/clientes', 
      label: 'Clientes', 
      icon: <Users className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/notas', 
      label: 'Notas Fiscais', 
      icon: <FileText className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/relatorios', 
      label: 'Relatórios', 
      icon: <BarChart2 className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/configuracoes', 
      label: 'Configurações', 
      icon: <Settings className="mr-3 h-5 w-5 text-indigo-300" /> 
    },
    { 
      path: '/blog-admin', 
      label: 'Gerenciar Blog', 
      icon: <FileText className="mr-3 h-5 w-5 text-indigo-300" /> 
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-indigo-800">
        <div className="flex items-center">
          <Link href="/dashboard">
            <a className="text-xl font-bold text-white">
              Gestor<span className="text-purple-300">IA</span>
            </a>
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pt-4">
        <div className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${location === item.path 
                ? 'bg-indigo-800 text-white' 
                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
              >
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 bg-indigo-300">
              <AvatarImage src="" alt={user?.username || "Avatar"} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username || 'Usuário'}</p>
              <p className="text-xs text-indigo-200">{user?.role || 'Admin'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logout()} 
            className="text-indigo-200 hover:text-white hover:bg-indigo-700"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
          <Link href="/dashboard">
            <a className="text-xl font-bold">
              Gestor<span className="text-purple-300">IA</span>
            </a>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white p-1">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-indigo-700 text-white w-64">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }

  return (
    <div className="hidden sm:flex sm:flex-col sm:fixed sm:inset-y-0 sm:left-0 sm:w-64 sm:bg-indigo-700 sm:shadow-lg">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
