// components/StatusBadge.jsx

const CONFIG = {
  received:  { label: 'Received',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  preparing: { label: 'Preparing', bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  ready:     { label: 'Ready',     bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  delivered: { label: 'Delivered', bg: 'bg-stone-100', text: 'text-stone-500',  dot: 'bg-stone-400' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.received;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
