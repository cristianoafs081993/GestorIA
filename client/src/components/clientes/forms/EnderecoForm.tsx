import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function EnderecoForm() {
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  const handleCepSearch = () => {
    const cep = (document.getElementById("cep") as HTMLInputElement).value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      alert('CEP inválido');
      return;
    }
    
    // Simulação de busca de CEP (em um sistema real, seria uma requisição à API)
    if (cep === '12345678') {
      (document.getElementById("logradouro") as HTMLInputElement).value = 'Rua Exemplo';
      (document.getElementById("bairro") as HTMLInputElement).value = 'Centro';
      (document.getElementById("cidade") as HTMLInputElement).value = 'São Paulo';
      
      // Focar no campo número após preenchimento
      document.getElementById("numero")?.focus();
    } else {
      alert('CEP não encontrado. Por favor, preencha o endereço manualmente.');
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-24">
            <Label htmlFor="cep" className="text-sm font-medium text-gray-700">
              CEP
            </Label>
          </div>
          <div className="flex-1 flex space-x-2">
            <Input 
              type="text" 
              id="cep" 
              name="cep" 
              placeholder="00000-000" 
              maxLength={9}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCepSearch}
            >
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </div>
        <div className="text-gray-500 text-xs mt-1 ml-24">Digite o CEP para preenchimento automático do endereço</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="logradouro" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            Logradouro
          </Label>
          <Input 
            type="text" 
            id="logradouro" 
            name="logradouro" 
            className="mt-1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="numero" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            Número
          </Label>
          <Input 
            type="text" 
            id="numero" 
            name="numero" 
            className="mt-1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="complemento" className="text-sm font-medium text-gray-700">
            Complemento
          </Label>
          <Input 
            type="text" 
            id="complemento" 
            name="complemento" 
            className="mt-1" 
            placeholder="Apto, Bloco, etc." 
          />
        </div>
        
        <div>
          <Label htmlFor="bairro" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            Bairro
          </Label>
          <Input 
            type="text" 
            id="bairro" 
            name="bairro" 
            className="mt-1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="cidade" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            Cidade
          </Label>
          <Input 
            type="text" 
            id="cidade" 
            name="cidade" 
            className="mt-1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="estado" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            Estado
          </Label>
          <Select name="estado" required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Acre</SelectItem>
              <SelectItem value="AL">Alagoas</SelectItem>
              <SelectItem value="AP">Amapá</SelectItem>
              <SelectItem value="AM">Amazonas</SelectItem>
              <SelectItem value="BA">Bahia</SelectItem>
              <SelectItem value="CE">Ceará</SelectItem>
              <SelectItem value="DF">Distrito Federal</SelectItem>
              <SelectItem value="ES">Espírito Santo</SelectItem>
              <SelectItem value="GO">Goiás</SelectItem>
              <SelectItem value="MA">Maranhão</SelectItem>
              <SelectItem value="MT">Mato Grosso</SelectItem>
              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="PA">Pará</SelectItem>
              <SelectItem value="PB">Paraíba</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
              <SelectItem value="PE">Pernambuco</SelectItem>
              <SelectItem value="PI">Piauí</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="RO">Rondônia</SelectItem>
              <SelectItem value="RR">Roraima</SelectItem>
              <SelectItem value="SC">Santa Catarina</SelectItem>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="SE">Sergipe</SelectItem>
              <SelectItem value="TO">Tocantins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="endereco_cobranca_igual" 
            name="endereco_cobranca_igual" 
            checked={!showBillingAddress} 
            onCheckedChange={(checked) => setShowBillingAddress(!checked)}
          />
          <Label htmlFor="endereco_cobranca_igual" className="text-sm font-medium">Endereço de cobrança é o mesmo que o endereço principal</Label>
        </div>
      </div>
      
      {showBillingAddress && (
        <div className="mt-6">
          <h4 className="font-semibold mb-4">Endereço de Cobrança</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="logradouro_cobranca" className="text-sm font-medium text-gray-700">
                Logradouro
              </Label>
              <Input 
                type="text" 
                id="logradouro_cobranca" 
                name="logradouro_cobranca" 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="numero_cobranca" className="text-sm font-medium text-gray-700">
                Número
              </Label>
              <Input 
                type="text" 
                id="numero_cobranca" 
                name="numero_cobranca" 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="complemento_cobranca" className="text-sm font-medium text-gray-700">
                Complemento
              </Label>
              <Input 
                type="text" 
                id="complemento_cobranca" 
                name="complemento_cobranca" 
                className="mt-1" 
                placeholder="Apto, Bloco, etc." 
              />
            </div>
            
            <div>
              <Label htmlFor="bairro_cobranca" className="text-sm font-medium text-gray-700">
                Bairro
              </Label>
              <Input 
                type="text" 
                id="bairro_cobranca" 
                name="bairro_cobranca" 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="cidade_cobranca" className="text-sm font-medium text-gray-700">
                Cidade
              </Label>
              <Input 
                type="text" 
                id="cidade_cobranca" 
                name="cidade_cobranca" 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="estado_cobranca" className="text-sm font-medium text-gray-700">
                Estado
              </Label>
              <Select name="estado_cobranca">
                <SelectTrigger id="estado_cobranca">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
