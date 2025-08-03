// js/interactions/breadcrumb.js

export function breadcrumb() {
    const breadcrumbList = document.querySelector('.nav-breadcrumb ol');
    if (!breadcrumbList) return;

    breadcrumbList.innerHTML = `<li><a href="/dist/index.html">Top</a></li>`;

    const pathArray = location.pathname
        .replace(/^\/dist\//, '')
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
            const label = folderMap[segment];
            if (label) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${path}/">${label}</a>`;
                breadcrumbList.appendChild(li);
            }
            return;
        }

        path += '/' + segment;

        let displayText = pageNameMap[segment] || segment
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

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