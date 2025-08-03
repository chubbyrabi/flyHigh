// js/common/svg-loader.js 

export function loadAnimatedSVG(config) {
	const {
		containerSelector,
		svgPath,
		targetClasses = [],
		groupDelayMap = {},
		delayStrategy = () => 0,
		enableStrokeDraw = false,
		animation = {
			name: 'default-animation',
			duration: '1s',
			timing: 'ease',
			fill: 'forwards'
		},
		onReady = null
	} = config;

	const container = document.querySelector(containerSelector);
	if (!container) return;

	fetch(svgPath)
		.then(res => res.text())
		.then(svgText => {
			container.innerHTML = svgText;
			const svg = container.querySelector('svg');
			if (!svg) return;
			const paths = svg.querySelectorAll(targetClasses.join(','));

			// 有使用筆畫效果
			if (enableStrokeDraw) {
				const style = document.createElement('style');
				style.textContent = `
					@keyframes ${animation.name} {
						to { stroke-dashoffset: 0; }
					}`;
				svg.appendChild(style);

				paths.forEach(el => {
					if (typeof el.getTotalLength === 'function') {
						const len = el.getTotalLength();
						el.style.strokeDasharray = len;
						el.style.strokeDashoffset = len;
					}
				});
			}

			// 通用動畫設定
			paths.forEach(el => {
				el.style.animation = `${animation.name} ${animation.duration} ${animation.timing} ${animation.fill}`;
				el.style.animationDelay = `${delayStrategy(el, groupDelayMap)}s`;
			});

			// 回傳 paths 給個別動畫處理進階效果
			if (typeof onReady === 'function') {
				onReady(paths);
			}
		});
}