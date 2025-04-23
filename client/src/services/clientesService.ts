// import { supabase } from '@/lib/supabase'; // Removido para frontend puro
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
    // MOCK: retorna lista fixa de clientes
    const mockClientes: Cliente[] = [
      {
        id: '1',
        nome: 'Cliente Exemplo',
        email: 'cliente@exemplo.com',
        telefone: '11999999999',
        cpf: '12345678901',
        cnpj: '',
        status: 'active',
        classificacao: 'bronze',
        total_compras: 2,
        valor_total_compras: 1500,
        endereco_cobranca_igual: true,
        consentimento_lgpd: false,
        marketing_consent: false,
        tipo_cliente: 'final',
        tabela_preco: 'default',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    return {
      data: mockClientes,
      total: mockClientes.length,
      page,
      limit,
      totalPages: 1,
    };
  },

  /**
   * Busca um cliente pelo ID
   */
  async getById(id: string) {
    // MOCK: retorna um cliente fictício
    return {
      id,
      nome: 'Cliente Exemplo',
      email: 'cliente@exemplo.com',
      telefone: '11999999999',
      cpf: '12345678901',
      cnpj: '',
      status: 'active',
      classificacao: 'bronze',
      total_compras: 2,
      valor_total_compras: 1500,
      endereco_cobranca_igual: true,
      consentimento_lgpd: false,
      marketing_consent: false,
      tipo_cliente: 'final',
      tabela_preco: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Cria um novo cliente
   */
  async create(cliente: ClienteInsert) {
    // MOCK: retorna o cliente criado
    return {
      ...cliente,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Cliente;
  },

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, cliente: ClienteUpdate) {
    // MOCK: retorna cliente atualizado
    return {
      ...cliente,
      id,
      updated_at: new Date().toISOString(),
    } as Cliente;
  },

  /**
   * Exclui um cliente
   */
  async delete(id: string) {
    // MOCK: simula exclusão
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
    // MOCK: retorna um cliente se o documento for igual ao mock
    if (document.replace(/\D/g, '') === '12345678901') {
      return [
        {
          id: '1',
          nome: 'Cliente Exemplo',
          email: 'cliente@exemplo.com',
          telefone: '11999999999',
          cpf: '12345678901',
          cnpj: '',
          status: 'active',
          classificacao: 'bronze',
          total_compras: 2,
          valor_total_compras: 1500,
          endereco_cobranca_igual: true,
          consentimento_lgpd: false,
          marketing_consent: false,
          tipo_cliente: 'final',
          tabela_preco: 'default',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
    return [];
  },

  /**
   * Busca estatísticas de clientes
   */
  async getStats() {
    // MOCK: retorna estatísticas fictícias
    return {
      totalClientes: 1,
      clientesAtivos: 1,
      novosClientesMes: 1,
      ticketMedio: 1500,
    };
  },
};

export default clientesService;
