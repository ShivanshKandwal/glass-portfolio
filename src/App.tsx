import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Mail, ArrowUpRight, GraduationCap, Briefcase, Sparkles, FolderGit2, Layers, Award, Terminal, Heart, Cpu, ChevronLeft, ChevronRight, CornerDownLeft } from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { Magnetic } from './components/Magnetic';
import { DragPhoto } from './components/DragPhoto';
import { ProjectRow } from './components/ProjectRow';
import type { ProjectData } from './components/ProjectRow';

// Asset imports
import workspaceImg from './assets/workspace.png';
import campusImg from './assets/campus.png';
import hackathonImg from './assets/hackathon.png';
import kairoWelcome from './assets/kairo_welcome.png';
import kairoDashboard from './assets/kairo_dashboard.png';
import kairoGeneration from './assets/kairo_generation.png';
import kairoCombine from './assets/kairo_combine.png';
import kairoEditing from './assets/kairo_editing.png';
import shivanshImg from './assets/shivansh.jpg';
import verbiqDashboard from './assets/verbiq_dashboard.png';
import verbiqFlowchart from './assets/verbiq_flowchart.png';
import paperCover from './assets/paper_cover.png';
import verbiqDebater from './assets/verbiq_debater.png';
import verbiqInterview from './assets/verbiq_interview.png';
import susPlay1 from './assets/sus_play1.png';
import susPlay2 from './assets/sus_play2.png';
import susLearn1 from './assets/sus_learn1.png';
import susLearn2 from './assets/sus_learn2.png';
import susEcoscan from './assets/sus_ecoscan.png';
import susLanding from './assets/sus_landing.jpg';
import susMinigames from './assets/sus_minigames.png';
import shopeasyOverview from './assets/shopeasy_overview.png';
import shopeasyConversion from './assets/shopeasy_conversion.png';
import shopeasyMarketing from './assets/shopeasy_marketing.png';
import shopeasySentiment from './assets/shopeasy_sentiment.png';

// Custom SVG Brand Icons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TerminalLine {
  text: string;
  type: 'system' | 'input' | 'output' | 'error' | 'success' | 'info' | 'header';
}

export default function App() {
  const [isHolding, setIsHolding] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Bento Cards toggle states for interactive flow diagrams
  const [kairoLogMode, setKairoLogMode] = useState(false);
  const [susLogMode, setSusLogMode] = useState(false);
  const [verbiqLogMode, setVerbiqLogMode] = useState(false);
  const [shopeasyLogMode, setShopeasyLogMode] = useState(false);

  const [kairoActiveImage, setKairoActiveImage] = useState<'welcome' | 'portal' | 'generate' | 'combine' | 'edit'>('portal');
  const [verbiqActiveImage, setVerbiqActiveImage] = useState<'dashboard' | 'debater' | 'interview'>('dashboard');
  const [susActiveImage, setSusActiveImage] = useState<'landing' | 'gameplay' | 'ecoscan'>('landing');
  const [shopeasyActiveImage, setShopeasyActiveImage] = useState<'overview' | 'conversion' | 'marketing' | 'sentiment'>('overview');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>('All');
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null);

  const verbiqImages = {
    dashboard: verbiqDashboard,
    debater: verbiqDebater,
    interview: verbiqInterview
  };

  const shopeasyImages = {
    overview: shopeasyOverview,
    conversion: shopeasyConversion,
    marketing: shopeasyMarketing,
    sentiment: shopeasySentiment
  };

  const kairoImages = {
    welcome: kairoWelcome,
    portal: kairoDashboard,
    generate: kairoGeneration,
    combine: kairoCombine,
    edit: kairoEditing
  };

  // Lightbox navigation helpers
  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedLightboxIndex !== null) {
      const filtered = activeGalleryFilter === 'All' 
        ? galleryItems 
        : galleryItems.filter(item => item.project === activeGalleryFilter);
      const nextIdx = (selectedLightboxIndex + 1) % filtered.length;
      setSelectedLightboxIndex(nextIdx);
    }
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedLightboxIndex !== null) {
      const filtered = activeGalleryFilter === 'All' 
        ? galleryItems 
        : galleryItems.filter(item => item.project === activeGalleryFilter);
      const prevIdx = (selectedLightboxIndex - 1 + filtered.length) % filtered.length;
      setSelectedLightboxIndex(prevIdx);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          const filtered = activeGalleryFilter === 'All' 
            ? galleryItems 
            : galleryItems.filter(item => item.project === activeGalleryFilter);
          setSelectedLightboxIndex((selectedLightboxIndex + 1) % filtered.length);
        } else if (e.key === 'ArrowLeft') {
          const filtered = activeGalleryFilter === 'All' 
            ? galleryItems 
            : galleryItems.filter(item => item.project === activeGalleryFilter);
          setSelectedLightboxIndex((selectedLightboxIndex - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Escape') {
          setSelectedLightboxIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLightboxIndex, activeGalleryFilter]);

  // CLI Terminal Console states
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: "Welcome to Shivansh Kandwal CLI v1.0.5", type: 'system' },
    { text: "System checks: OK. Packages active: 4. B.Tech CGPA: 9.58", type: 'success' },
    { text: "Type 'help' to see list of available command utilities.", type: 'info' },
    { text: "", type: 'system' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [activeModal, setActiveModal] = useState<'skills' | 'papers' | 'hackathons' | null>(null);
  const terminalHistoryRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  const photoContainerRef = useRef<HTMLDivElement | null>(null);
  const projectContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Global mouse position for cursor glow spotlight
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);

  // Spring animation for smooth cursor following
  const springGlowX = useSpring(glowX, { stiffness: 180, damping: 25 });
  const springGlowY = useSpring(glowY, { stiffness: 180, damping: 25 });

  // Projects ledger mouse tracking
  const ledgerMouseX = useMotionValue(0);
  const ledgerMouseY = useMotionValue(0);
  const springLedgerX = useSpring(ledgerMouseX, { stiffness: 180, damping: 22 });
  const springLedgerY = useSpring(ledgerMouseY, { stiffness: 180, damping: 22 });

  // Update mouse position coordinates globally
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [glowX, glowY]);

  // Handle active navigation highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'gallery', 'research', 'experience', 'academics'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto scroll terminal history inside its container (no page jumping)
  useEffect(() => {
    if (terminalHistoryRef.current) {
      terminalHistoryRef.current.scrollTo({
        top: terminalHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLines]);

  const handleProjectMouseMove = (e: React.MouseEvent) => {
    if (projectContainerRef.current) {
      const rect = projectContainerRef.current.getBoundingClientRect();
      ledgerMouseX.set(e.clientX - rect.left);
      ledgerMouseY.set(e.clientY - rect.top);
    }
  };

  const getFilteredCommands = (input: string) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return [];
    const commands = ['help', 'skills', 'papers', 'hackathons', 'clear'];
    return commands.filter(c => c.startsWith(trimmed));
  };

  const filteredSuggestions = getFilteredCommands(terminalInput);

  const getSuggestion = (input: string) => {
    if (!input) return '';
    const match = filteredSuggestions[0];
    return match ? match.slice(input.length) : '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault();
        setTerminalInput(filteredSuggestions[activeSuggestionIndex]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmdToRun = filteredSuggestions[activeSuggestionIndex];
        handleTerminalSubmit(undefined, cmdToRun);
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleTerminalSubmit();
      }
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    handleTerminalSubmit(undefined, cmd);
  };

  // Terminal commands handling
  const handleTerminalSubmit = (e?: React.FormEvent, forceCmd?: string) => {
    if (e) e.preventDefault();
    const cmd = (forceCmd || terminalInput).trim().toLowerCase();
    
    setTerminalInput('');
    setActiveSuggestionIndex(0);

    if (!cmd) return;

    const newLines: TerminalLine[] = [
      { text: `> ${cmd}`, type: 'input' }
    ];

    switch (cmd) {
      case 'help':
        newLines.push(
          { text: "Available Utilities:", type: 'header' },
          { text: "  help        - List commands", type: 'info' },
          { text: "  skills      - Show ML/Data Science matrix & triggers popup", type: 'info' },
          { text: "  papers      - Speech Emotion Recognition research details", type: 'info' },
          { text: "  hackathons  - Show awards, credentials & honors", type: 'info' },
          { text: "  clear       - Clear screen history", type: 'info' }
        );
        break;
      case 'skills':
        newLines.push(
          { text: "⚡ Launching skills matrix visualization popup...", type: 'success' },
          { text: "--- THEMATIC TECH MATRIX ---", type: 'header' },
          { text: "AI/ML & GenAI: Generative AI, Computer Vision, NLP, ComfyUI, Transformer Models", type: 'output' },
          { text: "Core ML: Data Analysis, Statistical Modeling, Feature Engineering, Model Evaluation", type: 'output' },
          { text: "Big Data: Hadoop, Spark, HDFS, MapReduce, Apache Sqoop", type: 'output' },
          { text: "Languages: Python, C++, C, JavaScript, Node.js, Express, Electron", type: 'output' }
        );
        setActiveModal('skills');
        break;
      case 'papers':
        newLines.push(
          { text: "📚 Launching Speech Emotion Recognition paper abstract popup...", type: 'success' },
          { text: "--- RESEARCH PUBLICATION (May 2026, IJSREM) ---", type: 'header' },
          { text: "Paper: ML-Based Prognostic Analysis of Hybrid Speech Emotion Recognition", type: 'output' },
          { text: "Metrics: Accuracy: 81.94% | Macro AUC: 0.9706", type: 'output' },
          { text: "Acoustic Features: 125-dim vector (MFCCs + Pause Ratio)", type: 'output' },
          { text: "Core Integration: Real-time LLM Gemini Live API coaching loop", type: 'output' }
        );
        setActiveModal('papers');
        break;
      case 'hackathons':
        newLines.push(
          { text: "🏆 Launching Hackathon credentials and honors popup...", type: 'success' },
          { text: "--- HACKATHON ACCOLADES ---", type: 'header' },
          { text: "  • 🥇 1st Place - Indian Knowledge System Exhibition (BPIT)", type: 'output' },
          { text: "  • 🥉 3rd Place - Data-Sphere Hackathon (NSUT, 2025)", type: 'output' },
          { text: "  • 🥉 3rd Place - Dataverse Hackathon (NSUT, 2024)", type: 'output' },
          { text: "  • SIH 2025 selected team (Problem Statement 25009)", type: 'output' }
        );
        setActiveModal('hackathons');
        break;
      case 'clear':
        setTerminalLines([]);
        return;
      default:
        newLines.push({ text: `Command not recognized: '${cmd}'. Type 'help' for utilities list.`, type: 'error' });
    }

    setTerminalLines(prev => [...prev, ...newLines, { text: "", type: 'system' }]);
    
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 10);
  };

  // Other repos for the Hover Peek list
  const otherProjects: ProjectData[] = [
    {
      title: "Cool-Mini-Games-I-Made",
      description: "Collection of interactive lightweight HTML5 games exploring 2D canvas rendering and custom logic.",
      tags: ["HTML5", "Canvas", "JS"],
      image: "https://raw.githubusercontent.com/ShivanshKandwal/Sus-10-Able-Game---SIH-Selected-Project/main/Images_susgame/mini%20games.png",
      githubUrl: "https://github.com/ShivanshKandwal/Cool-Mini-Games-I-Made",
      stars: "0",
      language: "HTML"
    },
    {
      title: "EcoScan AI Camera",
      description: "AI-powered vision assistant to classify waste lifecycles and calculate eco scores instantly.",
      tags: ["Python", "Ollama", "CV"],
      image: "https://raw.githubusercontent.com/ShivanshKandwal/Sus-10-Able-Game---SIH-Selected-Project/main/Images_susgame/ecoscan.png",
      githubUrl: "https://github.com/ShivanshKandwal/Sus-10-Able-Game---SIH-Selected-Project",
      stars: "1",
      language: "Python"
    }
  ];

  // Dynamic Cursor spotlight color based on active section
  const getGlowColor = () => {
    switch (activeSection) {
      case 'experience':
        return 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)';
      case 'academics':
        return 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)';
      default:
        return 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)';
    }
  };

  return (
    <div 
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      className={`min-h-screen relative w-full overflow-hidden transition-colors duration-1000 select-none pb-24 bg-blueprint ${
        isHolding ? 'is-holding bg-[#0A0518]' : 'bg-[#FDFBF7]'
      }`}
    >
      {/* Background Decorative Color Blobs & Meteor Shower */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />

        {/* Slow Meteor Shower Streaks */}
        <div className="meteor" style={{ top: '5%', left: '80%', animation: 'meteor-streak-lr 28s linear infinite', animationDelay: '0s' }} />
        <div className="meteor" style={{ top: '20%', left: '50%', animation: 'meteor-streak-lr 36s linear infinite', animationDelay: '5s' }} />
        <div className="meteor" style={{ top: '0%', left: '20%', animation: 'meteor-streak-lr 24s linear infinite', animationDelay: '10s' }} />
        <div className="meteor" style={{ top: '35%', left: '70%', animation: 'meteor-streak-lr 32s linear infinite', animationDelay: '15s' }} />
        <div className="meteor" style={{ top: '50%', left: '90%', animation: 'meteor-streak-lr 40s linear infinite', animationDelay: '2.5s' }} />
        <div className="meteor" style={{ top: '10%', left: '35%', animation: 'meteor-streak-lr 26s linear infinite', animationDelay: '20s' }} />
        <div className="meteor" style={{ top: '65%', left: '15%', animation: 'meteor-streak-lr 34s linear infinite', animationDelay: '7.5s' }} />
        <div className="meteor" style={{ top: '40%', left: '60%', animation: 'meteor-streak-lr 30s linear infinite', animationDelay: '12.5s' }} />
      </div>

      {/* Abstract Vector Wireframe SVGs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left: Rotating Wireframe Cube */}
        <svg className="absolute top-24 left-[5%] w-48 h-48 text-purple-700/5 shape-rotate" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" />
          <path d="M50 20 L50 50 M80 35 L50 50 M80 65 L50 50 M50 80 L50 50 M20 65 L50 50 M20 35 L50 50" />
          <circle cx="50" cy="20" r="1.5" fill="currentColor" />
          <circle cx="80" cy="35" r="1.5" fill="currentColor" />
          <circle cx="80" cy="65" r="1.5" fill="currentColor" />
          <circle cx="50" cy="80" r="1.5" fill="currentColor" />
          <circle cx="20" cy="65" r="1.5" fill="currentColor" />
          <circle cx="20" cy="35" r="1.5" fill="currentColor" />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
        </svg>

        {/* Top-Right: Constellation Network Graph */}
        <svg className="absolute top-36 right-[6%] w-64 h-64 text-emerald-700/5 shape-float" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="20" cy="30" r="2" fill="currentColor" />
          <circle cx="50" cy="20" r="2" fill="currentColor" />
          <circle cx="90" cy="40" r="2" fill="currentColor" />
          <circle cx="40" cy="70" r="2" fill="currentColor" />
          <circle cx="80" cy="80" r="2" fill="currentColor" />
          <circle cx="100" cy="90" r="2" fill="currentColor" />
          <circle cx="30" cy="100" r="2" fill="currentColor" />
          
          <line x1="20" y1="30" x2="50" y2="20" />
          <line x1="50" y1="20" x2="90" y2="40" />
          <line x1="40" y1="70" x2="20" y2="30" />
          <line x1="40" y1="70" x2="50" y2="20" />
          <line x1="40" y1="70" x2="80" y2="80" />
          <line x1="90" y1="40" x2="80" y2="80" />
          <line x1="80" y1="80" x2="100" y2="90" />
          <line x1="40" y1="70" x2="30" y2="100" />
          <line x1="80" y1="80" x2="30" y2="100" />
        </svg>

        {/* Middle-Right: Sine Wave Mesh */}
        <svg className="absolute top-[48%] right-2 w-72 h-36 text-purple-700/5" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50" />
          <path d="M0,60 Q25,30 50,60 T100,60 T150,60 T200,60" opacity="0.7" />
          <path d="M0,40 Q25,10 50,40 T100,40 T150,40 T200,40" opacity="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="2,2" />
          <line x1="100" y1="0" x2="100" y2="100" strokeDasharray="2,2" />
          <line x1="150" y1="0" x2="150" y2="100" strokeDasharray="2,2" />
        </svg>

        {/* Bottom-Left: Coordinate Axes Grid */}
        <svg className="absolute bottom-16 left-[4%] w-56 h-56 text-amber-700/5" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <line x1="10" y1="90" x2="90" y2="90" />
          <line x1="10" y1="90" x2="10" y2="10" />
          <path d="M10,90 L90,10" strokeDasharray="1,1" />
          <line x1="30" y1="90" x2="30" y2="87" />
          <line x1="50" y1="90" x2="50" y2="87" />
          <line x1="70" y1="90" x2="70" y2="87" />
          <line x1="10" y1="70" x2="13" y2="70" />
          <line x1="10" y1="50" x2="13" y2="50" />
          <line x1="10" y1="30" x2="13" y2="30" />
          <text x="92" y="93" fontSize="4" fill="currentColor" opacity="0.6">X</text>
          <text x="8" y="7" fontSize="4" fill="currentColor" opacity="0.6">Y</text>
        </svg>
      </div>

      {/* Dynamic Cursor spotlight follow glow */}
      <motion.div 
        className="cursor-glow-blob"
        style={{
          left: springGlowX,
          top: springGlowY,
          background: getGlowColor()
        }}
      />

      {/* Floating Navigation Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-[#2C2523]">
              SK.
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md border border-purple-200/50 font-mono font-semibold">
              AI & Data Science
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            {['home', 'about', 'projects', 'gallery', 'research', 'experience', 'academics'].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                className={`text-xs md:text-sm px-3.5 py-1.5 rounded-xl capitalize font-medium transition-all duration-300 ${
                  activeSection === sec
                    ? 'bg-[#2C2523] text-white shadow-sm'
                    : 'text-[#7D7468] hover:text-[#2C2523] hover:bg-white/40'
                }`}
              >
                {sec}
              </a>
            ))}
          </div>

          {/* Social Cluster */}
          <div className="flex items-center gap-1">
            <Magnetic strength={0.35}>
              <a 
                href="https://github.com/ShivanshKandwal" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D7468] hover:text-[#2C2523] hover:bg-white/40 transition-colors duration-300"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <a 
                href="https://linkedin.com/in/shivansh-kandwal" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D7468] hover:text-[#2C2523] hover:bg-white/40 transition-colors duration-300"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <a 
                href="mailto:shivanshkandwal1@gmail.com"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D7468] hover:text-[#2C2523] hover:bg-white/40 transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Main Wide Layout Grid */}
      <main className="relative z-10 max-w-[94%] xl:max-w-7xl mx-auto px-4 pt-32 flex flex-col gap-16 md:gap-24">
        
        {/* Section 1: Hero */}
        <motion.section 
          id="home" 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[70vh] flex flex-col justify-center py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            {/* Left Biography */}
            <div className="lg:col-span-3 flex flex-col gap-5 text-left">
              <div className="inline-flex items-center gap-2 bg-[#F0FDF4]/80 dark:bg-emerald-950/30 border border-emerald-200/60 px-3.5 py-1 rounded-full w-fit">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                  Data Scientist & AI Systems
                </span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-neutral-800 tracking-tight">
                Shivansh <br />
                <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-transparent bg-clip-text font-serif italic font-bold">Kandwal</span>.
              </h1>
              
              <p className="text-base md:text-lg text-[#7D7468] font-light leading-relaxed max-w-2xl">
                I build end-to-end Machine Learning pipelines and full-stack Generative AI applications. 
                Connecting robust systems (Hadoop, ComfyUI backend wrappers) with highly interactive browser interfaces.
              </p>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/10 rounded-2xl p-4 border border-white/20 max-w-xl shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-purple-600">9.58</h3>
                  <p className="text-[10px] text-[#908576] font-bold uppercase tracking-wider">B.Tech CGPA</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-emerald-600">SIH</h3>
                  <p className="text-[10px] text-[#908576] font-bold uppercase tracking-wider">Selected 2025</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-amber-500">10+</h3>
                  <p className="text-[10px] text-[#908576] font-bold uppercase tracking-wider">Repositories</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-sky-500">1st</h3>
                  <p className="text-[10px] text-[#908576] font-bold uppercase tracking-wider">Hackathon Gold</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a 
                  href="#projects" 
                  className="bg-[#2C2523] text-white hover:bg-[#443B38] px-6 py-3 rounded-full text-sm font-medium shadow-md transition-all duration-300 flex items-center gap-2 group"
                >
                  Priority Projects 
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a 
                  href="#about" 
                  className="bg-white/30 border border-[#E6DFD5]/80 hover:bg-white/60 px-6 py-3 rounded-full text-sm font-medium text-[#7D7468] hover:text-[#2C2523] transition-all duration-300"
                >
                  About Me
                </a>
              </div>
            </div>

            {/* Right Column: Functional CLI Terminal */}
            <div className="lg:col-span-2 w-full">
              <GlassCard  
                className="w-full font-mono text-xs text-[#2C2523] h-[350px] flex flex-col p-4 overflow-hidden border-purple-200/50 bg-stone-900/5 shadow-inner cursor-text relative"
                shadowColor="rgba(168, 85, 247, 0.15)"
                onClick={() => inputRef.current?.focus({ preventScroll: true })}
              >
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]/40 mb-3 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="text-[10px] font-bold text-[#908576] tracking-wide uppercase flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-purple-600 animate-pulse" />
                    Interactive Console
                  </span>
                </div>

                {/* History list */}
                <div 
                  ref={terminalHistoryRef}
                  className="flex-1 overflow-y-auto text-left flex flex-col gap-1 pr-1 terminal-history-scroll"
                >
                  {terminalLines.map((line, i) => {
                    if (line.text === "" && i === terminalLines.length - 1) return null;
                    if (line.text === "") return <div key={i} className="h-1" />;
                    
                    let lineClass = "";
                    let prefix = null;
                    
                    switch(line.type) {
                      case 'input':
                        lineClass = "text-purple-600 font-semibold flex items-center gap-1";
                        prefix = <span className="text-purple-500/60 font-bold">&gt;</span>;
                        break;
                      case 'error':
                        lineClass = "bg-rose-500/10 border-l-2 border-rose-500 text-rose-600 px-2.5 py-1.5 rounded-r-xl font-medium flex items-center gap-1.5 my-1 text-[11px]";
                        prefix = <span className="text-rose-500 text-xs font-serif">⚠️</span>;
                        break;
                      case 'success':
                        lineClass = "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-600 px-2.5 py-1.5 rounded-r-xl font-medium flex items-center gap-1.5 my-1 text-[11px]";
                        prefix = <span className="text-emerald-500 text-xs font-serif">⚡</span>;
                        break;
                      case 'header':
                        lineClass = "text-amber-600 font-bold uppercase tracking-wider border-b border-amber-500/20 pb-0.5 mt-2.5 mb-1.5 text-[10px]";
                        break;
                      case 'info':
                        lineClass = "text-purple-700/80 font-medium pl-2.5 border-l border-purple-300/40 my-0.5";
                        break;
                      case 'system':
                        lineClass = "text-stone-400 font-light italic pl-1";
                        break;
                      case 'output':
                      default:
                        lineClass = "text-stone-700/90 pl-3 border-l border-stone-200 my-0.5";
                    }
                    
                    return (
                      <div 
                        key={i} 
                        className={`whitespace-pre-wrap leading-relaxed select-text transition-colors duration-300 ${lineClass}`}
                      >
                        {prefix}
                        {line.text}
                      </div>
                    );
                  })}
                </div>

                {/* Suggestions Popover Dropdown */}
                <AnimatePresence>
                  {filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-16 left-4 right-4 z-30 bg-[#140E24]/95 backdrop-blur-md rounded-2xl border border-purple-500/40 p-2 shadow-2xl flex flex-col gap-0.5 max-h-[140px] overflow-y-auto select-none text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-[9px] text-purple-400/80 px-2.5 py-1 border-b border-purple-900/40 font-bold uppercase tracking-wider flex justify-between items-center">
                        <span>Suggestions</span>
                        <span className="font-sans normal-case text-purple-500 text-[8px] font-semibold">Use ↑↓ to select • Tab/Enter to submit</span>
                      </div>
                      {filteredSuggestions.map((cmd, idx) => {
                        const descMap: Record<string, string> = {
                          help: "List all utility commands",
                          skills: "Inspect ML & Data Science skills matrix",
                          papers: "Open Speech Emotion Recognition research details",
                          hackathons: "View awards and developer credentials",
                          clear: "Clear screen history"
                        };
                        const isSelected = idx === activeSuggestionIndex;
                        return (
                          <div
                            key={cmd}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuggestionClick(cmd);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-150 ${
                              isSelected 
                                ? 'bg-purple-600 text-white shadow-md' 
                                : 'text-purple-200 hover:bg-purple-950/50 hover:text-white'
                            }`}
                          >
                            <span className="font-mono font-semibold">{cmd}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-purple-100 font-light' : 'text-purple-400 font-light'}`}>
                              {descMap[cmd]}
                            </span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Terminal input form */}
                <form 
                  onSubmit={handleTerminalSubmit} 
                  className="flex flex-col gap-2 mt-3 pt-2 border-t border-[#E6DFD5]/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Suggestions Chips Row */}
                  <div className="flex flex-wrap gap-1.5 select-none items-center">
                    <span className="text-[10px] text-stone-500/80 font-mono">Suggest:</span>
                    {['help', 'skills', 'papers', 'hackathons', 'clear'].map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(cmd);
                        }}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#2C2523]/5 hover:bg-purple-600 hover:text-white border border-[#E6DFD5]/40 text-[#7D7468] hover:border-purple-300 transition-all cursor-pointer"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  {/* Input field wrapper */}
                  <div className="flex items-center gap-1 relative">
                    <ChevronRight className="w-4 h-4 text-purple-600 select-none shrink-0" />
                    
                    {/* Real Input element */}
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type 'help'..."
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#2C2523] placeholder-stone-500/70 z-10"
                      autoComplete="off"
                      spellCheck="false"
                    />

                    {/* Autocomplete Ghost Text */}
                    {terminalInput && getSuggestion(terminalInput) && (
                      <span className="absolute left-[21px] font-mono text-xs text-stone-400/50 pointer-events-none select-none z-0">
                        {terminalInput.replace(/./g, '\u00a0')}
                        <span className="text-stone-400/70">{getSuggestion(terminalInput)}</span>
                        <span className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.2 rounded border border-stone-200 ml-1.5 font-sans font-bold">Tab</span>
                      </span>
                    )}

                    <button type="submit" className="text-stone-400 hover:text-purple-600 transition-colors p-1 shrink-0 cursor-pointer z-10" title="Submit command">
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        </motion.section>

        {/* Section 1.5: About Me */}
        <motion.section 
          id="about" 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="py-8 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left Column: Portrait Photo */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <GlassCard 
                className="w-full aspect-[4/5] max-w-sm mx-auto overflow-hidden p-3 relative group"
                shadowColor="rgba(168, 85, 247, 0.2)"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-[#E6DFD5]/40 shadow-inner">
                  <img 
                    src={shivanshImg} 
                    alt="Shivansh Kandwal Portrait" 
                    className="w-full h-full object-cover object-top scale-[1.02] group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0518]/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-md">
                    <span className="text-[10px] font-bold text-purple-700 tracking-wider uppercase font-mono">
                      Shivansh Kandwal
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Narrative Biography & Links */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5.5 h-5.5 text-purple-600 animate-pulse" />
                  <h2 className="text-3xl font-serif font-semibold bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-transparent bg-clip-text">
                    About Me
                  </h2>
                </div>
                <p className="text-sm md:text-base text-[#7D7468] font-light leading-relaxed">
                  I am a Computer Science Engineering student specializing in Data Science at **Bhagwan Parshuram Institute of Technology** (BPIT), currently holding a **9.58 CGPA**. I specialize in full-stack AI orchestration, big data systems engineering, and machine learning pipeline optimizations.
                </p>
              </div>

              <div className="text-sm text-[#7D7468] leading-relaxed font-light flex flex-col gap-4">
                <p>
                  Currently, I am working as a **Data Scientist Intern** at **Ingenious Press Pvt Ltd** within the Data Analytics Department, focusing on Database Administration (DBA), schema optimizations, and constructing end-to-end Data Science project workflows.
                </p>
                <p>
                  During my previous internship at Silverzone Enterprise India, I developed **Kairo**, an Electron-based desktop application serving as a local network proxy host for ComfyUI backends. I designed modular node routing schemas for FLUX.1 Kontext 12B transformer models, establishing high-speed, local workflow executions.
                </p>
                <p>
                  I am certified by **Samsung Innovation Campus** in Big Data cluster computing, with hands-on proficiency in Hadoop architectures, MapReduce paradigms, HDFS nodes, Spark pipelines, and Apache Sqoop data integrations.
                </p>
                <p>
                  Additionally, I have authored research in Speech Emotion Recognition utilizing Hybrid DNN architectures (achieving 81.94% accuracy with 125-dimensional acoustic feature vectors) and led multiple teams to top placements in NSUT Hackathons (Data-Sphere 2025, Dataverse 2024) and BPIT exhibitions, alongside team selection for the Smart India Hackathon (SIH) 2025.
                </p>
              </div>

              {/* Quick Links & Resume Download Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                <a 
                  href="/resume.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2C2523] text-white hover:bg-purple-700 px-6 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Download Resume 
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                
                <div className="flex items-center justify-center gap-3">
                  <a 
                    href="https://github.com/ShivanshKandwal" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial text-xs font-semibold text-[#7D7468] hover:text-[#2C2523] px-4 py-3.5 rounded-full border border-[#E6DFD5] hover:bg-white/40 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <GithubIcon className="w-4 h-4" /> GitHub
                  </a>
                  <a 
                    href="https://linkedin.com/in/shivansh-kandwal" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial text-xs font-semibold text-[#7D7468] hover:text-[#2C2523] px-4 py-3.5 rounded-full border border-[#E6DFD5] hover:bg-white/40 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <LinkedinIcon className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Section 2: Selected Work & Bento Grid */}
        <section id="projects" className="py-8">
          <div className="flex flex-col gap-4 text-left mb-10">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-serif font-medium text-[#2C2523]">
                Selected Work & Projects
              </h2>
            </div>
            <p className="text-[#7D7468] text-sm md:text-base font-light max-w-xl">
              Curated Machine Learning and Generative AI platforms. Click the interactive widgets inside cards to inspect systemic details.
            </p>
          </div>

          {/* 2-Column Bento Grid for Priority Projects (Wider, Bigger Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Card 1: Kairo */}
            <GlassCard 
              className="glass-ai flex flex-col gap-6 text-left h-full"
              shadowColor="rgba(168, 85, 247, 0.22)"
            >
              <div className="flex items-center justify-between pb-3 border-b border-purple-200/40">
                <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded border border-purple-100 uppercase tracking-wider">
                  Generative AI / Host
                </span>
                <span className="text-[10px] text-[#908576] font-mono">★ 4</span>
              </div>

              <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                <h3 className="font-serif text-2xl font-semibold text-[#2C2523]">
                  Kairo
                </h3>

                {/* Interactive Screenshot Switcher */}
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E6DFD5]/40 relative group mb-2">
                  <img 
                    src={kairoImages[kairoActiveImage]} 
                    alt={`Kairo ${kairoActiveImage}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-2 right-2 flex flex-wrap justify-center gap-1.5 z-20">
                    {(['welcome', 'portal', 'generate', 'combine', 'edit'] as const).map((imgKey) => (
                      <button
                        key={imgKey}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKairoActiveImage(imgKey);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                          kairoActiveImage === imgKey
                            ? 'bg-purple-600 text-white shadow-md scale-105'
                            : 'bg-white/90 text-stone-700 hover:bg-white'
                        }`}
                      >
                        {imgKey === 'welcome' ? 'Welcome' : imgKey === 'portal' ? 'Portal Dashboard' : imgKey === 'generate' ? 'Generator' : imgKey === 'combine' ? 'Combine' : 'Editor'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {!kairoLogMode ? (
                    <motion.p 
                      key="desc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[#7D7468] leading-relaxed font-light"
                    >
                      A user-friendly desktop application acting as a network host for ComfyUI backends. Exposes resources locally so users can connect from any device via browser. Exposes local workflows and FLUX.1 Kontext 12B transformer models.
                    </motion.p>
                  ) : (
                    <motion.div 
                      key="logs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-stone-900/5 p-3 rounded-xl border border-purple-200/30 font-mono text-[10px] text-purple-700 leading-normal"
                    >
                      {`[Kairo Web Client]
       │
       ▼ (kairo.local:7860)
[Express Host Proxy]
       │
       ▼ (localhost:8188)
[ComfyUI Server]
       │
       ▼ (FLUX.1 [Dev] 12B Model)`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-200/40 mt-auto">
                <button 
                  onClick={() => setKairoLogMode(!kairoLogMode)}
                  className="text-xs font-mono text-purple-600 hover:text-purple-800 underline cursor-pointer"
                >
                  {kairoLogMode ? "Show Details" : "Inspect Schema"}
                </button>
                <a 
                  href="https://github.com/ShivanshKandwal/Kairo---image-generation-and-editing-frontend-application-based-on-comfyui-backend" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
                >
                  Repo <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>

            {/* Card 2: Sus-10-Able */}
            <GlassCard 
              className="glass-ds flex flex-col gap-6 text-left h-full"
              shadowColor="rgba(16, 185, 129, 0.22)"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/40">
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">
                  Computer Vision / Godot 4
                </span>
                <span className="text-[10px] text-[#908576] font-mono">★ 1</span>
              </div>

              <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                <h3 className="font-serif text-2xl font-semibold text-[#2C2523]">
                  Sus-10-Able
                </h3>

                {/* Interactive Screenshot Switcher */}
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E6DFD5]/40 relative group mb-2">
                  <img 
                    src={susActiveImage === 'landing' ? susLanding : susActiveImage === 'gameplay' ? susPlay1 : susEcoscan} 
                    alt={`Sus-10-Able ${susActiveImage}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-2 right-2 flex flex-wrap justify-center gap-1.5 z-20">
                    {(['landing', 'gameplay', 'ecoscan'] as const).map((imgKey) => (
                      <button
                        key={imgKey}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSusActiveImage(imgKey);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                          susActiveImage === imgKey
                            ? 'bg-emerald-600 text-white shadow-md scale-105'
                            : 'bg-white/90 text-stone-700 hover:bg-white'
                        }`}
                      >
                        {imgKey === 'landing' ? 'Welcome Portal' : imgKey === 'gameplay' ? 'Cemetery Quest' : 'EcoScan AI'}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!susLogMode ? (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-2"
                    >
                      <p className="text-sm text-[#7D7468] leading-relaxed font-light">
                        Gamified environmental education platform built for SIH. Combines 2D pixel platformer game and AI-powered EcoScan camera utility.
                      </p>
                      <div className="text-[11px] bg-emerald-50/70 p-2 rounded-xl text-emerald-800 font-serif leading-snug border border-emerald-100/60 mt-1">
                        {"Score = (Material * 0.2) + (Lifecycle * 0.5) + (Disposal * 0.3)"}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="logs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-stone-900/5 p-3 rounded-xl border border-emerald-200/30 font-mono text-[9px] text-emerald-700 leading-snug"
                    >
                      {`[INIT] SIH 2025 Game Ready
[INFO] EcoScan pipeline active
[CALC] Weight: Life 50%, Disp 30%
[GPU] Gemma-3-4B local Ollama
[RUN] Scan: Plastic Bottle (Score 34)`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-200/40 mt-auto">
                <button 
                  onClick={() => setSusLogMode(!susLogMode)}
                  className="text-xs font-mono text-emerald-600 hover:text-emerald-800 underline cursor-pointer"
                >
                  {susLogMode ? "Show Details" : "Inference Logs"}
                </button>
                <a 
                  href="https://github.com/ShivanshKandwal/Sus-10-Able-Game---SIH-Selected-Project" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                >
                  Repo <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>

            {/* Card 3: VerbIQ */}
            <GlassCard 
              className="glass-pub flex flex-col gap-6 text-left h-full"
              shadowColor="rgba(14, 165, 233, 0.22)"
            >
              <div className="flex items-center justify-between pb-3 border-b border-sky-200/40">
                <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2.5 py-1 rounded border border-sky-100 uppercase tracking-wider">
                  Speech Emotion Recognition / Gemini Live API
                </span>
                <span className="text-[10px] text-[#908576] font-mono">★ 1</span>
              </div>

              <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                <h3 className="font-serif text-2xl font-semibold text-[#2C2523]">
                  VerbIQ Coaching Bot
                </h3>

                {/* Interactive Screenshot Switcher */}
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E6DFD5]/40 relative group mb-2">
                  <img 
                    src={verbiqImages[verbiqActiveImage]} 
                    alt={`VerbIQ ${verbiqActiveImage}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-2 right-2 flex flex-wrap justify-center gap-1.5 z-20">
                    {(['dashboard', 'debater', 'interview'] as const).map((imgKey) => (
                      <button
                        key={imgKey}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVerbiqActiveImage(imgKey);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                          verbiqActiveImage === imgKey
                            ? 'bg-sky-600 text-white shadow-md scale-105'
                            : 'bg-white/90 text-stone-700 hover:bg-white'
                        }`}
                      >
                        {imgKey === 'dashboard' ? 'Analytics Dashboard' : imgKey === 'debater' ? 'Debater Arena' : 'Interview Prep'}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!verbiqLogMode ? (
                    <motion.p 
                      key="desc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[#7D7468] leading-relaxed font-light"
                    >
                      A hybrid Speech Emotion Recognition (SER) coaching bot integrated with Gemini Live API for real-time tone evaluation (Professional, Casual, Stressful, Friendly) and pacing analysis (Confidence, Pause Ratio, Engagement) during simulated mock interviews and debates.
                    </motion.p>
                  ) : (
                    <motion.div 
                      key="logs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-stone-900/5 p-3 rounded-xl border border-sky-200/30 font-mono text-[9px] text-sky-700 leading-snug"
                    >
                      {`[Acoustic Feature Extractor]
  ├── MFCCs (40 static + 40 delta + 40 delta-delta)
  ├── Zero-Crossing Rate & RMS Energy
  ├── Chroma STFT & Spectral Centroid
  └── Custom Speech Pause Ratio metric
[Classification Engine]
  └── Baseline DNN accuracy: 81.94%
[Gemini Live API Loop]
  └── Low-latency verbal feedback response`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-sky-200/40 mt-auto">
                <button 
                  onClick={() => setVerbiqLogMode(!verbiqLogMode)}
                  className="text-xs font-mono text-sky-600 hover:text-sky-800 underline cursor-pointer"
                >
                  {verbiqLogMode ? "Show Details" : "Inference Stats"}
                </button>
                <a 
                  href="https://github.com/ShivanshKandwal/VerbIQ-Final-Build" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
                >
                  Repo <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>

            {/* Card 4: ShopEasy */}
            <GlassCard 
              className="glass-bd flex flex-col gap-6 text-left h-full"
              shadowColor="rgba(245, 158, 11, 0.22)"
            >
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/40">
                <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded border border-amber-100 uppercase tracking-wider">
                  NLP & Analytics / Power BI
                </span>
                <span className="text-[10px] text-[#908576] font-mono">★ 1</span>
              </div>

              <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                <h3 className="font-serif text-2xl font-semibold text-[#2C2523]">
                  ShopEasy
                </h3>

                {/* Interactive Screenshot Switcher */}
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E6DFD5]/40 relative group mb-2">
                  <img 
                    src={shopeasyImages[shopeasyActiveImage]} 
                    alt={`ShopEasy ${shopeasyActiveImage}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-2 right-2 flex flex-wrap justify-center gap-1.5 z-20">
                    {(['overview', 'conversion', 'marketing', 'sentiment'] as const).map((imgKey) => (
                      <button
                        key={imgKey}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShopeasyActiveImage(imgKey);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                          shopeasyActiveImage === imgKey
                            ? 'bg-amber-600 text-white shadow-md scale-105'
                            : 'bg-white/90 text-stone-700 hover:bg-white'
                        }`}
                      >
                        {imgKey === 'overview' ? 'Overview' : imgKey === 'conversion' ? 'Journey Funnel' : imgKey === 'marketing' ? 'Marketing' : 'Sentiment Analysis'}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!shopeasyLogMode ? (
                    <motion.p 
                      key="desc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[#7D7468] leading-relaxed font-light"
                    >
                      Consumer intelligence dashboard tracking customer journeys, conversion drop-offs, and feedback drivers. Integrated with a RoBERTa sentiment classifier engine to analyze reviews.
                    </motion.p>
                  ) : (
                    <motion.div 
                      key="logs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-stone-900/5 p-3 rounded-xl border border-amber-200/30 font-mono text-[9px] text-amber-700 leading-snug"
                    >
                      {`[NLP Pipeline]
  ├── Reviews -> SQLite db
  ├── RoBERTa Sentiment (88% F1)
  └── Topic Extraction (LDA clusters)
[Power BI Gateway]
  ├── Daily conversion pipelines
  └── Journey funnel analytics`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-amber-200/40 mt-auto">
                <button 
                  onClick={() => setShopeasyLogMode(!shopeasyLogMode)}
                  className="text-xs font-mono text-amber-600 hover:text-amber-800 underline cursor-pointer"
                >
                  {shopeasyLogMode ? "Show Details" : "Inference Logs"}
                </button>
                <a 
                  href="https://github.com/ShivanshKandwal/ShopEasy-Insight-Engine-Customer-Journey-Sentiment-Analytics" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors"
                >
                  Repo <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>

          </div>

          {/* Full-Width Ledger rows to resolve crowding overlaps */}
          <div 
            ref={projectContainerRef}
            onMouseMove={handleProjectMouseMove}
            className="relative glass-card rounded-3xl p-6 md:p-8 flex flex-col overflow-visible shadow-md text-left mt-8"
          >
            <div className="pb-4 border-b border-[#E6DFD5]/60 mb-2">
              <span className="text-xs font-mono text-[#908576] font-bold uppercase tracking-wide flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />
                All Repositories & Publications
              </span>
            </div>

            {/* Floating Hover Peek Card */}
            <AnimatePresence>
              {hoveredProject && (
                <motion.div
                  style={{
                    x: springLedgerX,
                    y: springLedgerY,
                    position: 'absolute',
                    pointerEvents: 'none',
                    translateX: 30,
                    translateY: -160,
                    zIndex: 100,
                    left: 0,
                    top: 0
                  }}
                  initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 2 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: -2 }}
                  className="w-64 bg-[#FFFDF9]/95 p-3 rounded-2xl shadow-xl border border-[#E6DFD5]/80 pointer-events-none backdrop-blur-md"
                >
                  <div className="w-full aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden border border-[#E6DFD5]/40 mb-3">
                    <img 
                      src={hoveredProject.image} 
                      alt={hoveredProject.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-left px-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] bg-rose-50 text-rose-500 font-bold px-2 py-0.5 rounded border border-rose-100">
                        {hoveredProject.language}
                      </span>
                      <span className="text-[10px] text-[#908576] font-mono">
                        ★ {hoveredProject.stars}
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-[#2C2523]">
                      {hoveredProject.title}
                    </h4>
                    <p className="text-[#7D7468] text-[11px] font-light leading-snug mt-1">
                      {hoveredProject.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List Row Elements */}
            <div className="flex flex-col w-full">
              {otherProjects.map((project, idx) => {
                const isExpanded = expandedProject === project.title;
                return (
                  <div key={idx} className="flex flex-col border-b border-[#E6DFD5]/80">
                    <ProjectRow 
                      project={project}
                      onHoverStart={() => {
                        if (!isExpanded) setHoveredProject(project);
                      }}
                      onHoverEnd={() => setHoveredProject(null)}
                      isExpanded={isExpanded}
                      onToggleExpand={() => {
                        setExpandedProject(isExpanded ? null : project.title);
                        setHoveredProject(null);
                      }}
                    />
                    
                    {/* Inline Showcase Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pt-2 px-1 flex flex-col gap-5 text-[#2C2523]">
                            {project.title === "ShopEasy-Sentiment-Engine" && (
                              <ShopEasyShowcase project={project} />
                            )}
                            {project.title === "EcoScan AI Camera" && (
                              <EcoScanShowcase project={project} />
                            )}
                            {project.title === "Cool-Mini-Games-I-Made" && (
                              <MiniGamesShowcase project={project} />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2.2: Live Product Gallery Hub */}
        <motion.section 
          id="gallery" 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="py-8 scroll-mt-24 text-left"
        >
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-2">
              <Layers className="w-5.5 h-5.5 text-purple-600 animate-pulse" />
              <h2 className="text-3xl font-serif font-semibold bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-transparent bg-clip-text">
                Live Product Gallery
              </h2>
            </div>
            <p className="text-[#7D7468] text-sm md:text-base font-light max-w-xl">
              Inspect screenshots, system flowchart architectures, and live UI dashboards from mock interview trainers, ComfyUI wrapper nodes, and computer vision waste classifiers.
            </p>
            
            {/* Filter controls */}
            <div className="flex flex-wrap gap-2 mt-2 select-none">
              {['All', 'VerbIQ Bot', 'Kairo AI', 'Sus-10-Able', 'ShopEasy', 'Life Sandbox'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveGalleryFilter(filter);
                    setSelectedLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-all border ${
                    activeGalleryFilter === filter
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                      : 'bg-white/60 border-[#E6DFD5] text-[#7D7468] hover:bg-white hover:text-[#2C2523]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Layout with Side Controls */}
          <div className="relative group/carousel w-full mt-6">
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 border border-[#E6DFD5] text-[#2C2523] hover:text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
              title="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrolling Row */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-6 pr-4 scroll-smooth no-scrollbar select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {galleryItems
                .filter((item) => activeGalleryFilter === 'All' || item.project === activeGalleryFilter)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      const filtered = galleryItems.filter(
                        (i) => activeGalleryFilter === 'All' || i.project === activeGalleryFilter
                      );
                      const realIndex = filtered.findIndex((f) => f.id === item.id);
                      setSelectedLightboxIndex(realIndex);
                    }}
                    className="glass-card rounded-2xl p-3 cursor-pointer group flex flex-col gap-3 relative overflow-hidden border border-[#E6DFD5]/40 hover:border-purple-300 shadow-sm min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0"
                  >
                    <div className="w-full aspect-[16/10] bg-neutral-100 rounded-xl overflow-hidden border border-[#E6DFD5]/40 relative">
                       <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover scale-[1.01] group-hover:scale-[1.04] transition-transform duration-500" 
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#2C2523]/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider font-mono">
                        {item.tag}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-left px-1">
                      <span className="text-[9px] font-bold text-purple-600 font-mono uppercase tracking-wider">
                        {item.project}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-[#2C2523] group-hover:text-purple-600 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#7D7468] font-light leading-normal line-clamp-2 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-purple-600 border border-[#E6DFD5] text-[#2C2523] hover:text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
              title="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.section>

        {/* Section 2.5: Research Publication */}
        <motion.section 
          id="research" 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="py-8 scroll-mt-24"
        >
          <div className="flex flex-col gap-4 text-left mb-10">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-serif font-medium text-[#2C2523] bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-transparent bg-clip-text font-bold">
                Research Publication
              </h2>
            </div>
            <p className="text-[#7D7468] text-sm md:text-base font-light max-w-xl">
              Published scientific research exploring prognostic speech features using machine learning systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left Column: Visual Cover & Metrics */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <GlassCard 
                className="w-full overflow-hidden p-4 relative group"
                shadowColor="rgba(168, 85, 247, 0.18)"
              >
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative border border-[#E6DFD5]/40 shadow-inner">
                  <img 
                    src={paperCover} 
                    alt="Research Paper Cover Page" 
                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0518]/50 via-transparent to-transparent opacity-70" />
                </div>

                {/* Metrics Badges Grid */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/10 dark:bg-stone-900/10 border border-[#E6DFD5]/40 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-[#908576] font-mono block uppercase">Accuracy</span>
                    <span className="font-serif text-lg font-bold text-emerald-600">81.94%</span>
                  </div>
                  <div className="bg-white/10 dark:bg-stone-900/10 border border-[#E6DFD5]/40 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-[#908576] font-mono block uppercase">Macro AUC</span>
                    <span className="font-serif text-lg font-bold text-purple-600">0.9706</span>
                  </div>
                  <div className="bg-white/10 dark:bg-stone-900/10 border border-[#E6DFD5]/40 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-[#908576] font-mono block uppercase">Features</span>
                    <span className="font-serif text-lg font-bold text-amber-500">125-Dim</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6DFD5]/40 flex justify-between items-center text-[10px] text-[#908576] font-mono">
                  <span>IJSREM Journal</span>
                  <span>Published: May 2026</span>
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Title, Abstract & Methodology */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded w-fit font-bold uppercase tracking-wider font-mono">
                  Peer-Reviewed Paper
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#2C2523] leading-snug">
                  ML-Based Prognostic Analysis of Hybrid Speech Emotion Recognition
                </h3>
              </div>

              <div className="text-sm text-[#7D7468] leading-relaxed font-light flex flex-col gap-4">
                <p>
                  <strong>Abstract:</strong> This research presents a diagnostic acoustic classification framework leveraging Hybrid Deep Neural Network (DNN) models. By evaluating human speech signals under variable environments, the prognostic system is optimized to identify real-time changes in affective states.
                </p>
                
                {/* Highlights List */}
                <div className="flex flex-col gap-3 bg-white/10 dark:bg-stone-900/5 border border-[#E6DFD5]/40 rounded-2xl p-4 mt-1">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs shrink-0 font-bold">1</div>
                    <p className="text-xs text-[#7D7468] leading-normal">
                      <strong>125-Dimensional Vector Space:</strong> Extracted acoustic features incorporating Mel-Frequency Cepstral Coefficients (MFCCs) coupled with Speech Pause Ratio indicators to map tone pitch and tempo.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs shrink-0 font-bold">2</div>
                    <p className="text-xs text-[#7D7468] leading-normal">
                      <strong>Hybrid Classifier:</strong> High-performance multi-class DNN scoring framework trained on voice datasets, achieving a peak validation accuracy of 81.94%.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs shrink-0 font-bold">3</div>
                    <p className="text-xs text-[#7D7468] leading-normal">
                      <strong>Gemini Live API Wrapper:</strong> Engineered a low-latency pipeline redirecting the class output predictions to the Gemini Live API to trigger real-time, responsive verbal coaching behaviors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="https://github.com/ShivanshKandwal/VerbIQ-Final-Build" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold bg-[#2C2523] text-white hover:bg-purple-700 px-5 py-3 rounded-full shadow transition-all flex items-center gap-1.5"
                >
                  Inspect Inference Build <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Section 3: Internships, Education & Skills */}
        <motion.section 
          id="experience" 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start text-left">
            
            {/* Thematic Skills Matrix */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5.5 h-5.5 text-emerald-500" />
                  <h2 className="text-3xl font-serif font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 text-transparent bg-clip-text">
                    Experience & Skills
                  </h2>
                </div>
                <p className="text-[#7D7468] text-sm font-light leading-relaxed max-w-sm">
                  Ledger of professional internships, academic certifications, and categorised core skill matrix.
                </p>
              </div>

              {/* Skills Card */}
              <div className="flex flex-col gap-5 bg-white/10 rounded-3xl p-5 border border-white/20 shadow-sm">
                <span className="text-xs font-mono text-[#908576] font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-600" />
                  Thematic Tech Matrix
                </span>
                
                {/* AI / ML */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-purple-700 font-mono">
                    AI / ML & Generative AI
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {["Generative AI", "Computer Vision", "NLP", "LLMs", "ComfyUI", "Transformer Models"].map((s) => (
                      <span key={s} className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Science */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-700 font-mono">
                    Core ML & Data Science
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {["Data Analysis", "Machine Learning", "Feature Engineering", "Stats Analysis", "Model Evaluation"].map((s) => (
                      <span key={s} className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Big Data */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-amber-700 font-mono">
                    Big Data & Databases
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {["Hadoop", "Spark", "HDFS", "MapReduce", "Apache Sqoop"].map((s) => (
                      <span key={s} className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-sky-700 font-mono">
                    Languages & Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {["Python", "C++", "C", "JavaScript", "Node.js", "Express", "Electron", "Distributed Systems"].map((s) => (
                      <span key={s} className="text-[10px] bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded-full font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience & Education timelines stack */}
            <div className="lg:col-span-3 relative flex flex-col gap-8 w-full animate-fade-in pl-6 md:pl-8">
              {/* Timeline Vertical Axis Line */}
              <div className="absolute left-0 top-8 bottom-12 w-[1px] bg-[#E6DFD5]/60 animate-pulse" />

              {/* Present Internship Card */}
              <div className="relative w-full">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-950/40 -translate-x-1/2 z-10 shadow-sm" />
                
                <GlassCard className="glass-pub" shadowColor="rgba(56, 189, 248, 0.18)">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-sky-600 font-bold uppercase tracking-wider">
                          June 2026 – Present
                        </span>
                        <h3 className="font-serif text-lg md:text-xl font-medium text-[#2C2523] mt-1">
                          Data Scientist Intern
                        </h3>
                        <p className="text-sm font-medium text-sky-600 mt-0.5">
                          Ingenious Press Pvt Ltd (Data Analytics Department)
                        </p>
                      </div>
                      <span className="text-[10px] bg-sky-50 text-sky-600 px-2.5 py-0.5 rounded-full border border-sky-100 font-semibold font-mono">
                        Present
                      </span>
                    </div>
                    
                    <ul className="text-sm text-[#7D7468] font-light list-disc list-inside space-y-2 leading-relaxed">
                      <li>Collaborating on production-grade <strong>Data Science project workflows</strong>, developing predictive models, and running statistical analysis pipelines.</li>
                      <li>Administering and optimizing relational schemas and database indexes, handling core <strong>Database Administration (DBA)</strong> tasks to ensure low-latency data access.</li>
                      <li>Engineering ETL pipelines to clean, structure, and aggregate complex data points for marketing analytics.</li>
                    </ul>
                  </div>
                </GlassCard>
              </div>

              {/* Past Internship Card */}
              <div className="relative w-full">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100 dark:ring-purple-950/40 -translate-x-1/2 z-10 shadow-sm" />

                <GlassCard className="glass-ai" shadowColor="rgba(168, 85, 247, 0.18)">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-600 font-bold uppercase tracking-wider">
                          June 2025 – July 2025
                        </span>
                        <h3 className="font-serif text-lg md:text-xl font-medium text-[#2C2523] mt-1">
                          IT Intern
                        </h3>
                        <p className="text-sm font-medium text-purple-600 mt-0.5">
                          Silverzone Enterprise India Pvt Ltd
                        </p>
                      </div>
                      <span className="text-[10px] bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full border border-purple-100 font-semibold font-mono">
                        Internship
                      </span>
                    </div>
                    
                    <ul className="text-sm text-[#7D7468] font-light list-disc list-inside space-y-2 leading-relaxed">
                      <li>Developed **Kairo**, a full-stack AI image generation desktop host running ComfyUI backends and **Flux.1 [dev]** transformer models.</li>
                      <li>Designed modular node pipelines enabling style transfer and low-latency network proxy tools.</li>
                      <li>Optimized data transmission speed between Electron UI and Express.js proxy modules.</li>
                    </ul>
                  </div>
                </GlassCard>
              </div>

              {/* Education Card */}
              <div className="relative w-full">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/40 -translate-x-1/2 z-10 shadow-sm" />

                <GlassCard className="glass-ds" shadowColor="rgba(16, 185, 129, 0.18)">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                          2023 – Expected 2027
                        </span>
                        <h3 className="font-serif text-lg md:text-xl font-medium text-[#2C2523] mt-1">
                          B.Tech — Computer Science (Data Science)
                        </h3>
                        <p className="text-sm font-medium text-emerald-600 mt-0.5">
                          Bhagwan Parshuram Institute of Technology (BPIT)
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-100 font-semibold font-mono">
                        Education
                      </span>
                    </div>
                    
                    <div className="text-sm text-[#7D7468] font-light flex flex-col gap-3 leading-relaxed">
                      <p>
                        <strong>CGPA: 9.58 / 10</strong>. Core coursework in compilers, distributed systems, machine learning architectures, and statistics.
                      </p>
                      <div className="grid grid-cols-2 gap-4 border-t border-emerald-200/20 pt-3">
                        <div>
                          <h4 className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Modern Convent School</h4>
                          <p className="text-xs text-[#908576]">12th CBSE — 89.8% (2023)</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Modern Convent School</h4>
                          <p className="text-xs text-[#908576]">10th CBSE — 90.0% (2021)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Awards Card */}
              <div className="relative w-full">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950/40 -translate-x-1/2 z-10 shadow-sm" />

                <GlassCard className="glass-bd" shadowColor="rgba(245, 158, 11, 0.18)">
                  <div className="flex flex-col gap-3 text-left">
                    <span className="text-xs font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Hackathon Honors & Credentials
                    </span>
                    
                    <div className="flex flex-col gap-3 mt-1.5">
                      <div className="flex justify-between items-center text-sm font-light">
                        <span className="text-[#2C2523] font-medium">
                          🥇 1st Place — Indian Knowledge System Exhibition
                        </span>
                        <span className="text-xs text-[#908576] font-mono font-semibold">BPIT</span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-light">
                        <span className="text-[#2C2523] font-medium">
                          🥉 3rd Place — Data-Sphere Hackathon
                        </span>
                        <span className="text-xs text-[#908576] font-mono font-semibold">NSUT, 2025</span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-light">
                        <span className="text-[#2C2523] font-medium">
                          🥉 3rd Place — Dataverse Hackathon
                        </span>
                        <span className="text-xs text-[#908576] font-mono font-semibold">NSUT, 2024</span>
                      </div>

                      <div className="border-t border-[#E6DFD5]/50 pt-3 text-xs text-[#7D7468] leading-relaxed">
                        <strong>Samsung Innovation Campus Certification</strong>: Hadoop ecosystem modules, HDFS cluster architecture, MapReduce paradigms, Spark, and big data pipelines.
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

            </div>
          </div>
        </motion.section>

        {/* Section 4: Academics Photo Sandbox */}
        <motion.section 
          id="academics" 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="py-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch text-left">
            
            {/* Left Academics Text */}
            <div className="md:col-span-2 flex flex-col gap-5 justify-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5.5 h-5.5 text-amber-500" />
                <h2 className="text-3xl font-serif font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-transparent bg-clip-text">
                  Life Sandbox & Snapshot Frame
                </h2>
              </div>
              
              <div className="text-sm text-[#7D7468] leading-relaxed font-light flex flex-col gap-4">
                <p>
                  Engineering is about constant prototyping, experimentations, and late-night campus hackathons.
                </p>
                <p>
                  These photos represent my workstation setup, my university quad campus, and SIH team collaborations.
                </p>
              </div>

              <div className="bg-amber-50/70 border border-[#FDE68A] p-4 rounded-2xl flex gap-3 text-xs text-amber-800">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <p className="leading-normal">
                  <strong>Interaction Sandbox:</strong> Flick and drag the photo snapshots on the right. Release them with velocity to watch them bounce off the container walls!
                </p>
              </div>
            </div>

            {/* Right Photo Frame Canvas */}
            <div className="md:col-span-3 min-h-[420px] relative">
              <div 
                ref={photoContainerRef}
                className="w-full h-full min-h-[420px] bg-[#FAF6EE]/50 rounded-3xl border border-[#E6DFD5] relative overflow-hidden shadow-inner flex items-center justify-center"
              >
                <div className="absolute top-4 left-4 text-[10px] font-mono text-[#908576] tracking-wider uppercase flex items-center gap-1.5 z-20 font-semibold">
                  <Layers className="w-3 h-3 text-purple-500" />
                  Physics Sandbox Canvas
                </div>

                {/* Draggable photos with inertia */}
                <DragPhoto 
                  src={workspaceImg}
                  alt="Minimal Workspace Setup"
                  caption="AI Workstation Setup"
                  containerRef={photoContainerRef}
                  initialRotate={-4}
                  initialX={-55}
                  initialY={-25}
                />
                
                <DragPhoto 
                  src={campusImg}
                  alt="Scholarly Campus Life"
                  caption="Matches & Campus Grounds"
                  containerRef={photoContainerRef}
                  initialRotate={5}
                  initialX={65}
                  initialY={45}
                />
                
                <DragPhoto 
                  src={hackathonImg}
                  alt="Hackathon Collaboration Team"
                  caption="Jatayu SIH Team Setup"
                  containerRef={photoContainerRef}
                  initialRotate={-2}
                  initialX={-15}
                  initialY={-85}
                />
              </div>
            </div>

          </div>
        </motion.section>

      </main>

      {/* Floating Bottom Warp Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#2C2523]/90 text-[#FFFBF7] px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2.5 shadow-xl backdrop-blur-sm pointer-events-none warp-indicator select-none border border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-[#FDA4AF] animate-pulse" />
        <span>
          {isHolding ? 'Background warped ✦' : 'Click & hold anywhere to morph background'}
        </span>
      </div>

      {/* Footer copyright */}
      <footer className="mt-16 text-center text-xs text-[#908576] font-light flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by Shivansh Kandwal © {new Date().getFullYear()}
      </footer>

      {/* Futuristic Command Modal Overlays */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white/70 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/40 shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                title="Close popup"
              >
                ✕
              </button>
              
              {activeModal === 'skills' && (
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-[16/10] bg-purple-100/50 rounded-2xl overflow-hidden border border-purple-200/50 relative shadow-md">
                    <img 
                      src={kairoDashboard} 
                      alt="Kairo Desktop Host Environment" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded border border-purple-100 uppercase tracking-wider w-fit">
                    AI/ML Skills Grid
                  </span>
                  <h3 className="font-serif text-3xl font-semibold bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-transparent bg-clip-text">
                    Thematic Tech Matrix
                  </h3>
                  <p className="text-xs text-stone-500 leading-normal">
                    A comprehensive layout of my engineering capabilities categorized by scientific priority domains.
                  </p>
                  
                  <div className="flex flex-col gap-4.5 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-purple-700">GenAI & Computer Vision</span>
                        <span className="text-stone-400 font-mono">92% Priority</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1, ease: "easeOut" }} className="bg-purple-600 h-full rounded-full" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-emerald-700">Core Machine Learning</span>
                        <span className="text-stone-400 font-mono">88% Priority</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ duration: 1, ease: "easeOut" }} className="bg-emerald-500 h-full rounded-full" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-amber-700">Big Data (Hadoop / Spark)</span>
                        <span className="text-stone-400 font-mono">80% Priority</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1, ease: "easeOut" }} className="bg-amber-500 h-full rounded-full" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-sky-700">Distributed Backend Wrappers</span>
                        <span className="text-stone-400 font-mono">85% Priority</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, ease: "easeOut" }} className="bg-sky-500 h-full rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'papers' && (
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-[16/10] bg-emerald-100/50 rounded-2xl overflow-hidden border border-emerald-200/50 relative shadow-md">
                    <img 
                      src={verbiqFlowchart} 
                      alt="Speech and Acoustic Analysis Pipeline" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider w-fit">
                    Research Publication
                  </span>
                  <h3 className="font-serif text-3xl font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 text-transparent bg-clip-text">
                    Speech Emotion Recognition
                  </h3>
                  
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-xs text-emerald-800 font-mono leading-relaxed mt-1">
                    <p className="font-bold">Paper Title:</p>
                    <p className="italic">ML-Based Prognostic Analysis of Hybrid Speech Emotion Recognition</p>
                    <p className="mt-2 text-[10px] text-stone-500">Published: May 2026, IJSREM Journal</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-light mt-1">
                    <strong>Abstract:</strong> Acoustic analysis using Hybrid DNN architectures. Extracted 125-dim vector space features utilizing MFCC calculations alongside Pause Ratio indicators, achieving a baseline accuracy score of 81.94% (macro-AUC: 0.9706). Integrated real-time coaching support via Gemini Live API wrappers.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Accuracy</span>
                      <span className="font-serif text-lg font-semibold text-emerald-600">81.94%</span>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Macro AUC</span>
                      <span className="font-serif text-lg font-semibold text-purple-600">0.9706</span>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Features</span>
                      <span className="font-serif text-lg font-semibold text-amber-500">125-dim</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'hackathons' && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded border border-amber-100 uppercase tracking-wider w-fit">
                    Honors & Accolades
                  </span>
                  <h3 className="font-serif text-3xl font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-transparent bg-clip-text">
                    Hackathon Credentials
                  </h3>
                  <p className="text-xs text-stone-500 leading-normal">
                    Top tier leaderboard finishes in key developer competitions.
                  </p>

                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center gap-3 bg-rose-50/70 border border-rose-100 p-3 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center text-lg font-serif shrink-0">
                        🥇
                      </div>
                      <div className="text-xs text-[#2C2523] flex-1">
                        <h4 className="font-bold">1st Place — Indian Knowledge System Exhibition</h4>
                        <p className="text-stone-400 text-[10px] mt-0.5">BPIT Campus Hackathon</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-serif shrink-0">
                        🥉
                      </div>
                      <div className="text-xs text-[#2C2523] flex-1">
                        <h4 className="font-bold">3rd Place — Data-Sphere Hackathon</h4>
                        <p className="text-stone-400 text-[10px] mt-0.5">NSUT Delhi, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-100 p-3 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-serif shrink-0">
                        🥉
                      </div>
                      <div className="text-xs text-[#2C2523] flex-1">
                        <h4 className="font-bold">3rd Place — Dataverse Hackathon</h4>
                        <p className="text-stone-400 text-[10px] mt-0.5">NSUT Delhi, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightroom Lightbox Overlay Modal */}
      <AnimatePresence>
        {selectedLightboxIndex !== null && (() => {
          const filtered = activeGalleryFilter === 'All' 
            ? galleryItems 
            : galleryItems.filter(item => item.project === activeGalleryFilter);
          const activeItem = filtered[selectedLightboxIndex];
          
          if (!activeItem) return null;

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md select-none"
              onClick={() => setSelectedLightboxIndex(null)}
            >
              <div 
                className="w-full max-w-5xl bg-[#FFFDF9]/95 rounded-3xl overflow-hidden border border-[#E6DFD5]/50 shadow-2xl relative grid grid-cols-1 md:grid-cols-12"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left side: Main Image Preview */}
                <div className="md:col-span-8 bg-stone-900/10 relative aspect-[16/10] md:aspect-auto md:h-[550px] flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E6DFD5]/40">
                  <img 
                    src={activeItem.src} 
                    alt={activeItem.title} 
                    className="max-h-full max-w-full object-contain pointer-events-none" 
                  />

                  {/* Nav Arrows */}
                  <button
                    type="button"
                    onClick={handleLightboxPrev}
                    className="absolute left-4 w-10 h-10 rounded-full bg-[#2C2523]/80 hover:bg-purple-700 text-white flex items-center justify-center transition-colors cursor-pointer border-none shadow-md z-20 font-serif"
                    title="Previous Image (←)"
                  >
                    ⟨
                  </button>
                  <button
                    type="button"
                    onClick={handleLightboxNext}
                    className="absolute right-4 w-10 h-10 rounded-full bg-[#2C2523]/80 hover:bg-purple-700 text-white flex items-center justify-center transition-colors cursor-pointer border-none shadow-md z-20 font-serif"
                    title="Next Image (→)"
                  >
                    ⟩
                  </button>
                  
                  {/* Close button on image */}
                  <button
                    type="button"
                    onClick={() => setSelectedLightboxIndex(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2C2523]/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer border-none shadow-md z-20 text-xs"
                    title="Close Lightbox (Esc)"
                  >
                    ✕
                  </button>
                </div>

                {/* Right side: Detailed engineering specifications */}
                <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between text-left h-full min-h-[300px] md:min-h-0">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        {activeItem.project}
                      </span>
                      <span className="text-[9px] text-[#908576] font-mono font-semibold">
                        IMAGE {selectedLightboxIndex + 1} OF {filtered.length}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 font-mono font-semibold block uppercase">
                        {activeItem.tag}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#2C2523] mt-0.5 leading-snug">
                        {activeItem.title}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div>
                        <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                          Overview
                        </h4>
                        <p className="text-xs text-[#7D7468] leading-relaxed mt-1 font-light">
                          {activeItem.desc}
                        </p>
                      </div>
                      
                      <div className="border-t border-[#E6DFD5]/40 pt-3">
                        <h4 className="text-[10px] font-bold text-purple-700 uppercase tracking-wider font-mono flex items-center gap-1">
                          <Cpu className="w-3 h-3 shrink-0" />
                          How it fits (Architecture)
                        </h4>
                        <p className="text-xs text-purple-900 leading-relaxed mt-1 font-light">
                          {activeItem.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E6DFD5]/40 flex justify-between items-center text-[10px] text-[#908576] font-mono mt-4">
                    <span>Aspect: 16:10 Ratio</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedLightboxIndex(null)}
                      className="text-purple-600 hover:text-purple-800 underline cursor-pointer font-bold border-none bg-transparent"
                    >
                      Exit Lightroom
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function ShopEasyShowcase({ project }: { project: ProjectData }) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = [
    {
      id: "sentiment",
      title: "NLP Sentiment Score Distribution",
      x: "24%",
      y: "22%",
      desc: "RoBERTa sentiment engine maps customer reviews in real-time, achieving 88% F1-score classification."
    },
    {
      id: "funnel",
      title: "Customer Journey Funnel Analysis",
      x: "52%",
      y: "48%",
      desc: "Identified check-out drop-off bottlenecks, enabling visual adjustments that recovered 14% of lost conversions."
    },
    {
      id: "drivers",
      title: "Key Category Drivers & Topics",
      x: "78%",
      y: "72%",
      desc: "Uncovered key product issues (delivery delays, sizing faults) using Latent Dirichlet Allocation (LDA) topic clusters."
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-white/20 p-5 rounded-2xl border border-[#E6DFD5]/60 shadow-sm backdrop-blur-md">
      <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-[#E6DFD5] bg-stone-900/5 aspect-[16/10]">
        <img 
          src={project.image} 
          alt="Power BI Sentiment Dashboard" 
          className="w-full h-full object-cover select-none pointer-events-none" 
        />
        {hotspots.map((spot) => (
          <div
            key={spot.id}
            style={{ top: spot.y, left: spot.x }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
              }}
              className="relative w-6.5 h-6.5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border-none"
            >
              <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75"></span>
              +
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2C2523] text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap z-30 font-sans">
              {spot.title}
            </span>
          </div>
        ))}
      </div>

      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded border border-purple-100 uppercase tracking-wider font-mono">
            Interactive Dashboard Hotspots
          </span>
          <h4 className="font-serif text-lg font-bold text-[#2C2523] mt-2">
            ShopEasy Sentiment & Journey Analytics
          </h4>
          <p className="text-xs text-[#7D7468] leading-relaxed mt-1 font-light">
            Click the pulsing **+** hotspots on the dashboard preview to read the engineering details and metrics mapping the customer experience.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeHotspot ? (
            <motion.div
              key={activeHotspot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl text-left"
            >
              <h5 className="font-mono text-xs font-bold text-purple-700 uppercase">
                {hotspots.find(s => s.id === activeHotspot)?.title}
              </h5>
              <p className="text-xs text-purple-900 leading-normal mt-1.5 font-light">
                {hotspots.find(s => s.id === activeHotspot)?.desc}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-stone-50 border border-stone-200/60 p-4 rounded-xl text-center text-xs text-stone-400 italic"
            >
              No metric hotspot selected. Click a + marker to view analytics.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-1">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-[#2C2523] hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-full shadow transition-all flex items-center gap-1.5 w-fit"
          >
            Open GitHub Repository <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function EcoScanShowcase({ project }: { project: ProjectData }) {
  const [slideIdx, setSlideIdx] = useState(0);

  const slides = [
    {
      image: susLanding,
      title: "Sus-10-Able Game Landing Page",
      desc: "The main animated welcome portal, prompting school children to start environmental quests or scan recycling items."
    },
    {
      image: susEcoscan,
      title: "EcoScan AI Camera UI",
      desc: "Analyzes objects via device camera, classifies waste types, and logs ecological impact scores directly."
    },
    {
      image: susPlay1,
      title: "Sus-10-Able platformer Level 1",
      desc: "Gamified adventure levels teaching players proper waste segregation and recycling guidelines."
    },
    {
      image: susPlay2,
      title: "Sus-10-Able platformer Level 2",
      desc: "Interior room quest collecting organic waste, batteries, and glass jars into correct recycling bins."
    },
    {
      image: susMinigames,
      title: "Eco Minigames Suite",
      desc: "Collection of sustainability sub-games including Eco Hangman, Word Search, Crosswords, and Eco Quiz."
    },
    {
      image: susLearn1,
      title: "e-Learning Dashboard",
      desc: "Responsive learning portal tracking completion scores across Water Conservation, Forest Conservation, and Energy modules."
    },
    {
      image: susLearn2,
      title: "Learning Content Summaries",
      desc: "Executive summary details and mind maps detailing practical conservation strategies."
    }
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((slideIdx + 1) % slides.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((slideIdx - 1 + slides.length) % slides.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-white/20 p-5 rounded-2xl border border-[#E6DFD5]/60 shadow-sm backdrop-blur-md">
      <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-[#E6DFD5] bg-stone-900/5 aspect-[16/10] group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={slideIdx}
            src={slides[slideIdx].image} 
            alt={slides[slideIdx].title} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover select-none pointer-events-none" 
          />
        </AnimatePresence>
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2C2523]/80 text-white flex items-center justify-center hover:bg-purple-700 transition-colors z-20 cursor-pointer shadow border-none"
        >
          ⟨
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2C2523]/80 text-white flex items-center justify-center hover:bg-purple-700 transition-colors z-20 cursor-pointer shadow border-none"
        >
          ⟩
        </button>
        <div className="absolute bottom-3 right-3 bg-[#2C2523]/80 text-white px-2 py-0.5 rounded text-[10px] font-mono z-20">
          {slideIdx + 1} / {slides.length}
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider font-mono">
            EcoScan Project Gallery
          </span>
          <h4 className="font-serif text-lg font-bold text-[#2C2523] mt-2">
            {slides[slideIdx].title}
          </h4>
          <p className="text-xs text-[#7D7468] leading-relaxed mt-1.5 font-light">
            {slides[slideIdx].desc}
          </p>
        </div>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSlideIdx(i);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer border-none ${
                slideIdx === i ? 'bg-purple-600 w-4' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-1">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-[#2C2523] hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-full shadow transition-all flex items-center gap-1.5 w-fit"
          >
            Open GitHub Repository <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function MiniGamesShowcase({ project }: { project: ProjectData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-white/20 p-5 rounded-2xl border border-[#E6DFD5]/60 shadow-sm backdrop-blur-md">
      <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-[#E6DFD5] bg-stone-900/5 aspect-[16/10]">
        <img 
          src={project.image} 
          alt="Cool Mini Games Preview" 
          className="w-full h-full object-cover select-none pointer-events-none" 
        />
      </div>

      <div className="lg:col-span-5 flex flex-col gap-4">
        <div>
          <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded border border-amber-100 uppercase tracking-wider font-mono">
            Game Playground
          </span>
          <h4 className="font-serif text-lg font-bold text-[#2C2523] mt-2">
            HTML5 canvas-based game mechanics
          </h4>
          <p className="text-xs text-[#7D7468] leading-relaxed mt-1.5 font-light">
            A sandbox collection of lightweight, vanilla JavaScript games utilizing the 2D canvas API. Features collision detection, gravity simulators, physics grids, and interactive high-score tables.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-[#2C2523] hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-full shadow transition-all flex items-center gap-1.5 w-fit"
          >
            Open GitHub Repository <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  project: 'VerbIQ Bot' | 'Kairo AI' | 'Sus-10-Able' | 'Life Sandbox' | 'ShopEasy';
  tag: string;
  desc: string;
  details: string;
}

const galleryItems: GalleryItem[] = [
  // VerbIQ
  {
    id: 1,
    src: verbiqDashboard,
    title: "VerbIQ Live Analytics Dashboard",
    project: "VerbIQ Bot",
    tag: "Control Plane / UI",
    desc: "Mock interview control dashboard. Adjusts mock parameters (Professional, Stressful, Friendly), AI personality, and real-time speech indicators.",
    details: "Integrates with local speech feature extractors and Gemini Live API to calculate and persist turn-by-turn pacing, confidence, and engagement metrics."
  },
  {
    id: 2,
    src: verbiqDebater,
    title: "VerbIQ Master Debater Interface",
    project: "VerbIQ Bot",
    tag: "Debate Module",
    desc: "Interactive scenario debate practice arena. Presents debate topics and tips, prompting users to record arguments and receive instant counterarguments.",
    details: "Leverages local micro-speech models to evaluate structural coherence and passes transcription payloads to LLMs for dynamic counterpoint response generation."
  },
  {
    id: 3,
    src: verbiqInterview,
    title: "VerbIQ Interview Ace Module",
    project: "VerbIQ Bot",
    tag: "Interview Module",
    desc: "Coaching module targeting professional conversations. Guides users through standard behavioral templates ('Tell me about yourself') and analyzes answers.",
    details: "Provides instant pause-ratio warnings and feedback drivers to optimize speech patterns for industry recruitment standards."
  },
  {
    id: 4,
    src: verbiqFlowchart,
    title: "VerbIQ System Data Flowchart",
    project: "VerbIQ Bot",
    tag: "Pipeline Schema",
    desc: "Acoustic feature extraction and API proxy loop diagram showing local speech classifier integration with cloud linguistic models.",
    details: "Diagrams Selection -> Configuration -> Live Audio capture (WAV stream) -> Feature Extraction (MFCCs, pause ratio) -> local model + Gemini API assembly -> SQLite persistence."
  },
  // Kairo
  {
    id: 5,
    src: kairoWelcome,
    title: "Kairo Welcome Screen",
    project: "Kairo AI",
    tag: "Welcome / UI",
    desc: "Personal AI creation suite launcher window, greeting users with a minimal dark gradient interface and tools layout.",
    details: "Acts as the frontend desktop launcher wrapper built with Electron, prompting network connection options."
  },
  {
    id: 6,
    src: kairoDashboard,
    title: "Kairo Host Studio Portal",
    project: "Kairo AI",
    tag: "Dashboard / UI",
    desc: "Host studio portal dashboard exposing local network addresses (kairo.local / IP address) for multiple devices.",
    details: "Launches the localized Node.js network proxy to allow multi-device web access to back-end workflow engines."
  },
  {
    id: 7,
    src: kairoGeneration,
    title: "Kairo Text-to-Image Generation Workspace",
    project: "Kairo AI",
    tag: "Workspace / UI",
    desc: "Image generation prompt canvas workspace. Includes step adjustment parameters and style presets, showing a generated dog.",
    details: "Passes text prompt variables and step settings (10 steps, 2.5 guidance) to a local FLUX.1 model inference wrapper."
  },
  {
    id: 8,
    src: kairoCombine,
    title: "Kairo Combine Images Workflow",
    project: "Kairo AI",
    tag: "Combine / UI",
    desc: "Stitches two images together (robot woman + labrador dog) to generate a blended layout.",
    details: "Utilizes local controlnet and image-to-image pipeline configurations to execute seamless spatial asset blending."
  },
  {
    id: 9,
    src: kairoEditing,
    title: "Kairo Image Editing Canvas",
    project: "Kairo AI",
    tag: "Editing / UI",
    desc: "Image editing canvas showing object modifications keeping facial features consistent on a throne illustration.",
    details: "Leverages local image-to-image and inpainting logic to redraw scene regions while keeping identity features intact."
  },
  // Sus-10-Able
  {
    id: 10,
    src: susLanding,
    title: "Sus-10-Able Game Landing Screen",
    project: "Sus-10-Able",
    tag: "Landing Portal / UI",
    desc: "Pixel-styled main landing page. Welcome screen greeting players to environmental quests and local garbage analysis.",
    details: "Features pixelated forest aesthetics, animated fox/rabbit indicators, and links users to Start Quest or scan items."
  },
  {
    id: 11,
    src: susPlay1,
    title: "Sus-10-Able Cemetery Quest",
    project: "Sus-10-Able",
    tag: "2D Platformer / Godot 4",
    desc: "Gamified adventure scene where players navigate levels to collect plants and sort waste materials under custom recycling guidelines.",
    details: "Built in Godot Engine 4. Includes custom physics models, item logs, and eco-score checkpoints mapped to public garbage database specifications."
  },
  {
    id: 12,
    src: susPlay2,
    title: "Sus-10-Able House Quest",
    project: "Sus-10-Able",
    tag: "2D Platformer / Godot 4",
    desc: "Interior room quest tracking player item collections, showing waste segregation mechanics inside residential environment layouts.",
    details: "Encourages waste lifecycle exploration by rewarding players who separate organic waste, batteries, and glass jars into correct recycling bins."
  },
  {
    id: 13,
    src: susMinigames,
    title: "Sus-10-Able minigame suite",
    project: "Sus-10-Able",
    tag: "Minigame Selection",
    desc: "Collection of eco-themed minigames including Arctic Rescue, Word Search, Crosswords, and Eco Quiz.",
    details: "Provides lightweight educational puzzles to teach younger audiences environmental concepts and green terms."
  },
  {
    id: 14,
    src: susLearn1,
    title: "Sus-10-Able e-Learning Module",
    project: "Sus-10-Able",
    tag: "e-Learning Dashboard",
    desc: "Responsive learning portal tracking completion scores across Water Conservation, Forest Conservation, and Energy modules.",
    details: "Tracks user scores, school leaderboard metrics, and connects players to interactive quizzes to test environmental knowledge."
  },
  {
    id: 15,
    src: susLearn2,
    title: "Sus-10-Able Learning Content",
    project: "Sus-10-Able",
    tag: "Mind Maps & Summaries",
    desc: "Executive summary details and mind maps detailing practical conservation strategies and interconnected benefits.",
    details: "Mind maps illustrating Imperative for Energy Conservation, Multi-Faceted Benefits, and practical daily sustainability routines."
  },
  {
    id: 16,
    src: susEcoscan,
    title: "EcoScan AI Camera Scanner",
    project: "Sus-10-Able",
    tag: "AI CV Scan / Inference",
    desc: "Camera object detector scanning a Pothos plant, classifying it, and outputting an environmental score of 90 based on life properties.",
    details: "Utilizes local vision-LLM models through Ollama/Gemma-3-4B to run edge inference, computing scores based on material, lifecycle, and disposal methods."
  },
  // ShopEasy
  {
    id: 17,
    src: shopeasyOverview,
    title: "ShopEasy Overview Dashboard",
    project: "ShopEasy",
    tag: "Overview / Power BI",
    desc: "Overview dashboard displaying conversion rate (8.6%), click-through rate (6%), and general sentiment distribution.",
    details: "Integrates multiple marketing channels and customer sentiment ratings into a unified management plane."
  },
  {
    id: 18,
    src: shopeasyConversion,
    title: "ShopEasy Customer Journey Funnel",
    project: "ShopEasy",
    tag: "Conversion / Power BI",
    desc: "Customer journey drop-off and funnel tracking. Maps views, clicks, and purchases by product price category.",
    details: "Pinpoints drop-off counts by stage (Checkout vs. Product Page) to optimize purchase conversion funnels."
  },
  {
    id: 19,
    src: shopeasyMarketing,
    title: "ShopEasy Marketing Channel Funnel",
    project: "ShopEasy",
    tag: "Marketing / Power BI",
    desc: "Tracks view-like-click conversions over time across Blog, Newsletter, Social Media, and Video campaigns.",
    details: "Aggregates click counts by individual product categories to isolate high-performing marketing channels."
  },
  {
    id: 20,
    src: shopeasySentiment,
    title: "ShopEasy Customer Sentiment Analytics",
    project: "ShopEasy",
    tag: "Sentiment / Power BI",
    desc: "Extracts customer review drivers, showing average rating (3.7) and product health scorecards.",
    details: "Connects RoBERTa classifier predictions to categorize product performance and log complaints by age segment."
  },
  // Life Sandbox
  {
    id: 21,
    src: workspaceImg,
    title: "Developer Workstation Setup",
    project: "Life Sandbox",
    tag: "Hardware Configuration",
    desc: "Shivansh's primary deep learning workstation workbench where ML model prototyping, big data scripting, and full-stack development take place.",
    details: "Multi-display environment optimized for parallel server logs, ComfyUI workflows, and big data clusters."
  },
  {
    id: 22,
    src: campusImg,
    title: "BPIT University Quad Grounds",
    project: "Life Sandbox",
    tag: "Academic campus life",
    desc: "Bhagwan Parshuram Institute of Technology campus quad grounds, representing scholarly Convent education and student life.",
    details: "Campus quad showcasing university events and academic student interactions."
  },
  {
    id: 23,
    src: hackathonImg,
    title: "SIH Jatayu Hackathon Setup",
    project: "Life Sandbox",
    tag: "Teamwork & Collaboration",
    desc: "The smart hackathon team setting, collaborating and coordinating on coding the final build for the SIH 2025 selection.",
    details: "Team workspace illustrating late-night coding, Godot 4 debugging, and live client API connections."
  }
];


