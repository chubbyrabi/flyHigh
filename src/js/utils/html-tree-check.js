// js/utils/html-tree-check.js

// 找出最深的 DOM 元素（可選排除特定 class）
export function HTMLTree() {
    function findDeepestElement(element, depth = 0, excludeClasses = []) {
        let deepestElement = element;
        let maxDepth = depth;

        if (excludeClasses.some(className => element.classList.contains(className))) {
            return { deepest: null, depth: -1 };
        }

        for (let child of element.children) {
            const { deepest, depth: childDepth } = findDeepestElement(child, depth + 1, excludeClasses);
            if (childDepth > maxDepth) {
                deepestElement = deepest;
                maxDepth = childDepth;
            }
        }
        return { deepest: deepestElement, depth: maxDepth };
    }

    const result = findDeepestElement(document.body, 0, ['guide']);

    if (result.deepest) {
        console.log('最深的標籤:', result.deepest.outerHTML);
        console.log('層級數:', result.depth);
    } else {
        console.log('未找到符合條件的標籤。');
    }
}