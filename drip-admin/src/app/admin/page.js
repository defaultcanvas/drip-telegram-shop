export default function AdminHome() {
  return (
    <div className="fade-in space-y-6">
      <h2 className="text-4xl font-bold">Welcome back 👑</h2>

      <p className="text-xl text-white/60">
        Manage your store, upload new drops, handle orders — all here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card title="Total Products" value="—" />
        <Card title="Active Orders" value="—" />
        <Card title="Revenue (GBP)" value="—" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
      <div className="text-sm uppercase tracking-wide text-white/40">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}