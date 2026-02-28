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
  LayoutGrid,
  X
} from 'lucide-react';
import { Product, Stat, Category } from './types';
import { t, getBrowserLanguage } from './i18n';

export interface AppSettings {
  store_name: string;
  support_email: string;
  whatsapp_number: string;
  primary_color: string;
  store_logo?: string;
}

export default function App() {
  const [view, setView] = useState<'catalog' | 'login' | 'admin'>('catalog');
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings.php')
      .then(res => res.json())
      .then((data: AppSettings) => {
        setSettings(data);
        if (data.primary_color) {
          document.documentElement.style.setProperty('--color-primary', data.primary_color);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'catalog' && (
          <PublicCatalog onGoToAdmin={() => setView('login')} settings={settings} />
        )}
        {view === 'login' && (
          <LoginScreen onLoginSuccess={() => setView('admin')} onGoToCatalog={() => setView('catalog')} />
        )}
        {view === 'admin' && (
          <DashboardScreen onGoToCatalog={() => setView('catalog')} settings={settings} onLogout={() => {
            localStorage.removeItem('admin_token');
            setView('login');
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PublicCatalog({ onGoToAdmin, settings }: { onGoToAdmin: () => void, settings: AppSettings | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const lang = getBrowserLanguage();

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
          {settings?.store_logo ? (
            <img src={settings.store_logo} alt={settings?.store_name || 'Logo'} className="h-10 w-auto object-contain" />
          ) : (
            <>
              <div className="p-2 bg-primary rounded-lg text-background-dark">
                <Diamond className="size-6 font-bold" />
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tight uppercase">{settings?.store_name || 'PerfumeStore RD'}</span>
            </>
          )}
        </div>
        <div className="hidden md:flex items-center gap-8 glass-card px-8 py-2.5 rounded-full">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">{t(lang, 'nav_home')}</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">{t(lang, 'nav_new')}</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">{t(lang, 'nav_offers')}</a>
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
              {t(lang, cat === 'Hombres' ? 'cat_men' : cat === 'Mujeres' ? 'cat_women' : 'cat_unisex')}
            </a>
          ))}
        </div>
      </div>

      <main className="relative pt-44 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">{t(lang, 'hero_title')} <span className="text-primary">{t(lang, 'hero_title_highlight')}</span></h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">{t(lang, 'hero_subtitle')}</p>
        </header>

        {['Hombres', 'Mujeres', 'Unisex'].map((gender) => (
          <section key={gender} className="mb-48 scroll-mt-48" id={gender.toLowerCase()}>
            <div className="flex items-center gap-4 mb-12 border-l-4 border-primary pl-6">
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest">{t(lang, gender === 'Hombres' ? 'cat_men' : gender === 'Mujeres' ? 'cat_women' : 'cat_unisex')}</h2>
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
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowLeadModal(true);
                      }}
                      className="w-full py-3.5 bg-primary text-background-dark font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(242,185,13,0.4)] transition-all uppercase text-xs"
                    >
                      <MessageSquare className="size-5" /> {t(lang, 'buy_whatsapp')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button className="group relative px-10 py-4 border border-primary/40 hover:border-primary rounded-full transition-all duration-300 flex items-center gap-3">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">{t(lang, 'see_more')}</span>
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
              {settings?.store_logo ? (
                <img src={settings.store_logo} alt={settings?.store_name || 'Logo'} className="h-12 w-auto object-contain" />
              ) : (
                <>
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <Diamond className="size-6 font-bold" />
                  </div>
                  <span className="text-xl font-bold tracking-tight uppercase">{settings?.store_name || 'PerfumeStore RD'}</span>
                </>
              )}
            </div>
            <p className="text-slate-500 max-w-md text-sm">{t(lang, 'footer_desc')}</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-primary transition-colors" href="#">
                <Share2 className="size-5" />
              </a>
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-primary transition-colors" href="#">
                <MapPin className="size-5" />
              </a>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-4">© {new Date().getFullYear()} {settings?.store_name || 'PerfumeStore RD'} - {t(lang, 'footer_rights')}</p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass-card p-2 rounded-full flex items-center justify-between shadow-2xl border-white/20">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-background-dark rounded-full font-bold transition-all text-xs md:text-sm">
            <LayoutGrid className="size-5" />
            <span>{t(lang, 'floating_catalog')}</span>
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

      <AnimatePresence>
        {showLeadModal && selectedProduct && (
          <LeadCaptureModal
            product={selectedProduct}
            settings={settings}
            onClose={() => setShowLeadModal(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DashboardScreen({ onGoToCatalog, onLogout, settings }: { onGoToCatalog: () => void, onLogout: () => void, settings: AppSettings | null }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'leads' | 'settings'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = () => {
    fetch('/api/products.php')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));

    fetch('/api/stats.php')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    fetch('/api/categories.php')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
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
            {settings?.store_logo ? (
              <img src={settings.store_logo} alt={settings?.store_name || 'Logo'} className="h-10 w-auto object-contain" />
            ) : (
              <>
                <div className="bg-primary rounded-lg p-2 text-background-dark">
                  <Star className="size-6 fill-current" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-slate-100 text-base font-bold leading-tight">{settings?.store_name || 'Luxury Perfume RD'}</h1>
                  <p className="text-primary/70 text-xs font-medium">Admin Terminal</p>
                </div>
              </>
            )}
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
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 ml-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-neutral-border flex items-center justify-center overflow-hidden border border-primary/20 text-slate-400">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 flex flex-col gap-10">
          {activeTab === 'dashboard' && <OverviewTab stats={stats} />}
          {activeTab === 'products' && <ProductsTab products={products} categories={categories} onDelete={handleDelete} onRefresh={fetchData} />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'leads' && <LeadsTab settings={settings} />}
          {activeTab === 'settings' && <SettingsTab onRefresh={fetchData} settings={settings} />}
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

function ProductsTab({ products, categories, onDelete, onRefresh }: { products: Product[], categories: Category[], onDelete: (id: string) => void, onRefresh: () => void }) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const openAddProduct = () => {
    setEditingProduct(undefined);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-4 justify-end mb-4">
        <button onClick={() => setIsCategoryModalOpen(true)} className="bg-neutral-dark hover:bg-neutral-dark/80 text-secondary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform border border-neutral-border">
          <Settings size={18} />
          Manage Categories
        </button>
        <button onClick={openAddProduct} className="bg-primary hover:bg-primary/90 text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform shadow-lg shadow-primary/10">
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>
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
                <th className="px-8 py-4">Stock</th>
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
                    <span className="text-sm font-bold text-slate-200">{product.stock || 0}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.status === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-medium text-slate-400">{product.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditProduct(product)} className="p-2 text-slate-400 hover:text-primary transition-colors">
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

      {isProductModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsProductModalOpen(false)}
          onRefresh={onRefresh}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

function OrdersTab() {
  const mockOrders: any[] = [];
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
          {mockOrders.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-8 text-center text-slate-500">No orders found yet</td>
            </tr>
          )}
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

function LeadsTab({ settings }: { settings: AppSettings | null }) {
  const [leads, setLeads] = useState<any[]>([]);

  const fetchLeads = () => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/leads.php', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setLeads(data) : console.error(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch('/api/leads.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, status })
      });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await fetch('/api/leads.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id })
      });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-neutral-dark rounded-xl border border-neutral-border overflow-hidden shadow-xl">
      <div className="px-8 py-6 border-b border-neutral-border bg-neutral-dark/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-100 leading-tight">WhatsApp Leads</h3>
          <p className="text-sm text-slate-400">Track and respond to potential customers</p>
        </div>
        <button onClick={fetchLeads} className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white/5 rounded-full"><TrendingUp size={18} /></button>
      </div>
      {leads.length === 0 ? (
        <div className="p-12 text-center text-slate-500">No leads have been captured yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-background-dark/30">
          {leads.map((lead) => (
            <div key={lead.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group hover:border-primary/30 transition-colors">
              <button onClick={() => handleDelete(lead.id)} className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all z-10">
                <Trash2 size={14} />
              </button>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{lead.name}</h4>
                    <p className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-300"><span className="text-slate-500">Phone:</span> {lead.phone}</p>
                <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Interested in:</span> <span className="text-primary font-medium">{lead.product_name}</span></p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  className={`text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer appearance-none bg-transparent border 
                    ${lead.status === 'Hot' || lead.status === 'Contacted' ? 'border-primary text-primary'
                      : lead.status === 'Lost' ? 'border-red-500 text-red-500'
                        : 'border-slate-500 text-slate-400'}`}
                >
                  <option className="bg-background-dark text-slate-100" value="New">New</option>
                  <option className="bg-background-dark text-slate-100" value="Contacted">Contacted</option>
                  <option className="bg-background-dark text-slate-100" value="Hot">Hot</option>
                  <option className="bg-background-dark text-slate-100" value="Lost">Lost</option>
                </select>

                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.name)},%20vimos%20que%20te%20interes%C3%B3%20nuestro%20perfume%20${encodeURIComponent(lead.product_name)}.`}
                  target="_blank"
                  className="px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] font-bold rounded-lg text-xs hover:bg-[#25D366] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  <MessageSquare size={12} /> Chat
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ onRefresh, settings }: { onRefresh: () => void, settings: AppSettings | null }) {
  const [formData, setFormData] = useState<AppSettings>(settings || {
    store_name: 'Luxury Perfume RD',
    support_email: 'support@motaparfum.store',
    whatsapp_number: '+1 809 555 0199',
    primary_color: '#F2B90D',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);

    // Resize image via canvas to keep base64 small enough for DB storage (~200x80 max)
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_W = 400;
      const MAX_H = 160;
      let w = img.width;
      let h = img.height;
      if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
      if (h > MAX_H) { w = Math.round(w * MAX_H / h); h = MAX_H; }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/png', 0.8);
      setLogoPreview(compressed);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleSave = async () => {
    setSaveError(null);
    setLoading(true);
    const token = localStorage.getItem('admin_token');

    if (!token) {
      setSaveError('No auth token found. Please log out and log in again.');
      setLoading(false);
      return;
    }

    // Send as JSON - includes base64 logo when selected
    const payload: any = {
      store_name: formData.store_name,
      support_email: formData.support_email,
      whatsapp_number: formData.whatsapp_number,
      primary_color: formData.primary_color,
    };
    // Use the compressed canvas preview if a new file was selected,
    // or the URL if typed, or the existing setting if unchanged
    if (logoPreview) {
      payload.store_logo = logoPreview;
    } else if (formData.store_logo) {
      payload.store_logo = formData.store_logo;
    }

    try {
      const res = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Read body as text first so we don't crash on non-JSON responses
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch { /* not JSON */ }

      if (res.ok && json?.success) {
        alert('¡Guardado exitosamente! Recargando...');
        window.location.reload();
      } else {
        const msg = json?.error || `HTTP ${res.status}: ${text.substring(0, 200)}`;
        setSaveError(msg);
      }
    } catch (err: any) {
      setSaveError('Network error: ' + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you ABSOLUTELY sure you want to delete ALL store data? This action cannot be undone.')) {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch('/api/reset.php', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          alert('Database wiped successfully.');
          onRefresh();
        } else {
          alert('Failed to reset database.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-neutral-border overflow-hidden max-w-2xl mx-auto w-full shadow-2xl">
      <div className="px-8 py-6 border-b border-neutral-border bg-neutral-dark/50">
        <h3 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Store Configurations</h3>
      </div>
      <div className="p-8 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">Store Name</span>
          <input type="text" value={formData.store_name} onChange={e => setFormData({ ...formData, store_name: e.target.value })} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">Support Email</span>
          <input type="email" value={formData.support_email} onChange={e => setFormData({ ...formData, support_email: e.target.value })} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">WhatsApp Number</span>
          <input type="tel" value={formData.whatsapp_number} onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">Theme Primary Color</span>
          <div className="flex gap-4">
            <input type="color" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="w-16 h-12 bg-background-dark border border-neutral-border rounded-lg cursor-pointer" />
            <input type="text" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="flex-1 bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow font-mono" />
          </div>
        </label>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-slate-400">Store Logo</span>

          {/* Logo Preview Area */}
          <div className="flex items-center gap-4 p-4 bg-background-dark border border-neutral-border rounded-xl">
            <div className="w-24 h-16 rounded-lg border border-dashed border-neutral-border flex items-center justify-center bg-neutral-dark overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="New logo preview" className="w-full h-full object-contain" />
              ) : settings?.store_logo ? (
                <img src={settings.store_logo} alt="Current logo" className="w-full h-full object-contain" />
              ) : (
                <Diamond className="size-6 text-slate-600" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-300">
                {logoPreview ? 'New logo selected ✓' : settings?.store_logo ? 'Current logo' : 'No logo set'}
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, SVG, WebP — recommended 200x60px</p>
            </div>
          </div>

          {/* File Upload */}
          <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-background-dark hover:file:bg-primary/90" />

          {/* URL Fallback */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-neutral-border"></div>
            <span className="text-xs text-slate-600 uppercase tracking-widest">or paste URL</span>
            <div className="flex-1 h-px bg-neutral-border"></div>
          </div>
          <input type="url" placeholder="https://example.com/logo.png" value={formData.store_logo || ''} onChange={e => { setFormData({ ...formData, store_logo: e.target.value }); setLogoPreview(e.target.value); }} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 transition-shadow placeholder:text-slate-600" />
        </div>

        {saveError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 break-all">
            <span className="font-bold">Error:</span> {saveError}
          </div>
        )}

        <button onClick={handleSave} disabled={loading} className="mt-2 bg-primary hover:bg-primary/90 text-background-dark py-3.5 rounded-lg text-sm font-bold w-full transition-transform active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <div className="mt-8 border-t border-red-500/20 pt-8">
          <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
            Danger Zone
          </h4>
          <p className="text-slate-400 text-sm mb-4">This will permanently delete all products, categories, and reset all stats to zero. This action cannot be undone.</p>
          <button
            onClick={handleReset}
            className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-3.5 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors"
          >
            Factory Reset Database
          </button>
        </div>
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

function ProductModal({ product, categories, onClose, onRefresh }: { product?: Product, categories: Category[], onClose: () => void, onRefresh: () => void }) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '', sku: '', category: categories[0]?.name || '', price: 0, stock: 0, status: 'In Stock', image: '', gender: 'Unisex', brand: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('admin_token');

    const isUpdate = !!product;
    const url = `/api/products.php${isUpdate ? `?id=${product.id}` : ''}`;

    // We send data through FormData to support file uplads
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key as keyof Product] as any);
    });

    if (imageFile) {
      submitData.append('image', imageFile);
    }
    if (isUpdate) {
      submitData.append('_method', 'PUT');
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm">
      <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-neutral-border flex justify-between items-center bg-background-dark/50">
          <h2 className="text-lg font-bold text-slate-100">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Name</span>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">SKU</span>
            <input required type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Price (DOP)</span>
            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Category</span>
            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Gender</span>
            <select required value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary">
              <option value="Unisex">Unisex</option>
              <option value="Hombres">Hombres</option>
              <option value="Mujeres">Mujeres</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Brand</span>
            <input required type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Stock</span>
            <input required type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
          </label>
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Status</span>
            <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary">
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </label>
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400">Image</span>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
            {product?.image && !imageFile && (
              <span className="text-xs text-slate-500 mt-1">Current image: <a href={product.image} target="_blank" className="text-primary hover:underline">View Current Image</a></span>
            )}
          </label>

          <div className="col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-background-dark hover:bg-primary/90 shadow-lg disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({ categories, onClose, onRefresh }: { categories: Category[], onClose: () => void, onRefresh: () => void }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    if (!newCategoryName) return;
    setLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`/api/categories.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName })
      });

      if (res.ok) {
        setNewCategoryName('');
        onRefresh();
      } else {
        alert('Failed to add category');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`/api/categories.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm">
      <div className="bg-neutral-dark border border-neutral-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-neutral-border flex justify-between items-center bg-background-dark/50">
          <h2 className="text-lg font-bold text-slate-100">Manage Categories</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="flex-1 bg-background-dark border border-neutral-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary"
            />
            <button type="submit" disabled={loading || !newCategoryName} className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50">
              Add
            </button>
          </form>

          <div className="bg-background-dark/50 rounded-lg border border-neutral-border max-h-60 overflow-y-auto">
            {categories.map(c => (
              <div key={c.id} className="flex justify-between items-center px-4 py-3 border-b border-neutral-border last:border-0 hover:bg-white/5">
                <span className="text-sm font-medium text-slate-200">{c.name}</span>
                <button onClick={() => handleDeleteCategory(c.id)} className="p-1 text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">No categories found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadCaptureModal({ product, settings, onClose, lang }: { product: Product, settings: AppSettings | null, onClose: () => void, lang: 'en' | 'es' }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);

    try {
      // 1. Save Lead
      await fetch('/api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, product_name: product.name })
      });

      // 2. Redirect to WhatsApp
      const waNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '';
      const message = `${t(lang, 'hello_whatsapp')} ${product.name} (RD$ ${product.price})`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-neutral-dark border border-neutral-border p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary hover:bg-white/5 rounded-full transition-colors">
          <X className="size-5" />
        </button>
        <div className="mb-8">
          <div className="p-3 bg-primary/20 text-primary w-fit rounded-xl mb-4">
            <MessageSquare className="size-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{lang === 'es' ? '¡Ya casi es tuyo!' : 'Almost yours!'}</h2>
          <p className="text-slate-400 text-sm">{lang === 'es' ? 'Déjanos tu nombre y número para enviarte los detalles de pago y envío por WhatsApp.' : 'Leave us your name and number to send you payment and shipping details via WhatsApp.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-400">{lang === 'es' ? 'Tu Nombre' : 'Your Name'}</span>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 placeholder:text-slate-600" placeholder={lang === 'es' ? 'Ej. Juan Pérez' : 'Ex. John Doe'} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-400">{lang === 'es' ? 'Tu WhatsApp' : 'Your WhatsApp'}</span>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background-dark border border-neutral-border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-100 placeholder:text-slate-600" placeholder={lang === 'es' ? 'Ej. 809-555-5555' : 'Ex. +1 555-555-5555'} />
          </label>
          <button type="submit" disabled={loading} className="mt-4 bg-[#25D366] hover:bg-[#25D366]/90 text-background-dark py-3.5 rounded-lg text-sm font-bold w-full transition-transform active:scale-95 shadow-lg shadow-[#25D366]/20 uppercase tracking-widest disabled:opacity-50 flex justify-center items-center gap-2">
            <MessageSquare className="size-5" /> {lang === 'es' ? 'Continuar al Chat' : 'Continue to Chat'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
