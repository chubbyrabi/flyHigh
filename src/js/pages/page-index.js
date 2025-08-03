// js/pages/page-index.js

import { getLenis } from '../core/scroll-lenis.js';
import { getOffsetTop } from '../utils/dom-utils.js';

let isScrollingByClick = false;

function setupHomeAnchorScroll() {
    const lenis = getLenis();
    if (!lenis) {
        console.warn('lenis 尚未初始化，滾動效果不會生效');
        return;
    }

    const navAnchor = document.querySelectorAll('.page-home .nav-ul a');    // 錨點
    const sections = document.querySelectorAll('main section');             // section
    const sectionNum = (navAnchor.length + 1).toString().padStart(2, '0');  // 左下角數字

    function updateNavActive(index) {
        // 目前所在的錨點加上 active
        navAnchor.forEach((link, i) => {
            link.parentElement.classList.toggle('active', i === index);
        });
        // 左下角數字更新 目前 / 總數
        document.querySelector('.stage-num span:nth-child(1)').textContent = (index + 1).toString().padStart(2, '0');
        document.querySelector('.stage-num span:nth-child(3)').textContent = sectionNum;
    }

    function handleScrollAndUpdateNav() {
        const scrTop = window.scrollY;      // 滾動高度
        const winH = window.innerHeight;    // 高度
        let currentIndex = -1;

        sections.forEach((section, i) => {
            const objTop = getOffsetTop(section);
            if (objTop - scrTop <= winH / 2) currentIndex = i;  // 視窗過一半就算進入該區塊
        });

        if (currentIndex !== -1) updateNavActive(currentIndex); // 更新 active 狀態

        const opening = document.getElementById('section_opening');
        if (opening) {
            const objTop = opening.offsetTop;
            const objH = opening.offsetHeight;
            const objBtop = objTop + objH;

            if (objBtop - scrTop >= winH / 2) {
                document.body.classList.add('at-opening');
            } else {
                document.body.classList.remove('at-opening');
            }
        }
    }

    lenis.on('scroll', () => {
        if (!isScrollingByClick) handleScrollAndUpdateNav();
    });

    navAnchor.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));

            if (target) {
                isScrollingByClick = true;
                updateNavActive(index);

                // if (index === 0) document.body.classList.add('at-opening');

                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2,
                    easing: (t) => 1 - Math.pow(1 - t, 4)
                });

                setTimeout(() => {
                    isScrollingByClick = false;
                }, 1200);
            }
        });
    });
}

window.addEventListener('LenisReady', setupHomeAnchorScroll);