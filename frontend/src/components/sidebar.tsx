import type { Service } from "../types";

interface SidebarProps {
  services: Service[];
  selectedService: string | null;
  onSelect: (service: Service) => void;
}

export default function Sidebar({
  services,
  selectedService,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Services
        </h2>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {services.length}
        </span>
      </div>

      <div className="space-y-1">
        {services.map((service) => {
          const selected = selectedService === service.name;

          return (
            <button
              key={service.name}
              onClick={() => onSelect(service)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                selected
                  ? "bg-slate-900 font-semibold text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selected ? "bg-emerald-400" : "bg-emerald-500"
                }`}
              />

              <span className="truncate">{service.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}