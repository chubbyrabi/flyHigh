$(function () {
    
    // —————————————————————————————————————————————————— 滾動監聽
    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    $(window).on('scroll', debounce(function () {
        if (!isScrollingByClick) handleScrollAndUpdateNav();
    }, 100));

    // —————————————————————————————————————————————————— 首頁錨點 共用
    let isScrollingByClick = false;
    const links_home = $('.page-home .nav-ul a');
    const totalNum = links_home.length.toString().padStart(2, '0');

    function updateNavActive(index) {
        links_home.parent().removeClass('active').eq(index).addClass('active');
        $('.stage-num span').eq(0).text((index + 1).toString().padStart(2, '0'));
        $('.stage-num span').eq(2).text(totalNum);
    }

    // —————————————————————————————————————————————————— 首頁錨點 Scroll
    function handleScrollAndUpdateNav() {
        const scrollPos = $(window).scrollTop();
        const offsetGap = 100;
        let currentIndex = 0;

        // 更新 nav active
        links_home.each(function (i) {
            const target = $($(this).attr('href'));
            if (target.length && scrollPos >= target.offset().top - offsetGap) {
                currentIndex = i;
            }
        });
        updateNavActive(currentIndex);

        // 更新是否在 opening 區塊
        const $opening = $('#section_opening');
        if ($opening.length) {
            const openingBottom = $opening.offset().top + $opening.outerHeight();
            if (scrollPos + 10 < openingBottom) {
                $('body.page-home').addClass('at-opening');
            } else {
                $('body.page-home').removeClass('at-opening');
            }
        }
    }

    // —————————————————————————————————————————————————— 首頁錨點 Click
    links_home.on('click', function (e) {
        e.preventDefault();

        const $link = $(this);
        const target = $($link.attr('href'));

        if (target.length) {
            isScrollingByClick = true;

            const index = links_home.index($link);
            updateNavActive(index);

            if (index === 0) {
                $('body.page-home').addClass('at-opening');
            }

            // 停止目前所有動畫再執行新的動畫
            $('html, body').stop(true).animate({
                scrollTop: target.offset().top
            }, 600, function () {
                isScrollingByClick = false;
            });
        }
    });
    // ——————————————————————————————————————————————————
})