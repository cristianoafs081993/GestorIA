import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';

// Auth types
export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  password: string;
  email: string;
  fullName: string;
  companyName: string;
  phone?: string;
};

// Auth validation schemas
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth hooks
export function useAuth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: currentUser, isLoading } = useQuery<{
    user: { id: number; username: string; email: string; role: string } | null
  }>({
    queryKey: ['/api/auth/me'],
    refetchOnWindowFocus: true,
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await apiRequest('POST', '/api/auth/login', credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      navigate('/dashboard');
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao GestorIA.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  });

  const register = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      return await apiRequest('POST', '/api/auth/register', credentials);
    },
    onSuccess: () => {
      navigate('/login');
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Verifique os dados informados e tente novamente.",
        variant: "destructive",
      });
    }
  });

  const logout = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
  });

  return {
    user: currentUser?.user || null,
    isLoading,
    isAuthenticated: !!currentUser?.user,
    login: (credentials: LoginCredentials) => login.mutate(credentials),
    register: (credentials: RegisterCredentials) => register.mutate(credentials),
    logout: () => logout.mutate(),
    isLoginPending: login.isPending,
    isRegisterPending: register.isPending,
  };
}
