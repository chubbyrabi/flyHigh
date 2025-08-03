// js/utils/image-utils.js

// 為所有 img 加上 lazy loading
export function ImageLazyLoading() {
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
    });
}

// 防止圖片拖曳（避免預覽圖浮出）
export function preventImageDrag() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
}

// 為所有圖片補上 width / height，避免 CLS，建議用於載入完成後
export function fillImageSize() {
    document.querySelectorAll('img').forEach(img => {
        const applySize = () => {
            if (!img.hasAttribute('width') && img.naturalWidth > 0) {
                img.setAttribute('width', img.naturalWidth);
                img.setAttribute('height', img.naturalHeight);
            }
        };

        if (img.complete) {
            applySize();
        } else {
            img.onload = applySize;
        }
        setTimeout(applySize, 3000);
    });
}