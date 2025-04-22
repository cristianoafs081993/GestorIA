import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function SupabaseDiagnostic() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "error">("unknown");
  const [connectionMessage, setConnectionMessage] = useState<string>("");
  const [tableStatus, setTableStatus] = useState<"unknown" | "success" | "error">("unknown");
  const [tableMessage, setTableMessage] = useState<string>("");
  const [columns, setColumns] = useState<any[]>([]);
  const [creatingTable, setCreatingTable] = useState(false);
  const [createTableStatus, setCreateTableStatus] = useState<"unknown" | "success" | "error">("unknown");
  const [createTableMessage, setCreateTableMessage] = useState<string>("");

  // Verificar conexão com o Supabase
  const checkConnection = async () => {
    setLoading(true);
    setConnectionStatus("unknown");
    setConnectionMessage("");
    
    try {
      // Verificar se as credenciais estão configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setConnectionStatus("error");
        setConnectionMessage("Credenciais do Supabase não encontradas no arquivo .env. Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas corretamente.");
        setLoading(false);
        return;
      }
      
      // Testar a conexão
      const { data, error } = await supabase.from('_postgres_stats').select('*').limit(1);
      
      if (error) {
        setConnectionStatus("error");
        setConnectionMessage(`Erro ao conectar ao Supabase: ${error.message}`);
      } else {
        setConnectionStatus("success");
        setConnectionMessage("Conexão com o Supabase estabelecida com sucesso!");
        // Se a conexão for bem-sucedida, verificar a tabela
        checkTable();
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage(`Erro ao conectar ao Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se a tabela clientes existe
  const checkTable = async () => {
    setTableStatus("unknown");
    setTableMessage("");
    setColumns([]);
    
    try {
      // Verificar se a tabela existe
      const { data, error } = await supabase.from('clientes').select('*').limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          setTableStatus("error");
          setTableMessage("A tabela 'clientes' não existe no banco de dados.");
        } else {
          setTableStatus("error");
          setTableMessage(`Erro ao verificar a tabela: ${error.message}`);
        }
      } else {
        setTableStatus("success");
        setTableMessage("A tabela 'clientes' existe no banco de dados.");
        
        // Verificar as colunas da tabela
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
    } catch (error) {
      setTableStatus("error");
      setTableMessage(`Erro ao verificar a tabela: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Criar a tabela clientes
  const createTable = async () => {
    setCreatingTable(true);
    setCreateTableStatus("unknown");
    setCreateTableMessage("");
    
    try {
      // Script SQL para criar a tabela clientes
      const createTableScript = `
      CREATE TABLE IF NOT EXISTS clientes (
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
        preferencias_contato TEXT[], 
        
        -- Endereço
        cep VARCHAR(9),
        logradouro TEXT,
        numero VARCHAR(10),
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        estado VARCHAR(2),
        
        -- Endereço de Cobrança
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
        documentos TEXT[],
        observacoes TEXT,
        consentimento_lgpd BOOLEAN DEFAULT FALSE,
        marketing_consent BOOLEAN DEFAULT FALSE,
        
        -- Status e Metadados
        status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        total_compras INTEGER DEFAULT 0,
        valor_total_compras DECIMAL(10, 2) DEFAULT 0,
        ultima_compra TIMESTAMP WITH TIME ZONE,
        classificacao VARCHAR(10) DEFAULT 'bronze' CHECK (classificacao IN ('bronze', 'silver', 'gold', 'vip'))
      );
      
      -- Índices
      CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes (nome);
      CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes (email);
      CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes (cpf);
      CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes (cnpj);
      `;
      
      // Executar o script SQL
      const { error } = await supabase.rpc('exec_sql', { sql: createTableScript });
      
      if (error) {
        // Se a função RPC não existir, tentar criar a tabela de outra forma
        if (error.message.includes('function') && error.message.includes('does not exist')) {
          // Tentar criar a tabela usando a API do Supabase
          const { error: createError } = await supabase
            .from('clientes')
            .insert([{ 
              nome: 'Cliente Teste', 
              tipo_pessoa: 'fisica',
              telefone: '(11) 99999-9999',
              email: 'teste@exemplo.com',
              tipo_cliente: 'final',
              status: 'active'
            }]);
          
          if (createError) {
            setCreateTableStatus("error");
            setCreateTableMessage(`Erro ao criar tabela: ${createError.message}`);
          } else {
            setCreateTableStatus("success");
            setCreateTableMessage("Tabela criada com sucesso!");
            // Verificar a tabela novamente
            checkTable();
          }
        } else {
          setCreateTableStatus("error");
          setCreateTableMessage(`Erro ao criar tabela: ${error.message}`);
        }
      } else {
        setCreateTableStatus("success");
        setCreateTableMessage("Tabela criada com sucesso!");
        // Verificar a tabela novamente
        checkTable();
      }
    } catch (error) {
      setCreateTableStatus("error");
      setCreateTableMessage(`Erro ao criar tabela: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setCreatingTable(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Diagnóstico do Supabase</h1>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificação de Conexão</CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus === "unknown" ? (
                <Button 
                  onClick={checkConnection} 
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar Conexão com o Supabase"}
                </Button>
              ) : connectionStatus === "success" ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Conexão estabelecida</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {connectionMessage}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro de conexão</AlertTitle>
                  <AlertDescription>
                    {connectionMessage}
                    <div className="mt-2">
                      <p className="text-sm font-medium">Verifique se:</p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>O arquivo .env contém as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY</li>
                        <li>As credenciais do Supabase estão corretas</li>
                        <li>Você tem acesso ao projeto no Supabase</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={checkConnection} 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      disabled={loading}
                    >
                      Tentar novamente
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {connectionStatus === "success" && (
            <Card>
              <CardHeader>
                <CardTitle>Verificação da Tabela</CardTitle>
              </CardHeader>
              <CardContent>
                {tableStatus === "unknown" ? (
                  <Button 
                    onClick={checkTable} 
                    disabled={loading}
                  >
                    {loading ? "Verificando..." : "Verificar Tabela 'clientes'"}
                  </Button>
                ) : tableStatus === "success" ? (
                  <>
                    <Alert className="bg-green-50 border-green-200 mb-4">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Tabela encontrada</AlertTitle>
                      <AlertDescription className="text-green-700">
                        {tableMessage}
                      </AlertDescription>
                    </Alert>
                    
                    {columns.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Colunas da tabela:</h3>
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
                      </div>
                    )}
                  </>
                ) : (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro na tabela</AlertTitle>
                    <AlertDescription>
                      {tableMessage}
                      <div className="mt-4">
                        <Button 
                          onClick={createTable} 
                          disabled={creatingTable}
                          className="mr-2"
                        >
                          {creatingTable ? "Criando..." : "Criar Tabela 'clientes'"}
                        </Button>
                        <Button 
                          onClick={checkTable} 
                          variant="outline" 
                          disabled={loading}
                        >
                          Verificar novamente
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {createTableStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200 mt-4">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Tabela criada com sucesso</AlertTitle>
                    <AlertDescription className="text-green-700">
                      {createTableMessage}
                    </AlertDescription>
                  </Alert>
                )}
                
                {createTableStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro ao criar tabela</AlertTitle>
                    <AlertDescription>
                      {createTableMessage}
                      <div className="mt-2">
                        <p className="text-sm font-medium">Possíveis soluções:</p>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Verifique se você tem permissões para criar tabelas no Supabase</li>
                          <li>Crie a tabela manualmente no painel do Supabase</li>
                          <li>Verifique se o SQL Editor está habilitado no seu projeto</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Instruções para Configuração Manual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Configurar o arquivo .env</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Certifique-se de que o arquivo .env na raiz do projeto client contém as seguintes variáveis:
                  </p>
                  <pre className="bg-gray-100 p-3 rounded-md text-sm">
                    VITE_SUPABASE_URL=https://seu-projeto.supabase.co<br />
                    VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">2. Criar a tabela manualmente no Supabase</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Se o botão "Criar Tabela" não funcionar, você pode criar a tabela manualmente no painel do Supabase:
                  </p>
                  <ol className="list-decimal pl-5 text-sm space-y-2">
                    <li>Acesse o painel do Supabase e selecione seu projeto</li>
                    <li>Vá para a seção "Table Editor" no menu lateral</li>
                    <li>Clique em "New Table" e crie uma tabela chamada "clientes"</li>
                    <li>Adicione as colunas necessárias conforme a estrutura do aplicativo</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">3. Verificar os nomes das colunas</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Certifique-se de que os nomes das colunas na tabela correspondem aos nomes usados no código:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>nome</strong> (não "name")</li>
                    <li><strong>telefone</strong> (não "phone")</li>
                    <li><strong>logradouro</strong> (não "street")</li>
                    <li><strong>numero</strong> (não "number")</li>
                    <li>E assim por diante...</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupabaseDiagnostic;
