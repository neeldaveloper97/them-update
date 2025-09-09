// Medoptimize images
import med_about_banner from '@/app/assets/images/medoptimize/about_banner.webp';
import med_about_right_img from '@/app/assets/images/medoptimize/about_right_img.webp';
import med_contact_banner from '@/app/assets/images/medoptimize/contact_banner.webp';
import med_faq_banner from '@/app/assets/images/medoptimize/faq_banner.webp';
import med_tac_banner from '@/app/assets/images/medoptimize/tac_banner.webp';
import med_wwd_banner from '@/app/assets/images/medoptimize/wwd_banner.webp';
import med_wwd_img_1 from '@/app/assets/images/medoptimize/wwd_img_1.webp';
import med_wwd_img_2 from '@/app/assets/images/medoptimize/wwd_img_2.webp';
import med_wwd_img_3 from '@/app/assets/images/medoptimize/wwd_img_3.webp';
import med_banner_img from '@/app/assets/images/medoptimize/banner_img.webp';
import med_faq_img from '@/app/assets/images/medoptimize/faq_img.webp';
import med_main_faq_img from '@/app/assets/images/medoptimize/faq_main_img.webp';

// SVG and other assets
const svgAssets = {
  aboutBannerBg: '/assets/svg/about_banner_bg.png',
  aboutModule: '/assets/svg/about_module.png',
  aboutModuleImg: '/assets/svg/about_module_img.png',
  addressIcon: '/assets/svg/Address-icon.png',
  agentMedoptimize: '/assets/svg/agent-medoptimize.jpg',
  authForm: '/assets/svg/AuthForm.png',
  authModulePattern: '/assets/svg/AuthModulePattern.png',
  bannerBg: '/assets/svg/banner_bg.png',
  bannerImage: '/assets/svg/banner_image.png',
  bannerImg: '/assets/svg/banner_img.png',
  billIcon: '/assets/svg/Bill-icon.png',
  buyCar: '/assets/svg/buy_car.png',
  carDealer: '/assets/svg/car_dealer.jpg',
  culturePower: '/assets/svg/culture_power.jpg',
  doCard: '/assets/svg/Do_Card.png',
  emailIcon: '/assets/svg/Email-icon.png',
  evolvanceImg: '/assets/svg/evolvanceimg.png',
  faqBg: '/assets/svg/faq_bg.png',
  faqBgM: '/assets/svg/faq_bg_m.png',
  faqPersonImg: '/assets/svg/FAQ_Person_Img.png',
  forgotPasswordIllustration: '/assets/svg/forgot-password-illustration.png',
  medOptimize: '/assets/svg/med_optimize.png',
  medicalBill: '/assets/svg/medical_bill.png',
  negotiationIcon: '/assets/svg/Negotiation-icon.png',
  panel1: '/assets/svg/panel1.jpg',
  panel2: '/assets/svg/panel2.png',
  panel3: '/assets/svg/panel3.jpg',
  panel21: '/assets/svg/panel21.png',
  phoneIcon: '/assets/svg/Phone-icon.png',
};

export const OrgImages = {
  medoptimize: {
    aboutBanner: med_about_banner,
    aboutRightImg: med_about_right_img,
    contactBanner: med_contact_banner,
    faqBanner: med_faq_banner,
    tacBanner: med_tac_banner,
    wwdBanner: med_wwd_banner,
    wwdImgs: [med_wwd_img_1, med_wwd_img_2, med_wwd_img_3],
    bannerImg: med_banner_img,
    faqImg: med_faq_img,
    mainFaqImg: med_main_faq_img,
  },
  ...svgAssets,
};
