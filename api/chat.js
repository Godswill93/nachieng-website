(function () {
  // ── INJECT STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

    #ne-trigger {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px;
      background: linear-gradient(135deg, #1a6bff, #00d4ff);
      border-radius: 50%; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(26,107,255,0.5);
      animation: ne-pulse 2.5s ease infinite;
      z-index: 99999; transition: transform 0.2s;
    }
    #ne-trigger:hover { transform: scale(1.08); }
    #ne-trigger svg { width: 28px; height: 28px; fill: #fff; }
    #ne-trigger .ne-close { display: none; }
    #ne-trigger.ne-open .ne-chat-icon { display: none; }
    #ne-trigger.ne-open .ne-close { display: block; }

    @keyframes ne-pulse {
      0%   { box-shadow: 0 4px 24px rgba(26,107,255,0.5), 0 0 0 0 rgba(26,107,255,0.3); }
      70%  { box-shadow: 0 4px 24px rgba(26,107,255,0.5), 0 0 0 14px rgba(26,107,255,0); }
      100% { box-shadow: 0 4px 24px rgba(26,107,255,0.5), 0 0 0 0 rgba(26,107,255,0); }
    }

    #ne-window {
      position: fixed; bottom: 104px; right: 28px;
      width: 370px; max-width: calc(100vw - 40px);
      height: 580px; max-height: calc(100vh - 130px);
      background: #0a0e1a;
      border-radius: 20px; border: 1px solid rgba(26,107,255,0.2);
      display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      z-index: 99998;
      transform: translateY(20px) scale(0.95); opacity: 0; pointer-events: none;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      font-family: 'DM Sans', sans-serif;
    }
    #ne-window.ne-open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

    .ne-header {
      background: linear-gradient(135deg,#0d1526,#0a1a3a);
      padding: 14px 18px; display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(26,107,255,0.2); flex-shrink: 0;
    }
    .ne-logo {
      width: 36px; height: 36px;
      background: linear-gradient(135deg,#1a6bff,#00d4ff);
      border-radius: 9px; display: flex; align-items: center; justify-content: center;
      font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; color: #fff;
      flex-shrink: 0;
    }
    .ne-hname {
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 14px; color: #e8edf8; letter-spacing: 0.5px;
    }
    .ne-hstatus {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; color: #00e676; margin-top: 1px;
    }
    .ne-sdot {
      width: 6px; height: 6px; background: #00e676; border-radius: 50%;
      animation: ne-blink 1.8s ease infinite;
    }
    @keyframes ne-blink { 0%,100%{opacity:1}50%{opacity:0.3} }

    /* SCREENS */
    .ne-screen { flex: 1; display: none; flex-direction: column; overflow: hidden; }
    .ne-screen.ne-active { display: flex; }

    /* WELCOME */
    #ne-welcome { padding: 20px; overflow-y: auto; }
    .ne-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(26,107,255,0.12); border: 1px solid rgba(26,107,255,0.3);
      border-radius: 20px; padding: 4px 12px; font-size: 10px;
      color: #00d4ff; font-weight: 600; margin-bottom: 12px;
      letter-spacing: 0.5px; text-transform: uppercase;
    }
    .ne-title {
      font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700;
      color: #e8edf8; line-height: 1.2; margin-bottom: 6px;
    }
    .ne-title span {
      background: linear-gradient(90deg,#1a6bff,#00d4ff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .ne-sub { font-size: 12px; color: #6b7a99; line-height: 1.5; margin-bottom: 18px; }

    .ne-label {
      display: block; font-size: 10px; font-weight: 600; color: #6b7a99;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px;
    }
    .ne-input {
      width: 100%; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(26,107,255,0.2); border-radius: 9px;
      padding: 10px 13px; color: #e8edf8;
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      outline: none; transition: border-color 0.2s; margin-bottom: 12px; box-sizing: border-box;
    }
    .ne-input::placeholder { color: #6b7a99; }
    .ne-input:focus { border-color: #1a6bff; background: rgba(26,107,255,0.07); }

    .ne-sector-label {
      font-size: 10px; font-weight: 600; color: #6b7a99;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; display: block;
    }
    .ne-sector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 16px; }
    .ne-sbtn {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(26,107,255,0.2);
      border-radius: 9px; padding: 9px 7px; color: #6b7a99;
      font-family: 'DM Sans', sans-serif; font-size: 11px;
      cursor: pointer; text-align: center; transition: all 0.2s; line-height: 1.3;
    }
    .ne-sbtn:hover { border-color: #1a6bff; color: #e8edf8; background: rgba(26,107,255,0.1); }
    .ne-sbtn.ne-sel { border-color: #00d4ff; background: rgba(0,212,255,0.1); color: #00d4ff; }
    .ne-sbtn .ne-si { font-size: 16px; display: block; margin-bottom: 3px; }

    .ne-start {
      width: 100%; padding: 13px;
      background: linear-gradient(135deg,#1a6bff,#00d4ff);
      border: none; border-radius: 11px; color: #fff;
      font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 700;
      letter-spacing: 1px; cursor: pointer; transition: opacity 0.2s, transform 0.2s;
      text-transform: uppercase;
    }
    .ne-start:hover { opacity: 0.9; transform: translateY(-1px); }
    .ne-start:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

    /* CHAT SCREEN */
    .ne-stag {
      margin: 10px 14px 0; display: inline-flex; align-items: center; gap: 5px;
      background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.25);
      border-radius: 20px; padding: 3px 10px; font-size: 11px; color: #00d4ff;
      align-self: flex-start; flex-shrink: 0;
    }
    .ne-msgs {
      flex: 1; overflow-y: auto; padding: 12px 14px;
      display: flex; flex-direction: column; gap: 9px;
      scrollbar-width: thin; scrollbar-color: rgba(26,107,255,0.3) transparent;
    }
    .ne-msgs::-webkit-scrollbar { width: 4px; }
    .ne-msgs::-webkit-scrollbar-thumb { background: rgba(26,107,255,0.3); border-radius: 2px; }

    .ne-msg {
      max-width: 88%; padding: 9px 13px; border-radius: 13px;
      font-size: 13px; line-height: 1.55;
      animation: ne-fadeup 0.3s ease;
    }
    @keyframes ne-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .ne-msg.ne-bot {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
      color: #e8edf8; border-radius: 4px 13px 13px 13px; align-self: flex-start;
    }
    .ne-msg.ne-user {
      background: linear-gradient(135deg,#1a6bff,#1256cc);
      color: #fff; border-radius: 13px 4px 13px 13px; align-self: flex-end;
    }
    .ne-msg.ne-bot strong { color: #00d4ff; }

    .ne-typing {
      display: flex; gap: 4px; padding: 11px 14px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px 13px 13px 13px; align-self: flex-start;
      width: fit-content; animation: ne-fadeup 0.3s ease;
    }
    .ne-typing span {
      width: 6px; height: 6px; background: #6b7a99; border-radius: 50%;
      animation: ne-bounce 1.2s ease infinite;
    }
    .ne-typing span:nth-child(2) { animation-delay: 0.15s; }
    .ne-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes ne-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

    .ne-cal-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg,#1a6bff,#00d4ff);
      color: #fff; text-decoration: none; padding: 9px 15px;
      border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 8px;
      transition: opacity 0.2s; align-self: flex-start;
    }
    .ne-cal-btn:hover { opacity: 0.85; }

    .ne-input-area {
      padding: 10px 12px; border-top: 1px solid rgba(26,107,255,0.2);
      display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0;
      background: rgba(255,255,255,0.02);
    }
    .ne-chat-input {
      flex: 1; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(26,107,255,0.2); border-radius: 9px;
      padding: 9px 13px; color: #e8edf8;
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      outline: none; resize: none; max-height: 80px; transition: border-color 0.2s;
      line-height: 1.4; box-sizing: border-box;
    }
    .ne-chat-input::placeholder { color: #6b7a99; }
    .ne-chat-input:focus { border-color: #1a6bff; }
    .ne-send {
      width: 36px; height: 36px;
      background: linear-gradient(135deg,#1a6bff,#00d4ff);
      border: none; border-radius: 9px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.2s, transform 0.2s;
    }
    .ne-send:hover { opacity: 0.85; transform: scale(1.05); }
    .ne-send:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
    .ne-send svg { width: 15px; height: 15px; fill: #fff; }

    .ne-powered {
      text-align: center; padding: 5px; font-size: 10px;
      color: rgba(107,122,153,0.5); flex-shrink: 0;
    }
    .ne-err {
      background: rgba(255,50,50,0.1); border: 1px solid rgba(255,50,50,0.2);
      color: #ff6b6b; padding: 7px 12px; border-radius: 7px;
      font-size: 12px; margin: 0 14px 6px; flex-shrink: 0; display: none;
    }
  `;
  document.head.appendChild(style);

  // ── INJECT HTML ──
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="ne-trigger">
      <svg class="ne-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/></svg>
      <svg class="ne-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>

    <div id="ne-window">
      <div class="ne-header">
        <div class="ne-logo">NE</div>
        <div>
          <div class="ne-hname">NACHI ENG ASSISTANT</div>
          <div class="ne-hstatus"><span class="ne-sdot"></span> Online — Ready to Help</div>
        </div>
      </div>

      <!-- WELCOME SCREEN -->
      <div id="ne-welcome" class="ne-screen ne-active">
        <div class="ne-badge">⚡ Available 24/7</div>
        <div class="ne-title">Smarter Maintenance.<br><span>Zero Downtime.</span></div>
        <div class="ne-sub">Get instant answers about CMMS and how Nachi Eng can transform your operations. Tell us about yourself first.</div>

        <label class="ne-label">Your Name</label>
        <input class="ne-input" id="ne-name" type="text" placeholder="e.g. Andrew Carter" />
        <label class="ne-label">Company</label>
        <input class="ne-input" id="ne-company" type="text" placeholder="e.g. NHS South East Coast" />
        <label class="ne-label">Work Email</label>
        <input class="ne-input" id="ne-email" type="email" placeholder="e.g. andrew@company.co.uk" />

        <span class="ne-sector-label">Your Sector</span>
        <div class="ne-sector-grid">
          <button class="ne-sbtn" data-sector="NHS / Healthcare"><span class="ne-si">🏥</span>NHS / Healthcare</button>
          <button class="ne-sbtn" data-sector="Hotels / Hospitality"><span class="ne-si">🏨</span>Hotels / Hospitality</button>
          <button class="ne-sbtn" data-sector="Manufacturing / Industrial"><span class="ne-si">🏭</span>Manufacturing</button>
          <button class="ne-sbtn" data-sector="Property / Real Estate"><span class="ne-si">🏢</span>Property / Real Estate</button>
          <button class="ne-sbtn" data-sector="Logistics / Transport"><span class="ne-si">🚛</span>Logistics / Transport</button>
          <button class="ne-sbtn" data-sector="Other"><span class="ne-si">🔧</span>Other</button>
        </div>
        <button class="ne-start" id="ne-start" disabled>START CONVERSATION →</button>
      </div>

      <!-- CHAT SCREEN -->
      <div id="ne-chat" class="ne-screen">
        <div class="ne-stag" id="ne-stag">🏥 NHS / Healthcare</div>
        <div class="ne-msgs" id="ne-msgs"></div>
        <div class="ne-err" id="ne-err">Connection issue — please try again.</div>
        <div class="ne-input-area">
          <textarea class="ne-chat-input" id="ne-ci" placeholder="Ask about CMMS, our services..." rows="1"></textarea>
          <button class="ne-send" id="ne-send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <div class="ne-powered">Powered by <a href="https://nachieng.co.uk" style="color:rgba(107,122,153,0.5);text-decoration:none">Nachi Eng Ltd</a></div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ── LOGIC ──
  let neOpen = false, neSector = '', neHistory = [], neLead = {}, neLoading = false;

  const $ = id => document.getElementById(id);

  $('ne-trigger').addEventListener('click', () => {
    neOpen = !neOpen;
    $('ne-window').classList.toggle('ne-open', neOpen);
    $('ne-trigger').classList.toggle('ne-open', neOpen);
  });

  document.querySelectorAll('.ne-sbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ne-sbtn').forEach(b => b.classList.remove('ne-sel'));
      btn.classList.add('ne-sel');
      neSector = btn.dataset.sector;
      neValidate();
    });
  });

  ['ne-name','ne-email','ne-company'].forEach(id => {
    $(id).addEventListener('input', neValidate);
  });

  function neValidate() {
    const n = $('ne-name').value.trim();
    const e = $('ne-email').value.trim();
    const c = $('ne-company').value.trim();
    $('ne-start').disabled = !(n && e && c && neSector && e.includes('@'));
  }

  $('ne-start').addEventListener('click', () => {
    neLead = {
      name: $('ne-name').value.trim(),
      company: $('ne-company').value.trim(),
      email: $('ne-email').value.trim(),
      sector: neSector
    };
    $('ne-welcome').classList.remove('ne-active');
    $('ne-chat').classList.add('ne-active');
    $('ne-stag').textContent = neEmoji(neSector) + ' ' + neSector;

    const greet = `Hi ${neLead.name}! 👋 Welcome to Nachi Eng. I'm here to help you explore how a **CMMS** can transform maintenance at **${neLead.company}**.\n\nYou're in the **${neSector}** sector — one of the core areas we specialise in. Whether you have questions about how it works, what's involved, or how we'd implement it for your team — just ask. What's on your mind?`;
    neAddBot(greet);
    neHistory = [
      { role: 'user', content: `I'm ${neLead.name} from ${neLead.company} (${neLead.email}), sector: ${neSector}.` },
      { role: 'assistant', content: greet }
    ];
    setTimeout(() => $('ne-ci').focus(), 300);
  });

  function neEmoji(s) {
    return {'NHS / Healthcare':'🏥','Hotels / Hospitality':'🏨','Manufacturing / Industrial':'🏭','Property / Real Estate':'🏢','Logistics / Transport':'🚛','Other':'🔧'}[s]||'🔧';
  }

  $('ne-ci').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); neSend(); }
  });
  $('ne-ci').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });
  $('ne-send').addEventListener('click', neSend);

  async function neSend() {
    const input = $('ne-ci');
    const text = input.value.trim();
    if (!text || neLoading) return;
    input.value = ''; input.style.height = 'auto';
    neAddUser(text);
    neHistory.push({ role: 'user', content: text });
    neSetLoading(true);
    $('ne-err').style.display = 'none';

    const sys = `You are the virtual assistant for Nachi Eng Ltd, a UK-based Maintenance Management Systems consultancy.

ABOUT NACHI ENG:
- Company: Nachi Eng Ltd (Company No. 16567818)
- Founder: Godswill Iweajunwa — BEng (Hons) First Class, MIET, 18th Edition qualified
- Services: CMMS implementation, maintenance management consultancy, asset management
- Website: nachieng.co.uk | Email: info@nachieng.co.uk
- Calendly: calendly.com/godswill-nachieng/30min
- Tagline: "Smarter Maintenance. Zero Downtime."
- Based: Southend-on-Sea, UK. Serving all UK operations

THIS VISITOR: Name: ${neLead.name} | Company: ${neLead.company} | Sector: ${neLead.sector}

WHAT IS CMMS: A Computerised Maintenance Management System centralises maintenance info — asset management, PPM scheduling, work orders, parts inventory, compliance. Converts reactive to planned maintenance.

SECTOR KNOWLEDGE:
- NHS/Healthcare: HTM compliance, PPM for critical equipment, CQC, asset lifecycle
- Hotels/Hospitality: Guest experience, multi-site asset tracking, reactive vs planned balance
- Manufacturing: OEE improvement, production uptime, ISO 55001, shift scheduling
- Property/Real Estate: Portfolio visibility, compliance, energy management, contractor management
- Logistics/Transport: Fleet maintenance, HGV compliance, depot management

PRICING: Never give exact prices. Say every project is scoped individually, best step is a free 30-min discovery call. Provide: calendly.com/godswill-nachieng/30min

STYLE: Conversational, helpful, never salesy. Max 4 sentences unless detail needed. Use **bold** for key terms. Always guide toward booking a call.

CRITICAL RULES:
- NEVER say you are an AI, bot, language model, or powered by any technology
- If asked if you are human or AI, say: "I'm the Nachi Eng assistant — here to help with any maintenance or CMMS questions you have!"
- NEVER mention Claude, Anthropic, ChatGPT or any AI company
- You can answer ANY question about maintenance, CMMS, facilities management, compliance, engineering — no limits
- If a question is completely unrelated to Nachi Eng (e.g. cooking, sport), politely steer back: "Great question! My expertise is in maintenance management — can I help you with that?"
- Always be confident, knowledgeable and helpful`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: sys,
          messages: neHistory
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.error_description || JSON.stringify(data));
      if (!data.content || !data.content[0]) throw new Error('API response: ' + JSON.stringify(data));
      const reply = data.content[0].text;
      neHistory.push({ role: 'assistant', content: reply });
      neRemoveTyping();
      neAddBot(reply);
      const kws = ['book','call','calendly','schedule','meeting','speak','demo','chat'];
      if (kws.some(k => (text + reply).toLowerCase().includes(k))) neAddCalendly();
    } catch (err) {
      neRemoveTyping();
      const errEl = document.getElementById('ne-err');
      errEl.textContent = 'Error: ' + (err.message || 'Connection failed');
      errEl.style.display = 'block';
    } finally { neSetLoading(false); }
  }

  function neAddUser(t) {
    const d = document.createElement('div');
    d.className = 'ne-msg ne-user'; d.textContent = t;
    $('ne-msgs').appendChild(d); neScroll();
  }
  function neAddBot(t) {
    const d = document.createElement('div');
    d.className = 'ne-msg ne-bot';
    let html = t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    html = html.replace(/(https?:\/\/calendly\.com\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color:#00d4ff;text-decoration:underline;word-break:break-all">$1</a>');
    html = html.replace(/(?<!["\/])(calendly\.com\/[^\s<]+)/g, '<a href="https://$1" target="_blank" style="color:#00d4ff;text-decoration:underline;word-break:break-all">$1</a>');
    d.innerHTML = html;
    $('ne-msgs').appendChild(d); neScroll();
  }
  function neAddCalendly() {
    if ($('ne-msgs').querySelector('.ne-cal-btn')) return;
    const a = document.createElement('a');
    a.className = 'ne-cal-btn ne-msg';
    a.href = 'https://calendly.com/godswill-nachieng/30min';
    a.target = '_blank'; a.textContent = '📅 Book a Free 30-Min Call';
    $('ne-msgs').appendChild(a); neScroll();
  }
  function neSetLoading(v) {
    neLoading = v;
    $('ne-send').disabled = v; $('ne-ci').disabled = v;
    if (v) {
      const t = document.createElement('div');
      t.className = 'ne-typing'; t.id = 'ne-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      $('ne-msgs').appendChild(t); neScroll();
    }
  }
  function neRemoveTyping() { const t = $('ne-typing'); if(t) t.remove(); }
  function neScroll() { const m = $('ne-msgs'); m.scrollTop = m.scrollHeight; }
})();
