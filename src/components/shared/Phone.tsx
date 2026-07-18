export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[300px] aspect-[390/844] rounded-[2.5rem] bg-slate-900 p-2.5 shadow-2xl shadow-blue-900/20 ring-1 ring-black/5">
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
        {children}
      </div>
    </div>
  );
}
