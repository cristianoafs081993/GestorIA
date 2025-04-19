import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import HeroPattern from "@/components/ui/hero-pattern";
import BlogCard from "@/components/ui/blog-card";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark, Calendar, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Fetch blog posts
  const { data: blogPosts, isLoading } = useQuery<any[]>({
    queryKey: ['/api/blog'],
  });

  // Fetch popular post for sidebar
  const { data: popularPosts, isLoading: isLoadingPopular } = useQuery<any[]>({
    queryKey: ['/api/blog/popular'],
  });

  // Fetch categories for filter
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/blog/categories'],
  });

  // Filter posts based on search and category
  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sample data for categories if none fetched
  const sampleCategories = ["Gestão", "Vendas", "Finanças", "Marketing", "Tecnologia"];
  
  // Sample data for popular posts if none fetched
  const samplePopularPosts = [
    {
      id: 1,
      title: "Como a IA está revolucionando a gestão de pequenos negócios",
      slug: "ia-revolucionando-gestao-pequenos-negocios",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "5 estratégias de vendas pelo WhatsApp que realmente funcionam",
      slug: "estrategias-vendas-whatsapp-funcionam",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Controle financeiro: o segredo para a longevidade do seu negócio",
      slug: "controle-financeiro-segredo-longevidade-negocio",
      createdAt: new Date().toISOString(),
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroPattern className="pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Blog: Dicas para PMEs
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conteúdo especializado para ajudar sua empresa a alcançar novos patamares
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar artigos..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </HeroPattern>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="text-gray-700 font-medium">Filtrar por:</span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {(categories || sampleCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCategory !== "all" && (
                <Badge 
                  className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  onClick={() => setSelectedCategory("all")}
                >
                  {selectedCategory} ×
                </Badge>
              )}
              
              {searchQuery && (
                <Badge 
                  className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  onClick={() => setSearchQuery("")}
                >
                  Busca: {searchQuery} ×
                </Badge>
              )}
            </div>

            {/* Blog Posts */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-lg text-gray-500">Carregando artigos...</span>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="space-y-10">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                    category={post.category}
                    readTime={`${post.readTime || 5} min de leitura`}
                    createdAt={post.createdAt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || selectedCategory !== "all" ? 
                    "Não encontramos artigos correspondentes aos filtros aplicados." : 
                    "Estamos preparando novos conteúdos. Volte em breve!"}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Popular Posts */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artigos populares</h3>
                <div className="space-y-4">
                  {isLoadingPopular ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : (
                    (popularPosts || samplePopularPosts).map((post) => (
                      <div key={post.id} className="flex gap-3 items-start">
                        <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Bookmark className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <Link href={`/blog/${post.slug}`}>
                            <a className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2">{post.title}</a>
                          </Link>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
                <div className="flex flex-wrap gap-2">
                  {(categories || sampleCategories).map((category) => (
                    <Badge 
                      key={category} 
                      className="bg-gray-100 text-gray-800 hover:bg-indigo-100 hover:text-indigo-800 cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Sign up */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Inscreva-se e receba conteúdo exclusivo sobre gestão, vendas e tecnologia para PMEs.
                </p>
                <NewsletterForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
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

export default Blog;
