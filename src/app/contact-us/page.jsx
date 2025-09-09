'use client';

import { useEffect } from 'react';
import InfoBanner from '@/components/dynamicTemplate/InfoBanner';
import { DynamicDataList } from '@/config/orgData';
import SectionBg from '@/app/assets/about_banner_bg.png';
import { Button } from '@/components/ui/button';

const ContactItem = ({ icon, title, value }) => {
  return (
    <div className="flex items-center px-8 py-6 space-x-6 bg-white rounded-3xl shadow-2">
      <div className="flex-shrink-0 size-[73px] flex items-center justify-center bg-primary-color/10 text-primary-color-dark rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-primary-dark">{title}</h3>
        <p className="pt-2 text-muted-text">{value}</p>
      </div>
    </div>
  );
};

export default function ContactPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pull org-less data from the first (default) entry
  const contactPage = DynamicDataList?.[0]?.pages?.contact;

  const bannerData =
    contactPage?.banner ?? {
      title: 'Contact Us',
      bannerImg: SectionBg,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '/contact-us' }, // adjust if your route is /contact
      ],
    };

  const contactModuleData =
    contactPage?.contactModule ?? {
      contactInfo: [],
      contactForm: {
        title: 'Contact Us',
        description: 'Need assistance? Our team is here to help.',
        fields: [
          { name: 'name', label: 'Your name', type: 'text', required: true },
          { name: 'email', label: 'Your email', type: 'email', required: true },
          { name: 'phone', label: 'Phone number', type: 'tel', required: false },
          { name: 'subject', label: 'Subject', type: 'text', required: true },
          { name: 'message', label: 'Your message', type: 'textarea', required: true },
        ],
        submitButton: { text: 'Send Message', color: 'blue' },
      },
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up to your API
  };

  return (
    <>
      <InfoBanner
        title={bannerData.title || 'Contact Us'}
        currentPage={bannerData.title || 'Contact Us'}
        bannerImg={bannerData.bannerImg || SectionBg}
        breadcrumbs={bannerData.breadcrumbs || []}
      />

      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            <div className="flex-1 space-y-4 sm:space-y-8">
              <div className="lg:max-w-[423px] space-y-8">
                {contactModuleData.contactInfo?.map((contact, index) => (
                  <ContactItem
                    key={`contact-item-${contact.title}-${index}`}
                    icon={contact.icon}
                    title={contact.title}
                    value={contact.value}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-bold md:text-5xl text-primary-color-dark">
                {contactModuleData.contactForm?.title || 'Contact Us'}
              </h2>
              <p className="pt-3 text-base text-muted-text">
                {contactModuleData.contactForm?.description ||
                  'Need assistance? Our team is here to help.'}
              </p>

              <form onSubmit={handleSubmit} className="pt-10 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                  {contactModuleData.contactForm?.fields
                    ?.filter((f) => f.type !== 'textarea')
                    .map((field, index) => (
                      <div key={`field-${field.name}-${index}`}>
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.label}
                          className="w-full px-4 py-3 border rounded-md border-muted-light focus:outline-none focus:ring-2 focus:ring-org-primary-light-100"
                          required={field.required}
                        />
                      </div>
                    ))}
                </div>

                {contactModuleData.contactForm?.fields
                  ?.filter((f) => f.type === 'textarea')
                  .map((field, index) => (
                    <div key={`textarea-${field.name}-${index}`}>
                      <textarea
                        name={field.name}
                        placeholder={field.label}
                        rows={4}
                        className="w-full px-4 py-3 border rounded-md border-muted-light focus:outline-none focus:ring-2 focus:ring-org-primary-light-100"
                        required={field.required}
                      />
                    </div>
                  ))}

                <div>
                  <Button
                    type="submit"
                    className={
                      contactModuleData.contactForm?.submitButton?.color
                        ? `bg-brand-${contactModuleData.contactForm.submitButton.color}`
                        : ''
                    }
                  >
                    {contactModuleData.contactForm?.submitButton?.text ||
                      'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
