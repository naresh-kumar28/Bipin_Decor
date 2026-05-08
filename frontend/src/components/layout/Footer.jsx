import React from 'react'
import { Link } from 'react-router-dom'
import { Sofa, MapPin, Phone, Mail, Heart } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteContext'

function Footer() {
    const { settings, socialLinks } = useSiteSettings();

    return (
        <footer id="site-footer" className="bg-card pt-16 pb-8 border-t border-border">
            <div className="max-w-7xl px-6 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

                <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:pr-8">

                    {/* <!-- Logo --> */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 mb-4">
                        {settings?.logo ? (
                            <img src={settings.logo} alt={settings?.website_name || "Logo"} className="h-10 object-contain" />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                <Sofa className="w-[18px] h-[18px]" />
                            </div>
                        )}
                        <div className="leading-tight">
                            <h1 className="text-[22px] font-bold tracking-[0.08em] text-foreground">
                                {settings?.website_name ? (
                                    settings.website_name.split(' ').length > 1 ? (
                                        <>
                                            {settings.website_name.split(' ')[0]} <span className="font-bold text-primary">{settings.website_name.split(' ').slice(1).join(' ')}</span>
                                        </>
                                    ) : settings.website_name
                                ) : (
                                    <>BIPIN <span className="font-bold text-primary">DECOR</span></>
                                )}
                            </h1>
                        </div>
                    </Link>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {settings?.footer_description || "Premium Decor installation studio specializing in luxury finishes, wall paneling, false ceilings, and bespoke spatial transformations."}
                    </p>

                    <div className="flex items-center gap-3">
                        {socialLinks && socialLinks.length > 0 && socialLinks.map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
                                title={link.platform_name}>
                                <div 
                                    className="w-5 h-5 flex items-center justify-center fill-current"
                                    dangerouslySetInnerHTML={{ __html: link.custom_icon_svg }}
                                />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 lg:col-start-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Quick Links</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                        <li><Link to="/portfolio" className="hover:text-primary transition-colors">Our Work</Link>
                        </li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Legal</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link to="/privacy_policy" className="hover:text-primary transition-colors">Privacy
                            Policy</Link></li>
                        <li><Link to="/terms_condition" className="hover:text-primary transition-colors">Terms &
                            Conditions</Link>
                        </li>
                        <li><Link to="/return_refund" className="hover:text-primary transition-colors">Return
                            Policy</Link></li>
                    </ul>
                </div>

                <div className="lg:col-span-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <MapPin className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                            <span>{settings?.contact_address || "123 Luxury Avenue, Design District, City, 10001"}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="text-primary w-5 h-5 shrink-0" />
                            <a href={`tel:${settings?.contact_phone?.replace(/\s/g, '') || "+15551234567"}`} className="hover:text-primary transition-colors">
                                {settings?.contact_phone || "+1 (555) 123-4567"}
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="text-primary w-5 h-5 shrink-0" />
                            <a href={`mailto:${settings?.contact_email || "hello@bipindecors.com"}`}
                                className="hover:text-primary transition-colors">{settings?.contact_email || "hello@bipindecors.com"}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {settings?.website_name || "Bipin Decors"}. All rights reserved.</p>
                <p className="flex items-center gap-1.5">
                    Designed with <Heart className="text-primary w-4 h-4 fill-primary/20" /> by Naresh Kumar
                </p>
            </div>
        </footer>
    )
}

export default Footer
