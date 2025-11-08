import React from 'react';
import RepairCard from './RepairCard';
import type { RepairService } from './vehicleRepairs.types';

interface RepairCardGridProps {
  services: RepairService[];
}

const RepairCardGrid: React.FC<RepairCardGridProps> = ({ services }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {services.map((service) => (
        <RepairCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default RepairCardGrid;