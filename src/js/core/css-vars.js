// js/core/css-vars.js

let isInitialized = false;

export function updateCSSVars() {

    // 避免重複初始化
    // if (isInitialized) return;
    // isInitialized = true;

    // 建立一個 scrollDiv 來計算卷軸寬度
    const scrollDiv = document.createElement('div');
    scrollDiv.style.visibility = 'hidden';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '100px';
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    document.documentElement.style.setProperty('--scrollbar', `${scrollbarWidth}px`);

    // 畫面繪製完成後才讀取樣式與尺寸
    requestAnimationFrame(() => {
        const fz = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.setProperty('--fz', `${fz}px`);

        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // 延遲一點抓 font-size 與 vh（避免畫面還沒渲染完成）
    // setTimeout(() => {
    //     const fz = parseFloat(getComputedStyle(document.documentElement).fontSize);
    //     document.documentElement.style.setProperty('--fz', `${fz}px`);

    //     const vh = window.innerHeight * 0.01;
    //     document.documentElement.style.setProperty('--vh', `${vh}px`);
    // }, 50);
}