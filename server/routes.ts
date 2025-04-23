import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { insertUserSchema } from "../shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import MemoryStore from "memorystore";

// Auth validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Arquivo desativado para frontend puro.
  // Create session store
  const SessionStore = MemoryStore(session);

  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "gestor-ia-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000 // 24 hours
      },
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Senha incorreta" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Helper functions
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Não autorizado" });
  };

  const errorHandler = (res: Response, error: unknown) => {
    console.error("Error:", error);
    
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : "Erro interno do servidor" 
    });
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      // Check for email uniqueness
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao deslogar" });
      }
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ message: "Logout bem-sucedido" });
      });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.json({ user: null });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  // Product routes
  app.get("/api/products", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const products = await storage.getProducts(userId);
      res.json(products);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const product = await storage.createProduct({
        ...req.body,
        userId
      });
      res.status(201).json(product);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.patch("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const productId = parseInt(req.params.id);
      
      // Verify product ownership
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct || existingProduct.userId !== userId) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      const product = await storage.updateProduct(productId, req.body);
      res.json(product);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const productId = parseInt(req.params.id);
      
      // Verify product ownership
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct || existingProduct.userId !== userId) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      await storage.deleteProduct(productId);
      res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Customer routes
  app.get("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customers = await storage.getCustomers(userId);
      res.json(customers);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customer = await storage.createCustomer({
        ...req.body,
        userId
      });
      res.status(201).json(customer);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.patch("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customerId = parseInt(req.params.id);
      
      // Verify customer ownership
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer || existingCustomer.userId !== userId) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      const customer = await storage.updateCustomer(customerId, req.body);
      res.json(customer);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.delete("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customerId = parseInt(req.params.id);
      
      // Verify customer ownership
      const existingCustomer = await storage.getCustomer(customerId);
      if (!existingCustomer || existingCustomer.userId !== userId) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      await storage.deleteCustomer(customerId);
      res.json({ message: "Cliente removido com sucesso" });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Sales routes
  app.get("/api/sales", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const sales = await storage.getSales(userId);
      res.json(sales);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/sales/recent", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const sales = await storage.getRecentSales(userId, 5);
      res.json(sales);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/sales", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { items, ...saleData } = req.body;
      
      // Create the sale
      const sale = await storage.createSale({
        ...saleData,
        userId,
        customerId: saleData.customerId ? parseInt(saleData.customerId) : undefined
      });
      
      // Add sale items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await storage.createSaleItem({
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          });
          
          // Update product stock
          await storage.updateProductStock(item.productId, item.quantity);
        }
      }
      
      // Get the complete sale with items
      const completeData = await storage.getSale(sale.id);
      res.status(201).json(completeData);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/dashboard/sales-chart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const chartData = await storage.getSalesChartData(userId);
      res.json(chartData);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/dashboard/category-chart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const chartData = await storage.getCategoryChartData(userId);
      res.json(chartData);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Invoice routes
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { saleId } = req.body;
      
      // Verify sale exists and belongs to user
      const sale = await storage.getSale(saleId);
      if (!sale || sale.userId !== userId) {
        return res.status(404).json({ message: "Venda não encontrada" });
      }
      
      // Check if invoice already exists for this sale
      const existingInvoice = await storage.getInvoiceBySaleId(saleId);
      if (existingInvoice) {
        return res.json(existingInvoice);
      }
      
      // Generate invoice number
      const invoiceNumber = `NF-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;
      
      // Create invoice
      const invoice = await storage.createInvoice({
        userId,
        saleId,
        invoiceNumber,
        status: "issued"
      });
      
      res.status(201).json(invoice);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/invoices/:id/cancel", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const invoiceId = parseInt(req.params.id);
      
      // Verify invoice ownership
      const existingInvoice = await storage.getInvoice(invoiceId);
      if (!existingInvoice || existingInvoice.userId !== userId) {
        return res.status(404).json({ message: "Nota fiscal não encontrada" });
      }
      
      // Cancel invoice
      const invoice = await storage.updateInvoiceStatus(invoiceId, "canceled");
      res.json(invoice);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/invoices/:id/send", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const invoiceId = parseInt(req.params.id);
      const { email } = req.body;
      
      // Verify invoice ownership
      const existingInvoice = await storage.getInvoice(invoiceId);
      if (!existingInvoice || existingInvoice.userId !== userId) {
        return res.status(404).json({ message: "Nota fiscal não encontrada" });
      }
      
      // Update invoice status to sent
      const invoice = await storage.updateInvoiceStatus(invoiceId, "sent");
      
      // In a real application, you would send the invoice by email here
      
      res.json({ message: "Nota fiscal enviada com sucesso", invoice });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      // Public blog posts are available to all users
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/recent", async (req, res) => {
    try {
      // Get recent published blog posts
      const posts = await storage.getRecentBlogPosts(3);
      res.json(posts);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/popular", async (req, res) => {
    try {
      // Get popular published blog posts
      const posts = await storage.getPopularBlogPosts(3);
      res.json(posts);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post || !post.published) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }
      
      res.json(post);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/related/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const relatedPosts = await storage.getRelatedBlogPosts(slug, 3);
      res.json(relatedPosts);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.get("/api/blog/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getApprovedBlogComments(postId);
      res.json(comments);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/blog/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { name, email, content } = req.body;
      
      // Verify post exists and is published
      const post = await storage.getBlogPost(postId);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }
      
      // Create comment (unapproved by default)
      const comment = await storage.createBlogComment({
        postId,
        name,
        email,
        content,
        approved: false
      });
      
      res.status(201).json(comment);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Blog admin routes (require authentication)
  app.get("/api/blog/admin/all", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const posts = await storage.getAllBlogPosts(userId);
      res.json(posts);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.post("/api/blog", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const post = await storage.createBlogPost({
        ...req.body,
        userId
      });
      res.status(201).json(post);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.patch("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const postId = parseInt(req.params.id);
      
      // Verify post ownership
      const existingPost = await storage.getBlogPost(postId);
      if (!existingPost || existingPost.userId !== userId) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }
      
      const post = await storage.updateBlogPost(postId, req.body);
      res.json(post);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const postId = parseInt(req.params.id);
      
      // Verify post ownership
      const existingPost = await storage.getBlogPost(postId);
      if (!existingPost || existingPost.userId !== userId) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }
      
      await storage.deleteBlogPost(postId);
      res.json({ message: "Artigo removido com sucesso" });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Blog comment management routes (require authentication)
  app.get("/api/blog/comments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const comments = await storage.getAllBlogComments(userId);
      res.json(comments);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.patch("/api/blog/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const commentId = parseInt(req.params.id);
      const { approved } = req.body;
      
      // Verify comment is on a post owned by the user
      const comment = await storage.getBlogComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }
      
      const post = await storage.getBlogPost(comment.postId);
      if (!post || post.userId !== userId) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      const updatedComment = await storage.updateBlogComment(commentId, { approved });
      res.json(updatedComment);
    } catch (error) {
      errorHandler(res, error);
    }
  });

  app.delete("/api/blog/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const commentId = parseInt(req.params.id);
      
      // Verify comment is on a post owned by the user
      const comment = await storage.getBlogComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }
      
      const post = await storage.getBlogPost(comment.postId);
      if (!post || post.userId !== userId) {
        return res.status(403).json({ message: "Não autorizado" });
      }
      
      await storage.deleteBlogComment(commentId);
      res.json({ message: "Comentário removido com sucesso" });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Check if email already exists in leads
      const existingLead = await storage.getLeadByEmail(email);
      if (existingLead) {
        return res.json({ message: "Email já cadastrado na newsletter" });
      }
      
      // Create new lead
      const lead = await storage.createLead({
        email,
        source: "newsletter"
      });
      
      res.status(201).json({ message: "Inscrição na newsletter realizada com sucesso" });
    } catch (error) {
      errorHandler(res, error);
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
