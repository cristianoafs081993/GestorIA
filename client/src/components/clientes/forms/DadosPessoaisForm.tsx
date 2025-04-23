import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DadosPessoaisForm() {
  const [personType, setPersonType] = useState("fisica");

  return (
    <div>
      <div className="mb-6">
        <RadioGroup
          defaultValue="fisica"
          value={personType}
          onValueChange={setPersonType}
          name="tipo_pessoa"
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fisica" id="fisica" />
            <Label htmlFor="fisica">Pessoa Física</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="juridica" id="juridica" />
            <Label htmlFor="juridica">Pessoa Jurídica</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personType === "fisica" ? (
          <>
            <div className="md:col-span-2">
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                Nome Completo
              </Label>
              <Input id="nome" name="nome" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="cpf" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                CPF
              </Label>
              <Input 
                id="cpf" 
                name="cpf" 
                className="mt-1" 
                placeholder="000.000.000-00" 
                maxLength={14}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                Telefone Principal
              </Label>
              <Input 
                type="tel" 
                id="telefone" 
                name="telefone" 
                className="mt-1" 
                placeholder="(00) 00000-0000" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700">
                Data de Nascimento
              </Label>
              <Input 
                type="date" 
                id="birth_date" 
                name="birth_date" 
                className="mt-1" 
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                Razão Social
              </Label>
              <Input id="nome" name="nome" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="nome_fantasia" className="text-sm font-medium text-gray-700">
                Nome Fantasia
              </Label>
              <Input id="nome_fantasia" name="nome_fantasia" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                CNPJ
              </Label>
              <Input 
                id="cnpj" 
                name="cnpj" 
                className="mt-1" 
                placeholder="00.000.000/0000-00" 
                maxLength={18}
                required
              />
            </div>
            <div>
              <Label htmlFor="ie" className="text-sm font-medium text-gray-700">
                Inscrição Estadual
              </Label>
              <Input 
                id="ie" 
                name="ie" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
                Telefone
              </Label>
              <Input 
                type="tel" 
                id="telefone" 
                name="telefone" 
                className="mt-1" 
                placeholder="(00) 00000-0000" 
                required 
              />
            </div>

          </>
        )}
      </div>
    </div>
  );
}
