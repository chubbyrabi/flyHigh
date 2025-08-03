// js/interactions/auto-align.js

export function autoAlignScroll() {

    // 自動捲動容器（置左、置中、置右）
    const els = Array.from(
        document.querySelectorAll('.to-left, .to-center, .to-right')
    );

    function align() {
        els.forEach(el => {
            const max = el.scrollWidth - el.clientWidth;    // 能捲動的最大距（橫向）
            const x = el.classList.contains('to-center')
                ? max / 2
                : el.classList.contains('to-right')
                ? max
                : 0;
            el.scrollLeft = x;
        });
    }

    // 載入後分兩次對齊，以解決內容延遲渲染問題
    [300, 600].forEach(delay => setTimeout(align, delay));
}