import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Search, 
  PlusCircle, 
  Bell, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Star,
  TrendingUp,
  MousePointer2,
  DollarSign,
  Diamond,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Share2,
  User,
  LayoutGrid
} from 'lucide-react';
import { Product, Stat } from './types';

export default function App() {
  const [view, setView] = useState<'catalog' | 'admin'>('catalog');

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'catalog' ? (
          <PublicCatalog onGoToAdmin={() => setView('admin')} />
        ) : (
          <DashboardScreen onGoToCatalog={() => setView('catalog')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PublicCatalog({ onGoToAdmin }: { onGoToAdmin: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products.php')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mesh-gradient min-h-screen font-display"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-8 py-4 flex items-center justify-between bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-background-dark">
            <Diamond className="size-6 font-bold" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight uppercase">PerfumeStore <span className="text-primary">RD</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 glass-card px-8 py-2.5 rounded-full">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Inicio</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Novedades</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Ofertas</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="glass-card p-2.5 rounded-full hover:bg-white/10 transition-colors">
            <Search className="size-5" />
          </button>
          <button className="glass-card p-2.5 rounded-full hover:bg-white/10 transition-colors relative">
            <ShoppingBag className="size-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button 
            onClick={onGoToAdmin}
            className="glass-card p-2.5 rounded-full hover:bg-white/10 transition-colors"
            title="Admin Panel"
          >
            <User className="size-5" />
          </button>
        </div>
      </nav>

      {/* Category Bar */}
      <div className="fixed top-[72px] left-0 right-0 z-50 overflow-x-auto bg-background-dark/40 backdrop-blur-sm border-b border-white/5 py-3 no-scrollbar">
        <div className="flex items-center justify-center gap-4 md:gap-8 px-4 min-w-max mx-auto">
          {['Hombres', 'Mujeres', 'Unisex'].map((cat) => (
            <a 
              key={cat}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold uppercase tracking-wider" 
              href={`#${cat.toLowerCase()}`}
            >
              {cat === 'Hombres' && <User className="size-4" />}
              {cat === 'Mujeres' && <User className="size-4" />}
              {cat === 'Unisex' && <LayoutGrid className="size-4" />}
              {cat}
            </a>
          ))}
        </div>
      </div>

      <main className="relative pt-44 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">Catálogo <span className="text-primary">Exclusivo</span></h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">Descubre nuestra selección curada de fragancias de lujo. Calidad premium con entrega rápida en toda la República Dominicana.</p>
        </header>

        {['Hombres', 'Mujeres', 'Unisex'].map((gender) => (
          <section key={gender} className="mb-48 scroll-mt-48" id={gender.toLowerCase()}>
            <div className="flex items-center gap-4 mb-12 border-l-4 border-primary pl-6">
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest">{gender}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 mb-20">
              {products.filter(p => p.gender === gender).map((product) => (
                <div key={product.id} className="relative group">
                  <div className="relative aspect-[4/5] flex flex-col items-center justify-center">
                    <div className="absolute bottom-12 w-48 h-12 bg-neutral-dark border-t border-primary/30 rounded-[50%] pedestal-shadow transform transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 w-52 h-64 transition-all duration-700 group-hover:-translate-y-8 group-hover:rotate-2">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-lg drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="glass-card mt-[-60px] p-6 rounded-2xl relative z-20 text-center mx-4">
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{product.brand}</p>
                    <p className="text-primary font-bold text-2xl mb-5">RD$ {product.price.toLocaleString()}</p>
                    <button className="w-full py-3.5 bg-primary text-background-dark font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(242,185,13,0.4)] transition-all uppercase text-xs">
                      <MessageSquare className="size-5" /> Comprar vía WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button className="group relative px-10 py-4 border border-primary/40 hover:border-primary rounded-full transition-all duration-300 flex items-center gap-3">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">Ver más productos</span>
                <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-neutral-dark/80 py-12 px-8 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Diamond className="size-6 font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">PerfumeStore <span className="text-primary">RD</span></span>
            </div>
            <p className="text-slate-500 max-w-md text-sm">Los mejores perfumes originales en Santo Domingo, Santiago y todo el país. Calidad garantizada en cada atomización.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-primary transition-colors" href="#">
                <Share2 className="size-5" />
              </a>
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-primary transition-colors" href="#">
                <MapPin className="size-5" />
              </a>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-4">© 2024 PerfumeStore RD - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass-card p-2 rounded-full flex items-center justify-between shadow-2xl border-white/20">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-background-dark rounded-full font-bold transition-all text-xs md:text-sm">
            <LayoutGrid className="size-5" />
            <span>Catálogo</span>
          </button>
          <div className="flex-1 flex justify-around items-center px-2">
            <a className="p-2 text-slate-400 hover:text-primary transition-colors" href="#hombres">
              <User className="size-5" />
            </a>
            <a className="p-2 text-slate-400 hover:text-primary transition-colors" href="#mujeres">
              <User className="size-5" />
            </a>
            <a className="p-2 text-slate-400 hover:text-primary transition-colors" href="#unisex">
              <LayoutGrid className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ onGoToCatalog }: { onGoToCatalog: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  const fetchData = () => {
    fetch('/api/products.php')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));

    fetch('/api/stats.php')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products.php?id=${id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-screen overflow-hidden bg-background-dark font-manrope"
    >
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-neutral-border h-full bg-background-dark">
        <div className="p-6 flex flex-col gap-8 h-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-background-dark">
              <Star className="size-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-100 text-base font-bold leading-tight">Luxury Perfume RD</h1>
              <p className="text-primary/70 text-xs font-medium">Admin Terminal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink icon={<Package size={20} />} label="Products" active />
            <SidebarLink icon={<ShoppingCart size={20} />} label="Orders" />
            <SidebarLink icon={<MessageSquare size={20} />} label="WhatsApp Leads" />
            
            <div className="mt-auto">
              <SidebarLink icon={<Settings size={20} />} label="Settings" />
              <button 
                onClick={onGoToCatalog}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ShoppingBag size={20} />
                <span className="text-sm font-semibold tracking-wide">Public Catalog</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 flex items-center justify-between px-10 border-b border-neutral-border bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-12">
            <h2 className="text-xl font-bold text-slate-100">Inventory Management</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input 
                type="text" 
                placeholder="Search perfume catalog..."
                className="w-full bg-neutral-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/10">
              <PlusCircle size={18} />
              Add New Product
            </button>
            <div className="h-10 w-px bg-neutral-border mx-2"></div>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 ml-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-neutral-border flex items-center justify-center overflow-hidden border border-primary/20">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Admin"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 flex flex-col gap-10">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          {/* Table */}
          <div className="bg-neutral-dark rounded-xl border border-neutral-border overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-border flex justify-between items-center bg-neutral-dark/50">
              <h3 className="text-lg font-bold text-slate-100">Current Catalog</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-background-dark border border-neutral-border rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-background-dark border border-neutral-border rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-dark text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4 w-20">Image</th>
                    <th className="px-8 py-4">Product Name</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Price (DOP)</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div 
                          className="w-14 h-14 rounded-lg bg-neutral-border bg-center bg-no-repeat bg-cover border border-primary/10 overflow-hidden"
                          style={{ backgroundImage: `url(${product.image})` }}
                        />
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-100">{product.name}</span>
                          <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-primary/20 text-primary uppercase tracking-tight">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-100">${product.price.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.status === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-xs font-medium text-slate-400">{product.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 flex items-center justify-between bg-background-dark border-t border-neutral-border">
              <span className="text-xs text-slate-500">Showing 1 to 4 of 1,240 results</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-neutral-border transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-background-dark bg-primary text-xs font-bold">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 text-xs font-bold hover:bg-neutral-border transition-colors">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 text-xs font-bold hover:bg-neutral-border transition-colors">3</button>
                <span className="px-2 flex items-center text-slate-600">...</span>
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 text-xs font-bold hover:bg-neutral-border transition-colors">310</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-neutral-border transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <footer className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold border-t border-neutral-border pt-6 pb-10">
            <div>Last update: 5 minutes ago</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">System Status</a>
              <a href="#" className="hover:text-primary transition-colors">Support Center</a>
              <a href="#" className="hover:text-primary transition-colors">API Documentation</a>
            </div>
          </footer>
        </div>
      </main>
    </motion.div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active 
          ? 'bg-primary/20 text-primary border border-primary/20' 
          : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
      }`}
    >
      {icon}
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </a>
  );
}

function StatCard({ stat }: { stat: Stat; key?: number }) {
  const Icon = {
    'package': Package,
    'mouse-pointer': MousePointer2,
    'message-square': MessageSquare,
    'dollar-sign': DollarSign
  }[stat.icon as any] || TrendingUp;

  return (
    <div className="bg-neutral-dark p-6 rounded-xl border border-neutral-border hover:border-primary/30 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
        <Icon className="text-primary group-hover:scale-110 transition-transform" size={20} />
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-extrabold text-slate-100">{stat.value}</h3>
        <span className={`text-sm font-bold mb-1 flex items-center ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          <TrendingUp size={14} className="mr-1" /> {stat.change}
        </span>
      </div>
    </div>
  );
}
