import axios from "axios";
import type { Service, ImpactResult } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});



export async function fetchServices(): Promise<Service[]> {
  const response = await api.get<{ data: Service[] }>("/services");

  return response.data.data;
}

export async function fetchServiceDependencies(
  serviceName: string
): Promise<Service[]> {
  const response = await api.get<{ data: Service[] }>(
    `/services/${encodeURIComponent(serviceName)}/dependencies`
  );

  return response.data.data;
}

export async function fetchResourceImpact(
  resourceName: string
): Promise<ImpactResult> {
  const response = await api.get<ImpactResult>(
    `/resources/${encodeURIComponent(resourceName)}/impact`
  );

  return response.data;
}


export interface GraphNode {
    id: string;
    labels: string[];
    properties: {
      name?: string;
      status?: string;
      language?: string;
      provider?: string;
      type?: string;
      version?: string;
      deployedAt?: string;
    };
  }
  
  export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    type: string;
  }
  
  export interface ServiceGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
  }
  
  export async function fetchServiceGraph(
    serviceName: string
  ): Promise<ServiceGraph> {
    const response = await api.get<{ data: ServiceGraph }>(
      `/services/${encodeURIComponent(serviceName)}/graph`
    );
  
    return response.data.data;
  }