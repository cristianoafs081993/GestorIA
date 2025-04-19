import { supabase } from './supabase';
import { IStorage } from './storage';
import {
  User, InsertUser,
  Product, InsertProduct,
  Customer, InsertCustomer,
  Sale, InsertSale,
  SaleItem, InsertSaleItem,
  Invoice, InsertInvoice,
  BlogPost, InsertBlogPost,
  BlogComment, InsertBlogComment,
  Lead, InsertLead
} from '@shared/schema';

/**
 * Implementação de armazenamento usando Supabase
 */
export class SupabaseStorage implements IStorage {
  private async handleError(error: any, entity: string, operation: string): Promise<never> {
    // Verificar se o erro é de tabela inexistente
    if (error && error.message && error.message.includes('does not exist')) {
      console.error(`Tabela ${entity} não existe no Supabase. Por favor, crie as tabelas usando o script 'setup-supabase.js' ou manualmente no painel do Supabase.`);
      
      // Para operações de leitura, retornamos um array vazio ou undefined dependendo do contexto
      if (operation === 'listar' || operation === 'buscar') {
        return operation === 'listar' ? [] : undefined as any;
      }
    }
    
    console.error(`Erro ao ${operation} ${entity}:`, error);
    throw new Error(`Erro ao ${operation} ${entity}: ${error.message || 'Erro desconhecido'}`);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      this.handleError(error, 'usuário', 'buscar');
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = Not found
        throw error;
      }
      return data as User;
    } catch (error) {
      this.handleError(error, 'usuário', 'buscar');
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = Not found
        throw error;
      }
      return data as User;
    } catch (error) {
      this.handleError(error, 'usuário', 'buscar');
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      this.handleError(error, 'usuário', 'criar');
    }
  }

  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      this.handleError(error, 'produtos', 'listar');
    }
  }

  async getProduct(id: number): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Product;
    } catch (error) {
      this.handleError(error, 'produto', 'buscar');
    }
  }

  async createProduct(product: InsertProduct & { userId: number }): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      this.handleError(error, 'produto', 'criar');
    }
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
    try {
      const { data: updatedData, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData as Product;
    } catch (error) {
      this.handleError(error, 'produto', 'atualizar');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'produto', 'excluir');
    }
  }

  async updateProductStock(id: number, quantity: number): Promise<void> {
    try {
      // Primeiro obtemos o produto atual
      const { data: product, error: getError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();
      
      if (getError) throw getError;
      
      // Atualizamos o estoque
      const newStock = (product.stock || 0) - quantity;
      
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'estoque do produto', 'atualizar');
    }
  }

  // Customer methods
  async getCustomers(userId: number): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as Customer[];
    } catch (error) {
      this.handleError(error, 'clientes', 'listar');
    }
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Customer;
    } catch (error) {
      this.handleError(error, 'cliente', 'buscar');
    }
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      
      if (error) throw error;
      return data as Customer;
    } catch (error) {
      this.handleError(error, 'cliente', 'criar');
    }
  }

  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer> {
    try {
      const { data: updatedData, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData as Customer;
    } catch (error) {
      this.handleError(error, 'cliente', 'atualizar');
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'cliente', 'excluir');
    }
  }

  // Sale methods
  async getSales(userId: number): Promise<Sale[]> {
    try {
      // Obtém as vendas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('userId', userId);
      
      if (salesError) throw salesError;
      
      // Para cada venda, obtém seus itens
      const sales = await Promise.all(salesData.map(async (sale) => {
        const { data: saleItems, error: itemsError } = await supabase
          .from('sale_items')
          .select('*')
          .eq('saleId', sale.id);
        
        if (itemsError) throw itemsError;
        
        return {
          ...sale,
          items: saleItems
        } as Sale;
      }));
      
      return sales;
    } catch (error) {
      this.handleError(error, 'vendas', 'listar');
    }
  }

  async getSale(id: number): Promise<Sale> {
    try {
      // Obtém a venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', id)
        .single();
      
      if (saleError) throw saleError;
      
      // Obtém os itens da venda
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('saleId', id);
      
      if (itemsError) throw itemsError;
      
      return {
        ...sale,
        items: saleItems
      } as Sale;
    } catch (error) {
      this.handleError(error, 'venda', 'buscar');
    }
  }

  async getRecentSales(userId: number, limit: number): Promise<Sale[]> {
    try {
      // Obtém as vendas recentes
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(limit);
      
      if (salesError) throw salesError;
      
      // Para cada venda, obtém seus itens
      const sales = await Promise.all(salesData.map(async (sale) => {
        const { data: saleItems, error: itemsError } = await supabase
          .from('sale_items')
          .select('*')
          .eq('saleId', sale.id);
        
        if (itemsError) throw itemsError;
        
        return {
          ...sale,
          items: saleItems
        } as Sale;
      }));
      
      return sales;
    } catch (error) {
      this.handleError(error, 'vendas recentes', 'listar');
    }
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    try {
      // Insere a venda
      const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        items: []
      } as Sale;
    } catch (error) {
      this.handleError(error, 'venda', 'criar');
    }
  }

  async createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem> {
    try {
      const { data, error } = await supabase
        .from('sale_items')
        .insert([saleItem])
        .select()
        .single();
      
      if (error) throw error;
      return data as SaleItem;
    } catch (error) {
      this.handleError(error, 'item de venda', 'criar');
    }
  }

  // Invoice methods
  async getInvoices(userId: number): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as Invoice[];
    } catch (error) {
      this.handleError(error, 'faturas', 'listar');
    }
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Invoice;
    } catch (error) {
      this.handleError(error, 'fatura', 'buscar');
    }
  }

  async getInvoiceBySaleId(saleId: number): Promise<Invoice | undefined> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('saleId', saleId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Invoice;
    } catch (error) {
      this.handleError(error, 'fatura', 'buscar');
    }
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoice])
        .select()
        .single();
      
      if (error) throw error;
      return data as Invoice;
    } catch (error) {
      this.handleError(error, 'fatura', 'criar');
    }
  }

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Invoice;
    } catch (error) {
      this.handleError(error, 'status da fatura', 'atualizar');
    }
  }

  // Dashboard methods
  async getDashboardStats(userId: number): Promise<any> {
    try {
      // Conta total de vendas
      const { count: totalSales, error: salesError } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId);
      
      if (salesError) throw salesError;
      
      // Conta total de clientes
      const { count: totalCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId);
      
      if (customersError) throw customersError;
      
      // Conta total de produtos
      const { count: totalProducts, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId);
      
      if (productsError) throw productsError;
      
      // Soma o valor total das vendas
      const { data: salesData, error: totalSalesError } = await supabase
        .from('sales')
        .select('total')
        .eq('userId', userId);
      
      if (totalSalesError) throw totalSalesError;
      
      const revenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.total), 0).toFixed(2);
      
      return {
        totalSales: totalSales || 0,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        revenue
      };
    } catch (error) {
      this.handleError(error, 'estatísticas', 'calcular');
    }
  }

  async getSalesChartData(userId: number): Promise<any> {
    try {
      // Pega as vendas dos últimos 6 meses
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
      const { data: sales, error } = await supabase
        .from('sales')
        .select('total, createdAt')
        .eq('userId', userId)
        .gte('createdAt', sixMonthsAgo.toISOString());
      
      if (error) throw error;
      
      // Formata os dados para o gráfico
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const chartData = [];
      
      for (let i = 0; i < 6; i++) {
        const month = (now.getMonth() - i + 12) % 12;
        const year = now.getFullYear() - (now.getMonth() < i ? 1 : 0);
        
        const monthSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.getMonth() === month && saleDate.getFullYear() === year;
        });
        
        const total = monthSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        
        chartData.unshift({
          month: months[month],
          total
        });
      }
      
      return chartData;
    } catch (error) {
      this.handleError(error, 'dados do gráfico de vendas', 'calcular');
    }
  }

  async getCategoryChartData(userId: number): Promise<any> {
    try {
      // Obtém todos os produtos com suas categorias
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, category')
        .eq('userId', userId);
      
      if (productsError) throw productsError;
      
      // Obtém todos os itens de venda
      const { data: saleItems, error: saleItemsError } = await supabase
        .from('sale_items')
        .select('productId, quantity');
      
      if (saleItemsError) throw saleItemsError;
      
      // Conta vendas por categoria
      const categoryCounts: Record<string, number> = {};
      
      for (const item of saleItems) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const category = product.category || 'Sem categoria';
          categoryCounts[category] = (categoryCounts[category] || 0) + item.quantity;
        }
      }
      
      // Formata os dados para o gráfico
      const chartData = Object.entries(categoryCounts).map(([category, value]) => ({
        category,
        value
      }));
      
      return chartData;
    } catch (error) {
      this.handleError(error, 'dados do gráfico de categorias', 'calcular');
    }
  }

  // Blog methods
  async getAllBlogPosts(userId: number): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as BlogPost[];
    } catch (error) {
      this.handleError(error, 'posts do blog', 'listar');
    }
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    } catch (error) {
      this.handleError(error, 'posts publicados', 'listar');
    }
  }

  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('createdAt', { ascending: false })
        .limit(limit);
      
      if (error) {
        // Se a tabela não existir, retornamos um array vazio
        if (error.message && error.message.includes('does not exist')) {
          console.warn('Tabela blog_posts não existe no Supabase. Retornando array vazio.');
          return [];
        }
        throw error;
      }
      return data as BlogPost[];
    } catch (error) {
      // Se chegarmos aqui, significa que o erro não foi de "tabela não existe"
      return this.handleError(error, 'posts recentes', 'listar');
    }
  }

  async getPopularBlogPosts(limit: number): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('views', { ascending: false })
        .limit(limit);
      
      if (error) {
        // Se a tabela não existir, retornamos um array vazio
        if (error.message && error.message.includes('does not exist')) {
          console.warn('Tabela blog_posts não existe no Supabase. Retornando array vazio.');
          return [];
        }
        throw error;
      }
      return data as BlogPost[];
    } catch (error) {
      // Se chegarmos aqui, significa que o erro não foi de "tabela não existe"
      return this.handleError(error, 'posts populares', 'listar');
    }
  }

  async getBlogCategories(): Promise<string[]> {
    try {
      // No Supabase, precisamos buscar manualmente as categorias únicas
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('published', true);
      
      if (error) {
        // Se a tabela não existir, retornamos um array vazio
        if (error.message && error.message.includes('does not exist')) {
          console.warn('Tabela blog_posts não existe no Supabase. Retornando array vazio.');
          return [];
        }
        throw error;
      }
      
      // Filtra valores únicos e remove nulos
      const categories = Array.from(new Set(data.map(post => post.category).filter(Boolean)));
      return categories;
    } catch (error) {
      // Se chegarmos aqui, significa que o erro não foi de "tabela não existe"
      return this.handleError(error, 'categorias do blog', 'listar');
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // Incrementa visualizações
      if (data) {
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }
      
      return data as BlogPost;
    } catch (error) {
      this.handleError(error, 'post do blog', 'buscar');
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // Incrementa visualizações
      if (data) {
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
      }
      
      return data as BlogPost;
    } catch (error) {
      this.handleError(error, 'post do blog', 'buscar');
    }
  }

  async getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPost[]> {
    try {
      // Primeiro busca o post pelo slug para obter sua categoria
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('slug', slug)
        .single();
      
      if (postError) throw postError;
      
      // Busca posts da mesma categoria
      const { data: relatedPosts, error: relatedError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', post.category)
        .neq('slug', slug)
        .limit(limit);
      
      if (relatedError) throw relatedError;
      return relatedPosts as BlogPost[];
    } catch (error) {
      this.handleError(error, 'posts relacionados', 'buscar');
    }
  }

  async createBlogPost(post: InsertBlogPost & { userId: number }): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...post,
          views: 0,
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      this.handleError(error, 'post do blog', 'criar');
    }
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    try {
      const { data: updatedPost, error } = await supabase
        .from('blog_posts')
        .update({
          ...data,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedPost as BlogPost;
    } catch (error) {
      this.handleError(error, 'post do blog', 'atualizar');
    }
  }

  async deleteBlogPost(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'post do blog', 'excluir');
    }
  }

  // Comment methods
  async getAllBlogComments(): Promise<BlogComment[]> {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data as BlogComment[];
    } catch (error) {
      this.handleError(error, 'comentários do blog', 'listar');
    }
  }

  async getApprovedBlogComments(postId: number): Promise<BlogComment[]> {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('postId', postId)
        .eq('approved', true)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data as BlogComment[];
    } catch (error) {
      this.handleError(error, 'comentários aprovados', 'listar');
    }
  }

  async getBlogComment(id: number): Promise<BlogComment | undefined> {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as BlogComment;
    } catch (error) {
      this.handleError(error, 'comentário do blog', 'buscar');
    }
  }

  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([comment])
        .select()
        .single();
      
      if (error) throw error;
      return data as BlogComment;
    } catch (error) {
      this.handleError(error, 'comentário do blog', 'criar');
    }
  }

  async updateBlogComment(id: number, data: Partial<InsertBlogComment>): Promise<BlogComment> {
    try {
      const { data: updatedComment, error } = await supabase
        .from('blog_comments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedComment as BlogComment;
    } catch (error) {
      this.handleError(error, 'comentário do blog', 'atualizar');
    }
  }

  async deleteBlogComment(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'comentário do blog', 'excluir');
    }
  }

  // Lead methods
  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Lead;
    } catch (error) {
      this.handleError(error, 'lead', 'buscar');
    }
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();
      
      if (error) throw error;
      return data as Lead;
    } catch (error) {
      this.handleError(error, 'lead', 'criar');
    }
  }
}

// Exporta uma instância da classe
export const supabaseStorage = new SupabaseStorage();