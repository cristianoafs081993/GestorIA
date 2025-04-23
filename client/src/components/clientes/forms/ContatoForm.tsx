import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export function ContatoForm() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        
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
        

      </div>
      

    </div>
  );
}
