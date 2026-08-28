import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    type Edge,
    type Node,
  } from "reactflow";
  import { useState } from "react";
  
  import "reactflow/dist/style.css";
  
  import type { GraphNode } from "../services/api";

type RelationshipFilter =
  | "ALL"
  | "DEPENDENCIES"
  | "INFRASTRUCTURE"
  | "OWNERSHIP"
  | "DEPLOYMENT";

interface DependencyGraphProps {
  nodes: GraphNode[];
  edges: {
    id: string;
    source: string;
    target: string;
    type: string;
  }[];
  affectedServices: string[];
}
  


    


  function getNodeStyle(labels: string[]) {
    if (labels.includes("Resource")) {
      return {
        className:
          "!rounded-xl !border !border-blue-200 !bg-blue-50 !px-5 !py-3 !font-medium !text-blue-900 !shadow-sm",
      };
    }
  
    if (labels.includes("Environment")) {
      return {
        className:
          "!rounded-xl !border !border-purple-200 !bg-purple-50 !px-5 !py-3 !font-medium !text-purple-900 !shadow-sm",
      };
    }
  
    if (labels.includes("Team")) {
      return {
        className:
          "!rounded-xl !border !border-amber-200 !bg-amber-50 !px-5 !py-3 !font-medium !text-amber-900 !shadow-sm",
      };
    }
  
    return {
      className:
        "!rounded-xl !border !border-slate-300 !bg-white !px-5 !py-3 !font-semibold !text-slate-900 !shadow-sm",
    };
  }
  
  export default function DependencyGraph({
    nodes: graphNodes,
    edges: graphEdges,
    affectedServices,
  }: DependencyGraphProps) {
    const [relationshipFilter, setRelationshipFilter] =
      useState<RelationshipFilter>("ALL");

    const nodes: Node[] = graphNodes.map((node, index) => {
      const isService = node.labels.includes("Service");
      const isAffected =
        node.properties.name &&
        affectedServices.includes(node.properties.name);
  
      return {
        id: node.id,
        position: {
          x: (index % 3) * 280 + 100,
          y: Math.floor(index / 3) * 180 + 100,
        },
        data: {
          label: (
            <div>
              <div>{node.properties.name ?? "Unknown"}</div>
  
              {isService && node.properties.status && (
                <div className="mt-1 text-xs opacity-60">
                  {node.properties.status}
                </div>
              )}
  
              {node.labels.includes("Resource") && node.properties.provider && (
                <div className="mt-1 text-xs opacity-60">
                  {node.properties.provider} · {node.properties.type}
                </div>
              )}
            </div>
          ),
        },
        ...getNodeStyle(node.labels),

        className: isAffected
        ? "!rounded-xl !border-2 !border-red-400 !bg-red-50 !px-5 !py-3 !font-semibold !text-red-900 !shadow-md"
        : getNodeStyle(node.labels).className,
            };
            });


    const filteredGraphEdges =
  relationshipFilter === "ALL"
    ? graphEdges
    : graphEdges.filter((edge) => {
        if (relationshipFilter === "DEPENDENCIES") {
          return edge.type === "DEPENDS_ON";
        }

        if (relationshipFilter === "INFRASTRUCTURE") {
          return edge.type === "USES";
        }

        if (relationshipFilter === "OWNERSHIP") {
          return edge.type === "OWNED_BY";
        }

        if (relationshipFilter === "DEPLOYMENT") {
          return (
            edge.type === "DEPLOYED_TO" ||
            edge.type === "DEPLOYS"
          );
        }

        return true;
      });
  
      const edges: Edge[] = filteredGraphEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.type,
        animated: edge.type === "DEPENDS_ON",
      }));


    if (nodes.length === 0) {
      return (
        <section className="flex flex-1 items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Select a service to explore its dependency graph.
          </p>
        </section>
      );
    }
  
    return (
      <section className="relative flex-1 bg-slate-50">
        <div className="absolute left-6 top-6 z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Dependency Graph
          </p>
  
          <p className="mt-1 text-sm text-slate-500">
            Services and infrastructure relationships
          </p>
        </div>

        <div className="absolute right-6 top-6 z-10">
        <label className="mr-2 text-xs font-medium text-slate-500">
            Relationship
        </label>

        <select
            value={relationshipFilter}
            onChange={(e) =>
              setRelationshipFilter(e.target.value as RelationshipFilter)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none"
        >
            <option value="ALL">All</option>
            <option value="DEPENDENCIES">Dependencies</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="OWNERSHIP">Ownership</option>
            <option value="DEPLOYMENT">Deployment</option>
        </select>
        </div>
  
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </section>
    );
  }