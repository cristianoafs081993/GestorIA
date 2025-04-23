import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function EnderecoForm() {


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
        <div className="flex flex-row gap-2 items-end">
          <div className="w-28">
            <Label htmlFor="cep" className="text-sm font-medium text-gray-700">
              CEP
            </Label>
            <Input 
              type="text" 
              id="cep" 
              name="cep" 
              placeholder="00000-000" 
              maxLength={9}
              className="mt-1 w-full"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="logradouro" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
              Logradouro
            </Label>
            <Input 
              type="text" 
              id="logradouro" 
              name="logradouro" 
              className="mt-1 w-full" 
              required 
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <SelectContent className="bg-white text-gray-900 shadow-lg">
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
  );
}
