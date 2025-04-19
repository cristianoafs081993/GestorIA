import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';
import {
  users, products, customers, sales, saleItems, invoices,
  blogPosts, blogComments, leads,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Customer, type InsertCustomer,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type Invoice, type InsertInvoice,
  type BlogPost, type InsertBlogPost,
  type BlogComment, type InsertBlogComment,
  type Lead, type InsertLead
} from '@shared/schema';

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...user,
      role: user.role || 'user',
      phone: user.phone || null
    }).returning();
    return result[0];
  }
  
  // Product methods
  async getProducts(userId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.userId, userId));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }
  
  async createProduct(product: InsertProduct & { userId: number }): Promise<Product> {
    const result = await db.insert(products).values({
      ...product,
      description: product.description || null,
      cost: product.cost || null,
      sku: product.sku || null,
      barcode: product.barcode || null,
      stock: product.stock || null,
      minStock: product.minStock || null,
      category: product.category || null,
      image: product.image || null,
      active: product.active !== undefined ? product.active : true
    }).returning();
    return result[0];
  }
  
  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
    const result = await db.update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    
    if (!result.length) {
      throw new Error("Produto não encontrado");
    }
    
    return result[0];
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
  
  async updateProductStock(id: number, quantity: number): Promise<void> {
    const product = await this.getProduct(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    
    const currentStock = product.stock || 0;
    const newStock = Math.max(currentStock - quantity, 0);
    
    await db.update(products)
      .set({ stock: newStock })
      .where(eq(products.id, id));
  }
  
  // Customer methods
  async getCustomers(userId: number): Promise<Customer[]> {
    return db.select().from(customers).where(eq(customers.userId, userId));
  }
  
  async getCustomer(id: number): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0];
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values({
      ...customer,
      email: customer.email || null,
      phone: customer.phone || null,
      address: customer.address || null,
      city: customer.city || null,
      state: customer.state || null,
      zipCode: customer.zipCode || null,
      notes: customer.notes || null
    }).returning();
    return result[0];
  }
  
  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer> {
    const result = await db.update(customers)
      .set(data)
      .where(eq(customers.id, id))
      .returning();
    
    if (!result.length) {
      throw new Error("Cliente não encontrado");
    }
    
    return result[0];
  }
  
  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }
  
  // Sale methods
  async getSales(userId: number): Promise<Sale[]> {
    const salesData = await db.select().from(sales).where(eq(sales.userId, userId));
    
    // Para cada venda, busque os itens
    const salesWithItems = await Promise.all(
      salesData.map(async (sale) => {
        const items = await db.select().from(saleItems).where(eq(saleItems.saleId, sale.id));
        return { ...sale, items };
      })
    );
    
    return salesWithItems as Sale[];
  }
  
  async getSale(id: number): Promise<Sale> {
    const sale = await db.select().from(sales).where(eq(sales.id, id)).limit(1);
    
    if (!sale.length) {
      throw new Error("Venda não encontrada");
    }
    
    const items = await db.select().from(saleItems).where(eq(saleItems.saleId, id));
    return { ...sale[0], items } as Sale;
  }
  
  async getRecentSales(userId: number, limit: number): Promise<Sale[]> {
    const salesData = await db.select()
      .from(sales)
      .where(eq(sales.userId, userId))
      .orderBy(desc(sales.createdAt))
      .limit(limit);
    
    const salesWithItems = await Promise.all(
      salesData.map(async (sale) => {
        const items = await db.select().from(saleItems).where(eq(saleItems.saleId, sale.id));
        return { ...sale, items };
      })
    );
    
    return salesWithItems as Sale[];
  }
  
  async createSale(sale: InsertSale): Promise<Sale> {
    const result = await db.insert(sales).values({
      ...sale,
      notes: sale.notes || null,
      customerId: sale.customerId || null,
      tax: sale.tax || null,
      discount: sale.discount || null
    }).returning();
    
    return { ...result[0], items: [] } as Sale;
  }
  
  async createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem> {
    const result = await db.insert(saleItems).values(saleItem).returning();
    return result[0];
  }
  
  // Invoice methods
  async getInvoices(userId: number): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.userId, userId));
  }
  
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return result[0];
  }
  
  async getInvoiceBySaleId(saleId: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.saleId, saleId)).limit(1);
    return result[0];
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values({
      ...invoice,
      dueDate: invoice.dueDate || null
    }).returning();
    return result[0];
  }
  
  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    const result = await db.update(invoices)
      .set({ status })
      .where(eq(invoices.id, id))
      .returning();
    
    if (!result.length) {
      throw new Error("Nota fiscal não encontrada");
    }
    
    return result[0];
  }
  
  // Dashboard methods
  async getDashboardStats(userId: number): Promise<any> {
    const [totalSalesResult] = await db.select({ count: sql<number>`count(*)` })
      .from(sales)
      .where(eq(sales.userId, userId));
    
    const [totalCustomersResult] = await db.select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.userId, userId));
    
    const [totalProductsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.userId, userId));
    
    const [salesSumResult] = await db.select({ 
      sum: sql<string>`COALESCE(sum(cast(total as decimal)), 0)` 
    })
      .from(sales)
      .where(eq(sales.userId, userId));
    
    return {
      totalSales: totalSalesResult.count,
      totalCustomers: totalCustomersResult.count,
      totalProducts: totalProductsResult.count,
      salesSum: Number(salesSumResult.sum)
    };
  }
  
  async getSalesChartData(userId: number): Promise<any> {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const [result] = await db.select({ 
        total: sql<string>`COALESCE(sum(cast(total as decimal)), 0)` 
      })
        .from(sales)
        .where(
          and(
            eq(sales.userId, userId),
            sql`${sales.createdAt} >= ${startDate}`,
            sql`${sales.createdAt} <= ${endDate}`
          )
        );
      
      months.push({
        month: monthName,
        total: Number(result.total)
      });
    }
    
    return months;
  }
  
  async getCategoryChartData(userId: number): Promise<any> {
    const categories = await db.select({
      category: products.category,
      count: sql<number>`count(*)`
    })
      .from(products)
      .where(eq(products.userId, userId))
      .groupBy(products.category);
    
    return categories.map(item => ({
      name: item.category || "Sem categoria",
      value: item.count
    }));
  }
  
  // Blog methods
  async getAllBlogPosts(userId: number): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.userId, userId));
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.published, true));
  }
  
  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    return db.select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }
  
  async getPopularBlogPosts(limit: number): Promise<BlogPost[]> {
    // Em um cenário real, teríamos um campo de views ou similar
    // Por enquanto, vamos simplesmente retornar os mais recentes
    return this.getRecentBlogPosts(limit);
  }
  
  async getBlogCategories(): Promise<string[]> {
    const categories = await db.select({ category: blogPosts.category })
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .groupBy(blogPosts.category);
    
    return categories
      .map(item => item.category)
      .filter((category): category is string => category !== null);
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }
  
  async getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPost[]> {
    const post = await this.getBlogPostBySlug(slug);
    if (!post || !post.category) {
      return [];
    }
    
    return db.select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.category, post.category),
          sql`${blogPosts.id} != ${post.id}`
        )
      )
      .limit(limit);
  }
  
  async createBlogPost(post: InsertBlogPost & { userId: number }): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values({
      ...post,
      excerpt: post.excerpt || null,
      coverImage: post.coverImage || null,
      category: post.category || null,
      published: post.published !== undefined ? post.published : false
    }).returning();
    return result[0];
  }
  
  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const updatedAt = new Date();
    const result = await db.update(blogPosts)
      .set({ ...data, updatedAt })
      .where(eq(blogPosts.id, id))
      .returning();
    
    if (!result.length) {
      throw new Error("Artigo não encontrado");
    }
    
    return result[0];
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  // Comment methods
  async getAllBlogComments(): Promise<BlogComment[]> {
    return db.select().from(blogComments);
  }
  
  async getApprovedBlogComments(postId: number): Promise<BlogComment[]> {
    return db.select()
      .from(blogComments)
      .where(
        and(
          eq(blogComments.postId, postId),
          eq(blogComments.approved, true)
        )
      );
  }
  
  async getBlogComment(id: number): Promise<BlogComment | undefined> {
    const result = await db.select().from(blogComments).where(eq(blogComments.id, id)).limit(1);
    return result[0];
  }
  
  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const result = await db.insert(blogComments).values({
      ...comment,
      approved: comment.approved !== undefined ? comment.approved : false
    }).returning();
    return result[0];
  }
  
  async updateBlogComment(id: number, data: Partial<InsertBlogComment>): Promise<BlogComment> {
    const result = await db.update(blogComments)
      .set(data)
      .where(eq(blogComments.id, id))
      .returning();
    
    if (!result.length) {
      throw new Error("Comentário não encontrado");
    }
    
    return result[0];
  }
  
  async deleteBlogComment(id: number): Promise<void> {
    await db.delete(blogComments).where(eq(blogComments.id, id));
  }
  
  // Lead methods
  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
    return result[0];
  }
  
  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values({
      ...lead,
      name: lead.name || null,
      source: lead.source || null
    }).returning();
    return result[0];
  }
}