import { ReactNode } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  footerLink?: {
    label: string;
    href: string;
  };
}

const DashboardCard = ({ title, children, footerLink }: DashboardCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
      </CardContent>
      {footerLink && (
        <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm">
            <Link href={footerLink.href}>
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                {footerLink.label}
              </a>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
