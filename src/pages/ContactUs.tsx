import React from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Users, Briefcase } from 'lucide-react';
import Layout from '../components/Layout';

function ContactUs() {

  return (
    <Layout title="Get In Touch">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Have questions about DEFFATEST, need support, or interested in a partnership? We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Direct Contact */}
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-400">Direct Email Support</h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              For immediate assistance or detailed inquiries, reach out to us directly via email. We typically respond within 24 hours.
            </p>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
              <p className="text-white font-semibold mb-2">Email us at:</p>
              <a 
                href="mailto:studio54code@deffatest.online" 
                className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors neon-glow inline-block"
              >
                studio54code@deffatest.online
              </a>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">What to include in your email:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Detailed description of your question or issue</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Your account information (if applicable)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Screenshots or error messages (if relevant)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Your preferred response time</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Send us a Message</h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Use the form below to get in touch with us. We'll respond as soon as possible!
            </p>
            
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <p className="text-center text-cyan-300 font-medium">
                💬 Have a question? We're here to help!
              </p>
            </div>

            {/* Google Form Embed */}
            <div className="relative">
              <div className="bg-black/30 rounded-lg overflow-hidden border border-purple-500/30">
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSdo8qQwy85Lyy85m5kGuPg87Tha5wxkKSf0RRPHL6zLKAMrGw/viewform?embedded=true&usp=pp_url"
                  width="100%" 
                  height="700" 
                  frameBorder="0" 
                  marginHeight={0} 
                  marginWidth={0}
                  className="w-full"
                  title="Contact Form"
                >
                  Loading…
                </iframe>
              </div>
              
              {/* Fallback link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400 mb-2">
                  Having trouble with the form above?
                </p>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdo8qQwy85Lyy85m5kGuPg87Tha5wxkKSf0RRPHL6zLKAMrGw/viewform?usp=header" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-semibold text-white neon-glow hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Open Contact Form in New Tab
                </a>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* We're Hiring Section */}
        <div className="mt-16 pt-16 border-t border-purple-500/30">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                We're Hiring!
              </h2>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Join our innovative team and help shape the future of AI-powered software testing. We're looking for passionate individuals to work with us!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Why Join Us */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-400">Why Join Us?</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>Work with cutting-edge AI technology</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>Remote-first culture</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>Competitive compensation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>Growth opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>Innovative projects</span>
                </li>
              </ul>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">Ready to Join Our Team?</h3>
                  <p className="text-gray-300">
                    Fill out this form to apply and tell us about yourself. We're excited to hear from you!
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-center text-green-300 font-medium">
                    🚀 Multiple positions available - Apply now!
                  </p>
                </div>

                {/* Google Form Embed */}
                <div className="relative">
                  <div className="bg-black/30 rounded-lg overflow-hidden border border-purple-500/30">
                    <iframe 
                      src="https://docs.google.com/forms/d/e/1FAIpQLSfHgRzJ29bm58wmkJhcTL0cEM6Ug5zXqXz3eNfTwGm3L3IM8Q/viewform?embedded=true&usp=pp_url"
                      width="100%" 
                      height="800" 
                      frameBorder="0" 
                      marginHeight={0} 
                      marginWidth={0}
                      className="w-full"
                      title="Job Application Form"
                    >
                      Loading…
                    </iframe>
                  </div>
                  
                  {/* Fallback link */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Having trouble with the form above?
                    </p>
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfHgRzJ29bm58wmkJhcTL0cEM6Ug5zXqXz3eNfTwGm3L3IM8Q/viewform?usp=header" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold text-white neon-glow hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Open Application Form in New Tab
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactUs;