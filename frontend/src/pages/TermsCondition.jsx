import React from 'react'
import { Link } from 'react-router-dom'

function TermsCondition() {
    return (
        <main className="flex-grow flex flex-col w-full">

            {/* Page Header */}
            <section className="py-16 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block">Legal
                        Information</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-sm text-white/80 font-light">Last Updated: October 15, 2023</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6 bg-background">
                <div
                    className="max-w-4xl mx-auto bg-card p-10 md:p-16 rounded-sm shadow-sm border border-border prose prose-stone prose-h2:font-heading prose-h2:text-2xl prose-h2:text-foreground prose-h3:font-heading prose-h3:text-xl prose-h3:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">

                    <p>
                        Welcome to Bipin Decors. These Terms and Conditions govern your use of our website and
                        services. By accessing our site or engaging our Decor installation services, you agree to be
                        bound by these terms. Please read them carefully.
                    </p>

                    <h2>1. Definitions</h2>
                    <ul>
                        <li><strong>"Company", "We", "Us", "Our":</strong> Refers to Bipin Decors.</li>
                        <li><strong>"Client", "You", "Your":</strong> Refers to the individual or entity engaging our
                            services or using our website.</li>
                        <li><strong>"Services":</strong> Refers to Decor design, consultation, installation of UV
                            marble sheets, PVC paneling, false ceilings, WPC louvers, and full home renovations.</li>
                        <li><strong>"Project":</strong> Refers to the specific scope of work agreed upon between the
                            Company and the Client.</li>
                    </ul>

                    <h2>2. Service Engagement and Quotations</h2>
                    <p>All quotations provided by Bipin Decors are valid for a period of 30 days from the date of
                        issue. A project is considered officially engaged once the Client signs the quotation/contract
                        and pays the required initial deposit.</p>

                    <h3>Scope of Work</h3>
                    <p>The scope of work will be explicitly detailed in the final quotation or contract. Any additional
                        work requested by the Client outside the agreed scope will be subject to additional charges and
                        timeline extensions. These will be documented in a Variation Order, which must be approved by
                        both parties before the additional work commences.</p>

                    <h2>3. Payment Terms</h2>
                    <p>Payments for our services are typically structured as follows, unless otherwise stated in your
                        specific contract:</p>
                    <ul>
                        <li><strong>Initial Deposit:</strong> 50% of the total project cost is required upon signing the
                            contract to secure materials and schedule the installation team.</li>
                        <li><strong>Progress Payment:</strong> 30% is due upon the delivery of materials to the site and
                            commencement of installation.</li>
                        <li><strong>Final Payment:</strong> The remaining 20% is due immediately upon practical
                            completion and final walkthrough of the project.</li>
                    </ul>
                    <p>Failure to make progress payments on time may result in the suspension of work until the
                        outstanding balance is cleared.</p>

                    <h2>4. Timelines and Delays</h2>
                    <p>We strive to complete all projects within the estimated timeframe provided in the contract.
                        However, Bipin Decors shall not be held liable for delays caused by circumstances beyond our
                        reasonable control, including but not limited to:</p>
                    <ul>
                        <li>Unavailability or delayed delivery of specific materials from third-party suppliers.</li>
                        <li>Changes to the scope of work requested by the Client.</li>
                        <li>Site conditions that were not visible or disclosed during the initial inspection (e.g.,
                            hidden structural issues, dampness).</li>
                        <li>Force majeure events such as natural disasters, strikes, or governmental actions.</li>
                    </ul>

                    <h2>5. Site Access and Conditions</h2>
                    <p>The Client agrees to provide our team with reasonable access to the site during agreed working
                        hours. The Client is responsible for ensuring the site is clear of personal belongings, fragile
                        items, and debris before installation begins. We will take reasonable care to protect your
                        property, but we are not liable for incidental damage to items left in the immediate work area.
                    </p>

                    <h2>6. Warranty and Liability</h2>
                    <p>Bipin Decors provides a standard workmanship warranty of 12 months from the date of practical
                        completion. This warranty covers defects in installation. It does not cover:</p>
                    <ul>
                        <li>Normal wear and tear.</li>
                        <li>Damage caused by misuse, negligence, or accidents by the Client or third parties.</li>
                        <li>Damage resulting from structural movement of the building, water leaks, or pre-existing
                            dampness.</li>
                    </ul>
                    <p>Material warranties are subject to the respective manufacturer's terms and conditions.</p>

                    <h2>7. Intellectual Property</h2>
                    <p>All designs, plans, drawings, and 3D renderings provided by Bipin Decors remain the
                        intellectual property of the Company. They may not be reproduced, shared, or used for
                        implementation by other contractors without our explicit written consent. We reserve the right
                        to photograph completed projects and use these images in our portfolio and marketing materials.
                    </p>

                    <h2>8. Governing Law</h2>
                    <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the
                        jurisdiction in which Bipin Decors operates. Any disputes arising out of or in connection
                        with these terms shall be subject to the exclusive jurisdiction of the local courts.</p>

                </div>
            </section>

        </main>
    )
}

export default TermsCondition
