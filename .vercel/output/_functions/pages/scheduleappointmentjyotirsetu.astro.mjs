import { d as createAstro, c as createComponent, a as renderTemplate, b as addAttribute, m as maybeRenderHead, r as renderComponent, e as renderScript, F as Fragment } from '../chunks/astro/server__1NYpXS4.mjs';
import 'kleur/colors';
import { $ as $$PageLayout } from '../chunks/PageLayout_cVV0aLge.mjs';
import 'clsx';
import { $ as $$Hero } from '../chunks/Hero_BF_jfkyY.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://jyotirsetu.com");
const $$DynamicAppointmentForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DynamicAppointmentForm;
  return renderTemplate(_a || (_a = __template(["", `<div class="max-w-4xl mx-auto px-4 sm:px-6"> <form id="dynamic-appointment-form" class="space-y-6 sm:space-y-8"> <!-- Common Fields Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F310} Common Information</span> </h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"> <!-- Full Name --> <div class="space-y-2"> <label for="fullName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Full Name <span class="text-red-500">*</span> </label> <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Mobile Number --> <div class="space-y-2"> <label for="mobileNumber" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Mobile Number <span class="text-red-500">*</span> </label> <input type="tel" id="mobileNumber" name="mobileNumber" required maxlength="10" pattern="[0-9]{10}" placeholder="Enter 10 digit mobile number" title="Please enter a valid 10-digit mobile number" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)"> <div class="text-xs text-gray-500 dark:text-gray-400">
Enter 10-digit mobile number (e.g., 9876543210)
</div> </div> <!-- Email Address --> <div class="space-y-2"> <label for="emailAddress" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Email Address <span class="text-red-500">*</span> </label> <input type="email" id="emailAddress" name="emailAddress" required placeholder="your.email@example.com" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Preferred Consultation Method --> <div class="space-y-2"> <label for="consultationMethod" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Preferred Consultation Method <span class="text-red-500">*</span> </label> <select id="consultationMethod" name="consultationMethod" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Select method...</option> <option value="call">Call</option> <option value="video-call">Video Call</option> <option value="in-person">In-person</option> <option value="whatsapp">WhatsApp</option> </select> </div> <!-- Appointment Date --> <div class="space-y-2"> <label for="appointmentDate" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Select Appointment Date <span class="text-red-500">*</span> </label> <input type="date" id="appointmentDate" name="appointmentDate" required`, ` class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Appointment Time --> <div class="space-y-2"> <label for="appointmentTime" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Select Appointment Time <span class="text-red-500">*</span> </label> <select id="appointmentTime" name="appointmentTime" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Select time...</option> <option value="09:00-09:30">9:00 AM - 9:30 AM</option> <option value="09:30-10:00">9:30 AM - 10:00 AM</option> <option value="10:00-10:30">10:00 AM - 10:30 AM</option> <option value="10:30-11:00">10:30 AM - 11:00 AM</option> <option value="11:00-11:30">11:00 AM - 11:30 AM</option> <option value="11:30-12:00">11:30 AM - 12:00 PM</option> <option value="14:00-14:30">2:00 PM - 2:30 PM</option> <option value="14:30-15:00">2:30 PM - 3:00 PM</option> <option value="15:00-15:30">3:00 PM - 3:30 PM</option> <option value="15:30-16:00">3:30 PM - 4:00 PM</option> <option value="16:00-16:30">4:00 PM - 4:30 PM</option> <option value="16:30-17:00">4:30 PM - 5:00 PM</option> <option value="17:00-17:30">5:00 PM - 5:30 PM</option> <option value="17:30-18:00">5:30 PM - 6:00 PM</option> </select> </div> </div> </div> <!-- Service Selection Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F3AF} Select Your Service</span> </h3> <div class="space-y-2"> <label for="serviceType" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Service Type <span class="text-red-500">*</span> </label> <select id="serviceType" name="serviceType" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Choose your service...</option> <option value="astrology">\u{1F52E} Astrology</option> <option value="gemstone">\u{1F48E} Gemstone Consultation</option> <option value="palmistry">\u270B Palmistry</option> <option value="numerology">\u{1F522} Numerology</option> <option value="career-finance">\u{1F4BC} Career & Finance</option> <option value="matchmaking">\u{1F495} Matchmaking</option> <option value="study-education">\u{1F4DA} Study / Education</option> <option value="corporate">\u{1F3E2} Corporate Consultation</option> <option value="other">\u2728 Other Reason</option> </select> </div> </div> <!-- Service-Specific Fields Container --> <div id="serviceSpecificFields" class="space-y-6" style="display: none;"> <!-- Fields will be dynamically loaded here --> </div> <!-- Query Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F4AC} Your Query / Notes</span> </h3> <div class="space-y-2"> <label for="userQuery" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Tell us about your concerns or questions
</label> <textarea id="userQuery" name="userQuery" rows="4" placeholder="Please share your specific questions, concerns, or what you'd like to discuss during the consultation..." class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-base transition-all duration-200"></textarea> </div> </div> <!-- Disclaimer Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F4CB} Terms & Privacy</span> </h3> <!-- Combined Policy Summary --> <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-lg p-4 mb-4 sm:mb-6"> <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"> <strong>Privacy & Terms:</strong> We respect your privacy - your data is encrypted, never shared with third parties, and retained only as long as necessary for service delivery. By booking, you agree to our terms: no advance payments and guidance-based services. For full details, see our <a href="/privacy" class="underline hover:text-blue-600 dark:hover:text-blue-300">Privacy Policy</a> and <a href="/terms" class="underline hover:text-blue-600 dark:hover:text-blue-300">Terms & Conditions</a>.
</p> </div> <!-- Disclaimer Checkbox --> <div class="flex items-start space-x-3"> <input id="disclaimer" name="disclaimer" type="checkbox" required class="mt-1 h-5 w-5 sm:h-4 sm:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"> <label for="disclaimer" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
I agree to the terms and conditions and privacy policy of JyotirSetu.
</label> </div> </div> <!-- Submit Button --> <div class="text-center"> <button type="submit" class="w-full px-6 py-4 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl sm:rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:ring-4 focus:ring-purple-300 focus:outline-none text-lg">
\u{1F52E} Book Your Consultation
</button> </div> </form> <!-- Success Message --> <div id="form-success" class="hidden mt-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-2xl sm:rounded-lg"> <div class="flex items-start sm:items-center"> <div class="flex-shrink-0"> <svg class="w-6 h-6 sm:w-5 sm:h-5 text-green-600 mt-1 sm:mt-0 mr-3 sm:mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> </div> <div> <h4 class="text-lg font-semibold text-green-800 mb-2">\u{1F320} Appointment Request Submitted Successfully</h4> <p class="text-green-700 leading-relaxed">Thank you for trusting JyotirSetu. Your consultation request has been recorded, and we'll confirm your appointment according to your selected date and time.</p> </div> </div> </div> </div> <script>
  // Service configurations for dynamic fields
  const serviceConfigs = {
    'astrology': {
      fields: [
        {
          name: 'astrologyConcern',
          label: 'Astrology Concern Area',
          type: 'select',
          required: true,
          options: [
            { value: 'health', label: 'Health' },
            { value: 'career', label: 'Career' },
            { value: 'relationship', label: 'Relationship' },
            { value: 'finance', label: 'Finance' },
            { value: 'general', label: 'General' }
          ]
        },
        {
          name: 'currentProfession',
          label: 'Current Profession',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'birthTime',
          label: 'Birth Time',
          type: 'time',
          required: true
        },
        {
          name: 'birthPlace',
          label: 'Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        }
      ]
    },
    'gemstone': {
      fields: [
        {
          name: 'wearingPurpose',
          label: 'Wearing Purpose',
          type: 'select',
          required: true,
          options: [
            { value: 'healing', label: 'Healing' },
            { value: 'wealth', label: 'Wealth' },
            { value: 'career', label: 'Career' },
            { value: 'protection', label: 'Protection' },
            { value: 'spirituality', label: 'Spirituality' }
          ]
        },
        {
          name: 'currentProfession',
          label: 'Current Profession',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'birthTime',
          label: 'Birth Time',
          type: 'time',
          required: true
        },
        {
          name: 'wearingGemstone',
          label: 'Wearing Any Gemstone Currently?',
          type: 'text',
          required: false,
          placeholder: 'If yes, which one?'
        }
      ]
    },
    'palmistry': {
      fields: [
        {
          name: 'focusArea',
          label: 'Focus Area',
          type: 'select',
          required: true,
          options: [
            { value: 'career', label: 'Career' },
            { value: 'marriage', label: 'Marriage' },
            { value: 'finance', label: 'Finance' },
            { value: 'health', label: 'Health' },
            { value: 'general', label: 'General Prediction' }
          ]
        },
        {
          name: 'handDominance',
          label: 'Hand Dominance',
          type: 'select',
          required: true,
          options: [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'both', label: 'Both' }
          ]
        },
        {
          name: 'specificConcerns',
          label: 'Specific Concerns / Questions',
          type: 'textarea',
          required: false,
          placeholder: 'Tell us what you would like to know from palm reading.'
        }
      ],
      instruction: {
        title: '\u{1F4F8} Hand Image Upload Instructions',
        content: 'For accurate palm reading, please upload clear photos of your palms:',
        methods: [
          'Take photos in good lighting',
          'Ensure all lines are clearly visible',
          'Include both left and right palms',
          'Upload to Google Drive or Dropbox and share the link'
        ],
        note: 'You can share the image link in the "Message" field below or send via WhatsApp.'
      }
    },
    'matchmaking': {
      fields: [
        {
          name: 'person1Name',
          label: 'Your Full Name',
          type: 'text',
          required: true,
          placeholder: 'Your full name as per official records'
        },
        {
          name: 'person1Gender',
          label: 'Your Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'person1DOB',
          label: 'Your Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'person1TOB',
          label: 'Your Time of Birth',
          type: 'time',
          required: true
        },
        {
          name: 'person1POB',
          label: 'Your Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        },
        {
          name: 'person2Name',
          label: 'Partner\\'s Full Name',
          type: 'text',
          required: true,
          placeholder: 'Partner\\'s full name as per official records'
        },
        {
          name: 'person2Gender',
          label: 'Partner\\'s Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'person2DOB',
          label: 'Partner\\'s Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'person2TOB',
          label: 'Partner\\'s Time of Birth',
          type: 'time',
          required: true
        },
        {
          name: 'person2POB',
          label: 'Partner\\'s Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        }
      ]
    },
    'numerology': {
      fields: [
        {
          name: 'officialName',
          label: 'Full Name (as per official records)',
          type: 'text',
          required: true,
          placeholder: 'Exact spelling is very important for numerology'
        },
        {
          name: 'commonName',
          label: 'Name You Are Commonly Known By',
          type: 'text',
          required: false,
          placeholder: 'Nickname or different spelling (optional)'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'focusArea',
          label: 'Specific Focus Area',
          type: 'select',
          required: true,
          options: [
            { value: 'career-finance', label: 'Career & Finance' },
            { value: 'relationship-marriage', label: 'Relationship / Marriage' },
            { value: 'health-wellness', label: 'Health & Wellness' },
            { value: 'name-correction', label: 'Name Correction / Lucky Name' },
            { value: 'general-guidance', label: 'General Guidance' }
          ]
        }
      ]
    },
    'career-finance': {
      fields: [
        {
          name: 'currentProfession',
          label: 'Current Profession / Industry',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'financialConcerns',
          label: 'Financial Concerns',
          type: 'select',
          required: true,
          options: [
            { value: 'business-growth', label: 'Business Growth' },
            { value: 'job-change', label: 'Job Change' },
            { value: 'investments', label: 'Investments' },
            { value: 'debt-issues', label: 'Debt Issues' },
            { value: 'general-guidance', label: 'General Guidance' }
          ]
        }
      ]
    },
    'study-education': {
      fields: [
        {
          name: 'futureGoal',
          label: 'Future Goal',
          type: 'select',
          required: true,
          options: [
            { value: 'higher-studies', label: 'Higher Studies' },
            { value: 'abroad-studies', label: 'Abroad Studies' },
            { value: 'career-guidance', label: 'Career Guidance' }
          ]
        }
      ]
    },
    'corporate': {
      fields: [
        {
          name: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'Your company or organization name'
        },
        {
          name: 'businessType',
          label: 'Business Type',
          type: 'select',
          required: true,
          options: [
            { value: 'it', label: 'IT' },
            { value: 'finance', label: 'Finance' },
            { value: 'retail', label: 'Retail' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'startup', label: 'Startup' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'employeeCount',
          label: 'Number of Employees',
          type: 'select',
          required: true,
          options: [
            { value: '1-10', label: '1\u201310' },
            { value: '10-50', label: '10\u201350' },
            { value: '50-100', label: '50\u2013100' },
            { value: '100+', label: '100+' }
          ]
        },
        {
          name: 'concernArea',
          label: 'Concern Area',
          type: 'select',
          required: true,
          options: [
            { value: 'growth-strategy', label: 'Growth Strategy' },
            { value: 'team-harmony', label: 'Team Harmony' },
            { value: 'leadership', label: 'Leadership' },
            { value: 'financial-stability', label: 'Financial Stability' },
            { value: 'market-expansion', label: 'Market Expansion' }
          ]
        }
      ]
    },
    'other': {
      fields: [
        {
          name: 'subjectTitle',
          label: 'Subject / Title of Concern',
          type: 'text',
          required: true,
          placeholder: 'Brief title of your concern'
        },
        {
          name: 'detailedConcern',
          label: 'Detailed Concern',
          type: 'textarea',
          required: true,
          placeholder: 'Please describe your concern in detail'
        }
      ]
    }
  };

  // Function to render service-specific fields
  function renderServiceFields(serviceType) {
    const container = document.getElementById('serviceSpecificFields');
    const serviceConfig = serviceConfigs[serviceType];
    
    if (!serviceConfig) {
      container.style.display = 'none';
      return;
    }

    let fieldsHTML = \`
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded mr-3 flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <span class="text-lg sm:text-xl">\u{1F3AF} \${serviceConfig.title || 'Service-Specific Information'}</span>
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    \`;

    serviceConfig.fields.forEach(field => {
      if (field.type === 'select') {
        fieldsHTML += \`
          <div class="space-y-2">
            <label for="\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \${field.label} \${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <select
              id="\${field.name}"
              name="\${field.name}"
              \${field.required ? 'required' : ''}
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"
            >
              <option value="">Select \${field.label.toLowerCase()}...</option>
              \${field.options.map(option => \`<option value="\${option.value}">\${option.label}</option>\`).join('')}
            </select>
          </div>
        \`;
      } else if (field.type === 'textarea') {
        fieldsHTML += \`
          <div class="space-y-2 sm:col-span-2">
            <label for="\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \${field.label} \${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <textarea
              id="\${field.name}"
              name="\${field.name}"
              \${field.required ? 'required' : ''}
              rows="4"
              placeholder="\${field.placeholder}"
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200 resize-none"
            ></textarea>
          </div>
        \`;
      } else {
        fieldsHTML += \`
          <div class="space-y-2">
            <label for="\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \${field.label} \${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <input
              type="\${field.type}"
              id="\${field.name}"
              name="\${field.name}"
              \${field.required ? 'required' : ''}
              placeholder="\${field.placeholder || ''}"
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"
            />
          </div>
        \`;
      }
    });

    fieldsHTML += \`
        </div>
      </div>
    \`;

    // Add special instruction if available (for palmistry)
    if (serviceConfig.instruction) {
      fieldsHTML += \`
        <div class="mt-6 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-lg">
          <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
            <div class="w-6 h-6 sm:w-5 sm:h-5 bg-blue-500 rounded-lg sm:rounded mr-3 flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            \${serviceConfig.instruction.title}
          </h4>
          <p class="text-blue-700 dark:text-blue-300 mb-3 leading-relaxed">\${serviceConfig.instruction.content}</p>
          <ul class="space-y-2 mb-3">
            \${serviceConfig.instruction.methods.map(method => \`<li class="text-blue-600 dark:text-blue-400 flex items-start">
              <span class="mr-2 mt-1">\u2022</span>
              <span>\${method}</span>
            </li>\`).join('')}
          </ul>
          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium leading-relaxed">\${serviceConfig.instruction.note}</p>
        </div>
      \`;
    }

    container.innerHTML = fieldsHTML;
    container.style.display = 'block';
    
    // Smooth scroll to the new fields
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

     // Event listener for service type change
   document.getElementById('serviceType').addEventListener('change', function() {
     const selectedService = this.value;
     console.log('Service type changed to:', selectedService);
     if (selectedService) {
       renderServiceFields(selectedService);
     } else {
       document.getElementById('serviceSpecificFields').style.display = 'none';
     }
   });

  // Set default dates
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('appointmentDate').value = tomorrow.toISOString().split('T')[0];
  });

  // Form submission handling
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    const form = document.getElementById('dynamic-appointment-form');
    console.log('Form element found:', form);
    
    if (form) {
            console.log('Attaching submit event listener to form');
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submit event triggered!');
        console.log('Form data being collected...');
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '\u23F3 Submitting...';
        submitBtn.disabled = true;
        
        try {
          // Wait for Supabase client to be available
          let attempts = 0;
          const maxAttempts = 10;
          
          while (!window.supabaseClient && attempts < maxAttempts) {
            console.log(\`Waiting for Supabase client... Attempt \${attempts + 1}/\${maxAttempts}\`);
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }
          
          if (!window.supabaseClient) {
            throw new Error('Supabase client not available after waiting. Please refresh the page and try again.');
          }
          
          // Collect form data
          const formData = new FormData(this);
          
          // Validate mobile number
          const mobileNumber = formData.get('mobileNumber');
          if (!mobileNumber || mobileNumber.length !== 10 || !/^[0-9]{10}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
          }
          
          // Debug: Log all form data
          console.log('=== FORM SUBMISSION DEBUG ===');
          for (const [key, value] of formData.entries()) {
            console.log(\`\${key}: \${value}\`);
          }
          
          const appointmentData = {
            name: formData.get('fullName'),
            email: formData.get('emailAddress'),
            phone: formData.get('mobileNumber'),
            service: formData.get('serviceType'),
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            consultation_method: formData.get('consultationMethod'),
            message: formData.get('userQuery'),
            status: 'pending',
            // Service-specific data
            service_details: {}
          };
          
          // Collect service-specific fields
          const serviceType = formData.get('serviceType');
          console.log('Selected service type:', serviceType);
          
          if (serviceType && serviceConfigs[serviceType]) {
            console.log('Service config found:', serviceConfigs[serviceType]);
            serviceConfigs[serviceType].fields.forEach(field => {
              const value = formData.get(field.name);
              console.log(\`Field \${field.name}: \${value}\`);
              if (value) {
                appointmentData.service_details[field.name] = value;
              }
            });
          } else {
            console.log('No service config found for:', serviceType);
          }
          
          console.log('Final appointment data:', appointmentData);
          
          console.log('Supabase client available, attempting to save...');
          
          try {
            // Try to save to Supabase first
            const { data, error } = await window.supabaseClient
              .from('appointments')
              .insert([appointmentData])
              .select()
              .single();
            
            if (error) {
              console.error('Supabase error:', error);
              throw new Error(error.message);
            }
            
            console.log('Successfully saved to Supabase:', data);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            this.reset();
            const serviceSpecificFields = document.getElementById('serviceSpecificFields');
            if (serviceSpecificFields) {
              serviceSpecificFields.style.display = 'none';
            }
            
          } catch (supabaseError) {
            console.error('Supabase failed, trying Formspree fallback:', supabaseError);
            
            // Fallback to Formspree
            const formspreeData = new FormData();
            formspreeData.append('name', appointmentData.name);
            formspreeData.append('email', appointmentData.email);
            formspreeData.append('phone', appointmentData.phone);
            formspreeData.append('service', appointmentData.service);
            formspreeData.append('date', appointmentData.date);
            formspreeData.append('time', appointmentData.time);
            formspreeData.append('consultation_method', appointmentData.consultation_method);
            formspreeData.append('message', appointmentData.message);
            formspreeData.append('service_details', JSON.stringify(appointmentData.service_details));
            
            const formspreeResponse = await fetch('https://formspree.io/f/xnnbzveo', {
              method: 'POST',
              body: formspreeData,
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (formspreeResponse.ok) {
              console.log('Successfully sent via Formspree fallback');
              showSuccessMessage();
              this.reset();
              const serviceSpecificFields = document.getElementById('serviceSpecificFields');
              if (serviceSpecificFields) {
                serviceSpecificFields.style.display = 'none';
              }
            } else {
              throw new Error('Both Supabase and Formspree failed');
            }
          }
          
        } catch (error) {
          console.error('Form submission error:', error);
          
          // Show user-friendly error message
          let errorMessage = 'Sorry, there was an error submitting your form. ';
          if (error.message.includes('Supabase client not available')) {
            errorMessage += 'Please refresh the page and try again.';
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Please check your internet connection and try again.';
          } else {
            errorMessage += 'Please try again or contact us directly.';
          }
          
          alert(errorMessage);
        } finally {
          // Reset button state
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
      
      console.log('Form submit event listener attached successfully');
    } else {
      console.error('Form element not found!');
    }
  });
  
  // Show success message
  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = '\u2705 Appointment booked successfully! We will contact you soon.';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
   
   // Add click handler to submit button as backup
   document.addEventListener('DOMContentLoaded', function() {
     const submitBtn = document.querySelector('button[type="submit"]');
     if (submitBtn) {
       submitBtn.addEventListener('click', function() {
         console.log('Submit button clicked!');
         
         // Manually trigger form submission
         const form = document.getElementById('dynamic-appointment-form');
         if (form) {
           console.log('Manually submitting form from button click');
           
                       // Collect form data manually
            const formData = new FormData(form);
            
            // Validate mobile number
            const mobileNumber = formData.get('mobileNumber');
            if (!mobileNumber || mobileNumber.length !== 10 || !/^[0-9]{10}$/.test(mobileNumber)) {
              alert('Please enter a valid 10-digit mobile number');
              return;
            }
            
            // Debug: Log all form data
            console.log('=== MANUAL FORM SUBMISSION DEBUG ===');
            for (const [key, value] of formData.entries()) {
              console.log(\`\${key}: \${value}\`);
            }
           
           const appointmentData = {
             name: formData.get('fullName'),
             email: formData.get('emailAddress'),
             phone: formData.get('mobileNumber'),
             service: formData.get('serviceType'),
             date: formData.get('appointmentDate'),
             time: formData.get('appointmentTime'),
             consultation_method: formData.get('consultationMethod'),
             message: formData.get('userQuery'),
             status: 'pending',
             service_details: {}
           };
           
           // Collect service-specific fields
           const serviceType = formData.get('serviceType');
           console.log('Selected service type:', serviceType);
           
           if (serviceType && serviceConfigs[serviceType]) {
             console.log('Service config found:', serviceConfigs[serviceType]);
             serviceConfigs[serviceType].fields.forEach(field => {
               const value = formData.get(field.name);
               console.log(\`Field \${field.name}: \${value}\`);
               if (value) {
                 appointmentData.service_details[field.name] = value;
               }
             });
           }
           
           console.log('Final appointment data:', appointmentData);
           
           // Check if Supabase client is available
           if (!window.supabaseClient) {
             console.error('Supabase client not available');
             alert('Supabase client not initialized. Please refresh the page and try again.');
             return;
           }
           
           console.log('Supabase client available, attempting to save...');
           
           // Save to Supabase
           window.supabaseClient
             .from('appointments')
             .insert([appointmentData])
             .select()
             .single()
             .then(({ data, error }) => {
               if (error) {
                 console.error('Supabase error:', error);
                 // Try Formspree fallback
                 console.log('Supabase failed, trying Formspree fallback...');
                 
                 const formspreeData = new FormData();
                 formspreeData.append('name', appointmentData.name);
                 formspreeData.append('email', appointmentData.email);
                 formspreeData.append('phone', appointmentData.phone);
                 formspreeData.append('service', appointmentData.service);
                 formspreeData.append('date', appointmentData.date);
                 formspreeData.append('time', appointmentData.time);
                 formspreeData.append('consultation_method', appointmentData.consultation_method);
                 formspreeData.append('message', appointmentData.message);
                 formspreeData.append('service_details', JSON.stringify(appointmentData.service_details));
                 
                 return fetch('https://formspree.io/f/xnnbzveo', {
                   method: 'POST',
                   body: formspreeData,
                   headers: {
                     'Accept': 'application/json'
                   }
                 });
               } else {
                 console.log('Successfully saved to Supabase:', data);
                 showSuccessMessage();
                 form.reset();
                 const serviceSpecificFields = document.getElementById('serviceSpecificFields');
                 if (serviceSpecificFields) {
                   serviceSpecificFields.style.display = 'none';
                 }
                 return Promise.resolve({ ok: true });
               }
             })
             .then(response => {
               if (response && response.ok) {
                 console.log('Successfully sent via Formspree fallback');
                 showSuccessMessage();
                 form.reset();
                 const serviceSpecificFields = document.getElementById('serviceSpecificFields');
                 if (serviceSpecificFields) {
                   serviceSpecificFields.style.display = 'none';
                 }
               }
             })
             .catch(error => {
               console.error('Form submission error:', error);
               alert('Sorry, there was an error submitting your form. Please try again or contact us directly.');
             });
         }
       });
       
       console.log('Submit button click handler attached successfully');
     } else {
       console.error('Submit button not found!');
     }
   });
<\/script>`], ["", `<div class="max-w-4xl mx-auto px-4 sm:px-6"> <form id="dynamic-appointment-form" class="space-y-6 sm:space-y-8"> <!-- Common Fields Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F310} Common Information</span> </h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"> <!-- Full Name --> <div class="space-y-2"> <label for="fullName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Full Name <span class="text-red-500">*</span> </label> <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Mobile Number --> <div class="space-y-2"> <label for="mobileNumber" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Mobile Number <span class="text-red-500">*</span> </label> <input type="tel" id="mobileNumber" name="mobileNumber" required maxlength="10" pattern="[0-9]{10}" placeholder="Enter 10 digit mobile number" title="Please enter a valid 10-digit mobile number" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)"> <div class="text-xs text-gray-500 dark:text-gray-400">
Enter 10-digit mobile number (e.g., 9876543210)
</div> </div> <!-- Email Address --> <div class="space-y-2"> <label for="emailAddress" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Email Address <span class="text-red-500">*</span> </label> <input type="email" id="emailAddress" name="emailAddress" required placeholder="your.email@example.com" class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Preferred Consultation Method --> <div class="space-y-2"> <label for="consultationMethod" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Preferred Consultation Method <span class="text-red-500">*</span> </label> <select id="consultationMethod" name="consultationMethod" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Select method...</option> <option value="call">Call</option> <option value="video-call">Video Call</option> <option value="in-person">In-person</option> <option value="whatsapp">WhatsApp</option> </select> </div> <!-- Appointment Date --> <div class="space-y-2"> <label for="appointmentDate" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Select Appointment Date <span class="text-red-500">*</span> </label> <input type="date" id="appointmentDate" name="appointmentDate" required`, ` class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> </div> <!-- Appointment Time --> <div class="space-y-2"> <label for="appointmentTime" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Select Appointment Time <span class="text-red-500">*</span> </label> <select id="appointmentTime" name="appointmentTime" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Select time...</option> <option value="09:00-09:30">9:00 AM - 9:30 AM</option> <option value="09:30-10:00">9:30 AM - 10:00 AM</option> <option value="10:00-10:30">10:00 AM - 10:30 AM</option> <option value="10:30-11:00">10:30 AM - 11:00 AM</option> <option value="11:00-11:30">11:00 AM - 11:30 AM</option> <option value="11:30-12:00">11:30 AM - 12:00 PM</option> <option value="14:00-14:30">2:00 PM - 2:30 PM</option> <option value="14:30-15:00">2:30 PM - 3:00 PM</option> <option value="15:00-15:30">3:00 PM - 3:30 PM</option> <option value="15:30-16:00">3:30 PM - 4:00 PM</option> <option value="16:00-16:30">4:00 PM - 4:30 PM</option> <option value="16:30-17:00">4:30 PM - 5:00 PM</option> <option value="17:00-17:30">5:00 PM - 5:30 PM</option> <option value="17:30-18:00">5:30 PM - 6:00 PM</option> </select> </div> </div> </div> <!-- Service Selection Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F3AF} Select Your Service</span> </h3> <div class="space-y-2"> <label for="serviceType" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Service Type <span class="text-red-500">*</span> </label> <select id="serviceType" name="serviceType" required class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"> <option value="">Choose your service...</option> <option value="astrology">\u{1F52E} Astrology</option> <option value="gemstone">\u{1F48E} Gemstone Consultation</option> <option value="palmistry">\u270B Palmistry</option> <option value="numerology">\u{1F522} Numerology</option> <option value="career-finance">\u{1F4BC} Career & Finance</option> <option value="matchmaking">\u{1F495} Matchmaking</option> <option value="study-education">\u{1F4DA} Study / Education</option> <option value="corporate">\u{1F3E2} Corporate Consultation</option> <option value="other">\u2728 Other Reason</option> </select> </div> </div> <!-- Service-Specific Fields Container --> <div id="serviceSpecificFields" class="space-y-6" style="display: none;"> <!-- Fields will be dynamically loaded here --> </div> <!-- Query Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F4AC} Your Query / Notes</span> </h3> <div class="space-y-2"> <label for="userQuery" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
Tell us about your concerns or questions
</label> <textarea id="userQuery" name="userQuery" rows="4" placeholder="Please share your specific questions, concerns, or what you'd like to discuss during the consultation..." class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-base transition-all duration-200"></textarea> </div> </div> <!-- Disclaimer Section --> <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm"> <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center"> <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded mr-3 flex items-center justify-center"> <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <span class="text-lg sm:text-xl">\u{1F4CB} Terms & Privacy</span> </h3> <!-- Combined Policy Summary --> <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-lg p-4 mb-4 sm:mb-6"> <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"> <strong>Privacy & Terms:</strong> We respect your privacy - your data is encrypted, never shared with third parties, and retained only as long as necessary for service delivery. By booking, you agree to our terms: no advance payments and guidance-based services. For full details, see our <a href="/privacy" class="underline hover:text-blue-600 dark:hover:text-blue-300">Privacy Policy</a> and <a href="/terms" class="underline hover:text-blue-600 dark:hover:text-blue-300">Terms & Conditions</a>.
</p> </div> <!-- Disclaimer Checkbox --> <div class="flex items-start space-x-3"> <input id="disclaimer" name="disclaimer" type="checkbox" required class="mt-1 h-5 w-5 sm:h-4 sm:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"> <label for="disclaimer" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
I agree to the terms and conditions and privacy policy of JyotirSetu.
</label> </div> </div> <!-- Submit Button --> <div class="text-center"> <button type="submit" class="w-full px-6 py-4 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl sm:rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:ring-4 focus:ring-purple-300 focus:outline-none text-lg">
\u{1F52E} Book Your Consultation
</button> </div> </form> <!-- Success Message --> <div id="form-success" class="hidden mt-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-2xl sm:rounded-lg"> <div class="flex items-start sm:items-center"> <div class="flex-shrink-0"> <svg class="w-6 h-6 sm:w-5 sm:h-5 text-green-600 mt-1 sm:mt-0 mr-3 sm:mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> </div> <div> <h4 class="text-lg font-semibold text-green-800 mb-2">\u{1F320} Appointment Request Submitted Successfully</h4> <p class="text-green-700 leading-relaxed">Thank you for trusting JyotirSetu. Your consultation request has been recorded, and we'll confirm your appointment according to your selected date and time.</p> </div> </div> </div> </div> <script>
  // Service configurations for dynamic fields
  const serviceConfigs = {
    'astrology': {
      fields: [
        {
          name: 'astrologyConcern',
          label: 'Astrology Concern Area',
          type: 'select',
          required: true,
          options: [
            { value: 'health', label: 'Health' },
            { value: 'career', label: 'Career' },
            { value: 'relationship', label: 'Relationship' },
            { value: 'finance', label: 'Finance' },
            { value: 'general', label: 'General' }
          ]
        },
        {
          name: 'currentProfession',
          label: 'Current Profession',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'birthTime',
          label: 'Birth Time',
          type: 'time',
          required: true
        },
        {
          name: 'birthPlace',
          label: 'Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        }
      ]
    },
    'gemstone': {
      fields: [
        {
          name: 'wearingPurpose',
          label: 'Wearing Purpose',
          type: 'select',
          required: true,
          options: [
            { value: 'healing', label: 'Healing' },
            { value: 'wealth', label: 'Wealth' },
            { value: 'career', label: 'Career' },
            { value: 'protection', label: 'Protection' },
            { value: 'spirituality', label: 'Spirituality' }
          ]
        },
        {
          name: 'currentProfession',
          label: 'Current Profession',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'birthTime',
          label: 'Birth Time',
          type: 'time',
          required: true
        },
        {
          name: 'wearingGemstone',
          label: 'Wearing Any Gemstone Currently?',
          type: 'text',
          required: false,
          placeholder: 'If yes, which one?'
        }
      ]
    },
    'palmistry': {
      fields: [
        {
          name: 'focusArea',
          label: 'Focus Area',
          type: 'select',
          required: true,
          options: [
            { value: 'career', label: 'Career' },
            { value: 'marriage', label: 'Marriage' },
            { value: 'finance', label: 'Finance' },
            { value: 'health', label: 'Health' },
            { value: 'general', label: 'General Prediction' }
          ]
        },
        {
          name: 'handDominance',
          label: 'Hand Dominance',
          type: 'select',
          required: true,
          options: [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'both', label: 'Both' }
          ]
        },
        {
          name: 'specificConcerns',
          label: 'Specific Concerns / Questions',
          type: 'textarea',
          required: false,
          placeholder: 'Tell us what you would like to know from palm reading.'
        }
      ],
      instruction: {
        title: '\u{1F4F8} Hand Image Upload Instructions',
        content: 'For accurate palm reading, please upload clear photos of your palms:',
        methods: [
          'Take photos in good lighting',
          'Ensure all lines are clearly visible',
          'Include both left and right palms',
          'Upload to Google Drive or Dropbox and share the link'
        ],
        note: 'You can share the image link in the "Message" field below or send via WhatsApp.'
      }
    },
    'matchmaking': {
      fields: [
        {
          name: 'person1Name',
          label: 'Your Full Name',
          type: 'text',
          required: true,
          placeholder: 'Your full name as per official records'
        },
        {
          name: 'person1Gender',
          label: 'Your Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'person1DOB',
          label: 'Your Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'person1TOB',
          label: 'Your Time of Birth',
          type: 'time',
          required: true
        },
        {
          name: 'person1POB',
          label: 'Your Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        },
        {
          name: 'person2Name',
          label: 'Partner\\\\'s Full Name',
          type: 'text',
          required: true,
          placeholder: 'Partner\\\\'s full name as per official records'
        },
        {
          name: 'person2Gender',
          label: 'Partner\\\\'s Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'person2DOB',
          label: 'Partner\\\\'s Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'person2TOB',
          label: 'Partner\\\\'s Time of Birth',
          type: 'time',
          required: true
        },
        {
          name: 'person2POB',
          label: 'Partner\\\\'s Place of Birth',
          type: 'text',
          required: true,
          placeholder: 'City, State, Country'
        }
      ]
    },
    'numerology': {
      fields: [
        {
          name: 'officialName',
          label: 'Full Name (as per official records)',
          type: 'text',
          required: true,
          placeholder: 'Exact spelling is very important for numerology'
        },
        {
          name: 'commonName',
          label: 'Name You Are Commonly Known By',
          type: 'text',
          required: false,
          placeholder: 'Nickname or different spelling (optional)'
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'focusArea',
          label: 'Specific Focus Area',
          type: 'select',
          required: true,
          options: [
            { value: 'career-finance', label: 'Career & Finance' },
            { value: 'relationship-marriage', label: 'Relationship / Marriage' },
            { value: 'health-wellness', label: 'Health & Wellness' },
            { value: 'name-correction', label: 'Name Correction / Lucky Name' },
            { value: 'general-guidance', label: 'General Guidance' }
          ]
        }
      ]
    },
    'career-finance': {
      fields: [
        {
          name: 'currentProfession',
          label: 'Current Profession / Industry',
          type: 'text',
          required: true,
          placeholder: 'e.g., Software Engineer, Business Owner'
        },
        {
          name: 'financialConcerns',
          label: 'Financial Concerns',
          type: 'select',
          required: true,
          options: [
            { value: 'business-growth', label: 'Business Growth' },
            { value: 'job-change', label: 'Job Change' },
            { value: 'investments', label: 'Investments' },
            { value: 'debt-issues', label: 'Debt Issues' },
            { value: 'general-guidance', label: 'General Guidance' }
          ]
        }
      ]
    },
    'study-education': {
      fields: [
        {
          name: 'futureGoal',
          label: 'Future Goal',
          type: 'select',
          required: true,
          options: [
            { value: 'higher-studies', label: 'Higher Studies' },
            { value: 'abroad-studies', label: 'Abroad Studies' },
            { value: 'career-guidance', label: 'Career Guidance' }
          ]
        }
      ]
    },
    'corporate': {
      fields: [
        {
          name: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'Your company or organization name'
        },
        {
          name: 'businessType',
          label: 'Business Type',
          type: 'select',
          required: true,
          options: [
            { value: 'it', label: 'IT' },
            { value: 'finance', label: 'Finance' },
            { value: 'retail', label: 'Retail' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'startup', label: 'Startup' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          name: 'employeeCount',
          label: 'Number of Employees',
          type: 'select',
          required: true,
          options: [
            { value: '1-10', label: '1\u201310' },
            { value: '10-50', label: '10\u201350' },
            { value: '50-100', label: '50\u2013100' },
            { value: '100+', label: '100+' }
          ]
        },
        {
          name: 'concernArea',
          label: 'Concern Area',
          type: 'select',
          required: true,
          options: [
            { value: 'growth-strategy', label: 'Growth Strategy' },
            { value: 'team-harmony', label: 'Team Harmony' },
            { value: 'leadership', label: 'Leadership' },
            { value: 'financial-stability', label: 'Financial Stability' },
            { value: 'market-expansion', label: 'Market Expansion' }
          ]
        }
      ]
    },
    'other': {
      fields: [
        {
          name: 'subjectTitle',
          label: 'Subject / Title of Concern',
          type: 'text',
          required: true,
          placeholder: 'Brief title of your concern'
        },
        {
          name: 'detailedConcern',
          label: 'Detailed Concern',
          type: 'textarea',
          required: true,
          placeholder: 'Please describe your concern in detail'
        }
      ]
    }
  };

  // Function to render service-specific fields
  function renderServiceFields(serviceType) {
    const container = document.getElementById('serviceSpecificFields');
    const serviceConfig = serviceConfigs[serviceType];
    
    if (!serviceConfig) {
      container.style.display = 'none';
      return;
    }

    let fieldsHTML = \\\`
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <div class="w-8 h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded mr-3 flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <span class="text-lg sm:text-xl">\u{1F3AF} \\\${serviceConfig.title || 'Service-Specific Information'}</span>
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    \\\`;

    serviceConfig.fields.forEach(field => {
      if (field.type === 'select') {
        fieldsHTML += \\\`
          <div class="space-y-2">
            <label for="\\\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \\\${field.label} \\\${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <select
              id="\\\${field.name}"
              name="\\\${field.name}"
              \\\${field.required ? 'required' : ''}
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"
            >
              <option value="">Select \\\${field.label.toLowerCase()}...</option>
              \\\${field.options.map(option => \\\`<option value="\\\${option.value}">\\\${option.label}</option>\\\`).join('')}
            </select>
          </div>
        \\\`;
      } else if (field.type === 'textarea') {
        fieldsHTML += \\\`
          <div class="space-y-2 sm:col-span-2">
            <label for="\\\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \\\${field.label} \\\${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <textarea
              id="\\\${field.name}"
              name="\\\${field.name}"
              \\\${field.required ? 'required' : ''}
              rows="4"
              placeholder="\\\${field.placeholder}"
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200 resize-none"
            ></textarea>
          </div>
        \\\`;
      } else {
        fieldsHTML += \\\`
          <div class="space-y-2">
            <label for="\\\${field.name}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              \\\${field.label} \\\${field.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
            <input
              type="\\\${field.type}"
              id="\\\${field.name}"
              name="\\\${field.name}"
              \\\${field.required ? 'required' : ''}
              placeholder="\\\${field.placeholder || ''}"
              class="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all duration-200"
            />
          </div>
        \\\`;
      }
    });

    fieldsHTML += \\\`
        </div>
      </div>
    \\\`;

    // Add special instruction if available (for palmistry)
    if (serviceConfig.instruction) {
      fieldsHTML += \\\`
        <div class="mt-6 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-lg">
          <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
            <div class="w-6 h-6 sm:w-5 sm:h-5 bg-blue-500 rounded-lg sm:rounded mr-3 flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            \\\${serviceConfig.instruction.title}
          </h4>
          <p class="text-blue-700 dark:text-blue-300 mb-3 leading-relaxed">\\\${serviceConfig.instruction.content}</p>
          <ul class="space-y-2 mb-3">
            \\\${serviceConfig.instruction.methods.map(method => \\\`<li class="text-blue-600 dark:text-blue-400 flex items-start">
              <span class="mr-2 mt-1">\u2022</span>
              <span>\\\${method}</span>
            </li>\\\`).join('')}
          </ul>
          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium leading-relaxed">\\\${serviceConfig.instruction.note}</p>
        </div>
      \\\`;
    }

    container.innerHTML = fieldsHTML;
    container.style.display = 'block';
    
    // Smooth scroll to the new fields
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

     // Event listener for service type change
   document.getElementById('serviceType').addEventListener('change', function() {
     const selectedService = this.value;
     console.log('Service type changed to:', selectedService);
     if (selectedService) {
       renderServiceFields(selectedService);
     } else {
       document.getElementById('serviceSpecificFields').style.display = 'none';
     }
   });

  // Set default dates
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('appointmentDate').value = tomorrow.toISOString().split('T')[0];
  });

  // Form submission handling
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    const form = document.getElementById('dynamic-appointment-form');
    console.log('Form element found:', form);
    
    if (form) {
            console.log('Attaching submit event listener to form');
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submit event triggered!');
        console.log('Form data being collected...');
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '\u23F3 Submitting...';
        submitBtn.disabled = true;
        
        try {
          // Wait for Supabase client to be available
          let attempts = 0;
          const maxAttempts = 10;
          
          while (!window.supabaseClient && attempts < maxAttempts) {
            console.log(\\\`Waiting for Supabase client... Attempt \\\${attempts + 1}/\\\${maxAttempts}\\\`);
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }
          
          if (!window.supabaseClient) {
            throw new Error('Supabase client not available after waiting. Please refresh the page and try again.');
          }
          
          // Collect form data
          const formData = new FormData(this);
          
          // Validate mobile number
          const mobileNumber = formData.get('mobileNumber');
          if (!mobileNumber || mobileNumber.length !== 10 || !/^[0-9]{10}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
          }
          
          // Debug: Log all form data
          console.log('=== FORM SUBMISSION DEBUG ===');
          for (const [key, value] of formData.entries()) {
            console.log(\\\`\\\${key}: \\\${value}\\\`);
          }
          
          const appointmentData = {
            name: formData.get('fullName'),
            email: formData.get('emailAddress'),
            phone: formData.get('mobileNumber'),
            service: formData.get('serviceType'),
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            consultation_method: formData.get('consultationMethod'),
            message: formData.get('userQuery'),
            status: 'pending',
            // Service-specific data
            service_details: {}
          };
          
          // Collect service-specific fields
          const serviceType = formData.get('serviceType');
          console.log('Selected service type:', serviceType);
          
          if (serviceType && serviceConfigs[serviceType]) {
            console.log('Service config found:', serviceConfigs[serviceType]);
            serviceConfigs[serviceType].fields.forEach(field => {
              const value = formData.get(field.name);
              console.log(\\\`Field \\\${field.name}: \\\${value}\\\`);
              if (value) {
                appointmentData.service_details[field.name] = value;
              }
            });
          } else {
            console.log('No service config found for:', serviceType);
          }
          
          console.log('Final appointment data:', appointmentData);
          
          console.log('Supabase client available, attempting to save...');
          
          try {
            // Try to save to Supabase first
            const { data, error } = await window.supabaseClient
              .from('appointments')
              .insert([appointmentData])
              .select()
              .single();
            
            if (error) {
              console.error('Supabase error:', error);
              throw new Error(error.message);
            }
            
            console.log('Successfully saved to Supabase:', data);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            this.reset();
            const serviceSpecificFields = document.getElementById('serviceSpecificFields');
            if (serviceSpecificFields) {
              serviceSpecificFields.style.display = 'none';
            }
            
          } catch (supabaseError) {
            console.error('Supabase failed, trying Formspree fallback:', supabaseError);
            
            // Fallback to Formspree
            const formspreeData = new FormData();
            formspreeData.append('name', appointmentData.name);
            formspreeData.append('email', appointmentData.email);
            formspreeData.append('phone', appointmentData.phone);
            formspreeData.append('service', appointmentData.service);
            formspreeData.append('date', appointmentData.date);
            formspreeData.append('time', appointmentData.time);
            formspreeData.append('consultation_method', appointmentData.consultation_method);
            formspreeData.append('message', appointmentData.message);
            formspreeData.append('service_details', JSON.stringify(appointmentData.service_details));
            
            const formspreeResponse = await fetch('https://formspree.io/f/xnnbzveo', {
              method: 'POST',
              body: formspreeData,
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (formspreeResponse.ok) {
              console.log('Successfully sent via Formspree fallback');
              showSuccessMessage();
              this.reset();
              const serviceSpecificFields = document.getElementById('serviceSpecificFields');
              if (serviceSpecificFields) {
                serviceSpecificFields.style.display = 'none';
              }
            } else {
              throw new Error('Both Supabase and Formspree failed');
            }
          }
          
        } catch (error) {
          console.error('Form submission error:', error);
          
          // Show user-friendly error message
          let errorMessage = 'Sorry, there was an error submitting your form. ';
          if (error.message.includes('Supabase client not available')) {
            errorMessage += 'Please refresh the page and try again.';
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Please check your internet connection and try again.';
          } else {
            errorMessage += 'Please try again or contact us directly.';
          }
          
          alert(errorMessage);
        } finally {
          // Reset button state
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
      
      console.log('Form submit event listener attached successfully');
    } else {
      console.error('Form element not found!');
    }
  });
  
  // Show success message
  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = '\u2705 Appointment booked successfully! We will contact you soon.';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
   
   // Add click handler to submit button as backup
   document.addEventListener('DOMContentLoaded', function() {
     const submitBtn = document.querySelector('button[type="submit"]');
     if (submitBtn) {
       submitBtn.addEventListener('click', function() {
         console.log('Submit button clicked!');
         
         // Manually trigger form submission
         const form = document.getElementById('dynamic-appointment-form');
         if (form) {
           console.log('Manually submitting form from button click');
           
                       // Collect form data manually
            const formData = new FormData(form);
            
            // Validate mobile number
            const mobileNumber = formData.get('mobileNumber');
            if (!mobileNumber || mobileNumber.length !== 10 || !/^[0-9]{10}$/.test(mobileNumber)) {
              alert('Please enter a valid 10-digit mobile number');
              return;
            }
            
            // Debug: Log all form data
            console.log('=== MANUAL FORM SUBMISSION DEBUG ===');
            for (const [key, value] of formData.entries()) {
              console.log(\\\`\\\${key}: \\\${value}\\\`);
            }
           
           const appointmentData = {
             name: formData.get('fullName'),
             email: formData.get('emailAddress'),
             phone: formData.get('mobileNumber'),
             service: formData.get('serviceType'),
             date: formData.get('appointmentDate'),
             time: formData.get('appointmentTime'),
             consultation_method: formData.get('consultationMethod'),
             message: formData.get('userQuery'),
             status: 'pending',
             service_details: {}
           };
           
           // Collect service-specific fields
           const serviceType = formData.get('serviceType');
           console.log('Selected service type:', serviceType);
           
           if (serviceType && serviceConfigs[serviceType]) {
             console.log('Service config found:', serviceConfigs[serviceType]);
             serviceConfigs[serviceType].fields.forEach(field => {
               const value = formData.get(field.name);
               console.log(\\\`Field \\\${field.name}: \\\${value}\\\`);
               if (value) {
                 appointmentData.service_details[field.name] = value;
               }
             });
           }
           
           console.log('Final appointment data:', appointmentData);
           
           // Check if Supabase client is available
           if (!window.supabaseClient) {
             console.error('Supabase client not available');
             alert('Supabase client not initialized. Please refresh the page and try again.');
             return;
           }
           
           console.log('Supabase client available, attempting to save...');
           
           // Save to Supabase
           window.supabaseClient
             .from('appointments')
             .insert([appointmentData])
             .select()
             .single()
             .then(({ data, error }) => {
               if (error) {
                 console.error('Supabase error:', error);
                 // Try Formspree fallback
                 console.log('Supabase failed, trying Formspree fallback...');
                 
                 const formspreeData = new FormData();
                 formspreeData.append('name', appointmentData.name);
                 formspreeData.append('email', appointmentData.email);
                 formspreeData.append('phone', appointmentData.phone);
                 formspreeData.append('service', appointmentData.service);
                 formspreeData.append('date', appointmentData.date);
                 formspreeData.append('time', appointmentData.time);
                 formspreeData.append('consultation_method', appointmentData.consultation_method);
                 formspreeData.append('message', appointmentData.message);
                 formspreeData.append('service_details', JSON.stringify(appointmentData.service_details));
                 
                 return fetch('https://formspree.io/f/xnnbzveo', {
                   method: 'POST',
                   body: formspreeData,
                   headers: {
                     'Accept': 'application/json'
                   }
                 });
               } else {
                 console.log('Successfully saved to Supabase:', data);
                 showSuccessMessage();
                 form.reset();
                 const serviceSpecificFields = document.getElementById('serviceSpecificFields');
                 if (serviceSpecificFields) {
                   serviceSpecificFields.style.display = 'none';
                 }
                 return Promise.resolve({ ok: true });
               }
             })
             .then(response => {
               if (response && response.ok) {
                 console.log('Successfully sent via Formspree fallback');
                 showSuccessMessage();
                 form.reset();
                 const serviceSpecificFields = document.getElementById('serviceSpecificFields');
                 if (serviceSpecificFields) {
                   serviceSpecificFields.style.display = 'none';
                 }
               }
             })
             .catch(error => {
               console.error('Form submission error:', error);
               alert('Sorry, there was an error submitting your form. Please try again or contact us directly.');
             });
         }
       });
       
       console.log('Submit button click handler attached successfully');
     } else {
       console.error('Submit button not found!');
     }
   });
<\/script>`])), maybeRenderHead(), addAttribute((/* @__PURE__ */ new Date()).toISOString().split("T")[0], "min"));
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/components/widgets/DynamicAppointmentForm.astro", void 0);

const $$Astro = createAstro("https://jyotirsetu.com");
const $$ScheduleAppointmentJyotirSetu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ScheduleAppointmentJyotirSetu;
  const today = /* @__PURE__ */ new Date();
  const upcomingDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    upcomingDates.push({
      label: `${dayName}, ${dateStr}`,
      value: date.toISOString().split("T")[0]
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, {}, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "title": "Book Your Astrology Consultation", "subtitle": "Connect with the stars and discover your destiny. Schedule a personalized consultation with JyotirSetu's expert astrologer Punita Sharma.", "actions": [
    {
      variant: "primary",
      text: "Book Now",
      href: "#appointment-form",
      icon: "tabler:calendar"
    }
  ] }, { "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Book Your ${maybeRenderHead()}<span class="text-accent dark:text-white">Astrology Consultation</span> ` })}` })}  <section class="py-16 bg-page"> <div class="max-w-7xl mx-auto px-6"> <div class="grid grid-cols-2 md:grid-cols-4 gap-6"> <div class="text-center relative"> <div class="text-3xl font-bold text-primary">10,000+</div> <div class="text-muted text-sm">Happy Clients and Counting</div> <!-- Separator for mobile --> <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 hidden md:block"></div> <!-- Separator for bottom --> <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gray-300 md:hidden"></div> </div> <div class="text-center relative"> <div class="text-3xl font-bold text-primary">25+</div> <div class="text-muted text-sm">Years Experience</div> <!-- Separator for mobile --> <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 hidden md:block"></div> <!-- Separator for bottom --> <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gray-300 md:hidden"></div> </div> <div class="text-center relative"> <div class="text-3xl font-bold text-primary">98%</div> <div class="text-muted text-sm">Success Rate</div> <!-- Separator for mobile --> <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 hidden md:block"></div> <!-- Separator for bottom --> <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gray-300 md:hidden"></div> </div> <div class="text-center relative"> <div class="text-3xl font-bold text-primary">24/7</div> <div class="text-muted text-sm">Support</div> </div> </div> </div> </section>  <section class="py-16 bg-page"> <div class="max-w-7xl mx-auto px-6"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-heading mb-4">How to Book Your Consultation</h2> <p class="text-lg text-muted">Simple steps to connect with our expert astrologers</p> </div> <div class="grid md:grid-cols-3 gap-8"> <div class="text-center"> <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"> <span class="text-2xl font-bold text-white">1</span> </div> <h3 class="text-xl font-semibold text-heading mb-4">Fill the Form</h3> <p class="text-muted">Complete the appointment form with your details and select your preferred service.</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"> <span class="text-2xl font-bold text-white">2</span> </div> <h3 class="text-xl font-semibold text-heading mb-4">Get Confirmation</h3> <p class="text-muted">Receive confirmation and payment details within 24 hours of form submission.</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6"> <span class="text-2xl font-bold text-white">3</span> </div> <h3 class="text-xl font-semibold text-heading mb-4">Start Consultation</h3> <p class="text-muted">Connect with our expert astrologer at your scheduled time via call or video.</p> </div> </div> </div> </section>  <section id="appointment-form" class="py-16 bg-page"> <div class="max-w-4xl mx-auto px-6"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-heading mb-4">Book Your Consultation</h2> <p class="text-lg text-muted">Select your service and fill out the form below to schedule your personalized astrology consultation. Our expert astrologers will guide you towards clarity and success.</p> </div> ${renderComponent($$result2, "DynamicAppointmentForm", $$DynamicAppointmentForm, {})} </div> </section>  ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/ScheduleAppointmentJyotirSetu.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result2, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/ScheduleAppointmentJyotirSetu.astro?astro&type=script&index=1&lang.ts")}  <section class="py-12 bg-green-50"> <div class="max-w-4xl mx-auto px-6 text-center"> <div class="bg-white rounded-2xl shadow-lg p-8"> <h3 class="text-2xl font-bold text-gray-800 mb-4">Prefer WhatsApp?</h3> <p class="text-gray-600 mb-6">Get instant responses and quick booking through WhatsApp</p> <a href="https://wa.me/919266991298?text=Hello%20JyotirSetu,%20I%20would%20like%20to%20book%20an%20appointment%20for%20astrology%20consultation." target="_blank" class="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"> <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"></path> </svg>
Book on WhatsApp
</a> </div> </div> </section>  <section class="py-16 bg-page"> <div class="max-w-7xl mx-auto px-6"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-heading mb-4">What Our Clients Say</h2> <p class="text-lg text-muted">Real experiences from satisfied clients</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">R</span> </div> <div> <h4 class="font-semibold text-heading">Rahul Sharma</h4> <p class="text-muted text-sm">Mumbai, Business Owner</p> </div> </div> <p class="text-default text-sm">"JyotirSetu helped me understand my career path better. The consultation was insightful and practical. I got clarity on my business decisions."</p> </div> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">P</span> </div> <div> <h4 class="font-semibold text-heading">Priya Patel</h4> <p class="text-muted text-sm">Delhi, Software Engineer</p> </div> </div> <p class="text-default text-sm">"The matchmaking service was excellent. Found my perfect match through their guidance. The compatibility analysis was spot on!"</p> </div> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">A</span> </div> <div> <h4 class="font-semibold text-heading">Amit Kumar</h4> <p class="text-muted text-sm">Bangalore, Student</p> </div> </div> <p class="text-default text-sm">"Professional service with accurate predictions. The study guidance helped me choose the right career path. Highly recommend!"</p> </div> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">S</span> </div> <div> <h4 class="font-semibold text-heading">Sunita Verma</h4> <p class="text-muted text-sm">Pune, Homemaker</p> </div> </div> <p class="text-default text-sm">"The palmistry reading was fascinating! JyotirSetu's expert explained everything so clearly. I feel more confident about my future now."</p> </div> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">M</span> </div> <div> <h4 class="font-semibold text-heading">Mohit Singh</h4> <p class="text-muted text-sm">Chennai, Marketing Manager</p> </div> </div> <p class="text-default text-sm">"The gemstone consultation was life-changing. Wearing the recommended gemstone improved my confidence and career prospects significantly."</p> </div> <div class="bg-light rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4"> <span class="text-white font-bold">N</span> </div> <div> <h4 class="font-semibold text-heading">Neha Gupta</h4> <p class="text-muted text-sm">Hyderabad, Doctor</p> </div> </div> <p class="text-default text-sm">"As a medical professional, I was skeptical at first. But JyotirSetu's approach is scientific and practical. The career guidance was invaluable."</p> </div> </div> </div> </section>  <section class="py-12 bg-gradient-to-r from-primary to-secondary"> <div class="max-w-4xl mx-auto px-6 text-center"> <h2 class="text-2xl font-bold text-white mb-4">Ready to Discover Your Destiny?</h2> <p class="text-lg text-blue-100 mb-6">Book your consultation today and take the first step towards a brighter future.</p> <a href="#appointment-form" class="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300">
Book Now
</a> </div> </section> ` })}`;
}, "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/ScheduleAppointmentJyotirSetu.astro", void 0);

const $$file = "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/pages/ScheduleAppointmentJyotirSetu.astro";
const $$url = "/ScheduleAppointmentJyotirSetu";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ScheduleAppointmentJyotirSetu,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
