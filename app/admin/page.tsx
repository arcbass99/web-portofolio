"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LogOut, User, Image as ImageIcon, Briefcase, 
  Plus, Trash2, Link as LinkIcon, Loader2, Wrench, Globe, Film
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  
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
    setLoading(false);
  }

  // Fungsi pintar untuk pratinjau gambar Google Drive atau Link Langsung (ImgBB / Postimages)
  const formatMediaUrl = (idOrUrl: string) => {
    if (!idOrUrl) return "";
    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) {
      return idOrUrl;
    }
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
    alert("Profil berhasil diperbarui!");
  }

  async function handleAddPortfolio() {
    if (!pTitle || !pDriveId) return alert("Judul dan Media URL/ID wajib diisi!");
    setSaving(true);
    const { data } = await supabase.from("portfolio").insert([
      { title: pTitle, description: pDesc, tags: pTags, media_url: pDriveId, media_type: pMediaType }
    ]).select();
    if (data) { 
      setPortfolios([data[0], ...portfolios]); 
      setPTitle(""); setPDesc(""); setPTags(""); setPDriveId(""); 
      alert("Portfolio disimpan!"); 
    }
    setSaving(false);
  }

  async function handleAddService() {
    if (!sTitle || !sTargetUrl) return alert("Judul Layanan dan Link Tujuan wajib diisi!");
    setSaving(true);
    const { data } = await supabase.from("services").insert([
      { title: sTitle, image_url: sDriveId, target_url: sTargetUrl }
    ]).select();
    if (data) { 
      setServices([...services, data[0]]); 
      setSTitle(""); setSDriveId(""); setSTargetUrl(""); 
      alert("Layanan berhasil ditambahkan!"); 
    }
    setSaving(false);
  }

  async function deleteItem(table: string, id: number, state: any[], setState: any) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) setState(state.filter(item => item.id !== id));
  }

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600 mb-4" size={40} /><p className="text-slate-500 font-medium">Sinkronisasi Konsol...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col sticky h-screen top-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg">N</div>
          <h2 className="text-xl font-bold tracking-tight">Console Admin</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab("about")} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "about" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}><User size={20} /> <span className="font-medium">Profil Utama</span></button>
          <button onClick={() => setActiveTab("socials")} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "socials" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}><LinkIcon size={20} /> <span className="font-medium">Media Sosial</span></button>
          <button onClick={() => setActiveTab("portfolio")} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "portfolio" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}><Briefcase size={20} /> <span className="font-medium">Portfolio</span></button>
          <button onClick={() => setActiveTab("services")} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === "services" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}><Wrench size={20} /> <span className="font-medium">Layanan / Jasa</span></button>
        </nav>
        <button onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }} className="flex items-center gap-3 text-red-400 hover:text-red-300 p-4 mt-auto transition"><LogOut size={20} /> <span className="font-medium">Logout</span></button>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-12 overflow-y-auto">
        
        {/* TAB ABOUT ME */}
        {activeTab === "about" && (
          <div className="max-w-4xl animate-in fade-in duration-300">
            <h1 className="text-4xl font-black text-slate-800 mb-2">Profil Utama</h1>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mt-8 space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">ID Google Drive / Link Langsung Foto Banner</label>
                <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Masukkan ID Drive atau Link Gambar langsung" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Headline</label>
                <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Headline" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Deskripsi Bio</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-44 outline-none" placeholder="Bio..." />
              </div>
              <button onClick={handleSaveAbout} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">SIMPAN PERUBAHAN</button>
            </div>
          </div>
        )}

        {/* TAB SOCIALS */}
        {activeTab === "socials" && (
          <div className="max-w-4xl animate-in fade-in duration-300">
            <h1 className="text-4xl font-black text-slate-800 mb-10">Media Sosial</h1>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-5 gap-4 mb-10">
                <input value={newSocialTitle} onChange={(e) => setNewSocialTitle(e.target.value)} placeholder="Nama (ex: GitHub)" className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="URL Lengkap" className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <button onClick={async () => {
                  const { data } = await supabase.from("social_links").insert([{ title: newSocialTitle, url: newSocialUrl }]).select();
                  if (data) { setSocials([...socials, data[0]]); setNewSocialTitle(""); setNewSocialUrl(""); }
                }} className="bg-slate-900 text-white rounded-2xl flex items-center justify-center"><Plus /></button>
              </div>
              <div className="space-y-3">
                {socials.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800">{s.title} — <span className="font-normal text-slate-400">{s.url}</span></span>
                    <button onClick={() => deleteItem('social_links', s.id, socials, setSocials)} className="text-red-400 p-2"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB PORTFOLIO */}
        {activeTab === "portfolio" && (
          <div className="max-w-6xl animate-in fade-in duration-300">
            <h1 className="text-4xl font-black text-slate-800 mb-10">Portfolio</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Plus size={18} /> Tambah Karya</h3>
                <select value={pMediaType} onChange={(e) => setPMediaType(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm">
                  <option value="image">Gambar / Desain</option>
                  <option value="video">Video / Motion</option>
                </select>
                <input value={pDriveId} onChange={(e) => setPDriveId(e.target.value)} placeholder="ID Google Drive / Link Gambar Langsung" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Judul Karya" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Deskripsi" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm h-24" />
                <input value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="Tags (Web, Design)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <button onClick={handleAddPortfolio} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg">SIMPAN KARYA</button>
              </div>
              
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolios.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="h-48 bg-slate-900 flex items-center justify-center overflow-hidden relative">
                      {p.media_type === 'video' ? (
                        <Film className="text-white/40" size={40} />
                      ) : (
                        <img src={formatMediaUrl(p.media_url)} alt={p.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      <p className="text-xs font-bold text-indigo-500 mb-1 uppercase">{p.tags} ({p.media_type})</p>
                      <h4 className="font-bold text-slate-800 text-lg">{p.title}</h4>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button onClick={() => deleteItem('portfolio', p.id, portfolios, setPortfolios)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB SERVICES */}
        {activeTab === "services" && (
          <div className="max-w-6xl animate-in fade-in duration-300">
            <h1 className="text-4xl font-black text-slate-800 mb-10">Layanan / Jasa</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Plus size={18} /> Tambah Layanan</h3>
                <input value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="Nama Jasa (ex: UI/UX Design)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <input value={sDriveId} onChange={(e) => setSDriveId(e.target.value)} placeholder="ID Drive / Link Langsung Ikon" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <input value={sTargetUrl} onChange={(e) => setSTargetUrl(e.target.value)} placeholder="Link Order (ex: Link WhatsApp)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                <button onClick={handleAddService} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg">TAMBAH LAYANAN</button>
              </div>

              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 overflow-hidden">
                        {s.image_url ? (
                          <img src={formatMediaUrl(s.image_url)} alt="Icon" className="w-full h-full object-cover" />
                        ) : (
                          <Globe size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{s.title}</h4>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{s.target_url}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteItem('services', s.id, services, setServices)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}