import { apiService } from './api/client';

export type ManagerDashboardMetrics = {
  availableEngineers: number;
  activeProjects: number;
  rollingOffSoon: number;
  benchResources: number;
  allocatedEngineers: number;
};

export class ManagerService {
  static async getDashboardMetrics(): Promise<ManagerDashboardMetrics> {
    return await apiService.get<ManagerDashboardMetrics>(`/api/v1/manager/dashboard/metrics`);
  }
}

export default ManagerService;


