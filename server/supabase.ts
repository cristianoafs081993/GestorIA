import { createClient } from '@supabase/supabase-js';
import { env } from './config/env';

// Verificação das variáveis de ambiente do Supabase
if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.warn('Supabase URL e/ou chave não definidas. Alguns recursos podem não funcionar corretamente.');
}

// Criação do cliente Supabase
export const supabase = createClient(
  env.SUPABASE_URL || '',
  env.SUPABASE_ANON_KEY || ''
);

// Função para verificar a conexão com o Supabase
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error.message);
      return false;
    }
    console.log('Conexão com Supabase estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao Supabase:', error);
    return false;
  }
}