import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}

const StatCard = ({ label, value, icon, trend }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 text-indigo-500 mr-4">{icon}</div>}
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {trend && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
