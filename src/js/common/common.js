// js/common/common.js

// Core 功能
import { detectDeviceType } from '../core/device.js';
import { updateCSSVars } from '../core/css-vars.js';
import { initLenis } from '../core/scroll-lenis.js';
import { setupPageLoading } from '../core/loading.js';

// 互動操作
import { enableDragScroll } from '../interactions/drag-scroll.js';
import { autoAlignScroll } from '../interactions/auto-align.js';
import { setupHeaderToggle } from '../interactions/header-toggle.js';
import { breadcrumb } from '../interactions/breadcrumb.js';

// SVG 動畫
import { loadKarasunoSVG } from '../animations/karasuno-svg.js';

// 工具函式
import { preventImageDrag, ImageLazyLoading, fillImageSize } from '../utils/image-utils.js';
import { HTMLTree } from '../utils/html-tree-check.js';

function initCommon() {
    detectDeviceType();
    enableDragScroll(document.querySelectorAll('.drag-scroll-mask, .drag-scroll-overlay'));
    setupHeaderToggle();
    autoAlignScroll();
    breadcrumb();
    HTMLTree();
    preventImageDrag();
    ImageLazyLoading();
    fillImageSize();
    loadKarasunoSVG();
}

window.addEventListener('DOMContentLoaded', initCommon);

['resize', 'load', 'pageshow'].forEach(event => {
    window.addEventListener(event, updateCSSVars);
});

window.addEventListener('resize', detectDeviceType);

// 可滾動後，初始化滾動套件
setupPageLoading(initLenis);