"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Link as LinkIcon, User, Wrench } from "lucide-react";
import { AboutPanel } from "../../components/admin/AboutPanel";
import { AdminBottomNav } from "../../components/admin/AdminBottomNav";
import { AdminLoadingScreen } from "../../components/admin/AdminLoadingScreen";
import { AdminMobileHeader } from "../../components/admin/AdminMobileHeader";
import { AdminNotice } from "../../components/admin/AdminNotice";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { PortfolioPanel } from "../../components/admin/PortfolioPanel";
import { ServicesPanel } from "../../components/admin/ServicesPanel";
import { SocialsPanel } from "../../components/admin/SocialsPanel";
import { getErrorMessage } from "../../lib/errors";
import { supabase } from "../../lib/supabase";
import { isValidExternalUrl, normalizeExternalUrl } from "../../lib/url";
import type {
  AboutMe,
  ActiveTab,
  EditableTable,
  ItemWithId,
  MenuItem,
  Notice,
  NoticeType,
  PortfolioItem,
  PortfolioMediaType,
  ServiceItem,
  SocialLink,
} from "../../types/content";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("about");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

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
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

  const showNotice = useCallback((type: NoticeType, message: string) => {
    setNotice({ type, message });
  }, []);

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
        supabase.from("about_me").select("*").maybeSingle(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("services").select("*"),
      ]);

      if (aboutRes.error) throw aboutRes.error;
      if (socialRes.error) throw socialRes.error;
      if (portRes.error) throw portRes.error;
      if (servRes.error) throw servRes.error;

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
    } catch (error) {
      showNotice(
        "error",
        `Gagal memuat data admin: ${getErrorMessage(error)}`,
      );
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    void checkUser();

    const fetchTimer = window.setTimeout(() => {
      void fetchAllData();
    }, 0);

    return () => window.clearTimeout(fetchTimer);
  }, [checkUser, fetchAllData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    if (!isSidebarOpen) return undefined;

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { id: "about", label: "Profil", icon: <User size={20} /> },
      { id: "socials", label: "Socials", icon: <LinkIcon size={20} /> },
      { id: "portfolio", label: "Karya", icon: <Briefcase size={20} /> },
      { id: "services", label: "Layanan", icon: <Wrench size={20} /> },
    ],
    [],
  );

  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
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
      showNotice("error", "Gagal logout. Coba ulangi beberapa saat lagi.");
      return;
    }

    router.push("/admin/login");
  };

  const handleSaveAbout = async () => {
    if (!headline.trim() || !description.trim()) {
      showNotice("error", "Headline dan deskripsi bio wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const { data: existing, error: selectError } = await supabase
        .from("about_me")
        .select("id")
        .maybeSingle();

      if (selectError) throw selectError;

      const payload = {
        headline: headline.trim(),
        description: description.trim(),
        banner_url: bannerUrl.trim(),
      };

      if (existing) {
        const { error } = await supabase
          .from("about_me")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_me").insert([payload]);

        if (error) throw error;
      }

      showNotice("success", "Profil berhasil diperbarui.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan profil: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    if (!newSocialTitle.trim() || !newSocialUrl.trim()) {
      showNotice("error", "Nama dan link sosial media wajib diisi.");
      return;
    }

    const normalizedUrl = normalizeExternalUrl(newSocialUrl);

    if (!isValidExternalUrl(normalizedUrl)) {
      showNotice("error", "Link sosial media harus berupa URL yang valid.");
      return;
    }

    const payload = {
      title: newSocialTitle.trim(),
      url: normalizedUrl,
    };

    setSaving(true);

    try {
      if (editingSocialId !== null) {
        const { data, error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", editingSocialId)
          .select()
          .single();

        if (error) throw error;

        const updatedSocial = data as SocialLink | null;

        if (!updatedSocial) {
          throw new Error("Data social yang diperbarui tidak ditemukan.");
        }

        setSocials((current) =>
          current.map((social) =>
            social.id === updatedSocial.id ? updatedSocial : social,
          ),
        );
        resetSocialForm();
        showNotice("success", "Social berhasil diperbarui.");
        return;
      }

      const { data, error } = await supabase
        .from("social_links")
        .insert([payload])
        .select();

      if (error) throw error;

      const newSocial = data?.[0] as SocialLink | undefined;

      if (!newSocial) {
        throw new Error("Data social baru tidak berhasil dikembalikan.");
      }

      setSocials((current) => [...current, newSocial]);
      resetSocialForm();
      showNotice("success", "Social berhasil ditambahkan.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan social: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSocial = (social: SocialLink) => {
    setEditingSocialId(social.id);
    setNewSocialTitle(social.title || "");
    setNewSocialUrl(social.url || "");
    setNotice(null);
  };

  const handleSavePortfolio = async () => {
    if (!pTitle.trim() || !pDriveId.trim()) {
      showNotice("error", "Judul karya dan ID media wajib diisi.");
      return;
    }

    const payload = {
      title: pTitle.trim(),
      description: pDesc.trim(),
      tags: pTags.trim(),
      media_url: pDriveId.trim(),
      media_type: pMediaType,
    };

    setSaving(true);

    try {
      if (editingPortfolioId !== null) {
        const { data, error } = await supabase
          .from("portfolio")
          .update(payload)
          .eq("id", editingPortfolioId)
          .select()
          .single();

        if (error) throw error;

        const updatedPortfolio = data as PortfolioItem | null;

        if (!updatedPortfolio) {
          throw new Error("Data karya yang diperbarui tidak ditemukan.");
        }

        setPortfolios((current) =>
          current.map((portfolio) =>
            portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio,
          ),
        );
        resetPortfolioForm();
        showNotice("success", "Karya berhasil diperbarui.");
        return;
      }

      const { data, error } = await supabase
        .from("portfolio")
        .insert([payload])
        .select();

      if (error) throw error;

      const newPortfolio = data?.[0] as PortfolioItem | undefined;

      if (!newPortfolio) {
        throw new Error("Data karya baru tidak berhasil dikembalikan.");
      }

      setPortfolios((current) => [newPortfolio, ...current]);
      resetPortfolioForm();
      showNotice("success", "Karya berhasil ditambahkan.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan karya: ${getErrorMessage(error)}`);
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
    setNotice(null);
  };

  const handleSaveService = async () => {
    if (!sTitle.trim() || !sTargetUrl.trim()) {
      showNotice("error", "Judul layanan dan link target wajib diisi.");
      return;
    }

    const normalizedUrl = normalizeExternalUrl(sTargetUrl);

    if (!isValidExternalUrl(normalizedUrl)) {
      showNotice("error", "Link target layanan harus berupa URL yang valid.");
      return;
    }

    const payload = {
      title: sTitle.trim(),
      description: sDescription.trim(),
      image_url: sDriveId.trim(),
      target_url: normalizedUrl,
    };

    setSaving(true);

    try {
      if (editingServiceId !== null) {
        const { data, error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", editingServiceId)
          .select()
          .single();

        if (error) throw error;

        const updatedService = data as ServiceItem | null;

        if (!updatedService) {
          throw new Error("Data layanan yang diperbarui tidak ditemukan.");
        }

        setServices((current) =>
          current.map((service) =>
            service.id === updatedService.id ? updatedService : service,
          ),
        );
        resetServiceForm();
        showNotice("success", "Layanan berhasil diperbarui.");
        return;
      }

      const { data, error } = await supabase
        .from("services")
        .insert([payload])
        .select();

      if (error) throw error;

      const newService = data?.[0] as ServiceItem | undefined;

      if (!newService) {
        throw new Error("Data layanan baru tidak berhasil dikembalikan.");
      }

      setServices((current) => [...current, newService]);
      resetServiceForm();
      showNotice("success", "Layanan berhasil ditambahkan.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan layanan: ${getErrorMessage(error)}`);
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
    setNotice(null);
  };

  const deleteItem = async <T extends ItemWithId>(
    table: EditableTable,
    id: number,
    setState: Dispatch<SetStateAction<T[]>>,
  ) => {
    if (!confirm("Hapus data ini?")) return;

    setSaving(true);

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;

      setState((current) => current.filter((item) => item.id !== id));
      showNotice("success", "Data berhasil dihapus.");
    } catch (error) {
      showNotice("error", `Gagal menghapus data: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      <AdminMobileHeader
        focusRing={focusRing}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onSignOut={handleSignOut}
      />

      <AdminSidebar
        activeTab={activeTab}
        focusRing={focusRing}
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        onChangeTab={changeTab}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onSignOut={handleSignOut}
      />

      <main className="lg:ml-72 min-h-screen p-6 md:p-12 pt-24 lg:pt-12">
        <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
          <AdminNotice
            focusRing={focusRing}
            notice={notice}
            onClose={() => setNotice(null)}
          />

          {activeTab === "about" && (
            <AboutPanel
              bannerUrl={bannerUrl}
              description={description}
              focusRing={focusRing}
              headline={headline}
              saving={saving}
              setBannerUrl={setBannerUrl}
              setDescription={setDescription}
              setHeadline={setHeadline}
              onSave={handleSaveAbout}
            />
          )}

          {activeTab === "socials" && (
            <SocialsPanel
              editingSocialId={editingSocialId}
              focusRing={focusRing}
              newSocialTitle={newSocialTitle}
              newSocialUrl={newSocialUrl}
              saving={saving}
              socials={socials}
              setNewSocialTitle={setNewSocialTitle}
              setNewSocialUrl={setNewSocialUrl}
              onCancelEdit={resetSocialForm}
              onDeleteSocial={(social) => {
                void deleteItem<SocialLink>(
                  "social_links",
                  social.id,
                  setSocials,
                );
              }}
              onEditSocial={handleEditSocial}
              onSaveSocial={handleSaveSocial}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioPanel
              editingPortfolioId={editingPortfolioId}
              focusRing={focusRing}
              pDesc={pDesc}
              pDriveId={pDriveId}
              pMediaType={pMediaType}
              portfolios={portfolios}
              pTags={pTags}
              pTitle={pTitle}
              saving={saving}
              setPDesc={setPDesc}
              setPDriveId={setPDriveId}
              setPMediaType={setPMediaType}
              setPTags={setPTags}
              setPTitle={setPTitle}
              onCancelEdit={resetPortfolioForm}
              onDeletePortfolio={(portfolio) => {
                void deleteItem<PortfolioItem>(
                  "portfolio",
                  portfolio.id,
                  setPortfolios,
                );
              }}
              onEditPortfolio={handleEditPortfolio}
              onSavePortfolio={handleSavePortfolio}
            />
          )}

          {activeTab === "services" && (
            <ServicesPanel
              editingServiceId={editingServiceId}
              focusRing={focusRing}
              saving={saving}
              services={services}
              sDescription={sDescription}
              sDriveId={sDriveId}
              setSDescription={setSDescription}
              setSDriveId={setSDriveId}
              setSTargetUrl={setSTargetUrl}
              setSTitle={setSTitle}
              sTargetUrl={sTargetUrl}
              sTitle={sTitle}
              onCancelEdit={resetServiceForm}
              onDeleteService={(service) => {
                void deleteItem<ServiceItem>(
                  "services",
                  service.id,
                  setServices,
                );
              }}
              onEditService={handleEditService}
              onSaveService={handleSaveService}
            />
          )}
        </div>
      </main>

      <AdminBottomNav
        activeTab={activeTab}
        focusRing={focusRing}
        menuItems={menuItems}
        onChangeTab={setActiveTab}
      />
    </div>
  );
}
