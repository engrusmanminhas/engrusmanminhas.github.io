/* ============================================================
   Google Analytics 4 loader — planandcontrol.com
   Set GA_ID to your GA4 Measurement ID (Admin → Data streams).
   Until a real ID is set, nothing loads and no data is sent.
   ============================================================ */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; /* TODO: replace with your GA4 Measurement ID */
  if (GA_ID === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
})();
