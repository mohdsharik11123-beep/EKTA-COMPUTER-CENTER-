import { Course, Notice, ServiceItem, GalleryItem, SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  centerName: 'Ekta Computer Center',
  phone: '', // Editable placeholder in admin, hidden gracefully on public until configured
  whatsapp: '',
  email: '',
  address: '',
  mapsUrl: '',
  openingHours: 'Monday – Saturday: 08:00 AM – 07:00 PM',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  footerText: 'Empowering students and professionals through practical computer education and technical skills.',
  
  heroHeading: 'Practical Computer Education & Technical Skill Development',
  heroSubtitle: 'Build real-world digital proficiency through structured, hands-on computer courses designed for students, job seekers, and working professionals.',
  heroCtaPrimary: 'Explore Courses',
  heroCtaSecondary: 'Contact & Enquiry',
  aboutPreview: 'Ekta Computer Center provides comprehensive hands-on training in computer fundamentals, office software, financial accounting, coding, and digital design. Our goal is to equip learners with verifiable skills for academic and workplace success.',
  whyChooseUs: [
    {
      title: 'Practical Hands-on Sessions',
      description: 'Dedicated lab time for every student to practice on current computer systems and industry software.'
    },
    {
      title: 'Structured Curriculum',
      description: 'Step-by-step modular lessons covering essential concepts, practical exercises, and revision assignments.'
    },
    {
      title: 'Individual Attention & Doubt Clearing',
      description: 'Focused batches ensuring personalized guidance for beginners as well as advanced learners.'
    },
    {
      title: 'Flexible Batch Timings',
      description: 'Morning and evening sessions tailored for school students, college students, and working individuals.'
    }
  ],
  authorizedPuterUsers: [],
  isInitialized: false,
  updatedAt: new Date().toISOString()
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ccc',
    title: 'Certificate in Computer Concepts (CCC)',
    slug: 'certificate-in-computer-concepts',
    shortDescription: 'Foundational computer training covering operating systems, office applications, and internet essentials.',
    description: 'A comprehensive foundational program designed to impart basic computer literacy. Students gain confidence in personal computing, document creation, spreadsheet calculations, presentation building, email communication, and safe web navigation.',
    duration: '3 Months',
    level: 'Beginner',
    category: 'Computer Fundamentals',
    status: 'active',
    featured: true,
    sortOrder: 1,
    curriculum: [
      'Introduction to Computer Hardware, OS & File Management',
      'Word Processing: Document Formatting, Tables & Printing',
      'Spreadsheets: Formula Basics, Data Sorting & Simple Charts',
      'Presentations: Slide Design, Animation & Delivery',
      'Internet Basics, Email Etiquette & Cyber Safety Practices'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course-dca',
    title: 'Diploma in Computer Applications (DCA)',
    slug: 'diploma-in-computer-applications',
    shortDescription: 'In-depth computer training covering office automation, database concepts, and operating systems.',
    description: 'An extensive diploma program providing thorough practical knowledge of standard desktop productivity tools, database essentials, and operational office computing requirements.',
    duration: '6 Months',
    level: 'Intermediate',
    category: 'Office Productivity',
    status: 'active',
    featured: true,
    sortOrder: 2,
    curriculum: [
      'Advanced Windows Environment & Utilities',
      'Advanced Word Processing & Mail Merge Workflows',
      'Advanced Spreadsheet Analysis (VLOOKUP, Pivot Tables, Conditional Formatting)',
      'Database Concepts & Entry Management',
      'Digital Office Productivity Tools & Document Scanning'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course-tally',
    title: 'Financial Accounting & Tally Prime',
    slug: 'financial-accounting-tally-prime',
    shortDescription: 'Computerized accounting, voucher entry, inventory management, and tax report generation.',
    description: 'Specialized accounting training covering manual accounting principles and complete computerized operations in Tally Prime, including day books, ledger accounts, inventory, and GST invoicing.',
    duration: '3 Months',
    level: 'Intermediate',
    category: 'Financial Accounting',
    status: 'active',
    featured: true,
    sortOrder: 3,
    curriculum: [
      'Fundamental Accounting Principles & Debit/Credit Rules',
      'Company Creation & Ledger Master Setup',
      'Voucher Entry (Payment, Receipt, Contra, Journal, Sales, Purchase)',
      'Inventory Management, Stock Groups & Units of Measure',
      'GST Basics, Invoicing, Trial Balance & Balance Sheet Generation'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course-web-dev',
    title: 'Web Design & Frontend Fundamentals',
    slug: 'web-design-frontend-fundamentals',
    shortDescription: 'Learn to design and build responsive modern websites using HTML5, CSS3, and JavaScript.',
    description: 'Practical training in web development for beginners. Learn modern layout techniques, mobile responsiveness, semantic HTML structure, CSS styling, and interactive JavaScript programming.',
    duration: '4 Months',
    level: 'Intermediate',
    category: 'Programming & Web',
    status: 'active',
    featured: true,
    sortOrder: 4,
    curriculum: [
      'HTML5 Semantic Structure & Forms',
      'CSS3 Styling, Flexbox, Grid & Media Queries',
      'Responsive Web Layouts & Mobile Adaptation',
      'JavaScript Basics: DOM Manipulation & Event Handling',
      'Publishing & Hosting Web Projects Online'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course-python',
    title: 'Python Programming Essentials',
    slug: 'python-programming-essentials',
    shortDescription: 'Structured introduction to programming logic, syntax, data structures, and problem solving in Python.',
    description: 'Designed for beginners wanting to start programming. Covers logic building, variables, control flow, functions, file handling, and basic algorithms with real coding exercises.',
    duration: '3 Months',
    level: 'Beginner',
    category: 'Programming & Web',
    status: 'active',
    featured: false,
    sortOrder: 5,
    curriculum: [
      'Programming Fundamentals & Python Setup',
      'Variables, Data Types & Operators',
      'Conditional Logic & Loop Structures',
      'Lists, Tuples, Dictionaries & Sets',
      'Functions, Modules & File Handling Operations'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'course-graphic-design',
    title: 'Graphic Design & Publishing Tools',
    slug: 'graphic-design-publishing-tools',
    shortDescription: 'Digital image editing, vector drawing, layout design for banners, posters, and print media.',
    description: 'Hands-on training in digital design software for creating print materials, social media graphics, posters, and promotional graphics with proper composition and color harmony.',
    duration: '3 Months',
    level: 'Intermediate',
    category: 'Design & Multimedia',
    status: 'active',
    featured: false,
    sortOrder: 6,
    curriculum: [
      'Design Principles, Color Theory & Typography',
      'Photo Editing, Layer Management & Masking',
      'Vector Graphics Creation & Logo Layouts',
      'Pamphlet, Banner & Business Card Designing',
      'Exporting Formats for Web and Commercial Print'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-computer-education',
    title: 'Computer Literacy & Office Training',
    description: 'Structured computer training programs for students and professionals covering everyday office software, spreadsheets, and operating system workflows.',
    iconName: 'Monitor',
    status: 'active',
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-accounting',
    title: 'Computerized Accounting & Tally',
    description: 'Practical training on business accounts, ledger maintenance, stock tracking, and GST invoice generation using computerized tools.',
    iconName: 'Calculator',
    status: 'active',
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-programming',
    title: 'Coding & Software Fundamentals',
    description: 'Core programming language sessions focused on logic building, problem-solving techniques, and introductory software development concepts.',
    iconName: 'Code',
    status: 'active',
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-typing',
    title: 'Typing & Speed Improvement Labs',
    description: 'Guided touch-typing practice sessions to build accurate, efficient keyboarding skills for academic tests and official office work.',
    iconName: 'Keyboard',
    status: 'active',
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-admission-open',
    title: 'New Batch Admissions Open for Upcoming Month',
    content: 'Registration is now open for upcoming weekday and weekend batches in Computer Fundamentals, Tally Prime, and Web Development. Inquire at the center desk or submit an online enquiry for batch schedule details.',
    status: 'published',
    priority: 'important',
    publishedAt: new Date().toISOString().split('T')[0],
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'notice-practical-lab',
    title: 'Hands-on Lab Practice Hours Schedule',
    content: 'Students are reminded that lab practice slots can be booked during morning and afternoon open hours. Please consult with the instructor for extra lab practice allocations.',
    status: 'published',
    priority: 'normal',
    publishedAt: new Date().toISOString().split('T')[0],
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-lab-1',
    title: 'Computer Lab Environment',
    description: 'Dedicated workstations equipped for individual practical sessions and exercises.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    altText: 'Computer training classroom with computer terminals and workstations',
    status: 'published',
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gal-lab-2',
    title: 'Practical Coding & Project Session',
    description: 'Students engaged in interactive software exercises and curriculum assignments.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    altText: 'Students working together on technical computer assignments',
    status: 'published',
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gal-lab-3',
    title: 'Classroom Instruction Area',
    description: 'Structured conceptual lectures and demonstration setup for technical topics.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    altText: 'Modern classroom with instructional screens and student desks',
    status: 'published',
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
