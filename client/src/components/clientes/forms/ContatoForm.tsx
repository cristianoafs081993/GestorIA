import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export function ContatoForm() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Label htmlFor="telefone_secundario" className="text-sm font-medium text-gray-700">
            Telefone Secundário
          </Label>
          <Input 
            type="tel" 
            id="telefone_secundario" 
            name="telefone_secundario" 
            className="mt-1" 
            placeholder="(00) 00000-0000" 
          />
        </div>
        
        <div>
          <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
            WhatsApp
          </Label>
          <Input 
            type="tel" 
            id="whatsapp" 
            name="whatsapp" 
            className="mt-1" 
            placeholder="(00) 00000-0000" 
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
            E-mail
          </Label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            className="mt-1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Site
          </Label>
          <Input 
            type="url" 
            id="website" 
            name="website" 
            className="mt-1" 
            placeholder="https://www.exemplo.com.br" 
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700 block mb-2">
            Redes Sociais
          </Label>
          <div className="flex items-center space-x-2 mb-2">
            <Instagram className="h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              name="instagram" 
              placeholder="@usuario" 
            />
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Facebook className="h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              name="facebook" 
              placeholder="facebook.com/usuario" 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              name="linkedin" 
              placeholder="linkedin.com/in/usuario" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Preferências de Contato</Label>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox id="preferencias_contato_email" name="preferencias_contato" value="email" />
            <label
              htmlFor="preferencias_contato_email"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox id="preferencias_contato_phone" name="preferencias_contato" value="phone" />
            <label
              htmlFor="preferencias_contato_phone"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Telefone
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox id="preferencias_contato_whatsapp" name="preferencias_contato" value="whatsapp" />
            <label
              htmlFor="preferencias_contato_whatsapp"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              WhatsApp
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox id="preferencias_contato_sms" name="preferencias_contato" value="sms" />
            <label
              htmlFor="preferencias_contato_sms"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              SMS
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
