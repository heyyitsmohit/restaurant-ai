// components/OrderTimeline.jsx

const STEPS = [
  { key: 'received', label: 'Order Received', icon: '📋', desc: 'We got your order!' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', desc: 'Chef is cooking your food' },
  { key: 'ready', label: 'Ready', icon: '✅', desc: 'Your order is ready!' },
  { key: 'delivered', label: 'Delivered', icon: '🚀', desc: 'Enjoy your meal!' },
];

export default function OrderTimeline({ status }) {
  const currentIdx = STEPS.findIndex(s => s.key === status);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#D85A30] z-0 transition-all duration-700"
          style={{ width: `${currentIdx === -1 ? 0 : (currentIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#D85A30] border-[#D85A30] shadow-lg shadow-orange-200 scale-110'
                    : isDone
                    ? 'bg-[#D85A30] border-[#D85A30]'
                    : 'bg-white border-stone-200'
                }`}
              >
                <span className={isDone ? 'grayscale-0' : 'grayscale opacity-40'}>
                  {step.icon}
                </span>
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${isDone ? 'text-[#1a1a1a]' : 'text-stone-400'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-[#D85A30] mt-0.5">{step.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
