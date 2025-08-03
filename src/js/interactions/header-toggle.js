// js/interactions/header-toggle.js

let scrollPosition = 0; // 儲存滾動位置

export function setupHeaderToggle() {
    const buttons = document.querySelectorAll('.hb-btn');
    const header = document.querySelector('.header-hb');
    const menu = document.getElementById('hb_menu');

    if (!header || buttons.length === 0 || !menu) return;

    // 抓取 menu 中所有可聚焦的子元素
    const focusableSelectors = 'a, button, input, textarea, select, [tabindex]';
    const focusableElements = menu.querySelectorAll(focusableSelectors);

    // 設定子元素是否可聚焦（為了解決 aria-hidden 元素仍能被聚焦的問題）
    const setFocusable = (enabled) => {
        focusableElements.forEach(el => {
            if (enabled) {
                el.removeAttribute('tabindex');
            } else {
                el.setAttribute('tabindex', '-1');
            }
        });
    };

    // 開啟 鎖定滾動並儲存滾動位置
    const openMenu = () => {
        scrollPosition = window.scrollY;
        header.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollPosition}px`;

        // 更新 aria 狀態（用於無障礙功能）
        buttons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
        menu.setAttribute('aria-hidden', 'false');
        setFocusable(true); // 允許聚焦
    };

    // 關閉 還原滾動位置
    const closeMenu = () => {
        header.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);

        // 還原 aria 狀態（用於無障礙功能）
        buttons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        menu.setAttribute('aria-hidden', 'true');
        setFocusable(false); // 禁止聚焦
    };

    // 點擊漢堡
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpening = !header.classList.contains('active');
            isOpening ? openMenu() : closeMenu();
        });
    });

    // 按下 Esc 關閉 Menu
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && header.classList.contains('active')) {
            closeMenu();
            console.log('[ESC] scrollPosition:', scrollPosition);
        }
    });

    // 預設先關閉聚焦（初始化時防止 tab 聚焦到隱藏選單）
    setFocusable(false);
}