/*!
* svg.panzoom.js - A plugin for svg.js that enables panzoom for viewport elements
* @version 1.1.1
* https://github.com/svgdotjs/svg.panzoom.js#readme
*
* Original work Copyright (c) Ulrich-Matthias Schäfer
* Modified work Copyright (c) 2017 Paweł Kania
* @license MIT
*/
(function() {
    SVG.extend(SVG.Doc, SVG.Nested, {
        panZoom: function(options) {
            this.off('.panZoom');

            // when called with false, disable panZoom
            if (options === false)
                return this;

            function decodeButton(button) {
                if (typeof button === 'string' || button instanceof String)
                    return button == 'right' ? 2 : button == 'middle' ? 1 : 0;
                else
                    return button;
            }

            options = options || { };
            var zoomFactor = options.zoomFactor || 0.03;
            var zoomMin = options.zoomMin || Number.MIN_VALUE;
            var zoomMax = options.zoomMax || Number.MAX_VALUE;
            var cursor = options.cursor || 'grabbing';
            var button = decodeButton(options.button) || 0;
            var last;

            var wheelZoom = function(ev) {
                ev.preventDefault();

                var lvl = this.viewbox().zoom * (1 - (ev.deltaY / Math.abs(ev.deltaY)) * zoomFactor);
                var p = this.point(ev.clientX, ev.clientY);

                if (lvl > zoomMax)
                    lvl = zoomMax;

                if (lvl < zoomMin)
                    lvl = zoomMin;

                this.zoom(lvl, p);
            };

            var panStart = function(ev) {
                ev.preventDefault();
                if (ev.button != button)
                    return;

                $(this.node).css('cursor', cursor);

                this.off('mousedown.panZoom', panStart);
                this.fire('panStart', { event: ev });

                last = { x: ev.clientX, y: ev.clientY };
                SVG.on(document, 'mousemove.panZoom', panning, this);
                SVG.on(document, 'mouseup.panZoom', panStop, this);
            };

            var panStop = function(ev) {
                ev.preventDefault();
                $(this.node).css('cursor', '');

                this.fire('panEnd', { event: ev });

                SVG.off(document,'mousemove.panZoom', panning);
                SVG.off(document,'mouseup.panZoom', panStop);
                this.on('mousedown.panZoom', panStart);
            }

            var panning = function(ev) {
                ev.preventDefault();

                var current = { x: ev.clientX, y: ev.clientY };
                var p1 = this.point(current.x, current.y);
                var p2 = this.point(last.x, last.y);
                var box = new SVG.Box(this.viewbox()).transform(new SVG.Matrix().translate(p2.x - p1.x, p2.y - p1.y));

                this.viewbox(box);
                last = current;
            };

            this.on('wheel.panZoom', wheelZoom);
            this.on('mousedown.panZoom', panStart, this);

            return this;
        },

        zoom: function(level, point) {
            if (level == null || point == null)
                return;

            var viewbox = this.viewbox();
            var zoomAmount = viewbox.zoom / level;
            var box = new SVG.Box(viewbox).transform(new SVG.Matrix().scale(zoomAmount, point.x, point.y));

            return this.viewbox(box);
        }
    });
}());
