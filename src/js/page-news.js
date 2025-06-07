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

    function initNewsList() {
        const buttons = document.querySelectorAll('.filter-buttons .btn');
        const newsList = document.querySelector('.news-list');
        const newsItems = document.querySelectorAll('.news-item');

        buttons.forEach(button => {
        button.addEventListener('click', () => {

            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const type = button.dataset.type;

            newsList.classList.add('fade');

            setTimeout(() => {
                newsItems.forEach(item => {
                    const itemType = item.dataset.type;
                    item.style.display = (type === 'all' || itemType === type) ? '' : 'none';
                });

                newsList.classList.remove('fade');
            }, 300);
        });
        });
    }

})