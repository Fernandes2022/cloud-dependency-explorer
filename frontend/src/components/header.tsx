export default function Header() {
    return (
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Cloud Dependency Explorer
          </h1>
  
          <p className="mt-1 text-sm text-slate-500">
            Explore service dependencies and infrastructure impact.
          </p>
        </div>
  
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          System Healthy
        </div>
      </header>
    );
  }