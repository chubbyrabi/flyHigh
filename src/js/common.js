// $(document).ready(function() {
//   $('img').attr('loading', 'lazy'); // 為所有圖片加上 lazy loading
// });

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
    lerp: 0.08,               // 滾動的慣性，數值越低滑行時間越長
    wheelMultiplier: 1.2,     // 滾輪速度倍數，預設是 1
    // touchMultiplier: 2.0      // 觸控拖曳倍數，預設是 1
})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// —————————————————————————————————————————————————— 等頁面完全載入後，移除 loading
window.loadingStart = performance.now();

window.addEventListener('load', () => {
    const loadingEnd = performance.now();
    const timePassed = loadingEnd - loadingStart;
    const minDisplayTime = 500;

    const delay = timePassed < minDisplayTime ? minDisplayTime - timePassed : 0;

    setTimeout(() => {
        document.querySelector('body')?.classList.remove('hidden');
        document.querySelector('.mask')?.classList.remove('loading');
    }, delay);
});

// —————————————————————————————————————————————————— 基礎單位設置
function updateCustomCSSVars() {
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

	// 抓 font-size 與 vh，延遲以防頁面剛進來還沒重繪
	setTimeout(() => {
		const fz = parseFloat(getComputedStyle(document.documentElement).fontSize);
		document.documentElement.style.setProperty('--fz', `${fz}px`);

		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}, 50); // 你也可以試試 0、16、100，看哪個表現最穩定
}

// 監聽 load（含圖片資源）與 pageshow（快取返回）
window.addEventListener('load', updateCustomCSSVars);
window.addEventListener('resize', updateCustomCSSVars);
window.addEventListener('pageshow', updateCustomCSSVars);

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

// —————————————————————————————————————————————————— 滑鼠拖曳 (dragging / 邊緣消失)
function enableDragScroll($targets) {
    $targets.each(function () {
        const $el = $(this);

        let isDown = false;                             // 是否按下滑鼠
        let startX;                                     // 起始 X 座標
        let scrollLeft;                                 // 初始 scrollLeft
        let hasDragged = false;                         // 是否有拖曳過

        // 滑鼠按下，開始拖曳狀態
        $el.on('mousedown', e => {
            isDown = true;                              // 開始拖曳
            hasDragged = false;                         // 尚未拖曳
            startX = e.pageX;                           // 紀錄起始滑鼠 X 座標
            scrollLeft = e.currentTarget.scrollLeft;    // 紀錄起始捲動位置
            $el.addClass('dragging');                   // 加上拖曳樣式（可用於改變游標等）
        });

        // 滑鼠移動，若處於拖曳中，計算新的 scrollLeft
        $el.on('mousemove', e => {
            if (!isDown) return;                        // 非拖曳狀態跳過
            const deltaX = e.pageX - startX;            // 滑鼠位移距離
            if (Math.abs(deltaX) > 3) {                 // 移動超過 3px 才算是拖曳（防止誤判點擊）
                hasDragged = true;                      // 標記有拖曳
                e.currentTarget.scrollLeft = scrollLeft - deltaX; // 設定新捲動位置
            }
        });

        // 滑鼠放開，結束拖曳
        $(document).on('mouseup.dragScroll', () => {
            if (isDown) {
                $el.removeClass('dragging');            // 移除拖曳樣式
                if (hasDragged) {
                    $el.data('preventClick', true);     // 若有拖曳過，標記本次點擊事件要被阻擋（避免拖曳後觸發點擊）
                }
            }
            isDown = false;                             // 重置拖曳狀態
        });

        // 阻擋拖曳結束後的 click 事件
        $el[0].addEventListener('click', e => {
            if ($el.data('preventClick')) {
                e.stopPropagation();                    // 停止事件冒泡
                e.preventDefault();                     // 阻止預設行為
                $el.data('preventClick', false);        // 重置標記，讓下一次點擊正常觸發
            }
        }, true);                                       // useCapture 設為 true，先攔截 click 事件

        // 監聽捲動事件，判斷是否靠近左右邊緣，切換相應 class
        $el.on('scroll', () => {
            const left = $el.scrollLeft();
            const max  = $el[0].scrollWidth - $el.innerWidth();
            $el.toggleClass('left-active', left > 10);
            $el.toggleClass('right-active', left < max - 10);
        });

        // 抓取 .drag-scroll-overlay 高度（給偽元素用）
        if ($el.hasClass('drag-scroll-overlay')) {
            $el[0].style.setProperty('--drag-height', $el.height() + 'px');
        }

        // 頁面載入時延遲觸發一次 scroll
        setTimeout(() => $el.trigger('scroll'), 50);
    });
}

// 初始化
$(document).ready(() => {
    enableDragScroll($('.drag-scroll-mask, .drag-scroll-overlay'));
});

// —————————————————————————————————————————————————— JS 移除拖曳預覽圖
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
});

// —————————————————————————————————————————————————— JS 動態補圖尺寸
// 圖片元素沒有明確的 width 和 height > google 會扣分
// document.querySelectorAll('img').forEach(img => {
    
//     // 等待圖片加載完成
//     img.onload = () => {
//         if (!img.hasAttribute('width') && img.naturalWidth > 0) {
//             img.setAttribute('width', img.naturalWidth);
//             img.setAttribute('height', img.naturalHeight);
//         }
//     };

//     if (img.complete) {
//         img.onload();
//     }
// });

// —————————————————————————————————————————————————— header-hb
$('.hb-btn').on('click', function () {    
    $('.header-hb').toggleClass('active');
    $('body').toggleClass('modal-open');
})

// —————————————————————————————————————————————————— breadcrumb
function breadcrumb() {
    const breadcrumbList = document.querySelector('.nav-breadcrumb ol');
    if (!breadcrumbList) return;

    breadcrumbList.innerHTML = `<li><a href="/dist/index.html">Top</a></li>`;

    const pathArray = location.pathname
        .replace(/^\/dist\//, '') // 移除 /dist/ 開頭
        .split('/')
        .filter(Boolean);

    const folderMap = {
        'html-pages': '',
        'html-news': 'News',
    };

    const pageNameMap = {
        'page-about.html': 'About',
        'page-news.html': 'News',
        'page-team.html': 'Our Team',
        'page-contact.html': 'Contact Us',
    };

    let path = '';

    pathArray.forEach((segment, index) => {
        const isLast = index === pathArray.length - 1;

        if (folderMap[segment] !== undefined) {
            path += '/' + segment;
            const li = document.createElement('li');
            const label = folderMap[segment];
            if (label) {
                li.innerHTML = `<a href="${path}/">${label}</a>`;
                breadcrumbList.appendChild(li);
            }
            return;
        }

        path += '/' + segment;

        let displayText = pageNameMap[segment];
        if (!displayText) {
            // 如果沒有對應名稱，就自動格式化檔名
            displayText = segment
                .replace(/\.[^/.]+$/, '') // 去副檔名
                .replace(/[-_]/g, ' ')    // 換空格
                .replace(/\b\w/g, c => c.toUpperCase()); // 每字首大寫
        }

        const li = document.createElement('li');
        if (isLast) {
            li.textContent = displayText;
            li.setAttribute('aria-current', 'page');
        } else {
            li.innerHTML = `<a href="${path}">${displayText}</a>`;
        }

        breadcrumbList.appendChild(li);
    });
}