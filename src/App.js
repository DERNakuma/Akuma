import React, { useEffect, useState, lazy, Suspense } from 'react';
import './App.css';
import './responsive-nav.css';
import './tech-tags-animation.css';
import './project-hover.css';
import './new-projects.css';
import './scroll-animations.css';
import observeElements from './scroll-observer.js';
import { initScrollEngine, getLenis } from './scroll-engine.js';

const AnimatedText = lazy(() => import('./components/AnimatedText'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Set initial theme toggle icon
    setTimeout(() => {
      const themeToggle = document.querySelector('.theme-toggle-fixed');
      if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
      }
    }, 100);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Initialize smooth slideshow after component mounts
    const initSlideshow = () => {
      const hobbyCards = document.querySelectorAll('.hobby-card');
      
      hobbyCards.forEach(card => {
        const slides = card.querySelectorAll('.hobby-slide');
        
        // Ensure smooth transitions by preloading images
        slides.forEach((slide, index) => {
          const img = new Image();
          img.src = slide.src;
          
          // Set initial state
          if (index === 0) {
            slide.style.opacity = '1';
            slide.style.transform = 'scale(1)';
          } else {
            slide.style.opacity = '0';
            slide.style.transform = 'scale(1.02)';
          }
        });
      });
    };

    // Initialize after a short delay to ensure DOM is ready
    setTimeout(initSlideshow, 100);
    
    // Initialize scroll animations
    setTimeout(observeElements, 200);

    // Initialize Lenis smooth scroll + GSAP text animations
    setTimeout(initScrollEngine, 300);

    // Initialize cursor multiflow
    const cursor = document.createElement('div');
    cursor.className = 'cursor-main';
    document.body.appendChild(cursor);

    const trails = [];
    const trailClasses = ['cursor-trail-1', 'cursor-trail-2', 'cursor-trail-3', 'cursor-trail-4'];
    
    trailClasses.forEach(className => {
      const trail = document.createElement('div');
      trail.className = `cursor-trail ${className}`;
      document.body.appendChild(trail);
      trails.push(trail);
    });

    let mouseX = 0, mouseY = 0;
    const trailPositions = [];

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX - 2 + 'px';
      cursor.style.top = mouseY - 2 + 'px';
    });

    const animateTrails = () => {
      trailPositions.unshift({ x: mouseX, y: mouseY });
      if (trailPositions.length > 20) {
        trailPositions.pop();
      }
      
      trails.forEach((trail, index) => {
        const delay = (index + 1) * 3;
        if (trailPositions[delay]) {
          const size = trail.offsetWidth;
          trail.style.left = trailPositions[delay].x - size/2 + 'px';
          trail.style.top = trailPositions[delay].y - size/2 + 'px';
          trail.style.opacity = 0.8 - (index * 0.15);
        }
      });
      
      requestAnimationFrame(animateTrails);
    };
    
    animateTrails();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="App">
      {/* Loading Screen */}
      <div className={`loading-screen ${!loading ? 'hidden' : ''}`}>
        <div className="loader">
          <div className="loader-text">Loading...</div>
          <div className="loader-bar"></div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress"></div>

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">Akuma.co</div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#hobbies" className="nav-link">Hobbies</a>
            <a href="#photography" className="nav-link">Photography</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="hamburger" onClick={() => {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
          }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="side-nav">
        <a href="#home" className="side-nav-link">Home</a>
        <a href="#about" className="side-nav-link">About</a>
        <a href="#skills" className="side-nav-link">Skills</a>
        <a href="#projects" className="side-nav-link">Projects</a>
        <a href="#hobbies" className="side-nav-link">Hobbies</a>
        <a href="#photography" className="side-nav-link">Photography</a>
        <a href="#contact" className="side-nav-link">Contact</a>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle-fixed" onClick={(e) => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        e.target.textContent = newTheme === 'light' ? '☀️' : '🌙';
      }}>
        ☀️
      </button>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-name-container">
            <h1 className="hero-name">
              {'BHUPENDER'.split('').map((char, i) => (
                <span key={i} className="hero-char">{char}</span>
              ))}
            </h1>
            <Suspense fallback={<div></div>}>
              <AnimatedText />
            </Suspense>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-left">
              <span>SOFTWARE ENGINEER,</span>
              <span>FULL STACK DEVELOPER</span>
            </div>
            <div className="hero-meta-center"></div>
            <div className="hero-meta-right">INDIA, IN</div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-container">

          {/* Top: bio left + portrait right */}
          <div className="about-top-row">
            <div className="about-left">
              <div className="about-badge">About Me</div>
              <h2 className="about-title">Crafting Digital Experiences</h2>
              <p className="about-description">
                I care about how things feel as much as how they work — clean interfaces, smooth interactions, details most people won't notice but will definitely feel. When I'm not designing or building, I'm usually deep in a game of Elden Ring, watching a film, following the F1 grid, or chasing a good frame through my camera lens.
              </p>
              <div className="about-meta-row">
                <span className="about-meta-item">Capgemini</span>
                <span className="about-meta-item">India</span>
              </div>
            </div>
            <div className="about-right">
              <div className="about-portrait-wrap">
                <video autoPlay muted loop className="about-video">
                  <source src="video/2.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* Experience table */}
          <div className="about-experience">
            <div className="about-section-label">Experience</div>
            <div className="about-exp-table">
              <div className="about-exp-row">
                <span className="exp-role">Software Engineer | Java Full Stack Developer</span>
                <span className="exp-company">Capgemini</span>
                <span className="exp-period">June 2025 – Present</span>
              </div>
              <div className="about-exp-divider"></div>
              <div className="about-exp-row">
                <span className="exp-role">Software Engineer Intern</span>
                <span className="exp-company">Capgemini</span>
                <span className="exp-period">March 2025 – May 2025</span>
              </div>
            </div>
          </div>

          {/* Resume sub-section */}
          <div className="about-resume">
            <div className="about-section-label">Resume</div>
            <p className="about-resume-tagline">Every line of code, every project, every role — documented.</p>
            <div className="about-resume-actions">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="about-resume-btn about-resume-btn--view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>View Resume</span>
              </a>
              <a href="/resume.pdf" download="Bhupender_Singh_Resume.pdf" className="about-resume-btn about-resume-btn--download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Download PDF</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="dashboard-section">
        <div className="container">
          <h2 className="section-title">Skills</h2>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-grid">
                  {[[
                    { title: 'Skills', dir: 'scroll-down', items: [
                        'Java','Python','JavaScript','TypeScript',
                        'Angular','Spring Boot','Spring Security','Hibernate',
                        'REST APIs','Microservices','HTML','CSS','UI/UX Design',
                        'Figma','MySQL','MongoDB','Firebase',
                        'Git','Maven','Postman','Swagger',
                        'Docker','Eureka','OpenFeign','API Gateway',
                        'RabbitMQ','OpenCV','MediaPipe','ML','Gen AI',
                      ], cls: 'skill-tag' },
                    { title: 'Certifications', dir: '', items: [
                        'Azure AI Fundamentals','UI/UX Design Certificate',
                        'Stakeholder Management','UI Design Fundamentals',
                        'UI/UX Essentials','UI Design Advanced',
                      ], cls: 'cert-list-item' },
                    { title: 'Other Skills', dir: 'scroll-down', items: [
                        'Figma','Framer','FL Studio','DaVinci','Adobe After Effects',
                        'Clipchamp','Copilot','Unity 3D',
                        'Figma','Framer','FL Studio','DaVinci','Adobe After Effects',
                        'Clipchamp','Copilot','Unity 3D',
                      ], cls: 'other-skill-item' },
                    { title: 'Projects', dir: '', items: [
                        'Hotel Management System','Face Recognition System',
                        'Student Management System','IoT Smart Home',
                        'Employee Payroll App','Address Book App',
                      ], cls: 'proj-list-item' },
                  ]].flat().map(({ title, dir, items, cls }) => {
                    const itemHeight = 46;
                    const pxPerSec = 30;
                    const duration = (items.length * itemHeight) / pxPerSec;
                    return (
                    <div key={title} className="dashboard-card"
                      onMouseEnter={e => {
                        const el = e.currentTarget.querySelector('.scrollable-card-content');
                        if (!el) return;
                        el.classList.add('paused', 'manual');
                        el.addEventListener('wheel', ev => ev.stopPropagation(), { passive: true });
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget.querySelector('.scrollable-card-content');
                        if (!el) return;
                        el.classList.remove('paused', 'manual');
                      }}
                    >
                      <div className="card-content">
                        <h3 className="card-title">{title}</h3>
                        <div className="scrollable-card-content">
                          <div
                            className={`scroll-inner ${dir}`}
                            style={{ animationDuration: `${duration}s` }}
                          >
                            {[...items, ...items].map((item, i) => (
                              <div key={i} className={cls}>{item}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
          </div>
        </div>
      </section>

      {/* Certifications — infinite scroll marquee */}
      {(() => {
        const certs = [
          { file: 'azure-ai.pdf',     name: 'Azure AI Fundamentals',    issuer: 'Microsoft' },
          { file: 'ui-ux-1.pdf',      name: 'UI/UX Design Certificate', issuer: 'Coursera'  },
          { file: 'stakeholder.pdf',  name: 'Stakeholder Management',   issuer: 'Coursera'  },
          { file: 'ui-1.pdf',         name: 'UI Design Fundamentals',   issuer: 'Coursera'  },
          { file: 'ui-ux-ess.pdf',    name: 'UI/UX Essentials',         issuer: 'Coursera'  },
          { file: 'ui2-advanced.pdf', name: 'UI Design Advanced',       issuer: 'Coursera'  },
        ];
        const doubled = [...certs, ...certs];
        return (
          <div className="cert-marquee-section">
            <div className="cert-marquee-header">
              <div className="about-section-label" style={{marginBottom: 0}}>Certifications</div>
            </div>
            <div className="cert-marquee-box">
              <div className="cert-marquee-outer">
                <div className="cert-marquee-track">
                  {doubled.map(({ file, name, issuer }, i) => (
                    <a key={i} href={`/certificates/${file}`} target="_blank" rel="noreferrer" className="cert-card">
                      <div className="cert-preview">
                        <div className="cert-preview-inner">
                          <iframe src={`/certificates/${file}#toolbar=0&navpanes=0&scrollbar=0`} title={name} className="cert-iframe" tabIndex={-1} />
                          <div className="cert-overlay">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            <span>Open</span>
                          </div>
                        </div>
                      </div>
                      <div className="cert-info">
                        <span className="cert-card-name">{name}</span>
                        <span className="cert-card-issuer">{issuer}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <section id="projects" className="projects-section">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image hotel"></div>
              <div className="project-content">
                <span className="project-number">01</span>
                <h3>Hotel Management System</h3>
                <p>Full-stack application with comprehensive booking, room management, billing, and admin dashboard features.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://reactjs.org', '_blank')}}>React</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://nodejs.org', '_blank')}}>Node.js</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://mongodb.com', '_blank')}}>MongoDB</span>
                </div>
              </div>
            </div>
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image face-recognition"></div>
              <div className="project-content">
                <span className="project-number">02</span>
                <h3>Face Recognition System</h3>
                <p>AI-powered face recognition system with real-time detection and identification capabilities.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://python.org', '_blank')}}>Python</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://opencv.org', '_blank')}}>OpenCV</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://tensorflow.org', '_blank')}}>TensorFlow</span>
                </div>
              </div>
            </div>
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma/SMS', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image student-management"></div>
              <div className="project-content">
                <span className="project-number">03</span>
                <h3>Student Management System</h3>
                <p>Comprehensive student information system with attendance tracking and grade management.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://java.com', '_blank')}}>Java</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://mysql.com', '_blank')}}>MySQL</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://spring.io/projects/spring-boot', '_blank')}}>Spring Boot</span>
                </div>
              </div>
            </div>
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image iot"></div>
              <div className="project-content">
                <span className="project-number">04</span>
                <h3>IoT Smart Home</h3>
                <p>Internet of Things solution for home automation with sensor integration and mobile control.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://arduino.cc', '_blank')}}>Arduino</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://raspberrypi.org', '_blank')}}>Raspberry Pi</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://reactnative.dev', '_blank')}}>React Native</span>
                </div>
              </div>
            </div>
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image payroll"></div>
              <div className="project-content">
                <span className="project-number">05</span>
                <h3>Employee Payroll App</h3>
                <p>Comprehensive payroll management system with salary calculations, tax deductions, and employee records.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://java.com', '_blank')}}>Java</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://spring.io/projects/spring-boot', '_blank')}}>Spring Boot</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://mysql.com', '_blank')}}>MySQL</span>
                </div>
              </div>
            </div>
            <div className="project-card" onClick={() => window.open('https://github.com/DERNakuma', '_blank')} style={{cursor: 'pointer'}}>
              <div className="project-image address-book"></div>
              <div className="project-content">
                <span className="project-number">06</span>
                <h3>Address Book App</h3>
                <p>Digital contact management application with search functionality, categorization, and data export features.</p>
                <div className="tech-tags">
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://reactjs.org', '_blank')}}>React</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://nodejs.org', '_blank')}}>Node.js</span>
                  <span onClick={(e) => {e.stopPropagation(); window.open('https://mongodb.com', '_blank')}}>MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hobbies" className="hobbies-section">
          <h2 className="section-title">Hobbies</h2>
          <div className="hobbies-grid">
            <div className="hobby-card gaming-card" onClick={() => window.open('https://tracker.gg/valorant/profile/riot/Akuma%23Dern/overview?platform=pc&playlist=competitive&season=ac12e9b3-47e6-9599-8fa1-0bb473e5efc7', '_blank')}>
              <div className="hobby-slideshow">
                <img src="photo/hobbies/6.jpg" className="hobby-slide" alt="Gaming" loading="lazy" />
                <img src="photo/hobbies/7.jpg" className="hobby-slide" alt="Gaming" loading="lazy" />
                <div className="hobby-overlay">
                  <h3>Gaming</h3>
                  <p>Professional esports player, ranked top 10K in Asia</p>
                </div>
              </div>
            </div>
            <div className="hobby-card cinema-card" onClick={() => window.open('https://share.google/TKPCSg8hJUuq6Ptlw', '_blank')}>
              <div className="hobby-slideshow">
                <img src="photo/hobbies/9.jpg" className="hobby-slide" alt="Cinema" loading="lazy" />
                <img src="photo/hobbies/11.jpg" className="hobby-slide" alt="Cinema" loading="lazy" />
                <div className="hobby-overlay">
                  <h3>Cinema</h3>
                  <p>Film enthusiast exploring diverse storytelling</p>
                </div>
              </div>
            </div>
            <div className="hobby-card">
              <div className="hobby-slideshow">
                <img src="photo/hobbies/21.jpg" className="hobby-slide" alt="Motorsports" loading="lazy" />
                <img src="photo/hobbies/23.jpg" className="hobby-slide" alt="Motorsports" loading="lazy" />
                <div className="hobby-overlay">
                  <h3>Motorsports</h3>
                  <p>Formula 1, NASCAR, Le Mans, MotoGP fan</p>
                </div>
              </div>
            </div>
            <div className="hobby-card music-card" onClick={() => window.open('https://music.youtube.com/playlist?list=PLFgo1IPJwu8mrWvurwqcbUNpWe-Fhiiur&si=bGhnr47FiJzr-THU', '_blank')}>
              <div className="hobby-slideshow">
                <img src="photo/hobbies/16.jpg" className="hobby-slide" alt="Music" loading="lazy" />
                <img src="photo/hobbies/17.jpg" className="hobby-slide" alt="Music" loading="lazy" />
                <div className="hobby-overlay">
                  <h3>Music</h3>
                  <p>Exploring various genres and soundscapes</p>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Photography Section */}
      <section id="photography" className="photography-section">
        <div className="photography-box">
          <div className="container">
            <h2 className="section-title">Photography</h2>
            <p className="photography-subtitle">Visual stories captured through my lens</p>
          </div>
          <div className="photography-masonry">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(num => (
              <div key={num} className={`photo-card photo-${num}`}>
                <div className="photo-wrapper">
                  <img src={`/photo/Gallery/${num}.jpg`} alt={`Gallery ${num}`} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Footer — sticky reveal */}
      <div className="footer-reveal-wrapper">
        <div className="footer-sticky">
          <section id="contact" className="contact-footer-block">
            {/* Giant headline */}
            <div className="cf-headline-wrap">
              <h2 className="cf-headline">LET'S TALK</h2>
            </div>

            {/* Bottom links row */}
            <div className="cf-bottom">
              <div className="cf-col">
                <div className="cf-col-label">Navigation</div>
                <a href="#home"        className="cf-link">Home</a>
                <a href="#about"       className="cf-link">About</a>
                <a href="#skills"      className="cf-link">Skills</a>
                <a href="#projects"    className="cf-link">Projects</a>
                <a href="#hobbies"     className="cf-link">Hobbies</a>
                <a href="#photography" className="cf-link">Photography</a>
              </div>
              <div className="cf-col">
                <div className="cf-col-label">Socials</div>
                <a href="https://www.instagram.com/k.rishna.0x0" target="_blank" rel="noreferrer" className="cf-link">Instagram</a>
                <a href="mailto:krishnasinghrajput7878@gmail.com" className="cf-link">Email</a>
                <a href="tel:+917302823524" className="cf-link">+91 7302823524</a>
              </div>
              <div className="cf-col">
                <div className="cf-col-label">Status</div>
                <p className="cf-credit">Available for Projects</p>
                <p className="cf-credit">India</p>
                <p className="cf-credit cf-copy">&copy; 2024 Bhupender Singh.<br />All rights reserved.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

// Add scroll functionality
// Uses Lenis scroll event when available, falls back to native scroll
if (typeof window !== 'undefined') {
  function handleScroll(scrollY) {
    const homeSection = document.getElementById('home');
    const topNav = document.querySelector('.top-nav');
    const sideNav = document.querySelector('.side-nav');

    if (homeSection && topNav && sideNav) {
      const homeHeight = homeSection.offsetHeight;
      if (scrollY > homeHeight - 100) {
        sideNav.style.opacity = '1';
        sideNav.style.visibility = 'visible';
        topNav.style.transform = 'translateY(-100%)';
      } else {
        sideNav.style.opacity = '0';
        sideNav.style.visibility = 'hidden';
        topNav.style.transform = 'translateY(0)';
      }
    }

    // Build section offsets from real DOM positions relative to document
    const sectionIds = ['home', 'about', 'skills', 'projects', 'hobbies', 'photography', 'contact'];
    const sideNavLinks = document.querySelectorAll('.side-nav-link');
    let current = 'home';

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      // getBoundingClientRect gives viewport-relative position;
      // adding scrollY converts it to document-absolute offset
      const top = el.getBoundingClientRect().top + scrollY;
      if (scrollY >= top - window.innerHeight * 0.35) {
        current = id;
      }
    });

    sideNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }

  // Attach to Lenis once it's ready, otherwise fall back to native scroll
  function attachScrollListeners() {
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => handleScroll(scroll));
    } else {
      window.addEventListener('scroll', () => handleScroll(window.scrollY));
    }
  }

  // Lenis is initialized 300ms after mount — wait for it
  setTimeout(attachScrollListeners, 400);

  // Enhanced hobby slideshow functionality
  window.addEventListener('DOMContentLoaded', () => {
    const hobbyCards = document.querySelectorAll('.hobby-card');
    
    hobbyCards.forEach((card, cardIndex) => {
      const slides = card.querySelectorAll('.hobby-slide');
      
      // Ensure first slide is visible
      if (slides.length > 0) {
        slides[0].style.opacity = '1';
        slides[0].style.transform = 'scale(1)';
      }
      
      // Preload images for smooth transitions
      slides.forEach(slide => {
        const img = new Image();
        img.src = slide.src;
      });
      
      // Add smooth transition on hover
      card.addEventListener('mouseenter', () => {
        slides.forEach(slide => {
          slide.style.transform = 'scale(1.05)';
        });
      });
      
      card.addEventListener('mouseleave', () => {
        slides.forEach(slide => {
          slide.style.transform = 'scale(1)';
        });
      });
    });
  });
}
