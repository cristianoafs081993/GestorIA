import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  FileText, 
  User, 
  Trash2, 
  CreditCard,
  DollarSign,
  Receipt,
  Banknote,
  Percent,
  Minus,
  ArrowRight,
  Loader2 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Create sale schema with zod for validation
const saleSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional(),
  tax: z.string().refine(val => !isNaN(parseFloat(val)) || val === "", {
    message: "Taxa deve ser um número válido",
  }).optional(),
  discount: z.string().refine(val => !isNaN(parseFloat(val)) || val === "", {
    message: "Desconto deve ser um número válido",
  }).optional(),
});

type SaleFormValues = z.infer<typeof saleSchema>;

// POS interface with items and cart
const Sales = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("pdv");
  const [cart, setCart] = useState<any[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isViewSaleDialogOpen, setIsViewSaleDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const { toast } = useToast();

  // Fetch sales
  const { data: sales, isLoading: isLoadingSales } = useQuery<any[]>({
    queryKey: ['/api/sales'],
  });

  // Fetch products for POS
  const { data: products, isLoading: isLoadingProducts } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  // Fetch customers for dropdown
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<any[]>({
    queryKey: ['/api/customers'],
  });

  // Add sale mutation
  const addSale = useMutation({
    mutationFn: async (saleData: SaleFormValues & { items: any[] }) => {
      return apiRequest('POST', '/api/sales', saleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      setIsCheckoutDialogOpen(false);
      setCart([]);
      toast({
        title: "Venda realizada",
        description: "A venda foi processada com sucesso.",
      });
      checkoutForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao processar venda",
        description: error.message || "Ocorreu um erro ao processar a venda.",
        variant: "destructive",
      });
    }
  });

  // Form setup for checkout
  const checkoutForm = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerId: "",
      paymentMethod: "credit_card",
      notes: "",
      tax: "0",
      discount: "0",
    },
  });

  // Add product to cart
  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity of existing item
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        subtotal: product.price 
      }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity, subtotal: quantity * item.price } 
        : item
    ));
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  // Calculate final amount with tax and discount
  const calculateFinalAmount = () => {
    const subtotal = calculateCartTotal();
    const tax = parseFloat(checkoutForm.watch("tax") || "0");
    const discount = parseFloat(checkoutForm.watch("discount") || "0");
    
    return subtotal + tax - discount;
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a venda.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckoutDialogOpen(true);
  };

  // Handle view sale
  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setIsViewSaleDialogOpen(true);
  };

  // Filter products by search query for POS
  const filteredProducts = products?.filter(product => 
    (product.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchProductQuery.toLowerCase())) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchProductQuery.toLowerCase()))) &&
    product.active
  );

  // Filter sales by search query
  const filteredSales = sales?.filter(sale => 
    (sale.customer && sale.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    sale.id.toString().includes(searchQuery) ||
    sale.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get payment method label
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      case 'cash':
        return 'Dinheiro';
      case 'pix':
        return 'PIX';
      case 'bank_transfer':
        return 'Transferência Bancária';
      default:
        return method;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'pix':
        return <Receipt className="h-4 w-4" />;
      case 'bank_transfer':
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <h1 className="text-2xl font-semibold text-gray-900">Vendas / PDV</h1>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pdv" value={tab} onValueChange={setTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="pdv">Ponto de Venda</TabsTrigger>
              <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* PDV Content */}
          <TabsContent value="pdv" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products List */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle>Produtos</CardTitle>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar produto por nome, código ou código de barras..."
                        className="pl-9"
                        value={searchProductQuery}
                        onChange={(e) => setSearchProductQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="h-[calc(100vh-320px)] overflow-y-auto">
                    {isLoadingProducts ? (
                      <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <span className="ml-2 text-lg text-gray-500">Carregando produtos...</span>
                      </div>
                    ) : filteredProducts && filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                          <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(product)}>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                                  <ShoppingCart className="h-5 w-5" />
                                </div>
                                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{product.sku}</p>
                                <p className="text-lg font-bold text-indigo-600 mt-2">{formatCurrency(product.price)}</p>
                                <p className="text-xs text-gray-500 mt-1">Estoque: {product.stock}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                          {searchProductQuery ? 
                            `Não encontramos produtos correspondentes à sua busca "${searchProductQuery}".` : 
                            "Não há produtos disponíveis para venda."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Cart */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle>Carrinho</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">Carrinho vazio. Adicione produtos clicando nos itens à esquerda.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex-grow">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">{formatCurrency(item.price)} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 min-w-[30px] text-center">{item.quantity}</span>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="ml-2 text-red-500" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex flex-col">
                    <div className="w-full flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(calculateCartTotal())}</span>
                    </div>
                    <Button 
                      className="w-full gradient-bg hover:opacity-90 mt-4" 
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                    >
                      Finalizar Venda
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sales History Content */}
          <TabsContent value="sales" className="mt-0">
            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar vendas por cliente, número, status ou método de pagamento..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sales Table */}
            <Card>
              <CardContent className="p-0">
                {isLoadingSales ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-lg text-gray-500">Carregando vendas...</span>
                  </div>
                ) : filteredSales && filteredSales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nº</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Pagamento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">#{sale.id}</TableCell>
                            <TableCell>
                              {sale.customer ? sale.customer.name : "Cliente não identificado"}
                            </TableCell>
                            <TableCell>{formatDate(sale.createdAt)}</TableCell>
                            <TableCell>{formatCurrency(sale.total)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getPaymentMethodIcon(sale.paymentMethod)}
                                <span className="ml-2">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(sale.status)}>
                                {getStatusLabel(sale.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewSale(sale)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      {searchQuery ? 
                        `Não encontramos vendas correspondentes à sua busca "${searchQuery}".` : 
                        "Você ainda não realizou nenhuma venda. Utilize o ponto de venda para registrar uma venda."}
                    </p>
                    <Button className="gradient-bg hover:opacity-90" onClick={() => setTab("pdv")}>
                      Ir para o PDV
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da venda para finalizar.
            </DialogDescription>
          </DialogHeader>

          <Form {...checkoutForm}>
            <form onSubmit={checkoutForm.handleSubmit((data) => {
              const items = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.subtotal
              }));
              
              const totalAmount = calculateFinalAmount();
              
              addSale.mutate({
                ...data,
                items,
                tax: data.tax ? parseFloat(data.tax) : 0,
                discount: data.discount ? parseFloat(data.discount) : 0,
                total: totalAmount
              });
            })} className="space-y-4">
              <FormField
                control={checkoutForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente (opcional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Cliente não identificado</SelectItem>
                        {customers?.map(customer => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={checkoutForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={checkoutForm.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            // Force re-render to update the total
                            setCart([...cart]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={checkoutForm.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            // Force re-render to update the total
                            setCart([...cart]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={checkoutForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações sobre a venda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateCartTotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxa:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(checkoutForm.watch("tax") || "0"))}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(checkoutForm.watch("discount") || "0"))}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-indigo-600">{formatCurrency(calculateFinalAmount())}</span>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gradient-bg hover:opacity-90" disabled={addSale.isPending}>
                  {addSale.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Finalizar Venda"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog open={isViewSaleDialogOpen} onOpenChange={setIsViewSaleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda #{selectedSale?.id}</DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Data</h3>
                  <p>{formatDate(selectedSale.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Status</h3>
                  <Badge className={getStatusBadgeColor(selectedSale.status)}>
                    {getStatusLabel(selectedSale.status)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Pagamento</h3>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(selectedSale.paymentMethod)}
                    <span className="ml-1">{getPaymentMethodLabel(selectedSale.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              {selectedSale.customer && (
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Cliente</h3>
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{selectedSale.customer.name}</p>
                      {selectedSale.customer.email && <p className="text-sm text-gray-500">{selectedSale.customer.email}</p>}
                      {selectedSale.customer.phone && <p className="text-sm text-gray-500">{selectedSale.customer.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-2">Itens</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items && selectedSale.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedSale.total - (selectedSale.tax || 0) + (selectedSale.discount || 0))}</span>
                </div>
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa:</span>
                    <span>{formatCurrency(selectedSale.tax)}</span>
                  </div>
                )}
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desconto:</span>
                    <span>-{formatCurrency(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-indigo-600">{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>

              {selectedSale.notes && (
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Observações</h3>
                  <p className="text-gray-700">{selectedSale.notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => {
                    // Generate invoice
                    apiRequest('POST', `/api/invoices`, { saleId: selectedSale.id })
                      .then(() => {
                        toast({
                          title: "Nota fiscal gerada",
                          description: "A nota fiscal foi gerada com sucesso.",
                        });
                      })
                      .catch((error) => {
                        toast({
                          title: "Erro ao gerar nota fiscal",
                          description: error.message || "Ocorreu um erro ao gerar a nota fiscal.",
                          variant: "destructive",
                        });
                      });
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Nota Fiscal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewSaleDialogOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
