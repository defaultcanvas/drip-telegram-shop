export default function WebAppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto max-w-sm">
        {children}
      </div>
    </div>
  );
}