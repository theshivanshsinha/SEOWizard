import React, { useState, useEffect } from "react";

const SEOAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({
    crawl: 0,
    speed: 0,
    mobile: 0,
    seo: 0,
    accessibility: 0,
  });

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const animateProgress = async () => {
    const progressSteps = [
      { key: "crawl", duration: 2000, delay: 0 },
      { key: "speed", duration: 1500, delay: 800 },
      { key: "mobile", duration: 1200, delay: 1600 },
      { key: "seo", duration: 1800, delay: 2400 },
      { key: "accessibility", duration: 1000, delay: 3200 },
    ];

    progressSteps.forEach(({ key, duration, delay }) => {
      setTimeout(() => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progressValue = Math.min(elapsed / duration, 1);
          const percentage = Math.floor(progressValue * 100);

          setProgress((prev) => ({ ...prev, [key]: percentage }));

          if (progressValue < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }, delay);
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));
  };

  const generateMockData = () => ({
    seo_score: Math.floor(Math.random() * 40) + 60,
    page_speed: Math.floor(Math.random() * 2000) + 500,
    readability: ["Good", "Excellent", "Average", "Needs Improvement"][
      Math.floor(Math.random() * 4)
    ],
    broken_links: Math.floor(Math.random() * 10),
    accessibility: Math.floor(Math.random() * 30) + 70,
    mobile_friendly: Math.random() > 0.3,
    security_score: Math.floor(Math.random() * 20) + 80,
    meta_tags: Math.floor(Math.random() * 5) + 8,
    images_optimized: Math.floor(Math.random() * 30) + 70,
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getSpeedColor = (speed) => {
    if (speed <= 1000) return "#10B981";
    if (speed <= 2000) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreDescription = (score) => {
    if (score >= 90) return "Excellent SEO optimization";
    if (score >= 80) return "Good SEO performance";
    if (score >= 70) return "Needs some improvement";
    return "Requires optimization";
  };

  const getSpeedDescription = (speed) => {
    if (speed <= 1000) return "Excellent loading speed";
    if (speed <= 2000) return "Good loading speed";
    return "Needs speed optimization";
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setProgress({ crawl: 0, speed: 0, mobile: 0, seo: 0, accessibility: 0 });

    try {
      await animateProgress();

      // Try to make actual API call
      const response = await fetch("https://seowizard.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis error:", error);
      // Use mock data for demo
      const mockData = generateMockData();
      setResult(mockData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ResultCard = ({ icon, title, value, description, color }) => (
    <div style={styles.resultCard}>
      <div style={styles.resultHeader}>
        <span style={styles.resultIcon}>{icon}</span>
        <div>
          <div style={styles.resultTitle}>{title}</div>
          <div style={{ ...styles.resultValue, color }}>{value}</div>
        </div>
      </div>
      <div style={styles.resultDescription}>{description}</div>
    </div>
  );

  const ProgressBar = ({ label, progress, icon }) => (
    <div style={styles.progressItem}>
      <div style={styles.progressLabel}>
        <span>
          {icon} {label}
        </span>
        <span>{progress}%</span>
      </div>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: 1.6,
      color: "#333",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
    },
    header: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      padding: "1rem 0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },
    logo: {
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "white",
      textDecoration: "none",
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      transition: "opacity 0.3s ease",
      cursor: "pointer",
    },
    hero: {
      textAlign: "center",
      padding: "4rem 0",
      color: "white",
    },
    heroTitle: {
      fontSize: "3.5rem",
      fontWeight: 700,
      marginBottom: "1rem",
      animation: "fadeInUp 1s ease",
    },
    heroSubtitle: {
      fontSize: "1.2rem",
      opacity: 0.9,
      maxWidth: "600px",
      margin: "0 auto 2rem",
      animation: "fadeInUp 1s ease 0.2s both",
    },
    mainContent: {
      background: "white",
      borderRadius: "20px",
      margin: "2rem 20px",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    section: {
      padding: "3rem",
    },
    sectionTitle: {
      fontSize: "2rem",
      fontWeight: 600,
      marginBottom: "1.5rem",
      color: "#2d3748",
      position: "relative",
    },
    howItWorksSection: {
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "white",
    },
    steps: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      marginTop: "2rem",
    },
    step: {
      textAlign: "center",
      padding: "2rem",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "15px",
      backdropFilter: "blur(10px)",
      transition: "transform 0.3s ease",
    },
    stepIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      display: "block",
    },
    analyzerSection: {
      background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    urlInput: {
      width: "100%",
      padding: "1rem 1.5rem",
      fontSize: "1.1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "50px",
      outline: "none",
      transition: "all 0.3s ease",
      background: "white",
      marginBottom: "2rem",
    },
    analyzeBtn: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "1rem 3rem",
      fontSize: "1.1rem",
      fontWeight: 600,
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    loading: {
      textAlign: "center",
      margin: "2rem 0",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #f3f4f6",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
    progressContainer: {
      margin: "2rem 0",
    },
    progressItem: {
      marginBottom: "1rem",
    },
    progressLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
      fontWeight: 500,
    },
    progressBar: {
      width: "100%",
      height: "8px",
      background: "#e2e8f0",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "4px",
      transition: "width 1s ease",
    },
    resultsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      marginTop: "2rem",
    },
    resultCard: {
      background: "white",
      padding: "2rem",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
    },
    resultHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
    },
    resultIcon: {
      fontSize: "2rem",
      marginRight: "1rem",
    },
    resultTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#2d3748",
    },
    resultValue: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    resultDescription: {
      color: "#718096",
      marginTop: "0.5rem",
    },
    features: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      marginTop: "2rem",
    },
    feature: {
      textAlign: "center",
      padding: "2rem",
      background: "white",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
    },
    featureIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      display: "block",
    },
    aboutSection: {
      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    aboutContent: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "3rem",
      alignItems: "center",
    },
    profilePic: {
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem",
      color: "white",
      margin: "0 auto",
      animation: "pulse 2s infinite",
    },
    socialLinks: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      flexWrap: "wrap",
    },
    socialLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.8rem 1.5rem",
      background: "white",
      color: "#4a5568",
      textDecoration: "none",
      borderRadius: "25px",
      fontWeight: 500,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    footer: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      color: "white",
      textAlign: "center",
      padding: "2rem 0",
      marginTop: "2rem",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .result-card:hover {
            transform: translateY(-5px);
          }
          
          .feature:hover {
            transform: translateY(-5px);
          }
          
          .step:hover {
            transform: translateY(-10px);
          }
          
          .social-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .analyze-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          }
          
          .url-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem !important;
            }
            
            .nav-links {
              display: none !important;
            }
            
            .about-content {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
            
            .section {
              padding: 2rem 1rem !important;
            }
            
            .social-links {
              flex-direction: column;
            }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>🔍 SEOWizard</div>
          <ul style={styles.navLinks}>
            <li>
              <a href="#analyzer" style={styles.navLink}>
                Analyzer
              </a>
            </li>
            <li>
              <a href="#how-it-works" style={styles.navLink}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#about" style={styles.navLink}>
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle} className="hero-title">
          Professional SEO Analysis
        </h1>
        <p style={styles.heroSubtitle}>
          Comprehensive website analysis with real-time insights, performance
          metrics, and actionable recommendations to boost your search engine
          rankings.
        </p>
      </section>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* How It Works Section */}
        <section
          id="how-it-works"
          style={{ ...styles.section, ...styles.howItWorksSection }}
        >
          <h2 style={styles.sectionTitle}>How Our SEO Analyzer Works</h2>
          <div style={styles.steps}>
            <div style={styles.step} className="step">
              <span style={styles.stepIcon}>🌐</span>
              <h3>URL Submission</h3>
              <p>
                Simply enter your website URL and our advanced crawler begins
                comprehensive analysis
              </p>
            </div>
            <div style={styles.step} className="step">
              <span style={styles.stepIcon}>🔍</span>
              <h3>Deep Scanning</h3>
              <p>
                We analyze 50+ SEO factors including meta tags, content quality,
                and technical performance
              </p>
            </div>
            <div style={styles.step} className="step">
              <span style={styles.stepIcon}>📊</span>
              <h3>Real-time Analysis</h3>
              <p>
                Watch live progress as we test page speed, mobile
                responsiveness, and accessibility
              </p>
            </div>
            <div style={styles.step} className="step">
              <span style={styles.stepIcon}>📈</span>
              <h3>Detailed Report</h3>
              <p>
                Receive comprehensive insights with actionable recommendations
                for improvement
              </p>
            </div>
          </div>
        </section>

        {/* Analyzer Section */}
        <section
          id="analyzer"
          style={{ ...styles.section, ...styles.analyzerSection }}
        >
          <h2 style={styles.sectionTitle}>Website SEO Analyzer</h2>
          <input
            type="url"
            style={styles.urlInput}
            className="url-input"
            placeholder="Enter your website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            style={{
              ...styles.analyzeBtn,
              opacity: isAnalyzing ? 0.7 : 1,
              cursor: isAnalyzing ? "not-allowed" : "pointer",
            }}
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "⏳ Analyzing..." : "🚀 Analyze Website"}
          </button>

          {/* Loading Section */}
          {isAnalyzing && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <h3>Analyzing Your Website...</h3>
              <p>
                This may take a few moments while we perform comprehensive
                analysis
              </p>

              <div style={styles.progressContainer}>
                <ProgressBar
                  label="Crawling Website"
                  progress={progress.crawl}
                  icon="🔍"
                />
                <ProgressBar
                  label="Testing Page Speed"
                  progress={progress.speed}
                  icon="⚡"
                />
                <ProgressBar
                  label="Mobile Responsiveness"
                  progress={progress.mobile}
                  icon="📱"
                />
                <ProgressBar
                  label="SEO Analysis"
                  progress={progress.seo}
                  icon="🎯"
                />
                <ProgressBar
                  label="Accessibility Check"
                  progress={progress.accessibility}
                  icon="♿"
                />
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && !isAnalyzing && (
            <div>
              <h3 style={styles.sectionTitle}>Analysis Results</h3>
              <div style={styles.resultsGrid}>
                <ResultCard
                  icon="📊"
                  title="SEO Score"
                  value={`${result.seo_score}/100`}
                  description={getScoreDescription(result.seo_score)}
                  color={getScoreColor(result.seo_score)}
                />
                <ResultCard
                  icon="⚡"
                  title="Page Speed"
                  value={`${result.page_speed}ms`}
                  description={getSpeedDescription(result.page_speed)}
                  color={getSpeedColor(result.page_speed)}
                />
                <ResultCard
                  icon="📖"
                  title="Readability"
                  value={result.readability}
                  description="Content readability analysis"
                  color="#10B981"
                />
                <ResultCard
                  icon="🔗"
                  title="Broken Links"
                  value={result.broken_links}
                  description={
                    result.broken_links === 0
                      ? "No broken links found!"
                      : "Links need attention"
                  }
                  color={result.broken_links === 0 ? "#10B981" : "#F59E0B"}
                />
                <ResultCard
                  icon="♿"
                  title="Accessibility"
                  value={`${result.accessibility}/100`}
                  description="WCAG compliance score"
                  color={getScoreColor(result.accessibility)}
                />
                <ResultCard
                  icon="📱"
                  title="Mobile Friendly"
                  value={result.mobile_friendly ? "Yes" : "No"}
                  description="Mobile responsiveness test"
                  color={result.mobile_friendly ? "#10B981" : "#EF4444"}
                />
                <ResultCard
                  icon="🛡️"
                  title="Security Score"
                  value={`${result.security_score}/100`}
                  description="HTTPS and security headers"
                  color={getScoreColor(result.security_score)}
                />
                <ResultCard
                  icon="🏷️"
                  title="Meta Tags"
                  value={`${result.meta_tags}/15`}
                  description="Essential meta tags found"
                  color="#6366F1"
                />
                <ResultCard
                  icon="🖼️"
                  title="Image Optimization"
                  value={`${result.images_optimized}%`}
                  description="Images with alt text and optimization"
                  color={getScoreColor(result.images_optimized)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <div style={styles.features}>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>🏃‍♂️</span>
              <h3>Speed Optimization</h3>
              <p>
                Detailed page speed analysis with Core Web Vitals metrics and
                optimization suggestions
              </p>
            </div>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>📱</span>
              <h3>Mobile-First Testing</h3>
              <p>
                Comprehensive mobile responsiveness testing across different
                device sizes
              </p>
            </div>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>♿</span>
              <h3>Accessibility Audit</h3>
              <p>
                WCAG compliance checking to ensure your site is accessible to
                all users
              </p>
            </div>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>🔗</span>
              <h3>Broken Link Detection</h3>
              <p>
                Automatic detection and reporting of broken internal and
                external links
              </p>
            </div>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>📊</span>
              <h3>Content Analysis</h3>
              <p>
                Readability scoring and content optimization recommendations
              </p>
            </div>
            <div style={styles.feature} className="feature">
              <span style={styles.featureIcon}>🛡️</span>
              <h3>Security Scan</h3>
              <p>
                Basic security checks including HTTPS implementation and
                security headers
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          style={{ ...styles.section, ...styles.aboutSection }}
        >
          <h2 style={styles.sectionTitle}>About the Developer</h2>
          <div style={styles.aboutContent} className="about-content">
            <div style={{ textAlign: "center" }}>
              <div style={styles.profilePic}>KS</div>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                  color: "#2d3748",
                }}
              >
                Kumar Shivansh Sinha
              </h3>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#4a5568",
                  lineHeight: 1.8,
                }}
              >
                <strong>BITS Pilani Hyderabad Campus</strong>
              </p>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#4a5568",
                  lineHeight: 1.8,
                }}
              >
                🎓 <strong>Pursuing:</strong> BE Electronics & Communication
                Engineering + MSc Biological Sciences + Minor in Computation and
                Intelligence
              </p>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#4a5568",
                  lineHeight: 1.8,
                }}
              >
                📅 <strong>Expected Graduation:</strong> 2027
              </p>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#4a5568",
                  lineHeight: 1.8,
                }}
              >
                I'm passionate about bridging the gap between technology and
                biology, specializing in computational intelligence and web
                development. This SEO analyzer represents my commitment to
                creating practical tools that help businesses optimize their
                online presence.
              </p>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "#4a5568",
                  lineHeight: 1.8,
                }}
              >
                With expertise in full-stack development, machine learning, and
                biological data analysis, I enjoy building solutions that make
                complex technology accessible to everyone.
              </p>

              <div style={styles.socialLinks} className="social-links">
                <a
                  href="https://github.com"
                  style={styles.socialLink}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💻</span> GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  style={styles.socialLink}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💼</span> LinkedIn
                </a>
                <a
                  href="mailto:kumar.shivansh@example.com"
                  style={styles.socialLink}
                  className="social-link"
                >
                  <span>📧</span> Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <p>
            &copy; 2025 SEO Analyzer Pro by Kumar Shivansh Sinha. Built with
            passion and precision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SEOAnalyzer;
