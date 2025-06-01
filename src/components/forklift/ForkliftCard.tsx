
import React from 'react';
import { LegalCase, CaseStatus } from '@/types';
import { cn } from '@/lib/utils';
import Badge from '@/components/common/Badge';
import { Clock, FileText, Calendar } from 'lucide-react';

interface ForkliftCardProps {
  forklift: LegalCase;
  onClick?: () => void;
}

const ForkliftCard: React.FC<ForkliftCardProps> = ({ forklift, onClick }) => {
  // Determine the status variant for the badge
  const getStatusVariant = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'success';
      case CaseStatus.SUSPENDED:
        return 'warning';
      case CaseStatus.CLOSED:
        return 'outline';
      case CaseStatus.APPEALING:
        return 'default';
      default:
        return 'default';
    }
  };

  // Format the estimated value
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(forklift.estimatedValue);

  return (
    <div 
      className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{forklift.caseNumber}</h3>
          <p className="text-muted-foreground text-sm">{forklift.clientName}</p>
        </div>
        <Badge variant={getStatusVariant(forklift.status)} withDot={forklift.status === CaseStatus.ACTIVE}>
          {forklift.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Tipo:</span>
          <span>{forklift.type}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Valor Estimado:</span>
          <span className="font-semibold bg-muted/40 px-2 py-0.5 rounded">
            {formattedValue}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Última atualização:</span>
          <span>{forklift.lastUpdate}</span>
        </div>
      </div>
      
      {/* Responsible lawyer indicator at the bottom */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Advogado Responsável</span>
          <span className="font-medium">{forklift.responsibleLawyer}</span>
        </div>
      </div>
    </div>
  );
};

export default ForkliftCard;
