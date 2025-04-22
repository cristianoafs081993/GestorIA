export type TipoPessoa = 'fisica' | 'juridica';
export type StatusCliente = 'active' | 'inactive' | 'pending';
export type ClassificacaoCliente = 'bronze' | 'silver' | 'gold' | 'vip';
export type TipoCliente = 'final' | 'reseller' | 'wholesale' | 'vip';
export type MetodoPagamento = 'cash' | 'credit_card' | 'debit_card' | 'bank_slip' | 'bank_transfer' | 'pix';
export type TabelaPreco = 'default' | 'wholesale' | 'reseller' | 'vip';
export type RegimeTributario = 'simple' | 'real' | 'presumed' | 'not_applicable';
export type OrigemCliente = 'website' | 'social_media' | 'referral' | 'ad' | 'direct' | 'other';
export type PreferenciaContato = 'email' | 'phone' | 'whatsapp' | 'sms';

export interface Cliente {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Dados Pessoais
  tipo_pessoa: TipoPessoa;
  nome: string;
  nome_fantasia?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  inscricao_estadual?: string;
  data_nascimento?: string;
  data_fundacao?: string;
  genero?: string;
  tipo_cliente: TipoCliente;
  
  // Contato
  telefone: string;
  telefone_secundario?: string;
  whatsapp?: string;
  email: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  preferencias_contato?: PreferenciaContato[];
  
  // Endereço
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  // Endereço de Cobrança (se diferente)
  endereco_cobranca_igual: boolean;
  cobranca_cep?: string;
  cobranca_logradouro?: string;
  cobranca_numero?: string;
  cobranca_complemento?: string;
  cobranca_bairro?: string;
  cobranca_cidade?: string;
  cobranca_estado?: string;
  
  // Dados Financeiros
  limite_credito?: number;
  prazo_pagamento: string;
  prazo_personalizado?: number;
  metodo_pagamento?: MetodoPagamento;
  tabela_preco: TabelaPreco;
  regime_tributario?: RegimeTributario;
  
  // Informações Adicionais
  cliente_desde?: string;
  tags?: string[];
  origem_cliente?: OrigemCliente;
  documentos?: string[];
  observacoes?: string;
  consentimento_lgpd: boolean;
  marketing_consent: boolean;
  
  // Status e Metadados
  status: StatusCliente;
  total_compras: number;
  valor_total_compras: number;
  ultima_compra?: string;
  classificacao: ClassificacaoCliente;
}

export type ClienteInsert = Omit<Cliente, 'id' | 'created_at' | 'updated_at' | 'total_compras' | 'valor_total_compras' | 'ultima_compra'>;
export type ClienteUpdate = Partial<ClienteInsert>;
