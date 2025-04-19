import { useState } from "react";
import { Link } from "wouter";
import LoginForm from "@/components/forms/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/">
            <a className="text-center block">
              <h1 className="text-3xl font-bold text-indigo-600">Gestor<span className="text-purple-600">IA</span></h1>
            </a>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link href="/cadastro">
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                crie sua conta gratuitamente
              </a>
            </Link>
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <LoginForm />
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ou continue com
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <i className="fab fa-google text-red-500 mr-2"></i>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <i className="fab fa-facebook-f text-blue-600 mr-2"></i>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
