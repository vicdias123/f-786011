
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Filter, Plus, Search, Scale, User } from 'lucide-react';
import { LegalActivity } from '@/types';
import { useToast } from '@/hooks/use-toast';
import OperationDialog from '@/components/operations/OperationDialog';
import OperationDetails from '@/components/operations/OperationDetails';

// Mock data for legal activities
const initialOperations: LegalActivity[] = [
  {
    id: 'ACT001',
    lawyerId: 'ADV001',
    lawyerName: 'Carlos Silva',
    caseId: 'CASO001',
    caseNumber: 'PROC-2023-001',
    activityType: 'Audiência',
    description: 'Audiência de conciliação no Tribunal de Justiça',
    initialTime: 8,
    currentTime: 10,
    billableHours: 2,
    startTime: '2023-11-20T08:00:00',
    status: 'active'
  },
  {
    id: 'ACT002',
    lawyerId: 'ADV002',
    lawyerName: 'Maria Oliveira',
    caseId: 'CASO002',
    caseNumber: 'PROC-2023-002',
    activityType: 'Análise de documentos',
    description: 'Revisão de contratos e documentos do processo',
    initialTime: 14,
    currentTime: 16,
    startTime: '2023-11-20T14:00:00',
    status: 'active'
  },
  {
    id: 'ACT003',
    lawyerId: 'ADV003',
    lawyerName: 'João Pereira',
    caseId: 'CASO003',
    caseNumber: 'PROC-2023-003',
    activityType: 'Reunião com cliente',
    description: 'Reunião para esclarecimentos sobre o processo',
    initialTime: 10,
    currentTime: 12,
    billableHours: 2,
    startTime: '2023-11-19T10:00:00',
    endTime: '2023-11-19T12:00:00',
    status: 'completed'
  }
];

// Mock data for available lawyers and cases
const availableOperators = [
  { id: 'ADV001', name: 'Carlos Silva' },
  { id: 'ADV002', name: 'Maria Oliveira' },
  { id: 'ADV003', name: 'João Pereira' },
  { id: 'ADV004', name: 'Ana Costa' },
  { id: 'ADV005', name: 'Pedro Santos' }
];

const availableForklifts = [
  { id: 'CASO001', model: 'PROC-2023-001' },
  { id: 'CASO002', model: 'PROC-2023-002' },
  { id: 'CASO003', model: 'PROC-2023-003' },
  { id: 'CASO004', model: 'PROC-2023-004' }
];

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');
  const [operations, setOperations] = useState<LegalActivity[]>(initialOperations);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<LegalActivity | null>(null);
  
  // Filter operations based on search and filters
  const filteredOperations = operations.filter(operation => {
    // Search filter
    const matchesSearch = operation.lawyerName.toLowerCase().includes(search.toLowerCase()) || 
                          operation.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
                          operation.activityType.toLowerCase().includes(search.toLowerCase()) ||
                          operation.id.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = status === 'all' || operation.status === status;
    
    // Activity type filter
    const matchesActivityType = activityType === 'all' || operation.activityType === activityType;
    
    return matchesSearch && matchesStatus && matchesActivityType;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get unique activity types for filter
  const activityTypes = [...new Set(operations.map(op => op.activityType))];

  // Handle save operation
  const handleSaveOperation = (operationData: LegalActivity) => {
    const isNewOperation = !operations.some(op => op.id === operationData.id);
    
    if (isNewOperation) {
      // Add new operation
      setOperations(prev => [operationData, ...prev]);
      toast({
        title: "Atividade criada",
        description: "A atividade jurídica foi criada com sucesso."
      });
    } else {
      // Update existing operation
      setOperations(prev => 
        prev.map(op => op.id === operationData.id ? operationData : op)
      );
      toast({
        title: "Atividade atualizada",
        description: "A atividade jurídica foi atualizada com sucesso."
      });
    }
  };

  // Open details dialog
  const handleViewDetails = (operation: LegalActivity) => {
    setSelectedOperation(operation);
    setDetailsDialogOpen(true);
  };

  // Open edit dialog from details
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Atividades Jurídicas" 
          subtitle="Controle de Atividades"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar atividade..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => {
                  setSelectedOperation(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Atividade
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Em Andamento</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipo de Atividade</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              >
                <option value="all">Todos</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Activities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Atividades em Andamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOperations
                .filter(op => op.status === 'active')
                .map((operation) => (
                  <div key={operation.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{operation.lawyerName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {operation.id}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-status-operational/10 text-status-operational">
                          Em Andamento
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.caseNumber} ({operation.caseId})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.lawyerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(operation.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Início: {formatTime(operation.startTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                      <span className="text-sm">Tipo: {operation.activityType}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(operation)}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              
              {filteredOperations.filter(op => op.status === 'active').length === 0 && (
                <div className="col-span-full p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground">Nenhuma atividade em andamento</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Completed Activities */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Atividades Concluídas</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Advogado</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Caso</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Tipo</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Período</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOperations
                      .filter(op => op.status === 'completed')
                      .map((operation) => (
                        <tr key={operation.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">{operation.id}</td>
                          <td className="p-4">{operation.lawyerName}</td>
                          <td className="p-4">
                            <div>{operation.caseNumber}</div>
                            <div className="text-xs text-muted-foreground">{operation.caseId}</div>
                          </td>
                          <td className="p-4">{operation.activityType}</td>
                          <td className="p-4">{formatDate(operation.startTime)}</td>
                          <td className="p-4">
                            {formatTime(operation.startTime)} - {operation.endTime ? formatTime(operation.endTime) : 'Em andamento'}
                          </td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(operation)}
                            >
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOperations.filter(op => op.status === 'completed').length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma atividade concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Activity Dialog */}
      <OperationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />
      
      {/* Edit Activity Dialog */}
      <OperationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operation={selectedOperation || undefined}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />
      
      {/* Activity Details Dialog */}
      <OperationDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operation={selectedOperation}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperationsPage;
