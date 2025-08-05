import React from 'react';
import { Users, Zap, Target, TrendingUp, Clock, DollarSign, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

function UseCases() {
  return (
    <Layout title="Why DEFFATEST? Unlock Unprecedented Efficiency" data-sb-object-id="useCasesPage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction Section */}
        <div className="text-center mb-16">
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8" data-sb-field-path="introText">
            Manual testing is a bottleneck. Scripted automation breaks easily. DEFFATEST cuts through the noise.
          </p>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="font-orbitron font-bold text-2xl lg:text-3xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-sb-field-path="heroHeading">
              Save Time. Save Money. Find More Bugs.
            </h2>
          </div>
        </div>

        {/* Core Use Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Development Teams */}
          <div className="glass-card p-8 lg:p-10 group hover:scale-105 transition-all">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-cyan-400" data-sb-field-path="useCases.0.title">For Development Teams</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                The Problem
              </h4>
              <p className="text-gray-300 leading-relaxed">
                "Slow QA cycles delay releases. Every commit needs testing, but manual processes create bottlenecks that push deadlines and frustrate teams."
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                The Solution
              </h4>
              <p className="text-gray-300 leading-relaxed">
                "Integrate DEFFATEST into your CI/CD pipeline and get instant, intelligent feedback on every commit. Our AI tests your code faster than any human ever could."
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-300 mb-2">Key Benefits:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span className="font-semibold">Catch bugs 8x faster</span> than traditional human review
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Reduce time-to-market dramatically</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Seamless CI/CD integration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* QA Managers & Teams */}
          <div className="glass-card p-8 lg:p-10 group hover:scale-105 transition-all">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-cyan-400">For QA Managers & Teams</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                The Problem
              </h4>
              <p className="text-gray-300 leading-relaxed">
                "Repetitive manual tests drain resources. Limited coverage with script-based tools. Your talented QA team is stuck doing mundane, repetitive work."
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                The Solution
              </h4>
              <p className="text-gray-300 leading-relaxed">
                "Automate mundane tasks, expand test coverage exponentially with AI, and free your QA team for complex exploratory testing where human insight truly matters."
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-cyan-300 mb-2">Key Benefits:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span className="font-semibold">Increase test coverage by 300%</span> without adding headcount
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Focus QA talent where it matters most</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Eliminate repetitive manual testing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Managers & Business Owners */}
          <div className="glass-card p-8 lg:p-10 group hover:scale-105 transition-all lg:col-span-2">
            <div className="flex items-center mb-6 justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-cyan-400">For Product Managers & Business Owners</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  The Problem
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  "Releasing buggy software damages reputation and customer trust. Post-launch bug fixes are expensive and disruptive to user experience."
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  The Solution
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  "Ensure flawless user experiences with comprehensive AI-driven testing, reducing post-launch issues and increasing user satisfaction."
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-lg p-4 mt-6">
              <h4 className="text-lg font-semibold text-cyan-300 mb-2">Key Benefits:</h4>
              <ul className="grid md:grid-cols-2 gap-2 text-gray-300">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Release with confidence</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Significantly reduce post-release bug costs</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Protect brand reputation</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                  <span>Increase customer satisfaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="glass-card p-12 mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-12 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent" data-sb-field-path="statsSection.heading">
            The Numbers Don't Lie
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">8x</div>
              <div className="text-xl font-semibold text-white mb-2">FASTER</div>
              <div className="text-gray-400">than human testing</div>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-green-400 mb-2">70%</div>
              <div className="text-xl font-semibold text-white mb-2">COST SAVINGS</div>
              <div className="text-gray-400">in QA budget</div>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-purple-400 mb-2">30%</div>
              <div className="text-xl font-semibold text-white mb-2">MORE CRITICAL BUGS</div>
              <div className="text-gray-400">found vs traditional methods</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-card p-8 lg:p-12 max-w-2xl mx-auto">
            <h2 className="font-orbitron font-bold text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-sb-field-path="ctaSection.heading">
              Ready to Transform Your QA?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed" data-sb-field-path="ctaSection.text">
              See exactly how DEFFATEST works and why teams love it.
            </p>
            <a 
              href="/how-it-works" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            >
              <ArrowRight className="mr-3 w-6 h-6" />
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UseCases;