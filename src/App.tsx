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
  const [view, setView] = useState<'catalog' | 'login' | 'admin'>('catalog');

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'catalog' && (
          <PublicCatalog key="catalog" onGoToAdmin={() => setView('login')} />
        )}
        {view === 'login' && (
          <LoginScreen key="login" onLoginSuccess={() => setView('admin')} onGoToCatalog={() => setView('catalog')} />
        )}
        {view === 'admin' && (
          <DashboardScreen key="admin" onGoToCatalog={() => setView('catalog')} onLogout={() => {
            localStorage.removeItem('admin_token');
            setView('login');
          }} />
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

function DashboardScreen({ onGoToCatalog, onLogout }: { onGoToCatalog: () => void, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'leads' | 'settings'>('dashboard');
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
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`/api/products.php?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          fetchData();
        } else {
          console.error('Failed to delete', await res.text());
        }
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
            <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarLink icon={<Package size={20} />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
            <SidebarLink icon={<ShoppingCart size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <SidebarLink icon={<MessageSquare size={20} />} label="WhatsApp Leads" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />

            <div className="mt-auto flex flex-col gap-2">
              <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              <button
                onClick={onGoToCatalog}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Public Catalog"
              >
                <ShoppingBag size={20} />
                <span className="text-sm font-semibold tracking-wide">Catalog</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <ChevronLeft size={20} />
                <span className="text-sm font-semibold tracking-wide">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 flex items-center justify-between px-10 border-b border-neutral-border bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-12">
            <h2 className="text-xl font-bold text-slate-100 uppercase tracking-widest">{activeTab}</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full bg-neutral-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/10">
              <PlusCircle size={18} />
              Add New
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
          {activeTab === 'dashboard' && <OverviewTab stats={stats} />}
          {activeTab === 'products' && <ProductsTab products={products} onDelete={handleDelete} />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'leads' && <LeadsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>

        <footer className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold border-t border-neutral-border pt-6 pb-10">
          <div>Last update: 5 minutes ago</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">System Status</a>
            <a href="#" className="hover:text-primary transition-colors">Support Center</a>
            <a href="#" className="hover:text-primary transition-colors">API Documentation</a>
          </div>
        </footer>
      </main>
    </motion.div>
  );
}

function OverviewTab({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} stat={stat} />
      ))}
    </div>
  );
}

function ProductsTab({ products, onDelete }: { products: Product[], onDelete: (id: string) => void }) {
  return (
    <div className="bg-neutral-dark rounded-xl border border-neutral-border overflow-hidden shadow-xl">
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
                    <button onClick={() => onDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-5 flex items-center justify-between bg-background-dark border-t border-neutral-border">
        <span className="text-xs text-slate-500">Showing {products.length} results</span>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-neutral-border transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded flex items-center justify-center text-background-dark bg-primary text-xs font-bold">1</button>
          <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-neutral-border transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const mockOrders = [
    { id: 'ORD-001', customer: 'Carlos Perez', date: 'Oct 24, 2023', total: 14500, status: 'Delivered' },
    { id: 'ORD-002', customer: 'Maria Leon', date: 'Oct 25, 2023', total: 8900, status: 'Processing' },
    { id: 'ORD-003', customer: 'Jose Martinez', date: 'Oct 26, 2023', total: 12000, status: 'Pending' },
  ];
  return (
    <div className="bg-neutral-dark rounded-xl border border-neutral-border overflow-hidden shadow-xl">
      <div className="px-8 py-6 border-b border-neutral-border flex justify-between items-center bg-neutral-dark/50">
        <h3 className="text-lg font-bold text-slate-100">Recent Orders</h3>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-background-dark border border-neutral-border rounded-lg text-slate-400 hover:text-primary transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-background-dark text-slate-400 uppercase text-[10px] font-bold tracking-widest">
          <tr>
            <th className="px-8 py-4">Order ID</th>
            <th className="px-8 py-4">Customer</th>
            <th className="px-8 py-4">Date</th>
            <th className="px-8 py-4">Status</th>
            <th className="px-8 py-4 text-right">Total (DOP)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {mockOrders.map(o => (
            <tr key={o.id} className="hover:bg-primary/5 transition-colors">
              <td className="px-8 py-5 font-bold text-slate-300">{o.id}</td>
              <td className="px-8 py-5">{o.customer}</td>
              <td className="px-8 py-5 text-slate-400 text-sm">{o.date}</td>
              <td className="px-8 py-5">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${o.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' : o.status === 'Processing' ? 'bg-primary/20 text-primary' : 'bg-slate-500/20 text-slate-400'}`}>{o.status}</span>
              </td>
              <td className="px-8 py-5 text-right font-bold text-slate-100">${o.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadsTab() {
  const mockLeads = [
    { id: '1', name: 'Laura Sanchez', number: '+1 809-555-0100', status: 'Hot', product: 'Creed Aventus', time: '10 mins ago' },
    { id: '2', name: 'Miguel Angel', number: '+1 829-555-0101', status: 'Follow Up', product: 'Tom Ford Oud Wood', time: '2 hours ago' },
  ];
  return (
    <div className="bg-neutral-dark rounded-xl border border-neutral-border overflow-hidden shadow-xl">
      <div className="px-8 py-6 border-b border-neutral-border bg-neutral-dark/50">
        <h3 className="text-lg font-bold text-slate-100 leading-tight">WhatsApp Leads</h3>
        <p className="text-sm text-slate-400">Track and respond to potential customers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-background-dark/30">
        {mockLeads.map((lead) => (
          <div key={lead.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{lead.name}</h4>
                  <p className="text-xs text-slate-400">{lead.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wide ${lead.status === 'Hot' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{lead.status}</span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-300"><span className="text-slate-500">Number:</span> {lead.number}</p>
              <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Interested in:</span> <span className="text-primary font-medium">{lead.product}</span></p>
            </div>
            <button className="w-full py-2 bg-[#25D366] text-background-dark font-bold rounded-lg text-sm hover:bg-[#25D366]/90 transition-colors uppercase tracking-widest mt-2 flex justify-center items-center gap-2">
              <MessageSquare size={16} /> Reply on WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="glass-card rounded-2xl border border-neutral-border overflow-hidden max-w-2xl mx-auto w-full shadow-2xl">
      <div className="px-8 py-6 border-b border-neutral-border bg-neutral-dark/50">
        <h3 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Store Configurations</h3>
      </div>
      <div className="p-8 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">Store Name</span>
          <input type="text" defaultValue="Luxury Perfume RD" className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">Support Email</span>
          <input type="email" defaultValue="support@motaparfum.store" className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">WhatsApp Number</span>
          <input type="tel" defaultValue="+1 809 555 0199" className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <button className="mt-4 bg-primary hover:bg-primary/90 text-background-dark py-3.5 rounded-lg text-sm font-bold w-full transition-transform active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
        ? 'bg-primary text-background-dark shadow-[0_4px_20px_-4px_rgba(242,185,13,0.4)] font-bold'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
      <div className={`${active ? 'text-background-dark' : 'text-slate-400'}`}>{icon}</div>
      <span className="text-sm tracking-wide">{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-background-dark"></div>}
    </button>
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
    <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
          <h3 className="text-3xl font-bold font-display tracking-tight">{stat.value}</h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
          <Icon size={24} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm relative z-10">
        <span className={`flex items-center gap-1 font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp size={16} className={stat.trend === 'down' ? 'rotate-180' : ''} />
          {stat.change_value}
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </div>
  );
}

function LoginScreen({ onLoginSuccess, onGoToCatalog }: { onLoginSuccess: () => void, onGoToCatalog: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        onLoginSuccess();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-background-dark mesh-gradient"
    >
      <div className="absolute top-8 left-8">
        <button
          onClick={onGoToCatalog}
          className="glass-card p-3 rounded-full hover:bg-white/10 transition-colors"
          title="Back to Catalog"
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>

      <div className="glass-card p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 mx-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary/20 rounded-2xl text-primary mb-4 ring-1 ring-primary/30">
              <Diamond className="size-8 font-bold" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Admin <span className="text-primary">Terminal</span></h1>
            <p className="text-slate-400 text-sm mt-2 text-center">Enter your credentials to manage the store</p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-xl text-sm mb-6 border border-red-500/30 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block pl-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-neutral-dark/80 border border-white/10 rounded-xl px-4 py-3 pl-11 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="admin"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
              </div>
            </div>

            <div className="mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block pl-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-neutral-dark/80 border border-white/10 rounded-xl px-4 py-3 pl-11 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-primary text-background-dark font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(242,185,13,0.4)] transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
              {!loading && <ArrowRight className="size-4" />}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
