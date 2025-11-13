export default function CategoryTabs({ active, setActive }) {
  const cats = ["Men", "Women", "Footwear", "Accessories"];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cats.map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            active === c
              ? "bg-yellow-400 text-black"
              : "bg-white/10 text-white/70"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}