import { supabase } from '@/lib/supabase';
import { Cliente, ClienteInsert, ClienteUpdate } from '@/types/clientes';

const TABLE_NAME = 'clientes';

export const clientesService = {
  /**
   * Busca todos os clientes com opções de filtro
   */
  async getAll({
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'nome',
    sortOrder = 'asc',
    classificacao,
    tipo_cliente,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    classificacao?: string;
    tipo_cliente?: string;
  } = {}) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }

    if (classificacao) {
      query = query.eq('classificacao', classificacao);
    }

    if (tipo_cliente) {
      query = query.eq('tipo_cliente', tipo_cliente);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%,cnpj.ilike.%${search}%`);
    }

    // Aplicar ordenação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Aplicar paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as Cliente[],
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    };
  },

  /**
   * Busca um cliente pelo ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Cliente;
  },

  /**
   * Cria um novo cliente
   */
  async create(cliente: ClienteInsert) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(cliente)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Cliente;
  },

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, cliente: ClienteUpdate) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...cliente, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Cliente;
  },

  /**
   * Exclui um cliente
   */
  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  /**
   * Altera o status de um cliente
   */
  async changeStatus(id: string, status: 'active' | 'inactive' | 'pending') {
    return this.update(id, { status });
  },

  /**
   * Busca clientes por CPF ou CNPJ
   */
  async findByDocument(document: string) {
    // Remove caracteres não numéricos para comparação
    const cleanDocument = document.replace(/\D/g, '');
    
    let query = supabase
      .from(TABLE_NAME)
      .select('*');

    // Verifica se é CPF ou CNPJ pelo tamanho
    if (cleanDocument.length <= 11) {
      // Busca por CPF
      query = query.or(`cpf.ilike.%${cleanDocument}%`);
    } else {
      // Busca por CNPJ
      query = query.or(`cnpj.ilike.%${cleanDocument}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as Cliente[];
  },

  /**
   * Busca estatísticas de clientes
   */
  async getStats() {
    // Total de clientes
    const { count: totalClientes, error: errorTotal } = await supabase
      .from(TABLE_NAME)
      //.select('*', { count: 'exact', head: true });

    if (errorTotal) {
      throw new Error(errorTotal.message);
    }

    // Clientes ativos
    const { count: clientesAtivos, error: errorAtivos } = await supabase
      .from(TABLE_NAME)
      //.select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (errorAtivos) {
      throw new Error(errorAtivos.message);
    }

    // Novos clientes no mês atual
    const dataAtual = new Date();
    const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1).toISOString();
    const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).toISOString();

    const { count: novosClientesMes, error: errorNovos } = await supabase
      .from(TABLE_NAME)
      //.select('*', { count: 'exact', head: true })
      .gte('created_at', primeiroDiaMes)
      .lte('created_at', ultimoDiaMes);

    if (errorNovos) {
      throw new Error(errorNovos.message);
    }

    // Ticket médio (valor total de compras / total de compras)
    const { data: dadosTicket, error: errorTicket } = await supabase
      .from(TABLE_NAME)
      .select('valor_total_compras, total_compras')
      .gt('total_compras', 0);

    if (errorTicket) {
      throw new Error(errorTicket.message);
    }

    let ticketMedio = 0;
    let totalCompras = 0;
    let valorTotalCompras = 0;

    if (dadosTicket && dadosTicket.length > 0) {
      dadosTicket.forEach((cliente) => {
        totalCompras += cliente.total_compras;
        valorTotalCompras += cliente.valor_total_compras;
      });

      ticketMedio = totalCompras > 0 ? valorTotalCompras / totalCompras : 0;
    }

    return {
      totalClientes: totalClientes || 0,
      clientesAtivos: clientesAtivos || 0,
      novosClientesMes: novosClientesMes || 0,
      ticketMedio,
    };
  }
};

export default clientesService;
