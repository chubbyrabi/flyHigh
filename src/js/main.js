// js/main.js

// 全站共用初始化模組
import './common/common.js';

// 頁面邏輯動態載入
const pagePath = location.pathname;

// 定義對應規則
const pageMap = [
	{
		match: (path) => path === '/' || path.endsWith('/index.html'),
		module: () => import('./pages/page-index.js')
	},
	{
		match: (path) => path.endsWith('/page-about.html'),
		module: () => import('./pages/page-about.js')
	},
	{
		match: (path) => path.endsWith('/page-news.html'),
		module: () => import('./pages/page-news.js')
	},
	{
		match: (path) => path.endsWith('/page-team.html'),
		module: () => import('./pages/page-team.js')
	},
	{
		match: (path) => path.endsWith('/page-contact.html'),
		module: () => import('./pages/page-contact.js')
	},
];

// 比對並載入對應頁面模組
for (const { match, module } of pageMap) {
	const matched = typeof match === 'function' ? match(pagePath) : pagePath.includes(match);
	if (matched) {
		module(); // 使用 dynamic import 避免不必要的加載
		break;
	}
}