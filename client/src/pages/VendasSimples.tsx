import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const VendasSimples = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendas</h1>
        <p className="text-sm text-gray-600">Gerencie suas vendas e acompanhe o desempenho comercial do seu negócio.</p>
      </div>
    </DashboardLayout>
  );
};

export default VendasSimples;
