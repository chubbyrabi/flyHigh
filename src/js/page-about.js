$(function () {
    breadcrumb();
    initTimeline();

    // 時間軸
    function initTimeline() {
        const $timeline = $('.timeline');

        // 根據 event 數量給 class
        $timeline.find('.box-top').each(function () {
            $(this).addClass('num-' + $(this).find('.event').length);
        });

        // 自動捲到最右邊
        $timeline.scrollLeft($timeline[0].scrollWidth);

        // 展開/收起
        $timeline.on('click', '.timeline-phase', function () {
            const $phase = $(this);
            const $boxTop = $phase.find('.box-top');

            // num-1，不動作
            if ($boxTop.hasClass('num-1')) return;

            const isOpen = $phase.hasClass('open');

            // 關閉已開啟的項目
            $timeline.find('.timeline-phase.open').not($phase)
                .removeClass('open').animate({ width: '20vw' }, 300);

            if (!isOpen) {
                const w = $phase.width();           // 當前寬度
                $phase.width(w).addClass('open');   // 強制設回原寬 + 加 class
                $phase.animate({ width: $phase[0].scrollWidth }, 300);
            } else {
                $phase.removeClass('open').animate({ width: '20vw' }, 300);
            }
        });
    }

})