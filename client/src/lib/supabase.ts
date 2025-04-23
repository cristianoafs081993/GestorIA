// Supabase desativado: integração removida para frontend puro.

// Exporta uma função para verificar a conexão
export const checkSupabaseConnection = async () => {
  try {
    console.log('Tentando conectar ao Supabase...');
    
    // Verificar a conexão diretamente na tabela de clientes
    const { data, error } = await supabase
      .from('clientes')
      .select('count()')
      .limit(0);
    
    // Se houver erro, vamos tentar verificar se é um problema de permissão ou de tabela inexistente
    if (error) {
      console.error('Erro ao acessar tabela clientes:', error.message);
      
      // Verificar se o erro é relacionado à tabela inexistente
      if (error.message.includes('does not exist')) {
        console.error('A tabela "clientes" não existe. Execute o script SQL para criá-la.');
        return false;
      }
      
      // Verificar se é um erro de permissão
      if (error.message.includes('permission denied')) {
        console.error('Permissão negada para acessar a tabela clientes. Verifique as políticas de segurança do Supabase.');
        return false;
      }
      
      throw error;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso!');
    
    // Agora, vamos verificar se a tabela clientes existe
    try {
      const { data, error } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Erro ao acessar tabela clientes:', error.message);
        throw error;
      }
      
      console.log('Tabela clientes encontrada!');
      return true;
    } catch (tableError) {
      console.error('Erro ao verificar tabela clientes:', tableError);
      
      // Verificar o esquema da tabela
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type')
          .eq('table_name', 'clientes');
        
        if (schemaError) {
          console.error('Erro ao verificar esquema da tabela:', schemaError.message);
        } else {
          console.log('Esquema da tabela clientes:', schemaData);
        }
      } catch (schemaCheckError) {
        console.error('Erro ao verificar esquema:', schemaCheckError);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return false;
  }
};

// Função para verificar a estrutura da tabela clientes
export const checkClientesTable = async () => {
  try {
    // Verificar se a tabela existe tentando fazer uma consulta simples
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.error('A tabela "clientes" não existe. Execute o script SQL para criá-la.');
        return { exists: false, message: 'Tabela não existe' };
      }
      
      console.error('Erro ao verificar tabela clientes:', error.message);
      return { exists: false, message: error.message };
    }
    
    // Verificar as colunas da tabela
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'clientes' });
    
    if (columnsError) {
      console.error('Erro ao verificar colunas da tabela:', columnsError.message);
      return { exists: true, columns: [], message: columnsError.message };
    }
    
    console.log('Colunas da tabela clientes:', columns);
    return { exists: true, columns, message: 'Tabela existe e colunas verificadas' };
  } catch (error) {
    console.error('Erro ao verificar tabela clientes:', error);
    return { exists: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};
