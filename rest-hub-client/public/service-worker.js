self.addEventListener('install', (event) => {
  console.log('[SW] 설치됨');
  self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', (event) => {
  console.log('[SW] 활성화됨');
});

self.addEventListener('fetch', (event) => {
  // 캐시 전략 (단순 로그)
  console.log('[SW] 요청됨:', event.request.url);
});
