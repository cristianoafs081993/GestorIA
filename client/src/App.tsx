import { Switch, Route } from "wouter";
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
import Invoices from "@/pages/Invoices";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/Blog/BlogPost";
import BlogAdmin from "@/pages/Blog/BlogAdmin";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/cadastro" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/produtos" component={Products} />
            <Route path="/clientes" component={Customers} />
            <Route path="/vendas" component={Sales} />
            <Route path="/notas" component={Invoices} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/blog-admin" component={BlogAdmin} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
