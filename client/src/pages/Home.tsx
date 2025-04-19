import { Link } from "wouter";
import HeroPattern from "@/components/ui/hero-pattern";
import FeatureCard from "@/components/ui/feature-card";
import PricingCard from "@/components/ui/pricing-card";
import BlogCard from "@/components/ui/blog-card";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const Home = () => {
  // Verificar autenticação
  const { isAuthenticated } = useAuth();
  
  // Fetch recent blog posts
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useQuery<any[]>({
    queryKey: ['/api/blog/recent'],
  });

  return (
    <div>
      {/* Hero Section */}
      <HeroPattern className="pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Gestão inteligente para sua empresa crescer
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A solução completa que une gestão empresarial e inteligência artificial para sua PME, com integração total ao WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="#demonstracao">
                  <Button className="gradient-bg hover:opacity-90 w-full sm:w-auto">
                    Agendar Demonstração
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-2 rounded-xl shadow-xl">
                <div className="bg-indigo-50 rounded-lg overflow-hidden">
                  <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6">
                        <i className="fas fa-chart-line text-6xl text-indigo-500 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-800">Dashboard Interativo</h3>
                        <p className="text-gray-600 mt-2">Visualize todos os dados importantes da sua empresa em tempo real</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroPattern>

      {/* Estatísticas */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg">
              <p className="text-4xl font-bold text-indigo-600">+38%</p>
              <p className="mt-2 text-lg text-gray-600">Aumento médio na produtividade</p>
            </div>
            <div className="p-6 rounded-lg">
              <p className="text-4xl font-bold text-indigo-600">+42%</p>
              <p className="mt-2 text-lg text-gray-600">Redução no tempo de gestão</p>
            </div>
            <div className="p-6 rounded-lg">
              <p className="text-4xl font-bold text-indigo-600">+1200</p>
              <p className="mt-2 text-lg text-gray-600">Empresas utilizando a plataforma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos */}
      <section id="recursos" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Transforme sua gestão com o poder da IA</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma oferece recursos avançados para gestão completa do seu negócio, com análises inteligentes e integração com WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<i className="fas fa-box text-white text-xl"></i>}
              title="Gestão de Produtos e Estoque"
              description="Controle completo do seu inventário, com alertas de estoque baixo, rastreamento de produtos e histórico de movimentações."
            />
            <FeatureCard
              icon={<i className="fas fa-shopping-cart text-white text-xl"></i>}
              title="PDV e Gestão de Vendas"
              description="Sistema de ponto de venda intuitivo, com controle de vendas, comissões e múltiplas formas de pagamento."
            />
            <FeatureCard
              icon={<i className="fas fa-file-invoice-dollar text-white text-xl"></i>}
              title="Emissão de Notas Fiscais"
              description="Gere e envie notas fiscais automaticamente, com conformidade total com as exigências fiscais e contábeis."
            />
            <FeatureCard
              icon={<i className="fab fa-whatsapp text-white text-xl"></i>}
              title="Integração com WhatsApp"
              description="Solicite relatórios, consulte vendas e receba alertas diretamente pelo WhatsApp, facilitando o acesso às informações em qualquer lugar."
            />
            <FeatureCard
              icon={<i className="fas fa-chart-bar text-white text-xl"></i>}
              title="Análise de Dados com IA"
              description="Nossa inteligência artificial analisa seu banco de dados para identificar tendências, oportunidades e sugerir estratégias de crescimento."
            />
            <FeatureCard
              icon={<i className="fas fa-users text-white text-xl"></i>}
              title="Gestão de Clientes"
              description="Cadastro completo de clientes, histórico de compras e comunicação integrada para melhorar o relacionamento e aumentar as vendas."
            />
          </div>
        </div>
      </section>
      
      {/* Como Funciona */}
      <section id="como-funciona" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Como o GestorIA funciona</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Conheça a jornada de transformação da sua empresa com nossa plataforma inteligente.
            </p>
          </div>

          <div className="relative">
            {/* Timeline vertical (visível apenas em desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-indigo-100 transform -translate-x-1/2"></div>

            {/* Etapas */}
            <div className="space-y-24">
              {/* Etapa 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Integração Simplificada</h3>
                    <p className="text-gray-600">
                      A configuração inicial leva apenas minutos. Nosso sistema guia você pelo processo de importação dos seus dados existentes e configuração de acordo com as necessidades do seu negócio.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white font-medium">1</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16">
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <i className="fas fa-cogs text-4xl text-indigo-400 mb-2"></i>
                      <p className="text-gray-600">Configuração intuitiva e rápida</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Etapa 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-16 mb-8 md:mb-0">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Gestão Diária</h3>
                    <p className="text-gray-600">
                      Gerencie produtos, vendas, estoques e emita notas fiscais em um único sistema integrado. Todas as funcionalidades foram desenhadas para serem intuitivas e eficientes.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white font-medium">2</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pr-16">
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <i className="fas fa-tasks text-4xl text-indigo-400 mb-2"></i>
                      <p className="text-gray-600">Interface simplificada para o dia a dia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Etapa 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Análise e Insights</h3>
                    <p className="text-gray-600">
                      Nossa IA processa seus dados de vendas, clientes e produtos, identificando padrões e gerando recomendações personalizadas para aumentar sua eficiência e lucros.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white font-medium">3</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16">
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <i className="fas fa-chart-pie text-4xl text-indigo-400 mb-2"></i>
                      <p className="text-gray-600">Dashboard com métricas em tempo real</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Etapa 4 */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-16 mb-8 md:mb-0">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Automatização e Escala</h3>
                    <p className="text-gray-600">
                      Com o crescimento do seu negócio, automatize processos repetitivos, escale suas operações e mantenha a produtividade sem precisar aumentar proporcionalmente sua equipe.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white font-medium">4</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pr-16">
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <i className="fas fa-rocket text-4xl text-indigo-400 mb-2"></i>
                      <p className="text-gray-600">Automação de processos para crescimento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ - Perguntas Frequentes */}
      <section id="faq" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Respostas para as dúvidas mais comuns sobre o GestorIA
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Preciso instalar algum software para usar o GestorIA?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Não, o GestorIA é uma plataforma 100% online (SAAS), você pode acessar de qualquer dispositivo com acesso à internet, usando apenas um navegador. Não há necessidade de instalações ou configurações de servidor.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Como funciona a integração com WhatsApp?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Utilizamos a API oficial do WhatsApp Business para enviar alertas, relatórios e permitir consultas. Você pode configurar quais informações deseja receber e com qual frequência, tornando a gestão ainda mais prática.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Posso emitir notas fiscais pelo sistema?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Sim, o GestorIA possui integração com os principais sistemas de emissão de notas fiscais eletrônicas do Brasil. Você pode emitir NF-e, NFC-e, e outros documentos fiscais diretamente da plataforma, com conformidade total com a legislação.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">O sistema funciona para qual tipo de negócio?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  O GestorIA foi desenvolvido para ser versátil e atender diversos segmentos: comércio varejista, restaurantes, serviços, clínicas, salões de beleza e muitos outros. As funcionalidades podem ser personalizadas de acordo com as necessidades específicas do seu negócio.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Qual o suporte oferecido?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Oferecemos suporte por chat, email e telefone em horário comercial. Clientes dos planos Profissional e Empresarial contam com um gerente de sucesso dedicado e atendimento prioritário. Além disso, disponibilizamos uma base de conhecimento completa com tutoriais e vídeos.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Posso testar o GestorIA antes de assinar?</h3>
                <i className="fas fa-chevron-down text-indigo-600"></i>
              </button>
              <div className="px-6 pb-4">
                <p className="text-gray-600">
                  Sim, oferecemos um período de teste gratuito de 14 dias com acesso a todas as funcionalidades do plano Profissional. Não é necessário cartão de crédito para iniciar o teste, basta realizar o cadastro em nossa plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Planos para todos os tamanhos de negócio</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para as necessidades da sua empresa e comece a transformar sua gestão hoje mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Básico"
              price="R$99"
              description="Ideal para microempreendedores individuais."
              features={[
                "Gestão de estoque básica",
                "PDV simplificado",
                "Emissão de notas fiscais",
                "Até 500 produtos cadastrados"
              ]}
            />
            <PricingCard
              title="Profissional"
              price="R$199"
              description="Para pequenas empresas em crescimento."
              features={[
                "Gestão de estoque avançada",
                "PDV completo",
                "Emissão de notas fiscais ilimitada",
                "Integração com WhatsApp",
                "Até 3.000 produtos cadastrados"
              ]}
              popular={true}
            />
            <PricingCard
              title="Empresarial"
              price="R$349"
              description="Solução completa para médias empresas."
              features={[
                "Todos os recursos do Profissional",
                "Análise de dados com IA",
                "Múltiplos PDVs",
                "Controle de filiais",
                "Produtos e usuários ilimitados"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Blog: Dicas para PMEs</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Conteúdo especializado para ajudar sua empresa a alcançar novos patamares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingBlogPosts ? (
              <>
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  category={post.category}
                  readTime={`${post.readTime || 5} min de leitura`}
                  createdAt={post.createdAt}
                />
              ))
            ) : (
              <>
                <BlogCard
                  id={1}
                  title="Como a IA está revolucionando a gestão de pequenos negócios"
                  slug="ia-revolucionando-gestao-pequenos-negocios"
                  excerpt="Descubra como pequenas e médias empresas estão utilizando inteligência artificial para otimizar processos e aumentar lucros."
                  coverImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Gestão"
                  readTime="5 min de leitura"
                  createdAt={new Date().toISOString()}
                />
                <BlogCard
                  id={2}
                  title="5 estratégias de vendas pelo WhatsApp que realmente funcionam"
                  slug="estrategias-vendas-whatsapp-funcionam"
                  excerpt="Um guia prático para utilizar o WhatsApp Business como canal de vendas e atendimento ao cliente de forma eficiente."
                  coverImage="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Vendas"
                  readTime="7 min de leitura"
                  createdAt={new Date().toISOString()}
                />
                <BlogCard
                  id={3}
                  title="Controle financeiro: o segredo para a longevidade do seu negócio"
                  slug="controle-financeiro-segredo-longevidade-negocio"
                  excerpt="Aprenda a organizar as finanças da sua empresa e implementar ferramentas que facilitam o controle do fluxo de caixa."
                  coverImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Finanças"
                  readTime="4 min de leitura"
                  createdAt={new Date().toISOString()}
                />
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <a className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                Ver todos os artigos
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Receba dicas exclusivas para o seu negócio</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Inscreva-se em nossa newsletter e receba conteúdo especializado sobre gestão, vendas e tecnologia para PMEs.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Depoimentos */}
      <section id="depoimentos" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">O que nossos clientes dizem</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Veja como o GestorIA está transformando a gestão de empresas por todo o Brasil.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">ML</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Lima</h4>
                  <p className="text-sm text-gray-500">Loja de Roupas</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O GestorIA transformou completamente meu pequeno negócio. Consigo gerenciar estoque, vendas e finanças em um só lugar, e o melhor: recebo alertas e relatórios pelo WhatsApp!"
              </p>
              <div className="mt-4 flex text-indigo-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            
            <div className="testimonial bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">CS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Carlos Silva</h4>
                  <p className="text-sm text-gray-500">Restaurante</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "A emissão de notas fiscais automática e o controle de estoque me poupam horas de trabalho toda semana. O suporte é excelente e as atualizações constantes sempre trazem novidades úteis."
              </p>
              <div className="mt-4 flex text-indigo-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
            
            <div className="testimonial bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ana Santos</h4>
                  <p className="text-sm text-gray-500">Clínica de Estética</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O módulo de gestão de clientes e agendamentos é perfeito para meu negócio. As análises de vendas me ajudaram a identificar os serviços mais lucrativos e a direcionar melhor meus investimentos."
              </p>
              <div className="mt-4 flex text-indigo-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Entre em Contato */}
      <section id="contato" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Entre em Contato</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Tire suas dúvidas, solicite uma demonstração ou converse com nosso time de especialistas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Fale Conosco</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Quero conhecer o GestorIA</option>
                    <option>Suporte Técnico</option>
                    <option>Dúvidas sobre Planos</option>
                    <option>Outros Assuntos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>
                <div>
                  <Button className="gradient-bg hover:opacity-90 w-full">
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-indigo-600">contato@gestoria.com.br</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">Telefone</h4>
                    <p className="text-indigo-600">(11) 4002-8922</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-4">
                    <i className="fab fa-whatsapp text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">WhatsApp</h4>
                    <p className="text-indigo-600">(11) 98765-4321</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">Endereço</h4>
                    <p className="text-gray-600">Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Painel de Acesso para Usuários Logados */}
      {isAuthenticated && (
        <section className="bg-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Acesso Rápido ao Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-chart-line text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                    <p className="text-gray-600">Visualize métricas, vendas e dados analíticos do seu negócio</p>
                  </div>
                </Link>
                
                <Link href="/products">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-box text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Produtos</h3>
                    <p className="text-gray-600">Gerencie seu catálogo, estoque e preços</p>
                  </div>
                </Link>
                
                <Link href="/customers">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-users text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
                    <p className="text-gray-600">Cadastre e gerencie sua base de clientes</p>
                  </div>
                </Link>
                
                <Link href="/sales">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-shopping-cart text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">PDV / Vendas</h3>
                    <p className="text-gray-600">Registre vendas e gerenie transações</p>
                  </div>
                </Link>
                
                <Link href="/invoices">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-file-invoice-dollar text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notas Fiscais</h3>
                    <p className="text-gray-600">Emita e gerencie as notas fiscais da sua empresa</p>
                  </div>
                </Link>
                
                <Link href="/blog">
                  <div className="bg-indigo-50 p-6 rounded-lg hover:shadow-md transition duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                      <i className="fas fa-blog text-white text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
                    <p className="text-gray-600">Gerencie conteúdos e capture leads para seu negócio</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Gestor<span className="text-indigo-400">IA</span></h3>
              <p className="text-gray-400 mb-4">
                A solução completa para gestão de pequenas e médias empresas, com inteligência artificial e integração com WhatsApp.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Carreiras</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Imprensa</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Parceiros</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutoriais</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentação API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status do Sistema</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Atualizações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Termos de Serviço</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Segurança</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">LGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <p className="text-gray-500 text-center">
              &copy; {new Date().getFullYear()} GestorIA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
