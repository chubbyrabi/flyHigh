$(function () {
    breadcrumb();
    initNewsList();

    // $('.filter-buttons .btn').on('click', function () {

    //     $('.filter-buttons .btn').removeClass('active');
    //     $(this).addClass('active');

    //     const type = $(this).data('type');

    //     $('.news-item').each(function () {
    //         const $item = $(this);
    //         if (type === 'all' || $item.hasClass(type)) {
    //             $item.show();
    //         } else {
    //             $item.hide();
    //         }
    //     });
    // });
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function initNewsList() {
        const buttons = document.querySelectorAll('.filter-buttons .btn');
        const newsList = document.querySelector('.news-list');
        const newsItems = document.querySelectorAll('.news-item');

        // 取得網址中的 ?type=event
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

        // 點擊事件綁定
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                filterByType(type);
            });
        });

        // 自動篩選（如果有網址參數）
        if (defaultType) {filterByType(defaultType);}
    }

})