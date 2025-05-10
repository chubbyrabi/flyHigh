// 基礎單位設置
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

// —————————————————————————————————————————————————— breadcrumb
function breadcrumb() {
    const breadcrumbList = document.querySelector('.nav-breadcrumb ol');
    if (!breadcrumbList) return; // 沒有麵包屑容器就跳出

    const pathArray = location.pathname.split('/').filter(Boolean);
    let path = '';

    // 預設 Top
    breadcrumbList.innerHTML = `<li><a href="/index.html">Top</a></li>`;

    // 過濾 dist 層級
    const filteredPathArray = pathArray.filter(segment => segment !== 'dist');

    const pageNameMap = {
        'page-about.html': 'About Us',
        'page-news.html': 'News',
        'page-team.html': 'Our Team',
        'page-contact.html': 'Contact Us',
    };

    filteredPathArray.forEach((segment, index) => {
        path += '/' + segment;
        const isLast = index === filteredPathArray.length - 1;
        let displayText = decodeURIComponent(segment.replace(/[-_]/g, ' '));

        if (pageNameMap[segment]) {
            displayText = pageNameMap[segment];
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