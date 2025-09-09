'use client';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DynamicDataList } from '@/config/orgData';
import { useEffect, useState } from 'react';

export default function PublicFooter() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const [notFoundOrg, setNotFoundOrg] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const params = useParams();
  const orgId = params.orgId || 'them';

  useEffect(() => {
    const matchedOrg = DynamicDataList.find((org) => org.orgId === orgId);

    if (matchedOrg && matchedOrg.pages?.services) {
      const footerData = matchedOrg.footer;

      setFooterData(footerData || null);
    } else {
      setNotFoundOrg(true);
    }
  }, [orgId]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getSocialIcon = (platform) => {
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
  };

  const getContactIcon = (type) => {
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
  };

  if (!footerData) {
    return null; // Or a loading state
  }

  return (
    <footer className="text-white bg-primary-dark">
      <div className="container">
        <div className="flex justify-between items-start flex-wrap space-y-10 md:space-y-0 py-14 md:py-[72px]">
          <div className="max-w-sm">
            <h1 className="text-2xl font-bold text-white">{footerData.logo}</h1>
            <p className="pt-5 mt-2 text-base">{footerData.description}</p>
            <div className="flex mt-5 space-x-3">
              {footerData.social?.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
                <li key={index}>
                  <a href={link.url}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-7 md:mb-2">Contact</h2>
            <ul className="space-y-3 text-sm md:space-y-2">
              {footerData.contact?.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {getContactIcon(item.type)} <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#33ACC14D] text-sm flex flex-col sm:flex-row justify-between py-5 gap-2.5 text-center">
          <span>{footerData.copyright}</span>
          <div className="flex justify-center gap-4 md:justify-end">
            {footerData.legalLinks}
          </div>
        </div>
      </div>
    </footer>
  );
}
