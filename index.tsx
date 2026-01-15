
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { 
  Package, 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Loader2,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// --- Configuration & Initialization ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Placeholder for user's specific backend URLs - easily swappable
const BACKEND_CONFIG = {
  PRODUCTS_API: 'https://api.msprods.example.com/products',
  ANALYTICS_API: 'https://api.msprods.example.com/analytics',
  SECURE_AUTH: 'https://auth.msprods.example.com'
};

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  status: 'Active' | 'Draft' | 'Archived';
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Quantum Series X', category: 'Hardware', price: 1299, description: 'High-performance processing unit for edge computing.', status: 'Active' },
  { id: '2', name: 'Nova Cloud License', category: 'SaaS', price: 49, description: 'Monthly subscription for neural network training.', status: 'Active' },
  { id: '3', name: 'MS-Pro Controller', category: 'Accessories', price: 199, description: 'Ergonomic input device for precision engineering.', status: 'Draft' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'generator' | 'chat'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // --- Gemini Operations ---

  const generateProductCopy = async (productName: string) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional, high-converting marketing description for a product named "${productName}" from MSProds. Focus on innovation and reliability.`,
        config: {
          systemInstruction: "You are a world-class copywriter for MSProds, a high-tech manufacturing and software company.",
          temperature: 0.7,
        }
      });
      setAiResponse(response.text || 'Failed to generate copy.');
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Error connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockup = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A professional product mockup for MSProds: ${prompt}. Minimalist, high-tech, studio lighting, 4k.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Image AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderers ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-slate-400">Welcome back to MSProds Central Command.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
            <RefreshCw size={18} /> Sync
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">$142,500</p>
            </div>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[75%]"></div>
          </div>
          <p className="text-xs text-indigo-400 mt-2 font-medium">+12% from last month</p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Products</p>
              <p className="text-2xl font-bold text-white">482</p>
            </div>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[92%]"></div>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-medium">92% inventory health</p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Security Status</p>
              <p className="text-2xl font-bold text-white">Encrypted</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold rounded">SSL Active</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] uppercase font-bold rounded">Firewall Up</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
            <h3 className="font-bold text-white">Recent Transactions</h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
          </div>
          <div className="divide-y divide-slate-700/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Client Order #00{i}</p>
                    <p className="text-xs text-slate-400">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">$2,450.00</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <h3 className="font-bold text-white mb-4">AI Business Suggestion</h3>
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl">
            <div className="flex gap-3 text-indigo-400 mb-2">
              <MessageSquare size={20} />
              <span className="font-semibold text-sm">Gemini Insight</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on recent trends, your "Nova Cloud" segment is showing high growth potential in the EU market. Consider increasing marketing allocation by 15% next quarter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Catalog</h2>
          <p className="text-slate-400">Manage and sync MSProds inventory.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-700/10 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{p.category}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-200">${p.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => generateProductCopy(p.name)}
                      className="p-2 bg-indigo-500/10 text-indigo-400 rounded hover:bg-indigo-500 hover:text-white transition-all"
                      title="Generate Copy"
                    >
                      <Zap size={14} />
                    </button>
                    <button className="p-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-all">
                      <Settings size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAICenter = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-indigo-400" size={20} />
            Marketing Copy Generator
          </h3>
          <p className="text-sm text-slate-400 mb-6">Enter a product name to generate world-class descriptions using Gemini AI.</p>
          
          <div className="flex gap-2 mb-6">
            <input 
              id="productInput"
              type="text" 
              placeholder="e.g. UltraProcessor Z1" 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              onClick={() => {
                const val = (document.getElementById('productInput') as HTMLInputElement).value;
                if(val) generateProductCopy(val);
              }}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate'}
            </button>
          </div>

          <div className="min-h-[200px] bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            {aiResponse ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                <button className="mt-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Apply to Product <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                <p>Waiting for generation...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="text-emerald-400" size={20} />
            Visual Asset Creator
          </h3>
          <div className="flex gap-2 mb-6">
            <input 
              id="imageInput"
              type="text" 
              placeholder="e.g. futuristic solar panel" 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button 
              onClick={() => {
                const val = (document.getElementById('imageInput') as HTMLInputElement).value;
                if(val) generateMockup(val);
              }}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create'}
            </button>
          </div>

          <div className="aspect-square bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-center overflow-hidden">
            {generatedImage ? (
              <img src={generatedImage} alt="Generated Asset" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                  <ImageIcon size={32} />
                </div>
                <p className="text-slate-600 italic">No image generated yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800/50 p-6 flex flex-col backdrop-blur-3xl fixed inset-y-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl text-white tracking-tighter">MSPRODS</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Core</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Package} 
            label="Inventory" 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
          />
          <SidebarItem 
            icon={Zap} 
            label="AI Center" 
            active={activeTab === 'generator'} 
            onClick={() => setActiveTab('generator')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Support Bot" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-4">
          <div className="bg-indigo-600/10 rounded-xl p-4 border border-indigo-500/20">
            <p className="text-xs font-bold text-indigo-400 uppercase mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">Operational</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-between text-slate-500 hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Settings size={14} />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </div>
            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'generator' && renderAICenter()}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-80px)] bg-slate-800/50 rounded-3xl border border-slate-700/50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
             <div className="p-6 border-b border-slate-700/50 bg-slate-900/30">
               <h2 className="font-bold text-white flex items-center gap-2">
                 <MessageSquare className="text-indigo-400" size={20} />
                 MSProds AI Assistant
               </h2>
             </div>
             <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col justify-end italic text-slate-500 text-center">
                <p>Chat module initialized. How can I help with MSProds today?</p>
             </div>
             <div className="p-6 bg-slate-900/50">
               <div className="flex gap-2">
                 <input type="text" placeholder="Type your inquiry..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                 <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold">Send</button>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
