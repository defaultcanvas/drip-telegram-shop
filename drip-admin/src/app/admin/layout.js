export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white flex">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 space-y-6">
        <h1 className="text-3xl font-black tracking-wide">
          DRIP<span className="text-yellow-400">ADMIN</span>
        </h1>

        <nav className="space-y-3 text-lg">
          <a href="/admin" className="block hover:text-yellow-400">Dashboard</a>
          <a href="/admin/products" className="block hover:text-yellow-400">Products</a>
          <a href="/admin/orders" className="block hover:text-yellow-400">Orders</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}