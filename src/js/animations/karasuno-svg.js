// js/animations/karasuno-svg.js

import { basePath } from '../core/config.js';
import { loadAnimatedSVG } from '../core/svg-loader.js';

function karasunoDelayStrategy(el, delayMap) {
	const classList = el.classList;
	if (classList.contains('st2')) {
		const bbox = el.getBBox();
		return bbox.x < 198 ? delayMap['st2-left'] : delayMap['st2-right'];	// 198 是中心點
	}
	if (classList.contains('st1')) return delayMap['st1'] || 0;
	if (classList.contains('st3')) return delayMap['st3'] || 0;
	return 0;
}

export function loadKarasunoSVG() {
	loadAnimatedSVG({
		containerSelector: '.svgContainer.svg-karasuno',
		svgPath: `${basePath}img/karasuno.svg`,
		targetClasses: ['.st1', '.st2', '.st3'],
		groupDelayMap: {
			st1: 0.3,
			'st2-left': 0.9,
			'st2-right': 0.9,
			st3: 1.5
		},
		animation: {
			name: 'draw-stroke',
			duration: '2s',
			timing: 'ease',
			fill: 'forwards'
		},
		delayStrategy: karasunoDelayStrategy,
		enableStrokeDraw: true,
		// onReady(paths) {
		// 	document.querySelector('.karasuno-logo')?.classList.add('show');
		// }
	});
}