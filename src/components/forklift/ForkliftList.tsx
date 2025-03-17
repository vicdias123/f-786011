import React from 'react';
import { Forklift, ForkliftStatus } from '@/types';
import ForkliftCard from './ForkliftCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import Badge from '@/components/common/Badge';

interface ForkliftListProps {
  forklifts: Forklift[];
  onForkliftClick: (id: string) => void;
}

const ForkliftList: React.FC<ForkliftListProps> = ({ forklifts, onForkliftClick }) => {
  const isMobile = useIsMobile();

  // Get status variant for badges
  const getStatusVariant = (status: ForkliftStatus) => {
    switch (status) {
      case ForkliftStatus.OPERATIONAL:
        return 'success';
      case ForkliftStatus.MAINTENANCE:
        return 'warning';
      case ForkliftStatus.STOPPED:
        return 'outline';
      default:
        return 'default';
    }
  };

  // If on mobile, display as cards
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {forklifts.length > 0 ? (
          forklifts.map((forklift) => (
            <ForkliftCard 
              key={forklift.id} 
              forklift={forklift} 
              onClick={() => onForkliftClick(forklift.id)}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma empilhadeira encontrada
          </p>
        )}
      </div>
    );
  }

  // Otherwise, display as a table
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Horímetro</TableHead>
              <TableHead>Data Aquisição</TableHead>
              <TableHead>Última Manutenção</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forklifts.length > 0 ? (
              forklifts.map((forklift) => (
                <TableRow 
                  key={forklift.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => onForkliftClick(forklift.id)}
                >
                  <TableCell className="font-medium">{forklift.id}</TableCell>
                  <TableCell>{forklift.model}</TableCell>
                  <TableCell>{forklift.type}</TableCell>
                  <TableCell>{forklift.capacity}</TableCell>
                  <TableCell className="font-mono">
                    {forklift.hourMeter.toString().padStart(5, '0')}
                  </TableCell>
                  <TableCell>{forklift.acquisitionDate}</TableCell>
                  <TableCell>{forklift.lastMaintenance}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(forklift.status)} 
                      withDot={forklift.status === ForkliftStatus.OPERATIONAL}
                    >
                      {forklift.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                  Nenhuma empilhadeira encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ForkliftList;
