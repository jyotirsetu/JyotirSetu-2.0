// Formspree Configuration
export const FORMSPREE_CONFIG = {
  // Your Formspree form endpoint
  APPOINTMENT_FORM: 'https://formspree.io/f/xnnbzveo',

  // Form settings
  FORM_SETTINGS: {
    method: 'POST',
    redirect: false, // We handle redirects with JavaScript
  },

  // Email templates (configure these in Formspree dashboard)
  EMAIL_TEMPLATES: {
    // User confirmation email
    USER_CONFIRMATION: {
      subject: 'Appointment Request Received - JyotirSetu',
      template: 'user-confirmation-template',
    },

    // Admin notification email
    ADMIN_NOTIFICATION: {
      subject: 'New Appointment Request - JyotirSetu',
      template: 'admin-notification-template',
    },
  },

  // Form field mappings
  FIELD_MAPPINGS: {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    dob: 'Date of Birth',
    birth_time: 'Birth Time',
    birth_place: 'Birth Place',
    gender: 'Gender',
    marital_status: 'Marital Status',
    city: 'City',
    service: 'Selected Service',
    consultation_method: 'Consultation Method',
    appointment_date: 'Preferred Date',
    appointment_time: 'Preferred Time',
    message: 'Message/Concerns',
  },
};

export default FORMSPREE_CONFIG;
