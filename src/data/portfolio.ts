// ============================================================
//  PORTFOLIO DATA — Edit this file to update all content
// ============================================================

export const personalInfo = {
  name: 'Hari',
  fullName: 'Hari',
  title: 'Computer Science Engineering Student',
  subtitle: 'Software Developer',
  tagline: 'Building practical software, solving problems, and turning ideas into clean, functional digital experiences.',
  about: `I'm a Computer Science Engineering student passionate about software development and building practical solutions. I enjoy working across frontend and backend technologies, debugging real-world problems, learning new technologies, and turning ideas into working products.`,
  email: 'harisub1404@gmail.com',
  github: 'https://github.com/Subramaniampb',
  githubUsername: 'Subramaniampb',
  linkedin: 'https://www.linkedin.com/in/hari-subramanian-pb',
  resumeUrl: '/resume.pdf',
  avatar: '/avatar.png', // Add your photo as avatar.png in the public folder
  location: 'India',
}

// ─────────────────────────────────────────────
//  SKILLS
// ─────────────────────────────────────────────
export interface Skill {
  name: string
  icon: string
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

export const skills: SkillCategory[] = [
  {
    category: 'Programming',
    skills: [
      { name: 'Java', icon: '☕' },
      { name: 'Python', icon: '🐍' },
      { name: 'C', icon: '⚙️' },
      { name: 'JavaScript', icon: '🟨' },
    ],
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'HTML', icon: '🌐' },
      { name: 'CSS', icon: '🎨' },
      { name: 'JavaScript', icon: '🟨' },
      { name: 'React', icon: '⚛️' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Express.js', icon: '🚂' },
      { name: 'REST APIs', icon: '🔌' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'MySQL', icon: '🗄️' },
      { name: 'MongoDB', icon: '🍃' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git', icon: '🌿' },
      { name: 'GitHub', icon: '🐙' },
      { name: 'VS Code', icon: '💻' },
    ],
  },
]

// ─────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────
export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  problem: string
  solution: string
  myContribution: string
  technologies: string[]
  keyFeatures: string[]
  challenges: string
  githubUrl: string
  liveUrl: string
  featured: boolean
  gradient: string
  role: string
}

export const projects: Project[] = [
  {
    id: 'smart-traffic',
    title: 'Smart Traffic Management System',
    shortDescription: 'Intelligent traffic signal system using density-based dynamic timing to improve traffic flow.',
    description: 'An intelligent traffic signal management system that uses real-time traffic-density input to dynamically control signal timing and significantly improve overall traffic flow at intersections.',
    problem: 'Traditional fixed-cycle traffic lights waste green time when traffic density is uneven, causing congestion and inefficiency at intersections.',
    solution: 'Developed an embedded system using ESP32 microcontrollers and density sensors to measure traffic at each lane in real-time, then dynamically allocate green-light time proportional to density — reducing idle wait time and improving throughput.',
    myContribution: 'Designed and implemented the full embedded system: sensor interfacing, the density-based timing algorithm in Embedded C/C++, LED signal control logic, and serial communication between modules.',
    technologies: ['ESP32', 'Embedded C/C++', 'Sensors', 'LEDs', 'Serial Communication'],
    keyFeatures: [
      'Real-time traffic density measurement via sensors',
      'Dynamic signal timing algorithm',
      'Multi-lane coordination with ESP32',
      'LED-based signal output',
      'Serial monitoring for debugging',
    ],
    challenges: 'Handling sensor noise and ensuring reliable real-time decision-making within tight microcontroller constraints. Calibrating thresholds for different traffic densities required iterative hardware testing.',
    githubUrl: 'https://github.com/Subramaniampb',
    liveUrl: '',
    featured: true,
    gradient: 'from-blue-600/20 to-cyan-600/20',
    role: 'Embedded Systems Developer',
  },
  {
    id: 'quantum-sim',
    title: 'Quantum System Simulation Platform',
    shortDescription: 'Simulation platform for analyzing multi-qubit gate operations and decoherence mechanisms.',
    description: 'A simulation platform designed to analyze multi-qubit gate operations, measurement processes, and major decoherence mechanisms in quantum computing systems.',
    problem: 'Understanding and visualizing quantum computing behavior — particularly qubit gate operations, measurements, and decoherence effects — requires simulation tools that can model these complex quantum phenomena accurately.',
    solution: 'Built a Python-based simulation platform that models multi-qubit systems, supports common quantum gates (Hadamard, CNOT, Pauli, etc.), simulates measurement collapse, and includes models for key decoherence mechanisms like amplitude damping and phase damping.',
    myContribution: 'Designed and developed the full simulation platform: quantum state representation, gate operation implementations, measurement simulation, decoherence models, and visualization outputs.',
    technologies: ['Python', 'NumPy', 'Quantum Computing', 'Simulation', 'Matplotlib'],
    keyFeatures: [
      'Multi-qubit state representation',
      'Common quantum gate library',
      'Measurement and state collapse simulation',
      'Amplitude damping & phase damping models',
      'Visualization of quantum state evolution',
    ],
    challenges: 'Accurately implementing decoherence models while maintaining numerical stability in state vector representations. Ensuring the simulation scaled reasonably with increasing qubit count.',
    githubUrl: 'https://github.com/Subramaniampb',
    liveUrl: '',
    featured: true,
    gradient: 'from-violet-600/20 to-purple-600/20',
    role: 'Python Developer',
  },
  {
    id: 'fullstack-contrib',
    title: 'Full-Stack Web Contributions',
    shortDescription: 'Feature development, email integration, bug fixes, and testing on a real-world web application.',
    description: 'Contributed to a real-world full-stack web application, working across both frontend and backend to deliver features, integrations, and quality improvements.',
    problem: 'The application needed email notification integration, had outstanding bugs affecting user experience, and required new frontend features and improved test coverage.',
    solution: 'Contributed across the stack — implemented transactional email integration, resolved reported bugs, developed and improved UI components on the frontend, and wrote tests to ensure code quality.',
    myContribution: 'This was a collaborative project. My specific contributions included: email service integration (using a transactional email API), frontend UI improvements and feature additions, targeted bug fixes, and writing unit and integration tests.',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Email API', 'REST APIs', 'JavaScript'],
    keyFeatures: [
      'Transactional email integration',
      'Frontend UI feature additions',
      'Bug fixes and stability improvements',
      'Unit and integration testing',
      'API endpoint improvements',
    ],
    challenges: 'Working within an existing codebase required quickly understanding the architecture and coding conventions. Ensuring email delivery reliability and writing tests for pre-existing, untested code paths.',
    githubUrl: 'https://github.com/Subramaniampb',
    liveUrl: '',
    featured: false,
    gradient: 'from-emerald-600/20 to-cyan-600/20',
    role: 'Full-Stack Contributor',
  },
]

// ─────────────────────────────────────────────
//  EXPERIENCE
// ─────────────────────────────────────────────
export interface Experience {
  id: string
  role: string
  organization: string
  period: string
  description: string
  tags: string[]
  type: 'internship' | 'project' | 'activity'
}

export const experiences: Experience[] = [
  {
    id: 'exp1',
    role: 'Open Source Contributor',
    organization: 'Personal & Academic Projects',
    period: '2023 — Present',
    description: 'Actively developing and maintaining personal projects spanning embedded systems, quantum simulation, and web development. Focused on writing clean, well-documented code.',
    tags: ['Python', 'JavaScript', 'Embedded C', 'React'],
    type: 'project',
  },
  {
    id: 'exp2',
    role: 'Full-Stack Web Contributor',
    organization: 'Collaborative Web Project',
    period: '2024',
    description: 'Contributed features, email integrations, bug fixes, and tests to a real-world web application as part of a collaborative development effort.',
    tags: ['Node.js', 'React', 'MongoDB', 'Express.js'],
    type: 'project',
  },
  {
    id: 'exp3',
    role: 'Technical Event Participant',
    organization: 'College & Online Platforms',
    period: '2022 — Present',
    description: 'Participated in hackathons, coding contests, technical workshops, and online coding challenges to continuously improve problem-solving and development skills.',
    tags: ['Hackathons', 'Coding Contests', 'Workshops'],
    type: 'activity',
  },
]

// ─────────────────────────────────────────────
//  EDUCATION
// ─────────────────────────────────────────────
export const education = {
  degree: 'B.Tech — Computer Science Engineering',
  institution: 'Your College Name',  // ← Update this
  period: '2022 — 2026',
  year: '3rd Year (Currently)',
  description: 'Studying core CS fundamentals, data structures and algorithms, operating systems, computer networks, databases, and software engineering. Complementing coursework with hands-on projects.',
}

// ─────────────────────────────────────────────
//  ACHIEVEMENTS / CERTIFICATIONS
// ─────────────────────────────────────────────
export interface Achievement {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  type: 'certification' | 'hackathon' | 'achievement' | 'workshop'
  link?: string
}

export const achievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Add Your Certification Here',
    issuer: 'Issuing Organization',
    date: 'Month YYYY',
    description: 'Brief description of what this certification covers and what you achieved.',
    type: 'certification',
    link: '#',
  },
  {
    id: 'ach2',
    title: 'Hackathon / Coding Event',
    issuer: 'Organizing Institution',
    date: 'Month YYYY',
    description: 'Describe the hackathon, what you built, and any awards or recognition received.',
    type: 'hackathon',
    link: '#',
  },
  {
    id: 'ach3',
    title: 'Workshop / Technical Training',
    issuer: 'Workshop Organizer',
    date: 'Month YYYY',
    description: 'Describe the workshop topics covered and key learnings.',
    type: 'workshop',
    link: '#',
  },
  {
    id: 'ach4',
    title: 'Add Another Achievement',
    issuer: 'Organization',
    date: 'Month YYYY',
    description: 'Add a coding competition, online course certificate, or academic achievement here.',
    type: 'achievement',
    link: '#',
  },
]
