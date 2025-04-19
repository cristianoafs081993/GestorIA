import { createClient } from '@supabase/supabase-js';
import * as schema from '../shared/schema.js';
import { exec } from 'child_process';

// Criamos uma versão ES module do objeto schema para poder importar no Node
const schemaObjects = Object.entries(schema)
  .filter(([_, value]) => value && typeof value === 'object' && value.name)
  .map(([_, table]) => table);

async function setupSupabaseTables() {
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

  console.log('🔄 Conectando ao Supabase...');
  
  try {
    // Teste de conexão
    const { error } = await supabase.from('_dummy_query_').select('*').limit(1);
    
    // Se o erro for "relation does not exist", a conexão está ok
    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      throw new Error(`Erro de conexão: ${error.message}`);
    }

    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('🔄 Configurando tabelas no Supabase...');

    // Executamos o comando drizzle-kit push para criar as tabelas
    exec('npm run db:push', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erro ao executar drizzle-kit: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`❌ Erro: ${stderr}`);
        return;
      }
      
      console.log('✅ Tabelas criadas/atualizadas com sucesso!');
      console.log(stdout);
      
      console.log('\n📋 Schema atual (tabelas criadas):');
      Object.entries(schema)
        .filter(([key, value]) => value && typeof value === 'object' && value.name)
        .forEach(([key, table]) => {
          console.log(`- ${key}`);
        });
      
      console.log('\n🚀 Banco de dados configurado com sucesso!');
      console.log('🔍 Você agora pode visualizar suas tabelas no painel do Supabase:');
      console.log(`🌐 ${process.env.SUPABASE_URL}/project/default/editor`);
    });
  } catch (error) {
    console.error('❌ Erro ao configurar tabelas:', error.message);
    process.exit(1);
  }
}

setupSupabaseTables();