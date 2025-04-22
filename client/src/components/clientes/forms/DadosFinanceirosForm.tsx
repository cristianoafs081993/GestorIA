import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DadosFinanceirosForm() {
  const [paymentTerm, setPaymentTerm] = useState("cash");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="credit_limit" className="text-sm font-medium text-gray-700">
          Limite de Crédito
        </Label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <Input 
            type="number" 
            id="credit_limit" 
            name="credit_limit" 
            className="pl-10" 
            step="0.01" 
            min="0" 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="payment_term" className="text-sm font-medium text-gray-700">
          Prazo de Pagamento
        </Label>
        <Select 
          name="payment_term" 
          defaultValue="cash" 
          onValueChange={setPaymentTerm}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">À vista</SelectItem>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="15">15 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
            <SelectItem value="45">45 dias</SelectItem>
            <SelectItem value="60">60 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {paymentTerm === "custom" && (
        <div>
          <Label htmlFor="custom_term" className="text-sm font-medium text-gray-700">
            Prazo Personalizado (dias)
          </Label>
          <Input 
            type="number" 
            id="custom_term" 
            name="custom_term" 
            className="mt-1" 
            min="1" 
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700">
          Forma de Pagamento Preferencial
        </Label>
        <Select name="payment_method">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
            <SelectItem value="debit_card">Cartão de Débito</SelectItem>
            <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="price_table" className="text-sm font-medium text-gray-700">
          Tabela de Preço
        </Label>
        <Select name="price_table" defaultValue="default">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão</SelectItem>
            <SelectItem value="wholesale">Atacado</SelectItem>
            <SelectItem value="reseller">Revendedor</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tax_regime" className="text-sm font-medium text-gray-700">
          Regime Tributário
        </Label>
        <Select name="tax_regime">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simples Nacional</SelectItem>
            <SelectItem value="real">Lucro Real</SelectItem>
            <SelectItem value="presumed">Lucro Presumido</SelectItem>
            <SelectItem value="not_applicable">Não Aplicável</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
