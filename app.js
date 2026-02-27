// AgriAtlas PWA - 황소작목반 신철진
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// 3초 후 설치 배너 표시
setTimeout(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('이미 설치됨');
    } else {
        showInstallPrompt();
    }
}, 3000);

function showInstallPrompt() {
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#2E7D32,#1B5E20);color:white;padding:20px;text-align:center;box-shadow:0 -4px 10px rgba(0,0,0,0.3);z-index:9999;';
    banner.innerHTML = '<div style=\"font-size:18px;font-weight:bold;margin-bottom:10px;\">🐄 AgriAtlas 앱으로 설치</div><div style=\"font-size:14px;margin-bottom:15px;\">황소작목반 신철진의 AI 농업 플랫폼</div><button style=\"background:#FFC107;color:#1B5E20;border:none;padding:12px 30px;border-radius:8px;font-weight:bold;cursor:pointer;\" onclick=\"alert(Chrome: 메뉴 → 홈 화면에 추가\\niOS Safari: 공유 → 홈 화면에 추가);this.parentElement.remove();\">설치 방법 보기</button> <button style=\"background:rgba(255,255,255,0.3);color:white;border:none;padding:12px 20px;border-radius:8px;cursor:pointer;margin-left:10px;\" onclick=\"this.parentElement.remove();\">닫기</button>';
    document.body.appendChild(banner);
}

console.log('🐄 황소작목반 신철진 - AgriAtlas PWA');
