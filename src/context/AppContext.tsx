import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Course,
  Enquiry,
  Notice,
  ServiceItem,
  GalleryItem,
  SiteSettings,
  PuterUser,
  EnquiryStatus
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_COURSES,
  INITIAL_SERVICES,
  INITIAL_NOTICES,
  INITIAL_GALLERY
} from '../services/seedData';
import { puterAuth, puterKV, puterFS, isPuterAvailable } from '../services/puter';

export type PublicPage = 'home' | 'about' | 'courses' | 'services' | 'gallery' | 'notices' | 'contact' | 'admin';
export type AdminTab = 'dashboard' | 'courses' | 'enquiries' | 'notices' | 'gallery' | 'services' | 'homepage' | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Public & Shared State
  page: PublicPage;
  setPage: (page: PublicPage) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  enquiryPreselectedCourse: string;
  setEnquiryPreselectedCourse: (courseTitle: string) => void;
  
  settings: SiteSettings;
  courses: Course[];
  notices: Notice[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  
  // Admin & Protected State
  enquiries: Enquiry[];
  adminUser: PuterUser | null;
  isAuthenticated: boolean;
  isAuthorizedAdmin: boolean;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  
  // Status
  isLoading: boolean;
  isDataLoaded: boolean;
  puterConnected: boolean;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Auth Operations
  loginAdmin: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  claimAdminOwnership: (username: string) => Promise<boolean>;
  
  // CRUD Operations
  saveSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;
  saveCourse: (course: Partial<Course>) => Promise<boolean>;
  removeCourse: (id: string) => Promise<boolean>;
  toggleCourseStatus: (id: string) => Promise<boolean>;
  toggleCourseFeatured: (id: string) => Promise<boolean>;
  
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; message: string }>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, notes?: string) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  removeEnquiry: (id: string) => Promise<boolean>;
  
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateNotice: (id: string, updates: Partial<Notice>) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  saveNotice: (notice: Partial<Notice>) => Promise<boolean>;
  removeNotice: (id: string) => Promise<boolean>;
  toggleNoticePublish: (id: string) => Promise<boolean>;
  
  addService: (service: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  saveService: (service: Partial<ServiceItem>) => Promise<boolean>;
  removeService: (id: string) => Promise<boolean>;
  
  uploadGalleryImage: (file: File, meta: { title: string; description?: string; altText?: string; status?: 'published' | 'draft' }) => Promise<{ success: boolean; message?: string }>;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  saveGalleryItem: (item: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  removeGalleryItem: (id: string) => Promise<boolean>;
  toggleGalleryStatus: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'ecc_settings',
  COURSES: 'ecc_courses',
  ENQUIRIES: 'ecc_enquiries',
  NOTICES: 'ecc_notices',
  SERVICES: 'ecc_services',
  GALLERY: 'ecc_gallery'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<PublicPage>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enquiryPreselectedCourse, setEnquiryPreselectedCourse] = useState<string>('');

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [adminUser, setAdminUser] = useState<PuterUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [puterConnected, setPuterConnected] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast manager
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check URL hash on initial load or popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'courses', 'services', 'gallery', 'notices', 'contact', 'admin'].includes(hash)) {
        setPage(hash as PublicPage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page changes
  const navigateToPage = (newPage: PublicPage) => {
    setPage(newPage);
    window.location.hash = newPage === 'home' ? '' : newPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Data & Auth bootstrap
  useEffect(() => {
    const loadAppData = async () => {
      setIsLoading(true);
      const isAvailable = isPuterAvailable();
      setPuterConnected(isAvailable);

      try {
        // Load Settings
        const loadedSettings = await puterKV.get<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
        setSettings(loadedSettings);

        // Load Courses
        const loadedCourses = await puterKV.get<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
        setCourses(loadedCourses);

        // Load Notices
        const loadedNotices = await puterKV.get<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
        setNotices(loadedNotices);

        // Load Services
        const loadedServices = await puterKV.get<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        setServices(loadedServices);

        // Load Gallery
        const loadedGallery = await puterKV.get<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
        setGallery(loadedGallery);

        // Check Auth
        const currentUser = await puterAuth.getUser();
        if (currentUser) {
          setAdminUser(currentUser);
          // Load protected enquiries
          const loadedEnquiries = await puterKV.get<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
          setEnquiries(loadedEnquiries);
        }
      } catch (err) {
        console.error('Failed to load application initial state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  // Compute Auth & Admin status
  const isAuthenticated = Boolean(adminUser);
  // Authorization logic:
  // If no authorized users exist yet, first signed in Puter user can claim ownership or access setup.
  // Otherwise, user's username or uuid must match authorized list.
  const isAuthorizedAdmin = Boolean(
    adminUser &&
    (!settings.isInitialized ||
      settings.authorizedPuterUsers.length === 0 ||
      (adminUser.username && settings.authorizedPuterUsers.includes(adminUser.username)) ||
      (adminUser.uuid && settings.authorizedPuterUsers.includes(adminUser.uuid)))
  );

  // Auth Handlers
  const loginAdmin = async () => {
    try {
      setIsLoading(true);
      const user = await puterAuth.signIn();
      if (user) {
        setAdminUser(user);
        // Load enquiries once authenticated
        const loadedEnquiries = await puterKV.get<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
        setEnquiries(loadedEnquiries);
        addToast(`Welcome, ${user.username || 'Administrator'}! Signed in via Puter.`, 'success');
      }
    } catch (err: unknown) {
      console.error('Login failed:', err);
      const msg = err instanceof Error ? err.message : 'Sign-in cancelled or popup blocked.';
      addToast(`Authentication failed: ${msg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      await puterAuth.signOut();
      setAdminUser(null);
      setEnquiries([]); // Clear sensitive enquiries from memory
      addToast('Signed out successfully from Admin Portal.', 'info');
      navigateToPage('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const claimAdminOwnership = async (username: string): Promise<boolean> => {
    if (!username.trim()) return false;
    const updated: SiteSettings = {
      ...settings,
      authorizedPuterUsers: Array.from(new Set([...settings.authorizedPuterUsers, username.trim()])),
      isInitialized: true,
      updatedAt: new Date().toISOString()
    };
    const success = await puterKV.set(STORAGE_KEYS.SETTINGS, updated);
    if (success) {
      setSettings(updated);
      addToast(`Authorized administrator "${username}" registered successfully!`, 'success');
    }
    return success;
  };

  // Settings CRUD
  const saveSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated: SiteSettings = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    const ok = await puterKV.set(STORAGE_KEYS.SETTINGS, updated);
    setSettings(updated);
    addToast('Site settings updated successfully.', 'success');
    return ok;
  };

  // Course CRUD
  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      slug: courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newCourse, ...courses];
    setCourses(updated);
    await puterKV.set(STORAGE_KEYS.COURSES, updated);
    addToast('Course added successfully.', 'success');
    return true;
  };

  const updateCourse = async (id: string, updates: Partial<Course>): Promise<boolean> => {
    const updated = courses.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    setCourses(updated);
    await puterKV.set(STORAGE_KEYS.COURSES, updated);
    addToast('Course updated successfully.', 'success');
    return true;
  };

  const deleteCourse = async (id: string): Promise<boolean> => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    await puterKV.set(STORAGE_KEYS.COURSES, updated);
    addToast('Course deleted successfully.', 'info');
    return true;
  };

  const toggleCourseStatus = async (id: string): Promise<boolean> => {
    const target = courses.find((c) => c.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    return updateCourse(id, { status: newStatus });
  };

  const toggleCourseFeatured = async (id: string): Promise<boolean> => {
    const target = courses.find((c) => c.id === id);
    if (!target) return false;
    return updateCourse(id, { featured: !target.featured });
  };

  // Enquiry System
  const submitEnquiry = async (
    enquiryData: Omit<Enquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; message: string }> => {
    // Validation
    if (!enquiryData.name || enquiryData.name.trim().length < 2) {
      return { success: false, message: 'Please enter your full name.' };
    }
    const cleanPhone = enquiryData.phone ? enquiryData.phone.replace(/[\s-]/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, message: 'Please provide a valid contact phone number.' };
    }
    if (enquiryData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryData.email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (!enquiryData.message || enquiryData.message.trim().length < 5) {
      return { success: false, message: 'Please provide a brief message or question.' };
    }

    // Load current enquiries to prevent duplicate submission within short time
    const currentEnquiries = await puterKV.get<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const recentDuplicate = currentEnquiries.find(
      (e) =>
        e.phone.replace(/[\s-]/g, '') === cleanPhone &&
        e.course === enquiryData.course &&
        Date.now() - new Date(e.createdAt).getTime() < 1000 * 60 * 3
    );

    if (recentDuplicate) {
      return {
        success: false,
        message: 'Your enquiry was already received recently. Our center team will contact you shortly.'
      };
    }

    const newEnquiry: Enquiry = {
      ...enquiryData,
      name: enquiryData.name.trim(),
      phone: cleanPhone,
      email: enquiryData.email ? enquiryData.email.trim() : undefined,
      id: `enquiry-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newEnquiry, ...currentEnquiries];
    await puterKV.set(STORAGE_KEYS.ENQUIRIES, updated);
    if (isAuthenticated) {
      setEnquiries(updated);
    }
    addToast('Thank you! Your enquiry has been submitted to Ekta Computer Center.', 'success');
    return { success: true, message: 'Enquiry submitted successfully.' };
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus, notes?: string): Promise<boolean> => {
    const updated = enquiries.map((e) =>
      e.id === id ? { ...e, status, notes: notes !== undefined ? notes : e.notes, updatedAt: new Date().toISOString() } : e
    );
    setEnquiries(updated);
    await puterKV.set(STORAGE_KEYS.ENQUIRIES, updated);
    addToast(`Enquiry marked as ${status}.`, 'success');
    return true;
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    await puterKV.set(STORAGE_KEYS.ENQUIRIES, updated);
    addToast('Enquiry record deleted.', 'info');
    return true;
  };

  // Notice CRUD
  const addNotice = async (noticeData: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newNotice: Notice = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    await puterKV.set(STORAGE_KEYS.NOTICES, updated);
    addToast('Notice published successfully.', 'success');
    return true;
  };

  const updateNotice = async (id: string, updates: Partial<Notice>): Promise<boolean> => {
    const updated = notices.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    );
    setNotices(updated);
    await puterKV.set(STORAGE_KEYS.NOTICES, updated);
    addToast('Notice updated successfully.', 'success');
    return true;
  };

  const deleteNotice = async (id: string): Promise<boolean> => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    await puterKV.set(STORAGE_KEYS.NOTICES, updated);
    addToast('Notice removed successfully.', 'info');
    return true;
  };

  const toggleNoticePublish = async (id: string): Promise<boolean> => {
    const target = notices.find((n) => n.id === id);
    if (!target) return false;
    const newStatus = target.status === 'published' ? 'draft' : 'published';
    return updateNotice(id, { status: newStatus });
  };

  // Service CRUD
  const addService = async (serviceData: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...services, newService];
    setServices(updated);
    await puterKV.set(STORAGE_KEYS.SERVICES, updated);
    addToast('Service card added.', 'success');
    return true;
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>): Promise<boolean> => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    );
    setServices(updated);
    await puterKV.set(STORAGE_KEYS.SERVICES, updated);
    addToast('Service card updated.', 'success');
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    await puterKV.set(STORAGE_KEYS.SERVICES, updated);
    addToast('Service removed.', 'info');
    return true;
  };

  // Gallery CRUD
  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    await puterKV.set(STORAGE_KEYS.GALLERY, updated);
    addToast('Image uploaded and added to gallery.', 'success');
    return true;
  };

  const deleteGalleryItem = async (id: string): Promise<boolean> => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    await puterKV.set(STORAGE_KEYS.GALLERY, updated);
    addToast('Gallery image deleted.', 'info');
    return true;
  };

  const toggleGalleryStatus = async (id: string): Promise<boolean> => {
    const target = gallery.find((g) => g.id === id);
    if (!target) return false;
    const newStatus: 'published' | 'draft' = target.status === 'published' ? 'draft' : 'published';
    const updated: GalleryItem[] = gallery.map((g) =>
      g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString() } : g
    );
    setGallery(updated);
    await puterKV.set(STORAGE_KEYS.GALLERY, updated);
    addToast(`Gallery image marked as ${newStatus}.`, 'info');
    return true;
  };

  // Convenience methods for Admin Components
  const isDataLoaded = !isLoading;

  const saveCourse = async (course: Partial<Course>): Promise<boolean> => {
    if (course.id) {
      return updateCourse(course.id, course);
    } else {
      return addCourse({
        title: course.title || 'Untitled Course',
        slug: (course.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        duration: course.duration || '3 Months',
        level: course.level || 'Beginner',
        category: course.category || 'Computer Fundamentals',
        status: course.status || 'active',
        featured: course.featured || false,
        sortOrder: course.sortOrder ?? courses.length,
        curriculum: course.curriculum || [],
        feeNotes: course.feeNotes || ''
      });
    }
  };

  const removeCourse = async (id: string) => deleteCourse(id);

  const saveNotice = async (notice: Partial<Notice>): Promise<boolean> => {
    if (notice.id) {
      return updateNotice(notice.id, notice);
    } else {
      return addNotice({
        title: notice.title || 'Notice',
        content: notice.content || '',
        priority: notice.priority || 'normal',
        publishedAt: notice.publishedAt || new Date().toLocaleDateString(),
        status: notice.status || 'published',
        sortOrder: notice.sortOrder ?? notices.length
      });
    }
  };

  const removeNotice = async (id: string) => deleteNotice(id);

  const saveService = async (srv: Partial<ServiceItem>): Promise<boolean> => {
    if (srv.id) {
      return updateService(srv.id, srv);
    } else {
      return addService({
        title: srv.title || 'Service',
        description: srv.description || '',
        iconName: srv.iconName || 'Monitor',
        status: srv.status || 'active',
        sortOrder: srv.sortOrder ?? services.length
      });
    }
  };

  const removeService = async (id: string) => deleteService(id);

  const removeEnquiry = async (id: string) => deleteEnquiry(id);

  const uploadGalleryImage = async (
    file: File,
    meta: { title: string; description?: string; altText?: string; status?: 'published' | 'draft' }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const imageUrl = await puterFS.uploadFile(file);
      await addGalleryItem({
        title: meta.title,
        description: meta.description || '',
        altText: meta.altText || meta.title,
        imageUrl,
        status: meta.status || 'published',
        sortOrder: gallery.length
      });
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      return { success: false, message };
    }
  };

  const saveGalleryItem = async (item: Partial<GalleryItem>): Promise<boolean> => {
    if (item.id) {
      const updated = gallery.map((g) =>
        g.id === item.id ? ({ ...g, ...item, updatedAt: new Date().toISOString() } as GalleryItem) : g
      );
      setGallery(updated);
      await puterKV.set(STORAGE_KEYS.GALLERY, updated);
      addToast('Gallery updated.', 'success');
      return true;
    }
    return false;
  };

  const removeGalleryItem = async (id: string) => deleteGalleryItem(id);

  return (
    <AppContext.Provider
      value={{
        page,
        setPage: navigateToPage,
        selectedCourse,
        setSelectedCourse,
        enquiryPreselectedCourse,
        setEnquiryPreselectedCourse,
        settings,
        courses,
        notices,
        services,
        gallery,
        enquiries,
        adminUser,
        isAuthenticated,
        isAuthorizedAdmin,
        adminTab,
        setAdminTab,
        isLoading,
        isDataLoaded,
        puterConnected,
        toasts,
        addToast,
        removeToast,
        loginAdmin,
        logoutAdmin,
        claimAdminOwnership,
        saveSettings,
        addCourse,
        updateCourse,
        deleteCourse,
        saveCourse,
        removeCourse,
        toggleCourseStatus,
        toggleCourseFeatured,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        removeEnquiry,
        addNotice,
        updateNotice,
        deleteNotice,
        saveNotice,
        removeNotice,
        toggleNoticePublish,
        addService,
        updateService,
        deleteService,
        saveService,
        removeService,
        uploadGalleryImage,
        addGalleryItem,
        saveGalleryItem,
        deleteGalleryItem,
        removeGalleryItem,
        toggleGalleryStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
