// =================== STATE ===================
let chatOpen = false;
let chatHistory = [];
let isTyping = false;
let selectedPkg = '';
let currentSector = 'genel';
let convStep = {};

// =================== SEKTÖR VERİLERİ ===================
const SDATA = {
  genel: {
    name: 'NexaBot Demo',
    emoji: '🤖',
    welcome: 'Merhaba! Ben NexaBot — işletmeniz için AI asistan demo\'su. Size nasıl yardımcı olabilirim? 👋',
    qr: ['Fiyatlar nedir?', 'Nasıl çalışır?', 'Demo istiyorum'],
    fiyat: ['NexaBot paketlerimiz şöyle:\n\n💬 <b>Chatbot — €299/ay</b>\nWeb chat + WhatsApp asistanı\n\n📞 <b>Voice Chatbot — €499/ay</b>\nChatbot + sesli AI arama\n\n🌐 <b>Website — €799/ay</b>\nTam çözüm + özel web sitesi\n\nİlk hafta tamamen ücretsiz. Hangi paket ilginizi çekti?'],
    nasil: ['Kurulum çok basit: biz sizin işletmenize özel botu hazırlıyoruz, siz sadece web sitenize bir kod satırı ekliyorsunuz. 3 dakikada hazır!\n\nBot; randevu alır, soruları yanıtlar, WhatsApp\'tan mesaj kabul eder. Siz sadece sabah gelen rezervasyonları görürsünüz. 📅'],
    randevu: ['Tabii ki! Size hemen demo randevusu ayarlayabilirim. 📅\n\nHangi gün uygun olur — <b>yarın mı</b> yoksa <b>bu hafta sonu mu</b>?', 'Harika! Randevu için adınızı ve telefon numaranızı alabilir miyim? WhatsApp\'tan sizi arayacağız. 📞'],
    temsilci: ['Sizi hemen uzmanımıza bağlıyorum! ⚡\n\nWhatsApp: <b>+90 5XX XXX XX XX</b>\nveya aşağıdaki "Demo İste" butonuna tıklayın — 24 saat içinde sizi arayalım.'],
    genel_c: ['Anlıyorum! NexaBot olarak işletmenize özel çözümler sunuyoruz. Daha fazla bilgi almak ister misiniz, yoksa hemen bir demo ayarlayalım mı? 🚀', 'İyi soru! Kısaca söylemek gerekirse: botunuz 7/24 çalışır, yorulmaz, kaçırmaz. Başka merak ettiğiniz var mı?']
  },
  restoran: {
    name: 'Lezzet Köşesi',
    emoji: '🍽️',
    welcome: 'Lezzet Köşesi\'ne hoş geldiniz! 🍽️ Masa rezervasyonu yapmak veya menümüz hakkında bilgi almak ister misiniz?',
    qr: ['Masa rezervasyonu', 'Menü nedir?', 'Kaç kişilik masanız var?'],
    fiyat: ['Menümüzden bazı seçenekler:\n\n🍕 Pizza — ₺180\n🍔 Burger — ₺150\n🍝 Makarna — ₺160\n🍰 Tatlılar — ₺80\n\nGünlük özel menümüz için lütfen sorun! Hangi yemeği merak ediyorsunuz?'],
    saat: ['Çalışma saatlerimiz:\n📅 <b>Salı–Pazar: 12:00–23:00</b>\n🚫 Pazartesi kapalı\n\nRezervasyon için telefon: (0212) XXX XX XX\nveya şu an benimle randevu alabilirsiniz! 😊'],
    randevu: ['Tabii ki masa ayırtabilirim! 🎉\n\nKaç kişilik bir masa istersiniz ve hangi gün/saat uygun?', 'Harika! İsminizi ve telefon numaranızı alabilir miyim? Onay SMS\'i göndereceğiz. 📱'],
    temsilci: ['Sizi restoranımızla bağlantıya geçiriyorum! 📞\n\n☎️ (0212) XXX XX XX\nWhatsApp ile de yazabilirsiniz. Şu an görevli personeliniz sizi karşılayacak.'],
    menu: ['Bugünün özel menüsü:\n\n🥗 Başlangıç: Mevsim salata ₺65\n🍖 Ana yemek: Izgara köfte ₺220\n🍰 Tatlı: Sütlaç ₺75\n\nTam menü için sormaya devam edin, her şeyi anlatırım! 😋'],
    genel_c: ['Anlıyorum! Size en iyi şekilde yardımcı olmaya çalışıyorum. Rezervasyon mu yapmak istiyorsunuz, yoksa başka bir sorunuz mu var?', 'Tabii! Lezzet Köşesi olarak her müşterimize özel ilgi gösteriyoruz. Masa ayırtmak ister misiniz? 🍽️']
  },
  guzellik: {
    name: 'Bella Studio',
    emoji: '💅',
    welcome: 'Bella Studio\'ya hoş geldiniz! ✨ Randevu almak veya hizmetlerimiz hakkında bilgi almak ister misiniz?',
    qr: ['Randevu almak istiyorum', 'Hizmet fiyatları?', 'Bu hafta müsait misiniz?'],
    fiyat: ['Hizmetlerimiz ve fiyatlarımız:\n\n✂️ Saç kesimi — ₺250\n🎨 Saç boyama — ₺450 (uzunluğa göre)\n💅 Manikür — ₺180\n✨ Kalıcı oje — ₺250\n👁️ Kaş tasarımı — ₺120\n🧖 Cilt bakımı — ₺350\n\nKombo paketler için özel fiyat yapıyoruz. Hangi hizmetle ilgileniyorsunuz?'],
    saat: ['Çalışma saatlerimiz:\n📅 <b>Pazartesi–Cumartesi: 09:00–20:00</b>\n🚫 Pazar kapalı\n\nYoğun günler Cuma–Cumartesi, erken randevu almanızı öneririm! 😊'],
    randevu: ['Mükemmel! Sizi güzelleştirmeye hazırız 💅\n\nHangi hizmeti almak istiyorsunuz ve hangi gün/saat uygun?', 'Harika seçim! İsminizi alabilir miyim? Randevunuzu hemen sisteme işleyeyim. Onay mesajı gönderilecek. 📲'],
    temsilci: ['Sizi uzmanımıza bağlıyorum! 💁‍♀️\n\n📞 (0212) XXX XX XX\nInstagram: @bellastudio\n\nDirekt mesaj da atabilirsiniz, en kısa sürede dönüş yapıyoruz.'],
    genel_c: ['Anlıyorum! Bella Studio olarak her müşterimize özel ilgi gösteriyoruz. Başka bir sorunuz var mı? 💕', 'Tabii! Size en güzel sonucu vermek için buradayız. Randevu almak ister misiniz?']
  },
  klinik: {
    name: 'Dr. Yılmaz Diş Kliniği',
    emoji: '🦷',
    welcome: 'Dr. Yılmaz Diş Kliniği\'ne hoş geldiniz! 🦷 Randevu almak veya bilgi almak için buradayım. Size nasıl yardımcı olabilirim?',
    qr: ['Randevu almak istiyorum', 'Diş beyazlatma fiyatı?', 'Acil muayene'],
    fiyat: ['Kliniğimizin ücret listesi:\n\n✅ <b>İlk muayene — Ücretsiz</b>\n🦷 Diş çekimi — ₺400\n⚪ Diş beyazlatma — ₺2.500\n🔧 Kanal tedavisi — ₺1.500\n🦷 İmplant — ₺8.000\n💎 Zirkonyum kaplama — ₺2.200\n\nSigorta anlaşmalarımız mevcuttur. Hangi işlemi merak ediyorsunuz?'],
    saat: ['Kliniğimiz açık:\n📅 <b>Pazartesi–Cuma: 09:00–18:00</b>\n📅 <b>Cumartesi: 09:00–14:00</b>\n🚫 Pazar kapalı\n\n⚡ Acil durumlarda 7/24 hatta ulaşabilirsiniz.'],
    randevu: ['Randevunuzu hemen alabilirim! 📅\n\nHangi gün/saat uygun — ve hangi işlem için gelmeyi düşünüyorsunuz?', 'Anlayışla karşıladık! İsminizi ve telefon numaranızı paylaşır mısınız? Randevu onayı SMS\'le gönderilecek. 📱'],
    temsilci: ['Sizi kliniğimizle bağlantıya geçiriyorum! 🏥\n\n☎️ (0212) XXX XX XX\nAcil hat: (0555) XXX XX XX\n\nHer zaman yanınızdayız.'],
    acil: ['Acil durumlarda hemen yardımcı oluyoruz! 🚨\n\nLütfen şu numarayı arayın: <b>(0555) XXX XX XX</b>\nveya adresinizi paylaşın, en yakın randevuyu hemen ayarlayalım.'],
    genel_c: ['Anlıyorum! Sağlığınız bizim önceliğimiz. Başka bir sorunuz var mı veya randevu almak ister misiniz? 😊', 'Tabii! Dr. Yılmaz Diş Kliniği olarak en modern teknolojiyle hizmetinizdeyiz. Randevu almak ister misiniz?']
  },
  otel: {
    name: 'Grand Vista Hotel',
    emoji: '🏨',
    welcome: 'Grand Vista Hotel\'e hoş geldiniz! 🏨 Oda rezervasyonu veya otelimiz hakkında bilgi almak ister misiniz?',
    qr: ['Müsait oda var mı?', 'Fiyatlar nedir?', 'Rezervasyon yapmak istiyorum'],
    fiyat: ['Oda fiyatlarımız (gecelik):\n\n🛏️ Standart oda — ₺1.200\n🌟 Deluxe oda — ₺1.800\n👑 Suite — ₺3.200\n\n✅ Kahvaltı dahil\n🏊 Havuz, SPA, restoran ücretsiz\n\nHangi tarihleri düşünüyorsunuz?'],
    saat: ['Otelimiz bilgileri:\n\n🕑 Check-in: <b>14:00</b>\n🕛 Check-out: <b>12:00</b>\n🍳 Kahvaltı: 07:00–10:00\n🏊 Havuz: 08:00–22:00\n\nErken check-in/geç check-out talep edebilirsiniz (müsaitliğe göre).'],
    randevu: ['Oda rezervasyonu için memnuniyetle yardımcı olurum! 🎉\n\nHangi tarihler arasında konaklayacaksınız ve kaç kişi?', 'Harika! Adınızı, e-posta adresinizi ve oda tercihini alabilir miyim? Rezervasyon onayı e-postayla gönderilecek. ✉️'],
    temsilci: ['Sizi resepsiyon hattıyla bağlantıya geçiriyorum! 🏨\n\n☎️ (0212) XXX XX XX\n📧 rezervasyon@grandvista.com\n\n7/24 hizmetinizdeyiz.'],
    olanaklar: ['Otelimizin olanakları:\n\n🏊 Açık & kapalı yüzme havuzu\n💆 Tam donanımlı SPA & hamam\n🍽️ A la carte restoran\n🏋️ Fitness center\n🅿️ Ücretsiz otopark\n🌐 Ücretsiz WiFi\n\nBaşka merak ettiğiniz var mı? 😊'],
    genel_c: ['Anlıyorum! Grand Vista Hotel olarak unutulmaz bir konaklama deneyimi sunmak için buradayız. Rezervasyon yapmak ister misiniz? 🌟', 'Tabii! Size en güzel odayı ayırmak için elimizden geleni yapacağız. Hangi tarihler uygun?']
  },
  fitness: {
    name: 'PowerFit Gym',
    emoji: '💪',
    welcome: 'PowerFit Gym\'e hoş geldiniz! 💪 Üyelik başlatmak veya deneme seansı için buradayım. Hedeflerinizi konuşalım!',
    qr: ['Deneme seansı istiyorum', 'Üyelik fiyatları?', 'Kişisel antrenör var mı?'],
    fiyat: ['Üyelik paketlerimiz:\n\n📅 Aylık — ₺800\n📆 3 Aylık — ₺2.100 (%12 indirimli)\n🗓️ Yıllık — ₺6.500 (%32 indirimli)\n\n👨‍🏫 Kişisel antrenör — ₺400/seans\n🆓 <b>İlk deneme seansı tamamen ücretsiz!</b>\n\nHangi paket ilginizi çekiyor?'],
    saat: ['Spor salonumuz açık:\n⏰ <b>Her gün 06:00–23:00</b>\n\nYoğun saatler: 17:00–20:00\nSabah seansları için daha sakin ortam! 🌅'],
    randevu: ['Süper! Ücretsiz deneme seansınızı hemen ayarlıyorum 🎯\n\nHangi gün/saat uygun — sabah mı akşam mı tercih edersiniz?', 'Harika! İsminiz ve telefon numaranızı alabilir miyim? Antrenörünüzü ve saatinizi ayarlayalım. 💪'],
    temsilci: ['Sizi üyelik danışmanımıza bağlıyorum! 🏋️\n\n📞 (0212) XXX XX XX\nInstagram: @powerfitgym\n\nSizi tanımak için sabırsızlanıyoruz!'],
    antrenor: ['Uzman antrenörlerimiz:\n\n🏋️ <b>Güç antrenmanı</b> — Mehmet Hoca\n🧘 <b>Yoga & esneklik</b> — Ayşe Hoca\n🥊 <b>Kickboks & kondisyon</b> — Can Hoca\n🏃 <b>Koşu & kardiyo</b> — Zeynep Hoca\n\nHangi branş sizi ilgilendiriyor?'],
    genel_c: ['Anlıyorum! PowerFit olarak her seviyeden sporcuya destek veriyoruz. Hedefinize en hızlı ulaşmanız için buradayız 💪', 'Tabii! Sizi daha iyi tanıyarak en uygun programı oluşturalım. Ücretsiz deneme seansından başlayalım mı?']
  }
};

const quickRepliesMap = {
  genel: ['Fiyatlar nedir?', 'Demo istiyorum', 'Nasıl çalışır?'],
  restoran: ['Masa rezervasyonu', 'Menü nedir?', 'Saat kaçta kapanıyorsunuz?'],
  guzellik: ['Randevu almak istiyorum', 'Hizmet fiyatları?', 'Bu hafta müsait misiniz?'],
  klinik: ['Randevu almak istiyorum', 'Diş beyazlatma fiyatı?', 'Acil muayene'],
  otel: ['Müsait oda var mı?', 'Fiyatlar nedir?', 'Rezervasyon yapmak istiyorum'],
  fitness: ['Deneme seansı istiyorum', 'Üyelik fiyatları?', 'Antrenör var mı?'],
};

let randevuAdim = 0;

function getSmartReply(msg) {
  const s = SDATA[currentSector] || SDATA.genel;
  const t = msg.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c');

  if (randevuAdim === 1) {
    randevuAdim = 2;
    const cevaplar = s.randevu;
    return { text: cevaplar[1] || cevaplar[0], qr: ['Sabah saatleri', 'Öğleden sonra', 'Sizi arayın'] };
  }
  if (randevuAdim === 2) {
    randevuAdim = 0;
    return { text: '✅ Harika! Bilgilerinizi aldım. En kısa sürede sizi arayacağız.\n\nBaşka yardımcı olabileceğim bir konu var mı? 😊', qr: ['Fiyat bilgisi', 'Başka soru sormak istiyorum', 'Teşekkürler'] };
  }

  if (/merhaba|selam|hey|iyi gunler|iyi aksamlar|nasil/.test(t)) {
    return { text: s.welcome, qr: quickRepliesMap[currentSector] || quickRepliesMap.genel };
  }
  if (/fiyat|ucret|ne kadar|para|odeme|tutar|liste|paket|maliyet/.test(t)) {
    const r = s.fiyat?.[0] || 'Fiyat bilgisi için temsilcimizle görüşebilirsiniz.';
    return { text: r, qr: ['Randevu almak istiyorum', 'Temsilciyle görüşmek istiyorum', 'Teşekkürler'] };
  }
  if (/saat|acik|kapali|calisma|muzayene|mesai|ne zaman|kacta/.test(t)) {
    const r = s.saat || 'Çalışma saatlerimiz için lütfen bizi arayın.';
    return { text: r, qr: ['Randevu almak istiyorum', 'Fiyat bilgisi', 'Teşekkürler'] };
  }
  if (/temsilci|yetkili|insan|personel|gorusmek|bagla|arayabilir|telefon/.test(t)) {
    return { text: s.temsilci, qr: ['Randevu almak istiyorum', 'Teşekkürler'] };
  }
  if (/randevu|rezervasyon|bos|musait|ayirt|kayit|seans|demo|ziyaret/.test(t)) {
    randevuAdim = 1;
    const r = s.randevu?.[0] || 'Randevu almak için telefon numaranızı paylaşır mısınız?';
    return { text: r, qr: ['Yarın', 'Bu hafta sonu', 'Haftaya'] };
  }
  if (/tesekkur|sagol|eyval|super|harika|mukemmel|tamam|anladim/.test(t)) {
    return { text: 'Rica ederim! 😊 Başka yardımcı olabileceğim bir şey var mı?', qr: ['Hayır, teşekkürler', 'Bir sorum daha var', 'Demo istiyorum'] };
  }
  if (currentSector === 'restoran' && /menu|yemek|yiyecek|ne var|ne yenir/.test(t)) {
    return { text: s.menu, qr: ['Masa rezervasyonu', 'Fiyat bilgisi', 'Mesai saatleri'] };
  }
  if (currentSector === 'otel' && /olanak|havuz|spa|restoran|wifi|otopark|imkan/.test(t)) {
    return { text: s.olanaklar, qr: ['Rezervasyon yapmak istiyorum', 'Fiyatlar nedir?', 'Check-in saati?'] };
  }
  if (currentSector === 'fitness' && /antrenor|egitmen|hoca|kisisel|pt/.test(t)) {
    return { text: s.antrenor, qr: ['Deneme seansı istiyorum', 'Fiyatlar nedir?', 'Kayıt olmak istiyorum'] };
  }
  if ((currentSector === 'klinik') && /acil|hemen|aci|kriz/.test(t)) {
    return { text: s.acil || s.temsilci, qr: ['Randevu almak istiyorum', 'Teşekkürler'] };
  }

  const gc = s.genel_c || ['Anlıyorum! Size nasıl yardımcı olabilirim?'];
  const pick = gc[Math.floor(Math.random() * gc.length)];
  return { text: pick, qr: quickRepliesMap[currentSector] || quickRepliesMap.genel };
}

// =================== MODAL ===================
function openModal(pkg = '') {
  selectedPkg = pkg;
  const sub = document.getElementById('modalSubText');
  if (sub) sub.textContent = pkg ? `Seçilen paket: ${pkg} — Hemen başlayalım.` : '30 dakikada işletmenize özel demo hazırlıyoruz. Kredi kartı gerekmez.';
  const modal = document.getElementById('demoModal');
  const mForm = document.getElementById('modalForm');
  const mSuccess = document.getElementById('modalSuccess');
  if (modal) modal.classList.add('open');
  if (mForm) mForm.style.display = 'block';
  if (mSuccess) mSuccess.style.display = 'none';
}
function openModalPkg(pkg) { openModal(pkg); }
function closeModal() { document.getElementById('demoModal').classList.remove('open'); }
function closeModalOutside(e) { if (e.target.id === 'demoModal') closeModal(); }

function submitModal() {
  const name = document.getElementById('mName')?.value.trim();
  const phone = document.getElementById('mPhone')?.value.trim();
  const business = document.getElementById('mBusiness')?.value.trim() || '';
  const sector = document.getElementById('mSector')?.value || '';
  if (!name || !phone) { alert('Lütfen adınızı ve telefon numaranızı giriniz.'); return; }
  document.getElementById('modalForm').style.display = 'none';
  document.getElementById('modalSuccess').style.display = 'block';
  emailjs.send('service_boko0mx', 'template_oyjun4t', {
    from_name: name, phone, business, sector, package: selectedPkg || '—',
    message: 'Demo talebi — NexaBot demo sitesi'
  }).catch(()=>{});
}

function submitCtaForm() {
  const name = document.getElementById('ctaName')?.value.trim();
  const phone = document.getElementById('ctaPhone')?.value.trim();
  if (!name || !phone) { alert('Lütfen adınızı ve telefon numaranızı giriniz.'); return; }
  document.querySelector('.cta-form').style.display = 'none';
  document.getElementById('ctaSuccess').style.display = 'block';
  emailjs.send('service_boko0mx', 'template_oyjun4t', {
    from_name: name, phone, business: '—', sector: '—', package: '—',
    message: 'CTA formu — NexaBot demo sitesi'
  }).catch(()=>{});
}

// =================== CHAT ===================
function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  const fab = document.getElementById('chatFab');
  win.classList.toggle('open', chatOpen);
  fab.classList.toggle('active', chatOpen);
  document.getElementById('fabIcon').textContent = chatOpen ? '✕' : '💬';
  document.getElementById('chatNotif').style.display = 'none';
  if (chatOpen && chatHistory.length === 0) initChat();
}
function openChat() { if (!chatOpen) toggleChat(); }

function openChatSector(sector) {
  currentSector = sector;
  document.getElementById('sectorSelect').value = sector;
  chatHistory = []; randevuAdim = 0;
  document.getElementById('chatMessages').innerHTML = '';
  if (!chatOpen) toggleChat(); else initChat();
}

function changeSector() {
  currentSector = document.getElementById('sectorSelect').value;
  chatHistory = []; randevuAdim = 0;
  document.getElementById('chatMessages').innerHTML = '';
  initChat();
}

function initChat() {
  const s = SDATA[currentSector] || SDATA.genel;
  appendMessage('bot', s.welcome);
  showQuickReplies(quickRepliesMap[currentSector] || quickRepliesMap.genel);
}

function appendMessage(role, text) {
  const now = new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'});
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({role: role === 'bot' ? 'assistant' : 'user', content: text});
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'msg bot'; el.id = 'typingIndicator';
  el.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { document.getElementById('typingIndicator')?.remove(); }

function showQuickReplies(replies) {
  const qr = document.getElementById('quickReplies');
  qr.innerHTML = '';
  replies.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply';
    btn.textContent = r;
    btn.onclick = () => { qr.innerHTML = ''; sendMessageText(r); };
    qr.appendChild(btn);
  });
}

function handleChatKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';
  sendMessageText(text);
}

async function sendMessageText(text) {
  if (isTyping) return;
  document.getElementById('quickReplies').innerHTML = '';
  appendMessage('user', text);
  isTyping = true;
  document.getElementById('sendBtn').disabled = true;
  showTyping();
  await new Promise(r => setTimeout(r, 800 + Math.random() * 800));
  hideTyping();
  const result = getSmartReply(text);
  appendMessage('bot', result.text);
  if (result.qr?.length) showQuickReplies(result.qr);
  isTyping = false;
  document.getElementById('sendBtn').disabled = false;
  document.getElementById('chatInput').focus();
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function scrollTo_(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); scrollTo_(a.getAttribute('href')); });
});