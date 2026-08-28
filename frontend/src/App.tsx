import { useEffect, useState } from "react";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import DependencyGraph from "./components/dependencyGraph";
import ImpactAnalysis from "./components/impactAnalysis";

import {
  fetchResourceImpact,
  fetchServiceGraph,
  fetchServices,
} from "./services/api";

import type { Service } from "./types";

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [graph, setGraph] = useState<{
    nodes: any[];
    edges: any[];
  }>({
    nodes: [],
    edges: [],
  });

  const [affectedServices, setAffectedServices] = useState<Service[]>([]);
  const [impactLoading, setImpactLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchServices();

        setServices(data);

        if (data.length > 0) {
          setSelectedService(data[0].name);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  useEffect(() => {
    if (!selectedService) {
      setGraph({
        nodes: [],
        edges: [],
      });

      return;
    }

    const serviceName = selectedService;

    async function loadGraph() {
      try {
        const data = await fetchServiceGraph(serviceName);

        setGraph(data);
      } catch (error) {
        console.error("Failed to load graph:", error);

        setGraph({
          nodes: [],
          edges: [],
        });
      }
    }

    loadGraph();
  }, [selectedService]);

  async function analyzeImpact() {
    setImpactLoading(true);

    try {
      const result = await fetchResourceImpact("Payment Database");

      setAffectedServices(result.affectedServices);
    } catch (err) {
      console.error(err);
      setAffectedServices([]);
    } finally {
      setImpactLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500">
          Loading dependency explorer...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-white px-8 py-6 text-center shadow-sm">
          <h2 className="font-semibold text-red-700">
            Unable to load application
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="flex h-140">
        <Sidebar
          services={services}
          selectedService={selectedService}
          onSelect={(service) => {
            setSelectedService(service.name);
            setAffectedServices([]);
          }}
        />

      <DependencyGraph
        nodes={graph.nodes}
        edges={graph.edges}
        affectedServices={affectedServices.map(
          (service) => service.name
        )}
      />
      </div>

      <ImpactAnalysis
        resourceName="Payment Database"
        affectedServices={affectedServices}
        loading={impactLoading}
        onAnalyze={analyzeImpact}
      />
    </main>
  );
}