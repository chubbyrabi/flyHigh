import i from"../../library/lenis.mjs";let e=null;function o(){e=new i({smooth:!0,wheelMultiplier:1.2,lerp:.08}),requestAnimationFrame(function n(t){e.raf(t),requestAnimationFrame(n)})}function s(){return e}export{s as getLenis,o as initLenis,e as lenis};
//# sourceMappingURL=scroll-lenis.js.map
