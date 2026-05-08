import React from 'react'
import { Link } from 'react-router-dom'

function PrivacyPolicy() {
    return (
        <main className="flex-grow flex flex-col w-full">

            {/* Page Header */}
            <section className="py-16 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block">Legal
                        Information</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Privacy Policy</h1>
                    <p className="text-sm text-white/80 font-light">Last Updated: October 15, 2023</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6 bg-background">
                <div
                    className="max-w-4xl mx-auto bg-card p-10 md:p-16 rounded-sm shadow-sm border border-border prose prose-stone prose-h2:font-heading prose-h2:text-2xl prose-h2:text-foreground prose-h3:font-heading prose-h3:text-xl prose-h3:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">

                    <p>
                        At Bipin Decors, we are committed to protecting your privacy and ensuring the security of
                        your personal information. This Privacy Policy explains how we collect, use, disclose, and
                        safeguard your information when you visit our website or use our Decor design and
                        installation services.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect personal information that you voluntarily provide to us when you express an
                        interest in obtaining information about us or our products and Services, when you participate in
                        activities on the Website, or otherwise when you contact us.</p>

                    <h3>Personal Information Provided by You</h3>
                    <p>The personal information that we collect depends on the context of your interactions with us and
                        the Website, the choices you make, and the products and features you use. The personal
                        information we collect may include the following:</p>
                    <ul>
                        <li><strong>Contact Data:</strong> Name, email address, phone number, and physical address for
                            site visits and installations.</li>
                        <li><strong>Project Details:</strong> Information regarding your property, design preferences,
                            budget, and timeline.</li>
                        <li><strong>Communication Records:</strong> Records of your correspondence with our team,
                            including WhatsApp messages and emails.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use personal information collected via our Website for a variety of business purposes
                        described below. We process your personal information for these purposes in reliance on our
                        legitimate business interests, in order to enter into or perform a contract with you, with your
                        consent, and/or for compliance with our legal obligations.</p>
                    <ul>
                        <li>To facilitate and deliver our Decor installation services.</li>
                        <li>To send you administrative information, such as quotes, invoices, and scheduling updates.
                        </li>
                        <li>To respond to your inquiries and offer support.</li>
                        <li>To send you marketing and promotional communications (you can opt-out at any time).</li>
                        <li>To request feedback and contact you about your use of our Website and services.</li>
                    </ul>

                    <h2>3. Will Your Information Be Shared with Anyone?</h2>
                    <p>We only share information with your consent, to comply with laws, to provide you with services,
                        to protect your rights, or to fulfill business obligations. We may process or share your data
                        that we hold based on the following legal basis:</p>
                    <ul>
                        <li><strong>Vendors and Contractors:</strong> We may share your address and project details with
                            our trusted material suppliers and contracted artisans who are directly involved in
                            executing your project.</li>
                        <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally
                            required to do so in order to comply with applicable law, governmental requests, a judicial
                            proceeding, court order, or legal process.</li>
                    </ul>
                    <p>We do not sell, rent, or trade your personal information to third parties for their promotional
                        purposes.</p>

                    <h2>4. How Long Do We Keep Your Information?</h2>
                    <p>We will only keep your personal information for as long as it is necessary for the purposes set
                        out in this privacy notice, unless a longer retention period is required or permitted by law
                        (such as tax, accounting, or other legal requirements). When we have no ongoing legitimate
                        business need to process your personal information, we will either delete or anonymize such
                        information.</p>

                    <h2>5. How Do We Keep Your Information Safe?</h2>
                    <p>We have implemented appropriate technical and organizational security measures designed to
                        protect the security of any personal information we process. However, despite our safeguards and
                        efforts to secure your information, no electronic transmission over the Internet or information
                        storage technology can be guaranteed to be 100% secure.</p>

                    <h2>6. Contact Us About This Policy</h2>
                    <p>If you have questions or comments about this notice, you may email us at <a
                            href="mailto:privacy@bipinDecors.com">privacy@bipinDecors.com</a> or by post to:</p>
                    <p>
                        <strong>Bipin Decors</strong><br />
                        123 Luxury Avenue, Design District<br />
                        City, State 10001
                    </p>

                </div>
            </section>

        </main>
    )
}

export default PrivacyPolicy
