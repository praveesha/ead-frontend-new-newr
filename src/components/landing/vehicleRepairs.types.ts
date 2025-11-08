import type { ReactNode } from 'react';

export interface RepairService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: ReactNode;
}

export type ServiceTabType = 'Maintenance' | 'Repairs' | 'Modifications';