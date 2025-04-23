import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Plus, Download, Upload, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data para exemplo visual
const mockProducts = [
  {
    id: 12345,
    name: "Camiseta Básica Branca",
    sku: "CAM-BAS-BRA-M",
    category: "Roupas",
    price: 29.9,
    priceOld: 39.9,
    stock: 23,
    status: "Ativo",
    photo: "shirt",
  },
  {
    id: 12346,
    name: "Tênis Esportivo Runner",
    sku: "TEN-ESP-RUN-42",
    category: "Calçados",
    price: 149.9,
    priceOld: 199.9,
    stock: 3,
    status: "Estoque baixo",
    photo: "shoe",
  },
  {
    id: 12347,
    name: "Boné Estampado",
    sku: "BON-EST-VER",
    category: "Acessórios",
    price: 54.9,
    priceOld: 54.9,
    stock: 10,
    status: "Ativo",
    photo: "cap",
  },
  {
    id: 12348,
    name: "Camisa Social Slim",
    sku: "CAM-SOC-AZUL",
    category: "Roupas",
    price: 79.9,
    priceOld: 99.9,
    stock: 0,
    status: "Inativo",
    photo: "shirt",
  },
];

const mockCategories = [
  "Todas as categorias",
  "Roupas",
  "Calçados",
  "Acessórios",
  "Esportivos"
];

const mockStatus = [
  "Todos os status",
  "Ativo",
  "Inativo",
  "Esgotado"
];

export default function Products() {
  const [category, setCategory] = useState("Todas as categorias");
  const [status, setStatus] = useState("Todos os status");
  const [search, setSearch] = useState("");
  const [showStockAlert, setShowStockAlert] = useState(true);

  // Exemplo: alerta de estoque
  const stockAlert = {
    count: 3,
    products: ["Tênis Esportivo Runner", "Camiseta Estampada", "Sandália Feminina"],
  };

  return (
    <DashboardLayout title="Gestão de Produtos">
      <div className="max-w-7xl mx-auto w-full px-2">
        {/* Alerta de estoque DENTRO do container principal, logo no topo */}
        {showStockAlert && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex items-center px-4 py-3 mb-6 text-sm relative w-full">
            <AlertTriangle className="h-5 w-5 mr-3 text-yellow-500" />
            <div>
              <span className="font-semibold">Alerta de estoque</span> <br />
              Existem {stockAlert.count} produtos com estoque abaixo do mínimo. <a href="#" className="underline font-medium">Verificar agora.</a>
            </div>
            <button className="ml-auto text-yellow-400 hover:text-yellow-600 text-xl px-2 focus:outline-none" onClick={() => setShowStockAlert(false)} title="Fechar alerta">
              ×
            </button>
          </div>
        )}

        {/* Barra de ações em card padronizado */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 w-full">
          <div className="flex gap-2">
            <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold"><Plus className="h-4 w-4 mr-2" /> Novo Produto</Button>
            <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" /> Importar</Button>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                {mockStatus.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela de produtos */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-x-auto mb-6 w-full">
          <div className="font-bold text-base px-4 pt-4 pb-3">Lista de Produtos</div>
          <table className="min-w-full w-full text-sm table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-center"><input type="checkbox" /></th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">ID</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">FOTO</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">NOME</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">CATEGORIA</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">PREÇO</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">ESTOQUE</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">STATUS</th>
                <th className="px-4 py-3 align-middle text-xs font-semibold text-gray-500 text-left">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map(prod => (
                <tr key={prod.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 align-middle text-center"><input type="checkbox" /></td>
                  <td className="px-4 py-3 align-middle text-left">#{prod.id}</td>
                  <td className="px-4 py-3 align-middle text-left">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <span className="text-2xl">
                        {prod.photo === 'shirt' && '👕'}
                        {prod.photo === 'shoe' && '👟'}
                        {prod.photo === 'cap' && '🧢'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-left">
                    <div className="text-gray-900 leading-tight">{prod.name}</div>
                    <div className="text-xs text-gray-500">SKU: {prod.sku}</div>
                  </td>
                  <td className="px-4 py-3 align-middle text-left">{prod.category}</td>
                  <td className="px-4 py-3 align-middle text-left text-gray-900">
                    <span>R$ {prod.price.toFixed(2)}</span>
                    {prod.priceOld > prod.price && (
                      <div className="text-xs text-gray-400 line-through">R$ {prod.priceOld.toFixed(2)}</div>
                    )}
                  </td>
                  <td className={prod.status === 'Estoque baixo' ? 'px-4 py-3 align-middle text-left text-[#D97706]' : 'px-4 py-3 align-middle text-left text-gray-900'}>
                    <span>{prod.stock} unidades</span>
                  </td>
                  <td className="px-4 py-3 align-middle text-left">
                    {prod.status === 'Ativo' && <Badge className="bg-green-100 text-green-800">Ativo</Badge>}
                    {prod.status === 'Inativo' && <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>}
                    {prod.status === 'Estoque baixo' && <Badge className="bg-yellow-100 text-yellow-800">Estoque baixo</Badge>}
                  </td>
                  <td className="px-4 py-3 align-middle text-left">
                    <button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors mr-1 focus:outline-none" title="Editar">
                      <Edit className="h-5 w-5 text-[#6D28D9] hover:text-[#5B21B6]" strokeWidth={2} />
                    </button>
                    <button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none" title="Excluir">
                      <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginação clean */}
          <div className="flex items-center justify-between px-4 py-3 text-xs flex-wrap gap-2">
            <span className="text-gray-500">Mostrando 1 a 10 de 48 resultados</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center rounded font-semibold bg-[#6D28D9] text-white">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100">5</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Próximo"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Cards informativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full">
          <div className="bg-white border rounded-lg p-4 flex flex-col">
            <div className="font-semibold mb-2">Produtos com Baixo Estoque</div>
            <div className="text-xs text-gray-600 mb-2">{stockAlert.count} produtos necessitam de reposição urgente:</div>
            <ul className="text-sm text-gray-800 mb-4 list-disc list-inside">
              {stockAlert.products.map(p => <li key={p}>{p}</li>)}
            </ul>
            <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold">Fazer Pedido</Button>
          </div>
          <div className="bg-white border rounded-lg p-4 flex flex-col">
            <div className="font-semibold mb-2">Produtos Mais Vendidos</div>
            <div className="text-xs text-gray-600 mb-2">Top 3 produtos do último mês:</div>
            <ul className="text-sm text-gray-800 mb-4">
              <li><span className="font-semibold">Camiseta Básica Branca</span> <span className="ml-2 text-green-700 text-xs">87 vendas</span></li>
              <li><span className="font-semibold">Tênis Esportivo Runner</span> <span className="ml-2 text-green-700 text-xs">52 vendas</span></li>
              <li><span className="font-semibold">Boné Estampado</span> <span className="ml-2 text-green-700 text-xs">45 vendas</span></li>
            </ul>
            <Button variant="outline" className="border-[#6D28D9] text-[#6D28D9] hover:bg-[#F3E8FF]">Ver Relatório Completo</Button>
          </div>
          <div className="bg-white border rounded-lg p-4 flex flex-col">
            <div className="font-semibold mb-2">Sugestões de Preços</div>
            <div className="text-xs text-gray-600 mb-2">Baseado em análise de mercado e concorrência:</div>
            <ul className="text-sm mb-4">
              <li><span className="text-gray-800">Camiseta Básica Branca</span> <span className="ml-2 text-green-700">↑ R$ 34,90</span></li>
              <li><span className="text-gray-800">Boné Estampado</span> <span className="ml-2 text-red-600">↓ R$ 34,90</span></li>
              <li><span className="text-gray-800">Shorts Esportivo</span> <span className="ml-2 text-red-600">↓ R$ 54,90</span></li>
              <li><span className="text-gray-800">Óculos de Sol Unissex</span> <span className="ml-2 text-red-600">↓ R$ 89,90</span></li>
            </ul>
            <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold">Aplicar Sugestões</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}