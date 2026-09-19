export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string; // e.g. "3 Months", "6 Months"
  level: CourseLevel;
  category: string; // e.g. "Office Productivity", "Accounting", "Programming", "Design", "Hardware"
  image?: string;
  status: 'active' | 'inactive';
  featured: boolean;
  sortOrder: number;
  curriculum: string[]; // List of modules/topics covered
  feeNotes?: string; // Optional fee details if configured by admin, never fabricated
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NoticePriority = 'normal' | 'important' | 'urgent';

export interface Notice {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
  priority: NoticePriority;
  publishedAt: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type Service = ServiceItem;


export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  status: 'published' | 'draft';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  centerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  openingHours: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  footerText: string;
  
  // Homepage content
  heroHeading: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutPreview: string;
  whyChooseUs: { title: string; description: string }[];
  
  // Authorized Admin Puter Usernames
  authorizedPuterUsers: string[];
  isInitialized: boolean;
  updatedAt: string;
}

export interface PuterUser {
  username?: string;
  uuid?: string;
  email?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    puter?: {
      auth: {
        signIn: (options?: { attempt_temp_user_creation?: boolean; request_auth?: boolean }) => Promise<unknown>;
        signOut: () => Promise<void>;
        isSignedIn: () => boolean | Promise<boolean>;
        getUser: () => Promise<PuterUser>;
      };
      kv: {
        get: <T = unknown>(key: string) => Promise<T | undefined>;
        set: (key: string, value: unknown, options?: { disableSharing?: boolean }) => Promise<boolean>;
        del: (key: string) => Promise<boolean>;
        list: (returnValues?: boolean) => Promise<string[] | { key: string; value: unknown }[]>;
      };
      fs: {
        write: (path: string, data?: unknown, options?: { overwrite?: boolean; createMissingParents?: boolean }) => Promise<{ path: string; name: string }>;
        read: (path: string) => Promise<Blob>;
        getReadURL: (path: string, expiresIn?: string | number) => Promise<string>;
        delete: (path: string | string[]) => Promise<void>;
        mkdir: (path: string) => Promise<unknown>;
      };
      print?: (msg: string) => void;
    };
  }
}
