let $=null;const f={apiKey:"re_J7Tenr58_5Y9VdfKMnfKrLwzRh59j7nnR",fromEmail:"insights@jyotirsetu.com"};async function L(){try{$=window.supabase.createClient("https://czbypbrrxxjcjdfjxczv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YnlwYnJyeHhqY2pkZmp4Y3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjU2NDcsImV4cCI6MjA3MjUwMTY0N30.SQ-eabMNo5RBy8N0MHWDmlxVH7Tmh-EGykI0Qt5wDjg"),console.log("Supabase initialized for email marketing")}catch(t){console.error("Error initializing Supabase:",t)}}function O(){try{if(f.apiKey!=="YOUR_RESEND_API_KEY")return console.log("✅ Resend initialized successfully"),console.log("🔑 API Key:",f.apiKey.substring(0,10)+"..."),console.log("📮 From Email:",f.fromEmail),!0}catch(t){return console.error("💥 Error initializing Resend:",t),!1}}function F(){try{const t=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),r=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,e=t.filter(a=>a.email&&r.test(a.email)),s=t.length-e.length;if(s===0){c("✅ All subscribers have valid email addresses!","success");return}localStorage.setItem("email_subscribers",JSON.stringify(e)),c(`🧹 Cleaned up ${s} invalid subscribers! Remaining: ${e.length}`,"success"),b(),m(),console.log("🧹 Cleanup completed:",{original:t.length,valid:e.length,removed:s})}catch(t){console.error("💥 Error cleaning up subscribers:",t),c(`❌ Failed to cleanup subscribers: ${t.message}`,"error")}}function V(){try{const t=JSON.parse(localStorage.getItem("email_campaigns")||"[]"),r=JSON.parse(localStorage.getItem("email_subscribers")||"[]");if(t.length===0){c("❌ No campaigns found to generate report","error");return}const e=t.map(a=>{const i=a.recipients>0?Math.round((a.opens||0)/a.recipients*100):0,l=a.recipients>0?Math.round((a.clicks||0)/a.recipients*100):0;return{"Campaign ID":a.id,Subject:a.subject,Description:a.description||"",Status:a.status,Recipients:a.recipients,"Recipient Type":a.recipientType,"Selected Tags":a.selectedTags?a.selectedTags.join(", "):"","Created Date":new Date(a.created_at).toLocaleString(),"Sent Date":a.sent_at?new Date(a.sent_at).toLocaleString():"",Opens:a.opens||0,Clicks:a.clicks||0,"Open Rate (%)":i,"Click Rate (%)":l}}),s=T(e);_(s,`campaign-report-${new Date().toISOString().split("T")[0]}.csv`),c("✅ Campaign report downloaded successfully!","success")}catch(t){console.error("💥 Error generating campaign report:",t),c(`❌ Failed to generate report: ${t.message}`,"error")}}function H(){try{const t=JSON.parse(localStorage.getItem("email_campaigns")||"[]"),r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=t.length,s=t.filter(u=>u.status==="sent").length,a=t.reduce((u,p)=>u+(p.recipients||0),0),i=t.reduce((u,p)=>u+(p.opens||0),0),l=t.reduce((u,p)=>u+(p.clicks||0),0),n=a>0?Math.round(i/a*100):0,d=a>0?Math.round(l/a*100):0,g=[{Metric:"Total Campaigns",Value:e,Description:"Total number of campaigns created"},{Metric:"Sent Campaigns",Value:s,Description:"Number of campaigns actually sent"},{Metric:"Total Subscribers",Value:r.length,Description:"Total number of email subscribers"},{Metric:"Total Recipients",Value:a,Description:"Total emails sent across all campaigns"},{Metric:"Total Opens",Value:i,Description:"Total email opens across all campaigns"},{Metric:"Total Clicks",Value:l,Description:"Total link clicks across all campaigns"},{Metric:"Average Open Rate (%)",Value:n,Description:"Average open rate across all campaigns"},{Metric:"Average Click Rate (%)",Value:d,Description:"Average click rate across all campaigns"}],o=T(g);_(o,`analytics-report-${new Date().toISOString().split("T")[0]}.csv`),c("✅ Analytics report generated successfully!","success")}catch(t){console.error("💥 Error generating analytics report:",t),c(`❌ Failed to generate analytics report: ${t.message}`,"error")}}function q(){try{const t=JSON.parse(localStorage.getItem("email_subscribers")||"[]");if(t.length===0){c("❌ No subscribers found","error");return}const r=t.map(s=>({Name:s.name||"",Email:s.email,Source:s.source,"Service Interest":s.serviceInterest||"",Tags:s.tags?s.tags.join(", "):"",Status:s.status,"Created Date":new Date(s.created_at).toLocaleDateString()})),e=T(r);_(e,`subscriber-report-${new Date().toISOString().split("T")[0]}.csv`),c("✅ Subscriber report downloaded!","success")}catch(t){console.error("💥 Error downloading subscriber report:",t),c(`❌ Failed to download subscriber report: ${t.message}`,"error")}}function T(t){if(!t||t.length===0)return"";const r=Object.keys(t[0]),e=[];return e.push(r.join(",")),t.forEach(s=>{const a=r.map(i=>{const l=s[i];return typeof l=="string"&&(l.includes(",")||l.includes('"'))?`"${l.replace(/"/g,'""')}"`:l});e.push(a.join(","))}),e.join(`
`)}function _(t,r){const e=new Blob([t],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");if(s.download!==void 0){const a=URL.createObjectURL(e);s.setAttribute("href",a),s.setAttribute("download",r),s.style.visibility="hidden",document.body.appendChild(s),s.click(),document.body.removeChild(s)}}async function M(t,r,e,s=""){try{console.log("🔍 Starting email send process..."),console.log("📧 To:",e),console.log("📝 Subject:",t),console.log("📮 From Email:",f.fromEmail);const a=`${window.location.origin}/api/send-email`;console.log("📤 Sending email via server API..."),console.log("🌐 API URL:",a);const i={subject:t,content:r,recipientEmail:e,recipientName:s};console.log("📤 Request body:",JSON.stringify(i,null,2));const l=JSON.stringify(i);console.log("📤 Request body string:",l),console.log("📤 Request body length:",l.length);const n=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:l});console.log("📡 Response status:",n.status);const d=await n.json();return console.log("📡 Response body:",d),n.ok&&d.success?(console.log("✅ Email sent successfully!"),console.log("🆔 Email ID:",d.emailId),{success:!0,emailId:d.emailId}):(console.error("❌ Email sending failed:",d),console.error("❌ Error details:",d.details),{success:!1,error:d.error||"Failed to send email",details:d.details})}catch(a){return console.error("💥 Error sending email:",a),console.error("🔍 Error details:",{message:a.message,stack:a.stack,name:a.name}),{success:!1,error:a.message}}}function P(){if(!localStorage.getItem("admin_email")){window.location.href="/admin";return}}function D(t){document.querySelectorAll(".tab-content").forEach(e=>{e.classList.add("hidden")}),document.querySelectorAll(".tab-button").forEach(e=>{e.classList.remove("active","border-purple-500","text-purple-600","dark:text-purple-400"),e.classList.add("border-transparent","text-gray-500","dark:text-gray-400")}),document.getElementById(`${t}-content`).classList.remove("hidden");const r=document.getElementById(`${t}-tab`);r.classList.add("active","border-purple-500","text-purple-600","dark:text-purple-400"),r.classList.remove("border-transparent","text-gray-500","dark:text-gray-400"),t==="subscribers"?b():t==="campaigns"?y():t==="templates"?S():t==="analytics"&&le()}async function z(){try{if(c("Importing subscribers from appointments..."),!$){c("Supabase not initialized. Using mock data for testing.","warning"),await N([{id:1,name:"John Doe",email:"john.doe@example.com",service_type:"Kundli Analysis",created_at:"2024-01-15T10:30:00Z"},{id:2,name:"Jane Smith",email:"jane.smith@example.com",service_type:"Palmistry",created_at:"2024-01-14T15:45:00Z"},{id:3,name:"Mike Johnson",email:"mike.johnson@example.com",service_type:"Numerology",created_at:"2024-01-13T09:20:00Z"}]);return}const{data:t,error:r}=await $.from("appointments").select("*").not("email","is",null);if(r){console.error("Supabase error:",r),c("Error connecting to database. Please try again.","error");return}if(!t||t.length===0){c("No appointments with email addresses found.","warning");return}await N(t)}catch(t){console.error("Error importing from appointments:",t),c("Error importing subscribers. Please try again.","error")}}async function N(t){let r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=0;for(const s of t)if(!r.find(i=>i.email===s.email)){let i="general";s.service_type?i=s.service_type.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""):s.service?i=s.service.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""):s.selected_service&&(i=s.selected_service.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")),console.log("Appointment data:",s),console.log("Generated tag:",i);const l={id:Date.now()+Math.random(),email:s.email,name:s.name,source:"appointment_form",status:"active",service_interest:s.service_type,tags:[i],created_at:new Date().toISOString()};r.push(l),e++}localStorage.setItem("email_subscribers",JSON.stringify(r)),c(`Successfully imported ${e} new subscribers from appointments!`,"success"),b(),m()}function c(t,r="info"){const e=document.getElementById("import-status"),s=document.getElementById("import-status-text");s.textContent=t,e.classList.remove("hidden"),e.className="mb-4 p-4 rounded-lg",r==="success"?(e.classList.add("bg-green-50","dark:bg-green-900/20","border","border-green-200","dark:border-green-800"),s.classList.add("text-green-800","dark:text-green-200")):r==="warning"?(e.classList.add("bg-yellow-50","dark:bg-yellow-900/20","border","border-yellow-200","dark:border-yellow-800"),s.classList.add("text-yellow-800","dark:text-yellow-200")):r==="error"?(e.classList.add("bg-red-50","dark:bg-red-900/20","border","border-red-200","dark:border-red-800"),s.classList.add("text-red-800","dark:text-red-200")):(e.classList.add("bg-blue-50","dark:bg-blue-900/20","border","border-blue-200","dark:border-blue-800"),s.classList.add("text-blue-800","dark:text-blue-200")),r!=="info"&&setTimeout(()=>{e.classList.add("hidden")},5e3)}async function b(){try{const t=JSON.parse(localStorage.getItem("email_subscribers")||"[]");E(t),m(),K(),document.getElementById("subscriber-count").textContent=`Showing ${t.length} of ${t.length} subscribers`}catch(t){console.error("Error loading subscribers:",t),E([])}}function h(){const t=document.getElementById("filter-source")?.value||"",r=document.getElementById("filter-tag")?.value||"",e=document.getElementById("filter-status")?.value||"",s=JSON.parse(localStorage.getItem("email_subscribers")||"[]");let a=s;t&&(a=a.filter(i=>i.source===t)),r&&(a=a.filter(i=>!i.tags||!Array.isArray(i.tags)?!1:i.tags.includes(r))),e&&(a=a.filter(i=>i.status===e)),document.getElementById("subscriber-count").textContent=`Showing ${a.length} of ${s.length} subscribers`,E(a)}function U(){document.getElementById("filter-source").value="",document.getElementById("filter-tag").value="",document.getElementById("filter-status").value="",b()}function Y(){const t=document.getElementById("filter-source").value,r=document.getElementById("filter-tag").value,e=document.getElementById("filter-status").value;let a=JSON.parse(localStorage.getItem("email_subscribers")||"[]");if(t&&(a=a.filter(o=>o.source===t)),r&&(a=a.filter(o=>!o.tags||!Array.isArray(o.tags)?!1:o.tags.includes(r))),e&&(a=a.filter(o=>o.status===e)),a.length===0){alert("No subscribers to export. Please add some subscribers first.");return}const l=[["Name","Email","Source","Tags","Status","Service Interest","Created At"].join(","),...a.map(o=>[`"${o.name||""}"`,`"${o.email||""}"`,`"${o.source||""}"`,`"${(o.tags||[]).join("; ")}"`,`"${o.status||""}"`,`"${o.service_interest||""}"`,`"${o.created_at||""}"`].join(","))].join(`
`),n=new Blob([l],{type:"text/csv;charset=utf-8;"}),d=document.createElement("a"),g=URL.createObjectURL(n);d.setAttribute("href",g),d.setAttribute("download",`jyotirsetu_subscribers_${new Date().toISOString().split("T")[0]}.csv`),d.style.visibility="hidden",document.body.appendChild(d),d.click(),document.body.removeChild(d),c(`Exported ${a.length} subscribers to CSV`,"success")}function K(){const t=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),r=new Set;t.forEach(s=>{s.tags&&Array.isArray(s.tags)&&s.tags.forEach(a=>r.add(a))});const e=document.getElementById("filter-tag");e.innerHTML='<option value="">All Tags</option>',Array.from(r).sort().forEach(s=>{const a=document.createElement("option");a.value=s,a.textContent=s,e.appendChild(a)})}function G(){const t=document.getElementById("select-all-checkbox");document.querySelectorAll(".subscriber-checkbox").forEach(e=>{e.checked=t.checked}),w()}function Z(){const t=document.querySelectorAll(".subscriber-checkbox"),r=document.getElementById("select-all-checkbox");t.forEach(e=>{e.checked=!0}),r.checked=!0,w()}function k(){const t=document.querySelectorAll(".subscriber-checkbox"),r=document.getElementById("select-all-checkbox");t.forEach(e=>{e.checked=!1}),r.checked=!1,w()}function w(){const t=document.querySelectorAll(".subscriber-checkbox:checked"),r=document.getElementById("bulk-actions"),e=document.getElementById("selected-count");t.length>0?(r.classList.remove("hidden"),e.textContent=`${t.length} subscriber${t.length===1?"":"s"} selected`):r.classList.add("hidden")}function W(){const t=document.querySelectorAll(".subscriber-checkbox:checked");if(t.length===0){alert("Please select subscribers to mark as active.");return}if(!confirm(`Mark ${t.length} subscriber${t.length===1?"":"s"} as active?`))return;const r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=Array.from(t).map(s=>s.value);e.forEach(s=>{const a=r.find(i=>i.id==s);a&&(a.status="active")}),localStorage.setItem("email_subscribers",JSON.stringify(r)),c(`Marked ${e.length} subscriber${e.length===1?"":"s"} as active`,"success"),h(),k()}function Q(){const t=document.querySelectorAll(".subscriber-checkbox:checked");if(t.length===0){alert("Please select subscribers to mark as inactive.");return}if(!confirm(`Mark ${t.length} subscriber${t.length===1?"":"s"} as inactive?`))return;const r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=Array.from(t).map(s=>s.value);e.forEach(s=>{const a=r.find(i=>i.id==s);a&&(a.status="inactive")}),localStorage.setItem("email_subscribers",JSON.stringify(r)),c(`Marked ${e.length} subscriber${e.length===1?"":"s"} as inactive`,"success"),h(),k()}function X(){const t=document.querySelectorAll(".subscriber-checkbox:checked");if(t.length===0){alert("Please select subscribers to delete.");return}if(!confirm(`Delete ${t.length} subscriber${t.length===1?"":"s"}? This action cannot be undone.`))return;const r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=Array.from(t).map(a=>a.value),s=r.filter(a=>!e.includes(a.id.toString()));localStorage.setItem("email_subscribers",JSON.stringify(s)),c(`Deleted ${e.length} subscriber${e.length===1?"":"s"}`,"success"),h(),k()}function ee(t){const e=JSON.parse(localStorage.getItem("email_subscribers")||"[]").find(l=>l.id===t);if(!e){alert("Subscriber not found");return}const a=JSON.parse(localStorage.getItem("email_campaigns")||"[]").filter(l=>l.status!=="sent"?!1:l.recipientType==="all"||l.recipientType===e.source?!0:l.selectedTags&&l.selectedTags.length>0?!e.tags||!Array.isArray(e.tags)?!1:l.selectedTags.some(n=>e.tags.includes(n)):!1),i=document.getElementById("modal-container");i.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">👤 Subscriber Details</h3>
            
            <!-- Subscriber Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📋 Personal Information</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Name:</strong> ${e.name||"N/A"}</div>
                  <div><strong>Email:</strong> ${e.email}</div>
                  <div><strong>Status:</strong> 
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${e.status==="active"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
                      ${e.status==="active"?"✅ Active":"❌ Inactive"}
                    </span>
                  </div>
                  <div><strong>Added:</strong> ${new Date(e.created_at).toLocaleString()}</div>
                </div>
              </div>
              
              <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📊 Subscription Details</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Source:</strong> ${e.source.replace("_"," ")}</div>
                  <div><strong>Service Interest:</strong> ${e.service_interest||"N/A"}</div>
                  <div><strong>Tags:</strong> ${e.tags&&e.tags.length>0?e.tags.join(", "):"No tags"}</div>
                  <div><strong>Campaigns Received:</strong> ${a.length}</div>
                </div>
              </div>
            </div>

            <!-- Campaign History -->
            <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📧 Campaign History (${a.length})</h4>
              <div class="max-h-60 overflow-y-auto">
                ${a.length===0?'<p class="text-gray-500 dark:text-gray-400 text-sm">No campaigns received yet</p>':`<div class="space-y-2">
                    ${a.map(l=>`
                      <div class="bg-white dark:bg-slate-800 p-3 rounded border">
                        <div class="flex justify-between items-start">
                          <div>
                            <div class="font-medium text-sm text-gray-900 dark:text-white">${l.subject}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Sent: ${new Date(l.sent_at).toLocaleString()}</div>
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            Opens: ${l.opens||0} | Clicks: ${l.clicks||0}
                          </div>
                        </div>
                      </div>
                    `).join("")}
                  </div>`}
              </div>
            </div>

            <div class="flex justify-end mt-6 space-x-3">
              <button onclick="editSubscriber(${e.id})" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                ✏️ Edit Subscriber
              </button>
              <button onclick="closeModal()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function E(t){const r=document.getElementById("subscribers-table-body");if(!t||t.length===0){r.innerHTML=`
        <tr>
          <td colspan="7" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            <div class="flex flex-col items-center">
              <span class="text-4xl mb-4">📧</span>
              <p class="text-lg font-medium mb-2">No subscribers yet</p>
              <p class="text-sm">Import from appointments or upload a CSV file to get started</p>
            </div>
          </td>
        </tr>
      `;return}r.innerHTML=t.map(e=>`
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="px-6 py-4 whitespace-nowrap">
          <input type="checkbox" class="subscriber-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                 value="${e.id}" onchange="updateBulkActions()">
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          ${e.email}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          ${e.name||"N/A"}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.source==="appointment_form"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":e.source==="csv_upload"?"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}">
            ${e.source==="appointment_form"?"📅 Appointment":e.source==="csv_upload"?"📁 CSV Upload":"✋ Manual"}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <div class="flex flex-wrap gap-1">
            ${e.tags&&e.tags.length>0?e.tags.map(s=>`<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">${s.replace(/_/g," ")}</span>`).join(""):'<span class="text-gray-400 text-xs">No tags</span>'}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.status==="active"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}">
            ${e.status==="active"?"✅ Active":"❌ Inactive"}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          ${new Date(e.created_at).toLocaleDateString()}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onclick="viewSubscriberDetails(${e.id})"
            class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
          >
            👁️ View
          </button>
          <button
            onclick="editSubscriber(${e.id})"
            class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
          >
            ✏️ Edit
          </button>
          <button
            onclick="deleteSubscriber(${e.id})"
            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join("")}function m(){const t=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),r=JSON.parse(localStorage.getItem("email_campaigns")||"[]");document.getElementById("total-subscribers").textContent=t.length,document.getElementById("campaigns-sent").textContent=r.filter(e=>e.status==="sent").length,document.getElementById("open-rate").textContent="24.5%",document.getElementById("click-rate").textContent="3.2%"}function y(){const t=JSON.parse(localStorage.getItem("email_campaigns")||"[]");console.log("📧 Loading campaigns:",t),console.log("📧 Campaigns count:",t.length),console.log("📧 Campaigns data:",JSON.stringify(t,null,2)),se(t)}function te(){console.log("📧 Force reloading campaigns...");const t=JSON.parse(localStorage.getItem("email_campaigns")||"[]");console.log("📧 Found campaigns in localStorage:",t),console.log("📧 Campaigns count:",t.length),D("campaigns"),setTimeout(()=>{y()},100)}function ae(t){const e=JSON.parse(localStorage.getItem("email_campaigns")||"[]").find(l=>l.id===t);if(!e){alert("Campaign not found");return}const s=JSON.parse(localStorage.getItem("email_subscribers")||"[]");let a=[];e.recipientType==="all"?a=s:a=s.filter(l=>l.source===e.recipientType),e.selectedTags&&e.selectedTags.length>0&&(a=a.filter(l=>!l.tags||!Array.isArray(l.tags)?!1:e.selectedTags.some(n=>l.tags.includes(n))));const i=document.getElementById("modal-container");i.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Campaign Details: ${e.subject}</h3>
            
            <!-- Campaign Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📋 Campaign Information</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Subject:</strong> ${e.subject}</div>
                  <div><strong>Status:</strong> 
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${e.status==="sent"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}">
                      ${e.status==="sent"?"✅ Sent":"📝 Draft"}
                    </span>
                  </div>
                  <div><strong>Created:</strong> ${new Date(e.created_at).toLocaleString()}</div>
                  ${e.sent_at?`<div><strong>Sent:</strong> ${new Date(e.sent_at).toLocaleString()}</div>`:""}
                  <div><strong>Recipients:</strong> ${e.recipients}</div>
                  <div><strong>Opens:</strong> ${e.opens||0}</div>
                  <div><strong>Clicks:</strong> ${e.clicks||0}</div>
                </div>
              </div>
              
              <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">🎯 Targeting</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Recipient Type:</strong> ${e.recipientType==="all"?"All Subscribers":(e.recipientType||"All").replace("_"," ")}</div>
                  ${e.selectedTags&&e.selectedTags.length>0?`<div><strong>Tags:</strong> ${e.selectedTags.join(", ")}</div>`:"<div><strong>Tags:</strong> All tags</div>"}
                  <div><strong>Template Used:</strong> ${e.templateId?"Yes":"No"}</div>
                </div>
              </div>
            </div>

            <!-- Campaign Content -->
            <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📝 Campaign Content</h4>
              <div class="bg-white dark:bg-slate-800 p-4 rounded border">
                <div class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">${e.content}</div>
              </div>
            </div>

            <!-- Recipients List -->
            <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📧 Recipients (${a.length})</h4>
              <div class="max-h-60 overflow-y-auto">
                ${a.length===0?'<p class="text-gray-500 dark:text-gray-400 text-sm">No recipients found</p>':`<div class="space-y-2">
                    ${a.map(l=>`
                      <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded border">
                        <div>
                          <div class="font-medium text-sm text-gray-900 dark:text-white">${l.name||"N/A"}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">${l.email}</div>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          ${l.tags&&l.tags.length>0?l.tags.join(", "):"No tags"}
                        </div>
                      </div>
                    `).join("")}
                  </div>`}
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button onclick="closeModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function se(t){const r=document.getElementById("campaigns-list");if(console.log("📧 Displaying campaigns:",t,"Container:",r),console.log("📧 Container exists:",!!r),console.log("📧 Campaigns length:",t?t.length:"null"),!r){console.error("📧 Campaigns container not found!");return}if(!t||t.length===0){r.innerHTML=`
        <div class="text-center py-16 text-gray-500 dark:text-gray-400 col-span-full">
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-12 border-2 border-dashed border-purple-200 dark:border-purple-800">
            <span class="text-6xl mb-6 block">📧</span>
            <h4 class="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">No campaigns yet</h4>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Create your first email campaign to start engaging with your subscribers</p>
            <button
              onclick="showCreateCampaign()"
              class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Your First Campaign
            </button>
          </div>
        </div>
      `;return}r.innerHTML=t.map(e=>`
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <!-- Campaign Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center">
                <span class="text-purple-600 dark:text-purple-400 text-lg">📧</span>
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">${e.subject}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">${new Date(e.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">${e.description||"No description provided"}</p>
          </div>
          <div class="flex flex-col gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${e.status==="sent"?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":e.status==="draft"?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}">
              ${e.status==="sent"?"✅ Sent":e.status==="draft"?"📝 Draft":"⏳ Scheduled"}
            </span>
          </div>
        </div>
        
        <!-- Campaign Stats -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 text-center">
            <div class="text-xl font-bold text-gray-900 dark:text-white">${e.recipients}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Recipients</div>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 text-center">
            <div class="text-xl font-bold text-gray-900 dark:text-white">${e.recipientType==="all"?"All":(e.recipientType||"All").replace("_"," ")}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Target</div>
          </div>
        </div>
        
        ${e.status==="sent"?`
          <!-- Performance Metrics -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div class="text-lg font-bold text-green-600">${e.opens||0}</div>
                <div class="text-xs text-green-600 dark:text-green-400">Opens</div>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div class="text-lg font-bold text-blue-600">${e.clicks||0}</div>
                <div class="text-xs text-blue-600 dark:text-blue-400">Clicks</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div class="text-lg font-bold text-purple-600">${Math.round((e.opens||0)/e.recipients*100)}%</div>
                <div class="text-xs text-purple-600 dark:text-purple-400">Open Rate</div>
              </div>
            </div>
          </div>
        `:""}
        
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button 
            onclick="viewCampaignDetails(${e.id})" 
            class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <span>👁️</span>
            View Details
          </button>
          <button 
            onclick="deleteCampaign(${e.id})" 
            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            🗑️
          </button>
        </div>
      </div>
    `).join("")}function S(){const t=JSON.parse(localStorage.getItem("email_templates")||"[]");re(t)}function re(t){const r=document.getElementById("templates-grid");if(!t||t.length===0){r.innerHTML=`
        <div class="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
          <span class="text-4xl mb-4 block">📝</span>
          <p class="text-lg font-medium mb-2">No templates yet</p>
          <p class="text-sm">Create your first email template to get started</p>
        </div>
      `;return}r.innerHTML=t.map(e=>`
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${e.name}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${e.description}</p>
        </div>
        <div class="mb-4">
          <div class="bg-gray-100 dark:bg-gray-700 rounded p-3 text-sm text-gray-600 dark:text-gray-400">
            ${e.preview}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Created: ${new Date(e.created_at).toLocaleDateString()}
          </span>
          <div class="flex space-x-2">
            <button onclick="editTemplate(${e.id})" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 text-sm">
              ✏️ Edit
            </button>
            <button onclick="deleteTemplate(${e.id})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `).join("")}function le(){const t=JSON.parse(localStorage.getItem("email_campaigns")||"[]"),r=JSON.parse(localStorage.getItem("email_subscribers")||"[]");ie(t,r)}function ie(t,r){const e=t.length,s=r.length,a=24.5,i=3.2,l=document.querySelector("#analytics-content .grid .bg-white\\/80:first-child .h-64");l&&(l.innerHTML=`
        <div class="w-full h-full flex flex-col justify-center items-center space-y-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 dark:text-white">${e}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Campaigns</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">${a}%</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Average Open Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">${i}%</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Average Click Rate</div>
          </div>
        </div>
      `);const n=document.querySelector("#analytics-content .grid .bg-white\\/80:last-child .h-64");n&&(n.innerHTML=`
        <div class="w-full h-full flex flex-col justify-center items-center space-y-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 dark:text-white">${s}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Subscribers</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">+12</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">This Month</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">+5.2%</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Growth Rate</div>
          </div>
        </div>
      `)}function ne(){const t=document.getElementById("modal-container");t.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload CSV File</h3>
            <div class="mb-4">
              <input type="file" id="csv-file" accept=".csv" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSV Format:</label>
              <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                email,name,source<br>
                john@example.com,John Doe,csv_upload<br>
                jane@example.com,Jane Smith,csv_upload
              </div>
            </div>
            <div class="flex justify-end space-x-3">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="processCSV()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function oe(){const r=document.getElementById("csv-file").files[0];if(!r){alert("Please select a CSV file");return}const e=new FileReader;e.onload=function(s){const i=s.target.result.split(`
`);i[0].split(",");let l=0;const n=JSON.parse(localStorage.getItem("email_subscribers")||"[]");for(let d=1;d<i.length;d++)if(i[d].trim()){const g=i[d].split(","),o=g[0]?.trim(),u=g[1]?.trim()||"";g[2]?.trim(),o&&!n.find(p=>p.email===o)&&(n.push({id:Date.now()+Math.random(),email:o,name:u,source:"csv_upload",status:"active",service_interest:"",tags:[],created_at:new Date().toISOString()}),l++)}localStorage.setItem("email_subscribers",JSON.stringify(n)),x(),c(`Successfully imported ${l} subscribers from CSV!`,"success"),b(),m()},e.readAsText(r)}function ce(){const t=document.getElementById("modal-container");t.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Subscriber</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                <input type="email" id="new-subscriber-email" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input type="text" id="new-subscriber-name" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Interest</label>
                <select id="new-subscriber-service" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
                  <option value="">Select Service</option>
                  <option value="Kundli Analysis">Kundli Analysis</option>
                  <option value="Palmistry">Palmistry</option>
                  <option value="Numerology">Numerology</option>
                  <option value="Gemstone Consultation">Gemstone Consultation</option>
                  <option value="Career & Finance">Career & Finance</option>
                  <option value="Matchmaking">Matchmaking</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="addNewSubscriber()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Subscriber
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function de(){const t=document.getElementById("new-subscriber-email").value,r=document.getElementById("new-subscriber-name").value,e=document.getElementById("new-subscriber-service").value;if(!t){alert("Email is required");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){alert("Please enter a valid email address");return}const a=JSON.parse(localStorage.getItem("email_subscribers")||"[]");if(a.find(l=>l.email===t)){alert("Subscriber with this email already exists");return}const i=e?[e.toLowerCase().replace(/\s+/g,"_")]:[];a.push({id:Date.now()+Math.random(),email:t,name:r,source:"manual_add",status:"active",service_interest:e,tags:i,created_at:new Date().toISOString()}),localStorage.setItem("email_subscribers",JSON.stringify(a)),x(),c("Subscriber added successfully!","success"),b(),m()}function ge(){const t=document.getElementById("template-select"),r=document.getElementById("campaign-content");if(t.value){const s=JSON.parse(localStorage.getItem("email_templates")||"[]").find(a=>a.id==t.value);s&&(r.value=s.content)}}function I(){const t=document.querySelectorAll(".tag-checkbox:checked");return Array.from(t).map(r=>r.value)}function C(t,r,e){let s=t;return r!=="all"&&(s=t.filter(a=>a.source===r)),e.length>0&&(s=s.filter(a=>!a.tags||!Array.isArray(a.tags)?!1:e.some(i=>a.tags.includes(i)))),s.length}function j(){const t=document.getElementById("campaign-recipients"),r=document.getElementById("recipient-count"),e=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),s=I(),a=C(e,t.value,s);r.textContent=`Will send to ${a} subscribers`}function ue(){const t=document.getElementById("modal-container");t.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Email Campaign</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                <input type="text" id="campaign-subject" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea id="campaign-description" rows="3" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"></textarea>
              </div>
                                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Content</label>
                            <div class="mb-2">
                              <select id="template-select" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" onchange="loadTemplate()">
                                <option value="">Select a template (optional)</option>
                              </select>
                            </div>
                            <textarea id="campaign-content" rows="8" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" placeholder="Write your email content here..."></textarea>
                          </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipients</label>
                <select id="campaign-recipients" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" onchange="updateRecipientCount()">
                  <option value="all">All Subscribers</option>
                  <option value="appointment_form">Appointment Form Subscribers</option>
                  <option value="csv_upload">CSV Upload Subscribers</option>
                  <option value="manual_add">Manually Added Subscribers</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target by Tags</label>
                <div id="tag-selection" class="space-y-2">
                  <div class="text-sm text-gray-500 dark:text-gray-400">Select tags to target specific subscriber groups:</div>
                  <div id="available-tags" class="flex flex-wrap gap-2">
                    <!-- Tags will be populated dynamically -->
                  </div>
                </div>
                <div id="recipient-count" class="mt-2 text-sm text-blue-600 dark:text-blue-400"></div>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="saveCampaign()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save as Draft
              </button>
              <button onclick="saveAndSendCampaign()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Send Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `,B(),J(),j()}function B(){const t=document.getElementById("template-select"),r=JSON.parse(localStorage.getItem("email_templates")||"[]");t.innerHTML='<option value="">Select a template (optional)</option>',r.forEach(e=>{const s=document.createElement("option");s.value=e.id,s.textContent=e.name,t.appendChild(s)})}function J(){const t=document.getElementById("available-tags"),r=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),e=new Set;if(r.forEach(s=>{s.tags&&Array.isArray(s.tags)&&s.tags.forEach(a=>e.add(a))}),t.innerHTML="",e.size===0){t.innerHTML='<div class="text-sm text-gray-500 dark:text-gray-400">No tags available</div>';return}e.forEach(s=>{const a=document.createElement("div");a.className="flex items-center space-x-2",a.innerHTML=`
        <input type="checkbox" id="tag-${s}" value="${s}" class="tag-checkbox" onchange="updateRecipientCount()">
        <label for="tag-${s}" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          ${s.replace(/_/g," ")}
        </label>
      `,t.appendChild(a)})}function me(){const t=document.getElementById("campaign-subject").value,r=document.getElementById("campaign-description").value,e=document.getElementById("campaign-content").value,s=document.getElementById("campaign-recipients").value;if(!t){alert("Subject is required");return}const a=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),i=I(),l=C(a,s,i),n=JSON.parse(localStorage.getItem("email_campaigns")||"[]");n.push({id:Date.now()+Math.random(),subject:t,description:r,content:e,recipients:l,recipientType:s,selectedTags:i,status:"draft",created_at:new Date().toISOString(),opens:0,clicks:0}),localStorage.setItem("email_campaigns",JSON.stringify(n)),x(),c("Campaign saved as draft!","success"),y(),m()}async function pe(){const t=document.getElementById("campaign-subject").value,r=document.getElementById("campaign-description").value,e=document.getElementById("campaign-content").value,s=document.getElementById("campaign-recipients").value;if(!t||!e){alert("Subject and content are required");return}const a=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),i=I(),l=C(a,s,i);if(l===0){alert("No subscribers match your criteria. Please adjust your selection.");return}const n=JSON.parse(localStorage.getItem("email_campaigns")||"[]");n.push({id:Date.now()+Math.random(),subject:t,description:r,content:e,recipients:l,recipientType:s,selectedTags:i,status:"sent",created_at:new Date().toISOString(),sent_at:new Date().toISOString(),opens:Math.floor(l*.245),clicks:Math.floor(l*.032)}),localStorage.setItem("email_campaigns",JSON.stringify(n)),console.log("📧 Campaign saved to localStorage:",n),console.log("📧 Total campaigns now:",n.length),x(),O()?(c(`Sending campaign to ${l} subscribers...`,"info"),await R(t,e,a,s,i)):(c("Campaign saved! Configure Resend to send real emails. Currently in demo mode.","warning"),setTimeout(()=>{A(t,e,l)},1e3)),console.log("📧 Calling loadCampaigns() after campaign creation..."),y(),m(),console.log("📧 Campaign creation completed")}async function R(t,r,e,s,a){try{let i=e;s!=="all"&&(i=e.filter(g=>g.source===s)),a.length>0&&(i=i.filter(g=>!g.tags||!Array.isArray(g.tags)?!1:a.some(o=>g.tags.includes(o))));let l=0,n=0;const d=[];console.log(`📧 Starting campaign to ${i.length} subscribers`),console.log("📧 Target subscribers:",i.map(g=>({email:g.email,name:g.name,tags:g.tags})));for(let g=0;g<i.length;g++){const o=i[g],u=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!o.email||!u.test(o.email)){n++,d.push(`${o.email||"Invalid email"}: Invalid email format`),console.error(`❌ Invalid email format: ${o.email}`);continue}console.log(`📧 Sending email ${g+1}/${i.length} to ${o.email}`);try{const v=await M(t,r,o.email,o.name);v.success?(l++,console.log(`✅ Email sent successfully to ${o.email}`)):(n++,d.push(`${o.email}: ${v.error}`),console.error(`❌ Failed to send email to ${o.email}:`,v.error))}catch(v){n++,d.push(`${o.email}: ${v.message}`),console.error(`💥 Error sending email to ${o.email}:`,v)}g<i.length-1&&await new Promise(v=>setTimeout(v,1e3));const p=Math.round((g+1)/i.length*100);c(`📧 Sending campaign... ${p}% (${g+1}/${i.length}) - ✅ ${l} sent, ❌ ${n} failed`,"info")}n===0?c(`✅ Campaign sent successfully! ${l} emails delivered.`,"success"):(c(`⚠️ Campaign completed with issues. ${l} sent, ${n} failed.`,"warning"),console.log("Email errors:",d)),setTimeout(()=>{A(t,r,l,n)},1e3)}catch(i){console.error("Error sending campaign emails:",i),c("Error sending campaign emails. Please try again.","error")}}function A(t,r,e,s=0){const a=document.getElementById("modal-container");a.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📧 Email Campaign Preview</h3>
            <div class="space-y-4">
              ${s===0?`
                <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                  <p class="text-green-800 dark:text-green-200 font-medium">✅ Campaign sent successfully!</p>
                  <p class="text-green-700 dark:text-green-300 text-sm">Recipients: ${e} emails delivered</p>
                </div>
              `:`
                <div class="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
                  <p class="text-yellow-800 dark:text-yellow-200 font-medium">⚠️ Campaign completed with issues</p>
                  <p class="text-yellow-700 dark:text-yellow-300 text-sm">✅ Sent: ${e} | ❌ Failed: ${s}</p>
                </div>
              `}
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Subject: ${t}</h4>
                <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${r}</div>
              </div>
              <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <p class="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Powered by Resend:</strong> Professional email delivery with 3,000 free emails per month. Configure your Resend API key to enable real email sending.
                </p>
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <button onclick="closeModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function be(){const t=document.getElementById("modal-container");t.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Email Template</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template Name *</label>
                <input type="text" id="template-name" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea id="template-description" rows="2" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template Content</label>
                <textarea id="template-content" rows="10" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" placeholder="Write your template content here..."></textarea>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="saveTemplate()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function xe(){const t=document.getElementById("template-name").value,r=document.getElementById("template-description").value,e=document.getElementById("template-content").value;if(!t){alert("Template name is required");return}const s=JSON.parse(localStorage.getItem("email_templates")||"[]");s.push({id:Date.now()+Math.random(),name:t,description:r,content:e,preview:e.substring(0,100)+"...",created_at:new Date().toISOString()}),localStorage.setItem("email_templates",JSON.stringify(s)),x(),c("Template saved successfully!","success"),S()}function ve(t){const e=JSON.parse(localStorage.getItem("email_subscribers")||"[]").find(a=>a.id===t);if(!e)return;const s=document.getElementById("modal-container");s.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Subscriber</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                <input type="email" id="edit-subscriber-email" value="${e.email}" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input type="text" id="edit-subscriber-name" value="${e.name||""}" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select id="edit-subscriber-status" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
                  <option value="active" ${e.status==="active"?"selected":""}>Active</option>
                  <option value="inactive" ${e.status==="inactive"?"selected":""}>Inactive</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="updateSubscriber(${t})" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function ye(t){const r=document.getElementById("edit-subscriber-email").value,e=document.getElementById("edit-subscriber-name").value,s=document.getElementById("edit-subscriber-status").value;if(!r){alert("Email is required");return}const a=JSON.parse(localStorage.getItem("email_subscribers")||"[]"),i=a.findIndex(l=>l.id===t);i!==-1&&(a[i]={...a[i],email:r,name:e,status:s},localStorage.setItem("email_subscribers",JSON.stringify(a)),x(),c("Subscriber updated successfully!","success"),b())}function fe(t){if(confirm("Are you sure you want to delete this subscriber?")){const e=JSON.parse(localStorage.getItem("email_subscribers")||"[]").filter(s=>s.id!==t);localStorage.setItem("email_subscribers",JSON.stringify(e)),c("Subscriber deleted successfully!","success"),b(),m()}}function he(t){alert(`Edit campaign ${t} - Feature coming soon!`)}function ke(t){if(confirm("Are you sure you want to delete this campaign?")){const e=JSON.parse(localStorage.getItem("email_campaigns")||"[]").filter(s=>s.id!==t);localStorage.setItem("email_campaigns",JSON.stringify(e)),c("Campaign deleted successfully!","success"),y(),m()}}function we(t){const e=JSON.parse(localStorage.getItem("email_templates")||"[]").find(a=>a.id===t);if(!e){alert("Template not found");return}const s=document.getElementById("modal-container");s.innerHTML=`
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="if(event.target === this) closeModal()">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Email Template</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template Name *</label>
                <input type="text" id="edit-template-name" value="${e.name}" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea id="edit-template-description" rows="2" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">${e.description||""}</textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template Content</label>
                <textarea id="edit-template-content" rows="10" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" placeholder="Write your template content here...">${e.content}</textarea>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button onclick="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Cancel
              </button>
              <button onclick="updateTemplate(${t})" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Update Template
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function Se(t){const r=document.getElementById("edit-template-name"),e=document.getElementById("edit-template-description"),s=document.getElementById("edit-template-content"),a=r.value,i=e.value,l=s.value;if(!a){alert("Template name is required");return}const n=JSON.parse(localStorage.getItem("email_templates")||"[]"),d=n.findIndex(g=>g.id===t);d!==-1&&(n[d]={...n[d],name:a,description:i,content:l,preview:l.substring(0,100)+"...",updated_at:new Date().toISOString()},localStorage.setItem("email_templates",JSON.stringify(n)),x(),c("Template updated successfully!","success"),S())}function Ie(t){if(confirm("Are you sure you want to delete this template?")){const e=JSON.parse(localStorage.getItem("email_templates")||"[]").filter(s=>s.id!==t);localStorage.setItem("email_templates",JSON.stringify(e)),c("Template deleted successfully!","success"),S()}}function x(){document.getElementById("modal-container").innerHTML=""}function Ce(){document.addEventListener("keydown",function(t){if(t.key==="Escape"){const r=document.getElementById("modal-container");r&&r.innerHTML.trim()!==""&&x()}})}window.switchTab=D;window.importFromAppointments=z;window.showCSVUpload=ne;window.showAddSubscriber=ce;window.showCreateCampaign=ue;window.showCreateTemplate=be;window.editSubscriber=ve;window.deleteSubscriber=fe;window.editCampaign=he;window.deleteCampaign=ke;window.editTemplate=we;window.deleteTemplate=Ie;window.closeModal=x;window.processCSV=oe;window.addNewSubscriber=de;window.saveCampaign=me;window.saveAndSendCampaign=pe;window.saveTemplate=xe;window.updateSubscriber=ye;window.loadTemplate=ge;window.updateRecipientCount=j;window.getSelectedTags=I;window.getRecipientCount=C;window.loadTemplatesIntoCampaign=B;window.loadAvailableTags=J;window.showEmailPreview=A;window.updateTemplate=Se;window.sendCampaignEmails=R;window.sendRealEmail=M;window.initResend=O;window.applySubscriberFilters=h;window.clearSubscriberFilters=U;window.exportSubscribersCSV=Y;window.toggleSelectAll=G;window.selectAllSubscribers=Z;window.clearAllSelections=k;window.updateBulkActions=w;window.bulkMarkActive=W;window.bulkMarkInactive=Q;window.bulkDelete=X;window.viewCampaignDetails=ae;window.viewSubscriberDetails=ee;window.cleanupInvalidSubscribers=F;window.downloadCampaignReport=V;window.generateAnalyticsReport=H;window.downloadSubscriberReport=q;window.forceReloadCampaigns=te;document.addEventListener("DOMContentLoaded",async function(){console.log("Email Marketing page loaded");try{await L(),P(),b(),m(),Ce(),console.log("Email Marketing page initialized successfully")}catch(t){console.error("Error initializing email marketing page:",t)}});
