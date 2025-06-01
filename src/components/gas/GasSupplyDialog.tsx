
import React, { useState, useEffect } from 'react';
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
import { Billing } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

interface GasSupplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gasSupply?: Billing;
  onSave: (gasSupply: Billing) => void;
  availableForklifts: { id: string; caseNumber: string }[];
  availableOperators: { id: string; name: string }[];
}

const GasSupplyDialog = ({ 
  open, 
  onOpenChange, 
  gasSupply, 
  onSave,
  availableForklifts,
  availableOperators 
}: GasSupplyDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!gasSupply;
  
  const [formData, setFormData] = useState<Partial<Billing>>(
    gasSupply || {
      id: `FAT${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: format(new Date(), 'dd/MM/yyyy'),
      caseId: '',
      caseNumber: '',
      hours: 0,
      hourlyRate: 300,
      totalAmount: 0,
      lawyer: ''
    }
  );

  // Calculate total amount when hours or rate changes
  useEffect(() => {
    const total = (formData.hours || 0) * (formData.hourlyRate || 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.hours, formData.hourlyRate]);

  // Handle case selection
  const handleCaseChange = (caseId: string) => {
    const selectedCase = availableForklifts.find(f => f.id === caseId);
    setFormData(prev => ({ 
      ...prev, 
      caseId,
      caseNumber: selectedCase?.caseNumber || ''
    }));
  };

  // Handle lawyer selection
  const handleLawyerChange = (lawyerName: string) => {
    setFormData(prev => ({ ...prev, lawyer: lawyerName }));
  };

  // Handle form field changes
  const handleChange = (field: keyof Billing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      const [day, month, year] = dateString.split('/');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.caseId || !formData.hours || !formData.hourlyRate || !formData.lawyer) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.hours <= 0) {
      toast({
        title: "Erro de validação",
        description: "O número de horas deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }
    
    // Save billing
    onSave(formData as Billing);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `FAT${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        date: format(new Date(), 'dd/MM/yyyy'),
        caseId: '',
        caseNumber: '',
        hours: 0,
        hourlyRate: 300,
        totalAmount: 0,
        lawyer: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Faturamento atualizado" : "Faturamento registrado",
      description: `Faturamento ${isEditing ? 'atualizado' : 'registrado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Faturamento' : 'Novo Faturamento'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do faturamento nos campos abaixo.' 
              : 'Preencha as informações do novo faturamento nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateForDisplay(formData.date || '')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(formData.date || '')}
                    onSelect={(date) => handleChange('date', format(date || new Date(), 'dd/MM/yyyy'))}
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseId">Caso Jurídico</Label>
              <Select 
                value={formData.caseId} 
                onValueChange={handleCaseChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o caso" />
                </SelectTrigger>
                <SelectContent>
                  {availableForklifts.map(forklift => (
                    <SelectItem key={forklift.id} value={forklift.id}>
                      {forklift.caseNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours">Horas Trabalhadas</Label>
              <Input 
                id="hours" 
                type="number"
                step="0.5"
                min="0"
                value={formData.hours} 
                onChange={(e) => handleChange('hours', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lawyer">Advogado</Label>
              <Select 
                value={formData.lawyer} 
                onValueChange={handleLawyerChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o advogado" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(operator => (
                    <SelectItem key={operator.id} value={operator.name}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Valor por Hora (R$)</Label>
              <Input 
                id="hourlyRate" 
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate} 
                onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Valor Total (R$)</Label>
              <Input 
                id="totalAmount" 
                type="number"
                value={formData.totalAmount?.toFixed(2) || '0.00'} 
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Registrar Faturamento'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GasSupplyDialog;
