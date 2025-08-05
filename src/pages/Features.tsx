import React from 'react';
import { Brain, FileText, Zap, Smartphone, Cloud, Shield, ArrowRight, Eye, Cpu, Globe } from 'lucide-react';
import Layout from '../components/Layout';

function Features() {
  return (
    cLayout title="Unleash Unrivaled Testing Power: DEFFATEST Features" data-sb-object-id="features"e
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction */}
        <div className="text-center mb-16">
            cp className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto"e
            Discover the features that make DEFFATEST the developer's favorite QA solution, redefining software quality assurance with cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        cdiv className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"e
          {/* Feature 1: AI Autonomous Testing */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center" data-sb-field-path=".0.title">Intelligent Autonomous Testing</h3>
            <p className="text-gray-300 leading-relaxed mb-6" data-sb-field-path=".0.description">
              Our cutting-edge AI doesn't just follow scripts; it uses your application like a real user would. Leveraging Computer Vision and advanced Large Language Models (LLMs), it intelligently explores every screen, navigates complex flows, and identifies issues that traditional, dumb script-based or basic automation often misses. It learns and adapts as it tests.
            </p>
            <div className="flex items-center text-purple-400 hover:text-purple-300 text-sm font-semibold">
              <Eye className="w-4 h-4 mr-2" />
              <span>Computer Vision + LLMs</span>
            </div>
          </div>

          {/* Feature 2: Comprehensive Bug Reporting */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center">Actionable, Detailed Bug Reports</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Receive highly detailed bug reports that pinpoint the exact location and nature of each issue. Includes clear reproduction steps, annotated screenshots, and video recordings of the bug in action, making fixes incredibly fast and efficient.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-400">
                <ArrowRight className="w-3 h-3 mr-2" />
                <span>Step-by-step reproduction</span>
              </div>
              <div className="flex items-center text-green-400">
                <ArrowRight className="w-3 h-3 mr-2" />
                <span>Annotated screenshots</span>
              </div>
              <div className="flex items-center text-green-400">
                <ArrowRight className="w-3 h-3 mr-2" />
                <span>Video recordings</span>
              </div>
            </div>
          </div>

          {/* Feature 3: CI/CD Pipeline Integration */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center">Seamless CI/CD Integration</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Built for modern DevOps workflows. Integrate DEFFATEST directly into your CI/CD pipelines with our robust API. Automatically trigger tests on every commit, pull request, or build, ensuring continuous quality and preventing bugs from reaching production.
            </p>
            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-green-300">API-First Design</div>
              <div className="text-xs text-gray-400 mt-1">Perfect for automation</div>
            </div>
          </div>

          {/* Feature 4: Multi-Platform Support */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center">Web & Mobile Application Testing</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Whether it's your web application (via URL or uploaded HTML/JS bundles) or your Android mobile application (via APK upload), DEFFATEST handles it. Our AI adapts its testing approach to the specific platform.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-purple-400">
                <Globe className="w-4 h-4 mr-2" />
                <span>Web Apps</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Smartphone className="w-4 h-4 mr-2" />
                <span>Android APKs</span>
              </div>
            </div>
          </div>

          {/* Feature 5: Scalable Cloud Infrastructure */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center">On-Demand Cloud Scalability</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Run hundreds of tests concurrently. Our elastic cloud infrastructure scales automatically to meet your demands, providing rapid results without hardware limitations or queue times.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-400">
                <Cpu className="w-3 h-3 mr-2" />
                <span>Elastic scaling</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Zap className="w-3 h-3 mr-2" />
                <span>No queue times</span>
              </div>
            </div>
          </div>

          {/* Feature 6: Performance & Security Insights */}
          <div className="glass-card p-8 group hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-4 text-cyan-400 text-center">Performance & Security Insights</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Beyond functional bugs, DEFFATEST also provides insights into potential performance bottlenecks and common security vulnerabilities, giving you a holistic view of your application's health.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-pink-400">
                <Zap className="w-4 h-4 mr-2" />
                <span>Performance</span>
              </div>
              <div className="flex items-center text-pink-400">
                <Shield className="w-4 h-4 mr-2" />
                <span>Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-8 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent" data-sb-field-path="comparisonSection.heading">
            Why DEFFATEST Outperforms Traditional Testing
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-4">Traditional Testing</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Requires manual script writing and maintenance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Breaks easily with UI changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Limited test coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Time-consuming setup and execution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Misses edge cases and user flows</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">DEFFATEST AI Testing</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>Zero script writing - AI explores autonomously</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>Adapts to UI changes automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>Comprehensive coverage of all user paths</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>Instant setup and rapid execution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>Discovers hidden bugs and edge cases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-card p-8 lg:p-12 max-w-2xl mx-auto">
            <h2 className="font-orbitron font-bold text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-sb-field-path="ctaSection.heading">
              Experience the Power Yourself
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed" data-sb-field-path="ctaSection.text">
              See how simple it is to get started with DEFFATEST's revolutionary AI testing.
            </p>
            <a 
              href="/how-it-works" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            >
              <ArrowRight className="mr-3 w-6 h-6" />
              See It In Action
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Features;