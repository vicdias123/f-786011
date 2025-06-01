
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
import { Document, DocumentStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: Document;
  onSave: (maintenance: Document) => void;
  availableForklifts: { id: string; model: string }[];
  availableOperators: { id: string; name: string }[];
}

const MaintenanceDialog = ({ 
  open, 
  onOpenChange, 
  maintenance, 
  onSave,
  availableForklifts,
  availableOperators 
}: MaintenanceDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!maintenance;
  
  const [formData, setFormData] = useState<Partial<Document>>(
    maintenance || {
      id: `DOC${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      caseId: '',
      caseNumber: '',
      documentType: '',
      createdBy: '',
      creationDate: format(new Date(), 'yyyy-MM-dd'),
      status: DocumentStatus.PENDING,
      deadline: ''
    }
  );

  // Handle case selection
  const handleCaseChange = (caseId: string) => {
    const selectedCase = availableForklifts.find(f => f.id === caseId);
    setFormData(prev => ({ 
      ...prev, 
      caseId,
      caseNumber: selectedCase?.model || ''
    }));
  };

  // Handle creator selection
  const handleCreatorChange = (creator: string) => {
    setFormData(prev => ({ ...prev, createdBy: creator }));
  };

  // Handle form field changes
  const handleChange = (field: keyof Document, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return undefined;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.caseId || !formData.documentType || !formData.createdBy || !formData.creationDate) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save document
    onSave(formData as Document);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `DOC${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        caseId: '',
        caseNumber: '',
        documentType: '',
        createdBy: '',
        creationDate: format(new Date(), 'yyyy-MM-dd'),
        status: DocumentStatus.PENDING,
        deadline: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Documento atualizado" : "Documento registrado",
      description: `Documento ${isEditing ? 'atualizado' : 'registrado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Documento' : 'Registrar Novo Documento'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do documento nos campos abaixo.' 
              : 'Preencha as informações do novo documento nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    {availableForklifts.map(case_item => (
                      <SelectItem key={case_item.id} value={case_item.id}>
                        {case_item.model} ({case_item.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value={DocumentStatus.PENDING}>Pendente</SelectItem>
                    <SelectItem value={DocumentStatus.IN_REVIEW}>Em Revisão</SelectItem>
                    <SelectItem value={DocumentStatus.COMPLETED}>Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Input 
                id="documentType" 
                value={formData.documentType} 
                onChange={(e) => handleChange('documentType', e.target.value)}
                placeholder="Ex: Petição inicial, Contestação, Recurso"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createdBy">Criado por</Label>
                <Select 
                  value={formData.createdBy} 
                  onValueChange={handleCreatorChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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
                <Label>Data de Criação</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.creationDate || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.creationDate || '')}
                      onSelect={(date) => handleChange('creationDate', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {formData.deadline && (
              <div className="space-y-2">
                <Label>Prazo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.deadline || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.deadline || '')}
                      onSelect={(date) => handleChange('deadline', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Registrar Documento'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
