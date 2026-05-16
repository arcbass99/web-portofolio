"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LogOut, User, Image as ImageIcon, Briefcase, 
  Plus, Trash2, Link as LinkIcon, Loader2, Wrench, Globe, Film, Menu, X, ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk Mobile Sidebar
  
  // States Data
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [socials, setSocials] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // UI States Input
  const [newSocialTitle, setNewSocialTitle] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pTags, setPTags] = useState("");
  const [pDriveId, setPDriveId] = useState("");
  const [pMediaType, setPMediaType] = useState("image");
  
  // Services Input States
  const [sTitle, setSTitle] = useState("");
  const [sDriveId, setSDriveId] = useState("");
  const [sTargetUrl, setSTargetUrl] = useState("");
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/admin/login");
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const { data: aboutData } = await supabase.from("about_me").select("*").single();
      if (aboutData) {
        setHeadline(aboutData.headline || "");
        setDescription(aboutData.description || "");
        setBannerUrl(aboutData.banner_url || "");
      }
      const { data: socialData } = await supabase.from("social_links").select("*");
      if (socialData) setSocials(socialData);
      const { data: portData } = await supabase.from("portfolio").select("*").order('created_at', { ascending: false });
      if (portData) setPortfolios(portData);
      const { data: servData } = await supabase.from("services").select("*");
      if (servData) setServices(servData);
    } finally {
      setLoading(false);
    }
  }

  const formatMediaUrl = (idOrUrl: string) => {
    if (!idOrUrl) return "";
    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) return idOrUrl;
    return `https://drive.google.com/thumbnail?sz=w600&id=${idOrUrl}`;
  };

  async function handleSaveAbout() {
    setSaving(true);
    const { data: existing } = await supabase.from("about_me").select("id").single();
    const payload = { headline, description, banner_url: bannerUrl };
    if (existing) {
      await supabase.from("about_me").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("about_me").insert([payload]);
    }
    setSaving(false);
    alert("Profil diperbarui!");
  }

  async function handleAddPortfolio() {
    if (!pTitle || !pDriveId) return alert("Wajib isi Judul & ID Media!");
    setSaving(true);
    const { data } = await supabase.from("portfolio").insert([
      { title: pTitle, description: pDesc, tags: pTags, media_url: pDriveId, media_type: pMediaType }
    ]).select();
    if (data) { 
      setPortfolios([data[0], ...portfolios]); 
      setPTitle(""); setPDesc(""); setPTags(""); setPDriveId(""); 
    }
    setSaving(false);
  }

  async function handleAddService() {
    if (!sTitle || !sTargetUrl) return alert("Wajib isi Judul & Link!");
    setSaving(true);
    const { data } = await supabase.from("services").insert([
      { title: sTitle, image_url: sDriveId, target_url: sTargetUrl }
    ]).select();
    if (data) { 
      setServices([...services, data[0]]); 
      setSTitle(""); setSDriveId(""); setSTargetUrl(""); 
    }
    setSaving(false);
  }

  async function deleteItem(table: string, id: number, state: any[], setState: any) {
    if (!confirm("Hapus data ini?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) setState(state.filter(item => item.id !== id));
  }

  const menuItems = [
    { id: "about", label: "Profil", icon: <User size={20} /> },
    { id: "socials", label: "Socials", icon: <LinkIcon size={20} /> },
    { id: "portfolio", label: "Karya", icon: <Briefcase size={20} /> },
    { id: "services", label: "Layanan", icon: <Wrench size={20} /> },
  ];

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin text-cyan-400 mb-4" size={40} /><p className="font-bold tracking-widest text-xs uppercase opacity-50">Menyiapkan Console...</p></div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      
      {/* MOBILE TOP BAR */}
      <header className="lg:hidden fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-400"><Menu size={24} /></button>
          <h2 className="font-black tracking-tighter text-lg">NAFIS<span className="text-cyan-400">.</span>ADMIN</h2>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }} className="text-red-400"><LogOut size={20}/></button>
      </header>

      {/* OVERLAY SIDEBAR (MOBILE) & FIXED SIDEBAR (DESKTOP) */}
      <div className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tighter">CONSOLE<span className="text-cyan-400">.</span></h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><X size={20}/></button>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.id ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <div className="flex items-center gap-3">{item.icon} <span className="font-bold text-sm">{item.label}</span></div>
                <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === item.id ? "opacity-100" : ""}`} />
              </button>
            ))}
          </nav>

          <button onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }} className="flex items-center gap-3 text-slate-500 hover:text-red-400 p-4 mt-auto transition font-bold text-sm">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="lg:ml-72 min-h-screen p-6 md:p-12 pt-24 lg:pt-12">
        <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
          
          {/* TAB: ABOUT ME */}
          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-2 text-white">Profil Utama</h1>
              <p className="text-slate-500 text-sm md:text-base mb-8">Kelola identitas dan teks utama di landing page.</p>
              
              <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block">ID Google Drive Banner</label>
                      <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-sm" placeholder="Paste ID Drive..." />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block">Headline Utama</label>
                      <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block">Deskripsi Bio</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all h-40 text-sm leading-relaxed" />
                  </div>
                </div>
                <button onClick={handleSaveAbout} disabled={saving} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                  {saving ? "Menyimpan..." : "Update Profil"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: SOCIALS */}
          {activeTab === "socials" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">Media Sosial</h1>
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input value={newSocialTitle} onChange={(e) => setNewSocialTitle(e.target.value)} placeholder="Nama (ex: GitHub)" className="flex-1 bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none text-sm" />
                    <input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="Link URL" className="flex-[2] bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none text-sm" />
                    <button onClick={async () => {
                      const { data } = await supabase.from("social_links").insert([{ title: newSocialTitle, url: newSocialUrl }]).select();
                      if (data) { setSocials([...socials, data[0]]); setNewSocialTitle(""); setNewSocialUrl(""); }
                    }} className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-xs uppercase"><Plus size={18} /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  {socials.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-5 bg-slate-900/30 border border-white/5 rounded-2xl backdrop-blur-sm">
                      <div>
                        <p className="font-bold text-white text-sm">{s.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">{s.url}</p>
                      </div>
                      <button onClick={() => deleteItem('social_links', s.id, socials, setSocials)} className="text-slate-600 hover:text-red-400 p-2 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO (RESPONSIVE GRID) */}
          {activeTab === "portfolio" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">Portfolio</h1>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-4 space-y-4">
                  <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl sticky top-24">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-cyan-500 mb-6">Tambah Karya</h3>
                    <div className="space-y-4">
                      <select value={pMediaType} onChange={(e) => setPMediaType(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none">
                        <option value="image">Gambar</option>
                        <option value="video">Video</option>
                      </select>
                      <input value={pDriveId} onChange={(e) => setPDriveId(e.target.value)} placeholder="ID Drive / Link Gambar" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                      <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Judul Karya" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                      <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Deskripsi Singkat" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none h-24" />
                      <input value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="Tags (ex: Web, UI/UX)" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                      <button onClick={handleAddPortfolio} className="w-full bg-cyan-500 text-slate-900 p-4 rounded-2xl font-black text-xs uppercase tracking-widest">Simpan Karya</button>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolios.map(p => (
                    <div key={p.id} className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden group">
                      <div className="aspect-video bg-slate-800 relative overflow-hidden">
                        {p.media_type === 'video' ? <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={32} /> : <img src={formatMediaUrl(p.media_url)} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <div className="p-5 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white text-sm">{p.title}</h4>
                          <p className="text-[10px] uppercase font-black text-cyan-500 tracking-tighter">{p.tags}</p>
                        </div>
                        <button onClick={() => deleteItem('portfolio', p.id, portfolios, setPortfolios)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === "services" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">Layanan</h1>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-4">
                  <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl space-y-4">
                    <input value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="Nama Jasa" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                    <input value={sDriveId} onChange={(e) => setSDriveId(e.target.value)} placeholder="ID Drive Ikon" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                    <input value={sTargetUrl} onChange={(e) => setSTargetUrl(e.target.value)} placeholder="Link WhatsApp/Order" className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none" />
                    <button onClick={handleAddService} className="w-full bg-cyan-500 text-slate-900 p-4 rounded-2xl font-black text-xs uppercase">Tambah Jasa</button>
                  </div>
                </div>
                <div className="xl:col-span-8 space-y-3">
                  {services.map(s => (
                    <div key={s.id} className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                          {s.image_url ? <img src={formatMediaUrl(s.image_url)} className="w-full h-full object-cover" /> : <Globe size={20} />}
                        </div>
                        <h4 className="font-bold text-sm text-white">{s.title}</h4>
                      </div>
                      <button onClick={() => deleteItem('services', s.id, services, setServices)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (INSTAGRAM STYLE) */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-50 px-2 py-2 flex justify-around items-center">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === item.id ? "text-cyan-400" : "text-slate-500"}`}
          >
            {item.icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}