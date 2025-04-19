import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Check if we're on a dashboard path
  const isDashboardPath = location.startsWith('/dashboard') || 
                          location.startsWith('/produtos') || 
                          location.startsWith('/clientes') || 
                          location.startsWith('/vendas') || 
                          location.startsWith('/notas') || 
                          location.startsWith('/blog-admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show the main header on dashboard pages
  if (isDashboardPath) return null;

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 transition-all ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Gestor<span className="text-purple-600">IA</span></h1>
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location === '/' ? 'border-indigo-500 text-indigo-700' : 'text-gray-500'}`}>
                  Início
                </a>
              </Link>
              <Link href="/#recursos">
                <a className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Recursos
                </a>
              </Link>
              <Link href="/#planos">
                <a className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Planos
                </a>
              </Link>
              <Link href="/blog">
                <a className={`border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.startsWith('/blog') ? 'border-indigo-500 text-indigo-700' : 'text-gray-500'}`}>
                  Blog
                </a>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <a className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Dashboard
                  </a>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => logout()} 
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Login
                  </a>
                </Link>
                <Link href="/cadastro">
                  <Button className="gradient-bg border-none hover:opacity-90">
                    Cadastre-se
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <a className={`text-base font-medium px-3 py-2 rounded-md ${location === '/' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                      Início
                    </a>
                  </Link>
                  <Link href="/#recursos">
                    <a className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                      Recursos
                    </a>
                  </Link>
                  <Link href="/#planos">
                    <a className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                      Planos
                    </a>
                  </Link>
                  <Link href="/blog">
                    <a className={`text-base font-medium px-3 py-2 rounded-md ${location.startsWith('/blog') ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                      Blog
                    </a>
                  </Link>
                  
                  <div className="pt-4 border-t border-gray-200">
                    {isAuthenticated ? (
                      <>
                        <Link href="/dashboard">
                          <a className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800">
                            Dashboard
                          </a>
                        </Link>
                        <button 
                          onClick={() => logout()} 
                          className="mt-2 block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <a className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800">
                            Login
                          </a>
                        </Link>
                        <Link href="/cadastro">
                          <a className="mt-2 block w-full px-4 py-2 text-center rounded-md shadow-sm text-white gradient-bg hover:opacity-90 text-base font-medium">
                            Cadastre-se
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
