// js/pages/page-news.js
import { breadcrumb } from '../interactions/breadcrumb.js';

export function initPageNews() {
    breadcrumb();
    initNewsList();
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function initNewsList() {
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    const newsList = document.querySelector('.news-list');
    const newsItems = document.querySelectorAll('.news-item');
    const defaultType = getQueryParam('type');

    function filterByType(type) {
        // 切換按鈕樣式
        buttons.forEach(btn => {
            const btnType = btn.dataset.type;
            btn.classList.toggle('active', btnType === type);
        });

        // 加入動畫
        newsList.classList.add('fade');
        requestAnimationFrame(() => {
            setTimeout(() => {
                newsItems.forEach(item => {
                    const itemType = item.dataset.type;
                    item.style.display = (type === 'all' || itemType === type) ? '' : 'none';
                });
                newsList.classList.remove('fade');
            }, 300);
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            filterByType(type);
        });
    });

    if (defaultType) {
        filterByType(defaultType);
    }
}

// 動態載入時執行
initPageNews();