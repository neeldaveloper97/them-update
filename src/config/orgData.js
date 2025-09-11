import FAQPersonImg from '@/app/assets/FAQ_Person_Img.png';
import medoptimizeabout from '@/app/assets/images/medoptimize/about_right_img.webp';
import { Icon } from '@iconify/react';

import { OrgImages } from '@/constants/ImageImports';

export const DynamicDataList = [
  {
    orgName: 'T.H.E.M.',
    orgColor: '#0F828C',
    orgLogo: '/images/',
    theme: {
      primary: 'sky',
      secondary: 'dark-sky',
      accent: 'orange',
      background: 'white',
    },
    header: {
      topHeader: {
        contact: [
          { type: 'email', value: 'info@themediators.net', icon: 'email' },
          { type: 'phone', value: '+980 123 (4587) 584', icon: 'phone' },
        ],
        social: [
          {
            platform: 'instagram',
            url: 'https://www.instagram.com',
            icon: 'instagram',
          },
          {
            platform: 'facebook',
            url: 'https://www.facebook.com',
            icon: 'facebook',
          },
          {
            platform: 'twitter',
            url: 'https://www.twitter.com',
            icon: 'twitter',
          },
          {
            platform: 'linkedin',
            url: 'https://www.linkedin.com',
            icon: 'linkedin',
          },
        ],
      },
      mainNav: {
        logo: 'T.H.E.M.',
        menu: [
          { title: 'About Us', link: '/about' },
          { title: 'What We Do', link: '/services' },
          { title: 'FAQ', link: '/faq' },
          { title: 'Contact Us', link: '/contact' },
        ],
        buttons: [
          { name: 'Register', url: '/register', variant: 'primary' },
          { name: 'Login', url: '/login', variant: 'secondary' },
        ],
      },
    },
    pages: {
      home: {
        banner: {
          title: 'Welcome to T.H.E.M.',
          description:
            'T.H.E.M.(Transformative Healthcare Expenses Mediators) exists to transform the way patients experience healthcare billing. We act as advocates, negotiators, and mediators, ensuring that every individual has access to clarity, fairness, and financial relief in the face of overwhelming medical expenses.',
          image: OrgImages.medoptimize.bannerImg,
          backgroundColor: 'sky',
          features: [
            {
              title: 'Lower Your Bills',
              description: "Upload your bill, and we'll work to reduce it",
            },
            {
              title: 'Hassle-Free Negotiation',
              description: 'We handle everything from start to finish',
            },
            {
              title: 'Save Money',
              description: 'Our clients save 30-60% on average',
            },
          ],
        },
        aboutSection: {
          title: 'About Us',
          description: [
            'T.H.E.M. exists to transform the way patients experience healthcare billing. We act as advocates, negotiators, and mediators, ensuring that every individual has access to clarity, fairness, and financial relief in the face of overwhelming medical expenses.',
          ],
          mainImage: medoptimizeabout,
          subImage: '/images/about-sub.jpg',
          values: [
            {
              title: 'Transparency',
              description: 'We break down medical bills in plain language.',
              icon: (
                <Icon
                  icon="gravity-ui:copy-transparent"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-org-primary',
              iconColor: 'text-org-primary-light',
            },
            {
              title: 'Advocacy',
              description:
                'We negotiate on your behalf, ensuring fair pricing.',
              icon: (
                <Icon
                  icon="mingcute:announcement-line"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-yellow-500',
              iconColor: 'text-yellow-100',
            },
            {
              title: 'Affordability',
              description:
                'We focus on reducing costs while maintaining quality care.',
              icon: (
                <Icon icon="solar:hand-money-linear" width="45" height="45" />
              ),
              iconBgColor: 'bg-orange-500',
              iconColor: 'text-orange-100',
            },
          ],
        },
        servicesSection: {
          title: 'What We Do',
          bgColor: 'bg-[#E3F4F8]',
          description:
            'At T.H.E.M., we provide an easy, stress-free way to lower medical bills for individuals, doctors, and businesses. For those who prefer predictable, no-surprise pricing, we offer subscription plans that provide unlimited bill uploads for a flat monthly rate. No extra charges, just peace of mind.',
          services: [
            {
              title: 'Bill Review & Analysis',
              description:
                'We examine your bill for errors, duplicate charges, and overpricing.',
              icon: (
                <Icon
                  icon="fluent:receipt-money-16-regular"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-org-primary',
              iconColor: 'text-org-primary-light',
            },
            {
              title: 'Negotiation & Cost Reduction',
              description:
                'We work directly with hospitals and providers to lower your costs.',
              icon: (
                <Icon
                  icon="fluent:handshake-20-regular"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-yellow-500',
              iconColor: 'text-yellow-100',
            },
            {
              title: 'Support & Guidance',
              description:
                'We keep you informed at every step, so you always know where things stand.',
              icon: (
                <Icon icon="ic:baseline-support-agent" width="40" height="40" />
              ),
              iconBgColor: 'bg-orange-500',
              iconColor: 'text-orange-100',
            },
          ],
        },
        howItWorksSection: {
          title: 'How It Works',
          description:
            'You can choose to pay only if you save, or subscribe for unlimited bill negotiation at a simple, affordable rate.',
          backgroundColor: 'sky-light',
          steps: [
            {
              step: 1,
              title: 'Upload Your Medical Bill',
              description: 'Simply submit your bill through our secure portal.',
              icon: 'upload',
            },
            {
              step: 2,
              title: 'Free Medical Bill Review & Savings Check',
              description:
                'Our experts review your charges at no cost to identify errors and potential savings..',
              icon: 'search',
            },
            {
              step: 3,
              title: 'We Negotiate on Your Behalf',
              description: 'We work with providers to lower your costs.',
              icon: 'chat',
            },
            {
              step: 4,
              title: 'Your Savings',
              description:
                'See exactly how much you saved—full transparency, no hidden costs.',
              icon: 'dollar',
            },
          ],
        },
        subscriptionSection: {
          title: 'Subscription Plans',
          description:
            'Provide your team with cost-saving medical bill support at an affordable price.',
          backgroundColor: 'white',
          plans: [
            {
              title: 'Starter',
              description:
                'For individuals who need basic help with appeals and real-time support.',
              icon: <Icon icon="ph:user-list-fill" width="40" height="40" />,
              iconBg: 'bg-org-primary-light',
              iconColor: 'text-org-primary',
              features: [
                'Up to 3 bills/appeals per membership year',
                'Real-time Valence chat',
                'Basic appeal-status dashboard',
                '$15 per additional bill beyond the 3 included',
                'Optional white-glove human review: 10% of savings (only when requested)',
              ],
              pricing: {
                amount: 11.99,
                unit: 'Month (2-yr contract)',
                capacity: '1 person',
              },
              cta: {
                text: 'Purchase Starter Plan',
                url: '/signup/starter',
              },
            },
            {
              title: 'Family',
              description:
                'Support for the whole household with priority processing.',
              icon: <Icon icon="mdi:account-group" width="40" height="40" />,
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-500',
              features: [
                'Up to 8 bills per membership year, pooled across household',
                'Priority queue for faster resolution',
                '$15 per additional bill beyond the 8 included',
                'First white-glove review free (10% fee waived once per year)',
              ],
              pricing: {
                amount: 19.99,
                unit: 'Month (1-yr contract)',
                capacity: 'Household',
              },
              cta: {
                text: 'Purchase Family Plan',
                url: '/signup/family',
              },
            },
            {
              title: 'Premium Care',
              description:
                'Unlimited bill help and advanced support with reporting.',
              icon: (
                <Icon
                  icon="fluent:premium-person-24-filled"
                  width="40"
                  height="40"
                />
              ),
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-500',
              features: [
                'Unlimited bill submissions',
                'Priority appeal drafting',
                'Quarterly savings report',
                'Performance fee: 5% of savings above $2,000 per claim (marginal)',
                'Example: save $3,000 → 5% × $1,000 = $50.',
              ],
              pricing: {
                amount: 39.0,
                unit: 'Month (1-yr contract)',
                capacity: '1 person',
              },
              cta: {
                text: 'Purchase Premium Plan',
                url: '/signup/premium',
              },
            },
          ],
        },
        faqSection: {
          title: 'FAQ',
          backgroundImage: OrgImages.medoptimize.faqImg,
          questions: [
            {
              question: 'What does it cost?',
              answer:
                'Pick a plan: Starter $11.99/mo (2-yr), Family $19.99/mo, Premium $39/mo. Starter includes 3 bills/yr (extra bills $15), Family 8 bills/yr pooled (extra $15), Premium unlimited.',
            },
            {
              question: 'What is “savings”?',
              answer:
                'The difference between your original billed amount and the negotiated amount you accept.',
            },
            {
              question: 'When do optional/performance fees apply?',
              answer:
                'Only after you approve a negotiated outcome that produces savings.',
            },
            {
              question: 'What is white-glove human review?',
              answer:
                'An optional deeper review and hands-on negotiation. Fee is 10% of savings (Family plan waives this once per membership year).',
            },
            {
              question: 'How does the Premium 5% fee work?',
              answer:
                'It’s marginal: 5% only on the amount above $2,000 saved per claim.\n\n- Save $1,800 → $0 fee\n- Save $3,000 → 5% × $1,000 = $50\n- Save $10,000 → 5% × $8,000 = $400',
            },
            {
              question: 'What is a membership year?',
              answer:
                '12 months from your sign-up date; included bill counts reset each year.',
            },
          ],
        },
      },
      about: {
        banner: {
          title: 'About Us',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'About Us', url: '/about' },
          ],
          bannerImg: OrgImages.medoptimize.aboutBanner,
        },
        aboutModule: {
          title: 'About Us',
          description: [
            "Medical bills can be confusing, overwhelming, and—too often—unfairly high. At T.H.E.M., we fight to ensure you pay only what's reasonable, nothing more.",
            "We carefully review each bill, identify errors and overcharges, and negotiate directly with healthcare providers on your behalf. Whether you're an individual, a medical practice, or a business supporting employees, our goal is the same: to make medical billing simple, transparent, and fair.",
          ],
          mainImage: OrgImages.medoptimize.aboutRightImg,
          backgroundColor: 'sky',
        },
        servicesSection: {
          bgColor: 'bg-[#E3F4F8]',
          services: [
            {
              title: 'Transparency',
              description: 'We break down medical bills in plain language.',
              icon: (
                <Icon
                  icon="gravity-ui:copy-transparent"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-org-primary',
              iconColor: 'text-org-primary-light',
            },
            {
              title: 'Advocacy',
              description:
                'We negotiate on your behalf, ensuring fair pricing.',
              icon: (
                <Icon
                  icon="mingcute:announcement-line"
                  width="45"
                  height="45"
                />
              ),
              iconBgColor: 'bg-yellow-500',
              iconColor: 'text-yellow-100',
            },
            {
              title: 'Affordability',
              description:
                'We focus on reducing costs while maintaining quality care.',
              icon: (
                <Icon icon="solar:hand-money-linear" width="45" height="45" />
              ),
              iconBgColor: 'bg-orange-500',
              iconColor: 'text-orange-100',
            },
          ],
        },
      },
      services: {
        banner: {
          title: 'What We Do',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/services' },
          ],
          bannerImg: OrgImages.medoptimize.wwdBanner,
        },
        servicesModule: {
          title: 'What We Do',
          description:
            'At T.H.E.M., we provide an easy, stress-free way to lower medical bills for individuals, doctors, and businesses. For those who prefer predictable, no-surprise pricing, we offer subscription plans that provide unlimited bill uploads for a flat monthly rate. No extra charges, just peace of mind.',
          services: [
            {
              title: 'Bill Review & Analysis',
              description:
                'We examine your bill for errors, duplicate charges, and overpricing.',
              icon: (
                <Icon
                  icon="gravity-ui:copy-transparent"
                  width="45"
                  height="45"
                />
              ),
              bgImage: OrgImages.medoptimize.wwdImgs[0],
              iconBgColor: 'bg-org-primary',
              iconColor: 'text-org-primary-light',
            },
            {
              title: 'Negotiation & Cost Reduction',
              description:
                'We work directly with hospitals and providers to lower your costs.',
              icon: (
                <Icon
                  icon="mingcute:announcement-line"
                  width="45"
                  height="45"
                />
              ),
              bgImage: OrgImages.medoptimize.wwdImgs[1],
              iconBgColor: 'bg-yellow-500',
              iconColor: 'text-yellow-100',
            },
            {
              title: 'Support & Guidance',
              description:
                'We keep you informed at every step, so you always know where things stand.',
              icon: (
                <Icon icon="solar:hand-money-linear" width="45" height="45" />
              ),

              bgImage: OrgImages.medoptimize.wwdImgs[2],
              iconBgColor: 'bg-orange-500',
              iconColor: 'text-orange-100',
            },
          ],
        },
      },
      faq: {
        banner: {
          title: 'FAQ',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'FAQ', url: '/faq' },
          ],
          bannerImg: OrgImages.medoptimize.faqBanner,
        },
        faqImg: OrgImages.medoptimize.mainFaqImg,
        faqModule: {
          title: 'Frequently Asked Questions',
          rightSideImage: FAQPersonImg,
          questions: [
            {
              question: 'How does T.H.E.M. work?',
              answer:
                "Upload your medical bill, and we'll analyze, negotiate, and work to lower your costs.",
            },
            {
              question: 'How much can I save?',
              answer:
                'On average, our clients save 30-60% on their medical bills. The exact amount depends on various factors including the type of bill, provider, and specific charges.',
            },
            {
              question: "What if you can't lower my bill?",
              answer:
                "If we can't reduce your bill, you won't pay for our negotiation service. We believe in results, and only charge when we actually save you money.",
            },
            {
              question: 'Is this legal?',
              answer:
                'Absolutely. Medical bill negotiation is completely legal and ethical. We work directly with healthcare providers to find fair and reasonable prices for services rendered.',
            },
          ],
        },
      },
      contact: {
        banner: {
          title: 'Contact Us',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Contact Us', url: '/contact' },
          ],
          bannerImg: OrgImages.medoptimize.contactBanner,
        },
        contactModule: {
          contactInfo: [
            {
              title: 'Phone Number',
              value: '+980 123 (4587) 584',
              icon: (
                <Icon
                  icon="material-symbols:support-agent"
                  width="40"
                  height="40"
                />
              ),
            },
            // {
            //   title: 'Email Address',
            //   value: 'info@themediators.net',
            //   icon: (
            //     <Icon icon="ion:mail-open-outline" width="40" height="40" />
            //   ),
            // },
            {
              title: 'Office Address',
              value:
                '7318 Orn Loaf, Port Ellacester, Ohio - 00410, Christmas Island',
              icon: <Icon icon="gis:poi-map" width="40" height="40" />,
            },
          ],

          contactForm: {
            title: 'Contact Us',
            description: 'Need assistance? Our team is here to help.',
            fields: [
              {
                name: 'name',
                label: 'Your name',
                type: 'text',
                required: true,
              },
              {
                name: 'email',
                label: 'Your email',
                type: 'email',
                required: true,
              },
              {
                name: 'phone',
                label: 'Phone number',
                type: 'tel',
                required: false,
              },
              {
                name: 'subject',
                label: 'Subject',
                type: 'text',
                required: true,
              },
              {
                name: 'message',
                label: 'Your message',
                type: 'textarea',
                required: true,
              },
            ],
            submitButton: {
              text: 'Send Message',
              color: 'blue',
            },
          },
        },
      },
      terms: {
        banner: {
          title: 'Terms & Conditions',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Terms & Conditions', url: '/terms' },
          ],
          bannerImg: OrgImages.medoptimize.tacBanner,
        },

        termsModule: {
          title: 'Terms & Conditions',
          introduction: {
            title: 'By using T.H.E.M., you agree that:',
            agreements: [
              {
                text: 'We will act on your behalf to negotiate lower medical bills.',
              },
              {
                text: 'Our goal is to secure savings, but we cannot guarantee reductions in every case.',
              },
              {
                text: 'Your personal and financial data is protected and never shared without your consent.',
              },
            ],
            commitment:
              'We are committed to providing a transparent, effective, and trustworthy service.',
          },
          sections: [
            {
              title: 'The standard Lorem Ipsum passage, used since the 1500s',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
            {
              title: 'What is Lorem Ipsum?',
              points: [
                {
                  text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                },
                {
                  text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                },
                {
                  text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
                },
              ],
              content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
          ],
        },
      },
    },
    footer: {
      logo: 'T.H.E.M.',
      description:
        'We carefully review each bill, identify errors and overcharges, and negotiate directly with healthcare providers on your behalf.',
      social: [
        {
          platform: 'instagram',
          url: 'https://www.instagram.com',
          icon: 'instagram',
        },
        {
          platform: 'facebook',
          url: 'https://www.facebook.com',
          icon: 'facebook',
        },
        {
          platform: 'twitter',
          url: 'https://www.twitter.com',
          icon: 'twitter',
        },
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com',
          icon: 'linkedin',
        },
      ],
      links: [
        { title: 'About Us', url: '/about' },
        { title: 'What We Do', url: '/services' },
        { title: 'FAQ', url: '/faq' },
        { title: 'Contact Us', url: '/contact' },
      ],
      contact: [
        { type: 'email', value: 'info@themediators.net', icon: 'email' },
        { type: 'phone', value: '+980 123 (4587) 584', icon: 'phone' },
        {
          type: 'address',
          value:
            '7318 Orn Loaf, Port Ellacester, Ohio - 00410, Christmas Island',
          icon: 'address',
        },
      ],
      copyright: 'T.H.E.M. © 2025 All Rights Reserved',
      legalLinks: 'Privacy Policy | Terms & Conditions',
    },
  },
];
