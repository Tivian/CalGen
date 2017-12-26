(function() {
SVG.CenteredText = SVG.invent({
    create: 'svg',
    inherit: SVG.Nested,
    extend: {
        position: function(position) {
            if ($.isPlainObject(position) && position.hasOwnProperty('x') && position.hasOwnProperty('y'))
                this.remember('position', position);
            else if (position instanceof SVG.Element)
                this.remember('position', { x: position.x(), y: position.y() });

            return this;
        },
        margin: function(x, y) {
            if ($.isPlainObject(x) && x.hasOwnProperty('x') && x.hasOwnProperty('y'))
                this.remember('margin', x);
            else if (x != null && y != null && !$.isPlainObject(y))
                this.remember('margin', { x: x, y: y });

            return this;
        },
        font: function(fontFamily) {
            return this.style({ 'font-family': '"' + fontFamily + '"' });
        },
        style: function(style) {
            var svgText = this.get(0);
            var position = this.remember('position');
            var margin = this.remember('margin');
            svgText.style(style || '');

            var bbox = svgText.bbox();
            var viewbox = this.viewbox();
            viewbox.width *= viewbox.zoom;
            viewbox.height *= viewbox.zoom;
            var ratio = Math.min((viewbox.width - 2 * margin.x) / bbox.width, (viewbox.height - 2 * margin.y) / bbox.height);
            this.viewbox(0, 0, viewbox.width / ratio, viewbox.height / ratio).attr(position);

            /** https://codepen.io/gapcode/pen/vEJNZN **/
            function detectIE() {
                var ua = window.navigator.userAgent;

                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                return false;
            }

            var height = 0;
            if (detectIE()) {
                var fontSize = parseFloat(getComputedStyle(svgText.node).fontSize) * ratio;
                var $dummy = $('<div>', { text: text }).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    font: fontSize + 'px "' + font.name + '"'
                });
            
                $(document.body).append($dummy);
                height = parseFloat(getComputedStyle($dummy[0]).height);
                $dummy.remove();
            }

            svgText.attr({
                x: viewbox.width / ratio / 2,
                y: viewbox.height / ratio / 2,
                dy: height / ratio / 3
            });

            return this;
        }
    },
    construct: {
        centeredText: function(text, rect, margin) {
            if (text == null || text == '' || !rect instanceof SVG.Element)
                return null;
            
            var nested = this.put(new SVG.CenteredText);
            nested.size(rect.width(), rect.height());
            nested.plain(text).style({
                'text-anchor': 'middle',
                'dominant-baseline': 'central'
            });

            return nested.position(rect).margin(margin || { x: 0, y: 0 }).style();
        }
    }
});

SVG.extend(SVG.Image, {
    orElse: function(src, options) {
        if (this.attr('href') || false)
            return this;

        options = options || { };
        if (src == 'dummy') {
            var w = options.width || this.width();
            var h = options.height || this.height();
            var dummy = SVG($('<div>')[0]).size(w, h);
            dummy.rect(w, h).fill('#111').opacity(0.2).rx(15).ry(15);
            dummy.plain(w + ' x ' + h)
                .font({
                    family: 'Helvetica',
                    size: w * 0.1,
                    anchor: 'middle'
                }).attr('dominant-baseline', 'middle')
                .move('50%', '50%');
            src = dummy.toDataURL();
        }

        return this.load(src);
    }
});
SVG.extend(SVG.Image, SVG.Text, {
    gaussianBlur: function(radius) {
        this.filter(function(add) {
            add.blend(add.source, add.offset(0, 0).in(add.sourceAlpha).gaussianBlur(radius));
        });

        return this;
    }
});
SVG.extend(SVG.Container, {
    serializeToString: function(scale) {
        scale = scale || 1;

        var viewbox = this.viewbox();
        var $svg = $(this.node).clone();
        if ($svg.children('#' + this.defs().node.id).length == 0)
            $svg.append($(this.defs().node).clone());

        $svg.attr({
            viewBox: '0 0 ' + (viewbox.width * viewbox.zoom) + ' ' + (viewbox.height * viewbox.zoom),
            width: parseFloat($svg.attr('width')) * scale,
            height: parseFloat($svg.attr('height')) * scale
        });

        return new XMLSerializer().serializeToString($svg[0]);
    },

    toBlob: function(scale) {
        return new Blob([this.serializeToString(scale)], { type: 'image/svg+xml' });
    },

    toDataURL: function(scale) {
        return 'data:image/svg+xml;base64,' + btoa(this.serializeToString(scale));
    },

    convert: function(callback, type, encoderOptions, scale) {
        callback = callback || $.noop;
        type = type || 'image/svg+xml';
        encoderOptions = encoderOptions || 1;
        scale = scale || 1;

        if (type == 'image/svg+xml') {
            callback(this.toDataURL());
            return;
        }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var img = new Image();
        $(img).on('load', function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL(type, encoderOptions));
        });
        img.src = this.toDataURL(scale);
    }
});
}());