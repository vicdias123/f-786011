
import React from 'react';
import StatusCard from './StatusCard';
import { 
  Scale, Users, AlertTriangle, CheckCircle, 
  Clock, Calculator, FileText, Calendar
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Mock data for initial rendering
const initialStats: DashboardStats = {
  totalCases: 15,
  activeCases: 9,
  suspendedCases: 3,
  closedCases: 3,
  totalLawyers: 20,
  lawyersWithValidCertificates: 16,
  lawyersWithWarningCertificates: 3,
  lawyersWithExpiredCertificates: 1,
  activeActivities: 7,
  pendingDocuments: 4
};

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = initialStats 
}) => {
  return (
    <section className="space-y-6">
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Casos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Casos" 
            value={stats.totalCases} 
            icon={Scale} 
            status="info" 
          />
          <StatusCard 
            title="Em Andamento" 
            value={stats.activeCases} 
            icon={CheckCircle} 
            status="success"
            change={{ value: 12, trend: 'up' }}
          />
          <StatusCard 
            title="Suspensos" 
            value={stats.suspendedCases} 
            icon={Clock} 
            status="warning" 
          />
          <StatusCard 
            title="Encerrados" 
            value={stats.closedCases} 
            icon={CheckCircle} 
            status="neutral" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Advogados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Advogados" 
            value={stats.totalLawyers} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="OAB e CPP Regulares" 
            value={stats.lawyersWithValidCertificates} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Próximo do Vencimento" 
            value={stats.lawyersWithWarningCertificates} 
            icon={AlertTriangle} 
            status="warning" 
          />
          <StatusCard 
            title="OAB/CPP Vencidos" 
            value={stats.lawyersWithExpiredCertificates} 
            icon={AlertTriangle} 
            status="danger" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Operação Atual</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Atividades Ativas" 
            value={stats.activeActivities} 
            icon={Scale} 
            status="success"
            change={{ value: 5, trend: 'up' }}
          />
          <StatusCard 
            title="Documentos Pendentes" 
            value={stats.pendingDocuments} 
            icon={FileText} 
            status="warning" 
          />
          <StatusCard 
            title="Faturamentos Hoje" 
            value={3} 
            icon={Calculator} 
            status="info" 
          />
          <StatusCard 
            title="OAB a Vencer (30d)" 
            value={4} 
            icon={Calendar} 
            status="warning" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
