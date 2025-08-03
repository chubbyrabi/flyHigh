// js/utils/dom-utils.js

// 取得元素相對於文件的偏移距離
export function getOffsetTop(elem) {
    // let offsetLeft = 0;
    let offsetTop = 0;
    while (elem) {
        // offsetLeft += element.offsetLeft;
        offsetTop += elem.offsetTop;
        elem = elem.offsetParent;
    }
    // return [offsetLeft, offsetTop];
    return offsetTop;
}