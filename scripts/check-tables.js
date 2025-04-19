import { createClient } from '@supabase/supabase-js';

// Verifica as credenciais do Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Credenciais do Supabase não definidas.');
  console.log('Por favor, defina as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function listTables() {
  console.log('🔄 Conectando ao Supabase...');
  
  try {
    // Consultando todas as tabelas de todos os schemas
    const { data, error } = await supabase
      .rpc('list_tables')
      .select('*');
    
    if (error) {
      // Se a função RPC não existir, tentamos uma consulta SQL direta
      console.log('⚠️ Função RPC não disponível, tentando consulta SQL direta...');
      
      const { data: sqlData, error: sqlError } = await supabase
        .from('_schemanames')
        .select('*')
        .limit(1);
      
      if (sqlError) {
        console.log('⚠️ Consulta SQL direta não disponível, usando consulta personalizada via PostgreSQL...');
        
        // Criando uma consulta SQL personalizada para listar todas as tabelas
        const sqlQuery = `
          SELECT table_schema, table_name
          FROM information_schema.tables
          WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          ORDER BY table_schema, table_name
        `;
        
        const { data: pgData, error: pgError } = await supabase.rpc('pg_query', { query: sqlQuery });
        
        if (pgError) {
          console.log('⚠️ Função pg_query não disponível, criando função auxiliar...');
          
          // Tentando criar uma função auxiliar para executar consultas SQL
          const createFunctionQuery = `
            CREATE OR REPLACE FUNCTION public.list_all_tables()
            RETURNS TABLE(schema_name text, table_name text) AS $$
            BEGIN
              RETURN QUERY
              SELECT table_schema::text, table_name::text
              FROM information_schema.tables
              WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
              ORDER BY table_schema, table_name;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `;
          
          const { error: createError } = await supabase.rpc('pg_query', { query: createFunctionQuery });
          
          if (createError) {
            throw new Error(`Não foi possível criar função auxiliar: ${createError.message}`);
          }
          
          // Chamando a função recém-criada
          const { data: fnData, error: fnError } = await supabase.rpc('list_all_tables');
          
          if (fnError) {
            throw new Error(`Erro ao chamar função auxiliar: ${fnError.message}`);
          }
          
          console.log('\n📋 Tabelas encontradas no banco de dados:');
          if (fnData.length === 0) {
            console.log('❌ Nenhuma tabela encontrada!');
          } else {
            fnData.forEach(row => {
              console.log(`- Schema: ${row.schema_name}, Tabela: ${row.table_name}`);
            });
          }
          
          return;
        }
        
        console.log('\n📋 Tabelas encontradas no banco de dados:');
        if (pgData.length === 0) {
          console.log('❌ Nenhuma tabela encontrada!');
        } else {
          pgData.forEach(row => {
            console.log(`- Schema: ${row.table_schema}, Tabela: ${row.table_name}`);
          });
        }
        
        return;
      }
      
      // Se não conseguimos consultar via SQL, tentamos uma abordagem diferente
      console.log('\n⚠️ Não foi possível listar tabelas via SQL. Tentando método alternativo...');
      
      // Tentativa alternativa: consultar diretamente a tabela de usuários que sabemos que existe
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (usersError) {
        console.log(`❌ Erro ao consultar tabela 'users': ${usersError.message}`);
        if (usersError.message.includes("relation") && usersError.message.includes("does not exist")) {
          console.log('⚠️ A tabela users não existe. Verifique se as tabelas foram criadas corretamente.');
        }
      } else {
        console.log('✅ Tabela users encontrada e acessível!');
        console.log(`📊 Dados da tabela users: ${JSON.stringify(usersData, null, 2)}`);
      }
      
      return;
    }
    
    console.log('\n📋 Tabelas encontradas no banco de dados:');
    if (data.length === 0) {
      console.log('❌ Nenhuma tabela encontrada!');
    } else {
      data.forEach(table => {
        console.log(`- Schema: ${table.schema_name}, Tabela: ${table.table_name}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao listar tabelas:', error);
    
    // Tentando uma abordagem mais direta se todas as outras falharem
    console.log('\n⚠️ Tentando abordagem alternativa...');
    
    try {
      // Tenta um método mais simples para verificar a existência de tabelas
      const tables = ['users', 'products', 'customers', 'sales', 'sale_items', 'invoices', 'blog_posts', 'blog_comments', 'leads'];
      
      console.log('📋 Verificando tabelas individuais:');
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          
          if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) {
              console.log(`❌ Tabela '${table}' não existe.`);
            } else {
              console.log(`⚠️ Erro ao consultar tabela '${table}': ${error.message}`);
            }
          } else {
            console.log(`✅ Tabela '${table}' existe e está acessível!`);
          }
        } catch (err) {
          console.log(`⚠️ Erro ao verificar tabela '${table}': ${err.message}`);
        }
      }
    } catch (finalError) {
      console.error('❌ Falha na verificação final:', finalError);
    }
  }
  
  console.log('\n🔍 Recomendações:');
  console.log('1. Verifique se você está usando o schema correto no painel do Supabase (geralmente "public").');
  console.log('2. Execute o script de criação das tabelas novamente: "tsx scripts/setup-supabase.js".');
  console.log('3. Verifique o arquivo drizzle.config.ts para garantir que o schema correto está sendo usado.');
  console.log('4. No painel do Supabase, vá para SQL Editor e execute: "SELECT * FROM information_schema.tables WHERE table_schema = \'public\'".');
}

listTables();