$(function () {
    breadcrumb();

    function initTimeline() {
        const $timeline = $('.timeline');

        // 根據 event 數量給 class
        $timeline.find('.box-top').each(function () {
            $(this).addClass('num-' + $(this).find('.event').length);
        });

        // 自動捲到最右邊
        $timeline.scrollLeft($timeline[0].scrollWidth);

        // 展開收闔 num-1 不處理
        $timeline.on('click', '.timeline-phase', function () {
            const $phase = $(this);
            const $boxTop = $phase.find('.box-top');

            if ($boxTop.hasClass('num-1')) return;

            if (!$phase.hasClass('open')) {
                $timeline.find('.timeline-phase.open').removeClass('open').animate({ width: '20vw' }, 300);
                $phase.addClass('open').animate({ width: $phase.prop('scrollWidth') }, 300);
            } else {
                $phase.removeClass('open').animate({ width: '20vw' }, 300);
            }
        });
    }
    initTimeline();
})