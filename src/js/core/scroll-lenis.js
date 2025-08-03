// js/core/scroll-lenis.js

import Lenis from '../../library/lenis.mjs';

let lenisInstance = null;               // 宣告全域變數，儲存 Lenis 實例（instance）

export function initLenis() {
    lenisInstance = new Lenis({
        smooth: true,                   // 啟用平滑滾動
        wheelMultiplier: 1.2,           // 滾輪滾動加速度（越大越快）
        lerp: 0.08                      // 緩動速率（值越小越慢越平滑）
    });

    requestAnimationFrame(function raf(time) {
        lenisInstance.raf(time);        // 讓 Lenis 在每一幀更新滾動
        requestAnimationFrame(raf);     // 持續遞迴呼叫
    });
}

// 提供給其他模組呼叫 Lenis 實例
export function getLenis() {
    return lenisInstance;
}

// 讓外部能直接使用 lenis
export { lenisInstance as lenis };