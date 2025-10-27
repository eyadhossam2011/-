// عام: تحكم بالتدفق، إرسال إلى webhook، وحماية الصفحات عبر localStorage
const WEBHOOK_URL = "https://discord.com/api/webhooks/1432480436864684145/5BEHwBpPhEmkzlY1f2gSdbEZGStN9_n5R94oOT_0sXCdMY1wkW6tIvKMHkdksOIk1OOv"; // ضع هنا رابط الـWebhook في جهازك بعد التنزيل
const ACCESS_KEY = "𝔸𝕔𝕔𝕖𝕡𝕥𝕖𝕕 𝕒𝕔𝕔𝕠𝕦𝕟𝕥";

function sendToWebhook(content) {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes('PUT_YOUR_WEBHOOK_HERE')) {
    console.warn('Webhook غير مفعّل - ضع رابط الـWebhook في script.js');
    return Promise.resolve({ok:false});
  }
  return fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({content})
  });
}

// ---------- index.html logic ----------
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', ()=>{
    // elements
    const applyBlock = document.getElementById('apply-block');
    const afterApply = document.getElementById('after-apply');
    const mainMenu = document.getElementById('main-menu');

    const applied = localStorage.getItem('venom_applied') === 'true';
    const accepted = localStorage.getItem('venom_accepted') === 'true';

    // if not on index, skip
    if (!document.getElementById('discord-form')) return;

    if (!applied) {
      applyBlock.classList.remove('hidden');
      afterApply.classList.add('hidden');
      mainMenu.classList.add('hidden');
    } else {
      // بعد التقديم: نعرض الواجهة لكن نغلق صفحات محمية إذا لم يقبل
      applyBlock.classList.add('hidden');
      afterApply.classList.remove('hidden');
      mainMenu.classList.remove('hidden');
      // تعطيل خيارات ما لم يتم القبول
      if (!accepted) {
        document.getElementById('btn-mc').classList.add('disabled');
        document.getElementById('btn-admin').classList.add('disabled');
      } else {
        document.getElementById('btn-mc').classList.remove('disabled');
        document.getElementById('btn-admin').classList.remove('disabled');
      }
    }

    // form send
    const discordForm = document.getElementById('discord-form');
    discordForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = new FormData(discordForm);
      const payload = `**نوع التقديم:** ديسكورد\n**الاسم:** ${data.get('name')}\n**العمر:** ${data.get('age')}\n**السبب:** ${data.get('reason')}`;
      await sendToWebhook(payload);
      localStorage.setItem('venom_applied','true');
      // عرض شاشة بعد الإرسال
      applyBlock.classList.add('hidden');
      afterApply.classList.remove('hidden');
      mainMenu.classList.remove('hidden');
      // تعطيل صفحات محمية لحد الكود
      document.getElementById('btn-mc').classList.add('disabled');
      document.getElementById('btn-admin').classList.add('disabled');
    });
  });
}

// ---------- key.html logic ----------
if (typeof window !== 'undefined' && document.getElementById('key-form')){
  document.getElementById('key-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const key = e.target.key.value.trim();
    if (key === ACCESS_KEY) {
      localStorage.setItem('venom_accepted','true');
      alert('تم التفعيل! يمكنك الآن الوصول إلى باقي صفحات الموقع.');
      window.location.href = 'minecraft.html';
    } else {
      alert('الكود غير صحيح. تأكد من الكود الذي أرسله لك الأدمن.');
    }
  });
}

// ---------- protected pages logic (admin.html & minecraft.html) ----------
if (typeof window !== 'undefined' && (location.pathname.endsWith('admin.html') || location.pathname.endsWith('minecraft.html'))){
  const accepted = localStorage.getItem('venom_accepted') === 'true';
  if (!accepted) {
    alert('الوصول محجوب. يجب عليك التقديم على سيرفر الديسكورد والحصول على كود دخول من الأدمن.');
    window.location.href = 'index.html';
  }
}

// ---------- admin form ----------
if (typeof window !== 'undefined' && document.getElementById('admin-form')){
  document.getElementById('admin-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = `**نوع التقديم:** إدارة\n**الاسم:** ${data.get('name')}\n**العمر:** ${data.get('age')}\n**الخبرة:** ${data.get('experience')}\n**الوقت:** ${data.get('time')}`;
    await sendToWebhook(payload);
    alert('تم إرسال طلبك. انتظر موافقة الأدمن.');
    e.target.reset();
  });
}

// ---------- mc form ----------
if (typeof window !== 'undefined' && document.getElementById('mc-form')){
  document.getElementById('mc-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = `**نوع التقديم:** ماينكرافت\n**الاسم:** ${data.get('name')}\n**الإصدار:** ${data.get('version')}\n**حمل النسخة؟:** ${data.get('downloaded')}`;
    await sendToWebhook(payload);
    alert('تم إرسال طلب الانضمام للسيرفر. انتظر موافقة الأدمن.');
    e.target.reset();
  });
              }
