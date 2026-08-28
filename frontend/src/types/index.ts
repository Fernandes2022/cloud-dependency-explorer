export interface Service {
    name: string;
    language: string;
    status: string;
  }
  
  export interface ImpactResult {
    resource: string;
    affectedServices: Service[];
  }