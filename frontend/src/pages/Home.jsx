// pages/Home.jsx
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '⚡', title: 'Fast Delivery', desc: 'Hot food at your door in 30 minutes or less. We partner with local couriers for lightning-fast service.' },
  { icon: '🌿', title: 'Fresh Ingredients', desc: 'Every dish starts with locally sourced, seasonal ingredients. We work with farms within 50 miles.' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Order online, track your food in real-time, and pay seamlessly — all from your phone.' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden bg-[#faf7f4]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D85A30]/8" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-100/60" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-orange-50" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block bg-[#D85A30]/10 text-[#D85A30] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              ✦ Fine casual dining
            </span>
            <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[1.1] mb-6">
              Where every<br />
              <span className="italic text-[#D85A30]">bite</span> tells<br />
              a story.
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-md">
              Crafted with love, served with passion. Bistro Moderne brings contemporary European cuisine to your table — or your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="bg-[#D85A30] hover:bg-[#c04f28] text-white px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
              >
                View Menu →
              </Link>
              <Link
                to="/menu"
                className="bg-white border-2 border-stone-200 hover:border-[#D85A30] text-[#1a1a1a] px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Order Now
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-stone-200">
              {[['500+', 'Happy Diners Daily'], ['15+', 'Years of Excellence'], ['4.9★', 'Average Rating']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-['Playfair_Display'] text-2xl font-bold text-[#D85A30]">{num}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 h-[520px]">
            <div className="rounded-3xl overflow-hidden row-span-2">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80"
                alt="Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80"
                alt="Food"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80"
                alt="Dish"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1a1a1a] mb-3">
              Why Choose Us?
            </h2>
            <p className="text-stone-500 text-lg">The Bistro Moderne difference, in every detail.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="group p-8 rounded-2xl border border-stone-100 hover:border-[#D85A30]/30 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#D85A30]/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#1a1a1a] py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#D85A30] text-xs font-bold uppercase tracking-widest">Our Story</span>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mt-3 mb-6 leading-tight">
              A kitchen born from<br />
              <span className="italic text-[#D85A30]">passion</span>
            </h2>
            <p className="text-stone-400 leading-relaxed mb-4">
              Founded in 2009 by Chef Anya Reeves, Bistro Moderne started as a tiny twelve-seat bistro in the heart of the arts district. Today, we seat 80 guests and serve hundreds through delivery — but the philosophy hasn't changed.
            </p>
            <p className="text-stone-400 leading-relaxed">
              We believe extraordinary food doesn't require ceremony. Just exceptional ingredients, technical care, and a genuine desire to make your evening memorable.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden h-72 lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
              alt="Our kitchen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-['Playfair_Display'] text-white text-xl font-bold mb-3">Bistro Moderne</h3>
              <p className="text-sm leading-relaxed">Contemporary European cuisine with heart and soul.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Visit Us</h4>
              <p className="text-sm">42 Rue du Marché</p>
              <p className="text-sm">Downtown Arts District</p>
              <p className="text-sm mt-2">(555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Hours</h4>
              <p className="text-sm">Mon–Thu: 11am – 10pm</p>
              <p className="text-sm">Fri–Sat: 11am – 11pm</p>
              <p className="text-sm">Sunday: 12pm – 9pm</p>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 text-xs text-center">
            © {new Date().getFullYear()} Bistro Moderne. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
