import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import {
  Bell,
  Search,
  User,
  Menu,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex pt-11">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ paddingTop: '76px' }}>
        {/* Top navigation */}
        <header className="bg-white shadow-sm fixed w-full left-0 right-0 top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo GestorIA */}
                <a href="/dashboard" className="flex-shrink-0 flex items-center mr-6">
                  <h1 className="text-2xl font-bold text-indigo-600">Gestor<span className="text-purple-600">IA</span></h1>
                </a>
                {/* Mobile menu button */}
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    <Sidebar />
                  </SheetContent>
                </Sheet>

                <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
                  {title || getTitleFromPath(location)}
                </h1>

                {/* Search bar */}
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar..." 
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1 text-gray-700">
                  <HelpCircle className="h-4 w-4" />
                  <span>Ajuda</span>
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{user?.username || 'Usuário'}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 mb-2 border-b">
                      <p className="text-sm font-medium">{user?.username || 'Usuário'}</p>
                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    </div>
                    <DropdownMenuItem onSelect={() => setLocation('/profile')}>
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLocation('/settings')}>
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => logout()}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function getTitleFromPath(path: string): string {
  if (path.startsWith('/dashboard')) return 'Dashboard';
  if (path.startsWith('/products')) return 'Produtos';
  if (path.startsWith('/produtos')) return 'Produtos';
  if (path.startsWith('/stock')) return 'Estoque';
  if (path.startsWith('/sales')) return 'Vendas';
  if (path.startsWith('/vendas')) return 'Vendas';
  if (path.startsWith('/invoices')) return 'Notas Fiscais';
  if (path.startsWith('/customers')) return 'Clientes';
  if (path.startsWith('/suppliers')) return 'Fornecedores';
  if (path.startsWith('/reports')) return 'Relatórios';
  if (path.startsWith('/settings')) return 'Configurações';
  return 'Dashboard';
}