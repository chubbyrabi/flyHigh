// js/core/device.js

export function detectDeviceType() {
    const MOBILE_MAX_WIDTH = 767;               // 手機最大寬度（直式手機）
    const LANDSCAPE_MOBILE_MAX_WIDTH = 900;     // 橫式手機的最大寬度
    const LANDSCAPE_MOBILE_MAX_HEIGHT = 500;    // 橫式手機的最大高度（高度較矮，判斷為手機）
    const PAD_MIN_WIDTH = 768;                  // 平板的最小寬度
    const PAD_MAX_WIDTH = 1280;                 // 平板的最大寬度（更大的視為PC版）
    const PAD_MIN_HEIGHT = 700;                 // 平板的最小高度
    const PAD_MAX_ASPECT_RATIO = 1.6;           // 平板允許的最大寬高比（例如橫式寬螢幕）
    const PAD_MIN_ASPECT_RATIO = 0.5;           // 平板允許的最小寬高比（例如較窄直式平板）

    const ua = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const body = document.body;

    body.classList.remove('device-mobile', 'device-pad', 'device-pc');

    const isMobileUA = /iphone|ipod|android.*mobile|windows phone/.test(ua);
    const isMobileSize = width <= MOBILE_MAX_WIDTH || (width <= LANDSCAPE_MOBILE_MAX_WIDTH && height <= LANDSCAPE_MOBILE_MAX_HEIGHT);
    const isTabletSize = width >= PAD_MIN_WIDTH && width <= PAD_MAX_WIDTH;
    const isTabletAspect = aspectRatio <= PAD_MAX_ASPECT_RATIO && aspectRatio >= PAD_MIN_ASPECT_RATIO;
    const isTabletHeight = height >= PAD_MIN_HEIGHT;

    if (isMobileUA || isMobileSize) {
        body.classList.add('device-mobile');
        onMobile();
    } else if (isTabletSize && isTabletAspect && isTabletHeight) {
        body.classList.add('device-pad');
        onMobile();
    } else {
        body.classList.add('device-pc');
        onPC();
    }
}

function onMobile() {

    // 首頁News class
    const homeSectionNews = document.getElementById('section_news');
    if (!homeSectionNews) return;
    homeSectionNews.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('col-6')) {
            card.classList.add('col-6');
        }
    });
}

function onPC() {

    // 漢堡選單 class
    const hbMenu = document.getElementById('hb_menu');
    if (!hbMenu) return;
    hbMenu.querySelector('.card-list')?.classList.add('row');
    hbMenu.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('col-3')) {
            card.classList.add('col-3');
        }
    });

    // 首頁 About class
    const homeSectionAbout = document.getElementById('section_about');
    if (!homeSectionAbout) return;
    homeSectionAbout.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('col-4')) {
            card.classList.add('col-4');
        }
    });

    // 首頁 News class
    const homeSectionNews = document.getElementById('section_news');
    if (!homeSectionNews) return;
    homeSectionNews.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('col-4')) {
            card.classList.add('col-4');
        }
    });

}