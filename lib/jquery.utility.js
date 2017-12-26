(function($) {
$.fn.openOnClick = function(url) {
    return this.each(function() {
        $(this).click(function() { window.open(url, '_blank') });
    });
};

$.fn.prevent = function(eventType, allow) {
    allow = $.isFunction(allow) ? allow : function() { return false };

    return this.each(function() {
        $(this).on(eventType, function(ev) {
            if (!allow(ev))
                ev.preventDefault();
        });
    });
};

$.hash = function(txt) {
    if ($.getClassName(txt) != 'String')
        txt = JSON.stringify(txt);

    return SparkMD5.hash(txt).replace(/[0-9]/g, function(x) {
        return String.fromCharCode(('A').charCodeAt() + parseInt(x));
    });
};

$.base64ToBuffer = function(base64) {
    if ($.getClassName(base64) != 'String')
        return undefined;

    var slice = base64.split(';base64,');
    if (slice.length != 2)
        return undefined;

    var binStr =  window.atob(slice[1]);
    var len = binStr.length;
    var bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++)
        bytes[i] = binStr.charCodeAt(i);

    return bytes.buffer;
};

$.bufferToBase64 = function(buffer) {
    if (!buffer instanceof ArrayBuffer)
        return '';

    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++)
        binary += String.fromCharCode(bytes[i]);

    return window.btoa(binary);
}

/** https://codepen.io/gapcode/pen/vEJNZN **/
$.detectIE = function() {
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
};

$.overlay = function(operation, options) {
    operation = operation || '';

    switch (operation) {
        case 'show':
            var $overlay = $('#overlay');
            var isSpinning = options == null || options;

            if (!$overlay.length) {
                $overlay = $([
                    '<div id="overlay">',
                        '<i id="overlay-spinner" class="fa fa-spinner fa-spin fa-5x fa-fw"></i>',
                    '</div>'
                ].join('')).css({
                    position: 'fixed',
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    color: 'DarkRed',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 2
                });
                $(document.body).append($overlay);
                $(window).on('resize', $.overlay.resizeFx);
            }

            if(!$overlay.is(':visible')) {
                $overlay.show();
                $.overlay.resizeFx();
            }
    
            $('#overlay-spinner')[isSpinning ? 'show' : 'hide']();
            break;

        case 'visibility':
            return $('#overlay:visible').length > 0;

        case 'hide':
            var $overlay = $('#overlay');
            if (!$overlay.length)
                return;

            var destroy = options || false;
            if (destroy) {
                $(window).off('resize', $.overlay.resizeFx);
                $overlay.remove();
            } else {
                $overlay.hide();
            }
            break;
    }
};

$.overlay.resizeFx = function() {
    $('#overlay-spinner:visible').position({ of: window });
};

$.progressModal = function(operation, options) {
    operation = operation || '';

    switch (operation) {
        case 'show':
            var title = options || '';

            if (!$('#progress-modal').length) {
                $(document.body).append($([
                    '<div id="progress-modal" class="modal-dialog" role="document">',
                        '<div class="modal-content">',
                            '<div class="modal-header">',
                                '<h5 class="modal-title"></h5>',
                            '</div>',
                            '<div class="modal-body">',
                                '<div class="progress text-center">',
                                    '<div id="progress-modal-value" class="progress-bar progress-bar-striped progress-bar-animated bg-info"',
                                        'role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                ].join('')));
            }
    
            $('#progress-modal .modal-title').text(title);
            var $dialog = $('#progress-modal');
            var posFx = function() {
                $dialog.position({
                    my: 'right bottom',
                    at: 'right-15 bottom-15',
                    of: window
                });
            }
            $dialog.data('posFx', posFx);
            posFx();
            $(window).resize(posFx);
            break;

        case 'value':
            return parseFloat($('#progress-modal-value').attr('aria-valuenow'));

        case 'update':
            if (!$('#progress-modal').length)
                return;

            var step = options || 1;
            var $prograssBar = $('#progress-modal-value');
            var newValue = parseFloat($prograssBar.attr('aria-valuenow')) + parseFloat(step);
            $prograssBar
                .css('width', Math.ceil(newValue) + '%')
                .attr('aria-valuenow', newValue)
                .html('<b>' + Math.ceil(newValue) + '%</b>');
            break;

        case 'visibility':
            return $('#progress-modal').length > 0;

        case 'hide':
            $(window).off('resize', $('#progress-modal').data('posFx'));
            $('#progress-modal').remove();
    }
};

$.tooltip = function(operation) {
    operation = operation || '';

    switch (operation) {
        case 'enable':
            $('[data-toggle="tooltip"]').tooltip();
            break;
    }
};

$.snackbar = function(operation, text, options) {
    operation = operation || '';

    if ($.isPlainObject(text) && !operation.match(/(show|hide)/gi)) {
        options = text;
        text = operation;
        operation = 'show';
    } else {
        options = options || {};
    }

    switch (operation) {
        case 'show':
            if (text == null || text == '')
                return;

            if ($.getClassName(options) == 'String')
                options = { color: options };

            options = $.extend({ }, $.snackbar.defaults, options);
            var $snackbar = $('<div>', {
                id: 'snackbar',
                class: 'alert alert-' + options.color + ' d-inline',
                role: 'alert',
                html: text,
                click: function() { $(this).remove() }
            });
            $(document.body).append($snackbar);

            $snackbar.position({
                my: options.vertical + ' ' + options.horizontal + '-1',
                at: options.vertical + '-15 ' + options.horizontal + '-15',
                of: window
            });
            
            if (options.animate) {
                $snackbar.toggleClass('d-inline d-none').fadeIn(options.fade, function() {
                    if (options.destroy) {
                        $(this).delay(options.delay).fadeOut(options.fade, function() {
                            $(this).remove();
                        });
                    }
                }).toggleClass('d-inline d-none');
            }
            break;

        case 'hide':
            options = $.extend({ }, $.snackbar.defaults, options);
            if (options.animate) {
                $('#snackbar').fadeOut(options.fade, function() {
                    $(this).remove();
                });
            } else {
                $('#snackbar').remove();
            }
            break;
    }
};

$.snackbar.defaults = {
    color: 'secondary',
    vertical: 'right',
    horizontal: 'bottom',
    delay: 4000,
    fade: 500,
    animate: true,
    destroy: true
}

$.getClassName = function(obj) {
    return obj == null ? 'null' : typeof obj == 'undefined' ? 'undefined' : obj.constructor.name;
}

$.isUndefined = function(obj) {
    return typeof obj == 'undefined';
}
}(jQuery));