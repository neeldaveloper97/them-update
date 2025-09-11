'use client';

import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';

// Optional: provide a sensible default so the footer works out-of-the-box
const defaultFooterData = {
    logo: 'T.H.E.M.',
    description:
        'Transformative Human Experience & Mediation — bridging people, process, and progress.',
    social: [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
    links: [
        { title: 'About us', url: '/about-us' },
        { title: 'What We Do', url: '/what-we-do' },
        { title: 'FAQ', url: '/faq' },
        { title: 'Contact Us', url: '/contact-us' },
        { title: 'Terms & Conditions', url: '/terms-and-conditions' },
    ],
    contact: [
        // { type: 'email', value: 'info@themediators.net' },
        // { type: 'phone', value: '+980 123 (4587) 584' },
        { type: 'address', value: '123 Anywhere St, City, Country' },
    ],
    copyright: `© 2024 T.H.E.M. All rights reserved.`,
    legalLinks: (
        <>
            <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
            </a>
            <span aria-hidden>•</span>
            <a href="/terms-and-conditions" className="hover:underline">
                Terms & Conditions
            </a>
        </>
    ),
};

function getSocialIcon(platform) {
    switch (platform) {
        case 'facebook':
            return <Facebook size={20} />;
        case 'instagram':
            return <Instagram size={20} />;
        case 'twitter':
            return <Twitter size={20} />;
        case 'linkedin':
            return <Linkedin size={20} />;
        default:
            return null;
    }
}

function getContactIcon(type) {
    switch (type) {
        case 'email':
            return <Mail size={14} />;
        case 'phone':
            return <Phone size={14} />;
        case 'address':
            return <MapPin size={14} />;
        default:
            return null;
    }
}

/**
 * Org-less PublicFooter
 * Pass a `data` prop to override defaults, e.g. <PublicFooter data={myFooterData} />
 */
export default function PublicFooter() {
    const footerData = defaultFooterData;



    return (
        <footer className="text-white bg-primary-dark">
            <div className="container">
                <div className="flex justify-between items-start flex-wrap space-y-10 md:space-y-0 py-14 md:py-[72px]">
                    <div className="max-w-sm">
                        <h1 className="text-2xl font-bold text-white">{footerData.logo}</h1>
                        <p className="pt-5 mt-2 text-base">{footerData.description}</p>
                        <div className="flex mt-5 space-x-3" aria-label="Social links">
                            {footerData.social?.map((item, index) => (
                                <a
                                    key={`${item.platform}-${index}`}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.platform}
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    {getSocialIcon(item.platform)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-5 text-lg font-bold md:mb-2">Links</h2>
                        <ul className="space-y-2.5 md:space-y-1 text-sm">
                            {footerData.links?.map((link, index) => (
                                <li key={`${link.title}-${index}`}>
                                    <a href={link.url} className="hover:underline">
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-7 md:mb-2">Contact</h2>
                        <ul className="space-y-3 text-sm md:space-y-2">
                            {footerData.contact?.map((item, index) => (
                                <li key={`${item.type}-${index}`} className="flex items-center space-x-2">
                                    {getContactIcon(item.type)} <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#33ACC14D] text-sm flex flex-col sm:flex-row justify-between py-5 gap-2.5 text-center">
                    <span>{footerData.copyright}</span>
                    <div className="flex justify-center gap-4 md:justify-end">{footerData.legalLinks}</div>
                </div>
            </div>
        </footer>
    );
}
