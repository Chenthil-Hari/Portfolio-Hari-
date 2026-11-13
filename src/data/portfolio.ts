// ============================================================
//  PORTFOLIO DATA — Centralized Content Configuration
//  Source of Truth: Real Curriculum Vitae (Chenthil Hari)
// ============================================================

export interface PersonalInfo {
  name: string
  fullName: string
  title: string
  subtitle: string
  tagline: string
  bio: string[]
  email: string
  github: string
  githubUsername: string
  linkedin: string
  resumeUrl: string
  avatar: string
  location: string
  availability: string
  stats: { label: string; value: string; helper?: string }[]
}

export const personalInfo: PersonalInfo = {
  name: 'Hari',
  fullName: 'Chenthil Hari',
  title: 'Computer Science Student & Software Developer',
  subtitle: 'Building full-stack web applications, AI/ML models, and cybersecurity tools.',
  tagline: 'Passionate about Software Engineering, Machine Learning, Generative AI, and Agentic AI.',
  bio: [
    "I'm a Computer Science and Engineering undergraduate at Amrita Vishwa Vidyapeetham (Class of 2024–2028) with hands-on experience in full-stack web development, AI/ML, cybersecurity, and software engineering.",
    "My technical interests center on building practical, deployed applications — from developing machine-learning fraud detection tools in Python and Streamlit, to architecting interactive cybersecurity awareness platforms and multi-sided web marketplaces using React and modern web technologies.",
    "I am constantly strengthening my foundations across Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, and Theory of Computation, while building and deploying end-to-end software."
  ],
  email: 'chenthilhari@gmail.com',
  github: 'https://github.com/Chenthil-Hari',
  githubUsername: 'Chenthil-Hari',
  linkedin: 'https://linkedin.com/in/chenthil-hari',
  resumeUrl: '/resume.pdf',
  avatar: '/avatar.jpg',
  location: 'Tamil Nadu, India',
  availability: 'Open to Software & AI Internships',
  stats: [
    { label: 'Degree Program', value: 'B.Tech CSE', helper: 'Amrita Vishwa Vidyapeetham (2024–2028)' },
    { label: 'Primary Domains', value: 'Full-Stack & AI/ML', helper: 'React, Python, Scikit-learn, Next.js' },
    { label: 'Base Location', value: 'Tamil Nadu', helper: 'India · UTC +05:30' },
  ],
}

// ─────────────────────────────────────────────
//  SKILLS MATRIX (From Verified Resume)
// ─────────────────────────────────────────────
export interface SkillItem {
  name: string
  context: string
  level?: 'Advanced' | 'Proficient' | 'Familiar'
  highlight?: boolean
}

export interface SkillCategory {
  category: string
  code: string
  description: string
  skills: SkillItem[]
}

export const skillsData: SkillCategory[] = [
  {
    category: 'Programming Languages',
    code: '01',
    description: 'Languages used for algorithms, object-oriented systems, and data pipelines.',
    skills: [
      { name: 'Python', context: 'AI/ML modeling, Scikit-learn, Pandas, Streamlit apps', level: 'Advanced', highlight: true },
      { name: 'C & C++', context: 'Core data structures, algorithms, memory concepts', level: 'Proficient', highlight: true },
      { name: 'Java', context: 'Object-oriented programming, core software design', level: 'Proficient' },
      { name: 'SQL', context: 'Relational querying, joins, schema design, constraints', level: 'Proficient', highlight: true },
      { name: 'JavaScript', context: 'Modern ES6+, DOM manipulation, web logic', level: 'Advanced', highlight: true },
    ],
  },
  {
    category: 'Web & Frontend Development',
    code: '02',
    description: 'Modern component architectures, responsive user interfaces, and build tooling.',
    skills: [
      { name: 'React.js', context: 'Component hierarchies, hooks, state management', level: 'Advanced', highlight: true },
      { name: 'Next.js', context: 'SSR, routing, full-stack application structure', level: 'Proficient', highlight: true },
      { name: 'Vite', context: 'Fast modern frontend bundling and tooling', level: 'Advanced' },
      { name: 'HTML5 & CSS3', context: 'Semantic layout, responsive design, accessibility', level: 'Advanced' },
      { name: 'Tailwind CSS', context: 'Utility-first styling, design token systems', level: 'Advanced', highlight: true },
    ],
  },
  {
    category: 'AI / ML & Data Science',
    code: '03',
    description: 'Machine learning classification, data analysis, and generative AI interfaces.',
    skills: [
      { name: 'Machine Learning', context: 'Supervised classification, fraud detection models', level: 'Proficient', highlight: true },
      { name: 'Scikit-learn', context: 'Model training, text vectorization, evaluation', level: 'Proficient', highlight: true },
      { name: 'Pandas & NumPy', context: 'Data cleaning, feature transformation, matrix ops', level: 'Proficient' },
      { name: 'Streamlit', context: 'Interactive AI web apps and live inference UIs', level: 'Advanced', highlight: true },
      { name: 'Generative & Agentic AI', context: 'LLM integrations, agent workflows, prompt design', level: 'Proficient', highlight: true },
    ],
  },
  {
    category: 'Backend, Databases & Tooling',
    code: '04',
    description: 'Server-side API handlers, data storage, version control, and cloud hosting.',
    skills: [
      { name: 'MySQL', context: 'Relational data modeling, queries, indexing', level: 'Proficient', highlight: true },
      { name: 'MongoDB', context: 'Document storage, Atlas clusters, schemas', level: 'Proficient' },
      { name: 'REST APIs', context: 'Endpoint architecture, validation, status handling', level: 'Proficient', highlight: true },
      { name: 'Git & GitHub', context: 'Branch workflows, repository management', level: 'Advanced', highlight: true },
      { name: 'Vercel & Netlify', context: 'Deployment, edge configuration, static hosting', level: 'Proficient' },
    ],
  },
]

// ─────────────────────────────────────────────
//  PROJECTS (Real Projects from Resume)
// ─────────────────────────────────────────────
export interface Project {
  id: string
  title: string
  tagline: string
  shortDescription: string
  description: string
  problem: string
  approach: string
  solution: string
  friction: string
  learned: string
  myContribution: string
  technologies: string[]
  keyFeatures: string[]
  challenges: string
  githubUrl: string
  liveUrl?: string
  hasDemo?: boolean
  demoType?: 'traffic' | 'video' | 'preview'
  featured: boolean
  category: 'Cybersecurity' | 'AI / Machine Learning' | 'Web Platforms' | 'Full-Stack'
  metrics?: { label: string; value: string }[]
}

export const projectsData: Project[] = [
  {
    id: 'security-sim',
    title: 'SecuritySim — Cybersecurity Awareness Platform',
    tagline: 'Interactive threat simulations and game-based security education',
    shortDescription: 'Interactive educational platform designed to train users on identifying and preventing phishing, social engineering, and common cyber threats through hands-on simulations.',
    description: 'An interactive cybersecurity awareness web platform built to bridge the gap between theoretical security concepts and practical threat recognition. Features interactive simulation scenarios, attack vector walkthroughs, and gamified learning modules to help users identify digital vulnerabilities.',
    problem: 'Traditional cybersecurity training relies on dry, static presentations that fail to teach users how real phishing vectors, malicious links, and social engineering attacks appear in real workflows.',
    approach: 'Engineered an interactive web application featuring simulated attack environments where users analyze real-world threat scenarios, make defensive decisions, and receive instant feedback on security posture.',
    solution: 'Built responsive web interfaces and interactive scenario engines deployed to modern web hosting platforms with custom domain configuration.',
    friction: 'Balancing realism in malicious email/phishing simulations without triggering false browser security warnings or web host abuse filters.',
    learned: 'Gained in-depth knowledge of attack vector anatomy, browser sandbox behaviors, and how to structure interactive educational UX for security literacy.',
    myContribution: 'Architected responsive UI components, designed scenario logic for phishing and credential-theft simulations, and managed deployment pipelines.',
    technologies: ['React.js', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS', 'Vercel Hosting', 'Git/GitHub'],
    keyFeatures: [
      'Interactive threat simulation modules for phishing and malware attacks',
      'Game-based learning scoring and security risk assessments',
      'Responsive, accessible interface designed for desktop and mobile learners',
      'Real-world attack scenario breakdowns and preventative guidance',
    ],
    challenges: 'Designing dynamic threat evaluation feedback that adapts to different user responses in real time.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: true,
    category: 'Cybersecurity',
    metrics: [
      { label: 'Domain', value: 'Cybersecurity' },
      { label: 'Format', value: 'Interactive Simulations' },
      { label: 'Deployment', value: 'Production Hosted' },
    ],
  },
  {
    id: 'fraud-detection-ai',
    title: 'Fraud Detection AI',
    tagline: 'Machine learning fraud and scam risk prediction with Streamlit UI',
    shortDescription: 'Python-based intelligence tool that analyzes text content and transactional patterns to evaluate fraud risk and flag malicious scams in real time.',
    description: 'A machine-learning-powered fraud detection tool developed in Python. Leverages text processing, feature extraction, and classification models to identify fraudulent patterns, spam indicators, and scam signals, exposed via an intuitive Streamlit interface for live scoring.',
    problem: 'Digital scams, phishing communications, and fraudulent transactions evolve rapidly, making static keyword blacklists ineffective against newly crafted social engineering patterns.',
    approach: 'Constructed an ML classification pipeline using Python and Scikit-learn, training models on labeled threat datasets with text vectorization, and integrated a real-time Streamlit dashboard for instant risk assessment.',
    solution: 'Built a clean, responsive prediction interface in Streamlit backed by trained Scikit-learn classification models and keyword density extractors.',
    friction: 'High false-positive rates on legitimate promotional messages that used urgent call-to-action phrasing similar to scam messages.',
    learned: 'Tuned model hyperparameters, calibrated confidence score thresholds, and learned the value of balancing precision vs. recall when classifying security-critical events.',
    myContribution: 'Built the feature engineering pipeline, trained Scikit-learn classification algorithms, developed the Streamlit frontend, and integrated real-time risk scoring.',
    technologies: ['Python', 'Scikit-learn', 'Streamlit', 'Pandas', 'NumPy', 'NLP / Text Processing'],
    keyFeatures: [
      'Real-time fraud and scam risk probability scoring',
      'Keyword-based heuristics combined with trained ML classifiers',
      'Interactive Streamlit UI for immediate text and parameter input',
      'Detailed risk factor breakdown explaining why an item was flagged',
    ],
    challenges: 'Optimizing tokenization and inference latency to ensure near-instantaneous predictions on submitted text.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: true,
    category: 'AI / Machine Learning',
    metrics: [
      { label: 'Model Stack', value: 'Scikit-learn + NLP' },
      { label: 'Frontend', value: 'Streamlit Dashboard' },
      { label: 'Inference', value: 'Real-time (<100ms)' },
    ],
  },
  {
    id: 'idea-match',
    title: 'IdeaMatch — Project Marketplace Platform',
    tagline: 'Matching client project briefs with qualified software developers',
    shortDescription: 'Multi-role collaborative platform connecting project owners with suitable freelance developers based on technical requirements and scope.',
    description: 'A web platform designed to streamline the software contracting lifecycle. Features specialized workflows for project clients, developer talent, and administrators — covering project brief submission, algorithmic matching, milestone demo review, and communication.',
    problem: 'Finding the right developer for a specific technical scope is often inefficient on generic freelance platforms cluttered with mismatched bids and unverified skill sets.',
    approach: 'Designed a role-based web architecture with dedicated workflows for clients, sellers, and administrators, incorporating structured project requirements submission and developer qualification matching.',
    solution: 'Implemented client submission pipelines, developer catalog listings, notification mechanisms, and administrative moderation consoles.',
    friction: 'Managing multi-role state transitions (client vs. developer vs. admin) and ensuring proper authorization boundaries across different dashboard views.',
    learned: 'Gained practical expertise in role-based access control (RBAC), database normalization for multi-sided marketplaces, and state management in complex web workflows.',
    myContribution: 'Designed database schemas, implemented frontend views for brief submission and developer discovery, and structured notification workflows.',
    technologies: ['React.js', 'Next.js', 'TypeScript', 'MySQL / Database', 'REST APIs', 'Tailwind CSS'],
    keyFeatures: [
      'Structured project brief submission with tech stack tag filtering',
      'Role-based dashboards for clients, developers, and administrators',
      'Milestone demo review and project progress tracking',
      'Notification triggers and modular architecture ready for payment gateways',
    ],
    challenges: 'Designing flexible database schemas capable of handling varied project scopes and technical tag taxonomies.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: true,
    category: 'Web Platforms',
    metrics: [
      { label: 'Architecture', value: 'Multi-Role Marketplace' },
      { label: 'Roles', value: 'Client · Developer · Admin' },
      { label: 'Tech Stack', value: 'Next.js & React' },
    ],
  },
  {
    id: 'pet-services-platform',
    title: 'Pet Services & Care Discovery Platform',
    tagline: 'Accessible directory and booking discovery platform for pet care',
    shortDescription: 'Responsive web platform connecting pet owners with local veterinary care, grooming services, and pet boarding options through an accessible interface.',
    description: 'A responsive web application crafted to simplify finding and scheduling pet care services. Focuses on intuitive user experience, fast client-side filtering by category and location, clean semantic markup, and mobile-friendly usability.',
    problem: 'Pet owners frequently struggle to find trusted local pet care providers through outdated directories with poor mobile interfaces and confusing service categorization.',
    approach: 'Constructed an accessible, mobile-first web interface with clean UI patterns, intuitive service categorization, and straightforward service provider contact flows.',
    solution: 'Delivered an interactive, lightweight web application with zero external framework overhead, ensuring instant load times and cross-device responsiveness.',
    friction: 'Ensuring seamless responsive design across diverse viewport sizes without layout shifts or navigation bottlenecks on older mobile devices.',
    learned: 'Deepened mastery of semantic HTML5, CSS layout specifications (Flexbox/CSS Grid), accessibility standards (WCAG), and responsive typography.',
    myContribution: 'Designed the visual layout, built clean semantic components with HTML/CSS/JavaScript, and ensured cross-browser accessibility.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git / GitHub'],
    keyFeatures: [
      'Instant service categorization (Veterinary, Grooming, Boarding)',
      'Lightweight, fast client-side performance with zero heavy dependencies',
      'Fully responsive layout optimized for mobile smartphones and desktops',
      'Accessible UI with clear visual contrast and intuitive navigation',
    ],
    challenges: 'Creating an aesthetically polished, modern UI using pure vanilla technologies without reliance on heavy UI component libraries.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: false,
    category: 'Web Platforms',
    metrics: [
      { label: 'Design', value: 'Mobile-First / Accessible' },
      { label: 'Performance', value: '100 Lightweight Vanilla' },
    ],
  },
]

// ─────────────────────────────────────────────
//  JOURNEY (Verified Education & Experience)
// ─────────────────────────────────────────────
export interface JourneyItem {
  id: string
  period: string
  title: string
  subtitle: string
  institution: string
  description: string
  details?: string[]
  tags: string[]
  badge: string
  type: 'education' | 'experience' | 'achievement'
}

export const journeyData: JourneyItem[] = [
  {
    id: 'edu-amrita-btech',
    period: '2024 — 2028',
    title: 'B.Tech in Computer Science and Engineering',
    subtitle: 'Undergraduate Engineering Degree',
    institution: 'Amrita Vishwa Vidyapeetham',
    description: 'Undergraduate engineering program focusing on computer science fundamentals, data structures, algorithm design, operating systems, database management systems, and modern software engineering.',
    details: [
      'Current Academic Status: 1st/2nd Year Undergraduate (Class of 2024–2028) · CGPA: 6.58 / 10',
      'Core Studies: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Theory of Computation, Digital Logic',
      'Active focus on software engineering, machine learning pipelines, and full-stack web application development',
    ],
    tags: ['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'Python', 'C / C++'],
    badge: 'Class of 2028',
    type: 'education',
  },
  {
    id: 'exp-projects',
    period: '2024 — Present',
    title: 'Software Developer & Open Source Builder',
    subtitle: 'Web Platforms, AI/ML & Cybersecurity Tools',
    institution: 'Independent & Project R&D',
    description: 'Designing, building, and deploying real-world software applications spanning cybersecurity awareness, machine learning classification, and full-stack web platforms.',
    details: [
      'Developed SecuritySim, an interactive cybersecurity threat simulation and education platform',
      'Built Fraud Detection AI in Python and Scikit-learn with a live real-time Streamlit dashboard',
      'Engineered IdeaMatch, a multi-role project requirements and developer marketplace',
      'Continuous deployment via Vercel, Netlify, and modern version control workflows on GitHub',
    ],
    tags: ['React.js', 'Python', 'Scikit-learn', 'Streamlit', 'Next.js', 'MySQL'],
    badge: 'Software & AI/ML',
    type: 'experience',
  },
  {
    id: 'edu-cbse-12',
    period: '2024',
    title: 'Class XII Higher Secondary (CBSE)',
    subtitle: 'Senior Secondary Education',
    institution: 'Central Board of Secondary Education (CBSE)',
    description: 'Completed higher secondary education with a rigorous focus on Mathematics, Physics, Chemistry, and Computer Science.',
    details: [
      'Graduated with 77% in CBSE Board Examinations (Class XII)',
      'Strong analytical and mathematical grounding leading into Computer Science Engineering',
    ],
    tags: ['Mathematics', 'Physics', 'Computer Science', 'CBSE'],
    badge: '77% CBSE',
    type: 'education',
  },
  {
    id: 'edu-cbse-10',
    period: '2022',
    title: 'Class X Secondary School Examination (CBSE)',
    subtitle: 'Secondary Education',
    institution: 'Central Board of Secondary Education (CBSE)',
    description: 'Completed secondary education with high distinction, laying the foundation for engineering and computational studies.',
    details: [
      'Graduated with 87.4% in CBSE Board Examinations (Class X)',
      'Recognized for academic excellence and foundational problem solving',
    ],
    tags: ['Foundational Sciences', 'Mathematics', 'CBSE'],
    badge: '87.4% CBSE',
    type: 'achievement',
  },
]

// Backward compatibility exports
export const skills = skillsData
export const projects = projectsData
export const experiences = journeyData.filter(j => j.type === 'experience')
export const education = {
  degree: 'B.Tech — Computer Science and Engineering',
  institution: 'Amrita Vishwa Vidyapeetham',
  period: '2024 — 2028',
  year: 'Undergraduate (Class of 2028)',
  description: 'Studying core CS fundamentals, algorithms, operating systems, and building full-stack & AI software.',
}
export const achievements = journeyData.filter(j => j.type === 'achievement')
