import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Github, Twitter, Linkedin, Mail, Code2, Award, Briefcase, GraduationCap, User, ExternalLink, Database, Server, Layers, Download, Music, Pause } from 'lucide-react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { LucideIcon } from 'lucide-react';
interface SkeletonCardProps {
  className?: string;
}

interface Project {
  title: string;
  tech: string;
  description: string;
  metrics: string;
  image: string;
  github: string;
  live: string;
}

interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
  <div className={`p-8 rounded-3xl bg-gray-800/50 animate-pulse ${className}`}>
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
  </div>
);

const Portfolio: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const musicButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const animateHover = (element: HTMLElement, isEnter: boolean): void => {
    gsap.to(element, {
      duration: 0.6,
      scale: isEnter ? 1.05 : 1,
      ease: "power2.out",
      yoyo: true,
      repeat: 0
    });
  };

  const toggleMusic = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (musicButtonRef.current) {
          gsap.to(musicButtonRef.current, {
            scale: 0.9,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              if (musicButtonRef.current) {
                gsap.to(musicButtonRef.current, { scale: 1, duration: 0.3 });
              }
            }
          });
        }
      } else {
        audioRef.current.play();
        if (musicButtonRef.current) {
          gsap.to(musicButtonRef.current, {
            scale: 1.15,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              if (musicButtonRef.current) {
                gsap.to(musicButtonRef.current, { scale: 1, duration: 0.3 });
              }
            }
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (musicButtonRef.current) {
      gsap.killTweensOf(musicButtonRef.current);
      
      if (isPlaying) {
        gsap.to(musicButtonRef.current, {
          rotation: 360,
          duration: 2,
          repeat: -1,
          ease: "none"
        });
      } else {
        gsap.to(musicButtonRef.current, {
          rotation: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }

    return () => {
      if (musicButtonRef.current) {
        gsap.killTweensOf(musicButtonRef.current);
        gsap.to(musicButtonRef.current, {
          rotation: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: false,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const torusGeometry = new THREE.TorusGeometry(5, 1.5, 32, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x00ffff : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.7,
      emissive: isDark ? 0x00ffff : 0x3b82f6,
      emissiveIntensity: isDark ? 0.5 : 0.2,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    const pointLight1 = new THREE.PointLight(
      isDark ? 0xffffff : 0x3b82f6, 
      isDark ? 8 : 3
    );
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(
      isDark ? 0x00ffff : 0x1e40af, 
      isDark ? 6 : 2
    );
    pointLight2.position.set(-15, -15, -15);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xffffff : 0x60a5fa, 
      isDark ? 2 : 0.5
    );
    scene.add(ambientLight);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent): void => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = (): void => {
      animationId = requestAnimationFrame(animate);
      
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.004;
      torus.rotation.z += 0.002;
      
      const breathe = 1 + Math.sin(Date.now() * 0.0008) * 0.1;
      torus.scale.setScalar(breathe);
      
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x, 
        mouseX * 3, 
        0.05
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y, 
        mouseY * 3, 
        0.05
      );
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = (): void => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
    };
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass = isDark ? 'bg-black' : 'bg-blue-50/90';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-900/80' : 'bg-gray-50/80';

  const glassNav = isDark 
    ? 'bg-gray-900/40 backdrop-blur-xl border-gray-700/50' 
    : 'bg-gray-400/50 opacity-80 backdrop-blur-xl border-blue-200/50';

  const projects: Project[] = [
    {
      title: "Horizon - Financial Dashboard",
      tech: "React.js, Next.js, Tailwind CSS, Appwrite",
      description: "Engineered a financial web app with real-time transactions, achieving 25% improvement in user engagement through secure authentication and optimized transaction flow.",
      metrics: "25% faster API responses, enhanced user experience",
      image: "https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fdashboard.png&w=3840&q=75",
      github: "https://github.com/Abhyshekbhalaji/horizon",
      live: "https://horizon-9khn.vercel.app/sign-in"
    },
    {
      title: "Pitcher - Startup Platform",
      tech: "Next.js, TypeScript, Sanity",
      description: "Converted codebase to TypeScript, reducing potential bugs by 40%. Developed startup pitching feature with 20% increase in user interaction.",
      metrics: "40% fewer bugs, 20% more engagement",
      image: "https://simple-g4fa.vercel.app/assets/project-3.jpg",
      github: "https://github.com/Abhyshekbhalaji/Pitcher_Nextjs",
      live: "https://pitcher-nextjs.vercel.app/"
    },
    {
      title: "Store It - File Management",
      tech: "Next.js, Appwrite, TypeScript",
      description: "Built scalable file management platform with 99.9% uptime, supporting 1,000+ users. Optimized upload/retrieval processes for 15% faster response times.",
      metrics: "99.9% uptime, 1000+ users supported",
      image: "https://simple-g4fa.vercel.app/assets/project-1.jpg",
      github: "https://github.com/Abhyshekbhalaji/store_it",
      live: "https://store-it-eight-alpha.vercel.app/sign-in"
    } 
  ];

  const skills: Skills = {
    languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    frameworks: ["React.js", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "Vue"],
    tools: ["GitHub", "VSCode", "Postman", "Version Control"],
    databases: ["MySQL", "MongoDB", "PostgreSQL"]
  };

  const navItems: NavItem[] = [
    { id: 'hero', icon: User, label: 'Home' },
    { id: 'about', icon: GraduationCap, label: 'About' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: Layers, label: 'Projects' },
    { id: 'skills', icon: Code2, label: 'Skills' },
    { id: 'contact', icon: Mail, label: 'Contact' }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-700 relative overflow-hidden`}>
      <canvas ref={canvasRef} className={`fixed top-0 left-0 w-full h-full ${isDark?'opacity-20' : '-z-5'}`} />
      
      <div className={`fixed inset-0 -z-5 ${isDark ? 'opacity-20' : 'opacity-10'}`}>
        <div className={`absolute top-0 -left-4 w-96 h-96 ${isDark ? 'bg-gray-500 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : 'bg-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.3)]'} rounded-full mix-blend-multiply filter blur-3xl animate-blob`}></div>
        <div className={`absolute top-0 -right-4 w-96 h-96 ${isDark ? 'bg-gray-600 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : 'bg-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-8 left-20 w-96 h-96 ${isDark ? 'bg-gray-400 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : 'bg-blue-300 shadow-[0_0_50px_rgba(59,130,246,0.3)]'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000`}></div>
        <div className={`absolute bottom-0 right-0 w-80 h-80 ${isDark ? 'bg-gray-700 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'bg-blue-600 shadow-[0_0_50px_rgba(59,130,246,0.2)]'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000`}></div>
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-400'} transition-all duration-500 hover:scale-110 hover:rotate-180`}
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
      </button>

      <button
        ref={musicButtonRef}
        onClick={toggleMusic}
        className={`fixed top-6 right-24 z-50 p-2.5 rounded-full ${cardBg} backdrop-blur-lg border-2 ${isDark ? 'border-green-500' : 'border-green-600'} transition-all duration-500 hover:scale-110 group overflow-hidden shadow-lg`}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        <div className="relative z-10">
          {isPlaying ? (
            <Pause className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          ) : (
            <Music className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          )}
        </div>
        {isPlaying && (
          <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping"></div>
        )}
      </button>

      <audio 
        ref={audioRef} 
        loop
        src="/Neeye Punchiri - One Side Love (mp3cut.net).mp3"
      />

      <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className={`inline-block mb-6 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-300'}`}>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>👋 Welcome to my portfolio</span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Abhyshek Bhalaji S
          </h1>
          
          <p className="text-2xl md:text-4xl mb-4 font-light">
           Software Engineer
          </p>
          
          <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-700'} max-w-4xl mx-auto`}>
         I'm a passionate Software Engineer specializing in building fast, scalable, and visually engaging web applications.
            With a strong grasp of React, Next.js, and modern development practices, I focus on crafting clean, maintainable code.
            Driven by curiosity and growth, I love turning ideas into seamless digital experiences that make an impact.
          </p>

          <div 
            className={`inline-flex items-center gap-3 mb-10 px-10 py-5 rounded-2xl ${cardBg} backdrop-blur-lg border-2 ${isDark ? 'border-gray-600 shadow-gray-800/20' : 'border-blue-300 shadow-blue-200/20'} shadow-2xl relative overflow-hidden`}
            onMouseEnter={(e) => animateHover(e.currentTarget, true)}
            onMouseLeave={(e) => animateHover(e.currentTarget, false)}
          >
            <Code2 className={`w-7 h-7 ${isDark ? 'text-white' : 'text-gray-900'} animate-pulse z-10 relative`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} z-10 relative`}>
              Open Source Contributor
            </span>
            <div className="flex gap-1 z-10 relative">
              <div className={`w-2 h-2 rounded-full ${isDark?'bg-white' : 'bg-blue-400'} animate-ping`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark?'bg-white' : 'bg-blue-400'}`}></div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-75 animate-shine"></div>
            {!isDark && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-75 animate-shine"></div>
            )}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="https://github.com/Abhyshekbhalaji" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="https://leetcode.com/u/AbhyshekBhalaji/" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <Code2 className="w-5 h-5" />
              <span>LeetCode</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/abhyshek-bhalaji-65324b208/" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
            href="https://drive.google.com/file/d/1E48D4deZ_fNmK5AkqgrymcEN1pnXvTuo/view?usp=drive_link" 
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <Download className="w-5 h-5" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <User className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
              onMouseEnter={(e) => animateHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateHover(e.currentTarget, false)}
            >
              <GraduationCap className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'} mb-4`} />
              <h3 className="text-2xl font-bold mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">Bachelor of Technology</p>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Biotechnology</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Sastra University, Tanjore, TN</p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>June 2019 - June 2023</p>
                </div>
                <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
                  <p className="font-semibold mb-2">Relevant Coursework:</p>
                  <ul className={`space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    <li>• Data Structures & Algorithms (Java)</li>
                    <li>• Python for Bio Engineers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div 
              className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
              onMouseEnter={(e) => animateHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateHover(e.currentTarget, false)}
            >
              <Award className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'} mb-4`} />
              <h3 className="text-2xl font-bold mb-4">Key Strengths</h3>
              <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>▸</span>
                  <span>Modular system design and architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>▸</span>
                  <span>Responsive UI design & services development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>▸</span>
                  <span>API integration and debugging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>▸</span>
                  <span>Data Structures and Algorithms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>▸</span>
                  <span>Agile methodologies & cross-functional collaboration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <Briefcase className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Experience</h2>
          </div>

          {isInitialLoad ? (
            <div className="p-10 rounded-3xl bg-gray-800/50 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            </div>
          ) : (
            <div 
              className={`p-10 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
              onMouseEnter={(e) => animateHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateHover(e.currentTarget, false)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Software Engineer Intern</h3>
                  <p className="text-xl font-semibold">Cognizant Technology Solutions</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Chennai, Tamil Nadu</p>
                </div>
                <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-sm font-semibold`}>
                  Dec 2023 - Mar 2024
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                  <div className="flex items-start gap-3">
                    <Server className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'} mt-1 flex-shrink-0`} />
                    <div>
                      <p className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        API Performance Optimization
                      </p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Optimized Java-based REST APIs and Web Services, boosting data retrieval performance by 25% 
                        through benchmarking tools and performance analysis
                      </p>
                      <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Impact: 25% faster response times
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                  <div className="flex items-start gap-3">
                    <Award className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'} mt-1 flex-shrink-0`} />
                    <div>
                      <p className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        Quality Assurance & User Experience
                      </p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Identified 20+ critical bugs through manual testing on Amazon and Alibaba platforms, 
                        improving user experience by 15% within Agile methodologies
                      </p>
                      <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Impact: 20+ bugs fixed, 15% UX improvement
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                  <div className="flex items-start gap-3">
                    <Database className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'} mt-1 flex-shrink-0`} />
                    <div>
                      <p className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        Database Optimization
                      </p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Streamlined team workflows with efficient SQL queries for CRUD operations, 
                        reducing query execution time by 20%
                      </p>
                      <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Impact: 20% faster query execution
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="projects" className="min-h-screen flex items-center px-4 py-12 sm:px-6 sm:py-16 md:px-6 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-6 sm:gap-3 sm:mb-8 md:gap-3 md:mb-12">
            <Layers className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {isInitialLoad ? (
              Array(3).fill(0).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : (
              projects.map((project, idx) => (
                <div 
                  key={idx}
                  className={`p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg group relative overflow-hidden transition-all duration-300`}
                  onMouseEnter={(e) => {
                    animateHover(e.currentTarget, true);
                    e.currentTarget.style.backdropFilter = 'blur(8px)';
                  }}
                  onMouseLeave={(e) => {
                    animateHover(e.currentTarget, false);
                    e.currentTarget.style.backdropFilter = 'blur(0px)';
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-500">
                        {project.title}
                      </h3>
                    </div>
                    <p className={`text-xs sm:text-sm md:text-sm mb-2 sm:mb-3 md:mb-4 ${isDark ? 'text-gray-400' : 'text-gray-700'} font-semibold`}>
                      {project.tech}
                    </p>
                    <p className={`text-sm sm:text-base md:text-base mb-2 sm:mb-3 md:mb-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      {project.description}
                    </p>
                    <div className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 rounded-md sm:rounded-lg md:rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs sm:text-sm md:text-sm font-semibold`}>
                      {project.metrics}
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 group-hover:backdrop-blur-lg">
                    <div className="text-center flex md:flex-col items-center gap-1 sm:gap-2 md:gap-2">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-48 h-32 sm:w-60 sm:h-40 md:w-72 md:h-48 object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
                      />
                      <div className='flex justify-center items-center gap-2'>
                        <a 
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-300'} text-xs sm:text-sm md:text-base transition-all duration-500 hover:bg-green-500 hover:text-white hover:border-green-500`}
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span>Live Link</span>
                        </a>
                        <a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-300'} text-xs sm:text-sm md:text-base transition-all duration-500 hover:bg-grey-500 ${isDark?'hover:text-white hover:bg-blue-400' : 'hover:text-white hover:bg-gray-500'} hover:border-grey-500`}
                        >
                          <Github className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span>Github</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="skills" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <Code2 className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isInitialLoad ? (
              Array(5).fill(0).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : (
              <>
                <div 
                  className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
                  onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                  onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                >
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Code2 className="w-5 h-5" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.languages.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all duration-300 cursor-default`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div 
                  className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
                  onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                  onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                >
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Layers className="w-5 h-5" />
                    Frameworks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.frameworks.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all duration-300 cursor-default`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div 
                  className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
                  onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                  onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                >
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Database className="w-5 h-5" />
                    Databases
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.databases.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all duration-300 cursor-default`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen flex items-center px-6 py-20 pb-40">
        <div className="max-w-4xl mx-auto w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Mail className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          </div>

          <p className={`text-xl mb-12 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            I'm always open to discussing new projects, creative ideas, or opportunities to collaborate. 
            Let's build something amazing together!
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a 
              href="mailto:abhyshekbhalaji@gmail.com"
              className={`p-8 rounded-2xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 group`}
            >
              <Mail className={`w-10 h-10 ${isDark ? 'text-white' : 'text-gray-900'} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
              <p className="font-semibold text-lg mb-2">Email</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>abhyshekbhalaji@gmail.com</p>
            </a>

            <a 
              href="https://x.com/AbhyAtTech"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 rounded-2xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 group`}
            >
              <Twitter className={`w-10 h-10 ${isDark ? 'text-white' : 'text-gray-900'} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
              <p className="font-semibold text-lg mb-2">X</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>AbhyAtTech</p>
            </a>
          </div>

          <div className={`mt-12 p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Based in India • Available for onsite/remote opportunities worldwide
            </p>
          </div>
        </div>
      </section>

      <nav className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-full ${glassNav} border shadow-2xl transition-all duration-500`}>
        <div className="flex items-center gap-3">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`p-3 rounded-full transition-all duration-500 ${
                activeSection === id 
                  ? `${isDark ? 'bg-white text-black' : 'bg-blue-600 text-white'} scale-110 shadow-lg` 
                  : `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`
              }`}
              title={label}
              onMouseEnter={(e) => animateHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateHover(e.currentTarget, false)}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;