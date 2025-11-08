import React, { useState } from 'react';
import ServiceTabNav from './ServiceTabNav';
import RepairCardGrid from './RepairCardGrid';
import type { ServiceTabType, RepairService } from './vehicleRepairs.types';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbSteeringWheel } from 'react-icons/tb';
import { GiCarWheel } from 'react-icons/gi';
import { MdOutlineElectricalServices } from 'react-icons/md';
import { LuWind } from 'react-icons/lu';
import { IoWaterOutline } from 'react-icons/io5';

const VehicleRepairs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTabType>('Repairs');

  // Sample data for repair services
  const repairServices: RepairService[] = [
    {
      id: '1',
      title: 'Engine Diagnostics & Repair',
      description: 'Advanced computer diagnostics and expert engine repair services.',
      duration: '2 - 8 hours',
      price: 'From $199.99',
      icon: <IoSettingsOutline size={24} />,
    },
    {
      id: '2',
      title: 'Transmission Service',
      description: 'Transmission fluid service, diagnostics, and complete rebuilds.',
      duration: '3 - 10 hours',
      price: 'From $249.99',
      icon: <TbSteeringWheel size={24} />,
    },
    {
      id: '3',
      title: 'Suspension & Steering',
      description: 'Shocks, struts, alignment, and steering component replacement.',
      duration: '2 - 6 hours',
      price: 'From $299.99',
      icon: <GiCarWheel size={24} />,
    },
    {
      id: '4',
      title: 'Electrical System Repair',
      description: 'Wiring, sensors, modules, and electrical troubleshooting.',
      duration: '1 - 6 hours',
      price: 'From $149.99',
      icon: <MdOutlineElectricalServices size={24} />,
    },
    {
      id: '5',
      title: 'Exhaust System Service',
      description: 'Muffler, catalytic converter, and complete exhaust repairs.',
      duration: '2 - 4 hours',
      price: 'From $179.99',
      icon: <LuWind size={24} />,
    },
    {
      id: '6',
      title: 'Cooling System Service',
      description: 'Radiator, water pump, thermostat, and coolant system repairs.',
      duration: '2 - 5 hours',
      price: 'From $169.99',
      icon: <IoWaterOutline size={24} />,
    },
  ];

  const handleTabChange = (tab: ServiceTabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <ServiceTabNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Repair Services</h1>
          <p className="text-gray-400 text-lg">
            Expert diagnostics and repairs for all vehicle systems
          </p>
        </div>

        {/* Service Cards Grid - Split into two rows of 3 */}
        <RepairCardGrid services={repairServices.slice(0, 3)} />
        <RepairCardGrid services={repairServices.slice(3, 6)} />
      </div>
    </div>
  );
};

export default VehicleRepairs;