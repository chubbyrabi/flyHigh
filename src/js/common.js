// $(document).ready(function() {
//   $('img').attr('loading', 'lazy'); // 為所有圖片加上 lazy loading
// });

// —————————————————————————————————————————————————— 慣性滾動

// —————————————————————————————————————————————————— 等頁面完全載入後，移除 loading
const loadingStart = performance.now();

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
