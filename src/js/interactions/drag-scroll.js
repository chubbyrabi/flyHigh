// js/interactions/drag-scroll.js

export function enableDragScroll(targets) {

    // 讓目標元素可以透過滑鼠橫向拖曳捲動
    // 並根據捲動位置切換左右邊緣的 class
    // 滑動時加上 .dragging class
    // 防止拖曳後點擊誤觸
    // 判斷是否顯示 .left-active / .right-active
    // 為 .drag-scroll-overlay 設定 CSS 變數 --drag-height

    // 遍歷元素
    targets.forEach(el => {
        let isDown = false;         // 是否按下滑鼠
        let startX;                 // 滑鼠起始點
        let scrollLeft;             // 捲軸位置
        let hasDragged = false;     // 是否在拖曳狀態

        // 按下滑鼠時
        el.addEventListener('mousedown', e => {
            isDown = true;                  // 按下滑鼠了
            hasDragged = false;             // 預設：不在拖曳狀態
            startX = e.pageX;               // 記錄滑鼠起始點
            scrollLeft = el.scrollLeft;     // 當下捲軸位置
            el.classList.add('dragging');   // 滑動時加上 .dragging class
        });

        // 按住滑鼠移動時（開始拖曳）
        el.addEventListener('mousemove', e => {
            if (!isDown) return;

            const deltaX = e.pageX - startX;    // 滑鼠拖曳距離（目前位置 - 起始位置）

            // 若移動超過 3px，才算拖曳（避免誤判點擊）
            if (Math.abs(deltaX) > 3) {
                hasDragged = true;
                el.scrollLeft = scrollLeft - deltaX;
            }
        });

        // 滑鼠放開時（結束拖曳）
        document.addEventListener('mouseup', () => {
            if (isDown) {
                el.classList.remove('dragging');
                // 拖曳後加上 el.dataset.preventClick = 'true'，防止拖曳後觸發點擊
                if (hasDragged) {
                    el.dataset.preventClick = 'true';
                }
            }
            isDown = false;
        });

        // 防止拖曳誤點擊
        el.addEventListener('click', e => {
            if (el.dataset.preventClick === 'true') {
                e.preventDefault();     // 取消連結或按鈕的預設行為
                e.stopPropagation();    // 不再冒泡事件
                el.dataset.preventClick = 'false';
            }
        }, true);

        // 滾動時加上樣式（左 / 右邊緣）
        el.addEventListener('scroll', () => {
            const left = el.scrollLeft;
            const max = el.scrollWidth - el.clientWidth;

            el.classList.toggle('left-active', left > 10);          // 左邊有東西可以滾
            el.classList.toggle('right-active', left < max - 10);   // 右邊有東西可以滾
        });

        // 不能用 mask 的邊緣消失樣式，需要計算容器高度
        if (el.classList.contains('drag-scroll-overlay')) {
            el.style.setProperty('--drag-height', `${el.offsetHeight}px`);
        }

        // 初始化觸發 scroll（刷新邊緣 class）
        setTimeout(() => {
            el.dispatchEvent(new Event('scroll'));
        }, 50);
    });
}