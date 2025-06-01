
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LegalCase, CaseStatus } from '@/types';
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Info, FileText, Scale, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForkliftDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift: LegalCase | null;
  onEdit: () => void;
}

const ForkliftDetails = ({ open, onOpenChange, forklift, onEdit }: ForkliftDetailsProps) => {
  if (!forklift) return null;

  // Get status color classes
  const getStatusClass = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case CaseStatus.SUSPENDED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CaseStatus.CLOSED:
        return 'bg-red-100 text-red-800 border-red-200';
      case CaseStatus.APPEALING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{forklift.caseNumber}</span>
            <Badge variant="outline" className={cn(getStatusClass(forklift.status))}>
              {forklift.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Cliente: {forklift.clientName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Informações Gerais</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tipo</span>
                </div>
                <span className="text-sm font-medium">{forklift.type}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Valor Estimado</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(forklift.estimatedValue)}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Advogado Responsável</span>
                </div>
                <span className="text-sm font-medium">{forklift.responsibleLawyer}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Datas Importantes</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Data de Abertura</span>
                <span className="text-sm font-medium">{forklift.openingDate}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Última Atualização</span>
                <span className="text-sm font-medium">{forklift.lastUpdate}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Descrição</span>
              </div>
              
              <div className="p-3 bg-muted/20 rounded-md">
                <div className="text-sm text-muted-foreground">
                  {forklift.description}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Atividade Recente</span>
          </div>
          
          <div className="h-20 bg-muted/20 rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Dados de atividade seriam exibidos aqui</span>
          </div>
        </div>
        
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar Caso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDetails;
