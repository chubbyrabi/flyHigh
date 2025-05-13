$(function () {
    
    // —————————————————————————————————————————————————— 滾動監聽
    // function debounce(func, wait = 100) {
    //     let timeout;
    //     return function (...args) {
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => func.apply(this, args), wait);
    //     };
    // }
    // $(window).on('scroll', debounce(function () {
    //     if (!isScrollingByClick) handleScrollAndUpdateNav();
    // }, 100));

    // —————————————————————————————————————————————————— 滾動監聽 lenis
    const lenis = new Lenis({
        smooth: true,
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothTouch: false,
    })
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', () => {
        if (!isScrollingByClick) handleScrollAndUpdateNav();
    });

    // —————————————————————————————————————————————————— 計算元素 top (有定位或旋轉時)
    // let docH =   $(document).height();       // 整份文件高度
    // let winH =   $(window).height();         // 視窗高度
    // let winW =   $(window).width();          // 視窗寬度
    // let scrTop = $(window).scrollTop();      // 被卷出視窗的高度
    // let objH =   $('section').outerHeight(); // 元素本身的高度
    // let objTop = $('section').offset().top;  // 元素'頂端'離文件頂部距離
    // let objBtop = objTop + objH;             // 元素'底端'離文件頂部距離

    function getOffsetTop(element){
        // var offsetLeft = 0;
        var offsetTop  = 0;
        while(element){
            // offsetLeft += element.offsetLeft;
            offsetTop  += element.offsetTop;
            element = element.offsetParent;
        }
        // return [offsetLeft, offsetTop];
        return [offsetTop];
    }
    
    // —————————————————————————————————————————————————— 首頁錨點 共用
    let isScrollingByClick = false;
    const links_home = $('.page-home .nav-ul a');
    const section_home = $('main section');
    const totalNum = links_home.length.toString().padStart(2, '0');

    function updateNavActive(index) {
        links_home.parent().removeClass('active').eq(index).addClass('active');
        // section_home.parent().removeClass('active').eq(index).addClass('active');
        $('.stage-num span').eq(0).text((index + 1).toString().padStart(2, '0'));
        $('.stage-num span').eq(2).text(totalNum);
    }

    // —————————————————————————————————————————————————— 首頁錨點 Scroll
    function handleScrollAndUpdateNav() {
        // const scrTop = $(window).scrollTop();
        // const winH = $(window).height();
        const scrTop = window.scrollY;      // 配合 Lenis 改用 scrollY 較標準
        const winH = window.innerHeight;
        let currentIndex = -1;

        // 更新 nav active
        section_home.each(function (i) {
            const objTop = getOffsetTop(this);

            if (objTop - scrTop <= winH / 2) {
                currentIndex = i;
            }
        });

        // 如果有更新 currentIndex 就更新 nav
        if (currentIndex !== -1) {
            updateNavActive(currentIndex);
        }

        // 是否在 opening 區塊
        const $opening = $('#section_opening');
        if ($opening.length) {
            const objTop = $opening.offset().top;
            const objH = $opening.outerHeight();
            const objBtop = objTop + objH;

            if (objBtop - scrTop >= winH / 2) {
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
            // $('html, body').stop(true).animate({
            //     scrollTop: target.offset().top
            // }, 600, function () {
            //     isScrollingByClick = false;
            // });

            // 改用 Lenis 滾動
            lenis.scrollTo(target[0], {
                offset: 0,
                duration: 1.2, // 動畫秒數
                easing: (t) => 1 - Math.pow(1 - t, 4) // 緩動曲線 (可改)
            });

            // 這段可選，因為無 callback，可用 setTimeout 模擬
            setTimeout(() => {
                isScrollingByClick = false;
            }, 1200);
        }
    });

    // —————————————————————————————————————————————————— 

})