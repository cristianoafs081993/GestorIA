import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  className?: string;
}

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  popular = false, 
  className 
}: PricingCardProps) => {
  return (
    <div className={cn(
      "pricing-card bg-white rounded-xl shadow-lg overflow-hidden", 
      popular ? "border-2 border-indigo-600 relative" : "",
      className
    )}>
      {popular && (
        <div className="absolute top-0 inset-x-0">
          <div className="gradient-bg text-white text-xs text-center py-1 font-medium">MAIS POPULAR</div>
        </div>
      )}
      
      <div className={`p-8 ${popular ? "pt-10" : ""}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold text-indigo-600">{price}</span>
          <span className="ml-1 text-xl text-gray-500">/mês</span>
        </div>
        <p className="mt-4 text-gray-600">{description}</p>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/cadastro">
          <Button 
            className={`mt-8 w-full ${popular ? "gradient-bg hover:opacity-90 text-white" : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"}`}
          >
            Começar agora
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
