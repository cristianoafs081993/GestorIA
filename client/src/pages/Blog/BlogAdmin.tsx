import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate, slugify } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  File,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2,
  Image
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Post schema with zod for validation
const postSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  excerpt: z.string().min(1, "Resumo é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, {
    message: "Slug deve conter apenas letras minúsculas, números e hífens",
  }),
  category: z.string().min(1, "Categoria é obrigatória"),
  coverImage: z.string().url("URL de imagem inválida"),
  published: z.boolean().default(false),
});

type PostFormValues = z.infer<typeof postSchema>;

// Comment schema for comment management
const commentSchema = z.object({
  approved: z.boolean(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

const BlogAdmin = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewCommentsDialogOpen, setIsViewCommentsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedComments, setSelectedComments] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery<any[]>({
    queryKey: ['/api/blog'],
  });

  // Fetch all comments for comment management
  const { data: allComments, isLoading: isLoadingComments } = useQuery<any[]>({
    queryKey: ['/api/blog/comments'],
    enabled: activeTab === "comments",
  });

  // Add post mutation
  const addPost = useMutation({
    mutationFn: async (post: PostFormValues) => {
      return apiRequest('POST', '/api/blog', post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Artigo criado",
        description: "O artigo foi criado com sucesso.",
      });
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar artigo",
        description: error.message || "Ocorreu um erro ao criar o artigo.",
        variant: "destructive",
      });
    }
  });

  // Edit post mutation
  const editPost = useMutation({
    mutationFn: async (post: PostFormValues & { id: number }) => {
      const { id, ...postData } = post;
      return apiRequest('PATCH', `/api/blog/${id}`, postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Artigo atualizado",
        description: "O artigo foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar artigo",
        description: error.message || "Ocorreu um erro ao atualizar o artigo.",
        variant: "destructive",
      });
    }
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/blog/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Artigo removido",
        description: "O artigo foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover artigo",
        description: error.message || "Ocorreu um erro ao remover o artigo.",
        variant: "destructive",
      });
    }
  });

  // Update comment mutation
  const updateComment = useMutation({
    mutationFn: async ({ commentId, approved }: { commentId: number, approved: boolean }) => {
      return apiRequest('PATCH', `/api/blog/comments/${commentId}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/comments'] });
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: [`/api/blog/${selectedPost.id}/comments`] });
      }
      toast({
        title: "Comentário atualizado",
        description: "O status do comentário foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar comentário",
        description: error.message || "Ocorreu um erro ao atualizar o comentário.",
        variant: "destructive",
      });
    }
  });

  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      return apiRequest('DELETE', `/api/blog/comments/${commentId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/comments'] });
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: [`/api/blog/${selectedPost.id}/comments`] });
      }
      toast({
        title: "Comentário removido",
        description: "O comentário foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover comentário",
        description: error.message || "Ocorreu um erro ao remover o comentário.",
        variant: "destructive",
      });
    }
  });

  // Form setup for creating new post
  const createForm = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      category: "",
      coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      published: false,
    },
  });

  // Form setup for editing post
  const editForm = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      category: "",
      coverImage: "",
      published: false,
    },
  });

  // Handle edit post
  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    editForm.reset({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      category: post.category,
      coverImage: post.coverImage,
      published: post.published,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete post
  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  // Handle view comments
  const handleViewComments = async (post: any) => {
    setSelectedPost(post);
    
    try {
      const response = await fetch(`/api/blog/${post.id}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setSelectedComments(data);
      setIsViewCommentsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Erro ao carregar comentários",
        description: "Ocorreu um erro ao carregar os comentários.",
        variant: "destructive",
      });
    }
  };

  // Handle generate slug from title
  const handleGenerateSlug = () => {
    const title = createForm.getValues("title") || editForm.getValues("title");
    if (title) {
      const generatedSlug = slugify(title);
      if (isCreateDialogOpen) {
        createForm.setValue("slug", generatedSlug);
      } else {
        editForm.setValue("slug", generatedSlug);
      }
    }
  };

  // Filter posts by search query
  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter comments by search query
  const filteredComments = allComments?.filter(comment => 
    comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (comment.post && comment.post.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile view */}
      {isMobile && <Sidebar isMobile={true} />}
      
      {/* Desktop view */}
      {!isMobile && <Sidebar />}
      
      {/* Main Content */}
      <div className="sm:ml-64 pt-4 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Blog</h1>
            {activeTab === "posts" && (
              <Button className="gradient-bg hover:opacity-90" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="posts">Artigos</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    activeTab === "posts" 
                      ? "Buscar artigos por título, resumo ou categoria..." 
                      : "Buscar comentários por nome, email ou conteúdo..."
                  }
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Posts Tab Content */}
          <TabsContent value="posts" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-lg text-gray-500">Carregando artigos...</span>
                  </div>
                ) : filteredPosts && filteredPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Título</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Comentários</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{post.title}</span>
                                <span className="text-xs text-gray-500 truncate">/blog/{post.slug}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-indigo-100 text-indigo-800">
                                {post.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell>
                              {post.published ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Publicado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  <File className="h-3 w-3 mr-1" />
                                  Rascunho
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center" 
                                onClick={() => handleViewComments(post)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                <span>Ver</span>
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <FileText className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      {searchQuery ? 
                        `Não encontramos artigos correspondentes à sua busca "${searchQuery}".` : 
                        "Você ainda não criou nenhum artigo. Comece criando seu primeiro artigo."}
                    </p>
                    <Button className="gradient-bg hover:opacity-90" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Artigo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab Content */}
          <TabsContent value="comments" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {isLoadingComments ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-lg text-gray-500">Carregando comentários...</span>
                  </div>
                ) : filteredComments && filteredComments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Comentário</TableHead>
                          <TableHead>Artigo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredComments.map((comment) => (
                          <TableRow key={comment.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <span className="font-medium">{comment.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">({comment.email})</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {comment.post ? (
                                <a 
                                  href={`/blog/${comment.post.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 underline"
                                >
                                  {comment.post.title}
                                </a>
                              ) : (
                                "Artigo não encontrado"
                              )}
                            </TableCell>
                            <TableCell>{formatDate(comment.createdAt)}</TableCell>
                            <TableCell>
                              {comment.approved ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Aprovado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Pendente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {comment.approved ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-amber-600 border-amber-600 hover:bg-amber-50"
                                  onClick={() => updateComment.mutate({ commentId: comment.id, approved: false })}
                                  disabled={updateComment.isPending}
                                >
                                  {updateComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reprovar"}
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => updateComment.mutate({ commentId: comment.id, approved: true })}
                                  disabled={updateComment.isPending}
                                >
                                  {updateComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aprovar"}
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.")) {
                                    deleteComment.mutate(comment.id);
                                  }
                                }}
                                disabled={deleteComment.isPending}
                              >
                                {deleteComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum comentário encontrado</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchQuery ? 
                        `Não encontramos comentários correspondentes à sua busca "${searchQuery}".` : 
                        "Ainda não há comentários nos artigos do blog."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Artigo</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo artigo para o blog.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit((data) => addPost.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título do artigo"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Optionally auto-generate slug on title change
                              // handleGenerateSlug();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <span>Slug</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 text-xs text-indigo-600"
                              onClick={handleGenerateSlug}
                            >
                              Gerar Slug
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="slug-do-artigo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Gestão">Gestão</SelectItem>
                              <SelectItem value="Vendas">Vendas</SelectItem>
                              <SelectItem value="Finanças">Finanças</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={createForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve resumo do artigo"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <span>Imagem de Capa</span>
                          <Image className="h-4 w-4 ml-2" />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="URL da imagem" {...field} />
                        </FormControl>
                        <div className="mt-2">
                          {field.value && (
                            <img 
                              src={field.value} 
                              alt="Capa do artigo" 
                              className="h-24 object-cover rounded-md" 
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/800x400?text=Imagem+Inválida";
                              }}
                            />
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publicar artigo</FormLabel>
                          <p className="text-sm text-gray-500">
                            Marque esta opção para publicar o artigo imediatamente
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conteúdo do artigo (HTML permitido)"
                          {...field}
                          rows={25}
                          className="h-full min-h-[400px] font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gradient-bg hover:opacity-90" disabled={addPost.isPending}>
                  {addPost.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Artigo"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Artigo</DialogTitle>
            <DialogDescription>
              Atualize os campos abaixo para editar o artigo.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => editPost.mutate({ ...data, id: selectedPost.id }))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título do artigo"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Optionally auto-generate slug on title change
                              // handleGenerateSlug();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <span>Slug</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 text-xs text-indigo-600"
                              onClick={handleGenerateSlug}
                            >
                              Gerar Slug
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="slug-do-artigo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Gestão">Gestão</SelectItem>
                              <SelectItem value="Vendas">Vendas</SelectItem>
                              <SelectItem value="Finanças">Finanças</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve resumo do artigo"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <span>Imagem de Capa</span>
                          <Image className="h-4 w-4 ml-2" />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="URL da imagem" {...field} />
                        </FormControl>
                        <div className="mt-2">
                          {field.value && (
                            <img 
                              src={field.value} 
                              alt="Capa do artigo" 
                              className="h-24 object-cover rounded-md" 
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/800x400?text=Imagem+Inválida";
                              }}
                            />
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publicar artigo</FormLabel>
                          <p className="text-sm text-gray-500">
                            Marque esta opção para publicar o artigo
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conteúdo do artigo (HTML permitido)"
                          {...field}
                          rows={25}
                          className="h-full min-h-[400px] font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gradient-bg hover:opacity-90" disabled={editPost.isPending}>
                  {editPost.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o artigo "{selectedPost?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => deletePost.mutate(selectedPost.id)}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Artigo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Comments Dialog */}
      <Dialog open={isViewCommentsDialogOpen} onOpenChange={setIsViewCommentsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comentários - {selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Gerencie os comentários deste artigo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedComments && selectedComments.length > 0 ? (
              <div className="space-y-4">
                {selectedComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{comment.name}</p>
                              <Badge className={`ml-2 ${comment.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {comment.approved ? 'Aprovado' : 'Pendente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{comment.email} - {formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {comment.approved ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-amber-600"
                              onClick={() => updateComment.mutate({ commentId: comment.id, approved: false })}
                              disabled={updateComment.isPending}
                            >
                              Reprovar
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600"
                              onClick={() => updateComment.mutate({ commentId: comment.id, approved: true })}
                              disabled={updateComment.isPending}
                            >
                              Aprovar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja excluir este comentário?")) {
                                deleteComment.mutate(comment.id);
                                setSelectedComments(selectedComments.filter(c => c.id !== comment.id));
                              }
                            }}
                            disabled={deleteComment.isPending}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Este artigo ainda não possui comentários.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewCommentsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdmin;
