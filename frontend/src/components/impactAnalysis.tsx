import type { Service } from "../types";

interface ImpactAnalysisProps {
  resourceName: string;
  affectedServices: Service[];
  loading: boolean;
  onAnalyze: () => void;
}

export default function ImpactAnalysis({
  resourceName,
  affectedServices,
  loading,
  onAnalyze,
}: ImpactAnalysisProps) {
  return (
    <section className="border-t border-slate-200 bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Impact Analysis
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {resourceName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Identify services that could be affected if this resource fails.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Impact"}
        </button>
      </div>

      {affectedServices.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-600">
              {affectedServices.length}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Potentially affected services
              </p>

              <p className="text-xs text-slate-500">
                Based on dependency relationships in the graph.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {affectedServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {service.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}