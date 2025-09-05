class n{constructor(){this.init()}init(){this.renderQuiz(),this.attachEventListeners()}renderQuiz(){const e=document.getElementById("astrology-quiz-container");e&&(e.innerHTML=`
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🪐 Discover Your Cosmic Path</h3>
            <p class="text-gray-600 dark:text-gray-300">Select your zodiac sign and life concern to reveal celestial insights</p>
          </div>
          
          <div class="space-y-6">
            <div class="question-block">
              <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                1. What's your zodiac sign?
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="aries" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♈ Aries</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="taurus" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♉ Taurus</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="gemini" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♊ Gemini</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="cancer" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♋ Cancer</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="leo" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♌ Leo</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="virgo" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♍ Virgo</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="libra" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♎ Libra</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="scorpio" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♏ Scorpio</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="sagittarius" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♐ Sagittarius</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="capricorn" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♑ Capricorn</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="aquarius" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♒ Aquarius</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="zodiac-sign" value="pisces" class="mr-3" required>
                  <span class="text-gray-700 dark:text-gray-300">♓ Pisces</span>
                </label>
              </div>
            </div>
            
            <div class="question-block">
              <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                2. What's your main life concern?
              </label>
              <select 
                id="life-concern" 
                class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="">Select your concern...</option>
                <option value="marriage">💕 Marriage & Relationships</option>
                <option value="career">💼 Career & Professional Growth</option>
                <option value="health">🌿 Health & Wellbeing</option>
                <option value="spirituality">🕉️ Spiritual Development</option>
              </select>
            </div>
          </div>
          
          <div class="text-center mt-6">
            <button 
              id="read-stars" 
              class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              🌟 Read My Stars
            </button>
          </div>
          
          <div id="astrology-result" class="hidden mt-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-slate-700">
            <!-- Result will be populated here -->
          </div>
        </div>
      `)}attachEventListeners(){const e=document.querySelectorAll('input[type="radio"]'),a=document.getElementById("life-concern"),r=document.getElementById("read-stars");e.forEach(i=>{i.addEventListener("change",()=>this.updateSubmitButton())}),a&&a.addEventListener("change",()=>this.updateSubmitButton()),r&&r.addEventListener("click",()=>this.readStars())}updateSubmitButton(){const e=document.querySelector('input[name="zodiac-sign"]:checked'),a=document.getElementById("life-concern")?.value,r=document.getElementById("read-stars");r&&(r.disabled=!(e&&a))}readStars(){const e=document.querySelector('input[name="zodiac-sign"]:checked')?.value,a=document.getElementById("life-concern")?.value;if(!e||!a)return;const r=this.generateAstrologyInsights(e,a);this.showResult(r,e,a)}generateAstrologyInsights(e,a){const r={aries:{element:"Fire",ruler:"Mars",traits:"Bold, energetic, pioneering, courageous",description:"As a fiery Aries, you are a natural leader with boundless energy and determination.",marriage:"You seek passionate, dynamic relationships. Your partner should appreciate your independence and adventurous spirit.",career:"Perfect for leadership roles, entrepreneurship, and any field requiring initiative and courage.",health:"Focus on managing your high energy levels through regular exercise and stress management.",spirituality:"Your spiritual path involves discovering your unique purpose and divine mission."},taurus:{element:"Earth",ruler:"Venus",traits:"Patient, reliable, practical, sensual",description:"As an earthy Taurus, you are grounded, patient, and have a deep appreciation for beauty and comfort.",marriage:"You seek stable, long-term relationships built on trust, loyalty, and shared values.",career:"Ideal for finance, real estate, agriculture, and any field requiring patience and reliability.",health:"Focus on maintaining a balanced diet and regular exercise routine. You have strong physical endurance.",spirituality:"Your spiritual journey involves developing patience and finding beauty in all aspects of life."},gemini:{element:"Air",ruler:"Mercury",traits:"Versatile, expressive, quick-witted, curious",description:"As an airy Gemini, you are adaptable, communicative, and always seeking new knowledge and experiences.",marriage:"You need intellectual stimulation and variety in relationships. Communication is key for you.",career:"Perfect for communication, teaching, sales, writing, and any field requiring versatility.",health:"Focus on mental health and stress management. Regular mental stimulation is important.",spirituality:"Your spiritual path involves continuous learning and sharing knowledge with others."},cancer:{element:"Water",ruler:"Moon",traits:"Nurturing, intuitive, protective, emotional",description:"As a watery Cancer, you are deeply emotional, intuitive, and have a strong nurturing instinct.",marriage:"You create deep, emotional bonds and seek partners who appreciate your caring nature.",career:"Ideal for healthcare, counseling, hospitality, and any caring profession.",health:"Focus on emotional well-being and maintaining healthy boundaries in relationships.",spirituality:"Your spiritual journey involves developing emotional intelligence and intuitive abilities."},leo:{element:"Fire",ruler:"Sun",traits:"Confident, creative, generous, dramatic",description:"As a fiery Leo, you are charismatic, creative, and have a natural ability to inspire others.",marriage:"You seek partners who appreciate your creativity and give you the attention you deserve.",career:"Perfect for entertainment, leadership, sales, and any field where you can shine and inspire.",health:"Focus on maintaining your energy levels and managing stress through creative outlets.",spirituality:"Your spiritual path involves discovering your unique creative gifts and sharing them with the world."},virgo:{element:"Earth",ruler:"Mercury",traits:"Analytical, practical, perfectionist, helpful",description:"As an earthy Virgo, you are detail-oriented, practical, and have a strong desire to be of service.",marriage:"You seek partners who appreciate your attention to detail and practical approach to life.",career:"Ideal for healthcare, research, administration, and any field requiring precision and organization.",health:"Focus on maintaining a healthy work-life balance and managing perfectionist tendencies.",spirituality:"Your spiritual journey involves developing self-acceptance and finding ways to serve others."},libra:{element:"Air",ruler:"Venus",traits:"Diplomatic, gracious, fair-minded, social",description:"As an airy Libra, you are balanced, diplomatic, and have a natural sense of justice and harmony.",marriage:"You seek harmonious, balanced relationships and are excellent at maintaining peace.",career:"Perfect for law, diplomacy, counseling, and any field requiring balance and fairness.",health:"Focus on maintaining balance in all areas of life and avoiding indecision-related stress.",spirituality:"Your spiritual path involves creating harmony and balance in all aspects of life."},scorpio:{element:"Water",ruler:"Pluto",traits:"Passionate, determined, magnetic, mysterious",description:"As a watery Scorpio, you are intense, passionate, and have a deep understanding of human nature.",marriage:"You seek deep, transformative relationships and are incredibly loyal to those you love.",career:"Ideal for psychology, investigation, research, and any field requiring depth and insight.",health:"Focus on emotional healing and maintaining healthy boundaries in intense relationships.",spirituality:"Your spiritual journey involves deep transformation and understanding the mysteries of life."},sagittarius:{element:"Fire",ruler:"Jupiter",traits:"Optimistic, adventurous, philosophical, honest",description:"As a fiery Sagittarius, you are optimistic, adventurous, and always seeking truth and wisdom.",marriage:"You seek partners who share your love for adventure and intellectual growth.",career:"Perfect for travel, teaching, philosophy, and any field offering variety and learning opportunities.",health:"Focus on maintaining physical activity and managing your restless energy constructively.",spirituality:"Your spiritual path involves continuous learning and expanding your horizons."},capricorn:{element:"Earth",ruler:"Saturn",traits:"Ambitious, disciplined, responsible, patient",description:"As an earthy Capricorn, you are ambitious, disciplined, and have a strong sense of responsibility.",marriage:"You seek stable, long-term relationships built on mutual respect and shared goals.",career:"Ideal for business, finance, management, and any field requiring discipline and long-term planning.",health:"Focus on maintaining work-life balance and managing stress through structured relaxation.",spirituality:"Your spiritual journey involves developing patience and building a strong foundation of faith."},aquarius:{element:"Air",ruler:"Uranus",traits:"Innovative, independent, humanitarian, intellectual",description:"As an airy Aquarius, you are innovative, independent, and have a strong desire to help humanity.",marriage:"You seek partners who respect your independence and share your humanitarian values.",career:"Perfect for technology, science, social work, and any field requiring innovation and originality.",health:"Focus on maintaining social connections and managing your tendency to intellectualize emotions.",spirituality:"Your spiritual path involves developing your unique perspective and helping others."},pisces:{element:"Water",ruler:"Neptune",traits:"Compassionate, artistic, intuitive, dreamy",description:"As a watery Pisces, you are compassionate, artistic, and have a deep connection to the spiritual realm.",marriage:"You seek deep, spiritual connections and are incredibly empathetic to your partner's needs.",career:"Ideal for arts, healing, spirituality, and any field requiring compassion and creativity.",health:"Focus on maintaining boundaries and managing your tendency to absorb others' emotions.",spirituality:"Your spiritual path is your primary focus, leading to profound spiritual wisdom and compassion."}};return r[e]||r.aries}showResult(e,a,r){const i=document.getElementById("astrology-result");if(!i)return;const s={aries:"♈ Aries",taurus:"♉ Taurus",gemini:"♊ Gemini",cancer:"♋ Cancer",leo:"♌ Leo",virgo:"♍ Virgo",libra:"♎ Libra",scorpio:"♏ Scorpio",sagittarius:"♐ Sagittarius",capricorn:"♑ Capricorn",aquarius:"♒ Aquarius",pisces:"♓ Pisces"},t={marriage:"💕 Marriage & Relationships",career:"💼 Career & Professional Growth",health:"🌿 Health & Wellbeing",spirituality:"🕉️ Spiritual Development"};i.innerHTML=`
        <div class="text-center">
          <div class="text-6xl mb-4">${s[a]}</div>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Cosmic Reading Reveals...</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h6 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">Element</h6>
              <p class="text-purple-700 dark:text-purple-300 text-sm font-medium">${e.element}</p>
            </div>
            
            <div class="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
              <h6 class="font-semibold text-pink-800 dark:text-pink-200 mb-2">Ruling Planet</h6>
              <p class="text-pink-700 dark:text-pink-300 text-sm font-medium">${e.ruler}</p>
            </div>
            
            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h6 class="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Focus Area</h6>
              <p class="text-indigo-700 dark:text-indigo-300 text-sm font-medium">${t[r]}</p>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
            <h6 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">🌟 Your Zodiac Traits</h6>
            <p class="text-purple-700 dark:text-purple-300 text-sm">${e.traits}</p>
          </div>
          
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg mb-6">
            <h6 class="font-semibold text-pink-800 dark:text-pink-200 mb-2">💫 Cosmic Description</h6>
            <p class="text-pink-700 dark:text-pink-300 text-sm">${e.description}</p>
          </div>
          
          <div class="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 p-4 rounded-lg mb-6">
            <h6 class="font-semibold text-rose-800 dark:text-rose-200 mb-2">🎯 ${t[r]}</h6>
            <p class="text-rose-700 dark:text-rose-300 text-sm">${e[r]}</p>
          </div>
          
          <div class="space-y-3">
            <button 
              onclick="window.location.href='/ScheduleAppointmentJyotirSetu'"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🌟 Book Kundli Analysis
            </button>
            <button 
              onclick="this.closest('#astrology-result').classList.add('hidden')"
              class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Read Again
            </button>
          </div>
        </div>
      `,i.classList.remove("hidden")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new n}):new n;
