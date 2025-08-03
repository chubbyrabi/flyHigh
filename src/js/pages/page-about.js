// js/pages/page-about.js

import { breadcrumb } from '../interactions/breadcrumb.js';

export function initPageAbout() {
    breadcrumb();
    initTimeline();
}

// 時間軸
function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    // 根據數量給 class
    timeline.querySelectorAll('.box-top').forEach((boxTop) => {
        const eventCount = boxTop.querySelectorAll('.event').length;
        boxTop.classList.add(`num-${eventCount}`);
    });

    // 展開/收起邏輯
    timeline.addEventListener('click', (e) => {

        // 距離點到的元素最接近的 .timeline-phase
        const phase = e.target.closest('.timeline-phase');
        if (!phase) return;

        const boxTop = phase.querySelector('.box-top');
        if (!boxTop || boxTop.classList.contains('num-1')) return;              // 只有一個不展開

        const isOpen = phase.classList.contains('open');                        // 檢查點到的 phase 有沒有 open
        const openPhases = timeline.querySelectorAll('.timeline-phase.open');   // 所有已經展開的項目

        // 收起其他展開的項目
        openPhases.forEach((open) => {
            // 如果不是這次被點擊的 phase 就關起來
            if (open !== phase) {
                open.classList.remove('open');
                open.style.width = '20vw';                      // 收合的區塊固定寬 20vw
            }
        });

        // 展開動畫
        if (!isOpen) {
            const currentWidth = phase.offsetWidth;             // 取得當下寬度（尚未展開）
            phase.style.width = `${currentWidth}px`;            // 強制先把寬度設成目前寬度，避免馬上跳動畫
            phase.classList.add('open');
            requestAnimationFrame(() => {
                phase.style.transition = 'width 0.3s';
                phase.style.width = `${phase.scrollWidth}px`;   // 把寬度設定為「內容實際寬度」
            });
        // 收合動畫
        } else {
            phase.classList.remove('open');
            phase.style.transition = 'width 0.3s';
            phase.style.width = '20vw';                         // 收合的區塊固定寬 20vw
        }
    });
}

// 動態載入時執行
initPageAbout();