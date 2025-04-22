import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload } from "lucide-react";

export function InformacoesAdicionaisForm() {
  return (
    <div>
      <div className="mb-6">
        <Label htmlFor="client_since" className="text-sm font-medium text-gray-700">
          Cliente desde
        </Label>
        <Input 
          type="date" 
          id="client_since" 
          name="client_since" 
          className="mt-1" 
        />
      </div>
      
      <div className="mb-6">
        <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
          Tags
        </Label>
        <Input 
          type="text" 
          id="tags" 
          name="tags" 
          className="mt-1" 
          placeholder="Adicione tags separadas por vírgula" 
        />
        <div className="text-gray-500 text-xs mt-1">Ex: fiel, compras mensais, pagamento em dia</div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="source" className="text-sm font-medium text-gray-700">
          Origem do Cliente
        </Label>
        <Select name="source">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Site</SelectItem>
            <SelectItem value="social_media">Redes Sociais</SelectItem>
            <SelectItem value="referral">Indicação</SelectItem>
            <SelectItem value="ad">Anúncio</SelectItem>
            <SelectItem value="direct">Visita Direta</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="documents" className="text-sm font-medium text-gray-700">
          Documentos
        </Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="documents"
                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Faça upload de arquivos</span>
                <Input 
                  id="documents" 
                  name="documents" 
                  type="file" 
                  className="sr-only" 
                  multiple 
                />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500">
              Formatos aceitos: PDF, JPG, PNG (Max: 5MB por arquivo)
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Observações
        </Label>
        <Textarea 
          id="notes" 
          name="notes" 
          className="mt-1" 
          rows={4} 
        />
      </div>
      
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700">
          Consentimento LGPD
        </Label>
        <div className="mt-1 bg-gray-50 p-4 rounded border">
          <div className="flex items-start space-x-2">
            <Checkbox id="lgpd_consent" name="lgpd_consent" required />
            <Label htmlFor="lgpd_consent" className="text-sm">
              Concordo com a coleta e processamento dos meus dados pessoais de acordo com a <a href="#" className="text-indigo-600 hover:underline">Política de Privacidade</a> da empresa, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </Label>
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-700">
          Comunicações de Marketing
        </Label>
        <div className="mt-1 bg-gray-50 p-4 rounded border">
          <div className="flex items-start space-x-2">
            <Checkbox id="marketing_consent" name="marketing_consent" />
            <Label htmlFor="marketing_consent" className="text-sm">
              Desejo receber comunicações de marketing, novidades e promoções por e-mail e outros canais.
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
