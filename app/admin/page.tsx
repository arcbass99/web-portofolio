"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Briefcase,
  Plus,
  Trash2,
  Link as LinkIcon,
  Loader2,
  Wrench,
  Globe,
  Film,
  Menu,
  X,
  ChevronRight,
  Pencil,
} from "lucide-react";

type ActiveTab = "about" | "socials" | "portfolio" | "services";
type PortfolioMediaType = "image" | "video";
type EditableTable = "social_links" | "portfolio" | "services";

type AboutMe = {
  id: number;
  headline: string | null;
  description: string | null;
  banner_url: string | null;
};

type SocialLink = {
  id: number;
  title: string | null;
  url: string | null;
};

type PortfolioItem = {
  id: number;
  title: string | null;
  description: string | null;
  tags: string | null;
  media_url: string | null;
  media_type: string | null;
};

type ServiceItem = {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string | null;
  target_url: string | null;
};

type ItemWithId = {
  id: number;
};

type MenuItem = {
  id: ActiveTab;
  label: string;
  icon: ReactNode;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("about");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [newSocialTitle, setNewSocialTitle] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);

  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pTags, setPTags] = useState("");
  const [pDriveId, setPDriveId] = useState("");
  const [pMediaType, setPMediaType] = useState<PortfolioMediaType>("image");
  const [editingPortfolioId, setEditingPortfolioId] = useState<number | null>(
    null,
  );

  const [sTitle, setSTitle] = useState("");
  const [sDescription, setSDescription] = useState("");
  const [sDriveId, setSDriveId] = useState("");
  const [sTargetUrl, setSTargetUrl] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  const checkUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchAllData = useCallback(async () => {
    try {
      const [aboutRes, socialRes, portRes, servRes] = await Promise.all([
        supabase.from("about_me").select("*").single(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("services").select("*"),
      ]);

      const aboutData = aboutRes.data as AboutMe | null;
      const socialData = (socialRes.data || []) as SocialLink[];
      const portfolioData = (portRes.data || []) as PortfolioItem[];
      const serviceData = (servRes.data || []) as ServiceItem[];

      if (aboutData) {
        setHeadline(aboutData.headline || "");
        setDescription(aboutData.description || "");
        setBannerUrl(aboutData.banner_url || "");
      }

      setSocials(socialData);
      setPortfolios(portfolioData);
      setServices(serviceData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, [checkUser, fetchAllData]);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { id: "about", label: "Profil", icon: <User size={20} /> },
      { id: "socials", label: "Socials", icon: <LinkIcon size={20} /> },
      { id: "portfolio", label: "Karya", icon: <Briefcase size={20} /> },
      { id: "services", label: "Layanan", icon: <Wrench size={20} /> },
    ],
    [],
  );

  const formatMediaUrl = (idOrUrl?: string | null) => {
    if (!idOrUrl) return "";

    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) {
      return idOrUrl;
    }

    return `https://drive.google.com/thumbnail?sz=w600&id=${idOrUrl}`;
  };

  const resetSocialForm = () => {
    setNewSocialTitle("");
    setNewSocialUrl("");
    setEditingSocialId(null);
  };

  const resetPortfolioForm = () => {
    setPTitle("");
    setPDesc("");
    setPTags("");
    setPDriveId("");
    setPMediaType("image");
    setEditingPortfolioId(null);
  };

  const resetServiceForm = () => {
    setSTitle("");
    setSDescription("");
    setSDriveId("");
    setSTargetUrl("");
    setEditingServiceId(null);
  };

  const handleSignOut = async () => {
    const confirmed = confirm(
      "Logout dari semua perangkat? Kamu perlu login ulang di semua browser/perangkat yang sedang aktif.",
    );

    if (!confirmed) return;

    const { error } = await supabase.auth.signOut({ scope: "global" });

    if (error) {
      alert("Gagal logout. Coba ulangi beberapa saat lagi.");
      return;
    }

    router.push("/admin/login");
  };

  const handleSaveAbout = async () => {
    setSaving(true);

    try {
      const { data: existing } = await supabase
        .from("about_me")
        .select("id")
        .single();

      const payload = {
        headline,
        description,
        banner_url: bannerUrl,
      };

      if (existing) {
        await supabase.from("about_me").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("about_me").insert([payload]);
      }

      alert("Profil diperbarui!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    if (!newSocialTitle || !newSocialUrl) {
      alert("Wajib isi nama dan link sosial media!");
      return;
    }

    const payload = {
      title: newSocialTitle,
      url: newSocialUrl,
    };

    setSaving(true);

    try {
      if (editingSocialId !== null) {
        const { data } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", editingSocialId)
          .select()
          .single();

        const updatedSocial = data as SocialLink | null;

        if (updatedSocial) {
          setSocials((current) =>
            current.map((social) =>
              social.id === updatedSocial.id ? updatedSocial : social,
            ),
          );
          resetSocialForm();
        }

        return;
      }

      const { data } = await supabase
        .from("social_links")
        .insert([payload])
        .select();

      const newSocial = data?.[0] as SocialLink | undefined;

      if (newSocial) {
        setSocials((current) => [...current, newSocial]);
        resetSocialForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditSocial = (social: SocialLink) => {
    setEditingSocialId(social.id);
    setNewSocialTitle(social.title || "");
    setNewSocialUrl(social.url || "");
  };

  const handleSavePortfolio = async () => {
    if (!pTitle || !pDriveId) {
      alert("Wajib isi Judul & ID Media!");
      return;
    }

    const payload = {
      title: pTitle,
      description: pDesc,
      tags: pTags,
      media_url: pDriveId,
      media_type: pMediaType,
    };

    setSaving(true);

    try {
      if (editingPortfolioId !== null) {
        const { data } = await supabase
          .from("portfolio")
          .update(payload)
          .eq("id", editingPortfolioId)
          .select()
          .single();

        const updatedPortfolio = data as PortfolioItem | null;

        if (updatedPortfolio) {
          setPortfolios((current) =>
            current.map((portfolio) =>
              portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio,
            ),
          );
          resetPortfolioForm();
        }

        return;
      }

      const { data } = await supabase.from("portfolio").insert([payload]).select();
      const newPortfolio = data?.[0] as PortfolioItem | undefined;

      if (newPortfolio) {
        setPortfolios((current) => [newPortfolio, ...current]);
        resetPortfolioForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditPortfolio = (portfolio: PortfolioItem) => {
    setEditingPortfolioId(portfolio.id);
    setPTitle(portfolio.title || "");
    setPDesc(portfolio.description || "");
    setPTags(portfolio.tags || "");
    setPDriveId(portfolio.media_url || "");
    setPMediaType(portfolio.media_type === "video" ? "video" : "image");
  };

  const handleSaveService = async () => {
    if (!sTitle || !sTargetUrl) {
      alert("Wajib isi Judul & Link!");
      return;
    }

    const payload = {
      title: sTitle,
      description: sDescription,
      image_url: sDriveId,
      target_url: sTargetUrl,
    };

    setSaving(true);

    try {
      if (editingServiceId !== null) {
        const { data } = await supabase
          .from("services")
          .update(payload)
          .eq("id", editingServiceId)
          .select()
          .single();

        const updatedService = data as ServiceItem | null;

        if (updatedService) {
          setServices((current) =>
            current.map((service) =>
              service.id === updatedService.id ? updatedService : service,
            ),
          );
          resetServiceForm();
        }

        return;
      }

      const { data } = await supabase.from("services").insert([payload]).select();
      const newService = data?.[0] as ServiceItem | undefined;

      if (newService) {
        setServices((current) => [...current, newService]);
        resetServiceForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setSTitle(service.title || "");
    setSDescription(service.description || "");
    setSDriveId(service.image_url || "");
    setSTargetUrl(service.target_url || "");
  };

  const deleteItem = async <T extends ItemWithId>(
    table: EditableTable,
    id: number,
    setState: Dispatch<SetStateAction<T[]>>,
  ) => {
    if (!confirm("Hapus data ini?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      setState((current) => current.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
        <p className="font-bold tracking-widest text-xs uppercase opacity-50">
          Menyiapkan Console...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      <header className="lg:hidden fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400"
            aria-label="Buka sidebar admin"
          >
            <Menu size={24} />
          </button>

          <h2 className="font-black tracking-tighter text-lg">
            NAFIS<span className="text-cyan-400">.</span>ADMIN
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="text-red-400"
          aria-label="Logout dari semua perangkat"
          title="Logout dari semua perangkat"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tighter">
              CONSOLE<span className="text-cyan-400">.</span>
            </h2>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-500"
              aria-label="Tutup sidebar admin"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1.5 flex-1">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === item.id
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-bold text-sm">{item.label}</span>
                </div>

                <ChevronRight
                  size={16}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    activeTab === item.id ? "opacity-100" : ""
                  }`}
                />
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 p-4 mt-auto transition font-bold text-sm"
          >
            <LogOut size={20} /> Logout Semua Perangkat
          </button>
        </div>
      </div>

      <main className="lg:ml-72 min-h-screen p-6 md:p-12 pt-24 lg:pt-12">
        <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-2 text-white">
                Profil Utama
              </h1>
              <p className="text-slate-500 text-sm md:text-base mb-8">
                Kelola identitas dan teks utama di landing page.
              </p>

              <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        htmlFor="bannerUrl"
                        className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                      >
                        ID Google Drive Banner
                      </label>
                      <input
                        id="bannerUrl"
                        value={bannerUrl}
                        onChange={(event) => setBannerUrl(event.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-sm"
                        placeholder="Paste ID Drive..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="headline"
                        className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                      >
                        Headline Utama
                      </label>
                      <input
                        id="headline"
                        value={headline}
                        onChange={(event) => setHeadline(event.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                    >
                      Deskripsi Bio
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all h-40 text-sm leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAbout}
                  disabled={saving}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Update Profil"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">
                Media Sosial
              </h1>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                  {editingSocialId !== null && (
                    <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                        Mode Edit Social
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Kamu sedang mengubah link sosial yang sudah tersimpan.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      value={newSocialTitle}
                      onChange={(event) =>
                        setNewSocialTitle(event.target.value)
                      }
                      placeholder="Nama (ex: GitHub)"
                      className="flex-1 bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none text-sm"
                    />
                    <input
                      value={newSocialUrl}
                      onChange={(event) => setNewSocialUrl(event.target.value)}
                      placeholder="Link URL"
                      className="flex-[2] bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSaveSocial}
                      disabled={saving}
                      className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-xs uppercase disabled:opacity-50"
                      aria-label={
                        editingSocialId !== null
                          ? "Simpan perubahan sosial media"
                          : "Tambah sosial media"
                      }
                    >
                      {editingSocialId !== null ? "Simpan" : <Plus size={18} />}
                    </button>
                  </div>

                  {editingSocialId !== null && (
                    <button
                      type="button"
                      onClick={resetSocialForm}
                      disabled={saving}
                      className="mt-4 w-full bg-white/5 hover:bg-white/10 text-slate-300 p-4 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {socials.map((social) => (
                    <div
                      key={social.id}
                      className="flex items-center justify-between gap-4 p-5 bg-slate-900/30 border border-white/5 rounded-2xl backdrop-blur-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm">
                          {social.title || "Untitled Social"}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
                          {social.url || "-"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditSocial(social)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
                          aria-label={`Edit ${social.title || "social link"}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteItem<SocialLink>(
                              "social_links",
                              social.id,
                              setSocials,
                            )
                          }
                          className="text-slate-600 hover:text-red-400 p-2 transition-colors"
                          aria-label={`Hapus ${social.title || "social link"}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">
                Portfolio
              </h1>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-4 space-y-4">
                  <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl sticky top-24">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-cyan-500 mb-6">
                      {editingPortfolioId !== null
                        ? "Edit Karya"
                        : "Tambah Karya"}
                    </h3>

                    {editingPortfolioId !== null && (
                      <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                          Mode Edit Karya
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Kamu sedang mengubah data karya yang sudah tersimpan.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <select
                        value={pMediaType}
                        onChange={(event) =>
                          setPMediaType(
                            event.target.value as PortfolioMediaType,
                          )
                        }
                        aria-label="Pilih tipe media portfolio"
                        title="Pilih tipe media portfolio"
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                      >
                        <option value="image">Gambar</option>
                        <option value="video">Video</option>
                      </select>

                      <input
                        value={pDriveId}
                        onChange={(event) => setPDriveId(event.target.value)}
                        placeholder="ID Drive / Link Gambar"
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                      />
                      <input
                        value={pTitle}
                        onChange={(event) => setPTitle(event.target.value)}
                        placeholder="Judul Karya"
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                      />
                      <textarea
                        value={pDesc}
                        onChange={(event) => setPDesc(event.target.value)}
                        placeholder="Deskripsi Singkat"
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none h-24"
                      />
                      <input
                        value={pTags}
                        onChange={(event) => setPTags(event.target.value)}
                        placeholder="Tags (ex: Web, UI/UX)"
                        className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                      />

                      <button
                        type="button"
                        onClick={handleSavePortfolio}
                        disabled={saving}
                        className="w-full bg-cyan-500 text-slate-900 p-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                      >
                        {editingPortfolioId !== null
                          ? "Simpan Perubahan"
                          : "Simpan Karya"}
                      </button>

                      {editingPortfolioId !== null && (
                        <button
                          type="button"
                          onClick={resetPortfolioForm}
                          disabled={saving}
                          className="w-full bg-white/5 hover:bg-white/10 text-slate-300 p-4 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50"
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden group"
                    >
                      <div className="aspect-video bg-slate-800 relative overflow-hidden">
                        {portfolio.media_type === "video" ? (
                          <Film
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
                            size={32}
                          />
                        ) : (
                          <img
                            src={formatMediaUrl(portfolio.media_url)}
                            alt={portfolio.title || "Preview portfolio"}
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                      </div>

                      <div className="p-5 flex justify-between items-center gap-4">
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">
                            {portfolio.title || "Untitled Project"}
                          </h4>
                          <p className="text-[10px] uppercase font-black text-cyan-500 tracking-tighter truncate">
                            {portfolio.tags || "Project"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditPortfolio(portfolio)}
                            className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
                            aria-label={`Edit ${
                              portfolio.title || "portfolio"
                            }`}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteItem<PortfolioItem>(
                                "portfolio",
                                portfolio.id,
                                setPortfolios,
                              )
                            }
                            className="text-slate-600 hover:text-red-400 transition-colors p-2"
                            aria-label={`Hapus ${
                              portfolio.title || "portfolio"
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">
                Layanan
              </h1>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-4">
                  <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl space-y-4">
                    {editingServiceId !== null && (
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                          Mode Edit Layanan
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Kamu sedang mengubah data layanan yang sudah tersimpan.
                        </p>
                      </div>
                    )}

                    <input
                      value={sTitle}
                      onChange={(event) => setSTitle(event.target.value)}
                      placeholder="Nama Jasa"
                      className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                    />
                    <textarea
                      value={sDescription}
                      onChange={(event) => setSDescription(event.target.value)}
                      placeholder="Deskripsi singkat layanan"
                      className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none h-28 resize-none"
                    />
                    <input
                      value={sDriveId}
                      onChange={(event) => setSDriveId(event.target.value)}
                      placeholder="ID Drive Ikon"
                      className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                    />
                    <input
                      value={sTargetUrl}
                      onChange={(event) => setSTargetUrl(event.target.value)}
                      placeholder="Link WhatsApp/Order"
                      className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none"
                    />

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleSaveService}
                        disabled={saving}
                        className="w-full bg-cyan-500 text-slate-900 p-4 rounded-2xl font-black text-xs uppercase disabled:opacity-50"
                      >
                        {editingServiceId !== null
                          ? "Simpan Perubahan"
                          : "Tambah Jasa"}
                      </button>

                      {editingServiceId !== null && (
                        <button
                          type="button"
                          onClick={resetServiceForm}
                          disabled={saving}
                          className="w-full bg-white/5 hover:bg-white/10 text-slate-300 p-4 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50"
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-8 space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          {service.image_url ? (
                            <img
                              src={formatMediaUrl(service.image_url)}
                              alt={service.title || "Ikon layanan"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Globe size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white">
                            {service.title || "Untitled Service"}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                            {service.description || "Belum ada deskripsi."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditService(service)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors p-2"
                          aria-label={`Edit ${service.title || "layanan"}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteItem<ServiceItem>(
                              "services",
                              service.id,
                              setServices,
                            )
                          }
                          className="text-slate-600 hover:text-red-400 transition-colors p-2"
                          aria-label={`Hapus ${service.title || "layanan"}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-50 px-2 py-2 flex justify-around items-center">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === item.id ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}