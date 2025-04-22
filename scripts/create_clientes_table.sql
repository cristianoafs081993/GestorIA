-- Criação da tabela de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Dados Pessoais
  tipo_pessoa VARCHAR(10) NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  nome TEXT NOT NULL,
  nome_fantasia TEXT,
  cpf VARCHAR(14),
  cnpj VARCHAR(18),
  rg VARCHAR(20),
  inscricao_estadual VARCHAR(20),
  data_nascimento DATE,
  data_fundacao DATE,
  genero VARCHAR(20),
  tipo_cliente VARCHAR(20) NOT NULL DEFAULT 'final',
  
  -- Contato
  telefone VARCHAR(20) NOT NULL,
  telefone_secundario VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  preferencias_contato TEXT[], -- Array de preferências (email, telefone, whatsapp, sms)
  
  -- Endereço
  cep VARCHAR(9),
  logradouro TEXT,
  numero VARCHAR(10),
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado VARCHAR(2),
  
  -- Endereço de Cobrança (se diferente)
  endereco_cobranca_igual BOOLEAN DEFAULT TRUE,
  cobranca_cep VARCHAR(9),
  cobranca_logradouro TEXT,
  cobranca_numero VARCHAR(10),
  cobranca_complemento TEXT,
  cobranca_bairro TEXT,
  cobranca_cidade TEXT,
  cobranca_estado VARCHAR(2),
  
  -- Dados Financeiros
  limite_credito DECIMAL(10, 2) DEFAULT 0,
  prazo_pagamento VARCHAR(20) DEFAULT 'cash',
  prazo_personalizado INTEGER,
  metodo_pagamento VARCHAR(20),
  tabela_preco VARCHAR(20) DEFAULT 'default',
  regime_tributario VARCHAR(20),
  
  -- Informações Adicionais
  cliente_desde DATE,
  tags TEXT[],
  origem_cliente VARCHAR(20),
  documentos TEXT[], -- URLs dos documentos armazenados
  observacoes TEXT,
  consentimento_lgpd BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  -- Status e Metadados
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  total_compras INTEGER DEFAULT 0,
  valor_total_compras DECIMAL(10, 2) DEFAULT 0,
  ultima_compra TIMESTAMP WITH TIME ZONE,
  classificacao VARCHAR(10) DEFAULT 'bronze' CHECK (classificacao IN ('bronze', 'silver', 'gold', 'vip')),
  
  -- Constraints
  CONSTRAINT check_pessoa_fisica CHECK (
    (tipo_pessoa = 'fisica' AND cpf IS NOT NULL) OR
    (tipo_pessoa = 'juridica' AND cnpj IS NOT NULL)
  ),
  CONSTRAINT unique_cpf UNIQUE (cpf),
  CONSTRAINT unique_cnpj UNIQUE (cnpj),
  CONSTRAINT unique_email UNIQUE (email)
);

-- Criação de índices para melhorar a performance de consultas
CREATE INDEX idx_clientes_nome ON clientes (nome);
CREATE INDEX idx_clientes_email ON clientes (email);
CREATE INDEX idx_clientes_cpf ON clientes (cpf);
CREATE INDEX idx_clientes_cnpj ON clientes (cnpj);
CREATE INDEX idx_clientes_status ON clientes (status);
CREATE INDEX idx_clientes_tipo_cliente ON clientes (tipo_cliente);
CREATE INDEX idx_clientes_cidade ON clientes (cidade);
CREATE INDEX idx_clientes_estado ON clientes (estado);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários na tabela
COMMENT ON TABLE clientes IS 'Tabela de clientes do sistema BusinessBooster';
COMMENT ON COLUMN clientes.tipo_pessoa IS 'Tipo de pessoa: fisica ou juridica';
COMMENT ON COLUMN clientes.preferencias_contato IS 'Array com as preferências de contato do cliente';
COMMENT ON COLUMN clientes.tags IS 'Array com tags para categorização do cliente';
COMMENT ON COLUMN clientes.documentos IS 'Array com URLs dos documentos armazenados';
COMMENT ON COLUMN clientes.status IS 'Status do cliente: active, inactive ou pending';
COMMENT ON COLUMN clientes.classificacao IS 'Classificação do cliente: bronze, silver, gold ou vip';
