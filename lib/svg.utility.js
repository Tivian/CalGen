(function() {
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
        toDataURL: function(scale) {
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

            return 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString($svg[0]));
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