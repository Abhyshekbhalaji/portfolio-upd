import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Github, Linkedin, Mail, Code2, Award, Briefcase, GraduationCap, User, ExternalLink, Database, Server, Layers } from 'lucide-react';
import * as THREE from 'three';

const Portfolio = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: isDark ? 0xffffff : 0x000000,
      transparent: true,
      opacity: 0.4
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const torusGeometry = new THREE.TorusGeometry(4, 0.8, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0xffffff : 0x000000,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0xcccccc : 0x333333,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(8, 3, -5);
    scene.add(sphere);

    const pointLight = new THREE.PointLight(isDark ? 0xffffff : 0x000000, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(isDark ? 0xcccccc : 0x333333, 1.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    camera.position.z = 15;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      torus.rotation.x += 0.008;
      torus.rotation.y += 0.01;
      torus.rotation.z += 0.005;
      
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.008;
      
      particlesMesh.rotation.y += 0.0015;
      particlesMesh.rotation.x = mouseY * 0.1;
      particlesMesh.rotation.y = mouseX * 0.1;
      
      camera.position.x = mouseX * 2;
      camera.position.y = mouseY * 2;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
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
    };
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
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

  const bgClass = isDark ? 'bg-black' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-900/50' : 'bg-white/50';
  const glassNav = isDark 
    ? 'bg-gray-900/40 backdrop-blur-xl border-gray-700/50' 
    : 'bg-white/40 backdrop-blur-xl border-gray-200/50';

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
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-500 relative overflow-hidden`}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      
      <div className={`fixed inset-0 -z-5 ${isDark ? 'opacity-10' : 'opacity-5'}`}>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 hover:scale-110 hover:rotate-180`}
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
      </button>

      <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className={`inline-block mb-6 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'} fade-in`}>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>👋 Welcome to my portfolio</span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 fade-in ${isDark ? 'text-white' : 'text-black'}`}>
            Abhyshek Bhalaji S
          </h1>
          
          <p className="text-2xl md:text-4xl mb-4 font-light fade-in">
            Full Stack Software Engineer
          </p>
          
          <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-4xl mx-auto fade-in`}>
            Dynamic software developer with expertise in architecting full-stack applications. 
            Experienced in optimizing performance across cloud platforms including Google Cloud Platform. 
            Strong focus on clean code, UI design, and continuous improvement.
          </p>

          <div className={`inline-flex items-center gap-3 mb-10 px-10 py-5 rounded-2xl ${cardBg} backdrop-blur-lg border-2 ${isDark ? 'border-gray-600 shadow-gray-800/20' : 'border-gray-300 shadow-gray-400/20'} transform hover:scale-105 transition-all duration-300 shadow-2xl fade-in`}>
            <Code2 className={`w-7 h-7 ${isDark ? 'text-white' : 'text-black'} animate-pulse`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              Open Source Contributor
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap fade-in">
            <a 
              href="https://github.com/Abhyshekbhalaji" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="https://leetcode.com/u/AbhyshekBhalaji/" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <Code2 className="w-5 h-5" />
              <span>LeetCode</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/abhyshek-bhalaji-s-a4414a220/" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="mailto:abhyshekbhalaji@gmail.com"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <Mail className="w-5 h-5" />
              <span>Contact Me</span>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12 fade-in">
            <User className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <GraduationCap className={`w-12 h-12 ${isDark ? 'text-white' : 'text-black'} mb-4`} />
              <h3 className="text-2xl font-bold mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">Bachelor of Technology</p>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Biotechnology</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Sastra University, Tanjore, TN</p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>June 2019 - June 2023</p>
                </div>
                <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <p className="font-semibold mb-2">Relevant Coursework:</p>
                  <ul className={`space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>• Data Structures & Algorithms (Java)</li>
                    <li>• Python for Bio Engineers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <Award className={`w-12 h-12 ${isDark ? 'text-white' : 'text-black'} mb-4`} />
              <h3 className="text-2xl font-bold mb-4">Key Strengths</h3>
              <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-white' : 'text-black'} mt-1`}>▸</span>
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
                  <span className={`${isDark ? 'text-white' : 'text-black'} mt-1`}>▸</span>
                  <span>Performance optimization & troubleshooting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>▸</span>
                  <span>Agile methodologies & cross-functional collaboration</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={`mt-8 p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} fade-in`}>
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
          <div className="flex items-center gap-3 mb-12 fade-in">
            <Briefcase className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Experience</h2>
          </div>

          <div className={`p-10 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} transition-all duration-500 hover:scale-[1.02] fade-in`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Software Engineer Intern</h3>
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
                  <Server className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'} mt-1 flex-shrink-0`} />
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
                  <Award className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'} mt-1 flex-shrink-0`} />
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
                  <Database className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'} mt-1 flex-shrink-0`} />
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
        </div>
      </section>

      <section id="projects" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12 fade-in">
            <Layers className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 group fade-in`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-2xl font-bold transition-colors`}>
                    {project.title}
                  </h3>
                  <ExternalLink className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} font-semibold`}>
                  {project.tech}
                </p>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-sm font-semibold`}>
                  {project.metrics}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12 fade-in">
            <Code2 className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                <Code2 className="w-5 h-5" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, i) => (
                  <span 
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                <Layers className="w-5 h-5" />
                Frameworks
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill, i) => (
                  <span 
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                <Database className="w-5 h-5" />
                Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.databases.map((skill, i) => (
                  <span 
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                <Award className="w-5 h-5" />
                Concepts
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.concepts.map((skill, i) => (
                  <span 
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-500'} hover:scale-105 transition-all duration-500 fade-in`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                <Server className="w-5 h-5" />
                Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, i) => (
                  <span 
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover:scale-110 transition-all cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen flex items-center px-6 py-20 pb-40">
        <div className="max-w-4xl mx-auto w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-12 fade-in">
            <Mail className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          </div>

          <p className={`text-xl mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'} fade-in`}>
            I'm always open to discussing new projects, creative ideas, or opportunities to collaborate. 
            Let's build something amazing together!
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a 
              href="mailto:abhyshekbhalaji@gmail.com"
              className={`p-8 rounded-2xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-200'} transition-all duration-300 hover:scale-105 group fade-in`}
            >
              <Mail className={`w-10 h-10 ${isDark ? 'text-white' : 'text-black'} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
              <p className="font-semibold text-lg mb-2">Email</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>abhyshekbhalaji@gmail.com</p>
            </a>

            <a 
              href="tel:+917558117924"
              className={`p-8 rounded-2xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-200'} transition-all duration-300 hover:scale-105 group fade-in`}
            >
              <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                <svg className={`w-10 h-10 ${isDark ? 'text-white' : 'text-black'} group-hover:scale-110 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="font-semibold text-lg mb-2">Phone</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>+91 7558117924</p>
            </a>
          </div>

          <div className={`mt-12 p-8 rounded-3xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'} fade-in`}>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Based in India • Available for remote opportunities worldwide
            </p>
          </div>
        </div>
      </section>

      <nav className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-full ${glassNav} border shadow-2xl`}>
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
              className={`p-3 rounded-full transition-all duration-300 ${
                activeSection === id 
                  ? `${isDark ? 'bg-white text-black' : 'bg-black text-white'} scale-110 shadow-lg` 
                  : `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`
              }`}
              title={label}
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
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;