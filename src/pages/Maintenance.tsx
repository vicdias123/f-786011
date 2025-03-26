
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Plus, Search, Truck, User, AlertOctagon } from 'lucide-react';
import { Maintenance, MaintenanceStatus } from '@/types';

// Mock data for maintenance
const mockMaintenance: Maintenance[] = [
  {
    id: 'M001',
    forkliftId: 'G001',
    forkliftModel: 'Toyota 8FGU25',
    issue: 'Vazamento de óleo hidráulico',
    reportedBy: 'Carlos Silva',
    reportedDate: '2023-11-15',
    status: MaintenanceStatus.WAITING
  },
  {
    id: 'M002',
    forkliftId: 'R003',
    forkliftModel: 'Crown RR5725',
    issue: 'Motor de tração com ruído anormal',
    reportedBy: 'João Pereira',
    reportedDate: '2023-11-10',
    status: MaintenanceStatus.IN_PROGRESS
  },
  {
    id: 'M003',
    forkliftId: 'E002',
    forkliftModel: 'Hyster E50XN',
    issue: 'Bateria não segura carga completa',
    reportedBy: 'Maria Oliveira',
    reportedDate: '2023-11-05',
    status: MaintenanceStatus.IN_PROGRESS
  },
  {
    id: 'M004',
    forkliftId: 'G004',
    forkliftModel: 'Yale GLP050',
    issue: 'Freios necessitando ajuste',
    reportedBy: 'Pedro Santos',
    reportedDate: '2023-10-28',
    status: MaintenanceStatus.COMPLETED,
    completedDate: '2023-11-03'
  },
  {
    id: 'M005',
    forkliftId: 'G001',
    forkliftModel: 'Toyota 8FGU25',
    issue: 'Revisão programada 1000h',
    reportedBy: 'Ana Costa',
    reportedDate: '2023-10-25',
    status: MaintenanceStatus.COMPLETED,
    completedDate: '2023-10-30'
  }
];

const MaintenancePage = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter maintenance based on search and filters
  const filteredMaintenance = mockMaintenance.filter(maintenance => {
    // Search filter
    const matchesSearch = maintenance.forkliftModel.toLowerCase().includes(search.toLowerCase()) || 
                          maintenance.issue.toLowerCase().includes(search.toLowerCase()) ||
                          maintenance.reportedBy.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  };

  // Get status classes
  const getStatusClass = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.WAITING:
        return 'bg-status-warning/10 text-status-warning';
      case MaintenanceStatus.IN_PROGRESS:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case MaintenanceStatus.COMPLETED:
        return 'bg-status-operational/10 text-status-operational';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Translate status
  const getStatusTranslation = (status: MaintenanceStatus) => {
    return status;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Manutenção" 
          subtitle="Gestão de Manutenções"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar manutenção..." 
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
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Manutenção
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
                <option value={MaintenanceStatus.WAITING}>Aguardando</option>
                <option value={MaintenanceStatus.IN_PROGRESS}>Em andamento</option>
                <option value={MaintenanceStatus.COMPLETED}>Concluído</option>
              </select>
            </div>
          </div>
          
          {/* Maintenance Cards - Waiting & In Progress */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Manutenções Pendentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaintenance
                .filter(m => m.status !== MaintenanceStatus.COMPLETED)
                .map((maintenance) => (
                  <div key={maintenance.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Manutenção #{maintenance.id}</h3>
                          <p className="text-sm text-muted-foreground">{maintenance.forkliftModel}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(maintenance.status)
                        )}>
                          {getStatusTranslation(maintenance.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertOctagon className="w-4 h-4 text-status-warning mt-0.5" />
                            <p className="text-sm">{maintenance.issue}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{maintenance.forkliftId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Reportado por: {maintenance.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Data: {formatDate(maintenance.reportedDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                      <span className="text-sm">ID: {maintenance.id}</span>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </div>
                  </div>
                ))}
              
              {filteredMaintenance.filter(m => m.status !== MaintenanceStatus.COMPLETED).length === 0 && (
                <div className="col-span-full p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground">Nenhuma manutenção pendente</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Maintenance History */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Histórico de Manutenções</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Empilhadeira</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Problema</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Reportado por</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data Reportada</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data Concluída</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMaintenance
                      .filter(m => m.status === MaintenanceStatus.COMPLETED)
                      .map((maintenance) => (
                        <tr key={maintenance.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">{maintenance.id}</td>
                          <td className="p-4">
                            <div>{maintenance.forkliftModel}</div>
                            <div className="text-xs text-muted-foreground">{maintenance.forkliftId}</div>
                          </td>
                          <td className="p-4">{maintenance.issue}</td>
                          <td className="p-4">{maintenance.reportedBy}</td>
                          <td className="p-4">{formatDate(maintenance.reportedDate)}</td>
                          <td className="p-4">{maintenance.completedDate ? formatDate(maintenance.completedDate) : '-'}</td>
                          <td className="p-4">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                              getStatusClass(maintenance.status)
                            )}>
                              {getStatusTranslation(maintenance.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">Detalhes</Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredMaintenance.filter(m => m.status === MaintenanceStatus.COMPLETED).length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma manutenção concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MaintenancePage;
