import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
      text: 'Blog',
      href: getBlogPermalink(),
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
        { text: 'Astrology', href: '/services/astrology' },
        { text: 'Palmistry', href: '/services/palmistry' },
        { text: 'Numerology', href: '/services/numerology' },
        { text: 'Book Appointment', href: '/ScheduleAppointmentJyotirSetu' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Testimonials', href: '/testimonials' },
        { text: 'Blog', href: '/blog' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'FAQ', href: '/faq' },
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
    { ariaLabel: 'Whatsapp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/919266991298' },
    { ariaLabel: 'Google', icon: 'tabler:brand-google', href: 'https://g.page/r/CXjH6HavONOeEBM/review' },
  ],
  footNote: `
    © 2025<a class="text-blue-600 underline dark:text-muted" href="https://www.jyotirsetu.com"> JyotirSetu </a> · Guiding you with insights and clarity. All rights reserved.
  `,
};
