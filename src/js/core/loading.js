// js/core/loading.js

export function setupPageLoading(callback) {

    // 取得載入開始的時間
    const loadingStart = performance.now();

    window.addEventListener('load', () => {
        const loadingEnd = performance.now();           // 取得載入完成的時間
        const timePassed = loadingEnd - loadingStart;   // 載入耗時多久
        const minDisplayTime = 500;                     // 定義 loading 畫面最短要顯示多久
        const delay = timePassed < minDisplayTime ? minDisplayTime - timePassed : 0;    // 如果頁面太快載完，故意延遲一點

        setTimeout(() => {
            document.body.classList.remove('hidden');
            document.querySelector('.mask')?.classList.remove('loading');
            waitForScrollablePage(() => {
                callback?.();
                window.dispatchEvent(new Event('LenisReady'));  // lenis 初始化完通知其他頁
            });
        }, delay);
    });
}

// 檢查頁面是否可以捲動，最多重試 10 次
function waitForScrollablePage(callback, attempts = 10) {

    //  檢查目前頁面高度是否比視窗高（代表能捲動）
    const isScrollable = document.documentElement.scrollHeight > window.innerHeight;

    if (isScrollable || attempts <= 0) {
        callback?.();
    } else {
        setTimeout(() => {
            waitForScrollablePage(callback, attempts - 1);
        }, 50);     // 每 50ms 檢查一次
    }
}