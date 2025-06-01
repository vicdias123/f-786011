
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CertificateStatus, Lawyer, LawyerRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

interface OperatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator?: Lawyer;
  onSave: (operator: Lawyer) => void;
}

const OperatorDialog = ({ open, onOpenChange, operator, onSave }: OperatorDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operator;
  
  const [formData, setFormData] = React.useState<Partial<Lawyer>>(
    operator || {
      id: `ADV${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: '',
      role: LawyerRole.JUNIOR,
      oab: '',
      contact: '',
      specialization: '',
      registrationDate: format(new Date(), 'dd/MM/yyyy'),
      oabExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
      cppExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
      oabStatus: CertificateStatus.REGULAR,
      cppStatus: CertificateStatus.REGULAR
    }
  );

  // Convert date string to Date object for Calendar
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Handle form field changes
  const handleChange = (field: keyof Lawyer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle date changes
  const handleDateChange = (field: 'oabExpirationDate' | 'cppExpirationDate', date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormData(prev => ({ ...prev, [field]: formattedDate }));
    
    // Update certificate status based on date
    const today = new Date();
    const expirationDate = date;
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    let status: CertificateStatus;
    if (diffDays < 0) {
      status = CertificateStatus.EXPIRED;
    } else if (diffDays < 30) {
      status = CertificateStatus.WARNING;
    } else {
      status = CertificateStatus.REGULAR;
    }
    
    const statusField = field === 'oabExpirationDate' ? 'oabStatus' : 'cppStatus';
    setFormData(prev => ({ ...prev, [statusField]: status }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.oab || !formData.contact) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save operator
    onSave(formData as Lawyer);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `ADV${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        name: '',
        role: LawyerRole.JUNIOR,
        oab: '',
        contact: '',
        specialization: '',
        registrationDate: format(new Date(), 'dd/MM/yyyy'),
        oabExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
        cppExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
        oabStatus: CertificateStatus.REGULAR,
        cppStatus: CertificateStatus.REGULAR
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Advogado atualizado" : "Advogado adicionado",
      description: `${formData.name} foi ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Advogado' : 'Adicionar Novo Advogado'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do advogado nos campos abaixo.' 
              : 'Preencha as informações do novo advogado nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nome do advogado"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LawyerRole.JUNIOR}>Advogado Júnior</SelectItem>
                  <SelectItem value={LawyerRole.SENIOR}>Advogado Sênior</SelectItem>
                  <SelectItem value={LawyerRole.PARTNER}>Sócio</SelectItem>
                  <SelectItem value={LawyerRole.PARALEGAL}>Paralegal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oab">OAB</Label>
              <Input 
                id="oab" 
                value={formData.oab} 
                onChange={(e) => handleChange('oab', e.target.value)}
                placeholder="000.000/SP"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input 
                id="contact" 
                value={formData.contact} 
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="specialization">Especialização</Label>
              <Input 
                id="specialization" 
                value={formData.specialization} 
                onChange={(e) => handleChange('specialization', e.target.value)}
                placeholder="Ex: Direito Civil, Trabalhista, Criminal"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Validade da OAB</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.oabExpirationDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.oabExpirationDate || '')}
                  onSelect={(date) => handleDateChange('oabExpirationDate', date)}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Validade do CPP</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.cppExpirationDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.cppExpirationDate || '')}
                  onSelect={(date) => handleDateChange('cppExpirationDate', date)}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Advogado'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorDialog;
