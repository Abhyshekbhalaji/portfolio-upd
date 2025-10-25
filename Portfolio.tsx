import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Github, Twitter, Linkedin, Mail, Code2, Award, Briefcase, GraduationCap, User, ExternalLink, Database, Server, Layers,Download } from 'lucide-react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const SkeletonCard = ({ className = '' }) => (
  <div className={`p-8 rounded-3xl bg-gray-800/50 animate-pulse ${className}`}>
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
  </div>
);

const Portfolio = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  const animateHover = (element, isEnter) => {
    gsap.to(element, {
      duration: 0.6,
      scale: isEnter ? 1.05 : 1,
      ease: "power2.out",
      yoyo: true,
      repeat: 0
    });
  };



useEffect(() => {
  if (!canvasRef.current) return;

  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.z = 20;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.current, 
    alpha: false,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // === SINGLE BEAUTIFUL TORUS ===
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

  // === LIGHTS ===
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

  // === MOUSE INTERACTION ===
  let mouseX = 0;
  let mouseY = 0;

  const handleMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // === ANIMATION LOOP ===
  let animationId;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    // Smooth rotation
    torus.rotation.x += 0.003;
    torus.rotation.y += 0.004;
    torus.rotation.z += 0.002;
    
    // Breathing effect
    const breathe = 1 + Math.sin(Date.now() * 0.0008) * 0.1;
    torus.scale.setScalar(breathe);
    
    // Follow mouse smoothly
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

  // === WINDOW RESIZE ===
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  // === CLEANUP ===
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
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
  const cardBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50/80';

  const glassNav = isDark 
    ? 'bg-gray-900/40 backdrop-blur-xl border-gray-700/50' 
    : 'bg-gray-400/50 opacity-80 backdrop-blur-xl border-blue-200/50';

  const projects = [
    {
      title: "Horizon - Financial Dashboard",
      tech: "React.js, Next.js, Tailwind CSS, Appwrite",
      description: "Engineered a financial web app with real-time transactions, achieving 25% improvement in user engagement through secure authentication and optimized transaction flow.",
      metrics: "25% faster API responses, enhanced user experience"
    },
    {
      title: "Pitcher - Startup Platform",
      tech: "Next.js, TypeScript, Sanity",
      description: "Converted codebase to TypeScript, reducing potential bugs by 40%. Developed startup pitching feature with 20% increase in user interaction.",
      metrics: "40% fewer bugs, 20% more engagement"
    },
    {
      title: "Store It - File Management",
      tech: "Next.js, Appwrite, TypeScript",
      description: "Built scalable file management platform with 99.9% uptime, supporting 1,000+ users. Optimized upload/retrieval processes for 15% faster response times.",
      metrics: "99.9% uptime, 1000+ users supported"
    }
  ];

  const skills = {
    languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    frameworks: ["React.js", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "Vue", "Appwrite"],
    concepts: ["OOP", "Functional Programming", "REST APIs", "DSA", "Git", "Responsive Design"],
    tools: ["GitHub", "VSCode", "Postman", "Version Control"],
    databases: ["MySQL", "MongoDB", "PostgreSQL"]
  };

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
            Dynamic software developer with expertise in architecting full-stack applications. 
            Experienced in optimizing performance across cloud platforms including Google Cloud Platform. 
            Strong focus on clean code, UI design, and continuous improvement.
          </p>

          <div 
            className={`inline-flex  items-center gap-3 mb-10 px-10 py-5 rounded-2xl  ${cardBg} backdrop-blur-lg border-2 ${isDark ? 'border-gray-600 shadow-gray-800/20' : 'border-blue-300 shadow-blue-200/20'} shadow-2xl relative overflow-hidden`}
            onMouseEnter={(e) => animateHover(e.currentTarget, true)}
            onMouseLeave={(e) => animateHover(e.currentTarget, false)}
          >
            <Code2 className={`w-7 h-7 ${isDark ? 'text-white' : 'text-gray-900'} animate-pulse z-10 relative`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} z-10 relative`}>
              Open Source Contributor
            </span>
            <div className="flex gap-1 z-10 relative">
              <div className={`w-2 h-2 rounded-full ${isDark?'bg-white' : 'bg-blue-400'}  animate-ping`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark?'bg-white' : 'bg-blue-400'}`}></div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-75 animate-shine"></div>
            {isDark ? null : (
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
              href="https://www.linkedin.com/in/abhyshek-bhalaji-s-a4414a220/" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-blue-300 hover:border-blue-400 hover:bg-gray-100'} transition-all duration-500 hover:scale-105 hover:shadow-lg`}
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
            href="https://drive.google.com/file/d/1E48D4deZ_fNmK5AkqgrymcEN1pnXvTuo/view?usp=drive_link" download
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
                  <span>Full-stack application architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>▸</span>
                  <span>UI/UX design & services development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>▸</span>
                  <span>Cloud platform optimization (GCP)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>▸</span>
                  <span>Performance optimization & troubleshooting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>▸</span>
                  <span>Agile methodologies & cross-functional collaboration</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={`mt-8 p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Dynamic software developer with a strong foundation in full-stack development methodologies. 
              I specialize in architecting scalable applications with a keen focus on user interface design and 
              backend services. My experience spans from optimizing REST APIs to implementing cloud solutions, 
              always driven by a commitment to clean code practices and continuous improvement. I thrive in 
              collaborative environments and excel at adapting to new technologies while maintaining strong 
              problem-solving capabilities.
            </p>
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
        Array(3).fill().map((_, idx) => (
          <SkeletonCard key={idx} />
        ))
      ) : (
        projects.map((project, idx) => (
          <div 
            key={idx}
            className={`p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg group relative overflow-hidden transition-all duration-300`}
            onMouseEnter={(e) => {
              animateHover(e.currentTarget, true);
              e.currentTarget.style.backdropFilter = 'blur(8px)'; // Apply blur on hover
            }}
            onMouseLeave={(e) => {
              animateHover(e.currentTarget, false);
              e.currentTarget.style.backdropFilter = 'blur(0px)'; // Remove blur on leave
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

            {/* Hover overlay with image and buttons */}
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 group-hover:backdrop-blur-lg">
  <div className="text-center flex md:flex-col items-center gap-1 sm:gap-2 md:gap-2">
    {/* Placeholder image - replace with actual project image URL */}
    <img 
      src={`data:image/jpeg;base64,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`} 
      alt={project.title} 
      className="w-48 h-32 sm:w-60 sm:h-40 md:w-72 md:h-48 object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
    />
    {/* Live Link Button */}
    <div className='flex  justify-center items-center gap-2'>
     <a 
      href="#" // Replace with actual live link
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-blue-300'} text-xs sm:text-sm md:text-base transition-all duration-500 hover:bg-green-500 hover:text-white hover:border-green-500`}
    >
      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
      <span>Live Link</span>
    </a>
    {/* GitHub Link Button */}
     <a 
      href="#" // Replace with actual live link
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
              Array(5).fill().map((_, idx) => (
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

                <div 
                  className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-blue-300 hover:border-blue-400'} shadow-lg`}
                  onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                  onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                >
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Award className="w-5 h-5" />
                    Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.concepts.map((skill, i) => (
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
                    <Server className="w-5 h-5" />
                    Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.tools.map((skill, i) => (
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
          {[
            { id: 'hero', icon: User, label: 'Home' },
            { id: 'about', icon: GraduationCap, label: 'About' },
            { id: 'experience', icon: Briefcase, label: 'Experience' },
            { id: 'projects', icon: Layers, label: 'Projects' },
            { id: 'skills', icon: Code2, label: 'Skills' },
            { id: 'contact', icon: Mail, label: 'Contact' }
          ].map(({ id, icon: Icon, label }) => (
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