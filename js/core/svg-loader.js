function g(c){const{containerSelector:f,svgPath:y,targetClasses:u=[],groupDelayMap:d={},delayStrategy:h=()=>0,enableStrokeDraw:m=!1,animation:n={name:"default-animation",duration:"1s",timing:"ease",fill:"forwards"},onReady:l=null}=c,a=document.querySelector(f);a&&fetch(y).then(o=>o.text()).then(o=>{a.innerHTML=o;const s=a.querySelector("svg");if(!s)return;const r=s.querySelectorAll(u.join(","));if(m){const t=document.createElement("style");t.textContent=`
					@keyframes ${n.name} {
						to { stroke-dashoffset: 0; }
					}`,s.appendChild(t),r.forEach(e=>{if(typeof e.getTotalLength=="function"){if(e.closest&&e.closest("defs"))return;try{const i=e.getTotalLength();e.style.strokeDasharray=i,e.style.strokeDashoffset=i}catch{}}})}r.forEach(t=>{t.style.animation=`${n.name} ${n.duration} ${n.timing} ${n.fill}`,t.style.animationDelay=`${h(t,d)}s`}),typeof l=="function"&&l(r)})}export{g as loadAnimatedSVG};
//# sourceMappingURL=svg-loader.js.map
