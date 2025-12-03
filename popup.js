// popup.js - منطق واجهة الـ popup

document.addEventListener('DOMContentLoaded', function() {
  const sendBtn = document.getElementById('sendBtn');
  const status = document.getElementById('status');
  const webhookUrl = document.getElementById('webhookUrl');
  const pageWarning = document.getElementById('pageWarning');
  
  // التحقق من أن المستخدم في الصفحة الصحيحة
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (!currentTab.url.includes('s.salla.sa/settings/component/webhooks')) {
      pageWarning.style.display = 'block';
      sendBtn.disabled = true;
    }
  });
  
  // حفظ URL عند التغيير
  webhookUrl.addEventListener('change', function() {
    chrome.storage.sync.set({webhookUrl: webhookUrl.value});
  });
  
  // تحميل URL المحفوظ
  chrome.storage.sync.get(['webhookUrl'], function(result) {
    if (result.webhookUrl) {
      webhookUrl.value = result.webhookUrl;
    }
  });
  
  sendBtn.addEventListener('click', async function() {
    const url = webhookUrl.value.trim();
    
    if (!url) {
      showStatus('الرجاء إدخال URL صحيح', 'error');
      return;
    }
    
    sendBtn.disabled = true;
    showStatus('جاري الإرسال...', 'loading');
    
    try {
      // الحصول على التبويب النشط
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('s.salla.sa/settings/component/webhooks')) {
        showStatus('خطأ: يرجى فتح صفحة Webhooks في Salla', 'error');
        sendBtn.disabled = false;
        return;
      }
      
      // إرسال رسالة لـ content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'sendWebhook',
        url: url
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('خطأ: ' + chrome.runtime.lastError.message, 'error');
          sendBtn.disabled = false;
          return;
        }
        
        if (response && response.success) {
          showStatus('✓ تم الإرسال بنجاح!', 'success');
          setTimeout(() => {
            sendBtn.disabled = false;
          }, 2000);
        } else {
          showStatus('خطأ: ' + (response?.error || 'فشل الإرسال'), 'error');
          sendBtn.disabled = false;
        }
      });
      
    } catch (error) {
      showStatus('خطأ: ' + error.message, 'error');
      sendBtn.disabled = false;
    }
  });
  
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
  }
});

