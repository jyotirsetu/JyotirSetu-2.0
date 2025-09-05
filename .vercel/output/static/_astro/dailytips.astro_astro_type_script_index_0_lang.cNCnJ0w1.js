let l,o=[];window.goBackToAdminDashboard=u;window.refreshTips=f;function g(){try{return l=window.supabase.createClient("https://czbypbrrxxjcjdfjxczv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YnlwYnJyeHhqY2pkZmp4Y3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjU2NDcsImV4cCI6MjA3MjUwMTY0N30.SQ-eabMNo5RBy8N0MHWDmlxVH7Tmh-EGykI0Qt5wDjg"),console.log("Supabase initialized successfully"),!0}catch(t){return console.error("Error creating Supabase client:",t),!1}}function u(){console.log("Going back to admin dashboard..."),localStorage.getItem("admin_email")?(console.log("User is authenticated, navigating to admin dashboard"),window.location.href="/admin"):(console.log("User not authenticated, staying on current page"),alert("Session expired. Please login again."))}async function d(){try{console.log("Loading tips from Supabase...");const{data:t,error:n}=await l.from("daily_tips").select("*").order("created_at",{ascending:!1});n?(console.error("Supabase error:",n),o.length===0&&(o=[{id:1,title:"Moon in Aries",content:"Today's energy is perfect for new beginnings and taking bold actions.",category:"Zodiac",date:new Date().toISOString().split("T")[0],active:!0},{id:2,title:"Mercury Retrograde",content:"Communication may be challenging. Double-check all messages and contracts.",category:"Planets",date:new Date(Date.now()-864e5).toISOString().split("T")[0],active:!0}])):(console.log("Tips loaded from Supabase:",t),o=t||[]),console.log("Displaying tips from array:",o),p(o),m()}catch(t){console.error("Error loading tips:",t),c("Error loading tips","error")}}function p(t){const n=document.getElementById("existing-tips");if(n){if(!t||t.length===0){n.innerHTML=`
      <div class="text-center text-gray-500 dark:text-gray-400 py-8">
        <span class="text-4xl">✨</span>
        <p class="mt-2">No tips created yet</p>
        <p class="text-sm mt-1">Create your first daily tip above!</p>
      </div>
    `;return}n.innerHTML=t.map(e=>`
    <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${e.title}</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-3">${e.content}</p>
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              ${e.category}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">${e.date}</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${e.active?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}">
              ${e.active?"Active":"Inactive"}
            </span>
          </div>
        </div>
        <div class="flex space-x-2 ml-4">
          <button
            onclick="editTip(${e.id})"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            ✏️ Edit
          </button>
          <button
            onclick="deleteTip(${e.id})"
            class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  `).join("")}}function m(){const t=o.length,n=o.filter(s=>s.active).length,e=new Set(o.map(s=>s.category)).size,i=document.getElementById("total-tips-count"),a=document.getElementById("active-tips-count"),r=document.getElementById("categories-count");i&&(i.textContent=t.toString()),a&&(a.textContent=n.toString()),r&&(r.textContent=e.toString())}async function y(t){t.preventDefault(),console.log("Tip form submitted!");const n=document.getElementById("tip-title"),e=document.getElementById("tip-category"),i=document.getElementById("tip-content");if(!n||!e||!i){console.log("Missing inputs, returning");return}const a={id:Date.now(),title:n.value,content:i.value,category:e.value,date:new Date().toISOString().split("T")[0],active:!0};console.log("New tip object:",a);try{console.log("Creating new tip:",a);const{data:r,error:s}=await l.from("daily_tips").insert([{title:a.title,content:a.content,category:a.category,date:a.date,active:a.active}]).select().single();if(s){console.error("Supabase insert error:",s),c("Error saving tip to database: "+s.message,"error");return}console.log("Tip saved to Supabase:",r),o.unshift(r),console.log("Tip added to array, total tips:",o.length),c("Tip created and saved successfully!","success"),await d(),b()}catch(r){console.error("Error creating tip:",r),c("Error creating tip","error")}}function b(){const t=document.getElementById("tip-title"),n=document.getElementById("tip-category"),e=document.getElementById("tip-content");t&&(t.value=""),n&&(n.value=""),e&&(e.value="")}function f(){d(),c("Tips refreshed!","info")}function c(t,n){const e=document.createElement("div");e.className=`fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-[999999] ${n==="success"?"bg-green-500":n==="error"?"bg-red-500":n==="info"?"bg-blue-500":"bg-gray-500"}`,e.textContent=t,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}document.addEventListener("DOMContentLoaded",async function(){console.log("Daily Tips Manager - DOM Content Loaded");try{if(!g()){console.error("Supabase initialization failed");return}const n=localStorage.getItem("admin_email"),e=document.getElementById("admin-email");e&&n&&(e.textContent=`Welcome, ${n}`);const i=document.getElementById("tip-form");i&&i.addEventListener("submit",y);const a=document.getElementById("logout-btn");a&&a.addEventListener("click",function(){localStorage.removeItem("admin_email"),localStorage.removeItem("admin_username"),window.location.href="/admin"}),await d(),console.log("Daily Tips Manager initialized successfully")}catch(t){console.error("Error initializing Daily Tips Manager:",t),c("Error initializing page","error")}});
