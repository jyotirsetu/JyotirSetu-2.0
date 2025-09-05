class n{constructor(){this.init()}init(){this.renderQuiz(),this.attachEventListeners()}renderQuiz(){const e=document.getElementById("numerology-quiz-container");e&&(e.innerHTML=`
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🔢 Discover Your Life Path Number</h3>
            <p class="text-gray-600 dark:text-gray-300">Enter your birth date to reveal your numerological destiny and personality traits</p>
          </div>
          
          <div class="space-y-6">
            <div class="question-block">
              <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                1. Enter your birth date
              </label>
              <input 
                type="date" 
                id="birth-date" 
                class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                required
              >
            </div>
            
            <div class="question-block">
              <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                2. What is your top focus area?
              </label>
              <select 
                id="focus-area" 
                class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="">Select your focus...</option>
                <option value="money">💰 Money & Financial Success</option>
                <option value="love">💕 Love & Relationships</option>
                <option value="spirituality">🕉️ Spirituality & Inner Growth</option>
                <option value="career">💼 Career & Professional Life</option>
              </select>
            </div>
          </div>
          
          <div class="text-center mt-6">
            <button 
              id="calculate-number" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              🔮 Calculate My Life Path Number
            </button>
          </div>
          
          <div id="numerology-result" class="hidden mt-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
            <!-- Result will be populated here -->
          </div>
        </div>
      `)}attachEventListeners(){const e=document.getElementById("birth-date"),t=document.getElementById("focus-area"),i=document.getElementById("calculate-number");e&&t&&i&&(e.addEventListener("change",()=>this.updateSubmitButton()),t.addEventListener("change",()=>this.updateSubmitButton()),i.addEventListener("click",()=>this.calculateLifePath()))}updateSubmitButton(){const e=document.getElementById("birth-date")?.value,t=document.getElementById("focus-area")?.value,i=document.getElementById("calculate-number");i&&(i.disabled=!(e&&t))}calculateLifePath(){const e=document.getElementById("birth-date")?.value,t=document.getElementById("focus-area")?.value;if(!e||!t)return;const i=this.computeLifePathNumber(e),r=this.getLifePathInsights(i,t);this.showResult(i,r,t)}computeLifePathNumber(e){const t=new Date(e),i=t.getDate(),r=t.getMonth()+1,a=t.getFullYear(),o=this.reduceToSingleDigit(i),s=this.reduceToSingleDigit(r),l=this.reduceToSingleDigit(a),d=o+s+l;return this.reduceToSingleDigit(d)}reduceToSingleDigit(e){for(;e>9;)e=e.toString().split("").reduce((t,i)=>t+parseInt(i),0);return e}getLifePathInsights(e,t){const i={1:{title:"The Pioneer",traits:"Leadership, independence, originality, determination",description:"You are a natural born leader with strong willpower and innovative thinking.",money:"Excellent at starting businesses and taking financial risks. Focus on entrepreneurship.",love:"You seek partners who respect your independence and share your ambitious nature.",spirituality:"Your spiritual path involves discovering your unique purpose and divine mission.",career:"Perfect for leadership roles, entrepreneurship, and pioneering new ventures."},2:{title:"The Diplomat",traits:"Cooperation, balance, harmony, intuition",description:"You excel at bringing people together and creating harmonious environments.",money:"Great at partnerships and collaborative financial ventures. Avoid impulsive decisions.",love:"You thrive in committed relationships and seek deep emotional connections.",spirituality:"Your spiritual journey involves developing intuition and inner wisdom.",career:"Ideal for mediation, counseling, teamwork, and diplomatic roles."},3:{title:"The Communicator",traits:"Creativity, self-expression, joy, optimism",description:"You have a natural gift for communication and creative expression.",money:"Success comes through creative talents and positive thinking. Avoid overspending.",love:"You bring joy and excitement to relationships. Seek partners who appreciate your creativity.",spirituality:"Your spiritual path involves expressing your divine creativity and joy.",career:"Perfect for creative fields, communication, teaching, and entertainment."},4:{title:"The Builder",traits:"Stability, organization, hard work, reliability",description:"You are the foundation builder, creating solid structures in all areas of life.",money:"Excellent at building wealth through steady, disciplined approaches. Avoid risky investments.",love:"You seek stable, long-term relationships built on trust and mutual respect.",spirituality:"Your spiritual journey involves building a strong foundation of faith and discipline.",career:"Ideal for construction, engineering, finance, and any field requiring organization."},5:{title:"The Adventurer",traits:"Freedom, change, adventure, versatility",description:"You crave freedom and variety, always seeking new experiences and knowledge.",money:"Success comes through diverse income streams and adaptability. Avoid being too scattered.",love:"You need partners who give you space and share your love for adventure.",spirituality:"Your spiritual path involves exploring different traditions and finding your own way.",career:"Perfect for travel, sales, marketing, and any field offering variety and freedom."},6:{title:"The Nurturer",traits:"Responsibility, compassion, service, harmony",description:"You have a natural ability to care for others and create beautiful environments.",money:"Success comes through helping others and creating value. Avoid being taken advantage of.",love:"You are a devoted partner who creates loving, harmonious relationships.",spirituality:"Your spiritual journey involves serving others and developing unconditional love.",career:"Ideal for healthcare, education, counseling, and any caring profession."},7:{title:"The Seeker",traits:"Analysis, spirituality, wisdom, introspection",description:"You are a deep thinker who seeks truth and spiritual understanding.",money:"Success comes through research and careful analysis. Avoid impulsive financial decisions.",love:"You seek intellectual and spiritual connection with partners who understand your depth.",spirituality:"Your spiritual path is your primary focus, leading to profound wisdom.",career:"Perfect for research, analysis, spirituality, and intellectual pursuits."},8:{title:"The Achiever",traits:"Power, success, abundance, authority",description:"You have the ability to manifest material success and achieve great things.",money:"Excellent at building wealth and managing resources. Focus on ethical business practices.",love:"You seek partners who share your ambition and support your goals.",spirituality:"Your spiritual journey involves balancing material success with spiritual growth.",career:"Ideal for business, finance, management, and any field requiring leadership and authority."},9:{title:"The Humanitarian",traits:"Compassion, wisdom, completion, universal love",description:"You are here to serve humanity and share your wisdom with the world.",money:"Success comes through helping others and creating positive change. Avoid attachment to wealth.",love:"You seek deep, meaningful connections that transcend personal needs.",spirituality:"Your spiritual path involves developing universal love and compassion.",career:"Perfect for humanitarian work, healing, teaching, and any field serving others."}};return i[e]||i[1]}showResult(e,t,i){const r=document.getElementById("numerology-result");if(!r)return;const a={money:"💰 Money & Financial Success",love:"💕 Love & Relationships",spirituality:"🕉️ Spirituality & Inner Growth",career:"💼 Career & Professional Life"};r.innerHTML=`
        <div class="text-center">
          <div class="text-6xl mb-4">🔢</div>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Life Path Number: ${e}</h4>
          <h5 class="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">${t.title}</h5>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h6 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Core Traits</h6>
              <p class="text-blue-700 dark:text-blue-300 text-sm">${t.traits}</p>
            </div>
            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h6 class="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Focus Area</h6>
              <p class="text-indigo-700 dark:text-indigo-300 text-sm">${a[i]}</p>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg mb-6">
            <h6 class="font-semibold text-green-800 dark:text-green-200 mb-2">💡 Personal Insight</h6>
            <p class="text-green-700 dark:text-green-300 text-sm">${t.description}</p>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
            <h6 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">🌟 ${a[i]}</h6>
            <p class="text-purple-700 dark:text-purple-300 text-sm">${t[i]}</p>
          </div>
          
          <div class="space-y-3">
            <button 
              onclick="window.location.href='/ScheduleAppointmentJyotirSetu'"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🔮 Book Numerology Session
            </button>
            <button 
              onclick="this.closest('#numerology-result').classList.add('hidden')"
              class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Calculate Again
            </button>
          </div>
        </div>
      `,r.classList.remove("hidden")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new n}):new n;
