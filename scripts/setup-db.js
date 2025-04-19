// Script para configurar e inicializar o banco de dados
import { execSync } from 'child_process';

// Configura a string de conexão com base nas credenciais do Supabase
function getConnectionString() {
  // Se já temos uma string de conexão completa, use-a
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Se temos credenciais do Supabase, construa a string de conexão
  if (process.env.SUPABASE_DB_PASSWORD) {
    const host = 'aws-0-us-east-1.pooler.supabase.com'; 
    const port = '6543';
    const database = 'postgres';
    const user = 'postgres.ulqjuhomwwcjqojnsgkz';
    const password = process.env.SUPABASE_DB_PASSWORD;
    
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  throw new Error(
    "DATABASE_URL ou credenciais do Supabase não estão configuradas.",
  );
}

try {
  // Configura a variável de ambiente DATABASE_URL temporariamente
  const connectionString = getConnectionString();
  process.env.DATABASE_URL = connectionString;
  
  console.log('Configurando banco de dados...');
  
  // Executa o comando de criação/atualização das tabelas
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log('Banco de dados configurado com sucesso!');
} catch (error) {
  console.error('Erro ao configurar o banco de dados:', error);
  process.exit(1);
}