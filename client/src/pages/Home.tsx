import { Link } from "wouter";
import HeroPattern from "@/components/ui/hero-pattern";
import FeatureCard from "@/components/ui/feature-card";
import PricingCard from "@/components/ui/pricing-card";
import BlogCard from "@/components/ui/blog-card";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";

const Home = () => {
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
    </div>
  );
};

export default Home;
