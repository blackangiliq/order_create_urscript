// content.js - يعمل في صفحة Salla Webhooks

// إضافة زر في الصفحة
function addWebhookButton() {
  // البحث عن زر "إضافة جديد"
  const mainBtn = document.querySelector('.btns-row .main-btn');
  
  if (mainBtn && !document.getElementById('custom-webhook-btn')) {
    const buttonHTML = `
      <a href="#" id="custom-webhook-btn" class="btn btn-tiffany btn-rounded btn-xlg" style="margin-left: 10px;">
        <i class="sicon-arrow-merge"></i>
        إرسال Order.Created
      </a>
    `;
    
    mainBtn.insertAdjacentHTML('beforeend', buttonHTML);
    
    // إضافة event listener للزر
    document.getElementById('custom-webhook-btn').addEventListener('click', function(e) {
      e.preventDefault();
      sendOrderCreatedWebhook();
    });
  }
}

// دالة إرسال الـ webhook
async function sendOrderCreatedWebhook(customUrl = null) {
  try {
    // الحصول على الـ token من الصفحة
    const csrfToken = document.querySelector('meta[name="_token"]')?.getAttribute('content');
    const authToken = window.token?.key;
    
    if (!csrfToken || !authToken) {
      showNotification('خطأ: لم يتم العثور على الـ tokens المطلوبة', 'error');
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
    formData.append('event', 'order.created');
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

// تشغيل الكود عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addWebhookButton);
} else {
  addWebhookButton();
}

// مراقبة التغييرات في الصفحة (في حالة التحميل الديناميكي)
const observer = new MutationObserver(function(mutations) {
  addWebhookButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

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

