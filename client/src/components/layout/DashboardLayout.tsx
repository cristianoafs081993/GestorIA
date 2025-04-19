import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import {
  Bell,
  Search,
  User,
  Menu,
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

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
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

                <h1 className="text-xl font-semibold text-gray-900">
                  {title || getTitleFromPath(location)}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2 mb-2 border-b">
                      <p className="text-sm font-medium">{user?.username || 'Usuário'}</p>
                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    </div>
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
  if (path.startsWith('/stock')) return 'Estoque';
  if (path.startsWith('/sales')) return 'Vendas';
  if (path.startsWith('/invoices')) return 'Notas Fiscais';
  if (path.startsWith('/customers')) return 'Clientes';
  if (path.startsWith('/reports')) return 'Relatórios';
  if (path.startsWith('/settings')) return 'Configurações';
  return 'Dashboard';
}