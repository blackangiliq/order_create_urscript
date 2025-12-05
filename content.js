// content.js - يعمل في صفحة Salla Webhooks

// إضافة زر في الصفحة
function addWebhookButton() {
  // البحث عن مكان مناسب لإضافة الزر
  let targetElement = document.querySelector('.btns-row .main-btn');
  
  // إذا لم يُعثر عليه، جرب أماكن أخرى
  if (!targetElement) {
    targetElement = document.querySelector('.btns-row');
  }
  
  if (!targetElement) {
    targetElement = document.querySelector('.page-header');
  }
  
  if (!targetElement) {
    targetElement = document.querySelector('.s-page-header-controls');
  }
  
  if (targetElement && !document.getElementById('custom-webhook-btn')) {
    const buttonHTML = `
      <div style="display: inline-block; margin-left: 10px;">
        <a href="#" id="custom-webhook-btn" class="btn btn-tiffany btn-rounded btn-xlg" 
           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
          <i class="sicon-arrow-merge"></i>
          <span>إرسال Order.Created</span>
        </a>
        <a href="#" id="debug-tokens-btn" class="btn btn-rounded" 
           style="background: #f0f0f0; color: #666; padding: 8px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; margin-right: 5px; font-size: 12px;">
          <i class="sicon-bug"></i>
          تشخيص
        </a>
      </div>
    `;
    
    targetElement.insertAdjacentHTML('beforeend', buttonHTML);
    
    // إضافة event listeners
    const sendBtn = document.getElementById('custom-webhook-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sendOrderCreatedWebhook();
      });
      
      // إضافة hover effect
      sendBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
      });
      
      sendBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
      });
    }
    
    // زر التشخيص
    const debugBtn = document.getElementById('debug-tokens-btn');
    if (debugBtn) {
      debugBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showTokenDebugInfo();
      });
    }
  }
}

// دالة لعرض معلومات التشخيص
function showTokenDebugInfo() {
  const csrfToken = getCsrfToken();
  const authToken = getAuthToken();
  
  const debugInfo = `
🔍 معلومات التشخيص - Salla Webhook Extension
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CSRF Token: ${csrfToken ? '✅ موجود' : '❌ غير موجود'}
${csrfToken ? `   البداية: ${csrfToken.substring(0, 30)}...
   الطول: ${csrfToken.length} حرف` : '   ⚠️ لم يتم العثور عليه'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 Auth Token: ${authToken ? '✅ موجود' : '❌ غير موجود'}
${authToken ? `   البداية: ${authToken.substring(0, 40)}...
   الطول: ${authToken.length} حرف
   النوع: ${authToken.startsWith('v4.public.') ? 'PASETO v4' : 'Unknown'}` : '   ⚠️ لم يتم العثور عليه'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 إحصائيات:
   Meta Tags: ${document.querySelectorAll('meta[name]').length}
   Forms: ${document.querySelectorAll('form').length}
   Cookies: ${document.cookie.split(';').length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${!csrfToken || !authToken ? `
⚠️ الحلول المقترحة:
   1. أعد تحميل الصفحة (F5)
   2. تأكد من تسجيل الدخول
   3. امسح الكوكيز وأعد المحاولة
   4. افتح Console (F12) للتفاصيل
` : '✅ جاهز للإرسال!'}

تم طباعة التفاصيل الكاملة في Console (F12)
  `.trim();
  
  // طباعة معلومات مفصلة في Console
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 Salla Webhook Extension - Debug Info');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📌 CSRF Token:', csrfToken || 'NOT FOUND');
  console.log('\n🔑 Auth Token:', authToken || 'NOT FOUND');
  console.log('\n📝 Meta Tags:');
  console.table(Array.from(document.querySelectorAll('meta[name]')).map(m => ({
    name: m.getAttribute('name'),
    hasContent: !!m.getAttribute('content'),
    contentPreview: m.getAttribute('content')?.substring(0, 30) + '...'
  })));
  console.log('\n🍪 Cookies:');
  console.table(document.cookie.split(';').map(c => {
    const [name, value] = c.trim().split('=');
    return {
      name,
      hasValue: !!value,
      valuePreview: value?.substring(0, 30) + '...'
    };
  }));
  console.log('\n🌐 Window Objects:');
  console.log('   window.token:', window.token);
  console.log('   window.Laravel:', window.Laravel);
  console.log('   window.__SALLA__:', window.__SALLA__);
  console.log('\n💾 LocalStorage Keys:', Object.keys(localStorage));
  console.log('\n📋 Forms:', document.querySelectorAll('form').length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // عرض النتائج
  if (typeof swal !== 'undefined') {
    swal({
      title: '🔍 معلومات التشخيص',
      text: debugInfo,
      type: 'info',
      confirmButtonText: 'موافق'
    });
  } else {
    alert(debugInfo);
  }
}

// دالة للحصول على CSRF Token بطرق متعددة
function getCsrfToken() {
  // الطريقة 1: من meta tag csrf-token
  let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    console.log('CSRF Token found via meta[name="csrf-token"]');
    return token;
  }
  
  // الطريقة 2: من meta tag _token
  token = document.querySelector('meta[name="_token"]')?.getAttribute('content');
  if (token) {
    console.log('CSRF Token found via meta[name="_token"]');
    return token;
  }
  
  // الطريقة 3: من input hidden في أي form
  token = document.querySelector('input[name="_token"]')?.value;
  if (token) {
    console.log('CSRF Token found via input[name="_token"]');
    return token;
  }
  
  // الطريقة 4: من window object
  if (window.Laravel && window.Laravel.csrfToken) {
    console.log('CSRF Token found via window.Laravel.csrfToken');
    return window.Laravel.csrfToken;
  }
  
  // الطريقة 5: من XSRF-TOKEN cookie
  const xsrfCookie = getCookie('XSRF-TOKEN');
  if (xsrfCookie) {
    console.log('CSRF Token found via XSRF-TOKEN cookie');
    return decodeURIComponent(xsrfCookie);
  }
  
  // الطريقة 6: محاولة فتح modal والحصول على token منه
  const modalForm = document.querySelector('#webhook-modal form, .modal form');
  if (modalForm) {
    const modalToken = modalForm.querySelector('input[name="_token"]')?.value;
    if (modalToken) {
      console.log('CSRF Token found via modal form');
      return modalToken;
    }
  }
  
  // الطريقة 7: البحث في جميع forms
  const forms = document.querySelectorAll('form');
  for (let form of forms) {
    const formToken = form.querySelector('input[name="_token"]')?.value;
    if (formToken) {
      console.log('CSRF Token found via form element');
      return formToken;
    }
  }
  
  console.error('CSRF Token not found!');
  return null;
}

// دالة مساعدة للحصول على cookie
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

// دالة للحصول على Authorization Token
function getAuthToken() {
  // الطريقة 1: من cookie s_domains_token (الطريقة الأكثر موثوقية لـ Salla)
  const domainsToken = getCookie('s_domains_token');
  if (domainsToken && domainsToken.startsWith('v4.public.')) {
    console.log('Auth Token found via s_domains_token cookie');
    return domainsToken;
  }
  
  // الطريقة 2: من window.token
  if (window.token && window.token.key) {
    console.log('Auth Token found via window.token.key');
    return window.token.key;
  }
  
  // الطريقة 3: من window object
  if (window.Laravel && window.Laravel.token) {
    console.log('Auth Token found via window.Laravel.token');
    return window.Laravel.token;
  }
  
  // الطريقة 4: من localStorage
  try {
    const storageKeys = ['authToken', 'token', 'auth_token', 'access_token', 's_token'];
    for (let key of storageKeys) {
      const token = localStorage.getItem(key);
      if (token && token.startsWith('v4.public.')) {
        console.log(`Auth Token found via localStorage.${key}`);
        return token;
      }
    }
  } catch (e) {
    console.error('localStorage access error:', e);
  }
  
  // الطريقة 5: محاولة الحصول عليه من أي cookie يحتوي على "token"
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if ((name.includes('token') || name.includes('auth')) && value) {
      const decodedValue = decodeURIComponent(value);
      if (decodedValue.startsWith('v4.public.')) {
        console.log(`Auth Token found via cookie: ${name}`);
        return decodedValue;
      }
    }
  }
  
  // الطريقة 6: من window.__SALLA__
  if (window.__SALLA__ && window.__SALLA__.token) {
    console.log('Auth Token found via window.__SALLA__.token');
    return window.__SALLA__.token;
  }
  
  console.error('Auth Token not found!');
  return null;
}

// دالة إرسال الـ webhook
async function sendOrderCreatedWebhook(customUrl = null) {
  try {
    // الحصول على الـ token من الصفحة
    const csrfToken = getCsrfToken();
    const authToken = getAuthToken();
    
    console.log('CSRF Token found:', csrfToken ? 'Yes' : 'No');
    console.log('Auth Token found:', authToken ? 'Yes' : 'No');
    
    if (!csrfToken) {
      const errorMsg = `
❌ خطأ: لم يتم العثور على CSRF Token

الحلول:
1. أعد تحميل الصفحة (F5)
2. تأكد من تسجيل الدخول
3. افتح Console (F12) لمزيد من التفاصيل
4. اضغط زر "تشخيص" للمزيد من المعلومات
      `.trim();
      
      showNotification(errorMsg, 'error');
      console.error('=== CSRF Token Debug Info ===');
      console.error('Available meta tags:', Array.from(document.querySelectorAll('meta[name]')).map(m => ({
        name: m.getAttribute('name'),
        content: m.getAttribute('content')?.substring(0, 20) + '...'
      })));
      console.error('Forms found:', document.querySelectorAll('form').length);
      console.error('Hidden inputs:', Array.from(document.querySelectorAll('input[name="_token"]')).map(i => i.value?.substring(0, 20) + '...'));
      return;
    }
    
    if (!authToken) {
      const errorMsg = `
❌ خطأ: لم يتم العثور على Auth Token

الحلول:
1. أعد تسجيل الدخول
2. امسح الكوكيز وأعد تسجيل الدخول
3. افتح Console (F12) لمزيد من التفاصيل
4. اضغط زر "تشخيص" للمزيد من المعلومات
      `.trim();
      
      showNotification(errorMsg, 'error');
      console.error('=== Auth Token Debug Info ===');
      console.error('window.token:', window.token);
      console.error('window.Laravel:', window.Laravel);
      console.error('Cookies:', document.cookie.split(';').map(c => c.trim().split('=')[0]));
      console.error('localStorage keys:', Object.keys(localStorage));
      return;
    }

    // الحصول على URL من storage أو استخدام الافتراضي
    let webhookUrl = customUrl || 'https://urscript.shop:3000/webhook';
    
    if (!customUrl && typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.sync.get(['webhookUrl']);
      if (result.webhookUrl) {
        webhookUrl = result.webhookUrl;
      }
    }

    // إنشاء FormData
    const formData = new FormData();
    formData.append('_token', csrfToken);
    formData.append('webhook_id', '');
    formData.append('name', 'انشاء الطلب');
    formData.append('event', 'dashboard::order.created');
    formData.append('version', '2');
    formData.append('rule', '');
    formData.append('url', webhookUrl);

    showNotification('جاري إرسال الطلب...', 'info');

    // إرسال الطلب
    const response = await fetch('https://s.salla.sa/settings/component/webhooks', {
      method: 'POST',
      headers: {
        'X-Csrf-Token': csrfToken,
        'Authorization': `Bearer ${authToken}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'S-Legacy': 'true'
      },
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();
    
    if (response.ok) {
      showNotification('تم إرسال الـ webhook بنجاح! ✓', 'success');
      // إعادة تحميل الصفحة بعد 2 ثانية
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      showNotification(`خطأ: ${result.message || 'فشل الإرسال'}`, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification(`خطأ: ${error.message}`, 'error');
  }
}

// دالة عرض الإشعارات
function showNotification(message, type = 'info') {
  // استخدام sweetalert2 إذا كان متاحاً
  if (typeof swal !== 'undefined') {
    const iconType = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
    swal({
      text: message,
      type: iconType,
      timer: type === 'info' ? 1500 : 3000,
      showConfirmButton: type !== 'info',
      confirmButtonText: 'موافق'
    });
  } else {
    alert(message);
  }
}

// دالة لإضافة order.created إلى القائمة المنسدلة
function addOrderCreatedToDropdown() {
  const eventSelect = document.querySelector('select[name="event"]');
  
  if (!eventSelect) {
    console.log('Event select not found');
    return;
  }
  
  // التحقق من عدم وجود الخيار مسبقاً
  const existingOption = eventSelect.querySelector('option[value="dashboard::order.created"]');
  if (existingOption) {
    console.log('dashboard::order.created already exists in dropdown');
    return;
  }
  
  // إضافة الخيار إلى <select>
  const option = document.createElement('option');
  option.value = 'dashboard::order.created';
  option.textContent = '🆕 إنشاء طلب جديد (Order Created)';
  
  // إضافته بعد أول option (اختر نوع الحدث)
  const firstOption = eventSelect.querySelector('option[disabled]');
  if (firstOption && firstOption.nextSibling) {
    eventSelect.insertBefore(option, firstOption.nextSibling);
  } else {
    eventSelect.appendChild(option);
  }
  
  // إضافة الخيار إلى Bootstrap Select dropdown
  const bootstrapDropdown = eventSelect.closest('.input-group')?.querySelector('.dropdown-menu ul');
  if (bootstrapDropdown) {
    const li = document.createElement('li');
    li.setAttribute('data-original-index', '1'); // بعد الخيار الأول
    
    const a = document.createElement('a');
    a.tabIndex = 0;
    a.setAttribute('role', 'option');
    a.setAttribute('aria-disabled', 'false');
    a.setAttribute('aria-selected', 'false');
    a.href = '#';
    
    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = '🆕 إنشاء طلب جديد (Order Created)';
    
    const checkmark = document.createElement('span');
    checkmark.className = 'glyphicon glyphicon-ok check-mark';
    
    a.appendChild(span);
    a.appendChild(checkmark);
    li.appendChild(a);
    
    // إضافته بعد أول li
    const firstLi = bootstrapDropdown.querySelector('li.disabled');
    if (firstLi && firstLi.nextSibling) {
      bootstrapDropdown.insertBefore(li, firstLi.nextSibling);
    } else {
      bootstrapDropdown.appendChild(li);
    }
    
    // إضافة event listener للنقر
    a.addEventListener('click', function(e) {
      e.preventDefault();
      
      // تحديث select
      eventSelect.value = 'dashboard::order.created';
      
      // تحديث عرض Bootstrap Select
      const filterOption = eventSelect.closest('.input-group')?.querySelector('.filter-option');
      if (filterOption) {
        filterOption.textContent = '🆕 إنشاء طلب جديد (Order Created)';
      }
      
      // إزالة selected من جميع العناصر
      bootstrapDropdown.querySelectorAll('li').forEach(item => {
        item.classList.remove('selected');
        const link = item.querySelector('a');
        if (link) link.setAttribute('aria-selected', 'false');
      });
      
      // إضافة selected لهذا العنصر
      li.classList.add('selected');
      a.setAttribute('aria-selected', 'true');
      
      // إغلاق القائمة
      const dropdown = eventSelect.closest('.input-group')?.querySelector('.dropdown-menu');
      if (dropdown) dropdown.classList.remove('open');
    });
    
    console.log('✅ order.created added to dropdown successfully');
  }
  
  // إعادة تهيئة Bootstrap Select إذا كانت متاحة
  if (typeof $ !== 'undefined' && $.fn.selectpicker) {
    try {
      $(eventSelect).selectpicker('refresh');
      console.log('Bootstrap Select refreshed');
    } catch (e) {
      console.log('Could not refresh selectpicker:', e);
    }
  }
}

// مراقبة فتح الـ modal
function watchForModal() {
  // مراقبة ظهور modal
  const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          // التحقق من modal
          if (node.classList && (node.classList.contains('modal') || node.querySelector('.modal'))) {
            setTimeout(() => {
              addOrderCreatedToDropdown();
            }, 500);
          }
        }
      });
    });
  });
  
  modalObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // أيضاً مراقبة تغيير class على modal الموجود مسبقاً
  const existingModals = document.querySelectorAll('.modal');
  existingModals.forEach(modal => {
    const classObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (modal.classList.contains('in') || modal.style.display === 'block') {
            setTimeout(() => {
              addOrderCreatedToDropdown();
            }, 500);
          }
        }
      });
    });
    
    classObserver.observe(modal, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  });
  
  // مراقبة النقر على أي زر لفتح modal
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-toggle="modal"], .main-btn, .btn');
    if (target) {
      setTimeout(() => {
        addOrderCreatedToDropdown();
      }, 800);
    }
  });
  
  console.log('✅ Modal watcher initialized');
}

// تشغيل الكود عند تحميل الصفحة
function initExtension() {
  console.log('🚀 Salla Webhook Extension: Initializing...');
  
  // محاولة إضافة الزر بعد تأخير بسيط
  setTimeout(() => {
    addWebhookButton();
    console.log('✅ Salla Webhook Extension: Button added');
  }, 1000);
  
  // محاولة أخرى بعد 3 ثواني
  setTimeout(() => {
    addWebhookButton();
  }, 3000);
  
  // بدء مراقبة modal
  watchForModal();
  
  // محاولة إضافة order.created إذا كان modal مفتوحاً بالفعل
  setTimeout(() => {
    addOrderCreatedToDropdown();
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}

// مراقبة التغييرات في الصفحة (في حالة التحميل الديناميكي)
let buttonCheckCount = 0;
const maxButtonChecks = 10;

const observer = new MutationObserver(function(mutations) {
  if (buttonCheckCount < maxButtonChecks && !document.getElementById('custom-webhook-btn')) {
    addWebhookButton();
    buttonCheckCount++;
  }
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  window.addEventListener('load', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// log للتأكد من التحميل
console.log('✅ Salla Webhook Extension: Content script loaded');

// الاستماع للرسائل من popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendWebhook') {
    sendOrderCreatedWebhook(request.url).then(() => {
      sendResponse({success: true});
    }).catch(error => {
      sendResponse({success: false, error: error.message});
    });
    return true; // للحفاظ على القناة مفتوحة للرد غير المتزامن
  }
});

