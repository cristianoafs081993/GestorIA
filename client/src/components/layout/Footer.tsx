import { Link } from 'wouter';
import { useLocation } from 'wouter';

const Footer = () => {
  const [location] = useLocation();
  
  // Don't show footer on dashboard pages
  const isDashboardPath = location.startsWith('/dashboard') || 
                          location.startsWith('/produtos') || 
                          location.startsWith('/clientes') || 
                          location.startsWith('/vendas') || 
                          location.startsWith('/notas') || 
                          location.startsWith('/blog-admin');
  
  if (isDashboardPath) return null;

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GestorIA</h3>
            <p className="text-gray-400 text-sm">
              Solução completa de gestão com inteligência artificial para pequenas e médias empresas.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/"><a className="hover:text-white">Início</a></Link></li>
              <li><Link href="/#recursos"><a className="hover:text-white">Recursos</a></Link></li>
              <li><Link href="/#planos"><a className="hover:text-white">Planos</a></Link></li>
              <li><Link href="/blog"><a className="hover:text-white">Blog</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:contato@gestoria.com.br" className="hover:text-white">contato@gestoria.com.br</a></li>
              <li><a href="tel:+5511999999999" className="hover:text-white">(11) 99999-9999</a></li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} GestorIA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
