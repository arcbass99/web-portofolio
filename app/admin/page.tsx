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
import { Award, Briefcase, Link as LinkIcon, User, Wrench } from "lucide-react";
import { AboutPanel } from "../../components/admin/AboutPanel";
import { AdminBottomNav } from "../../components/admin/AdminBottomNav";
import { AdminLoadingScreen } from "../../components/admin/AdminLoadingScreen";
import { AdminMobileHeader } from "../../components/admin/AdminMobileHeader";
import { AdminNotice } from "../../components/admin/AdminNotice";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { PortfolioPanel } from "../../components/admin/PortfolioPanel";
import { ServicesPanel } from "../../components/admin/ServicesPanel";
import { SocialsPanel } from "../../components/admin/SocialsPanel";
import { TrackRecordPanel } from "../../components/admin/TrackRecordPanel";
import {
  createPortfolio,
  createProfileHighlight,
  createService,
  createSocial,
  deleteAdminItem,
  fetchAdminData,
  getAdminSession,
  saveAbout,
  signOutGlobally,
  updatePortfolio,
  updateProfileHighlight,
  updateService,
  updateSocial,
} from "../../lib/admin-data";
import { ADMIN_FOCUS_RING } from "../../lib/constants";
import { getErrorMessage } from "../../lib/errors";
import { isValidExternalUrl, normalizeExternalUrl } from "../../lib/url";
import type {
  ActiveTab,
  EditableTable,
  ItemWithId,
  MenuItem,
  Notice,
  NoticeType,
  PortfolioItem,
  PortfolioMediaType,
  ProfileHighlight,
  ProfileHighlightCategory,
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
  const [highlights, setHighlights] = useState<ProfileHighlight[]>([]);

  const [newSocialTitle, setNewSocialTitle] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);

  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pTags, setPTags] = useState("");
  const [pDriveId, setPDriveId] = useState("");
  const [pSortOrder, setPSortOrder] = useState("100");
  const [pMediaType, setPMediaType] = useState<PortfolioMediaType>("image");
  const [editingPortfolioId, setEditingPortfolioId] = useState<number | null>(
    null,
  );

  const [sTitle, setSTitle] = useState("");
  const [sDescription, setSDescription] = useState("");
  const [sDriveId, setSDriveId] = useState("");
  const [sSortOrder, setSSortOrder] = useState("100");
  const [sTargetUrl, setSTargetUrl] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const [hCategory, setHCategory] =
    useState<ProfileHighlightCategory>("education");
  const [hPeriod, setHPeriod] = useState("");
  const [hTitle, setHTitle] = useState("");
  const [hDescription, setHDescription] = useState("");
  const [hImageUrl, setHImageUrl] = useState("");
  const [hSortOrder, setHSortOrder] = useState("100");
  const [editingHighlightId, setEditingHighlightId] = useState<number | null>(
    null,
  );

  const [saving, setSaving] = useState(false);
  const focusRing = ADMIN_FOCUS_RING;

  const showNotice = useCallback((type: NoticeType, message: string) => {
    setNotice({ type, message });
  }, []);

  const initializeAdmin = useCallback(async () => {
    try {
      const session = await getAdminSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }
    } catch (error) {
      showNotice("error", `Gagal memeriksa sesi admin: ${getErrorMessage(error)}`);
      router.replace("/admin/login");
      return;
    }

    try {
      const adminData = await fetchAdminData();

      if (adminData.about) {
        setHeadline(adminData.about.headline || "");
        setDescription(adminData.about.description || "");
        setBannerUrl(adminData.about.banner_url || "");
      }

      setSocials(adminData.socials);
      setPortfolios(adminData.portfolios);
      setServices(adminData.services);
      setHighlights(adminData.highlights);
    } catch (error) {
      showNotice(
        "error",
        `Gagal memuat data admin: ${getErrorMessage(error)}`,
      );
    } finally {
      setLoading(false);
    }
  }, [router, showNotice]);

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => {
      void initializeAdmin();
    }, 0);

    return () => window.clearTimeout(initializeTimer);
  }, [initializeAdmin]);

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

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { id: "about", label: "Profil", icon: <User size={20} /> },
      { id: "socials", label: "Media", icon: <LinkIcon size={20} /> },
      { id: "track_record", label: "Track Record", icon: <Award size={20} /> },
      { id: "portfolio", label: "Karya", icon: <Briefcase size={20} /> },
      { id: "services", label: "Produk", icon: <Wrench size={20} /> },
    ],
    [],
  );

  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const sortPortfoliosByOrder = (items: PortfolioItem[]) => {
    return [...items].sort((first, second) => {
      const firstOrder = first.sort_order ?? 100;
      const secondOrder = second.sort_order ?? 100;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return second.id - first.id;
    });
  };

  const sortServicesByOrder = (items: ServiceItem[]) => {
    return [...items].sort((first, second) => {
      const firstOrder = first.sort_order ?? 100;
      const secondOrder = second.sort_order ?? 100;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return first.id - second.id;
    });
  };

  const sortHighlightsByOrder = (items: ProfileHighlight[]) => {
    const categoryOrder: Record<ProfileHighlightCategory, number> = {
      education: 1,
      achievement: 2,
      leadership: 3,
      skill: 4,
    };

    return [...items].sort((first, second) => {
      const firstCategory = categoryOrder[first.category] ?? 99;
      const secondCategory = categoryOrder[second.category] ?? 99;

      if (firstCategory !== secondCategory) {
        return firstCategory - secondCategory;
      }

      const firstOrder = first.sort_order ?? 100;
      const secondOrder = second.sort_order ?? 100;

      if (firstOrder !== secondOrder) {
        return firstOrder - secondOrder;
      }

      return first.id - second.id;
    });
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
    setPSortOrder("100");
    setPMediaType("image");
    setEditingPortfolioId(null);
  };

  const resetServiceForm = () => {
    setSTitle("");
    setSDescription("");
    setSDriveId("");
    setSSortOrder("100");
    setSTargetUrl("");
    setEditingServiceId(null);
  };

  const resetHighlightForm = () => {
    setHCategory("education");
    setHPeriod("");
    setHTitle("");
    setHDescription("");
    setHImageUrl("");
    setHSortOrder("100");
    setEditingHighlightId(null);
  };

  const handleSignOut = async () => {
    if (saving) return;

    const confirmed = confirm(
      "Logout dari semua perangkat? Kamu perlu login ulang di semua browser/perangkat yang sedang aktif.",
    );

    if (!confirmed) return;

    try {
      await signOutGlobally();
      router.replace("/admin/login");
    } catch (error) {
      showNotice("error", `Gagal logout: ${getErrorMessage(error)}`);
    }
  };

  const handleSaveAbout = async () => {
    if (saving) return;

    if (!headline.trim() || !description.trim()) {
      showNotice("error", "Headline dan deskripsi bio wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      await saveAbout({
        headline: headline.trim(),
        description: description.trim(),
        banner_url: bannerUrl.trim(),
      });

      showNotice("success", "Profil berhasil diperbarui.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan profil: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    if (saving) return;

    if (!newSocialTitle.trim() || !newSocialUrl.trim()) {
      showNotice("error", "Nama dan link media sosial wajib diisi.");
      return;
    }

    const normalizedUrl = normalizeExternalUrl(newSocialUrl);

    if (!isValidExternalUrl(normalizedUrl)) {
      showNotice("error", "Link media sosial harus berupa URL yang valid.");
      return;
    }

    const payload = {
      title: newSocialTitle.trim(),
      url: normalizedUrl,
    };

    setSaving(true);

    try {
      if (editingSocialId !== null) {
        const updatedSocial = await updateSocial(editingSocialId, payload);

        setSocials((current) =>
          current.map((social) =>
            social.id === updatedSocial.id ? updatedSocial : social,
          ),
        );
        resetSocialForm();
        showNotice("success", "Link sosial berhasil diperbarui.");
        return;
      }

      const newSocial = await createSocial(payload);

      setSocials((current) => [...current, newSocial]);
      resetSocialForm();
      showNotice("success", "Link sosial berhasil ditambahkan.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan link sosial: ${getErrorMessage(error)}`);
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
    if (saving) return;

    if (!pTitle.trim() || !pDriveId.trim()) {
      showNotice("error", "Judul karya dan ID media wajib diisi.");
      return;
    }

    const parsedSortOrder = Number.parseInt(pSortOrder, 10);

    if (!pSortOrder.trim() || Number.isNaN(parsedSortOrder)) {
      showNotice("error", "Urutan tampil karya harus berupa angka.");
      return;
    }

    const payload = {
      title: pTitle.trim(),
      description: pDesc.trim(),
      tags: pTags.trim(),
      media_url: pDriveId.trim(),
      media_type: pMediaType,
      sort_order: parsedSortOrder,
    };

    setSaving(true);

    try {
      if (editingPortfolioId !== null) {
        const updatedPortfolio = await updatePortfolio(
          editingPortfolioId,
          payload,
        );

        setPortfolios((current) =>
          sortPortfoliosByOrder(
            current.map((portfolio) =>
              portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio,
            ),
          ),
        );
        resetPortfolioForm();
        showNotice("success", "Karya berhasil diperbarui.");
        return;
      }

      const newPortfolio = await createPortfolio(payload);

      setPortfolios((current) =>
        sortPortfoliosByOrder([...current, newPortfolio]),
      );
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
    setPSortOrder(String(portfolio.sort_order ?? 100));
    setPMediaType(portfolio.media_type === "video" ? "video" : "image");
    setNotice(null);
  };

  const handleSaveService = async () => {
    if (saving) return;

    if (!sTitle.trim() || !sTargetUrl.trim()) {
      showNotice("error", "Nama produk/layanan dan link target wajib diisi.");
      return;
    }

    const parsedSortOrder = Number.parseInt(sSortOrder, 10);

    if (!sSortOrder.trim() || Number.isNaN(parsedSortOrder)) {
      showNotice("error", "Urutan tampil produk harus berupa angka.");
      return;
    }

    const normalizedUrl = normalizeExternalUrl(sTargetUrl);

    if (!isValidExternalUrl(normalizedUrl)) {
      showNotice("error", "Link target produk harus berupa URL yang valid.");
      return;
    }

    const payload = {
      title: sTitle.trim(),
      description: sDescription.trim(),
      image_url: sDriveId.trim(),
      target_url: normalizedUrl,
      sort_order: parsedSortOrder,
    };

    setSaving(true);

    try {
      if (editingServiceId !== null) {
        const updatedService = await updateService(editingServiceId, payload);

        setServices((current) =>
          sortServicesByOrder(
            current.map((service) =>
              service.id === updatedService.id ? updatedService : service,
            ),
          ),
        );
        resetServiceForm();
        showNotice("success", "Produk berhasil diperbarui.");
        return;
      }

      const newService = await createService(payload);

      setServices((current) => sortServicesByOrder([...current, newService]));
      resetServiceForm();
      showNotice("success", "Produk berhasil ditambahkan.");
    } catch (error) {
      showNotice("error", `Gagal menyimpan produk: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setSTitle(service.title || "");
    setSDescription(service.description || "");
    setSDriveId(service.image_url || "");
    setSSortOrder(String(service.sort_order ?? 100));
    setSTargetUrl(service.target_url || "");
    setNotice(null);
  };

  const handleSaveHighlight = async () => {
    if (saving) return;

    if (!hTitle.trim()) {
      showNotice("error", "Judul track record wajib diisi.");
      return;
    }

    const parsedSortOrder = Number.parseInt(hSortOrder, 10);

    if (!hSortOrder.trim() || Number.isNaN(parsedSortOrder)) {
      showNotice("error", "Urutan tampil track record harus berupa angka.");
      return;
    }

    const isSkill = hCategory === "skill";
    const payload = {
      category: hCategory,
      period: isSkill ? "" : hPeriod.trim(),
      title: hTitle.trim(),
      description: isSkill ? "" : hDescription.trim(),
      image_url: isSkill ? "" : hImageUrl.trim(),
      sort_order: parsedSortOrder,
    };

    setSaving(true);

    try {
      if (editingHighlightId !== null) {
        const updatedHighlight = await updateProfileHighlight(
          editingHighlightId,
          payload,
        );

        setHighlights((current) =>
          sortHighlightsByOrder(
            current.map((highlight) =>
              highlight.id === updatedHighlight.id
                ? updatedHighlight
                : highlight,
            ),
          ),
        );
        resetHighlightForm();
        showNotice("success", "Track record berhasil diperbarui.");
        return;
      }

      const newHighlight = await createProfileHighlight(payload);

      setHighlights((current) =>
        sortHighlightsByOrder([...current, newHighlight]),
      );
      resetHighlightForm();
      showNotice("success", "Track record berhasil ditambahkan.");
    } catch (error) {
      showNotice(
        "error",
        `Gagal menyimpan track record: ${getErrorMessage(error)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditHighlight = (highlight: ProfileHighlight) => {
    setEditingHighlightId(highlight.id);
    setHCategory(highlight.category);
    setHPeriod(highlight.period || "");
    setHTitle(highlight.title || "");
    setHDescription(highlight.description || "");
    setHImageUrl(highlight.image_url || "");
    setHSortOrder(String(highlight.sort_order ?? 100));
    setNotice(null);
  };

  const deleteItem = async <T extends ItemWithId>(
    table: EditableTable,
    id: number,
    setState: Dispatch<SetStateAction<T[]>>,
    itemLabel: string,
    onDeleted?: () => void,
  ) => {
    if (saving) return;

    const confirmed = confirm(
      `Hapus "${itemLabel}"? Tindakan ini tidak bisa dibatalkan dari dashboard.`,
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await deleteAdminItem(table, id);

      setState((current) => current.filter((item) => item.id !== id));
      onDeleted?.();
      showNotice("success", `"${itemLabel}" berhasil dihapus.`);
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
        isSidebarOpen={isSidebarOpen}
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

      <main
        className="lg:ml-72 min-h-screen px-5 pt-24 pb-28 md:px-8 lg:px-10 lg:py-8"
        aria-busy={saving}
      >
        <div className="max-w-6xl mx-auto pb-24 lg:pb-0">
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
                  social.title || "link sosial ini",
                  editingSocialId === social.id ? resetSocialForm : undefined,
                );
              }}
              onEditSocial={handleEditSocial}
              onSaveSocial={handleSaveSocial}
            />
          )}

          {activeTab === "track_record" && (
            <TrackRecordPanel
              editingHighlightId={editingHighlightId}
              focusRing={focusRing}
              hCategory={hCategory}
              hDescription={hDescription}
              hImageUrl={hImageUrl}
              highlights={highlights}
              hPeriod={hPeriod}
              hSortOrder={hSortOrder}
              hTitle={hTitle}
              saving={saving}
              setHCategory={setHCategory}
              setHDescription={setHDescription}
              setHImageUrl={setHImageUrl}
              setHPeriod={setHPeriod}
              setHSortOrder={setHSortOrder}
              setHTitle={setHTitle}
              onCancelEdit={resetHighlightForm}
              onDeleteHighlight={(highlight) => {
                void deleteItem<ProfileHighlight>(
                  "profile_highlights",
                  highlight.id,
                  setHighlights,
                  highlight.title || "track record ini",
                  editingHighlightId === highlight.id
                    ? resetHighlightForm
                    : undefined,
                );
              }}
              onEditHighlight={handleEditHighlight}
              onSaveHighlight={handleSaveHighlight}
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
              pSortOrder={pSortOrder}
              pTags={pTags}
              pTitle={pTitle}
              saving={saving}
              setPDesc={setPDesc}
              setPDriveId={setPDriveId}
              setPMediaType={setPMediaType}
              setPSortOrder={setPSortOrder}
              setPTags={setPTags}
              setPTitle={setPTitle}
              onCancelEdit={resetPortfolioForm}
              onDeletePortfolio={(portfolio) => {
                void deleteItem<PortfolioItem>(
                  "portfolio",
                  portfolio.id,
                  setPortfolios,
                  portfolio.title || "karya ini",
                  editingPortfolioId === portfolio.id
                    ? resetPortfolioForm
                    : undefined,
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
              sSortOrder={sSortOrder}
              setSDescription={setSDescription}
              setSDriveId={setSDriveId}
              setSSortOrder={setSSortOrder}
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
                  service.title || "produk ini",
                  editingServiceId === service.id ? resetServiceForm : undefined,
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
        onChangeTab={changeTab}
      />
    </div>
  );
}
