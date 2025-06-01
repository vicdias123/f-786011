
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LegalActivity } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation?: LegalActivity;
  onSave: (operation: LegalActivity) => void;
  availableOperators: { id: string; name: string }[];
  availableForklifts: { id: string; model: string }[];
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  operation, 
  onSave,
  availableOperators,
  availableForklifts
}: OperationDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operation;
  
  // Form state
  const [formData, setFormData] = useState<Partial<LegalActivity>>({
    lawyerId: '',
    lawyerName: '',
    caseId: '',
    caseNumber: '',
    activityType: '',
    description: '',
    initialTime: 0,
    currentTime: 0,
    startTime: new Date().toISOString().slice(0, 16),
    status: 'active'
  });

  // Initialize form with operation data if editing
  useEffect(() => {
    if (operation) {
      setFormData({
        ...operation,
        startTime: new Date(operation.startTime).toISOString().slice(0, 16),
        endTime: operation.endTime ? new Date(operation.endTime).toISOString().slice(0, 16) : undefined
      });
    } else {
      // Reset form for new operation
      setFormData({
        lawyerId: '',
        lawyerName: '',
        caseId: '',
        caseNumber: '',
        activityType: '',
        description: '',
        initialTime: 0,
        currentTime: 0,
        startTime: new Date().toISOString().slice(0, 16),
        status: 'active'
      });
    }
  }, [operation, open]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Handle lawyer selection
  const handleLawyerChange = (lawyerId: string) => {
    const selectedLawyer = availableOperators.find(op => op.id === lawyerId);
    if (selectedLawyer) {
      setFormData(prev => ({
        ...prev,
        lawyerId,
        lawyerName: selectedLawyer.name
      }));
    }
  };

  // Handle case selection
  const handleCaseChange = (caseId: string) => {
    const selectedCase = availableForklifts.find(f => f.id === caseId);
    if (selectedCase) {
      setFormData(prev => ({
        ...prev,
        caseId,
        caseNumber: selectedCase.model
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.lawyerId || !formData.caseId || !formData.activityType || !formData.description || !formData.startTime) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Generate ID for new operations
    const operationData: LegalActivity = {
      id: operation?.id || `ACT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData as LegalActivity
    };

    // Save the operation
    onSave(operationData);
    
    // Close the dialog
    onOpenChange(false);
  };

  // Calculate if the operation can be completed
  const canComplete = isEditing && operation?.status === 'active';

  // Complete the operation
  const handleComplete = () => {
    const now = new Date();
    const completedOperation: LegalActivity = {
      ...formData as LegalActivity,
      status: 'completed',
      endTime: now.toISOString()
    };
    
    onSave(completedOperation);
    onOpenChange(false);
    
    toast({
      title: "Atividade concluída",
      description: "A atividade foi finalizada com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Atividade Jurídica' : 'Nova Atividade Jurídica'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lawyerId">Advogado</Label>
              <Select 
                value={formData.lawyerId} 
                onValueChange={handleLawyerChange}
              >
                <SelectTrigger id="lawyerId">
                  <SelectValue placeholder="Selecione um advogado" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(lawyer => (
                    <SelectItem key={lawyer.id} value={lawyer.id}>
                      {lawyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseId">Caso Jurídico</Label>
              <Select 
                value={formData.caseId}
                onValueChange={handleCaseChange}
              >
                <SelectTrigger id="caseId">
                  <SelectValue placeholder="Selecione um caso" />
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activityType">Tipo de Atividade</Label>
            <Input
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              placeholder="Ex: Audiência, Análise de documentos, Reunião com cliente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Atividade</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva detalhadamente a atividade realizada"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialTime">Tempo Inicial (horas)</Label>
              <Input
                id="initialTime"
                name="initialTime"
                type="number"
                step="0.5"
                value={formData.initialTime}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentTime">Tempo Atual (horas)</Label>
              <Input
                id="currentTime"
                name="currentTime"
                type="number"
                step="0.5"
                value={formData.currentTime || formData.initialTime}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Data/Hora de Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="endTime">Data/Hora de Término</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime || ''}
                  onChange={handleChange}
                  disabled={formData.status === 'active'}
                />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="billableHours">Horas Faturáveis</Label>
              <Input
                id="billableHours"
                name="billableHours"
                type="number"
                step="0.5"
                value={formData.billableHours || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            {canComplete && (
              <Button 
                type="button" 
                variant="outline" 
                className="mr-auto" 
                onClick={handleComplete}
              >
                Finalizar Atividade
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Criar Atividade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
