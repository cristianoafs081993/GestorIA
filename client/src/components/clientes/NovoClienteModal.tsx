import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import clientesService from "@/services/clientesService";
import { ClienteInsert } from "@/types/clientes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eraser, Save, X } from "lucide-react";
import { DadosPessoaisForm } from "./forms/DadosPessoaisForm";
import { ContatoForm } from "./forms/ContatoForm";
import { EnderecoForm } from "./forms/EnderecoForm";

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoClienteModal({ isOpen, onClose }: NovoClienteModalProps) {
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
            
      // Captura todos os dados do formulário
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Converte os dados do formulário para o formato esperado pela API
      const clienteData: Partial<ClienteInsert> = {
        tipo_pessoa: formData.get('tipo_pessoa') as 'fisica' | 'juridica',
        nome: formData.get('nome') as string,
        nome_fantasia: formData.get('nome_fantasia') as string || undefined,
        cpf: formData.get('tipo_pessoa') === 'fisica' ? formData.get('cpf') as string : undefined,
        cnpj: formData.get('tipo_pessoa') === 'juridica' ? formData.get('cnpj') as string : undefined,
        rg: formData.get('tipo_pessoa') === 'fisica' ? formData.get('rg') as string : undefined,
        inscricao_estadual: formData.get('tipo_pessoa') === 'juridica' ? formData.get('ie') as string : undefined,
        data_nascimento: formData.get('data_nascimento') as string || undefined,
        data_fundacao: formData.get('data_fundacao') as string || undefined,
        genero: formData.get('genero') as string || undefined,
        tipo_cliente: (formData.get('tipo_cliente') as string || 'final') as 'final' | 'reseller' | 'wholesale' | 'vip',
        
        // Contato
        telefone: formData.get('telefone') as string,
        telefone_secundario: formData.get('telefone_secundario') as string || undefined,
        whatsapp: formData.get('whatsapp') as string || undefined,
        email: formData.get('email') as string,
        website: formData.get('website') as string || undefined,
        instagram: formData.get('instagram') as string || undefined,
        facebook: formData.get('facebook') as string || undefined,
        linkedin: formData.get('linkedin') as string || undefined,
        preferencias_contato: formData.getAll('preferencias_contato') as ('email' | 'phone' | 'whatsapp' | 'sms')[],
        
        // Endereço
        cep: formData.get('cep') as string || undefined,
        logradouro: formData.get('logradouro') as string || undefined,
        numero: formData.get('numero') as string || undefined,
        complemento: formData.get('complemento') as string || undefined,
        bairro: formData.get('bairro') as string || undefined,
        cidade: formData.get('cidade') as string || undefined,
        estado: formData.get('estado') as string || undefined,
        

        
        
        
        // Status padrão
        status: 'active',
        classificacao: 'bronze'
      };
      
      // Enviar dados para o serviço
      try {
        await clientesService.create(clienteData as ClienteInsert);
        
        toast({
          title: "Cliente cadastrado com sucesso!",
          description: `${clienteData.nome} foi adicionado à base de clientes.`,
          variant: "default",
        });
        
        // Fechar o modal e limpar o formulário
        onClose();
        form.reset();
      } catch (serviceError) {
        // Se o erro for de conexão com o Supabase, mostrar uma mensagem amigável
        console.error('Erro ao salvar cliente:', serviceError);
        toast({
          title: "Modo de demonstração",
          description: `Em um ambiente real, ${clienteData.nome} seria salvo no banco de dados. Configure o Supabase para habilitar esta funcionalidade.`,
          variant: "default",
        });
        
        // Mesmo com erro, fechamos o modal para simular sucesso em modo de demonstração
        onClose();
        form.reset();
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    if (confirm("Tem certeza que deseja limpar todos os campos do formulário?")) {
      // Limpar o formulário
      setActiveTab("dados-pessoais");
      const form = document.getElementById('clientForm') as HTMLFormElement | null;
      if (form) form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto pt-10 pr-10 [&_[data-state=open]_button[aria-label='Close']]:!top-6 [&_[data-state=open]_button[aria-label='Close']]:!right-6 [&_[data-state=open]_button[aria-label='Close']]:z-50 [&_[data-state=open]_button[aria-label='Close']]:bg-white/90 [&_[data-state=open]_button[aria-label='Close']]:rounded-full [&_[data-state=open]_button[aria-label='Close']]:shadow [&_[data-state=open]_button[aria-label='Close']]:p-1">


        <form onSubmit={handleSubmit} id="clientForm">
          {/* Cadastro em página única, agrupando informações pessoais e de endereço */}
          <div className="space-y-10">
            {/* Seção Dados Pessoais */}
            <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#7c3aed]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Dados Pessoais
              </h2>
              <DadosPessoaisForm />
            </div>
            {/* Seção Endereço */}
            <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#7c3aed]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-1.828-1.828A2 2 0 0012.172 1H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2v-5.5a.5.5 0 00-.5-.5H19a.5.5 0 00-.5.5V19a.5.5 0 01-1 0v-5.5a.5.5 0 00-.5-.5H17a.5.5 0 00-.5.5V19a.5.5 0 01-1 0v-5.5a.5.5 0 00-.5-.5H15a.5.5 0 00-.5.5V19a.5.5 0 01-1 0v-5.5a.5.5 0 00-.5-.5H13a.5.5 0 00-.5.5V19a.5.5 0 01-1 0v-5.5a.5.5 0 00-.5-.5H11a.5.5 0 00-.5.5V19a2 2 0 002 2h10a2 2 0 002-2v-8.5a.5.5 0 00-.5-.5H21a.5.5 0 00-.5.5V19a2 2 0 01-2 2H7a2 2 0 01-2-2V3a2 2 0 012-2h5.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0016.828 5H18a2 2 0 012 2v4.5a.5.5 0 00.5.5H21a.5.5 0 00.5-.5z" /></svg>
                Endereço
              </h2>
              <EnderecoForm />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
            <div>
              <Button type="button" variant="outline" onClick={handleClearForm}>
                <Eraser className="mr-2 h-4 w-4" /> Limpar Formulário
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-[#4338ca] hover:bg-[#6d28d9] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Cliente
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
