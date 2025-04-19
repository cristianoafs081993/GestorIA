import { 
  users, type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Product, type InsertProduct,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type Invoice, type InsertInvoice,
  type BlogPost, type InsertBlogPost,
  type BlogComment, type InsertBlogComment,
  type Lead, type InsertLead
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(userId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct & { userId: number }): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  updateProductStock(id: number, quantity: number): Promise<void>;
  
  // Customer methods
  getCustomers(userId: number): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;
  
  // Sale methods
  getSales(userId: number): Promise<Sale[]>;
  getSale(id: number): Promise<Sale>;
  getRecentSales(userId: number, limit: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem>;
  
  // Invoice methods
  getInvoices(userId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceBySaleId(saleId: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoiceStatus(id: number, status: string): Promise<Invoice>;
  
  // Dashboard methods
  getDashboardStats(userId: number): Promise<any>;
  getSalesChartData(userId: number): Promise<any>;
  getCategoryChartData(userId: number): Promise<any>;
  
  // Blog methods
  getAllBlogPosts(userId: number): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getRecentBlogPosts(limit: number): Promise<BlogPost[]>;
  getPopularBlogPosts(limit: number): Promise<BlogPost[]>;
  getBlogCategories(): Promise<string[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost & { userId: number }): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Comment methods
  getAllBlogComments(): Promise<BlogComment[]>;
  getApprovedBlogComments(postId: number): Promise<BlogComment[]>;
  getBlogComment(id: number): Promise<BlogComment | undefined>;
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  updateBlogComment(id: number, data: Partial<InsertBlogComment>): Promise<BlogComment>;
  deleteBlogComment(id: number): Promise<void>;
  
  // Lead methods
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private customers: Map<number, Customer>;
  private sales: Map<number, Sale>;
  private saleItems: Map<number, SaleItem>;
  private invoices: Map<number, Invoice>;
  private blogPosts: Map<number, BlogPost>;
  private blogComments: Map<number, BlogComment>;
  private leads: Map<number, Lead>;
  
  currentId: number;
  private productId: number;
  private customerId: number;
  private saleId: number;
  private saleItemId: number;
  private invoiceId: number;
  private blogPostId: number;
  private blogCommentId: number;
  private leadId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.customers = new Map();
    this.sales = new Map();
    this.saleItems = new Map();
    this.invoices = new Map();
    this.blogPosts = new Map();
    this.blogComments = new Map();
    this.leads = new Map();
    
    this.currentId = 1;
    this.productId = 1;
    this.customerId = 1;
    this.saleId = 1;
    this.saleItemId = 1;
    this.invoiceId = 1;
    this.blogPostId = 1;
    this.blogCommentId = 1;
    this.leadId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct & { userId: number }): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const newProduct: Product = { ...product, id, createdAt };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
    const product = this.products.get(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    const updatedProduct = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }
  
  async updateProductStock(id: number, quantity: number): Promise<void> {
    const product = this.products.get(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    product.stock = Math.max((product.stock || 0) - quantity, 0);
    this.products.set(id, product);
  }
  
  // Customer methods
  async getCustomers(userId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId
    );
  }
  
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerId++;
    const createdAt = new Date();
    const newCustomer: Customer = { ...customer, id, createdAt };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }
  
  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer> {
    const customer = this.customers.get(id);
    if (!customer) {
      throw new Error("Cliente não encontrado");
    }
    const updatedCustomer = { ...customer, ...data };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  
  async deleteCustomer(id: number): Promise<void> {
    this.customers.delete(id);
  }
  
  // Sale methods
  async getSales(userId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }
  
  async getSale(id: number): Promise<Sale> {
    const sale = this.sales.get(id);
    if (!sale) {
      throw new Error("Venda não encontrada");
    }
    // Add items to sale
    const items = Array.from(this.saleItems.values()).filter(
      (item) => item.saleId === id
    );
    return { ...sale, items };
  }
  
  async getRecentSales(userId: number, limit: number): Promise<Sale[]> {
    return Array.from(this.sales.values())
      .filter((sale) => sale.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.saleId++;
    const createdAt = new Date();
    const newSale: Sale = { ...sale, id, createdAt, items: [] };
    this.sales.set(id, newSale);
    return newSale;
  }
  
  async createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem> {
    const id = this.saleItemId++;
    const newSaleItem: SaleItem = { ...saleItem, id };
    this.saleItems.set(id, newSaleItem);
    return newSaleItem;
  }
  
  // Invoice methods
  async getInvoices(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.userId === userId
    );
  }
  
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }
  
  async getInvoiceBySaleId(saleId: number): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(
      (invoice) => invoice.saleId === saleId
    );
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceId++;
    const createdAt = new Date();
    const newInvoice: Invoice = { ...invoice, id, createdAt };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }
  
  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    const invoice = this.invoices.get(id);
    if (!invoice) {
      throw new Error("Nota fiscal não encontrada");
    }
    const updatedInvoice = { ...invoice, status };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }
  
  // Dashboard methods
  async getDashboardStats(userId: number): Promise<any> {
    const totalSales = this.getSales(userId).then(sales => sales.length);
    const totalCustomers = this.getCustomers(userId).then(customers => customers.length);
    const totalProducts = this.getProducts(userId).then(products => products.length);
    
    const salesSum = this.getSales(userId).then(sales => 
      sales.reduce((sum, sale) => sum + Number(sale.total), 0)
    );
    
    return {
      totalSales: await totalSales,
      totalCustomers: await totalCustomers,
      totalProducts: await totalProducts,
      salesSum: await salesSum,
    };
  }
  
  async getSalesChartData(userId: number): Promise<any> {
    const sales = await this.getSales(userId);
    const now = new Date();
    const lastSixMonths: any[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === month.getMonth() && 
               saleDate.getFullYear() === month.getFullYear();
      });
      
      const total = monthlySales.reduce((sum, sale) => sum + Number(sale.total), 0);
      
      lastSixMonths.push({
        month: monthName,
        total
      });
    }
    
    return lastSixMonths;
  }
  
  async getCategoryChartData(userId: number): Promise<any> {
    const products = await this.getProducts(userId);
    const categories: {[key: string]: number} = {};
    
    products.forEach(product => {
      const category = product.category || "Sem categoria";
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }
  
  // Blog methods
  async getAllBlogPosts(userId: number): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      (post) => post.userId === userId
    );
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      (post) => post.published
    );
  }
  
  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter((post) => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async getPopularBlogPosts(limit: number): Promise<BlogPost[]> {
    // In a real application, we would count views or likes
    return this.getRecentBlogPosts(limit);
  }
  
  async getBlogCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.blogPosts.values())
      .filter((post) => post.published && post.category)
      .forEach((post) => categories.add(post.category!));
    return [...categories];
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  
  async getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPost[]> {
    const post = await this.getBlogPostBySlug(slug);
    if (!post) {
      return [];
    }
    
    return Array.from(this.blogPosts.values())
      .filter((p) => p.published && p.id !== post.id && p.category === post.category)
      .slice(0, limit);
  }
  
  async createBlogPost(post: InsertBlogPost & { userId: number }): Promise<BlogPost> {
    const id = this.blogPostId++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newPost: BlogPost = { ...post, id, createdAt, updatedAt };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const post = this.blogPosts.get(id);
    if (!post) {
      throw new Error("Artigo não encontrado");
    }
    const updatedAt = new Date();
    const updatedPost = { ...post, ...data, updatedAt };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }
  
  // Comment methods
  async getAllBlogComments(): Promise<BlogComment[]> {
    return Array.from(this.blogComments.values());
  }
  
  async getApprovedBlogComments(postId: number): Promise<BlogComment[]> {
    return Array.from(this.blogComments.values()).filter(
      (comment) => comment.postId === postId && comment.approved
    );
  }
  
  async getBlogComment(id: number): Promise<BlogComment | undefined> {
    return this.blogComments.get(id);
  }
  
  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const id = this.blogCommentId++;
    const createdAt = new Date();
    const newComment: BlogComment = { ...comment, id, createdAt };
    this.blogComments.set(id, newComment);
    return newComment;
  }
  
  async updateBlogComment(id: number, data: Partial<InsertBlogComment>): Promise<BlogComment> {
    const comment = this.blogComments.get(id);
    if (!comment) {
      throw new Error("Comentário não encontrado");
    }
    const updatedComment = { ...comment, ...data };
    this.blogComments.set(id, updatedComment);
    return updatedComment;
  }
  
  async deleteBlogComment(id: number): Promise<void> {
    this.blogComments.delete(id);
  }
  
  // Lead methods
  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    return Array.from(this.leads.values()).find(
      (lead) => lead.email === email
    );
  }
  
  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.leadId++;
    const createdAt = new Date();
    const newLead: Lead = { ...lead, id, createdAt };
    this.leads.set(id, newLead);
    return newLead;
  }
}

export const storage = new MemStorage();
