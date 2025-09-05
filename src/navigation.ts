import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Services',
      links: [
        { text: 'Kundli Analysis', href: '/services/kundli-analysis' },
        { text: 'Palmistry', href: '/services/palmistry' },
        { text: 'Matchmaking (Kundli Milan)', href: '/services/matchmaking' },
        { text: 'Numerology', href: '/services/numerology' },
        { text: 'Gemstone Consultation', href: '/services/gemstone-consultation' },
        { text: 'Career & Finance Guidance', href: '/services/career-finance' },
        { text: 'Spiritual Guidance', href: '/services/spiritual-guidance' },
        { text: 'Remedial Solutions', href: '/services/remedial-solutions' },
        { text: 'Dosha Analysis & Remedies', href: '/services/dosha-analysis' },
      ],
    },

    {
      text: 'Testimonials',
      href: getPermalink('/testimonials'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Kundli Analysis', href: '/services/kundli-analysis' },
        { text: 'Palmistry', href: '/services/palmistry' },
        { text: 'Matchmaking (Kundli Milan)', href: '/services/matchmaking' },
        { text: 'Numerology', href: '/services/numerology' },
        { text: 'Gemstone Consultation', href: '/services/gemstone-consultation' },
        { text: 'Career & Finance Guidance', href: '/services/career-finance' },
        { text: 'Spiritual Guidance', href: '/services/spiritual-guidance' },
        { text: 'Remedial Solutions', href: '/services/remedial-solutions' },
        { text: 'Dosha Analysis & Remedies', href: '/services/dosha-analysis' },
        { text: 'Book Appointment', href: '/ScheduleAppointmentJyotirSetu' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Success Stories', href: '/success-stories' },
        { text: 'Testimonials', href: '/testimonials' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'FAQ', href: '/#faqs' },
        { text: 'Free Resources', href: '/resources' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms & Conditions', href: '/terms' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms & Conditions', href: '/terms' },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/jyotirsetu' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'Google', icon: 'tabler:brand-google', href: 'https://g.page/r/CXjH6HavONOeEBM/review' },
  ],
  footNote: `
    © 2025<a class="text-blue-600 underline dark:text-muted" href="https://www.jyotirsetu.com"> JyotirSetu </a> · Guiding you with insights and clarity. All rights reserved.
  `,
};
