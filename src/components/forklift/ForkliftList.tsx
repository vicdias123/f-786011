
import React from 'react';
import { cn } from '@/lib/utils';
import { LegalCase, CaseStatus } from '@/types';
import { Trash2 } from 'lucide-react';

interface ForkliftListProps {
  forklifts: LegalCase[];
  onForkliftClick: (id: string) => void;
  onDeleteForklift?: (id: string) => void;
}

const ForkliftList: React.FC<ForkliftListProps> = ({ 
  forklifts, 
  onForkliftClick,
  onDeleteForklift 
}) => {
  // Get status color classes
  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'bg-status-operational text-status-operational';
      case CaseStatus.SUSPENDED:
        return 'bg-status-maintenance text-status-maintenance';
      case CaseStatus.CLOSED:
        return 'bg-status-warning text-status-warning';
      case CaseStatus.APPEALING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Get type color classes
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cível':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Criminal':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Trabalhista':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Família':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Empresarial':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering row click
    if (onDeleteForklift) {
      onDeleteForklift(id);
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
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Número</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor Estimado</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Abertura</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Advogado</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {forklifts.map((forklift) => (
              <tr 
                key={forklift.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onForkliftClick(forklift.id)}
              >
                <td className="py-4 px-4 text-sm">{forklift.caseNumber}</td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium">{forklift.clientName}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full border",
                    getTypeColor(forklift.type)
                  )}>
                    {forklift.type}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm">{formatCurrency(forklift.estimatedValue)}</td>
                <td className="py-4 px-4 text-sm">{forklift.openingDate}</td>
                <td className="py-4 px-4 text-sm">{forklift.responsibleLawyer}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      getStatusColor(forklift.status)
                    )} />
                    <span className="text-sm">{forklift.status}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  {onDeleteForklift && (
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => handleDelete(e, forklift.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {forklifts.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          Nenhum caso jurídico encontrado
        </div>
      )}
    </div>
  );
};

export default ForkliftList;
