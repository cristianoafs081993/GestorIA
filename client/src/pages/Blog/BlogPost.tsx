import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import HeroPattern from "@/components/ui/hero-pattern";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Tag, MessageSquare, ArrowLeft, Loader2, Bookmark, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Comment schema for validation
const commentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  content: z.string().min(5, "Comentário deve ter pelo menos 5 caracteres"),
});

type CommentValues = z.infer<typeof commentSchema>;

const BlogPost = () => {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch blog post by slug
  const { data: post, isLoading, error } = useQuery<any>({
    queryKey: [`/api/blog/${slug}`],
  });

  // Fetch related posts
  const { data: relatedPosts, isLoading: isLoadingRelated } = useQuery<any[]>({
    queryKey: [`/api/blog/related/${slug}`],
    enabled: !!post,
  });

  // Fetch comments for this post
  const { data: comments, isLoading: isLoadingComments } = useQuery<any[]>({
    queryKey: [`/api/blog/${slug}/comments`],
    enabled: !!post,
  });

  // Comment form
  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: async (data: CommentValues) => {
      return apiRequest('POST', `/api/blog/${post.id}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/${slug}/comments`] });
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi enviado e será revisado antes da publicação.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar comentário",
        description: error.message || "Ocorreu um erro ao enviar seu comentário.",
        variant: "destructive",
      });
    }
  });

  // If post is not found, navigate to blog index
  useEffect(() => {
    if (error) {
      toast({
        title: "Artigo não encontrado",
        description: "O artigo que você está procurando não existe ou foi removido.",
        variant: "destructive",
      });
      navigate("/blog");
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Carregando artigo...</h2>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div>
      {/* Hero Section with Post Header */}
      <HeroPattern className="pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/blog">
              <a className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o blog
              </a>
            </Link>
          </div>
          <Badge className="mb-4 bg-indigo-100 text-indigo-800">
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(post.createdAt)}</span>
            <span className="mx-2">•</span>
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{comments?.length || 0} comentários</span>
            <span className="mx-2">•</span>
            <span>{post.readTime || 5} min de leitura</span>
          </div>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>GA</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Equipe GestorIA</p>
              <p className="text-sm text-gray-500">Especialistas em Gestão para PMEs</p>
            </div>
          </div>
        </div>
      </HeroPattern>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.coverImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="prose prose-indigo lg:prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>

            {/* Share and Actions */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-12">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
              <div className="flex space-x-3">
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category}
                </Badge>
              </div>
            </div>

            {/* Comments Section */}
            <div id="comments" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comentários ({comments?.length || 0})</h2>
              
              {isLoadingComments ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{comment.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deixe seu comentário</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => addComment.mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Seu email" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">Seu email não será publicado</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentário</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Digite seu comentário..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="gradient-bg hover:opacity-90"
                    disabled={addComment.isPending}
                  >
                    {addComment.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Comentário"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Related Posts */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Artigos relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRelated ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ) : relatedPosts && relatedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="flex gap-3 items-start">
                        <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Bookmark className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <a className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2">{relatedPost.title}</a>
                          </Link>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(relatedPost.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Não há artigos relacionados no momento.</p>
                )}
              </CardContent>
            </Card>

            {/* Newsletter Sign up */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fique por dentro</h3>
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

export default BlogPost;
