let h,c=[],p=new Set;function C(){return new Promise((e,t)=>{if(typeof window.supabase<"u"){e();return}console.log("Loading Supabase from CDN...");const s=document.createElement("script");s.src="https://unpkg.com/@supabase/supabase-js@2",s.onload=()=>{console.log("Supabase CDN script loaded successfully"),e()},s.onerror=()=>{console.error("Failed to load Supabase from CDN"),t(new Error("Failed to load Supabase library"))},document.head.appendChild(s)})}function E(){try{return typeof window.supabase>"u"?(console.log("Supabase library not loaded yet"),!1):(h=window.supabase.createClient("https://czbypbrrxxjcjdfjxczv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YnlwYnJyeHhqY2pkZmp4Y3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjU2NDcsImV4cCI6MjA3MjUwMTY0N30.SQ-eabMNo5RBy8N0MHWDmlxVH7Tmh-EGykI0Qt5wDjg"),console.log("Supabase initialized successfully"),!0)}catch(e){return console.error("Error creating Supabase client:",e),!1}}async function S(){let e=0;const t=20;try{await C()}catch{console.warn("CDN loading failed, continuing with existing library...")}for(;e<t;){if(typeof window.supabase<"u"&&E())return!0;console.log(`Supabase not ready, attempt ${e+1}/${t}`),await new Promise(s=>setTimeout(s,500)),e++}return console.error("Failed to initialize Supabase after multiple attempts"),!1}document.addEventListener("DOMContentLoaded",async function(){console.log("Appointment Dashboard - DOM Content Loaded"),console.log("Current URL:",window.location.href),console.log("Current pathname:",window.location.pathname);const e=document.getElementById("appointments-tbody");e&&(e.innerHTML=`
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          <div class="inline-flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span>Initializing dashboard...</span>
          </div>
        </td>
      </tr>
    `);try{if(console.log("Starting Supabase initialization..."),!await S()){console.error("Supabase initialization failed"),e&&(e.innerHTML=`
          <tr>
            <td colspan="6" class="px-6 py-12 text-center text-red-500 dark:text-red-400">
              <div class="space-y-2">
                <div class="text-lg font-semibold">⚠️ Database Connection Failed</div>
                <div class="text-sm">Unable to connect to database. Please check your connection and refresh.</div>
                <button onclick="window.location.reload()" class="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  🔄 Refresh Page
                </button>
              </div>
            </td>
          </tr>
        `);return}console.log("Supabase ready, proceeding with dashboard initialization"),console.log("Skipping authentication check - handled by main admin page");const s=localStorage.getItem("admin_email"),o=document.getElementById("admin-email");o&&s&&(o.textContent=`Welcome, ${s}`),await b(),console.log("Appointments loaded, setting up event listeners..."),W(),console.log("Dashboard initialized successfully")}catch(t){console.error("Error initializing dashboard:",t),e&&(e.innerHTML=`
        <tr>
          <td colspan="6" class="px-6 py-12 text-center text-red-500 dark:text-red-400">
            <div class="space-y-2">
              <div class="text-lg font-semibold">❌ Dashboard Error</div>
              <div class="text-sm">${t.message||"Unknown error occurred during initialization"}</div>
              <button onclick="window.location.reload()" class="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                🔄 Refresh Page
              </button>
            </div>
          </td>
        </tr>
      `)}});async function b(){try{if(console.log("Loading appointments..."),!h){console.error("Supabase client not initialized");return}const{data:e,error:t}=await h.from("appointments").select("*").order("created_at",{ascending:!1});if(t){console.error("Error loading appointments:",t);return}c=e||[],console.log("Appointments loaded:",c),v(),y()}catch(e){console.error("Error in loadAppointments:",e)}}function v(){const e=c.filter(n=>n.status==="pending").length,t=c.filter(n=>n.status==="confirmed").length,s=c.filter(n=>n.status==="completed").length,o=c.filter(n=>n.status==="cancelled").length;document.getElementById("pending-count").textContent=e,document.getElementById("confirmed-count").textContent=t,document.getElementById("completed-count").textContent=s,document.getElementById("cancelled-count").textContent=o}function y(){const e=document.getElementById("appointments-tbody");if(e){if(c.length===0){e.innerHTML=`
      <tr>
        <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          No appointments found
        </td>
      </tr>
    `;return}console.log("Rendering appointments:",c.length),e.innerHTML=c.map(t=>{let s={};if(typeof t.service_details=="string")try{s=JSON.parse(t.service_details)}catch{s={}}else t.service_details&&(s=t.service_details);const o=Object.entries(s).map(([n,r])=>r?`<div class="text-xs text-gray-600 dark:text-gray-400"><span class="font-medium">${n.replace(/([A-Z])/g," $1").replace(/^./,i=>i.toUpperCase())}:</span> ${r}</div>`:"").filter(n=>n).join("");return console.log("Rendering appointment:",t.id,"with service details:",s),`
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="px-6 py-4 whitespace-nowrap">
          <input type="checkbox" class="appointment-checkbox rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                 value="${t.id}" onchange="toggleAppointmentSelection(${t.id})">
        </td>
        <td class="px-6 py-4">
          <div class="space-y-2">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">${t.name||"N/A"}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">📱 Phone:</span> ${t.phone||"N/A"}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">📧 Email:</span> ${t.email||"N/A"}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">💬 Message:</span> ${t.message||"No message"}
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="space-y-2">
            <div class="text-sm font-semibold text-purple-600 dark:text-purple-400">
              🔮 ${t.service||"N/A"}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">📅 Date:</span> ${t.date||t.preferred_date||"N/A"}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">⏰ Time:</span> ${t.time||t.preferred_time||"N/A"}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">📞 Method:</span> ${t.consultation_method||"N/A"}
            </div>
            ${o?`
              <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
                <div class="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">
                  Service-Specific Details
                </div>
                ${o}
              </div>
            `:""}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full ${x(t.status)}">
            ${w(t.status)}
          </span>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${t.created_at?new Date(t.created_at).toLocaleDateString():"N/A"}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex flex-col space-y-3 min-w-[200px]">
            <select class="status-select w-full px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white bg-white transition-colors duration-200 ${A(t.status)}" 
                    onchange="updateAppointmentStatus(${t.id}, this.value)">
              <option value="pending" ${t.status==="pending"?"selected":""}>⏳ Pending</option>
              <option value="confirmed" ${t.status==="confirmed"?"selected":""}>✅ Confirmed</option>
              <option value="completed" ${t.status==="completed"?"selected":""}>🎯 Completed</option>
              <option value="cancelled" ${t.status==="cancelled"?"selected":""}>❌ Cancelled</option>
            </select>
            <button onclick="sendWhatsAppMessage(${t.id})" 
                    class="flex items-center justify-center space-x-2 w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Send WhatsApp</span>
            </button>
          </div>
        </td>
      </tr>
    `}).join(""),console.log("Appointments rendered successfully")}}function x(e){switch(e){case"pending":return"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";case"confirmed":return"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";case"completed":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";case"cancelled":return"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}}function w(e){switch(e){case"pending":return"⏳ Pending";case"confirmed":return"✅ Confirmed";case"completed":return"🎯 Completed";case"cancelled":return"❌ Cancelled";default:return e}}async function B(e,t){try{if(!h){console.error("Supabase client not initialized");return}const{error:s}=await h.from("appointments").update({status:t}).eq("id",e);if(s){console.error("Error updating status:",s),alert("Failed to update status");return}const o=c.find(n=>n.id===e);o&&(o.status=t),v(),y(),console.log(`Appointment ${e} status updated to ${t}`)}catch(s){console.error("Error in updateAppointmentStatus:",s),alert("Failed to update status")}}function I(e){p.has(e)?p.delete(e):p.add(e);const t=document.getElementById("selected-count");t&&(t.textContent=p.size)}function T(){const e=document.getElementById("select-all-checkbox"),t=document.querySelectorAll(".appointment-checkbox");e.checked?t.forEach(o=>{o.checked=!0,p.add(parseInt(o.value))}):(t.forEach(o=>{o.checked=!1}),p.clear());const s=document.getElementById("selected-count");s&&(s.textContent=p.size)}function P(e){const t=c.find(r=>r.id===e);if(!t)return;document.getElementById("whatsapp-modal").classList.remove("hidden");const o=document.getElementById("message-template-select"),n=document.getElementById("whatsapp-message-content");o.value=t.status||"pending",n.value=k(t,t.status||"pending"),window.currentWhatsAppAppointmentId=e}function k(e,t){const s=`Hello ${e.name||"there"},`;let o={};if(e.service_details)if(typeof e.service_details=="string")try{o=JSON.parse(e.service_details)}catch{o={}}else o=e.service_details;const n=Object.entries(o).map(([i,m])=>`${i}: ${m}`).join(`
`),r=e.date||e.preferred_date,a=e.time||e.preferred_time;switch(t){case"confirmed":return`${s}

Your appointment for ${e.service} has been confirmed!

📅 Date: ${r}
⏰ Time: ${a}

${n?`
Service Details:
${n}
`:""}Please arrive 10 minutes before your scheduled time.

If you need to reschedule, please contact us at least 24 hours in advance.

Thank you for choosing JyotirSetu! 🙏`;case"cancelled":return`${s}

Your appointment for ${e.service} scheduled for ${r} at ${a} has been cancelled.

${n?`
Service Details:
${n}
`:""}Please contact us to reschedule or if you have any questions.

We apologize for any inconvenience caused.`;case"completed":return`${s}

Thank you for your consultation with JyotirSetu!

${n?`
Service Details:
${n}
`:""}We hope your session was helpful and insightful.

Please feel free to reach out if you have any follow-up questions or need further assistance.

Best regards,
JyotirSetu Team 🙏`;case"reminder":return`${s}

This is a friendly reminder about your upcoming appointment:

🔮 Service: ${e.service}
📅 Date: ${r}
⏰ Time: ${a}

${n?`
Service Details:
${n}
`:""}Please arrive 10 minutes before your scheduled time.

If you need to reschedule, please contact us as soon as possible.

We look forward to seeing you! 🙏`;default:return`${s}

Thank you for booking your consultation with JyotirSetu!

${n?`
Service Details:
${n}
`:""}We will review your request and get back to you shortly with confirmation details.

If you have any urgent questions, please don't hesitate to contact us.

Best regards,
JyotirSetu Team 🙏`}}function D(){if(c.length===0){alert("No appointments to export");return}const e={astrologyConcern:"Astrology Concern",currentProfession:"Current Profession",dateOfBirth:"Date of Birth",birthTime:"Birth Time",birthPlace:"Place of Birth",wearingPurpose:"Wearing Purpose",wearingGemstone:"Currently Wearing Gemstone",palmistryFocusArea:"Palmistry Focus Area",handDominance:"Hand Dominance",specificConcerns:"Specific Concerns",person1Name:"Person 1 Name",person1Gender:"Person 1 Gender",person1DOB:"Person 1 DOB",person1TOB:"Person 1 TOB",person1POB:"Person 1 POB",person2Name:"Person 2 Name",person2Gender:"Person 2 Gender",person2DOB:"Person 2 DOB",person2TOB:"Person 2 TOB",person2POB:"Person 2 POB",officialName:"Official Name",commonName:"Common Name",gender:"Gender",numerologyFocusArea:"Numerology Focus Area",financialConcerns:"Financial Concerns",futureGoal:"Future Goal",companyName:"Company Name",businessType:"Business Type",employeeCount:"Employee Count",concernArea:"Concern Area",subjectTitle:"Subject Title",detailedConcern:"Detailed Concern"},t=["Name","Phone","Email","Service","Date","Time","Consultation Method","Message","Status","Created At"];Object.values(e).forEach(a=>{t.includes(a)||t.push(a)});const s=[t.join(","),...c.map(a=>{let i={};if(a.service_details)if(typeof a.service_details=="string")try{i=JSON.parse(a.service_details)}catch{i={}}else i=a.service_details;const m=[`"${a.name||""}"`,`"${a.phone||""}"`,`"${a.email||""}"`,`"${a.service||""}"`,`"${a.date||a.preferred_date||""}"`,`"${a.time||a.preferred_time||""}"`,`"${a.consultation_method||""}"`,`"${a.message||""}"`,`"${a.status||""}"`,`"${a.created_at||""}"`],f=Object.keys(e).map(u=>{let l="";return u==="palmistryFocusArea"&&i.focusArea||u==="numerologyFocusArea"&&i.focusArea?l=i.focusArea:l=i[u]||"",`"${l}"`});return[...m,...f].join(",")})].join(`
`),o=new Blob([s],{type:"text/csv;charset=utf-8;"}),n=document.createElement("a"),r=URL.createObjectURL(o);n.setAttribute("href",r),n.setAttribute("download",`appointments_${new Date().toISOString().split("T")[0]}.csv`),n.style.visibility="hidden",document.body.appendChild(n),n.click(),document.body.removeChild(n)}function W(){console.log("Setting up event listeners...");const e=document.getElementById("select-all-checkbox");e&&(e.addEventListener("change",T),console.log("Select all checkbox event listener added"));const t=document.getElementById("export-csv-btn");t&&(t.addEventListener("click",D),console.log("Export CSV button event listener added"));const s=document.getElementById("bulk-whatsapp-btn");s&&(s.addEventListener("click",()=>{if(p.size===0){alert("Please select at least one appointment to send WhatsApp messages");return}document.getElementById("whatsapp-modal").classList.remove("hidden"),M();const u=document.getElementById("whatsapp-message-content");u&&(u.value="Hello! This is JyotirSetu. We have an update regarding your appointment.");const l=document.createElement("div");l.className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4",l.innerHTML=`
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <h4 class="font-medium mb-1">📱 Bulk WhatsApp Instructions</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Each appointment will open in a separate WhatsApp tab</li>
              <li>Please allow popups for this website</li>
              <li>Send the message manually in each WhatsApp tab</li>
              <li>Keep this dashboard open during the process</li>
            </ul>
          </div>
        </div>
      `;const d=document.querySelector("#whatsapp-modal .p-6");if(d){const g=d.querySelector(".bg-blue-50");g&&g.remove(),d.insertBefore(l,d.firstChild)}}),console.log("Bulk WhatsApp button event listener added"));const o=document.getElementById("refresh-btn");o&&(o.addEventListener("click",b),console.log("Refresh button event listener added"));const n=document.getElementById("close-whatsapp-modal-btn");n&&(n.addEventListener("click",()=>{document.getElementById("whatsapp-modal").classList.add("hidden")}),console.log("WhatsApp modal close button event listener added"));const r=document.getElementById("send-whatsapp-btn");r&&(r.addEventListener("click",()=>{if(Array.from(p).length===0){alert("Please select at least one appointment");return}const d=document.getElementById("whatsapp-message-content").value.trim();if(!d){alert("Please enter a message to send");return}N(d)}),console.log("Send WhatsApp button event listener added"));const a=document.getElementById("preview-message-btn");a&&(a.addEventListener("click",()=>{const l=document.getElementById("whatsapp-message-content").value.trim();if(!l){alert("Please enter a message to preview");return}window.open("","_blank","width=400,height=600").document.write(`
        <html>
          <head>
            <title>WhatsApp Message Preview</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
              .preview { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #25D366; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
              .message { white-space: pre-wrap; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="preview">
              <div class="header">📱 WhatsApp Message Preview</div>
              <div class="message">${l}</div>
            </div>
          </body>
        </html>
      `)}),console.log("Preview message button event listener added"));const i=document.getElementById("message-template-select");i&&(i.addEventListener("change",function(){const u=this.value;if(u&&window.currentWhatsAppAppointmentId){const l=c.find(d=>d.id===window.currentWhatsAppAppointmentId);if(l){const d=document.getElementById("whatsapp-message-content");d.value=k(l,u)}}}),console.log("Message template select event listener added"));const m=document.getElementById("logout-btn");m&&(m.addEventListener("click",()=>{localStorage.removeItem("admin_email"),window.location.href="/admin"}),console.log("Logout button event listener added"));const f=document.getElementById("apply-filters-btn");f&&(f.addEventListener("click",L),console.log("Apply filters button event listener added")),console.log("All event listeners set up successfully")}function L(){const e=document.getElementById("status-filter").value,t=document.getElementById("service-filter").value,s=document.getElementById("date-from-filter").value,o=document.getElementById("date-to-filter").value;let n=[...c];e&&(n=n.filter(i=>i.status===e)),t&&(n=n.filter(i=>i.service===t)),s&&(n=n.filter(i=>i.date>=s)),o&&(n=n.filter(i=>i.date<=o));const r=document.getElementById("appointments-tbody");if(!r)return;if(n.length===0){r.innerHTML=`
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          No appointments match the selected filters
        </td>
      </tr>
    `;return}const a=c;c=n,y(),c=a}function M(){const t=Array.from(p).map(r=>c.find(a=>a.id===r)).filter(Boolean),s=document.querySelector("#whatsapp-modal h2"),o=document.querySelector("#whatsapp-modal p");s&&(s.textContent=`📱 Send WhatsApp Messages (${t.length} selected)`),o&&(o.textContent=`Send message to ${t.length} selected clients`);const n=document.getElementById("selected-appointments-list");n&&(n.classList.remove("hidden"),n.innerHTML=`
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Selected Appointments:</h3>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          ${t.map(r=>`
            <div class="flex items-center justify-between text-sm">
              <div>
                <span class="font-medium">${r.name}</span>
                <span class="text-gray-500"> - ${r.phone}</span>
                <span class="text-gray-400"> (${r.service})</span>
              </div>
              <span class="text-xs px-2 py-1 rounded-full ${x(r.status)}">
                ${w(r.status)}
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    `)}async function N(e){const s=Array.from(p).map(l=>c.find(d=>d.id===l)).filter(Boolean);if(s.length===0){alert("No appointments selected");return}const o=document.getElementById("send-whatsapp-btn");if(!o)return;const n=o.innerHTML;o.innerHTML="⏳ Sending...",o.disabled=!0;let r=0,a=0;const i=[];alert(`Starting to send WhatsApp messages to ${s.length} appointments.

IMPORTANT: Please allow popups for this site and keep the tab open.

Each message will open in a new WhatsApp tab. Please send the message manually in each tab.`);for(let l=0;l<s.length;l++){const d=s[l];if(d)try{o.innerHTML=`⏳ Sending ${l+1}/${s.length}...`,await F(d,e),r++,i.push({appointment:d,status:"success"}),console.log(`✅ Successfully opened WhatsApp for ${d.name}`),l<s.length-1&&(o.innerHTML="⏳ Waiting 2 seconds before next message...",await new Promise(g=>setTimeout(g,2e3)))}catch(g){a++,i.push({appointment:d,status:"failed",error:g.message}),console.error(`❌ Failed to send to ${d.name}:`,g),alert(`Failed to open WhatsApp for ${d.name} (${d.phone}).

Error: ${g.message}

Continuing with remaining appointments...`),await new Promise($=>setTimeout($,1e3))}}_(i,r,a),o.innerHTML=n,o.disabled=!1,p.clear();const m=document.getElementById("selected-count");m&&(m.textContent="0"),document.querySelectorAll(".appointment-checkbox").forEach(l=>{l instanceof HTMLInputElement&&(l.checked=!1)});const u=document.getElementById("select-all-checkbox");u instanceof HTMLInputElement&&(u.checked=!1),document.getElementById("whatsapp-modal").classList.add("hidden")}function F(e,t){return new Promise((s,o)=>{if(!e||!e.phone){o(new Error("No phone number found"));return}let n=e.phone.replace(/\D/g,"");if(n.length===10)n="91"+n;else if(n.length===12&&n.startsWith("91"))n=n;else if(n.length===11&&n.startsWith("91"))n=n;else if(n.length<10){o(new Error("Invalid phone number format"));return}const r=`https://wa.me/${n}?text=${encodeURIComponent(t)}`;try{const a=window.open(r,"_blank","width=600,height=700,scrollbars=yes,resizable=yes");if(a&&!a.closed)console.log(`WhatsApp opened for ${e.name} (${n})`),setTimeout(()=>{s()},1e3);else{console.warn(`Popup blocked for ${e.name}, trying alternative method`);try{window.location.href=r,setTimeout(()=>{s()},2e3)}catch{o(new Error("Failed to open WhatsApp: Popup blocked and fallback failed"))}}}catch(a){o(new Error(`Failed to open WhatsApp: ${a.message}`))}})}function _(e,t,s){let o=`WhatsApp messages sent successfully!

`;o+=`✅ Successfully sent: ${t}
`,s>0&&(o+=`❌ Failed to send: ${s}

`,o+=`Failed appointments:
`,e.filter(n=>n.status==="failed").forEach(n=>{o+=`• ${n.appointment.name} (${n.appointment.phone}): ${n.error}
`})),alert(o)}console.log("Appointment Dashboard loaded - basic structure ready");function A(e){switch(e){case"pending":return"text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700";case"confirmed":return"text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-700";case"completed":return"text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-700";case"cancelled":return"text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-700";default:return"text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-300 dark:bg-gray-900/20 dark:border-gray-700"}}window.sendWhatsAppMessage=P;window.toggleAppointmentSelection=I;window.updateAppointmentStatus=B;window.getStatusColor=A;function O(){console.log("Going back to admin dashboard..."),localStorage.getItem("admin_email")?(console.log("User is authenticated, navigating to admin dashboard"),window.location.href="/admin"):(console.log("User not authenticated, staying on current page"),alert("Session expired. Please login again."))}window.goBackToAdminDashboard=O;
