import React, { useState, useEffect } from 'react';
import { Book, Search, Menu, X, Copy, CheckCircle, ExternalLink, Code, Zap, Globe, Smartphone, Shield, Settings, HelpCircle, Mail, Brain } from 'lucide-react';
import Layout from '../components/Layout';

function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      subsections: [
        { id: 'introduction', title: 'What is DEFFATEST' },
        { id: 'quick-start', title: 'Quick Start Guide' },
        { id: 'first-test', title: 'Your First Test' }
      ]
    },
    {
      id: 'web-testing',
      title: 'Web Testing',
      icon: Globe,
      subsections: [
        { id: 'testing-by-url', title: 'Testing by URL' },
        { id: 'html-bundles', title: 'HTML/JS Bundles' },
        { id: 'web-config', title: 'Configuration Options' }
      ]
    },
    {
      id: 'mobile-testing',
      title: 'Mobile Testing',
      icon: Smartphone,
      subsections: [
        { id: 'uploading-apks', title: 'Uploading APKs' },
        { id: 'mobile-config', title: 'Configuration Options' }
      ]
    },
    {
      id: 'ai-understanding',
      title: 'Understanding AI',
      icon: Zap,
      subsections: [
        { id: 'how-ai-explores', title: 'How AI Explores' },
        { id: 'ai-customization', title: 'AI Customization' }
      ]
    },
    {
      id: 'reporting',
      title: 'Reporting & Analytics',
      icon: Shield,
      subsections: [
        { id: 'bug-reports', title: 'Interpreting Bug Reports' },
        { id: 'performance-insights', title: 'Performance & Security' },
        { id: 'integrations', title: 'External Integrations' }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      subsections: [
        { id: 'authentication', title: 'Authentication' },
        { id: 'endpoints', title: 'API Endpoints' },
        { id: 'error-codes', title: 'Error Codes' }
      ]
    },
    {
      id: 'cicd-integration',
      title: 'CI/CD Integration',
      icon: Settings,
      subsections: [
        { id: 'general-concepts', title: 'General Concepts' },
        { id: 'github-actions', title: 'GitHub Actions' },
        { id: 'gitlab-ci', title: 'GitLab CI' },
        { id: 'jenkins', title: 'Jenkins' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      subsections: [
        { id: 'common-issues', title: 'Common Issues' },
        { id: 'faq', title: 'FAQ' },
        { id: 'support', title: 'Get Support' }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false);
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const CodeBlock = ({ code, language = 'bash', id }: { code: string; language?: string; id: string }) => (
    <div className="relative bg-black/50 rounded-lg border border-purple-500/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
        <span className="text-sm text-purple-300 font-mono">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );

  const InfoBox = ({ type, title, children }: { type: 'info' | 'warning' | 'tip'; title: string; children: React.ReactNode }) => {
    const colors = {
      info: 'border-cyan-500/30 bg-cyan-500/10',
      warning: 'border-yellow-500/30 bg-yellow-500/10',
      tip: 'border-green-500/30 bg-green-500/10'
    };

    const icons = {
      info: '💡',
      warning: '⚠️',
      tip: '✨'
    };

    return (
      <div className={`rounded-lg border p-4 ${colors[type]}`}>
        <div className="flex items-center mb-2">
          <span className="mr-2">{icons[type]}</span>
          <h4 className="font-semibold text-white">{title}</h4>
        </div>
        <div className="text-gray-300">{children}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  DEFFATEST
                </span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/use-cases" className="nav-link">Use Cases</a>
              <a href="/features" className="nav-link">Features</a>
              <a href="/how-it-works" className="nav-link">How It Works</a>
              <a href="/pricing" className="nav-link">Pricing</a>
              <a href="/docs" className="nav-link text-cyan-400">Documentation</a>
              <a href="/contact-us" className="nav-link">Contact Us</a>
              <a href="/terms" className="nav-link">Terms</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                Login
              </a>
              <a href="/signup" className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`fixed left-0 top-16 h-full w-80 bg-black/50 backdrop-blur-lg border-r border-purple-500/20 transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-3" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                  {section.subsections && activeSection === section.id && (
                    <div className="ml-7 mt-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => scrollToSection(subsection.id)}
                          className="block w-full text-left px-3 py-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-50 lg:hidden bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="font-orbitron font-bold text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Everything you need to know about DEFFATEST's AI-powered testing platform. From getting started to advanced integrations.
              </p>
            </div>

            {/* Getting Started Section */}
            <section id="getting-started" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">Getting Started</h2>
              
              <div id="introduction" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">What is DEFFATEST?</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  DEFFATEST is an AI-powered software testing platform that autonomously tests web and mobile applications to identify bugs, performance issues, and security vulnerabilities. Unlike traditional testing tools that rely on brittle scripts, our AI uses Computer Vision and Large Language Models to explore your application like a real user would.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-card p-6 text-center">
                    <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-white mb-2">AI-Powered</h4>
                    <p className="text-sm text-gray-400">Advanced AI that learns and adapts</p>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-white mb-2">Lightning Fast</h4>
                    <p className="text-sm text-gray-400">Results in minutes, not hours</p>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-white mb-2">Comprehensive</h4>
                    <p className="text-sm text-gray-400">Functional, performance, and security testing</p>
                  </div>
                </div>
              </div>

              <div id="quick-start" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Quick Start Guide</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Get started with DEFFATEST in just a few simple steps:
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Create Your Account</h4>
                      <p className="text-gray-400">Sign up for a free DEFFATEST account to get started.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Upload Your Application</h4>
                      <p className="text-gray-400">Provide a URL for web apps or upload an APK for Android apps.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Let AI Do the Work</h4>
                      <p className="text-gray-400">Our AI will autonomously explore and test your application.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Review Results</h4>
                      <p className="text-gray-400">Get detailed reports with screenshots, videos, and reproduction steps.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="first-test">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Your First Test</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Let's run your first test with DEFFATEST. This example shows how to test a web application:
                </p>
                
                <CodeBlock
                  id="first-test-curl"
                  language="bash"
                  code={`# Submit your first test
curl -X POST https://api.deffatest.com/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "web",
    "app_url": "https://your-app.com",
    "test_name": "My First Test"
  }'`}
                />
                
                <InfoBox type="tip" title="Pro Tip">
                  Start with a simple public page to get familiar with the platform before testing complex authenticated applications.
                </InfoBox>
              </div>
            </section>

            {/* Web Testing Section */}
            <section id="web-testing" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">Web Testing</h2>
              
              <div id="testing-by-url" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Testing by URL</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  The simplest way to test a web application is by providing its URL. DEFFATEST will automatically discover and test all accessible pages and functionality.
                </p>
                
                <CodeBlock
                  id="web-url-test"
                  language="bash"
                  code={`curl -X POST https://api.deffatest.com/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "web",
    "app_url": "https://your-app.com",
    "test_name": "Production Web Test",
    "config": {
      "max_pages": 50,
      "test_duration": 30,
      "browser": "chrome"
    }
  }'`}
                />
              </div>

              <div id="html-bundles" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">HTML/JS Bundles</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  For applications that aren't publicly accessible, you can upload a complete HTML/JS bundle for testing.
                </p>
                
                <CodeBlock
                  id="bundle-upload"
                  language="bash"
                  code={`# Upload and test a bundle
curl -X POST https://api.deffatest.com/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "type=web_bundle" \\
  -F "bundle=@your-app-bundle.zip" \\
  -F "test_name=Bundle Test" \\
  -F "entry_point=index.html"`}
                />
              </div>

              <div id="web-config">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Configuration Options</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Customize your web tests with various configuration options:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-purple-500/30 rounded-lg overflow-hidden">
                    <thead className="bg-purple-500/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-semibold">Parameter</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Type</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-cyan-400">max_pages</td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">Maximum number of pages to test (default: 25)</td>
                      </tr>
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-cyan-400">test_duration</td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">Test duration in minutes (default: 15)</td>
                      </tr>
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-cyan-400">browser</td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">Browser to use: chrome, firefox, safari</td>
                      </tr>
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-cyan-400">viewport</td>
                        <td className="px-4 py-3">object</td>
                        <td className="px-4 py-3">Screen resolution: {`{width: 1920, height: 1080}`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Mobile Testing Section */}
            <section id="mobile-testing" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">Mobile Testing</h2>
              
              <div id="uploading-apks" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Uploading APKs</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Test your Android applications by uploading APK files. DEFFATEST will install and test your app on virtual devices.
                </p>
                
                <CodeBlock
                  id="apk-upload"
                  language="bash"
                  code={`# Upload and test an APK
curl -X POST https://api.deffatest.com/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "type=android" \\
  -F "apk=@your-app.apk" \\
  -F "test_name=Android App Test" \\
  -F "config={\"device\":\"pixel_6\",\"android_version\":\"13\"}"}`}
                />
                
                <InfoBox type="warning" title="APK Requirements">
                  <ul className="list-disc list-inside space-y-1">
                    <li>APK file size must be under 100MB</li>
                    <li>App must be compatible with Android 8.0 or higher</li>
                    <li>Debug APKs are recommended for better testing coverage</li>
                  </ul>
                </InfoBox>
              </div>

              <div id="mobile-config">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Configuration Options</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Customize your mobile tests with device and environment settings:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-4">Available Devices</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Pixel 6 (Android 13)</li>
                      <li>• Samsung Galaxy S21 (Android 12)</li>
                      <li>• OnePlus 9 (Android 11)</li>
                      <li>• Generic Tablet (Android 12)</li>
                    </ul>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-4">Test Options</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Network conditions (3G, 4G, WiFi)</li>
                      <li>• Screen orientations</li>
                      <li>• Battery levels</li>
                      <li>• Location services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference Section */}
            <section id="api-reference" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">API Reference</h2>
              
              <div id="authentication" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Authentication</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  All API requests require authentication using an API key. You can generate API keys from your account settings.
                </p>
                
                <CodeBlock
                  id="auth-example"
                  language="bash"
                  code={`# Include your API key in the Authorization header
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.deffatest.com/tests`}
                />
                
                <InfoBox type="info" title="API Key Security">
                  Keep your API keys secure and never commit them to version control. Use environment variables in your CI/CD pipelines.
                </InfoBox>
              </div>

              <div id="endpoints" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">API Endpoints</h3>
                
                <div className="space-y-8">
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold text-cyan-400 mb-4">Submit Test</h4>
                    <p className="text-gray-300 mb-4">Create a new test for your application.</p>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-1 inline-block mb-4">
                      <span className="text-green-400 font-mono">POST /api/tests</span>
                    </div>
                    
                    <CodeBlock
                      id="submit-test"
                      language="json"
                      code={`{
  "type": "web",
  "app_url": "https://your-app.com",
  "test_name": "Production Test",
  "config": {
    "max_pages": 25,
    "test_duration": 15
  }
}`}
                    />
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold text-cyan-400 mb-4">Get Test Status</h4>
                    <p className="text-gray-300 mb-4">Check the status of a running test.</p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-1 inline-block mb-4">
                      <span className="text-blue-400 font-mono">GET /api/tests/{`{test_id}`}/status</span>
                    </div>
                    
                    <CodeBlock
                      id="test-status"
                      language="json"
                      code={`{
  "test_id": "test_123456",
  "status": "running",
  "progress": 65,
  "estimated_completion": "2024-01-15T10:30:00Z"
}`}
                    />
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold text-cyan-400 mb-4">Retrieve Results</h4>
                    <p className="text-gray-300 mb-4">Get the complete test results and reports.</p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-1 inline-block mb-4">
                      <span className="text-blue-400 font-mono">GET /api/tests/{`{test_id}`}/results</span>
                    </div>
                    
                    <CodeBlock
                      id="test-results"
                      language="json"
                      code={`{
  "test_id": "test_123456",
  "status": "completed",
  "summary": {
    "total_bugs": 12,
    "critical_bugs": 2,
    "pages_tested": 23,
    "test_duration": "14m 32s"
  },
  "report_url": "https://app.deffatest.com/reports/test_123456",
  "bugs": [...]
}`}
                    />
                  </div>
                </div>
              </div>

              <div id="error-codes">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Error Codes</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Common API error codes and their meanings:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-purple-500/30 rounded-lg overflow-hidden">
                    <thead className="bg-purple-500/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-semibold">Code</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Message</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Solution</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-red-400">401</td>
                        <td className="px-4 py-3">Unauthorized</td>
                        <td className="px-4 py-3">Check your API key</td>
                      </tr>
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-red-400">429</td>
                        <td className="px-4 py-3">Rate limit exceeded</td>
                        <td className="px-4 py-3">Wait before making more requests</td>
                      </tr>
                      <tr className="border-t border-purple-500/20">
                        <td className="px-4 py-3 font-mono text-red-400">400</td>
                        <td className="px-4 py-3">Invalid request</td>
                        <td className="px-4 py-3">Check request parameters</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* CI/CD Integration Section */}
            <section id="cicd-integration" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">CI/CD Integration</h2>
              
              <div id="general-concepts" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">General Concepts</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Integrating DEFFATEST into your CI/CD pipeline ensures that every code change is automatically tested before deployment. This helps catch bugs early and maintains code quality.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-4">Benefits</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Automated testing on every commit</li>
                      <li>• Early bug detection</li>
                      <li>• Consistent quality gates</li>
                      <li>• Reduced manual testing effort</li>
                    </ul>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-4">Best Practices</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Test staging environments</li>
                      <li>• Set appropriate timeouts</li>
                      <li>• Use environment variables for API keys</li>
                      <li>• Configure failure thresholds</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="github-actions" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">GitHub Actions</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Here's how to integrate DEFFATEST with GitHub Actions:
                </p>
                
                <CodeBlock
                  id="github-actions"
                  language="yaml"
                  code={`name: DEFFATEST Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to staging
      run: |
        # Your deployment commands here
        echo "Deployed to https://staging.your-app.com"
    
    - name: Run DEFFATEST
      run: |
        curl -X POST https://api.deffatest.com/test \\
          -H "Authorization: Bearer \${{ secrets.DEFFATEST_API_KEY }}" \\
          -H "Content-Type: application/json" \\
          -d '{
            "type": "web",
            "app_url": "https://staging.your-app.com",
            "test_name": "CI Test - \${{ github.sha }}"
          }'`}
                />
              </div>

              <div id="gitlab-ci">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">GitLab CI</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Example GitLab CI configuration:
                </p>
                
                <CodeBlock
                  id="gitlab-ci"
                  language="yaml"
                  code={`stages:
  - deploy
  - test

deploy_staging:
  stage: deploy
  script:
    - echo "Deploy to staging"
    # Your deployment commands
  only:
    - main
    - develop

deffatest:
  stage: test
  script:
    - |
      curl -X POST https://api.deffatest.com/test \\
        -H "Authorization: Bearer $DEFFATEST_API_KEY" \\
        -H "Content-Type: application/json" \\
        -d '{
          "type": "web",
          "app_url": "https://staging.your-app.com",
          "test_name": "GitLab CI Test"
        }'
  only:
    - main
    - develop`}
                />
              </div>
            </section>

            {/* Troubleshooting Section */}
            <section id="troubleshooting" className="mb-16">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-8">Troubleshooting</h2>
              
              <div id="common-issues" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Common Issues</h3>
                
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-semibold text-red-400 mb-3">Test Fails to Start</h4>
                    <p className="text-gray-300 mb-4">If your test fails to start, check the following:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Verify your API key is correct and active</li>
                      <li>Ensure the application URL is accessible</li>
                      <li>Check that your account has sufficient credits</li>
                      <li>Verify the request format matches the API specification</li>
                    </ul>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Limited Test Coverage</h4>
                    <p className="text-gray-300 mb-4">If the AI isn't finding all parts of your application:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Ensure navigation elements are clearly visible</li>
                      <li>Check that important features don't require authentication</li>
                      <li>Consider providing login credentials for authenticated areas</li>
                      <li>Increase the test duration for complex applications</li>
                    </ul>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Slow Test Execution</h4>
                    <p className="text-gray-300 mb-4">If tests are taking longer than expected:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Reduce the maximum number of pages to test</li>
                      <li>Optimize your application's loading speed</li>
                      <li>Check for infinite scroll or dynamic content issues</li>
                      <li>Consider testing specific user flows instead of full exploration</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="faq" className="mb-12">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-2">How long does a typical test take?</h4>
                    <p className="text-gray-300">Most tests complete within 5-15 minutes, depending on the complexity of your application and the configuration settings.</p>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-2">Can I test applications behind authentication?</h4>
                    <p className="text-gray-300">Yes! You can provide login credentials in the test configuration, and our AI will handle the authentication process.</p>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-2">What types of bugs does DEFFATEST find?</h4>
                    <p className="text-gray-300">DEFFATEST finds functional bugs, UI/UX issues, performance problems, accessibility issues, and common security vulnerabilities.</p>
                  </div>

                  <div className="glass-card p-6">
                    <h4 className="font-semibold text-white mb-2">Is there a limit to how many tests I can run?</h4>
                    <p className="text-gray-300">Limits depend on your subscription plan. Check your account dashboard for current usage and limits.</p>
                  </div>
                </div>
              </div>

              <div id="support">
                <h3 className="text-2xl font-semibold text-purple-400 mb-4">Get Support</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  If you can't find the answer to your question in this documentation, our support team is here to help.
                </p>
                
                <div className="glass-card p-8 text-center">
                  <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-4">Technical Support</h4>
                  <p className="text-gray-300 mb-6">
                    For technical support or any questions not covered in the documentation, please reach out to our team:
                  </p>
                  <a 
                    href="mailto:studio54code@deffatest.online" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    studio54code@deffatest.online
                  </a>
                  <p className="text-sm text-gray-400 mt-4">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8 lg:ml-80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="font-inter text-gray-400">
                © {new Date().getFullYear()} DEFFATEST. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="font-inter text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/cookie-policy" className="font-inter text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="/terms" className="font-inter text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Documentation;