import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Verificação das variáveis de ambiente do Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_ANON_KEY devem ser definidos nas variáveis de ambiente');
  process.exit(1);
}

// Criação do cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Função para verificar se uma tabela existe
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

// Função para criar tabelas no Supabase
async function setupSupabaseTables() {
  console.log('🔄 Verificando e criando tabelas no Supabase...');

  // Array de definições de tabelas
  const tables = [
    {
      name: 'users',
      columns: `
        id serial primary key,
        username text not null unique,
        password text not null,
        email text not null unique,
        "fullName" text not null,
        "companyName" text not null,
        phone text,
        role text default 'user',
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'products',
      columns: `
        id serial primary key,
        name text not null,
        "userId" integer not null references users(id),
        description text,
        price text not null,
        cost text,
        sku text,
        barcode text,
        stock integer,
        "minStock" integer,
        category text,
        image text,
        active boolean default true,
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'customers',
      columns: `
        id serial primary key,
        name text not null,
        "userId" integer not null references users(id),
        email text,
        phone text,
        address text,
        city text,
        state text,
        "zipCode" text,
        notes text,
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'sales',
      columns: `
        id serial primary key,
        "userId" integer not null references users(id),
        "customerId" integer references customers(id),
        total text not null,
        tax text,
        discount text,
        "paymentMethod" text not null,
        status text not null default 'completed',
        notes text,
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'sale_items',
      columns: `
        id serial primary key,
        "saleId" integer not null references sales(id),
        "productId" integer not null references products(id),
        quantity integer not null,
        price text not null,
        "totalPrice" text not null
      `
    },
    {
      name: 'invoices',
      columns: `
        id serial primary key,
        "userId" integer not null references users(id),
        "saleId" integer not null references sales(id),
        "invoiceNumber" text not null,
        status text not null default 'pending',
        "dueDate" timestamp with time zone,
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'blog_posts',
      columns: `
        id serial primary key,
        "userId" integer not null references users(id),
        title text not null,
        slug text not null unique,
        content text not null,
        excerpt text,
        category text,
        "coverImage" text,
        published boolean default false,
        views integer default 0,
        "createdAt" timestamp with time zone default now(),
        "updatedAt" timestamp with time zone default now()
      `
    },
    {
      name: 'blog_comments',
      columns: `
        id serial primary key,
        "postId" integer not null references blog_posts(id),
        name text not null,
        email text not null,
        content text not null,
        approved boolean default false,
        "createdAt" timestamp with time zone default now()
      `
    },
    {
      name: 'leads',
      columns: `
        id serial primary key,
        email text not null unique,
        name text,
        source text,
        "createdAt" timestamp with time zone default now()
      `
    }
  ];

  for (const table of tables) {
    const exists = await tableExists(table.name);
    
    if (!exists) {
      console.log(`🔄 Criando tabela ${table.name}...`);
      
      // Usando SQL RPC para criar a tabela
      const { error } = await supabase.rpc('create_table', {
        table_name: table.name,
        table_definition: table.columns
      });

      if (error) {
        // Se a RPC não estiver disponível, alertamos o usuário
        console.error(`❌ Erro ao criar tabela ${table.name}: ${error.message}`);
        console.log(`⚠️ Você precisará criar a tabela ${table.name} manualmente no painel do Supabase ou usando a interface SQL.`);
        console.log(`Definição da tabela: 
CREATE TABLE public.${table.name} (
  ${table.columns}
);`);
      } else {
        console.log(`✅ Tabela ${table.name} criada com sucesso!`);
      }
    } else {
      console.log(`✅ Tabela ${table.name} já existe!`);
    }
  }
}

// Função principal
async function main() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    
    // Teste simples para verificar se conseguimos conectar ao Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao conectar ao Supabase:', error.message);
      return;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    
    // Cria função de utilidade para criar tabelas (caso não exista)
    console.log('🔄 Verificando função de criação de tabelas...');
    
    const { error: funcError } = await supabase.rpc('create_table', {
      table_name: 'test_table',
      table_definition: 'id serial primary key, name text'
    });
    
    if (funcError && funcError.code === '42883') { // Código para função não existente
      console.log('⚠️ Função create_table não existe. Criando via interface SQL...');
      console.log(`
Para criar tabelas, você precisará criar a seguinte função no editor SQL do Supabase:

CREATE OR REPLACE FUNCTION create_table(table_name text, table_definition text)
RETURNS void AS $$
BEGIN
  EXECUTE 'CREATE TABLE IF NOT EXISTS public.' || quote_ident(table_name) || ' (' || table_definition || ')';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
    } else {
      // Continua com a criação das tabelas
      await setupSupabaseTables();
    }
    
    console.log('✅ Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o processo:', error);
  }
}

main();