import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import VendasNovo from "@/pages/VendasNovo";
import Stock from "@/pages/Stock";
import Estoque from "./pages/Estoque";
import NotasFiscais from "./pages/NotasFiscais";
import Clientes from "./pages/Clientes";
import Invoices from "@/pages/Invoices";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/Blog/BlogPost";
import BlogAdmin from "@/pages/Blog/BlogAdmin";
import DiagnosticoSupabase from "@/pages/DiagnosticoSupabase";
import SupabaseDiagnostic from "@/pages/SupabaseDiagnostic";
import NotFound from "@/pages/not-found";

function App() {
  const [location] = useLocation();

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        {/* Renderiza Header apenas em rotas públicas */}
        {['/', '/login', '/cadastro', '/blog', '/blog/:slug'].includes(location) && <Header />}
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/cadastro" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/produtos" component={Products} />
            <Route path="/clientes" component={Clientes} />
            <Route path="/vendas" component={VendasNovo} />
            <Route path="/sales" component={Sales} />
            <Route path="/stock" component={Stock} />
            <Route path="/estoque" component={Estoque} />
            <Route path="/notas-fiscais" component={NotasFiscais} />
            <Route path="/notas" component={Invoices} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/blog-admin" component={BlogAdmin} />
            <Route path="/diagnostico-supabase" component={DiagnosticoSupabase} />
            <Route path="/supabase-diagnostic" component={SupabaseDiagnostic} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
