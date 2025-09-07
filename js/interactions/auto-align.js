function s(){const c=Array.from(document.querySelectorAll(".to-left, .to-center, .to-right"));function n(){c.forEach(t=>{const o=t.scrollWidth-t.clientWidth,r=t.classList.contains("to-center")?o/2:t.classList.contains("to-right")?o:0;t.scrollLeft=r})}[300,600].forEach(t=>setTimeout(n,t))}export{s as autoAlignScroll};
//# sourceMappingURL=auto-align.js.map
