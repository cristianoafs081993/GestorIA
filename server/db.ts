import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure o Neon para usar WebSocket (necessário para Serverless)
neonConfig.webSocketConstructor = ws;

// Arquivo desativado para frontend puro.
function getConnectionString() {
  // Se temos credenciais do Supabase, priorize-as
  if (process.env.SUPABASE_DB_PASSWORD) {
    const host = 'aws-0-us-east-1.pooler.supabase.com'; 
    const port = '6543';
    const database = 'postgres';
    const user = 'postgres.ulqjuhomwwcjqojnsgkz';
    const password = process.env.SUPABASE_DB_PASSWORD;
    
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }
  
  // Se não temos Supabase, use a string de conexão padrão
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "Credenciais do Supabase ou DATABASE_URL não estão configuradas.",
  );
}

// Crie um pool de conexão
export const pool = new Pool({ connectionString: getConnectionString() });

// Crie o cliente do Drizzle com o esquema
export const db = drizzle(pool, { schema });

// Função para testar a conexão com o banco de dados
export async function testDbConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida com sucesso:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
}