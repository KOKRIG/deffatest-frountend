import React from 'react';
import Layout from '../components/Layout';

function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-8 lg:p-12">
          <div className="prose prose-invert max-w-none">
            <div className="mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                DEFFATEST ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered software testing platform and related services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data We Collect</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Name and email address when you create an account</li>
                <li>Payment information for subscription services</li>
                <li>Communication data when you contact our support team</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Technical Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Application data and URLs submitted for testing</li>
                <li>Test results, bug reports, and performance metrics</li>
                <li>Usage analytics and platform interaction data</li>
                <li>Device information, IP addresses, and browser details</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">How We Use Your Data</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide and maintain our AI testing services</li>
                <li>Process payments and manage your account</li>
                <li>Improve our AI algorithms and testing capabilities</li>
                <li>Send service updates and technical notifications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Sharing & Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure cloud infrastructure with regular security audits</li>
                <li>Access controls and authentication protocols</li>
                <li>Regular security updates and monitoring</li>
                <li>Data backup and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your data</li>
                <li>Data portability and export</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations. Test data and results are typically retained for the duration of your subscription plus 90 days for support purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware of such collection, we will take steps to delete the information immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For any questions or concerns regarding this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;