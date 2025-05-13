// $(document).ready(function() {
//   $('img').attr('loading', 'lazy'); // 為所有圖片加上 lazy loading
// });

// —————————————————————————————————————————————————— 慣性滾動
// import Lenis from '@studio-freight/lenis'

// const lenis = new Lenis({
//     smooth: true
// })

// function raf(time) {
//     lenis.raf(time)
//     requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)

// —————————————————————————————————————————————————— 基礎單位設置
function updateCustomCSSVars() {
	// 計算捲軸寬度
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

	// 設定 font-size 對應的 px（1rem）
	const fz = parseFloat(getComputedStyle(document.documentElement).fontSize);
	document.documentElement.style.setProperty('--fz', `${fz}px`);

	// 設定 1vh 的實際像素值
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 初始化 + 監聽 resize
window.addEventListener('DOMContentLoaded', updateCustomCSSVars);
window.addEventListener('resize', updateCustomCSSVars);

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
        .replace(/^\/dist\//, '') // ✅ 移除 /dist/ 開頭
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
