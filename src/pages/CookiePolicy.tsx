import React from 'react';
import Layout from '../components/Layout';

function CookiePolicy() {
  return (
    <Layout title="Cookie Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-8 lg:p-12">
          <div className="prose prose-invert max-w-none">
            <div className="mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">What are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                DEFFATEST uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our AI-powered testing services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">How We Use Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Authentication and security (keeping you logged in securely)</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing platform usage and performance</li>
                <li>Improving our AI algorithms based on usage patterns</li>
                <li>Providing personalized content and recommendations</li>
                <li>Measuring the effectiveness of our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These cookies are necessary for the platform to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Performance Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These cookies collect information about how you use our platform, helping us understand which features are most valuable and identify areas for improvement.
              </p>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Functional Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These cookies remember your preferences and choices to provide a more personalized experience, such as your preferred dashboard layout or notification settings.
              </p>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Analytics Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use analytics cookies to understand how our platform is being used, which helps us improve our AI testing algorithms and user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may use third-party services that set their own cookies, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Analytics providers (to understand platform usage)</li>
                <li>Payment processors (for secure transaction processing)</li>
                <li>Customer support tools (to provide better assistance)</li>
                <li>Security services (to protect against threats)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Choices Regarding Cookies</h2>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Block all cookies</li>
                <li>Block third-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Receive notifications when cookies are set</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Platform Settings</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Within your DEFFATEST account settings, you can control certain cookie preferences and data collection options.
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-300 font-semibold mb-2">Important Note:</p>
                <p className="text-gray-300">
                  Disabling certain cookies may affect the functionality of our platform and limit your ability to use some features of our AI testing services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Cookie Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
                <li><strong>Authentication Cookies:</strong> Expire based on your login session settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For any questions regarding our use of cookies, please contact us at:
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-white font-semibold">Email Support:</p>
                <a 
                  href="mailto:studio54code@deffatest.online" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-medium"
                >
                  studio54code@deffatest.online
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CookiePolicy;