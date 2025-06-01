
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Plus, Search, Scale, User, AlertOctagon } from 'lucide-react';
import { Document, DocumentStatus } from '@/types';
import MaintenanceDialog from '@/components/maintenance/MaintenanceDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for documents
const initialMaintenance: Document[] = [
  {
    id: 'DOC001',
    caseId: 'CASO001',
    caseNumber: 'PROC-2023-001',
    documentType: 'Petição Inicial',
    createdBy: 'Carlos Silva',
    creationDate: '2023-11-15',
    status: DocumentStatus.PENDING
  },
  {
    id: 'DOC002',
    caseId: 'CASO002',
    caseNumber: 'PROC-2023-002',
    documentType: 'Contestação',
    createdBy: 'João Pereira',
    creationDate: '2023-11-10',
    status: DocumentStatus.IN_REVIEW
  },
  {
    id: 'DOC003',
    caseId: 'CASO003',
    caseNumber: 'PROC-2023-003',
    documentType: 'Recurso de Apelação',
    createdBy: 'Maria Oliveira',
    creationDate: '2023-11-05',
    status: DocumentStatus.IN_REVIEW
  },
  {
    id: 'DOC004',
    caseId: 'CASO004',
    caseNumber: 'PROC-2023-004',
    documentType: 'Parecer Jurídico',
    createdBy: 'Pedro Santos',
    creationDate: '2023-10-28',
    status: DocumentStatus.COMPLETED,
    deadline: '2023-11-03'
  }
];

// Mock data for available cases and lawyers
const availableForklifts = [
  { id: 'CASO001', model: 'PROC-2023-001' },
  { id: 'CASO002', model: 'PROC-2023-002' },
  { id: 'CASO003', model: 'PROC-2023-003' },
  { id: 'CASO004', model: 'PROC-2023-004' },
  { id: 'CASO005', model: 'PROC-2023-005' }
];

const availableOperators = [
  { id: 'ADV001', name: 'Carlos Silva' },
  { id: 'ADV002', name: 'Maria Oliveira' },
  { id: 'ADV003', name: 'João Pereira' },
  { id: 'ADV004', name: 'Ana Costa' },
  { id: 'ADV005', name: 'Pedro Santos' }
];

const MaintenancePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [maintenanceItems, setMaintenanceItems] = useState<Document[]>(initialMaintenance);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Document | null>(null);
  
  // Filter documents based on search and filters
  const filteredMaintenance = maintenanceItems.filter(document => {
    // Search filter
    const matchesSearch = document.caseNumber.toLowerCase().includes(search.toLowerCase()) || 
                          document.documentType.toLowerCase().includes(search.toLowerCase()) ||
                          document.createdBy.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      return dateString;
    }
  };

  // Get status classes
  const getStatusClass = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PENDING:
        return 'bg-status-warning/10 text-status-warning';
      case DocumentStatus.IN_REVIEW:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case DocumentStatus.COMPLETED:
        return 'bg-status-operational/10 text-status-operational';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Handle add/edit document
  const handleSaveMaintenance = (maintenanceData: Document) => {
    if (editDialogOpen) {
      // Update existing document
      setMaintenanceItems(prev => 
        prev.map(m => m.id === maintenanceData.id ? maintenanceData : m)
      );
    } else {
      // Add new document
      setMaintenanceItems(prev => [...prev, maintenanceData]);
    }
  };

  // Handle edit document
  const handleEditMaintenance = (document: Document) => {
    setSelectedMaintenance(document);
    setEditDialogOpen(true);
  };

  // Handle delete document
  const handleDeleteMaintenance = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      setMaintenanceItems(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso."
      });
    }
  };

  // Translate status
  const getStatusTranslation = (status: DocumentStatus) => {
    return status;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Documentos" 
          subtitle="Gestão de Documentos Jurídicos"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar documento..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => toast({
                    title: "Filtros",
                    description: "Esta funcionalidade permitiria filtros mais avançados."
                  })}
                >
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => {
                  setSelectedMaintenance(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Novo Documento
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={DocumentStatus.PENDING}>Pendente</option>
                <option value={DocumentStatus.IN_REVIEW}>Em Revisão</option>
                <option value={DocumentStatus.COMPLETED}>Concluído</option>
              </select>
            </div>
          </div>
          
          {/* Documents Cards - Pending & In Review */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Documentos Pendentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaintenance
                .filter(m => m.status !== DocumentStatus.COMPLETED)
                .map((document) => (
                  <div key={document.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Documento #{document.id}</h3>
                          <p className="text-sm text-muted-foreground">{document.caseNumber}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(document.status)
                        )}>
                          {getStatusTranslation(document.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertOctagon className="w-4 h-4 text-status-warning mt-0.5" />
                            <p className="text-sm">{document.documentType}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{document.caseId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Criado por: {document.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Data: {formatDate(document.creationDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                      <span className="text-sm">ID: {document.id}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMaintenance(document)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteMaintenance(document.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              
              {filteredMaintenance.filter(m => m.status !== DocumentStatus.COMPLETED).length === 0 && (
                <div className="col-span-full p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground">Nenhum documento pendente</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Documents History */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Histórico de Documentos</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Caso</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Tipo</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Criado por</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data Criação</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Prazo</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMaintenance
                      .filter(m => m.status === DocumentStatus.COMPLETED)
                      .map((document) => (
                        <tr key={document.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">{document.id}</td>
                          <td className="p-4">
                            <div>{document.caseNumber}</div>
                            <div className="text-xs text-muted-foreground">{document.caseId}</div>
                          </td>
                          <td className="p-4">{document.documentType}</td>
                          <td className="p-4">{document.createdBy}</td>
                          <td className="p-4">{formatDate(document.creationDate)}</td>
                          <td className="p-4">{document.deadline ? formatDate(document.deadline) : '-'}</td>
                          <td className="p-4">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                              getStatusClass(document.status)
                            )}>
                              {getStatusTranslation(document.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditMaintenance(document)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteMaintenance(document.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredMaintenance.filter(m => m.status === DocumentStatus.COMPLETED).length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum documento concluído</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Add/Edit Document Dialog */}
      <MaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveMaintenance}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
      
      <MaintenanceDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        maintenance={selectedMaintenance || undefined}
        onSave={handleSaveMaintenance}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
    </div>
  );
};

export default MaintenancePage;
