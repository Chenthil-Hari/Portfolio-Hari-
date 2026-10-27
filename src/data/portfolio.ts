// ============================================================
//  PORTFOLIO DATA — Centralized Content Configuration
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
  fullName: 'Hari Subramanian',
  title: 'Software Developer & Computer Science Student',
  subtitle: 'Building practical systems, embedded software, and full-stack web applications.',
  tagline: 'Passionate about engineering reliable software, solving algorithmic problems, and bridging the gap between hardware and modern web interfaces.',
  bio: [
    "I'm a 3rd-year Computer Science and Engineering undergraduate who thrives on building practical, end-to-end technology solutions. My technical interests span embedded systems, IoT sensors, algorithm simulation, and full-stack web engineering.",
    "Whether designing dynamic traffic timing algorithms on ESP32 microcontrollers, modeling quantum gate operations in Python, or building responsive web platforms with React and MongoDB, I care deeply about writing clean, maintainable, and purposeful code.",
    "When I'm not writing code, I enjoy exploring new developer tools, participating in hackathons, and collaborating on open-source projects."
  ],
  email: 'harisub1404@gmail.com',
  github: 'https://github.com/Subramaniampb',
  githubUsername: 'Subramaniampb',
  linkedin: 'https://www.linkedin.com/in/hari-subramanian-pb',
  resumeUrl: '/resume.pdf',
  avatar: '/avatar.png',
  location: 'Tamil Nadu, India',
  availability: 'Open to Software & Embedded Roles',
  stats: [
    { label: 'Academic Standing', value: '3rd Year', helper: 'B.Tech CSE (2022–2026)' },
    { label: 'Completed Projects', value: '6+', helper: 'Web, Embedded & Simulation' },
    { label: 'Core Languages', value: '4+', helper: 'Java, Python, C/C++, JS' },
    { label: 'Location', value: 'India', helper: 'UTC +05:30' },
  ],
}

// ─────────────────────────────────────────────
//  SKILLS MATRIX
// ─────────────────────────────────────────────
export interface SkillItem {
  name: string
  icon: string
  level?: 'Advanced' | 'Proficient' | 'Familiar'
  highlight?: boolean
}

export interface SkillCategory {
  category: string
  description: string
  skills: SkillItem[]
}

export const skillsData: SkillCategory[] = [
  {
    category: 'Core Languages',
    description: 'Foundational languages used for algorithms, systems, and logic.',
    skills: [
      { name: 'Java', icon: '☕', level: 'Advanced', highlight: true },
      { name: 'Python', icon: '🐍', level: 'Advanced', highlight: true },
      { name: 'C', icon: '⚙️', level: 'Proficient' },
      { name: 'C++', icon: '⚡', level: 'Proficient' },
      { name: 'JavaScript', icon: '🟨', level: 'Advanced', highlight: true },
      { name: 'TypeScript', icon: '🔷', level: 'Proficient' },
    ],
  },
  {
    category: 'Full-Stack Web',
    description: 'Modern frontend interfaces and server-side RESTful architectures.',
    skills: [
      { name: 'React.js', icon: '⚛️', level: 'Advanced', highlight: true },
      { name: 'Node.js', icon: '🟢', level: 'Proficient', highlight: true },
      { name: 'Express.js', icon: '🚂', level: 'Proficient' },
      { name: 'Tailwind CSS', icon: '🎨', level: 'Advanced' },
      { name: 'REST APIs', icon: '🔌', level: 'Advanced' },
      { name: 'HTML5 / CSS3', icon: '🌐', level: 'Advanced' },
    ],
  },
  {
    category: 'Embedded & Hardware',
    description: 'Microcontroller programming, sensor integration, and circuit design.',
    skills: [
      { name: 'ESP32 / Arduino', icon: '📟', level: 'Advanced', highlight: true },
      { name: 'Embedded C/C++', icon: '🔌', level: 'Advanced', highlight: true },
      { name: 'Proteus Simulation', icon: '🔬', level: 'Proficient', highlight: true },
      { name: 'IoT Sensors & LEDs', icon: '💡', level: 'Proficient' },
      { name: 'UART / Serial Comms', icon: '📡', level: 'Proficient' },
    ],
  },
  {
    category: 'Databases & DevOps',
    description: 'Data storage engines, version control, and development environments.',
    skills: [
      { name: 'MongoDB', icon: '🍃', level: 'Proficient', highlight: true },
      { name: 'MySQL', icon: '🗄️', level: 'Proficient' },
      { name: 'Git & GitHub', icon: '🐙', level: 'Advanced', highlight: true },
      { name: 'VS Code', icon: '💻', level: 'Advanced' },
      { name: 'Vercel Deployments', icon: '▲', level: 'Proficient' },
    ],
  },
]

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────
export interface Project {
  id: string
  title: string
  tagline: string
  shortDescription: string
  description: string
  problem: string
  solution: string
  myContribution: string
  technologies: string[]
  keyFeatures: string[]
  challenges: string
  githubUrl: string
  liveUrl?: string
  hasDemo?: boolean
  demoType?: 'traffic' | 'video' | 'preview'
  featured: boolean
  category: 'Embedded / IoT' | 'Algorithms' | 'Web Apps' | 'Circuit Design'
  metrics?: { label: string; value: string }[]
}

export const projectsData: Project[] = [
  {
    id: 'smart-traffic',
    title: 'Smart Traffic Management System',
    tagline: 'Density-based dynamic signal allocation with ESP32 microcontrollers',
    shortDescription: 'Hardware-driven intelligent signal control that measures lane congestion in real time to dynamically compute green light windows.',
    description: 'An embedded systems project designed to solve urban intersection gridlock. Unlike traditional fixed-timer signals that waste time on empty lanes, this system utilizes real-time density sensors and dynamic scheduling logic to prioritize high-congestion lanes.',
    problem: 'Traditional pre-programmed cycle timers waste green light duration on vacant roads while crowded cross-lanes suffer long vehicle queues and unnecessary emissions.',
    solution: 'Designed and built an autonomous microcontroller system using ESP32 and lane sensors to calculate vehicle density metrics and dynamically scale green-light intervals from 8s to 25s based on traffic volume.',
    myContribution: 'Engineered the embedded control firmware in Embedded C/C++, implemented the real-time proportional density algorithm, wired the sensor-to-LED multiplexing circuits, and built serial debugging logs.',
    technologies: ['ESP32', 'Embedded C/C++', 'IR/Density Sensors', 'LED Matrices', 'UART Serial'],
    keyFeatures: [
      'Real-time traffic density calculation per lane',
      'Dynamic signal timing algorithm proportional to traffic backlog',
      'Priority override capability for emergency transit lanes',
      'Microcontroller multi-lane coordination on ESP32',
      'Serial monitor telemetry for live status inspection',
    ],
    challenges: 'Overcoming sensor noise fluctuations and false readings under varied lighting conditions. Calibrated threshold hysteresis to ensure reliable signal decisions.',
    githubUrl: 'https://github.com/Subramaniampb',
    hasDemo: true,
    demoType: 'traffic',
    featured: true,
    category: 'Embedded / IoT',
    metrics: [
      { label: 'Latency', value: '< 50ms' },
      { label: 'Cycle Efficiency', value: '+35%' },
      { label: 'Architecture', value: 'ESP32 Dual-Core' },
    ],
  },
  {
    id: 'quantum-sim',
    title: 'Quantum System Simulation Platform',
    tagline: 'Multi-qubit gate operations and decoherence modeling simulator',
    shortDescription: 'Mathematical modeling engine in Python for analyzing quantum gate transformations, state superposition, and decoherence damping effects.',
    description: 'A computational platform designed to simulate multi-qubit quantum states, common universal gate circuits (Hadamard, Pauli-X/Y/Z, CNOT), measurement collapse mechanics, and environmental decoherence channels.',
    problem: 'Physical quantum computers are inaccessible for regular classroom study, while theoretical mathematics makes it challenging to visualize how state vectors evolve and decay under quantum noise.',
    solution: 'Constructed an open simulation platform using Python and NumPy that computes unitary state transitions, models state-vector superposition, and simulates amplitude and phase damping noise.',
    myContribution: 'Designed state-vector matrix multiplication kernels, developed gate transformation libraries, implemented probabilistic measurement collapse, and visualized quantum probability densities.',
    technologies: ['Python', 'NumPy', 'Quantum Mechanics', 'Matplotlib', 'Linear Algebra'],
    keyFeatures: [
      'Universal quantum gate execution (Hadamard, Pauli X/Y/Z, Phase, CNOT)',
      'Probabilistic measurement collapse using Born rule sampling',
      'Decoherence models including amplitude damping and phase damping',
      'Matrix state vector evolution visualizations',
    ],
    challenges: 'Preserving numerical stability and normalization across state vectors during iterative decoherence transformations.',
    githubUrl: 'https://github.com/Subramaniampb',
    featured: true,
    category: 'Algorithms',
    metrics: [
      { label: 'Qubit Limit', value: 'Up to 10 Qubits' },
      { label: 'Core Math', value: 'NumPy Vectorized' },
      { label: 'Noise Models', value: '2 Channels' },
    ],
  },
  {
    id: 'proteus-simulation',
    title: 'Microcontroller Circuit Simulation (Proteus)',
    tagline: 'Embedded schematic design, peripheral interfacing & virtual validation',
    shortDescription: 'End-to-end hardware simulation testing microcontroller firmware, digital sensors, display modules, and driver circuits inside Proteus Design Suite.',
    description: 'A comprehensive circuit simulation and testing workspace built in Proteus. Simulates real-time microcontroller behavior, peripheral pin mapping, LCD/LED drivers, and analog-to-digital signal conversion before physical PCB fabrication.',
    problem: 'Hardware prototyping on breadboards often leads to burnt components, debugging bottlenecks, and costly hardware iteration delays.',
    solution: 'Designed and verified schematics virtually in Proteus Design Suite, linking compiled firmware binaries (HEX) to virtual ICs to validate timing, bus protocols, and logic behavior.',
    myContribution: 'Created circuit schematics, mapped pin routing, compiled microcontroller firmware into simulated chips, and analyzed waveform signals with virtual oscilloscopes.',
    technologies: ['Proteus Design Suite', 'Embedded C', 'Microcontrollers', 'Virtual Instrumentation', 'Schematics'],
    keyFeatures: [
      'Virtual circuit prototyping and schematic capture',
      'HEX firmware loading and cycle-accurate execution',
      'Real-time virtual oscilloscope signal monitoring',
      'Peripheral integration with switches, relays, and displays',
    ],
    challenges: 'Ensuring clock cycle parity and simulating real-world sensor response delays inside the software execution model.',
    githubUrl: 'https://github.com/Subramaniampb',
    featured: true,
    category: 'Circuit Design',
    metrics: [
      { label: 'Virtual Tests', value: '100% Pre-fab' },
      { label: 'Tool', value: 'Proteus VSM' },
      { label: 'Domain', value: 'Hardware Prototyping' },
    ],
  },
  {
    id: 'fullstack-contrib',
    title: 'Full-Stack Web Contributions',
    tagline: 'Feature development, transactional email integration, and API testing',
    shortDescription: 'Collaborative development across modern web tech stacks, delivering transactional email workflows, UI component upgrades, and backend stability.',
    description: 'Contributed to a real-world web application across both frontend and backend layers. Built modular React components, integrated transactional email APIs, resolved user-facing bugs, and authored unit tests.',
    problem: 'The production platform lacked automated notification workflows for user events, had UI inconsistencies on mobile, and needed enhanced test coverage.',
    solution: 'Implemented transactional email triggers, refined responsive UI components, resolved state bugs, and expanded API endpoint validation.',
    myContribution: 'Built transactional email integration handlers, improved UI forms and layouts, fixed responsive layout regressions, and wrote integration tests.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Email Service'],
    keyFeatures: [
      'Transactional email delivery for user notifications',
      'Responsive React component development',
      'REST API route validation and error handling',
      'Bug fixes and test suite coverage improvements',
    ],
    challenges: 'Navigating an existing codebase, adhering to team architectural conventions, and ensuring seamless asynchronous email delivery.',
    githubUrl: 'https://github.com/Subramaniampb',
    featured: false,
    category: 'Web Apps',
    metrics: [
      { label: 'Stack', value: 'MERN' },
      { label: 'Testing', value: 'Unit & Integration' },
    ],
  },
]

// ─────────────────────────────────────────────
//  JOURNEY (EXPERIENCE & EDUCATION)
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
    id: 'edu-btech',
    period: '2022 — 2026',
    title: 'B.Tech in Computer Science and Engineering',
    subtitle: 'Undergraduate Degree',
    institution: 'Anna University / Engineering Institute',
    description: 'Rigorous 4-year engineering curriculum covering data structures, algorithms, operating systems, database management, and computer architecture. Actively applying theoretical knowledge to embedded and web engineering projects.',
    details: [
      'Core Coursework: Data Structures & Algorithms, Computer Networks, Operating Systems, DBMS, Software Engineering',
      'Hands-on laboratory experience with Microprocessors, C/C++, Java, and Database Systems',
      'Active participant in technical club activities and competitive coding sessions',
    ],
    tags: ['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'Java', 'C++'],
    badge: 'Currently Enrolled (3rd Year)',
    type: 'education',
  },
  {
    id: 'exp-embedded',
    period: '2023 — Present',
    title: 'Embedded Systems & IoT Developer',
    subtitle: 'Personal & Academic R&D',
    institution: 'Hardware & IoT Lab',
    description: 'Designed and implemented autonomous hardware projects using ESP32 and Arduino microcontrollers. Focus on sensor integration, real-time control algorithms, and circuit simulation.',
    details: [
      'Developed density-based intelligent traffic signal management with ESP32',
      'Designed and simulated microcontroller schematics in Proteus before physical fabrication',
      'Authored modular Embedded C code for multi-threaded sensor polling and LED driver control',
    ],
    tags: ['ESP32', 'Embedded C', 'IoT', 'Proteus', 'Sensors'],
    badge: 'Hardware Engineering',
    type: 'experience',
  },
  {
    id: 'exp-web',
    period: '2024 — Present',
    title: 'Full-Stack Software Contributor',
    subtitle: 'Web Platforms & APIs',
    institution: 'Open Source & Collaborative Projects',
    description: 'Contributed to modern full-stack web applications using React, Node.js, Express, and MongoDB. Implemented automated email integrations and RESTful API endpoints.',
    details: [
      'Built reactive frontend components with Tailwind CSS and Framer Motion',
      'Constructed serverless API handlers for MongoDB Atlas CRUD operations',
      'Integrated third-party APIs for notifications and automated user messaging',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'REST APIs'],
    badge: 'Full-Stack Web',
    type: 'experience',
  },
  {
    id: 'ach-hackathons',
    period: '2023 — 2024',
    title: 'Hackathons & Technical Events',
    subtitle: 'Competitions & Hackathons',
    institution: 'Inter-College Technical Symposiums',
    description: 'Participated in regional and collegiate hackathons, working under tight time constraints to ideate, prototype, and present software and hardware solutions.',
    details: [
      'Collaborated in multi-disciplinary teams to build fast-paced prototypes',
      'Delivered live technical presentations and code walkthroughs to evaluation juries',
    ],
    tags: ['Problem Solving', 'Rapid Prototyping', 'Team Collaboration'],
    badge: 'Recognition',
    type: 'achievement',
  },
]

// ─────────────────────────────────────────────
//  BACKWARD COMPATIBILITY EXPORTS
// ─────────────────────────────────────────────
export const skills = skillsData
export const projects = projectsData

export const experiences = [
  {
    id: 'exp-1',
    role: 'Embedded Systems & IoT Developer',
    organization: 'Hardware & IoT Lab',
    period: '2023 — Present',
    description: 'Designed and built autonomous hardware projects using ESP32 microcontrollers, density sensors, and Proteus simulation.',
    tags: ['ESP32', 'Embedded C', 'IoT', 'Proteus'],
    type: 'project' as 'internship' | 'project' | 'activity',
  },
  {
    id: 'exp-2',
    role: 'Full-Stack Software Contributor',
    organization: 'Collaborative Web Platform',
    period: '2024 — Present',
    description: 'Contributed features, REST APIs, email notifications, and test suites across React, Node.js, and MongoDB.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    type: 'project' as 'internship' | 'project' | 'activity',
  },
  {
    id: 'exp-3',
    role: 'Technical Event Participant',
    organization: 'Hackathons & Symposiums',
    period: '2022 — Present',
    description: 'Participated in regional technical symposiums and competitive coding challenges.',
    tags: ['Algorithms', 'Prototyping', 'Teamwork'],
    type: 'activity' as 'internship' | 'project' | 'activity',
  },
]

export const education = {
  degree: 'B.Tech — Computer Science Engineering',
  institution: 'Engineering Institute',
  period: '2022 — 2026',
  year: '3rd Year (Currently)',
  description: 'Studying core CS fundamentals, algorithms, operating systems, and computer architecture.',
}

export const achievements = [
  {
    id: 'ach-1',
    title: 'Smart Traffic Management Hardware Demo',
    issuer: 'Technical Project Showcase',
    date: '2024',
    description: 'Developed and demonstrated an autonomous traffic control prototype using ESP32 and density algorithms.',
    type: 'achievement' as 'certification' | 'hackathon' | 'achievement' | 'workshop',
    link: '#',
  },
  {
    id: 'ach-2',
    title: 'Inter-College Hackathon Participant',
    issuer: 'Engineering Symposium',
    date: '2023',
    description: 'Collaborated on rapid software prototyping under time constraints.',
    type: 'hackathon' as 'certification' | 'hackathon' | 'achievement' | 'workshop',
    link: '#',
  },
]

