import { useState, useEffect } from "react";
import { supabase, checkClientesTable } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function DiagnosticoSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Não verificado");
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [columns, setColumns] = useState<any[]>([]);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar conexão básica
      const { data, error } = await supabase.from('_postgres_stats').select('*').limit(1);
      
      if (error) {
        setConnectionStatus("Falha na conexão");
        setError(error.message);
      } else {
        setConnectionStatus("Conectado com sucesso");
        
        // Verificar tabela clientes
        const tableResult = await checkClientesTable();
        setTableInfo(tableResult);
        
        // Verificar colunas diretamente
        try {
          const { data: columnsData, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'clientes');
            
          if (columnsError) {
            console.error("Erro ao buscar colunas:", columnsError);
          } else {
            setColumns(columnsData || []);
          }
        } catch (e) {
          console.error("Erro ao verificar colunas:", e);
        }
      }
    } catch (e) {
      setConnectionStatus("Erro");
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const executeCreateTableScript = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Script SQL para criar a tabela clientes
      const createTableScript = `
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
      `;
      
      // Executar o script SQL
      const { error } = await supabase.rpc('exec_sql', { sql: createTableScript });
      
      if (error) {
        setError(`Erro ao criar tabela: ${error.message}`);
      } else {
        alert("Tabela criada com sucesso!");
        // Verificar novamente a conexão e a tabela
        checkConnection();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Diagnóstico do Supabase</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Conexão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="font-semibold">Status: </span>
                <span className={`${connectionStatus === "Conectado com sucesso" ? "text-green-500" : "text-red-500"}`}>
                  {connectionStatus}
                </span>
              </div>
              
              {error && (
                <div className="text-red-500 mb-4">
                  <span className="font-semibold">Erro: </span>
                  {error}
                </div>
              )}
              
              <Button 
                onClick={checkConnection} 
                disabled={loading}
                className="mr-2"
              >
                {loading ? "Verificando..." : "Verificar Conexão"}
              </Button>
              
              <Button 
                onClick={executeCreateTableScript} 
                disabled={loading}
                variant="outline"
              >
                Criar Tabela Clientes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações da Tabela</CardTitle>
            </CardHeader>
            <CardContent>
              {tableInfo ? (
                <div>
                  <div className="mb-2">
                    <span className="font-semibold">Tabela existe: </span>
                    <span className={`${tableInfo.exists ? "text-green-500" : "text-red-500"}`}>
                      {tableInfo.exists ? "Sim" : "Não"}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="font-semibold">Mensagem: </span>
                    {tableInfo.message}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Clique em "Verificar Conexão" para ver informações da tabela
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Colunas da Tabela</CardTitle>
          </CardHeader>
          <CardContent>
            {columns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Nome da Coluna</th>
                      <th className="border p-2 text-left">Tipo de Dados</th>
                      <th className="border p-2 text-left">Permite Nulo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((column, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{column.column_name}</td>
                        <td className="border p-2">{column.data_type}</td>
                        <td className="border p-2">{column.is_nullable === 'YES' ? 'Sim' : 'Não'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">
                {loading ? "Carregando colunas..." : "Nenhuma coluna encontrada ou tabela não existe"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DiagnosticoSupabase;
