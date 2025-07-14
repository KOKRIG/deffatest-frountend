import React from 'react';
import Layout from '../components/Layout';

function Terms() {
  return (
    <Layout title="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-8 lg:p-12">
          <div className="prose prose-invert max-w-none">
            <div className="mb-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of DEFFATEST's AI-powered software testing platform and related services (the "Service") operated by DEFFATEST ("us", "we", or "our").
              </p>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Service Description and Platform Development Status</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                DEFFATEST is an innovative, AI-powered software quality assurance platform that is currently under active and rapid development. As such, the platform and its features are continually evolving, being refined, and may undergo significant changes.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We are committed to providing a robust and cutting-edge service, but users acknowledge and accept that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Occasional service interruptions, downtime, or temporary unavailability may occur as we implement updates, perform maintenance, or resolve unforeseen issues</li>
                <li>Features and functionalities may be added, modified, or removed without extensive prior notice</li>
                <li>While we strive for perfection, minor bugs or unexpected behavior may be present as the platform evolves</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Your patience and understanding during this development phase are greatly appreciated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">User Accounts</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Account Creation</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You must be at least 18 years old to create an account</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>You are responsible for all activities that occur under your account</li>
                <li>You agree to use the Service only for lawful purposes</li>
                <li>You will not share your account with others</li>
                <li>You will comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Acceptable Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Test applications you do not own or have explicit permission to test</li>
                <li>Attempt to gain unauthorized access to any systems or networks</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Reverse engineer, decompile, or attempt to extract source code</li>
                <li>Use the Service for illegal activities or to violate others' rights</li>
                <li>Exceed rate limits or abuse the API</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Subscription and Payment</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Billing</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Subscription fees are billed in advance on a recurring basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We may change our pricing with 30 days' notice</li>
                <li>You are responsible for all taxes associated with your use of the Service</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">14-Day Refund Policy & Conditions</h3>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  DEFFATEST offers a 14-day refund window for newly purchased subscriptions, subject to the following strict conditions designed to ensure fair use of our innovative AI testing capabilities:
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-yellow-300 mb-2">Full Refund Eligibility:</h4>
                    <p className="text-gray-300 leading-relaxed">
                      You are eligible for a full refund of your initial subscription payment ONLY IF you have NOT initiated or completed ANY 'successful tests' within the 14-day period following your purchase. A 'successful test' is defined as any test run that completes its processing and generates a comprehensive report, regardless of whether bugs were found or its ultimate outcome.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-300 mb-2">No Refund After Use:</h4>
                    <p className="text-gray-300 leading-relaxed">
                      If you have initiated or completed ANY 'successful tests' within the 14-day period, the service is considered to have been utilized, and you will NOT be eligible for a refund for that subscription period. This policy is in place due to the computational resources and AI processing power expended during each test run.
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mt-4">
                  To request a refund if eligible, please contact our support team at the email provided below within the 14-day window.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Cancellation</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of your current billing period</li>
                <li>We may suspend or terminate accounts for non-payment</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Our Rights</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by DEFFATEST and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Your Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of any applications, code, or content you submit for testing. By using our Service, you grant us a limited license to access and test your applications solely for the purpose of providing our testing services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Service Availability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. We may:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Perform scheduled maintenance with advance notice</li>
                <li>Make emergency updates or repairs as needed</li>
                <li>Temporarily suspend the Service for security reasons</li>
                <li>Modify or discontinue features with reasonable notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law, DEFFATEST shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or delays</li>
                <li>Errors or inaccuracies in test results</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Our total liability for any claims related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Account Suspension and Termination</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  DEFFATEST reserves the right to suspend or terminate your account and access to the Service, at its sole discretion, immediately and without prior notice, for any reason, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Violation of these Terms and Conditions</li>
                  <li>Engaging in any fraudulent, abusive, or illegal activities</li>
                  <li>Any behavior deemed harmful to the platform, other users, or third parties</li>
                  <li>Failure to make payment for services</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Upon termination, your right to use the Service will immediately cease. DEFFATEST is not obligated to provide a refund for any unused portion of a subscription if the account is terminated due to a violation of these terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless DEFFATEST from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Jurisdiction].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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

export default Terms;