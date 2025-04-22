import { Cliente } from './clientes';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: Cliente
        Insert: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>
      }
      // Adicione outras tabelas conforme necessário
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
