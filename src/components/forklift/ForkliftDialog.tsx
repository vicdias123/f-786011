
import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { LegalCase, CaseStatus, CaseType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ForkliftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift?: LegalCase;
  onSave: (forklift: LegalCase) => void;
}

const ForkliftDialog = ({ open, onOpenChange, forklift, onSave }: ForkliftDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!forklift;
  
  const [formData, setFormData] = useState<Partial<LegalCase>>(
    forklift || {
      id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      caseNumber: `${new Date().getFullYear()}.${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      type: CaseType.CIVIL,
      clientName: '',
      description: '',
      openingDate: format(new Date(), 'dd/MM/yyyy'),
      lastUpdate: format(new Date(), 'dd/MM/yyyy'),
      status: CaseStatus.ACTIVE,
      estimatedValue: 0,
      responsibleLawyer: ''
    }
  );

  // Handle form field changes
  const handleChange = (field: keyof LegalCase, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parse date string to Date object (dd/MM/yyyy -> Date)
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Format date for display (Date -> dd/MM/yyyy)
  const formatDateString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.clientName || !formData.description || !formData.responsibleLawyer) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save case
    onSave(formData as LegalCase);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        caseNumber: `${new Date().getFullYear()}.${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        type: CaseType.CIVIL,
        clientName: '',
        description: '',
        openingDate: format(new Date(), 'dd/MM/yyyy'),
        lastUpdate: format(new Date(), 'dd/MM/yyyy'),
        status: CaseStatus.ACTIVE,
        estimatedValue: 0,
        responsibleLawyer: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Caso atualizado" : "Caso adicionado",
      description: `Caso ${formData.caseNumber} foi ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Caso Jurídico' : 'Adicionar Novo Caso'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do caso jurídico nos campos abaixo.' 
              : 'Preencha as informações do novo caso jurídico nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber">Número do Processo</Label>
              <Input 
                id="caseNumber" 
                value={formData.caseNumber} 
                onChange={(e) => handleChange('caseNumber', e.target.value)}
                placeholder="Ex: 2024.0001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Caso</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CaseType.CIVIL}>Cível</SelectItem>
                  <SelectItem value={CaseType.CRIMINAL}>Criminal</SelectItem>
                  <SelectItem value={CaseType.LABOR}>Trabalhista</SelectItem>
                  <SelectItem value={CaseType.FAMILY}>Família</SelectItem>
                  <SelectItem value={CaseType.CORPORATE}>Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input 
                id="clientName" 
                value={formData.clientName} 
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsibleLawyer">Advogado Responsável</Label>
              <Input 
                id="responsibleLawyer" 
                value={formData.responsibleLawyer} 
                onChange={(e) => handleChange('responsibleLawyer', e.target.value)}
                placeholder="Ex: Dr. Maria Santos"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
              <Input 
                id="estimatedValue" 
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedValue} 
                onChange={(e) => handleChange('estimatedValue', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CaseStatus.ACTIVE}>Em Andamento</SelectItem>
                  <SelectItem value={CaseStatus.SUSPENDED}>Suspenso</SelectItem>
                  <SelectItem value={CaseStatus.CLOSED}>Encerrado</SelectItem>
                  <SelectItem value={CaseStatus.APPEALING}>Em Recurso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Caso</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva os detalhes do caso..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Abertura</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.openingDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(formData.openingDate || '')}
                    onSelect={(date) => handleChange('openingDate', formatDateString(date || new Date()))}
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Última Atualização</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.lastUpdate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(formData.lastUpdate || '')}
                    onSelect={(date) => handleChange('lastUpdate', formatDateString(date || new Date()))}
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Caso'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDialog;
