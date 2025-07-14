import React from 'react';
import { Upload, Brain, FileText, Clock, DollarSign, Target, CheckCircle, Rocket, Zap, Shield } from 'lucide-react';
import Layout from '../components/Layout';

function HowItWorks() {
  return (
    <Layout title="Simple Steps to Smarter QA">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction */}
        <div className="text-center mb-16">
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            Getting started with DEFFATEST is incredibly simple. Our AI handles the complexity, so you can focus on building great software.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-12 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Three Simple Steps to Better QA
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="glass-card p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center neon-glow">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                </div>
                <div className="flex-grow text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <Upload className="w-8 h-8 text-cyan-400 mr-3" />
                    <h3 className="font-orbitron font-bold text-2xl text-cyan-400">Upload Your App</h3>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    Simply upload your Android APK or provide the URL of your web application. Our intuitive interface makes getting started quick and effortless.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg p-4">
                      <div className="font-semibold text-purple-300 mb-2">Web Applications</div>
                      <div className="text-sm text-gray-400">Enter your URL or upload HTML/JS bundles</div>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded-lg p-4">
                      <div className="font-semibold text-cyan-300 mb-2">Mobile Applications</div>
                      <div className="text-sm text-gray-400">Upload your Android APK file</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center neon-glow">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                </div>
                <div className="flex-grow text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <Brain className="w-8 h-8 text-cyan-400 mr-3" />
                    <h3 className="font-orbitron font-bold text-2xl text-cyan-400">AI Tests Like a Real User</h3>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    Our advanced AI takes over, autonomously exploring every corner of your application. It interacts, navigates, and intelligently identifies potential issues, just like a human tester, but with unmatched speed and precision.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-purple-300 mb-1">Computer Vision</div>
                      <div className="text-sm text-gray-400">Sees and understands UI elements</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-cyan-300 mb-1">Smart Navigation</div>
                      <div className="text-sm text-gray-400">Explores all user paths intelligently</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-green-300 mb-1">Bug Detection</div>
                      <div className="text-sm text-gray-400">Identifies issues humans miss</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center neon-glow">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                </div>
                <div className="flex-grow text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <FileText className="w-8 h-8 text-cyan-400 mr-3" />
                    <h3 className="font-orbitron font-bold text-2xl text-cyan-400">Receive Actionable Insights</h3>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    Within minutes, access detailed bug reports, complete with reproduction steps, screenshots, and video recordings. Understand exactly what went wrong and how to fix it, dramatically accelerating your debugging process.
                  </p>
                  <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-300 mb-4">Each Report Includes:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-gray-300">Step-by-step reproduction guide</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-gray-300">Annotated screenshots</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-gray-300">Video recordings of bugs</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-gray-300">Severity and priority ratings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value You Save Section */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            The Value You Save
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-purple-400 mb-2">Time</h3>
              <p className="text-gray-300 leading-relaxed">Cut QA cycles from days to minutes</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-cyan-400 mb-2">Cost</h3>
              <p className="text-gray-300 leading-relaxed">Reduce your QA budget significantly with autonomous testing</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-green-400 mb-2">Quality</h3>
              <p className="text-gray-300 leading-relaxed">Catch more critical bugs before they impact your users</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-orange-400 mb-2">Effort</h3>
              <p className="text-gray-300 leading-relaxed">Free your team from repetitive testing, allowing them to focus on innovation</p>
            </div>
          </div>
        </div>

        {/* Integration Example */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="font-orbitron font-bold text-2xl lg:text-3xl text-center mb-8 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Perfect for CI/CD Integration
          </h2>
          <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
            <div className="text-sm text-gray-400 mb-2"># Example CI/CD Integration</div>
            <div className="font-mono text-green-400 text-sm leading-relaxed">
              <div className="text-purple-400"># Trigger DEFFATEST on every commit</div>
              <div className="text-cyan-400">curl -X POST https://api.deffatest.com/test \</div>
              <div className="ml-4 text-cyan-400">-H "Authorization: Bearer $API_KEY" \</div>
              <div className="ml-4 text-cyan-400">-d '&lbrace;"app_url": "$APP_URL"&rbrace;'</div>
              <div className="mt-2 text-purple-400"># Get results in minutes, not hours</div>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Seamlessly integrate with GitHub Actions, Jenkins, GitLab CI, and more
          </p>
        </div>

        {/* Final Call to Action */}
        <div className="text-center">
          <div className="glass-card p-8 lg:p-12 max-w-2xl mx-auto">
            <h2 className="font-orbitron font-bold text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Ready to Experience the Future of QA?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of developers who have already revolutionized their testing process. No credit card required.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            >
              <Rocket className="mr-3 w-6 h-6" />
              Start Your Free AI Test Now!
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HowItWorks;