
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CertificateStatus, Lawyer, LawyerRole } from '@/types';
import { BadgeCheck, Filter, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import OperatorDialog from '@/components/operators/OperatorDialog';
import OperatorDetails from '@/components/operators/OperatorDetails';
import { useToast } from '@/hooks/use-toast';

// Mock data for lawyers
const initialOperators: Lawyer[] = [
  {
    id: 'ADV001',
    name: 'Carlos Silva',
    role: LawyerRole.SENIOR,
    oab: '123.456/SP',
    contact: '(11) 98765-4321',
    specialization: 'Direito Civil',
    registrationDate: '15/03/2022',
    oabExpirationDate: '15/03/2025',
    cppExpirationDate: '20/05/2025',
    oabStatus: CertificateStatus.REGULAR,
    cppStatus: CertificateStatus.REGULAR
  },
  {
    id: 'ADV002',
    name: 'Maria Oliveira',
    role: LawyerRole.JUNIOR,
    oab: '987.654/SP',
    contact: '(11) 91234-5678',
    specialization: 'Direito Trabalhista',
    registrationDate: '10/06/2022',
    oabExpirationDate: '10/06/2024',
    cppExpirationDate: '15/08/2024',
    oabStatus: CertificateStatus.EXPIRED,
    cppStatus: CertificateStatus.EXPIRED
  },
  {
    id: 'ADV003',
    name: 'João Pereira',
    role: LawyerRole.PARTNER,
    oab: '456.789/SP',
    contact: '(11) 97654-3210',
    specialization: 'Direito Criminal',
    registrationDate: '05/01/2020',
    oabExpirationDate: '05/01/2025',
    cppExpirationDate: '10/02/2025',
    oabStatus: CertificateStatus.WARNING,
    cppStatus: CertificateStatus.REGULAR
  },
  {
    id: 'ADV004',
    name: 'Ana Costa',
    role: LawyerRole.JUNIOR,
    oab: '789.123/SP',
    contact: '(11) 94321-8765',
    specialization: 'Direito de Família',
    registrationDate: '20/04/2023',
    oabExpirationDate: '20/04/2026',
    cppExpirationDate: '25/06/2026',
    oabStatus: CertificateStatus.REGULAR,
    cppStatus: CertificateStatus.WARNING
  }
];

const OperatorsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [certStatus, setCertStatus] = useState<string>('all');
  const [operators, setOperators] = useState<Lawyer[]>(initialOperators);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Lawyer | null>(null);
  
  // Filter operators based on search and filters
  const filteredOperators = operators.filter(operator => {
    // Search filter
    const matchesSearch = operator.name.toLowerCase().includes(search.toLowerCase()) || 
                          operator.id.toLowerCase().includes(search.toLowerCase()) ||
                          operator.oab.toLowerCase().includes(search.toLowerCase());
    
    // Role filter
    const matchesRole = role === 'all' || operator.role === role;
    
    // Certificate status filter
    const matchesCertStatus = certStatus === 'all' || 
                             (certStatus === 'regular' && 
                              operator.oabStatus === CertificateStatus.REGULAR && 
                              operator.cppStatus === CertificateStatus.REGULAR) ||
                             (certStatus === 'warning' && 
                              (operator.oabStatus === CertificateStatus.WARNING || 
                               operator.cppStatus === CertificateStatus.WARNING)) ||
                             (certStatus === 'expired' && 
                              (operator.oabStatus === CertificateStatus.EXPIRED || 
                               operator.cppStatus === CertificateStatus.EXPIRED));
    
    return matchesSearch && matchesRole && matchesCertStatus;
  });

  // Get status color classes
  const getStatusClass = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.REGULAR:
        return 'bg-status-operational/10 text-status-operational';
      case CertificateStatus.WARNING:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case CertificateStatus.EXPIRED:
        return 'bg-status-warning/10 text-status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Handle add/edit operator
  const handleSaveOperator = (operatorData: Lawyer) => {
    if (editDialogOpen) {
      // Update existing operator
      setOperators(prev => 
        prev.map(op => op.id === operatorData.id ? operatorData : op)
      );
    } else {
      // Add new operator
      setOperators(prev => [...prev, operatorData]);
    }
  };

  // Handle view operator details
  const handleViewDetails = (operator: Lawyer) => {
    setSelectedOperator(operator);
    setDetailsDialogOpen(true);
  };

  // Handle edit from details view
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle delete operator
  const handleDeleteOperator = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este advogado?")) {
      setOperators(prev => prev.filter(op => op.id !== id));
      toast({
        title: "Advogado excluído",
        description: "O advogado foi excluído com sucesso."
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Advogados" 
          subtitle="Gerenciamento de Advogados"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar advogado..." 
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
                  setSelectedOperator(null);
                  setAddDialogOpen(true);
                }}
              >
                <UserPlus className="w-4 h-4" />
                Novo Advogado
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Função</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={LawyerRole.JUNIOR}>Advogado Júnior</option>
                <option value={LawyerRole.SENIOR}>Advogado Sênior</option>
                <option value={LawyerRole.PARTNER}>Sócio</option>
                <option value={LawyerRole.PARALEGAL}>Paralegal</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status de Certificação</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={certStatus}
                onChange={(e) => setCertStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="regular">Regular</option>
                <option value="warning">Próximo do Vencimento</option>
                <option value="expired">Vencido</option>
              </select>
            </div>
          </div>
          
          {/* Lawyers list */}
          <div className="bg-card rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Nome</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Função</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">OAB</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">CPP</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOperators.map((operator) => (
                    <tr key={operator.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">{operator.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{operator.name}</div>
                        <div className="text-sm text-muted-foreground">{operator.contact}</div>
                      </td>
                      <td className="p-4">{operator.role}</td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(operator.oabStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {operator.oabStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {operator.oabExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(operator.cppStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {operator.cppStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {operator.cppExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(operator)}
                          >
                            Detalhes
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteOperator(operator.id)}
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
            {filteredOperators.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum advogado encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Add/Edit Lawyer Dialog */}
      <OperatorDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperator}
      />
      
      <OperatorDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        operator={selectedOperator || undefined}
        onSave={handleSaveOperator}
      />
      
      {/* Lawyer Details Dialog */}
      <OperatorDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operator={selectedOperator}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperatorsPage;
