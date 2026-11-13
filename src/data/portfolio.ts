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
  fullName: 'Chenthil Hari',
  title: 'Software Developer & Computer Science Student',
  subtitle: 'Building embedded microcontroller firmware, algorithm simulations, and full-stack web software.',
  tagline: 'Focused on low-level system determinism, clean architecture, and responsive web systems.',
  bio: [
    "I'm a 3rd-year Computer Science and Engineering undergraduate at Anna University / Engineering Institute in Tamil Nadu. My work balances embedded systems, microcontroller firmware, and modern full-stack web engineering.",
    "I focus on foundational engineering: writing deterministic C/C++ on ESP32 microcontrollers, running Proteus circuit validations before fabrication, modeling quantum gate transformations in Python, and building responsive web platforms with React and MongoDB.",
    "I care about writing clean, maintainable, and purposeful code that solves tangible problems — whether that means reducing signal cycle latency on physical intersections or structuring predictable database schemas."
  ],
  email: 'chenthilhari@gmail.com',
  github: 'https://github.com/Chenthil-Hari',
  githubUsername: 'Chenthil-Hari',
  linkedin: 'https://linkedin.com/in/chenthil-hari',
  resumeUrl: '/resume.pdf',
  avatar: '/avatar.jpg',
  location: 'Tamil Nadu, India',
  availability: 'Open to Software & Embedded Roles',
  stats: [
    { label: 'Degree Program', value: 'B.Tech CSE', helper: 'Anna University (2022–2026)' },
    { label: 'Primary Focus', value: 'Systems & Web', helper: 'Embedded C, Python, TypeScript' },
    { label: 'Base Location', value: 'Tamil Nadu', helper: 'India · UTC +05:30' },
  ],
}

// ─────────────────────────────────────────────
//  SKILLS MATRIX (Structured Disciplines)
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
    category: 'Core Languages',
    code: '01',
    description: 'Foundational languages used for algorithms, memory modeling, and systems logic.',
    skills: [
      { name: 'C / C++', context: 'Embedded firmware, pointer logic, algorithms', level: 'Advanced', highlight: true },
      { name: 'Python', context: 'NumPy simulations, quantum modeling, scripts', level: 'Advanced', highlight: true },
      { name: 'Java', context: 'Object-oriented architectures, DSA', level: 'Proficient', highlight: true },
      { name: 'TypeScript', context: 'Type-safe interfaces, backend schemas', level: 'Proficient', highlight: true },
      { name: 'JavaScript', context: 'Modern ES6+ frontend and Node.js runtimes', level: 'Advanced' },
    ],
  },
  {
    category: 'Embedded & Hardware Systems',
    code: '02',
    description: 'Microcontroller programming, circuit simulation, and peripheral communication.',
    skills: [
      { name: 'ESP32 / Arduino', context: 'Dual-core task scheduling, GPIO control', level: 'Advanced', highlight: true },
      { name: 'Embedded C/C++', context: 'Direct register manipulation, interrupts', level: 'Advanced', highlight: true },
      { name: 'Proteus VSM', context: 'Schematic capture & HEX firmware simulation', level: 'Proficient', highlight: true },
      { name: 'Serial & UART', context: 'Device telemetry, sensor data logging', level: 'Proficient' },
      { name: 'Sensor Interfacing', context: 'Density sensors, multiplexers, LEDs', level: 'Proficient' },
    ],
  },
  {
    category: 'Full-Stack Web Engineering',
    code: '03',
    description: 'Responsive user interfaces and resilient RESTful API endpoints.',
    skills: [
      { name: 'React.js', context: 'Component hierarchies, hooks, state machines', level: 'Advanced', highlight: true },
      { name: 'Node.js & Express', context: 'Serverless API endpoints, middleware', level: 'Proficient', highlight: true },
      { name: 'Tailwind CSS', context: 'Custom design systems, responsive layouts', level: 'Advanced' },
      { name: 'RESTful APIs', context: 'Validation, status contracts, rate limiting', level: 'Advanced' },
      { name: 'HTML5 & Modern CSS', context: 'Semantic markup, accessibility, CSS variables', level: 'Advanced' },
    ],
  },
  {
    category: 'Databases & Infrastructure',
    code: '04',
    description: 'Data persistence, version control, and cloud deployment pipelines.',
    skills: [
      { name: 'MongoDB', context: 'Document modeling, Atlas clusters, indexes', level: 'Proficient', highlight: true },
      { name: 'MySQL', context: 'Relational schemas, queries, normalization', level: 'Proficient' },
      { name: 'Git & GitHub', context: 'Branch workflows, versioning, code reviews', level: 'Advanced', highlight: true },
      { name: 'Vercel Platform', context: 'Edge rewrites, serverless functions, headers', level: 'Proficient' },
      { name: 'Linux / CLI Tooling', context: 'Shell scripting, environment configuration', level: 'Proficient' },
    ],
  },
]

// ─────────────────────────────────────────────
//  PROJECTS (Problem / Approach / Friction / Learned)
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
    problem: 'Traditional pre-programmed cycle timers waste green light duration on vacant roads while crowded cross-lanes suffer long vehicle queues, fuel waste, and unnecessary emissions.',
    approach: 'Engineered an autonomous microcontroller system using ESP32 and lane sensors to calculate vehicle density metrics and dynamically scale green-light intervals from 8s to 25s based on real-time traffic volume.',
    solution: 'Designed and built an autonomous microcontroller system using ESP32 and lane sensors to calculate vehicle density metrics and dynamically scale green-light intervals from 8s to 25s based on traffic volume.',
    friction: 'Ambient light noise and sunlight reflections caused severe false-positive edge triggers on infrared sensors during midday testing.',
    learned: 'Implemented software debouncing and threshold hysteresis logic inside the sensor polling loop, teaching me how physical environmental noise must be filtered at the firmware level.',
    myContribution: 'Engineered the embedded control firmware in Embedded C/C++, implemented the real-time proportional density algorithm, wired the sensor-to-LED multiplexing circuits, and built serial debugging logs.',
    technologies: ['ESP32', 'Embedded C/C++', 'IR Sensors', 'LED Multiplexing', 'UART Serial'],
    keyFeatures: [
      'Real-time traffic density calculation per lane',
      'Dynamic signal timing algorithm proportional to traffic backlog',
      'Priority override capability for emergency transit lanes',
      'Microcontroller multi-lane coordination on ESP32',
      'Serial monitor telemetry for live status inspection',
    ],
    challenges: 'Overcoming sensor noise fluctuations and false readings under varied lighting conditions. Calibrated threshold hysteresis to ensure reliable signal decisions.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    hasDemo: true,
    demoType: 'traffic',
    featured: true,
    category: 'Embedded / IoT',
    metrics: [
      { label: 'Latency', value: '< 50ms' },
      { label: 'Cycle Gain', value: '+35%' },
      { label: 'Platform', value: 'ESP32 Dual-Core' },
    ],
  },
  {
    id: 'quantum-sim',
    title: 'Quantum System Simulation Platform',
    tagline: 'Multi-qubit gate operations and decoherence modeling simulator',
    shortDescription: 'Mathematical modeling engine in Python for analyzing quantum gate transformations, state superposition, and decoherence damping effects.',
    description: 'A computational platform designed to simulate multi-qubit quantum states, common universal gate circuits (Hadamard, Pauli-X/Y/Z, CNOT), measurement collapse mechanics, and environmental decoherence channels.',
    problem: 'Physical quantum computers are inaccessible for university laboratory study, while abstract Dirac notation makes it difficult to visualize how state vectors evolve and decay under quantum noise.',
    approach: 'Built a vectorized linear algebra engine in Python using NumPy to compute unitary state transitions, model multi-qubit superposition, and simulate amplitude and phase damping noise channels.',
    solution: 'Constructed an open simulation platform using Python and NumPy that computes unitary state transitions, models state-vector superposition, and simulates amplitude and phase damping noise.',
    friction: 'Naive Kronecker tensor products for multi-qubit states quickly ran into exponential memory consumption (2^N dimensions), exhausting RAM on consumer hardware beyond 8 qubits.',
    learned: 'Vectorized tensor operations and used sparse matrix representations where applicable, gaining a deeper appreciation for algorithmic complexity and numerical stability in scientific computing.',
    myContribution: 'Designed state-vector matrix multiplication kernels, developed gate transformation libraries, implemented probabilistic measurement collapse, and visualized quantum probability densities.',
    technologies: ['Python', 'NumPy', 'Linear Algebra', 'Matplotlib', 'Quantum Mechanics'],
    keyFeatures: [
      'Universal quantum gate execution (Hadamard, Pauli X/Y/Z, Phase, CNOT)',
      'Probabilistic measurement collapse using Born rule sampling',
      'Decoherence models including amplitude damping and phase damping',
      'Matrix state vector evolution visualizations',
    ],
    challenges: 'Preserving numerical stability and normalization across state vectors during iterative decoherence transformations.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: true,
    category: 'Algorithms',
    metrics: [
      { label: 'Capacity', value: 'Up to 10 Qubits' },
      { label: 'Engine', value: 'NumPy Vectorized' },
      { label: 'Noise Models', value: '2 Channels' },
    ],
  },
  {
    id: 'proteus-simulation',
    title: 'Microcontroller Circuit Simulation (Proteus)',
    tagline: 'Embedded schematic design, peripheral interfacing & virtual validation',
    shortDescription: 'End-to-end hardware simulation testing microcontroller firmware, digital sensors, display modules, and driver circuits inside Proteus Design Suite.',
    description: 'A comprehensive circuit simulation and testing workspace built in Proteus. Simulates real-time microcontroller behavior, peripheral pin mapping, LCD/LED drivers, and analog-to-digital signal conversion before physical PCB fabrication.',
    problem: 'Physical breadboard prototyping frequently causes damaged microcontrollers, pin burnout, and lengthy debugging cycles caused by faulty jumper wires rather than code bugs.',
    approach: 'Designed verified virtual schematics in Proteus VSM, compiled C source code into HEX binaries, and executed real-time simulation with virtual oscilloscopes and logic analyzers.',
    solution: 'Designed and verified schematics virtually in Proteus Design Suite, linking compiled firmware binaries (HEX) to virtual ICs to validate timing, bus protocols, and logic behavior.',
    friction: 'Software clock timing in Proteus sometimes drifted from real physical oscillator crystals, causing initial UART baud rate mismatches.',
    learned: 'Mastered microcontroller register configuration for internal RC oscillators and baud rate dividers, learning to calibrate timing assumptions between simulation and physical hardware.',
    myContribution: 'Created circuit schematics, mapped pin routing, compiled microcontroller firmware into simulated chips, and analyzed waveform signals with virtual oscilloscopes.',
    technologies: ['Proteus VSM', 'Embedded C', 'Microcontrollers', 'Virtual Instrumentation', 'Schematic Capture'],
    keyFeatures: [
      'Virtual circuit prototyping and schematic capture',
      'HEX firmware loading and cycle-accurate execution',
      'Real-time virtual oscilloscope signal monitoring',
      'Peripheral integration with switches, relays, and displays',
    ],
    challenges: 'Ensuring clock cycle parity and simulating real-world sensor response delays inside the software execution model.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: true,
    category: 'Circuit Design',
    metrics: [
      { label: 'Validation', value: '100% Pre-fab' },
      { label: 'Software', value: 'Proteus VSM' },
      { label: 'Domain', value: 'Circuit Prototyping' },
    ],
  },
  {
    id: 'fullstack-contrib',
    title: 'Full-Stack Web Contributions',
    tagline: 'Feature development, transactional email integration, and API testing',
    shortDescription: 'Collaborative development across modern web tech stacks, delivering transactional email workflows, UI component upgrades, and backend stability.',
    description: 'Contributed to a real-world web application across both frontend and backend layers. Built modular React components, integrated transactional email APIs, resolved user-facing bugs, and authored unit tests.',
    problem: 'The web application lacked automated transactional notifications for key user actions, had mobile layout regressions, and lacked strict input sanitization on endpoints.',
    approach: 'Constructed serverless event triggers, built responsive UI elements with Tailwind, integrated Resend/SMTP transactional delivery, and enforced sanitization schemas.',
    solution: 'Implemented transactional email triggers, refined responsive UI components, resolved state bugs, and expanded API endpoint validation.',
    friction: 'Asynchronous email dispatch was occasionally causing endpoint latency spikes and timeouts when third-party mail gateways experienced transient delays.',
    learned: 'Decoupled email dispatch with non-blocking promises and error boundaries, learning how to isolate critical business logic from external third-party service latency.',
    myContribution: 'Built transactional email integration handlers, improved UI forms and layouts, fixed responsive layout regressions, and wrote integration tests.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Email Gateways'],
    keyFeatures: [
      'Transactional email delivery for user notifications',
      'Responsive React component development',
      'REST API route validation and error handling',
      'Bug fixes and test suite coverage improvements',
    ],
    challenges: 'Navigating an existing codebase, adhering to team architectural conventions, and ensuring seamless asynchronous email delivery.',
    githubUrl: 'https://github.com/Chenthil-Hari',
    featured: false,
    category: 'Web Apps',
    metrics: [
      { label: 'Stack', value: 'MERN' },
      { label: 'Architecture', value: 'Serverless REST' },
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
    description: 'Undergraduate engineering program focusing on computer architecture, algorithms, operating systems, database management systems, and microcontroller interfacing.',
    details: [
      'Core Coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS, Software Engineering',
      'Hands-on lab work: Microcontroller programming in C, Java OOP systems, and relational database schema design',
      'Active participant in technical symposiums and competitive coding challenges',
    ],
    tags: ['Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'C / C++', 'Java'],
    badge: '3rd Year Undergraduate',
    type: 'education',
  },
  {
    id: 'exp-embedded',
    period: '2023 — Present',
    title: 'Embedded Systems & Hardware Projects',
    subtitle: 'Independent Laboratory R&D',
    institution: 'Hardware & IoT Lab',
    description: 'Designing microcontroller systems, sensor integrations, and hardware prototypes using ESP32 and Arduino boards.',
    details: [
      'Built autonomous density-based traffic signal control using ESP32 microcontrollers',
      'Simulated complete embedded schematics and HEX firmware binaries in Proteus VSM',
      'Implemented serial telemetry and UART communication for live diagnostics',
    ],
    tags: ['ESP32', 'Embedded C', 'Proteus VSM', 'Sensors', 'UART'],
    badge: 'Hardware Engineering',
    type: 'experience',
  },
  {
    id: 'exp-web',
    period: '2024 — Present',
    title: 'Full-Stack Software Development',
    subtitle: 'Web Platforms & Services',
    institution: 'Collaborative & Open Projects',
    description: 'Developing full-stack web applications and services using React, TypeScript, Node.js, and MongoDB.',
    details: [
      'Engineered responsive web applications using React, Tailwind CSS, and TypeScript',
      'Developed serverless REST API endpoints with MongoDB Atlas storage',
      'Integrated transactional email notification workflows and calendar invite generation',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'REST APIs'],
    badge: 'Web Architecture',
    type: 'experience',
  },
  {
    id: 'ach-hackathons',
    period: '2023 — 2024',
    title: 'Technical Symposiums & Hackathons',
    subtitle: 'Competitions & Rapid Prototyping',
    institution: 'Inter-College Engineering Events',
    description: 'Participated in collegiate hackathons and technical symposiums, developing software prototypes under tight time constraints.',
    details: [
      'Collaborated in rapid problem-solving teams to ideate, prototype, and demonstrate technical solutions',
      'Presented architecture walkthroughs and live demonstrations to engineering panels',
    ],
    tags: ['Rapid Prototyping', 'System Design', 'Technical Presentation'],
    badge: 'Competitions',
    type: 'achievement',
  },
]

// Backward compatibility exports
export const skills = skillsData
export const projects = projectsData
export const experiences = journeyData.filter(j => j.type === 'experience')
export const education = {
  degree: 'B.Tech — Computer Science Engineering',
  institution: 'Anna University / Engineering Institute',
  period: '2022 — 2026',
  year: '3rd Year (Currently)',
  description: 'Studying core CS fundamentals, algorithms, operating systems, and computer architecture.',
}
export const achievements = journeyData.filter(j => j.type === 'achievement')
