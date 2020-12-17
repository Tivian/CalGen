var CalGen = (function() {
    var locale = {
        eng: {
            dayName: [ "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY" ],
            monthName: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            holiday: [
                [ [ 1, "New Year", true ], [ 6, "Three Kings' Day", true ], [ 21, "Grandma's Day", false ], [ 22, "Grandpa's Day", false ] ],
                [ [ 14, "Valentine's Day", false ] ],
                [ [ 8, "Women's Day", false ], [ 21, "Spring", false ] ],
                [],
                [ [ 1, "Labour Day", true ], [ 3, "Constitution Day", true ], [ 26, "Mother's Day", false ] ],
                [ [ 1, "Children's Day", false ], [ 22, "Summer", false ], [ 23, "Father's Day", false ] ],
                [],
                [ [ 15, "The Assumption", true ] ],
                [ [ 23, "Autumn", false ] ],
                [ [ 31, "Halloween", false ] ],
                [ [ 1, "All Saints' Day", true ], [ 11, "Independence Day", true ], [ 30, "St. Andrew's Day", false ] ],
                [ [ 6, "Saint Nicholas Day", false ], [ 22, "Winter", false ], [ 24, "Christmas Eve", false ], [ 25, "Christmas Day", true ], [ 26, "Second Day of Christmas", true ], [ 31, "New Year Eve", false ] ]
            ],
            movingHoliday: [ "Easter", "Easter Monday", "Green week", "Corpus Christi" ],
            timeChange: [
                { month:  3, name: "Summer time change" },
                { month: 10, name: "Winter time change" }
            ]
        },
        pl: {
            dayName: [ "PONIEDZIAŁEK", "WTOREK", "ŚRODA", "CZWARTEK", "PIĄTEK", "SOBOTA", "NIEDZIELA" ],
            monthName: [ "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień" ],
            holiday: [
                [ [ 1, "Nowy Rok", true ], [ 6, "Święto Trzech Króli", true ], [ 21, "Dzień Babci", false ], [ 22, "Dzień Dziadka", false ] ],
                [ [ 14, "Walentynki", false ] ],
                [ [ 8, "Dzień Kobiet", false ], [ 21, "Wiosna", false ] ],
                [],
                [ [ 1, "Dzień Pracy", true ], [ 3, "Święto Konstytucji 3. maja", true ], [ 26, "Dzień Matki", false ] ],
                [ [ 1, "Dzień Dziecka", false ], [ 22, "Lato", false ], [ 23, "Dzień Ojca", false ] ],
                [],
                [ [ 15, "Wniebowzięcie NMP", true ] ],
                [ [ 23, "Jesień", false ] ],
                [ [ 31, "Halloween", false ] ],
                [ [ 1, "Wszystkich Świętych", true ], [ 2, "Zaduszki", false ], [ 11, "Dzień Niepodległości", true ], [ 30, "Andrzejki", false ] ],
                [ [ 6, "Mikołajki", false ], [ 22, "Zima", false ], [ 24, "Wigilia", false ], [ 25, "Boże Narodzenie", true ], [ 26, "2. dzień Bożego Narodzenia", true ], [ 31, "Sylwester", false ] ]
            ],
            movingHoliday: [ "Wielkanoc", "Poniedziałek Wielkanocny", "Zielone Świątki", "Boże Ciało" ],
            timeChange: [
                { month:  3, name: "Letnia zmiana czasu" },
                { month: 10, name: "Zimowa zmiana czasu" }
            ]
        },
        global: {
            movingHolidayShift: [ 0, 1, 49, 60 ]
        }
    };
    var tiles = [
        { size: [ 520, 760 ], shift: [
            [ [   0,   0 ] ]
        ] },
        { size: 520, shift: [
            [ [   0, 120 ] ]
        ] },
        { size: 365, shift: [
            [ [  77,  10 ], [ 155, 385 ] ],
            [ [   0,   0 ], [ 155, 395 ] ]
        ] },
        { size: 250, shift: [
            [ [   8,  90 ], [ 262, 255 ], [   8, 420 ] ],
            [ [   8, 128 ], [ 262, 255 ], [   8, 382 ] ],
            [ [   0,   2 ], [   0, 255 ], [   0, 508 ] ],
            [ [ 135,   2 ], [ 135, 255 ], [ 135, 508 ] ],
            [ [ 270,   2 ], [ 270, 255 ], [ 270, 508 ] ]
        ] },
        { size: 250, shift: [
            [ [   7,  30 ], [ 267, 200 ], [   7, 310 ], [ 267, 480 ] ],
            [ [   8, 128 ], [ 262, 128 ], [   8, 382 ], [ 262, 382 ] ],
            [ [   0, 120 ], [ 270, 120 ], [   0, 390 ], [ 270, 390 ] ],
            [ [   0,   0 ], [ 270,   0 ], [   0, 510 ], [ 270, 510 ] ]
        ] },
        { size: 250, shift: [
            [ [   5,   2 ], [ 265,  85 ], [   5, 255 ], [ 265, 426 ], [   5, 508 ] ],
            [ [   5,   2 ], [ 265, 128 ], [   5, 255 ], [ 265, 381 ], [   5, 508 ] ],
            [ [   0,   0 ], [ 270,   0 ], [ 135, 255 ], [   0, 510 ], [ 270, 510 ] ],
            [ [   8,   0 ], [ 262,   0 ], [ 135, 255 ], [   8, 510 ], [ 262, 510 ] ]
        ] },
        { size: 250, shift: [
            [ [   8,   2 ], [ 262,   2 ], [   8, 255 ], [ 262, 255 ], [   8, 508 ], [ 262, 508 ] ],
            [ [   8,   1 ], [ 262,   1 ], [   8, 255 ], [ 262, 255 ], [   8, 509 ], [ 262, 509 ] ],
            [ [   0,   0 ], [ 270,   0 ], [   0, 255 ], [ 270, 255 ], [   0, 510 ], [ 270, 510 ] ]
        ] }
    ];
    var styleName = {
        'One rectangle': {
            '0': 'Filling'
        }, 'One square': {
            '0': 'Centered'
        }, 'Two squares': {
            '0': 'Shifted',
            '1': 'Distanced'
        }, 'Three squares': {
            '0': 'Spread',
            '1': 'Adjacent',
            '2': 'Left column',
            '3': 'Middle column',
            '4': 'Right column'
        }, 'Four squares': {
            '0': 'Shifted',
            '1': 'Adjacent',
            '2': 'Adjacent with margin',
            '3': 'Spread'
        }, 'Five squares': {
            '0': 'Shifted',
            '1': 'Adjacent',
            '2': 'Arranged in letter X',
            '3': 'Adjacent arranged in letter X'
        }, 'Six squares': {
            '0': 'Adjacent',
            '1': 'Adjacent with little margin',
            '2': 'Spread'
        }
    };
    var clipboard = null;
    var menuTrigger = [];
    var redrawFlag, menus = {
        page: {
            mainImg: {
                include: [ '.page-image' ],
                exclude: [ '.page-ribbon-bkg' ],
                options: {
                    items: {
                        edit: {
                            name: 'Edit',
                            icon: 'fa-edit',
                            callback: function() {
                                new ImageEditor(self.getCurrentPage().config.mainImg);
                                return true;
                            }
                        },
                        load: {
                            name: 'Load image',
                            icon: 'fa-file-image-o',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                new FileChooser(function(file) {
                                    $.overlay('show');
                                    file.load(function() {
                                        page.mainImg = $.extend(new Image, { src: this.result });
                                        SVG.select('.page-image').members[0].load(this.result);
                                        $.overlay('hide');
                                    });
                                }, { format: 'image/*' }).open();
                            }
                        },
                        sep0: '----',
                        cut: {
                            name: 'Cut',
                            icon: 'fa-cut',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                clipboard = page.mainImg.src;
                                page.mainImg = new Image();
                                SVG.select('.page-image').members[0].attr('href', null).orElse('dummy');
                            }
                        },
                        copy: {
                            name: 'Copy',
                            icon: 'fa-copy',
                            callback: function() {
                                clipboard = self.getCurrentPage().config.mainImg.src;
                            }
                        },
                        paste: {
                            name: 'Paste',
                            icon: 'fa-paste',
                            callback: function() {
                                self.getCurrentPage().config.mainImg.src = clipboard;
                            }
                        },
                        sep1: '----',
                        remove: {
                            name: 'Remove',
                            icon: 'fa-times',
                            callback: function() {
                                self.getCurrentPage().config.mainImg = new Image();
                                SVG.select('.page-image').members[0].attr('href', null).orElse('dummy');
                            }
                        }
                    }
                }
            },
            ribbon: {
                include: [ '.page-ribbon-bkg' ],
                options: {
                    events: {
                        hide: function() {
                            if (redrawFlag) {
                                redrawFlag = false;
                                self.render();
                            }
                        }
                    },
                    items: {
                        text: {
                            name: 'Change text',
                            type: 'text',
                            value: function() { return self.getCurrentPage().config.ribbon.text },
                            events: {
                                keyup: function(ev) {
                                    self.getCurrentPage().config.ribbon.text = $(ev.target).val();
                                    redrawFlag = true;
                                }
                            }
                        },
                        load: {
                            name: 'Load background',
                            icon: 'fa-file-image-o',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                new FileChooser(function(file) {
                                    $.overlay('show');
                                    file.load(function() {
                                        page.ribbon.background = $.extend(new Image, { src: this.result });
                                        SVG.select('.page-ribbon-bkg').members[0].load(this.result);
                                        $.overlay('hide');
                                    });
                                }, { format: 'image/*' }).open();
                            }
                        },
                        font: {
                            name: 'Change font',
                            icon: 'fa-font',
                            callback: function() {
                                return self.changeFont(function(font) {
                                    self.getCurrentPage().config.ribbon.font = font;
                                    self.render();
                                });
                            }
                        },
                        sep0: '----',
                        cut: {
                            name: 'Cut',
                            icon: 'fa-cut',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                clipboard = page.ribbon.background.src;
                                page.ribbon.background = new Image();
                                SVG.select('.page-ribbon-bkg').members[0].attr('href', null).orElse('dummy');
                            }
                        },
                        copy: {
                            name: 'Copy',
                            icon: 'fa-copy',
                            callback: function() {
                                clipboard = self.getCurrentPage().config.ribbon.background.src;
                            }
                        },
                        paste: {
                            name: 'Paste',
                            icon: 'fa-paste',
                            callback: function() {
                                self.getCurrentPage().config.ribbon.background.src = clipboard;
                            }
                        },
                        sep1: '----',
                        remove: {
                            name: 'Remove',
                            icon: 'fa-times',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                page.ribbon.background = new Image();
                                page.ribbon.text = null;
                                page.ribbon.font = new Font(Page.defaultFont.ribbon, 'built-in');
                                self.render();
                            }
                        }
                    }
                }
            },
            artwork: {
                include: [ '.artwork' ],
                options: {
                    events: {
                        show: function(opt) {
                            var page = self.getCurrentPage();
                            var build = function(ev, obj) {
                                this.empty();
                                for (var index in obj) {
                                    this.append($('<option>', {
                                        value: index,
                                        text: obj[index]
                                    }));
                                }
                            };
                            opt.inputs.style.$input.on('build', build.bind(opt.inputs.style.$input))
                                .trigger('build', [ Object.keys(styleName) ]);
                            opt.inputs.variant.$input.on('build', build.bind(opt.inputs.variant.$input))
                                .trigger('build', [ Object.values(styleName)[page.config.artwork.style] ]);

                            $('#artwork-background-picker').change(function() {
                                var color = $(this).spectrum('get');
                                page.config.artwork.background.color = color.toRgbString();
                                page.config.artwork.background.opacity = color.getAlpha();
                                SVG.select('.artwork-background').fill(page.config.artwork.background);
                            });

                            $('#border-color-picker').change(function() {
                                var color = $(this).spectrum('get');
                                page.config.artwork.border.color = color.toRgbString();
                                page.config.artwork.border.opacity = color.getAlpha();
                                SVG.select('.artwork-border').stroke(page.config.artwork.border);
                            });

                            var handle = $('#custom-handle');
                            $('#border-width-slider').slider({
                                min: 0, max: 10,
                                value: page.config.artwork.border.width,
                                create: function() { handle.text($(this).slider('value')) },
                                slide: function(event, ui) { handle.text(ui.value) },
                                change: function(event, ui) {
                                    page.config.artwork.border.width = ui.value;
                                    SVG.select('.artwork-border').stroke(page.config.artwork.border);
                                }
                            });
                        },
                        activated: function(opt) {
                            var page = self.getCurrentPage();
                            var obj = page.config.artwork.background;
                            $('#artwork-background-picker').spectrum($.extend({}, {
                                showAlpha: true,
                                color: new tinycolor(obj.color).setAlpha(obj.opacity)
                            }, defaultSpectrum));

                            obj = page.config.artwork.border;
                            $('#border-color-picker').spectrum($.extend({}, {
                                showAlpha: true,
                                color: new tinycolor(obj.color).setAlpha(obj.opacity)
                            }, defaultSpectrum));
                        },
                        hide: function(opt) {
                            $('#artwork-background-picker').spectrum('hide');
                            $('#border-color-picker').spectrum('hide');
                        }
                    },
                    items: {
                        edit: {
                            name: 'Edit',
                            icon: 'fa-edit',
                            callback: function() {
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                new ImageEditor(self.getCurrentPage().config.artwork.images[index]);
                                return true;
                            }
                        },
                        load: {
                            name: 'Load image',
                            icon: 'fa-file-image-o',
                            callback: function(itemKey, opt) {
                                var page = self.getCurrentPage().config;
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                new FileChooser(function(file) {
                                    $.overlay('show');
                                    file.load(function() {
                                        page.artwork.images[index] = $.extend(new Image, { src: this.result });
                                        elem.load(this.result);
                                        $.overlay('hide');
                                    });
                                }, { format: 'image/*' }).open();
                            }
                        },
                        change: {
                            name: 'Settings',
                            icon: 'fa-cog',
                            items: {
                                style: {
                                    name: '<label class="mb-1">Style</label>',
                                    type: 'select',
                                    isHtmlName: true,
                                    selected: function() { return self.getCurrentPage().config.artwork.style },
                                    events: {
                                        change: function(ev, obj) {
                                            var config = self.getCurrentPage().config.artwork;
                                            config.style = $(this).val();
                                            config.variant = 0;
                                            self.render();
                                            ev.data.inputs.variant.$input.trigger(
                                                'build',
                                                [ Object.values(styleName)[self.getCurrentPage().config.artwork.style] ]
                                            );
                                        }
                                    }
                                },
                                variant: {
                                    name: '<label class="mb-1">Variant</label>',
                                    type: 'select',
                                    isHtmlName: true,
                                    selected: function() { return self.getCurrentPage().config.artwork.variant },
                                    events: {
                                        change: function(ev) {
                                            self.getCurrentPage().config.artwork.variant = $(this).val();
                                            self.render();
                                        }
                                    }
                                },
                                sep1: '----',
                                background: {
                                    type: 'html',
                                    html: [
                                        '<span class="mr-2">Background</span>',
                                        '<input class="picker-placeholder" id="artwork-background-picker" type="text" width="0"></input>'
                                    ].join('')
                                },
                                borderColor: {
                                    type: 'html',
                                    html: [
                                        '<span class="mr-2">Border</span>',
                                        '<input class="picker-placeholder" id="border-color-picker" type="text" width="0"></input>'
                                    ].join('')
                                },
                                borderWidth: {
                                    type: 'html',
                                    html: [
                                        '<div id="border-width-slider" class="mt-0">',
                                            '<div id="custom-handle" class="ui-slider-handle"></div>',
                                        '</div>'
                                    ].join('')
                                },
                                sep2: '----',
                                restore: {
                                    name: 'Restore defaults',
                                    icon: 'fa-undo',
                                    callback: function() {
                                        $('#artwork-background-picker').spectrum('set', new tinycolor('#00000000')).trigger('change');
                                        $('#border-color-picker').spectrum('set', new tinycolor('#00000000')).trigger('change');
                                        $('#border-width-slider').slider('value', 0);
                                        $("#custom-handle").text('0');
                                        return false;
                                    }
                                }
                            }
                        },
                        sep0: '----',
                        cut: {
                            name: 'Cut',
                            icon: 'fa-cut',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                clipboard = page.artwork.images[index].src;
                                page.artwork.images[index] = new Image();
                                elem.attr('href', null).orElse('dummy');
                            }
                        },
                        copy: {
                            name: 'Copy',
                            icon: 'fa-copy',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                clipboard = page.artwork.images[index].src;
                            }
                        },
                        paste: {
                            name: 'Paste',
                            icon: 'fa-paste',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                page.artwork.images[index].src = clipboard;
                                elem.load(page.artwork.images[index].src);
                            }
                        },
                        sep1: '----',
                        remove: {
                            name: 'Remove',
                            icon: 'fa-times',
                            callback: function() {
                                var page = self.getCurrentPage().config;
                                var elem = SVG.get(menuTrigger[0].id);
                                if (elem == null)
                                    return false;

                                var index = elem.classes()[1].replace('art-no-', '');
                                page.artwork.images[index] = new Image();
                                elem.attr('href', null).orElse('dummy');
                            }
                        }
                    }
                }
            }
        },
        cover: {
            image: {
                include: [ '.cover-image' ],
                options: {
                    items: {
                        edit: {
                            name: 'Edit',
                            icon: 'fa-edit',
                            callback: function() {
                                new ImageEditor(globalConfig.cover.config.image);
                                return true;
                            }
                        },
                        load: {
                            name: 'Load image',
                            icon: 'fa-file-image-o',
                            callback: function() {
                                new FileChooser(function(file) {
                                    $.overlay('show');
                                    file.load(function() {
                                        globalConfig.cover.config.image = $.extend(new Image, { src: this.result });
                                        SVG.select('.cover-image').members[0].load(this.result);
                                        $.overlay('hide');
                                    });
                                }, { format: 'image/*' }).open();
                            }
                        },
                        sep0: '----',
                        cut: {
                            name: 'Cut',
                            icon: 'fa-cut',
                            callback: function() {
                                clipboard = globalConfig.cover.config.image.src;
                                globalConfig.cover.config.image = new Image();
                                SVG.select('.cover-image').members[0].attr('href', null).orElse('dummy');
                            }
                        },
                        copy: {
                            name: 'Copy',
                            icon: 'fa-copy',
                            callback: function() {
                                clipboard = globalConfig.cover.config.image.src;
                            }
                        },
                        paste: {
                            name: 'Paste',
                            icon: 'fa-paste',
                            callback: function() {
                                globalConfig.cover.config.image.src = clipboard;
                            }
                        },
                        sep1: '----',
                        remove: {
                            name: 'Remove',
                            icon: 'fa-times',
                            callback: function() {
                                globalConfig.cover.config.image = new Image();
                                SVG.select('.cover-image').members[0].attr('href', null).orElse('dummy');
                            }
                        }
                    }
                }
            },
            title: {
                include: [ '.cover-title' ],
                options: {
                    events: {
                        show: function() {
                            $('#title-color-picker').change(function() {
                                SVG.select('.cover-title').fill(
                                    globalConfig.cover.config.titleColor = $(this).spectrum('get').toHexString()
                                );
                            });
                            $('#shadow-color-picker').change(function() {
                                SVG.select('.cover-title').stroke(
                                    globalConfig.cover.config.strokeColor = $(this).spectrum('get').toHexString()
                                );
                            });
                        },
                        activated: function() {
                            $('#title-color-picker').spectrum($.extend({}, {
                                color: globalConfig.cover.config.titleColor
                            }, defaultSpectrum));
                            $('#shadow-color-picker').spectrum($.extend({}, {
                                color: globalConfig.cover.config.strokeColor
                            }, defaultSpectrum));
                        }
                    },
                    items: {
                        title: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Title color</span>',
                                '<input class="picker-placeholder" id="title-color-picker" type="text"></input>'
                            ].join('')
                        },
                        shadow: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Shadow color</span>',
                                '<input class="picker-placeholder" id="shadow-color-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        match: {
                            name: 'Match with back cover',
                            icon: 'fa-exchange',
                            callback: function() {
                                $('#title-color-picker').spectrum('set', globalConfig.rear.config.titleColor).trigger('change');
                                $('#shadow-color-picker').spectrum('set', globalConfig.rear.config.strokeColor).trigger('change');
                                return false;
                            }
                        },
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                $('#title-color-picker').spectrum('set', Cover.defaults.titleColor).trigger('change');
                                $('#shadow-color-picker').spectrum('set', Cover.defaults.strokeColor).trigger('change');
                                return false;
                            }
                        }
                    }
                }
            },
            subtitle: {
                include: [ '.cover-subtitle' ],
                options: {
                    events: {
                        show: function() {
                            $('#subtitle-color-picker').change(function() {
                                SVG.select('.cover-subtitle').fill(
                                    globalConfig.cover.config.subtitleColor = $(this).spectrum('get').toHexString()
                                );
                            });
                        },
                        activated: function() {
                            $('#subtitle-color-picker').spectrum($.extend({}, {
                                color: globalConfig.cover.config.subtitleColor
                            }, defaultSpectrum));
                        }
                    },
                    items: {
                        title: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Subtitle color</span>',
                                '<input class="picker-placeholder" id="subtitle-color-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        match: {
                            name: 'Match with back cover',
                            icon: 'fa-exchange',
                            callback: function() {
                                $('#subtitle-color-picker').spectrum('set', globalConfig.rear.config.subtitleColor).trigger('change');
                                return false;
                            }
                        },
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                $('#subtitle-color-picker').spectrum('set', Cover.defaults.subtitleColor).trigger('change');
                                return false;
                            }
                        }
                    }
                }
            }
        },
        rear: {
            mainImg: {
                include: [ '.qrcode' ],
                options: {
                    events: {
                        activated: function() {
                            $('#code-bkg-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.qrColor,
                                change: function(color) {
                                    $('.qrcode > .fg').css('fill',
                                        globalConfig.rear.config.qrColor = color.toHexString()
                                    );
                                }
                            }, defaultSpectrum));
                        },
                        hide: function() {
                            if (redrawFlag) {
                                redrawFlag = false;
                                self.render();
                            }
                        }
                    },
                    items: {
                        edit_url: {
                            name: 'Change QR code content',
                            type: 'text',
                            value: function() { return globalConfig.rear.config.url },
                            events: {
                                keyup: function(ev) {
                                    if (globalConfig.rear.config.url != $(ev.target).val()) {
                                        globalConfig.rear.config.url = $(ev.target).val();
                                        redrawFlag = true;
                                    }
                                }
                            }
                        },
                        background: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Code color</span>',
                                '<input class="picker-placeholder" id="code-bkg-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                globalConfig.rear.config.qrColor = Rear.defaults.qrColor;
                                $('.qrcode > .fg').css('fill', globalConfig.rear.config.qrColor);
                                $('#code-bkg-picker').spectrum('set', globalConfig.rear.config.qrColor);

                                if (globalConfig.rear.config.url != self.getURL()) {
                                    globalConfig.rear.config.url = self.getURL();
                                    redrawFlag = true;
                                }

                                return false;
                            }
                        }
                    }
                }
            },
            background: {
                include: [ '.rear-outline' ],
                options: {
                    events: {
                        activated: function() {
                            $('#outline-color-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.outlineColor,
                                change: function(color) {
                                    SVG.select('.rear-outline').fill(
                                        globalConfig.rear.config.outlineColor = color.toHexString()
                                    );
                                }
                            }, defaultSpectrum));
                            $('#separating-color-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.separatingColor,
                                change: function(color) {
                                    SVG.select('.rear-separator').fill(
                                        globalConfig.rear.config.separatingColor = color.toHexString()
                                    );
                                }
                            }, defaultSpectrum));
                        }
                    },
                    items: {
                        outline: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Outline color</span>',
                                '<input class="picker-placeholder" id="outline-color-picker" type="text"></input>'
                            ].join('')
                        },
                        seperator: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Separating color</span>',
                                '<input class="picker-placeholder" id="separating-color-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                globalConfig.rear.config.outlineColor = Rear.defaults.outlineColor;
                                SVG.select('.rear-outline').fill(globalConfig.rear.config.outlineColor);
                                $('#outline-color-picker').spectrum('set', globalConfig.rear.config.outlineColor);

                                globalConfig.rear.config.separatingColor = Rear.defaults.separatingColor;
                                SVG.select('.rear-separator').fill(globalConfig.rear.config.separatingColor);
                                $('#separating-color-picker').spectrum('set', globalConfig.rear.config.separatingColor);

                                return false;
                            }
                        }
                    }
                }
            },
            title: {
                include: [ '.rear-title' ],
                exclude: [ '.rear-subtitle' ],
                options: {
                    events: {
                        show: function() {
                            $('#title-color-picker').change(function() {
                                SVG.select('.rear-title').fill(
                                    globalConfig.rear.config.titleColor = $(this).spectrum('get').toHexString()
                                );
                            });
                            $('#shadow-color-picker').change(function() {
                                SVG.select('.rear-title').stroke(
                                    globalConfig.rear.config.strokeColor = $(this).spectrum('get').toHexString()
                                );
                            });
                        },
                        activated: function() {
                            $('#title-color-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.titleColor
                            }, defaultSpectrum));
                            $('#shadow-color-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.strokeColor
                            }, defaultSpectrum));
                        }
                    },
                    items: {
                        title: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Title color</span>',
                                '<input class="picker-placeholder" id="title-color-picker" type="text"></input>'
                            ].join('')
                        },
                        shadow: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Shadow color</span>',
                                '<input class="picker-placeholder" id="shadow-color-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        match: {
                            name: 'Match with front cover',
                            icon: 'fa-exchange',
                            callback: function() {
                                $('#title-color-picker').spectrum('set', globalConfig.cover.config.titleColor).trigger('change');
                                $('#shadow-color-picker').spectrum('set', globalConfig.cover.config.strokeColor).trigger('change');
                                return false;
                            }
                        },
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                $('#title-color-picker').spectrum('set', Rear.defaults.titleColor).trigger('change');
                                $('#shadow-color-picker').spectrum('set', Rear.defaults.strokeColor).trigger('change');
                                return false;
                            }
                        }
                    }
                }
            },
            subtitle: {
                include: [ '.rear-subtitle' ],
                options: {
                    events: {
                        show: function() {
                            $('#subtitle-color-picker').change(function() {
                                SVG.select('.rear-subtitle').fill(
                                    globalConfig.rear.config.subtitleColor = $(this).spectrum('get').toHexString()
                                );
                            });
                        },
                        activated: function() {
                            $('#subtitle-color-picker').spectrum($.extend({}, {
                                color: globalConfig.rear.config.subtitleColor
                            }, defaultSpectrum));
                        }
                    },
                    items: {
                        title: {
                            type: 'html',
                            html: [
                                '<span class="mr-2">Subtitle color</span>',
                                '<input class="picker-placeholder" id="subtitle-color-picker" type="text"></input>'
                            ].join('')
                        },
                        sep: '----',
                        match: {
                            name: 'Match with front cover',
                            icon: 'fa-exchange',
                            callback: function() {
                                $('#subtitle-color-picker').spectrum('set', globalConfig.cover.config.subtitleColor).trigger('change');
                                return false;
                            }
                        },
                        restore: {
                            name: 'Restore defaults',
                            icon: 'fa-undo',
                            callback: function() {
                                $('#subtitle-color-picker').spectrum('set', Rear.defaults.subtitleColor).trigger('change');
                                return false;
                            }
                        }
                    }
                }
            }
        }
    };

    var githubURL = 'https://github.com/tivian';
    var twitterURL = 'https://twitter.com/tivian13';
    var homeURL = 'https://tivian.github.io/CalGen/';
    var lastSave = null;
    var globalConfig, pageIndex, holiday;
    var self;
    var root, draw;
    var defaultRenderFx = function(page) {
        draw.clear();
        draw.svg(page[$.detectIE() ? 'getRawSvg' : 'svg']());
        $.overlay('hide');
    };
    var defaultSpectrum = {
        preferredFormat: 'hex',
        showInitial: true,
        showInput: true
    };
    var defaultFontSize = 100;

    var pageSize = {
        width: 2000,
        height: 2828
    };
    Object.freeze(pageSize);

    var date = new Date();
    CalGen.defaults = {
        projectName: null,
        createDate: null,
        title: null,
        subtitle: null,
        year: date.getFullYear(),
        start: {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        },
        end: {
            year: date.getFullYear() + !!(date.getMonth() != 0),
            month: ((date.getMonth() + 11) % 12) + 1
        },
        lang: 'eng',
        cover: null,
        rear: null,
        pages: null
    };

    CalGen.__version__ = '0.8';

    function CalGen(options) {
        self = this;
        this.config = globalConfig = $.extend(true, { }, CalGen.defaults, options);
        this.reset();
        this.init();
        this[localStorage.getItem('save') != null ? 'load' : 'welcome']();
    }

    CalGen.prototype.init = function() {
        if ($(document.body).data('CalGenInit') == true)
            return;

        $(document).prevent('contextmenu', function(ev) {
            return $(ev.target).is('input');
        });
        $('#octicon').openOnClick(githubURL);
        $('#twitter').openOnClick(twitterURL);

        root = SVG('screen').size('100%', '100%');
        draw = root.nested().size(pageSize.width, pageSize.height);
        draw.panZoom({
            zoomMin: 0.1,
            zoomMax: 5.0,
            zoomFactor: 0.1
        });

        draw.zoom((root.viewbox().height * 0.85) / pageSize.height, { x: 0, y: 0 });
        var resizeFx = function() {
            var rv = root.viewbox(), dv = draw.viewbox();
            draw.move((rv.width - dv.width * Math.pow(dv.zoom, 2)) / 2 + dv.x * dv.zoom, (rv.height - dv.height * Math.pow(dv.zoom, 2)) / 2 + dv.y * dv.zoom);
        };
        resizeFx();
        $(root.node).dblclick(resizeFx);

        var posOpts = { my: 'center bottom', at: 'center bottom-1%', of: window };
        $('#toolbar')
            .draggable({
                handle: '#drag-handle',
                appendTo: 'body',
                containment: 'window',
                scroll: false
            })
            .position(posOpts);
        $(window).resize(function(ev) { $('#toolbar').position(posOpts) });
        $('#new-proj').click(function() { self.new() });
        $('#open-proj').click(function() { self.open() });
        $('.save-as').click(function() { self.saveAs($(this).attr('format')) });
        $('#print-proj').click(function() { self.print() });
        $('#settings-proj').click(function() { self.settings() });
        $('#close-proj').click(function() { self.close() });
        $('#prev-page').click(function() { self.backward() });
        $('#next-page').click(function() { self.forward() });
        $.tooltip('enable');

        $(window).keydown(function(ev) {
            if ($.overlay('visibility'))
                return;

            if (ev.which == 39)
                $('#next-page').trigger('click');
            else if (ev.which == 37)
                $('#prev-page').trigger('click');
        });

        $.contextMenu({
            selector: '.page',
            className: 'contextmenu',
            hideOnSecondTrigger: true,
            build: function($triggerElement, ev) {
                var options = null;
                var activeMenus = menus[self.getCurrentType()];
                var selectFx = function(id) {
                    var elems = SVG.select(id).members;
                    var insideFx = function(elem) {
                        var point = elem.point(ev.pageX, ev.pageY);
                        var result = elem.inside(point.x, point.y);
                        if (result && !menuTrigger.includes(elem.node))
                            menuTrigger.push(elem.node);
                        return result;
                    };
                    
                    return elems.some(insideFx);
                };
                menuTrigger = [];

                for (var key in activeMenus) {
                    var include = activeMenus[key].include || [ ];
                    var exclude = activeMenus[key].exclude || [ ];

                    if (include.some(selectFx) && !exclude.some(selectFx)) {
                        options = activeMenus[key].options;
                        break;
                    }
                }

                return options || false;
            }
        });

        $(document.body).data('CalGenInit', true);
    };

    CalGen.prototype.reset = function() {
        pageIndex = -1;

        if (this.config.pages == null)
            this.config.pages = new Array(12);

        if (!(this.config.cover instanceof Cover))
            this.config.cover = new Cover($.isPlainObject(this.config.cover) ? this.config.cover.config : {});
        
        if (!(this.config.rear instanceof Rear))
            this.config.rear = new Rear($.isPlainObject(this.config.rear) ? this.config.rear.config : {});

        for (var i = 0, y = this.config.start.year; y <= this.config.end.year; y++) {
            var month = {
                start: y == this.config.start.year ? this.config.start.month : 1,
                end: y == this.config.end.year ? this.config.end.month : 12
            };

            for (var m = month.start; m <= month.end; m++, i++) {
                if ($.isPlainObject(this.config.pages[i]) && $.isPlainObject(this.config.pages[i].config)) {
                    this.config.pages[i] = new Page(this.config.pages[i].config);
                } else if(this.config.pages[i] instanceof Page) {
                    this.config.pages[i].config.year = y;
                    this.config.pages[i].config.month = m;
                } else {
                    this.config.pages[i] = new Page({ month: m, year: y });
                }
            }
        }
    };

    CalGen.prototype.clear = function() {
        this.config = globalConfig = $.extend(true, { }, CalGen.defaults);
        this.reset();
        draw.clear();
    };

    CalGen.prototype.welcome = function() {
        var $modal = $([
            '<div class="modal fade" tabindex="-1" role="dialog">',
                '<div class="modal-dialog" role="document">',
                    '<div class="modal-content">',
                        '<div class="modal-body">',
                            '<div class="row mb-2 mx-2">',
                                '<button type="button" class="btn btn-primary btn-lg btn-block" id="new-option" data-dismiss="modal">',
                                    '<i class="fa fa-file-o pr-1" aria-hidden="true"></i> New Project',
                                '</button>',
                            '</div>',
                            '<div class="row mt-2 mx-2">',
                                '<button type="button" class="btn btn-primary btn-lg btn-block" id="open-option" data-dismiss="modal">',
                                    '<i class="fa fa-folder-open-o pr-1" aria-hidden="true"></i> Open Project',
                                '</button>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''));

        $('#new-option', $modal).click(function() { self.new() });
        $('#open-option', $modal).click(function() { self.open() });
        $modal.modal('show');
    };

    CalGen.prototype.new = function() {
        this.showWarning(function() {
            self.clear();
            self.settings('New project', 'Create');
        });
    };

    CalGen.prototype.open = function() {
        this.showWarning(function() {
            self.loadAs('cgp');
        });
    };

    CalGen.prototype.load = function() {
        this.loadAs('storage');
    };

    CalGen.prototype.save = function() {
        this.saveAs('cgp', function(data) {
            try {
                localStorage.setItem('save', data);
                $.snackbar('Saved in browser storage!', 'info');
            } catch(err) {
                $.snackbar('Can\'t save in browser storage! (' + err.message + ')', 'warning');
            }
        });
    };

    CalGen.prototype.print = function() {
        var $iframe = $('<iframe>').css({
            visibility: 'hidden',
            position: 'fixed',
            right: '0',
            bottom: '0'
        });
        
        function closePrint () {
            $iframe.remove();
        }

        function setPrint () {
            this.contentWindow.__container__ = this;
            $(iframe).on('beforeunload afterprint', closePrint);
            this.contentWindow.focus();
            this.contentWindow.print();
        }

        var html = [
            '<body><style>',
            '@page { size: A3; margin: 0mm; }',
            'html, body { max-width: 297mm; max-height: 420mm; }',
            'html, body, .page { margin: 0mm; padding: 0mm; }',
            '.page { page-break-after: always; page-break-inside: avoid; zoom: 80% }',
            '.print:last-child { page-break-after: avoid; }',
            '</style><title>' + this.toString() + '</title>'
        ].join(' ');
        var iframe = $iframe[0];
        var step = 100 / 15 + 0.1;
        $.progressModal('show', 'Preparing to print...');

        this.renderAll(function(page) {
            html += page[$.detectIE() ? 'getRawSvg' : 'svg']();
            $.progressModal('update', step);
        }, function() {
            $.progressModal('update', step);
            html += '</body>';
            $(document.body).append($iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            $iframe.on('load', setPrint);
            $.progressModal('hide');
        });
    };

    CalGen.prototype.settings = function(title, confirm) {
        title = title || 'Project settings';
        confirm = confirm || 'Save changes';

        var $modal = $([
            '<div id="settingsModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="settings modal" aria-hidden="true">',
                '<div class="modal-dialog" role="document">',
                    '<div class="modal-content">',
                        '<div class="modal-header">',
                            '<h5 class="modal-title" id="gridModalLabel"></h5>',
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                        '</div>',
                        '<div class="modal-body">',
                            '<form class="container-fluid" id="needs-validation" novalidate>',
                                '<div class="form-group">',
                                    '<label for="projectName">Project name</label>',
                                    '<input type="text" class="form-control" id="project-name-input" placeholder="Enter project name">',
                                '</div>',
                                '<div class="form-row">',
                                    '<div class="col">',
                                        '<label for="calendarTitle">Title</label>',
                                        '<input type="text" class="form-control" id="calendar-title-input" placeholder="Enter calendar title">',
                                        '<div class="invalid-feedback">Please provide title.</div>',
                                    '</div>',
                                    '<div class="col">',
                                        '<label for="calendarSubtitle">Subtitle</label>',
                                        '<input type="text" class="form-control" id="calendar-subtitle-input" placeholder="Enter calendar subtitle">',
                                        '<div class="invalid-feedback">Please provide subtitle.</div>',
                                    '</div>',
                                '</div>',
                                '<hr>',
                                '<div class="form-row">',
                                    '<div class="col">',
                                        '<label for="firstMonth">From</label>',
                                        '<input type="text" class="form-control" id="fist-month-input" placeholder="First month">',
                                        '<div class="invalid-feedback">Please choose on which month calendar should start.</div>',
                                    '</div>',
                                    '<div class="col">',
                                        '<label for="lastMonth">To</label>',
                                        '<input type="text" class="form-control" id="last-month-input" placeholder="Last month">',
                                        '<div class="invalid-feedback">Please choose on which month calendar should end.</div>',
                                    '</div>',
                                '</div>',
                            '</form>',
                        '</div>',
                        '<div class="modal-footer">',
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>',
                            '<button type="submit" class="btn btn-primary">Save changes</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''));

        var blurFx = function() { $(this).addClass($(this).val() == '' ? 'is-invalid' : 'is-valid') };
        var focusFx = function() { $(this).removeClass('is-invalid is-valid') };
        var $firstMonth = $('#fist-month-input', $modal), $lastMonth = $('#last-month-input', $modal);

        $('.modal-title', $modal).text(title);
        $(':submit', $modal).text(confirm);
        $('#project-name-input', $modal).val(this.config.projectName);
        $('#calendar-title-input', $modal).val(this.config.title).on('blur', blurFx).on('focus', focusFx);
        $('#calendar-subtitle-input', $modal).val(this.config.subtitle).on('blur', blurFx).on('focus', focusFx);

        $firstMonth.mask('99/9999', {
            placeholder: 'mm/yyyy',
            completed: function() {
                var d = new Date(Date.parse(this.val().replace('/', '/01/')));
                d.setMonth(d.getMonth() + 11);
                $lastMonth.val(('00' + (d.getMonth() + 1)).substr(-2) + '/' + (d.getYear() + 1900)).trigger('blur');
            }
        }).val(('00' + this.config.start.month).substr(-2) + '/' + this.config.start.year).on('blur', blurFx).on('focus', focusFx);
        $lastMonth.mask('99/9999', {
            placeholder: 'mm/yyyy',
            completed: function() {
                var d = new Date(Date.parse(this.val().replace('/', '/01/')));
                d.setMonth(d.getMonth() - 11);
                $firstMonth.val(('00' + (d.getMonth() + 1)).substr(-2) + '/' + (d.getYear() + 1900)).trigger('blur');
            }
        }).val(('00' + this.config.end.month).substr(-2) + '/' + this.config.end.year).on('blur', blurFx).on('focus', focusFx);

        $(':submit', $modal).on('click', function(ev) {
            $('input', $modal).trigger('blur');
            if (!$('input.is-invalid', $modal).length) {
                function formatDate(val) {
                    return val.split('/')
                        .map(function(elem) { return parseInt(elem) })
                        .reduce(function(acc, elem, index) {
                            acc[!index ? 'month' : 'year'] = elem;
                            return acc;
                        }, {});
                }

                var hash = self.hashCode();
                globalConfig.projectName = $('#project-name-input', $modal).val();
                globalConfig.title = $('#calendar-title-input', $modal).val();
                globalConfig.subtitle = $('#calendar-subtitle-input', $modal).val();
                globalConfig.start = formatDate($firstMonth.val());
                globalConfig.end = formatDate($lastMonth.val());

                $modal.modal('hide');
                if (hash != self.hashCode() || confirm == 'Create') {
                    if (confirm == 'Create')
                        self.config.createDate = Date.now();
                    self.reset();
                    self.render();
                }
            }
        });
        
        $modal.modal('show');
    };

    CalGen.prototype.close = function() {
        this.showWarning(function() {
            localStorage.removeItem('save');
            self.clear();
            self.welcome();
        });
    };

    CalGen.prototype.showWarning = function(callback) {
        if (callback == null || !$.isFunction(callback))
            return;

        if (this.config.title != null && (lastSave == null || (lastSave != null && lastSave.hash != self.hashCode()))) {
            var $modal = $([
                '<div id="warningModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="warning modal" aria-hidden="true">',
                    '<div class="modal-dialog" role="document">',
                        '<div class="modal-content">',
                            '<div class="modal-body">',
                                'This operation will discard all unsaved changes.<br>',
                                'Do you wish to proceed?',
                            '</div>',
                            '<div class="modal-footer">',
                                '<button type="button" class="btn btn-danger" data-dismiss="modal">No</button>',
                                '<button type="submit" class="btn btn-success" data-dismiss="modal">Yes</button>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));
            $modal.on('hide.bs.modal', function() {
                if ($(document.activeElement).is(':submit')) {
                    callback.call(self);
                }
            }).modal({
                keyboard: false,
                show: true
            });
        } else {
            callback.call(self);
        }
    };

    CalGen.prototype.changeFont = function(callback) {
        if (!(this.getCurrentPage() instanceof Page))
            return false;

        var $modal = $([
            '<div class="modal" tabindex="-1" role="dialog">',
                '<div class="modal-dialog" role="document">',
                    '<div class="modal-content">',
                        '<div class="modal-header">',
                            '<h5 class="modal-title">Choose font</h5>',
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">',
                                '<span aria-hidden="true">&times;</span>',
                            '</button>',
                        '</div>',
                        '<div class="modal-body">',
                            '<div class="media">',
                                '<label class="custom-control custom-radio align-self-center mr-3">',
                                    '<input id="local-file-radio" name="radio" type="radio" class="custom-control-input">',
                                    '<span class="custom-control-indicator"></span>',
                                '</label>',
                                '<div class="media-body">',
                                    '<h5 class="mt-0">Local file</h5>',
                                    '<label class="custom-file">',
                                        '<input type="file" id="local-file-input" class="custom-file-input">',
                                        '<span id="local-file-name" class="custom-file-control"></span>',
                                        '<div class="invalid-feedback">Please choose supported font file format.</div>',
                                    '</label>',
                                '</div>',
                            '</div>',

                            '<div class="media">',
                                '<label class="custom-control custom-radio align-self-center mr-3">',
                                    '<input id="remote-file-radio" name="radio" type="radio" class="custom-control-input">',
                                    '<span class="custom-control-indicator"></span>',
                                '</label>',
                                '<div class="media-body">',
                                    '<h5 class="mt-2">Remote file</h5>',
                                    '<input type="text" class="form-control" id="remote-file-input" placeholder="Enter URL">',
                                    '<input type="text" class="form-control" id="remote-font-name" placeholder="Enter remote font name">',
                                    '<div class="invalid-feedback">Please provide valid URL.</div>',
                                '</div>',
                            '</div>',

                            '<div class="media">',
                                '<label class="custom-control custom-radio align-self-center mr-3">',
                                    '<input id="built-in-radio" name="radio" type="radio" class="custom-control-input">',
                                    '<span class="custom-control-indicator"></span>',
                                '</label>',
                                '<div class="media-body">',
                                    '<h5 class="mt-2">Built-in font</h5>',
                                    '<input type="text" class="form-control" id="built-in-input" placeholder="Enter font name">',
                                    '<div class="invalid-feedback">Please provide existing font name.</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="modal-footer">',
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>',
                            '<button type="submit" class="btn btn-primary">Change</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')).on('hidden.bs.modal', function() { $modal.remove() });

        var $localRadio = $('#local-file-radio', $modal);
        var $remoteRadio = $('#remote-file-radio', $modal);
        var $builtinRadio = $('#built-in-radio', $modal);

        var $localInput = $('#local-file-input', $modal);
        var $remoteInput = $('#remote-file-input', $modal);
        var $remoteName = $('#remote-font-name', $modal);
        var $builtinInput = $('#built-in-input', $modal);

        var $localName = $('#local-file-name', $modal);

        $localRadio.data('getValue', function() {
            var src = $localInput.prop('files')[0];
            return $localInput.is('.is-invalid') ? null : {
                name: $.hash(src),
                src: src
            };
        });
        $remoteRadio.data('getValue', function() {
            var src = $remoteInput.val();
            var name = $remoteName.val();
            return $remoteInput.is('.is-invalid') ? null : {
                name: name != '' ? name : $.hash(src),
                src: src
            };
        });
        $builtinRadio.data('getValue', function() {
            return $builtinInput.is('.is-invalid') ? null : {
                name: $builtinInput.val(),
                src: 'built-in'
            };
        });

        $localInput.on('focus', function() {
            $('#local-file-input ~ .invalid-feedback').hide();
            $localInput.removeClass('is-valid is-invalid');
            $localRadio.click();
        }).on('change', function() {
            $localName.text($localInput.prop('files')[0].name);
        }).on('blur', function() {
            if (Font.isSupportedExtension($localName.text())) {
                $localInput.addClass('is-valid');
            } else {
                $localInput.addClass('is-invalid');
                $('#local-file-input ~ .invalid-feedback').show();
            }
        });

        $remoteInput.on('focus', function() {
            $remoteInput.removeClass('is-valid is-invalid');
            $remoteRadio.click();
        }).on('blur', function() {
            $remoteInput.addClass(validURL($remoteInput.val()) ? 'is-valid' : 'is-invalid');
        });

        $builtinInput.on('focus', function() {
            $builtinInput.removeClass('is-valid is-invalid');
            $builtinRadio.click();
        }).on('blur', function() {
            new Font($builtinInput.val()).load({
                success: function() { $builtinInput.addClass('is-valid') },
                failure: function() { $builtinInput.addClass('is-invalid') },
                after: function(font) { font.remove() }
            });
        });

        $(':submit', $modal).on('click', function(ev) {
            var data = $(':radio:checked', $modal).data('getValue')();
            if (data) {
                callback(new Font(data.name, data.src));
                $modal.modal('hide');
            }
        });

        $modal.modal('show');
        return true;
    }

    CalGen.prototype.saveAs = function(format, callback) {
        format = format || '';
        callback = callback || null;

        var saved = true;
        switch(format) {
            case 'cgp':
                if (callback == null)
                    $.snackbar('Saving project into .cgp file... <i class="fa fa-circle-o-notch fa-spin ml-2"></i>', { destroy: false });

                this.config.version = CalGen.__version__;
                LZUTF8.compressAsync(JSON.stringify(this.config), { useWebWorker: true }, function(result, error) {
                    if (error !== undefined) {
                        console.error('Compression error: ' + error.message);
                        $.snackbar('hide');
                        $.snackbar('show', 'Can\'t save project! (' + error.message + ')', 'danger');
                        return;
                    }

                    var out = result.reduce(function(acc, val) {
                        acc += String.fromCharCode(val ^ 0x89);
                        return acc;
                    }, '');

                    if (callback != null) {
                        callback(out);
                        return;
                    }
            
                    $.snackbar('hide');
                    var file = new File([ out ], self.toString() + '.cgp', { type: 'text/plain;charset=utf-8' });
                    saveAs(file);
                });
                break;

            case 'zip':
                var counter = 0, step = 4;
                $.progressModal('show', 'Saving as ZIP...');

                var zip = new JSZip();
                var renderFx = function(page) {
                    counter++;
                    if (counter < globalConfig.pages.length)
                        $.progressModal('update', step);
                    zip.file(this.toString() + '.svg', page.toBlob());
                    if (counter < globalConfig.pages.length)
                        $.progressModal('update', step);
                };
                var callbackFx = function() {
                    $.progressModal('hide');
                    zip.generateAsync({ type: "blob" }).then(function(content) { saveAs(content, self.toString() + '.zip') });
                };

                this.renderAll(renderFx, callbackFx);
                break;

            case 'storage':
                this.save();
                break;

            default:
                saved = false;
                console.error('Unknown format \'' + format + '\'');
        }

        if (saved) {
            lastSave = {
                time: new Date(),
                hash: this.hashCode()
            };
        }
    };

    CalGen.prototype.loadAs = function(format) {
        if (format == 'cgp') {
            new FileChooser(function(file) {
                $.overlay('show');
                file.load(function() { self.__load__(this.result) }, 'text');
            }, { format: '.cgp' }).open();
        } else if (format == 'storage') {
            $.overlay('show');
            this.__load__(localStorage.getItem('save'));
        }
    };

    CalGen.prototype.__load__ = function(data) {
        if (data == null)
            return;

        var out = new Uint8Array(data.length);
        for (var i = 0, j = out.length; i < j; i++) {
            out[i] = data[i].charCodeAt() ^ 0x89;
        }
        
        LZUTF8.decompressAsync(out, { useWebWorker: true }, function(result, error) {
            if (error !== undefined) {
                console.error('Compression error: ' + error.message);
                $.snackbar('show', 'Can\'t load project! (' + error.message + ')', 'danger');
                return;
            }

            try {
                result = JSON.parse(result);
            } catch(err) {
                console.error(err);
                return;
            }

            self.config = globalConfig = $.extend(true, { }, result);
            self.reset();
            pageIndex = 0;
            self.backward();
        });
    };

    CalGen.prototype.firstPage = function(renderFx) {
        pageIndex = -1;
        if (renderFx || false)
            this.render(renderFx);
    };

    CalGen.prototype.lastPage = function() {
        pageIndex = this.config.pages.length;
        if (renderFx || false)
            this.render(renderFx);
    };

    CalGen.prototype.forward = function(renderFx) {
        if (!$('#prev-page').data('enabled')) {
            $('#prev-page').data('enabled', true).tooltip();
            $('#prev-page > i').fadeTo(0, 1);
        }

        if (pageIndex < this.config.pages.length) {
            pageIndex++;
            if (pageIndex == this.config.pages.length) {
                $('#next-page > i').fadeTo(0, 0);
                $('#next-page').tooltip('disable').data('enabled', false);
            }

            this.render(renderFx);
        }
    };

    CalGen.prototype.backward = function(renderFx) {
        if (!$('#next-page').data('enabled')) {
            $('#next-page').data('enabled', true).tooltip();
            $('#next-page > i').fadeTo(0, 1);
        }

        if (pageIndex > -1) {
            pageIndex--;
            if (pageIndex == -1) {
                $('#prev-page > i').fadeTo(0, 0);
                $('#prev-page').tooltip('disable').data('enabled', false);
            }

            this.render(renderFx);
        }
    };

    CalGen.prototype.getCurrentIndex = function() {
        return pageIndex;
    };

    CalGen.prototype.getPage = function(index) {
        return (index <= -1) ? this.config.cover :
               (index >= this.config.pages.length) ? this.config.rear : this.config.pages[index];
    };

    CalGen.prototype.getCurrentPage = function() {
        return this.getPage(pageIndex);
    };

    CalGen.prototype.getCurrentType = function() {
        return pageIndex == -1 ? 'cover' : pageIndex == this.config.pages.length ? 'rear' : 'page';
    }

    CalGen.prototype.getPageName = function() {
        return pageIndex == -1 ? 'Cover' : pageIndex == this.config.pages.length ? 'Rear' : (pageIndex + 1).toString();
    };

    CalGen.prototype.render = function(renderFx) {
        if (renderFx == null || renderFx == defaultRenderFx)
            $.overlay('show');

        var str = this.getPageName();
        var $pageNumber = $('#page-number');
        if ($pageNumber.text() != str) {
            $pageNumber.text(str);
        }

        setTimeout(function() {
            self.getCurrentPage().render(renderFx || defaultRenderFx);
        }, 10);
    };

    CalGen.prototype.renderAll = function(renderFx, callback) {
        if (!$.isFunction(renderFx))
            return;

        var i = -1;
        callback = callback || $.noop;

        var fx = function() {
            self.getPage(i).render(renderFx, function() {
                i++;

                if (i > globalConfig.pages.length)
                    callback();
                else
                    setTimeout(fx, 1);
            });
        };
        setTimeout(fx, 1);
    };

    CalGen.prototype.getBlankPage = function() {
        var wrapper = $('<div>', { id: 'wrapper' })[0];
        var draw = SVG(wrapper).addClass('page').size(pageSize.width, pageSize.height);
        draw.rect(pageSize.width, pageSize.height).fill('#fff');

        return draw;
    };

    CalGen.prototype.getURL = function() {
        return homeURL;
    };

    CalGen.prototype.hashCode = function() {
        return SparkMD5.hash(JSON.stringify(this.config));
    };

    CalGen.prototype.toString = function() {
        return this.config.projectName != null && this.config.projectName != '' ?
            this.config.projectName : this.hashCode().substr(0, 8).toUpperCase();
    };

    var Cover = (function() {
        Cover.defaults = {
            image: null,
            font: null,
            shadowBlur: 7,
            strokeWidth: 8,
            strokeColor: 'Black',
            titleColor: 'Crimson',
            subtitleColor: 'Crimson'
        };
        Cover.defaultFont = 'Palatino Linotype';

        function Cover(options) {
            this.config = $.extend(true, { }, Cover.defaults, options);
            this.defs = new SVG.Defs();

            this.config.image = $.extend(new Image, this.config.image);
            this.config.font = $.extend(new Font, { name: Cover.defaultFont, src: 'built-in' }, this.config.font);
        }

        function loadResources(renderFx, callback) {
            var that = this;
            if ($.isUndefined(this.resources)) {
                this.resources = [ this.config.image, this.config.font ];
                this.success = function() { that.render(renderFx, callback) };
                this.failure = function(res) {
                    $.snackbar('Can\'t load resource ' + res.src, 'danger');
                    that.render(renderFx, callback, true);
                };
                this.loaderOpt = { success: this.success, failure: this.failure, append: this.defs.node };
            }            

            if (!$.contains(document.head, this.defs.node))
                $(document.head).append(this.defs.node);

            $('*', this.defs.node).addClass('to-remove');
            for (var i = 0; i < this.resources.length; i++) {
                if (this.resources[i] instanceof Font)
                    $('#' + this.resources[i].id, this.defs.node).removeClass('to-remove');

                if (!this.resources[i].loaded) {
                    this.resources[i].load((!(this.resources[i] instanceof Font)) ? this.success : this.loaderOpt);
                    return false;
                }
            }

            $('.to-remove', this.defs.node).remove();
            if (!$.isUndefined(this.resources)) {
                delete this.resources;
                delete this.success;
                delete this.failure;
                delete this.loaderOpt;
            }

            return true;
        }

        Cover.prototype.render = function(renderFx, callback) {
            if (!loadResources.call(this, renderFx, callback)) {
                return;
            }

            var draw = self.getBlankPage();

            var width = 1500;
            var height = width * ((this.config.image.height / this.config.image.width) || 1);
            var x = (pageSize.width - width) / 2;
            var y = (pageSize.height - height) / 2;
            draw.image(this.config.image.src)
                .addClass('cover-image')
                .size(width, height)
                .orElse('dummy')
                .attr({ x: x, y: y });
            
            width = 1730;
            var text = globalConfig.title;
            var fontFamily = this.config.font.name;
            var fontSize = defaultFontSize;
            fontSize = width * fontSize / measureText(text, fontFamily, fontSize).width;
            var measure = measureText(text, fontFamily, fontSize);
            x = (pageSize.width - width) / 2 - 15;
            y = 200 + measure.height;
            draw.plain(text || '')
                .addClass('cover-title')
                .style({ font: fontSize + 'px "' + fontFamily + '"' })
                .stroke({ color: this.config.strokeColor, width: this.config.strokeWidth + this.config.shadowBlur / 2 })
                .fill(this.config.titleColor)
                .attr({ x: x, y: y })
                .gaussianBlur(this.config.shadowBlur);
            
            text = globalConfig.subtitle;
            fontSize = defaultFontSize;
            measure = measureText(text, fontFamily, fontSize);
            x = 1000 - 0.5 * measure.width;
            y = 2490 - measure.height;
            draw.plain(text || '')
                .addClass('cover-subtitle')
                .style({ font: fontSize + 'px "' + fontFamily + '"' })
                .fill(this.config.subtitleColor)
                .attr({ x: x, y: y });

            draw.add(this.defs);
            (renderFx || defaultRenderFx).call(this, draw);
            (callback || $.noop).call(this);
        };

        Cover.prototype.toString = function() {
            return '_Cover';
        };

        Cover.prototype.toJSON = function() {
            return {
                config: this.config
            };
        };

        return Cover;
    })();

    var Rear = (function() {
        Rear.defaults = {
            font: null,
            shadowBlur: 7,
            strokeWidth: 8,
            strokeColor: 'Black',
            titleColor: 'Crimson',
            subtitleColor: 'Crimson',
            outlineColor: 'Black',
            separatingColor: 'Red',
            url: null,
            qrColor: 'Black'
        };
        Rear.defaultFont = 'Palatino Linotype';

        function Rear(options) {
            this.config = $.extend(true, { }, Rear.defaults, options);
            this.defs = new SVG.Defs();

            this.config.font = $.extend(new Font, { name: Rear.defaultFont, src: 'built-in' }, this.config.font);
            this.config.url = this.config.url || self.getURL();
        }

        function loadResources(renderFx, callback) {
            var that = this;
            if ($.isUndefined(this.resources)) {
                this.resources = [ this.config.font ];
                this.success = function() { that.render(renderFx, callback) };
                this.failure = function(res) {
                    $.snackbar('Can\'t load resource ' + res.src, 'danger');
                    that.render(renderFx, callback, true);
                };
                this.loaderOpt = { success: this.success, failure: this.failure, append: this.defs.node };
            }            
            
            if (!$.contains(document.head, this.defs.node))
                $(document.head).append(this.defs.node);

            $('*', this.defs.node).addClass('to-remove');
            for (var i = 0; i < this.resources.length; i++) {
                if (this.resources[i] instanceof Font)
                    $('#' + this.resources[i].id).removeClass('to-remove');
                
                if (!this.resources[i].loaded) {
                    this.resources[i].load(!(this.resources[i] instanceof Font) ? this.success : this.loaderOpt);
                    return false;
                }
            }

            $('.to-remove', this.defs.node).remove();
            if (!$.isUndefined(this.resources)) {
                delete this.resources;
                delete this.success;
                delete this.failure;
                delete this.loaderOpt;
            }

            return true;
        }

        Rear.prototype.render = function(renderFx, callback) {
            if (!loadResources.call(this, renderFx, callback)) {
                return;
            }

            var that = this;
            var draw = self.getBlankPage();

            var width = 1730;
            var text = globalConfig.title;
            var fontFamily = this.config.font.name;
            var fontSize = defaultFontSize;
            fontSize = width * fontSize / measureText(text, fontFamily, fontSize).width;
            var measure = measureText(text, fontFamily, fontSize);
            var x = (pageSize.width - width) / 2 - 15;
            var y = 200 + measure.height;
            draw.plain(text || '')
                .addClass('rear-title')
                .style({ font: fontSize + 'px "' + fontFamily + '"' })
                .stroke({ color: this.config.strokeColor, width: this.config.strokeWidth + this.config.shadowBlur / 2 })
                .fill(this.config.titleColor)
                .attr({ x: x, y: y })
                .gaussianBlur(this.config.shadowBlur);
            
            width = 800;
            text = globalConfig.subtitle;
            fontSize = defaultFontSize;
            fontSize = width * fontSize / measureText(text, fontFamily, fontSize).width;
            measure = measureText(text, fontFamily, fontSize);
            draw.plain(text || '')
                .addClass('rear-subtitle')
                .style({ font: fontSize + 'px "' + fontFamily + '"' })
                .fill(this.config.subtitleColor)
                .attr({
                    x: 1050,
                    y: y + 1.3 * measure.height
                });
            
            draw.rect(1354, 1418)
                .addClass('rear-outline')
                .fill(this.config.outlineColor)
                .attr({ x: 323, y: 881 });
            draw.rect(1340, 1404)
                .addClass('rear-separator')
                .fill(this.config.separatingColor)
                .attr({ x: 330, y: 888 });

            var step = 0;
            if ($.progressModal('visibility')) {
                step = Math.floor((100 - $.progressModal('value')) / 12);
            }

            var y = 0, x = 0;
            var pageFx = function() {
                var scale = 0.16;
                let posX = 342 + x * 332;
                let posY = 900 + y * 464;
                globalConfig.pages[y * 4 + x].render(function(page) {
                    page.attr({
                        viewBox: '0 0 ' + pageSize.width + ' ' + pageSize.height,
                        width: pageSize.width * scale,
                        height: pageSize.height * scale
                    });
                    draw.nested().svg(page[$.detectIE() ? 'getRawSvg' : 'svg']())
                        .attr({ x: posX, y: posY });
                }, function() {
                    x++;
                    if (x == 4) {
                        y++;
                        x = 0;
                    }

                    $.progressModal('update', step);
                    if (y < 3) {
                        setTimeout(pageFx, 1);
                    } else {
                        if (that.config.url != "") {
                            var qrCode = draw.nested()
                                .svg(QRCode.generateSVG(that.config.url, {
                                    ecclevel: 'Q',
                                    fillcolor: '#fff',
                                    textcolor: that.config.qrColor,
                                    margin: 4,
                                    modulesize: 8
                                }).outerHTML)
                                .size(300, 300)
                                .attr({
                                    x: 1500,
                                    y: 2500
                                });
                            qrCode.children()[0].addClass('qrcode');
                        }

                        draw.add(that.defs);
                        (renderFx || defaultRenderFx).call(that, draw);
                        (callback || $.noop).call(that);
                    }
                });
            };

            setTimeout(pageFx, 1);
            $.progressModal('update', step);
        };

        Rear.prototype.toString = function() {
            return 'Rear';
        };

        Rear.prototype.toJSON = function() {
            return {
                config: this.config
            };
        };

        return Rear;
    })();

    var Page = (function() {
        Page.defaults = {
            year: null,
            month: null,
            font: {
                month: null,
                day: null,
                holiday: null
            },
            mainImg: null,
            ribbon: {
                font: null,
                text: null,
                background: null,
                shadowColor: 'Black',
                shadowBlur: 15
            },
            artwork: {
                style: 0,
                variant: 0,
                background: { color: '#000', opacity: 0 },
                border: { color: '#000', opacity: 0, width: 0 },
                images: null
            },
            color: {
                month: 'Black',
                day: 'Black',
                holiday: {
                    date: 'Crimson',
                    normal: 'Black',
                    special: 'DarkRed'
                },
                fade: {
                    day: { color: '#808080', opacity: 0.3 },
                    holiday: { color: '#DC0000', opacity: 0.3 }
                }
            }
        };
        Page.defaultFont = {
            month: 'Georgia',
            day: 'Georgia',
            holiday: 'Helvetica',
            ribbon: 'Arial'
        };

        function Page(options) {
            this.config = $.extend(true, { }, Page.defaults, options);
            this.defs = new SVG.Defs();

            if (this.config.year == null && this.config.month == null)
                return;

            this.config.font.month = $.extend(new Font, { name: Page.defaultFont.month, src: 'built-in' }, this.config.font.month);
            this.config.font.day = $.extend(new Font, { name: Page.defaultFont.day, src: 'built-in' }, this.config.font.day);
            this.config.font.holiday = $.extend(new Font, { name: Page.defaultFont.holiday, src: 'built-in' }, this.config.font.holiday);
            this.config.mainImg = $.extend(new Image, this.config.mainImg);
            this.config.ribbon.font = $.extend(new Font, { name: Page.defaultFont.ribbon, src: 'built-in' }, this.config.ribbon.font);
            this.config.ribbon.background = $.extend(new Image, this.config.ribbon.background);
            
            if (this.config.artwork.images == null) {
                this.config.artwork.images = new Array(6).fill(new Image());
            } else {
                for (var i = 0; i < this.config.artwork.images.length; i++)
                    this.config.artwork.images[i] = $.extend(new Image, this.config.artwork.images[i]);
                $.merge(this.config.artwork.images, new Array(6 - this.config.artwork.images.length).fill(new Image()));
            }
            Object.seal(this.config.artwork.images);
        }

        function loadResources(renderFx, callback) {
            var that = this;
            if ($.isUndefined(this.resources)) {
                this.resources = $.merge([
                    this.config.mainImg, this.config.font.month,
                    this.config.font.day, this.config.font.holiday,
                    this.config.ribbon.font, this.config.ribbon.background
                ], this.config.artwork.images || []);
                this.success = function() { that.render(renderFx, callback) };
                this.failure = function() {
                    $.snackbar('Can\'t load resource ' + that.resources[i].src, 'danger');
                    that.render(renderFx, callback, true);
                };
                this.loaderOpt = { success: this.success, failure: this.failure, append: this.defs.node };
            }

            if (!$.contains(document.head, this.defs.node))
                $(document.head).append(this.defs.node);

            $('*', this.defs.node).addClass('to-remove');
            for (var i = 0; i < this.resources.length; i++) {
                if (this.resources[i] instanceof Font)
                    $('#' + this.resources[i].id, this.defs.node).removeClass('to-remove');

                if (!this.resources[i].loaded) {
                    this.resources[i].load(!(this.resources[i] instanceof Font) ? this.success : this.loaderOpt);
                    return false;
                }
            }

            $('.to-remove', this.defs.node).remove();
            if (!$.isUndefined(this.resources)) {
                delete this.resources;
                delete this.success;
                delete this.failure;
                delete this.loaderOpt;
            }

            return true;
        }
    
        Page.prototype.render = function(renderFx, callback, force) {
            force = force || false;
            if (!force && !loadResources.call(this, renderFx, callback)) {
                return;
            }

            var draw = self.getBlankPage();

            var year = this.config.year;
            var month = this.config.month;
            var fontSize = defaultFontSize;
            var day, monthLength, monthIndex = month - 1;

            draw.image(this.config.mainImg.src)
                .addClass('page-image')
                .size(1832, 1832)
                .orElse('dummy')
                .attr({ x: 88, y: 114 });

            var ribbon = draw.image(this.config.ribbon == null ? '' : this.config.ribbon.background.src)
                .addClass('page-ribbon-bkg')
                .size(814, 257)
                .orElse('dummy')
                .attr({ x: 1107, y: 1680 })
                .gaussianBlur(this.config.ribbon == null ? 0 : this.config.ribbon.shadowBlur);

            if (this.config.ribbon != null && typeof this.config.ribbon.text === 'string') {
                draw.centeredText(this.config.ribbon.text, ribbon, { x: 10, y: 10 })
                    .font(this.config.ribbon.font.name);
            }

            draw.plain(locale[globalConfig.lang].monthName[monthIndex] + (globalConfig.start.year != this.config.year ? " " + year : ""))
                .style({ font: '80px ' + this.config.font.month.name + ' small-caps' })
                .fill(this.config.color.month)
                .attr({ x: 70, y: 2034 });

            for (var weekDay = 0; weekDay < 7; weekDay++) {
                draw.plain(locale[globalConfig.lang].dayName[weekDay])
                    .style({ font: '20px ' + this.config.font.day.name })
                    .fill(weekDay >= 5 ? this.config.color.holiday.date : this.config.color.day)
                    .attr({
                        x: 179 + weekDay * 182 - 0.5 * measureText(locale[globalConfig.lang].dayName[weekDay], this.config.font.day.name, 20).width,
                        y: 2080
                    });
            }

            var dayOfWeek = getDayOfWeek(year, month, 1);
            if (dayOfWeek == 0) {
                day = 1;
                monthLength = getMonthLength(year, month);
            } else {
                var lastMonthLength = (month == 1) ? getMonthLength(year - 1, 12) : getMonthLength(year, month - 1);
                day = lastMonthLength - dayOfWeek + 1;
                monthLength = lastMonthLength;
            }

            for (var week = 0; week < 5; week++) {
                for (var weekDay = 0; weekDay < 7; weekDay++) {
                    if (day > monthLength) {
                        day = 1;
                        monthLength = getMonthLength(year, month);
                    }

                    var isFade = (week == 0 && day > 7) || (week == 4 && day <= 7);
                    var isExtraDays = (week == 4 && getWeekOfMonth(year, month) > 5 && weekDay < getLastWeekLength(year, month));
                    var fillStyle = [ weekDay <= 4 ?
                        (isFade ? this.config.color.fade.day : this.config.color.day) :
                        (isFade ? this.config.color.fade.holiday : this.config.color.holiday.date) ];

                    if (!isFade) {
                        var currHolidays = new Array(isHoliday(year, month, day));
                        if (isExtraDays) {
                            currHolidays.push(isHoliday(year, month, day + 7));
                        }

                        for (var i = 0; i < currHolidays.length; i++) {
                            if (currHolidays[i].value == true) {
                                var text, width, length = currHolidays[i].tab.length;
                                fontFamily = this.config.font.holiday.name;
                                fontSize = 10;
                                
                                for (var j = 0; j < length; j++) {
                                    text = currHolidays[i].tab[j].name;
                                    width = measureText(text.toUpperCase(), fontFamily, fontSize).width;
                                    
                                    fillStyle[i] = (currHolidays[i].tab[j].special || weekDay > 4 || fillStyle[i] == this.config.color.holiday.date) ?
                                        this.config.color.holiday.date : this.config.color.day;
                                    draw.plain(text.toUpperCase())
                                        .style({ font: fontSize + 'px "' + fontFamily + '"' })
                                        .fill(currHolidays[i].tab[j].special ?
                                            this.config.color.holiday.special : this.config.color.holiday.normal)
                                        .attr({
                                            x: (i == 0 ? 105 : 258 - width) + weekDay * 182,
                                            y: (isExtraDays && i == 0 ? 2150 : 2215) + week * 130 - (length - j - 1) * 11
                                        });
                                }
                            }
                        }
                    }

                    fontFamily = this.config.font.day.name;
                    fontSize = 40;
                    draw.plain((day++).toString())
                        .style({ font: fontSize + 'px "' + fontFamily + '"' })
                        .fill(fillStyle[0])
                        .attr({
                            x: 250 + weekDay * 182,
                            y: 2140 + week * 130,
                            'text-anchor': 'end'
                        });

                    draw.rect(165, 1.1)
                        .fill('#000')
                        .attr({
                            x: 99 + weekDay * 182,
                            y: 2225 + week * 130
                        });

                    if (isExtraDays) {
                        draw.plain((day + 6).toString())
                            .style({ font: fontSize + 'px "' + fontFamily + '"' })
                            .fill(fillStyle[1])
                            .attr({
                                x: 110 + weekDay * 182,
                                y: 2725
                            });

                        draw.rect(165, 1.1)
                            .fill('#000')
                            .attr({
                                x: 99 + weekDay * 182,
                                y: 2680
                            });
                    }

                    if (weekDay != 6) {
                        draw.rect(1.1, 119)
                            .fill('#000')
                            .attr({
                                x: 272 + weekDay * 182,
                                y: 2100 + week * 130
                            });
                    }
                }
            }

            var style = this.config.artwork.style;
            var variant = this.config.artwork.variant;
            var tile = tiles[style];
            var i = 0;

            draw.rect(540, 780)
                .addClass('artwork-background')
                .fill(this.config.artwork.background)
                .attr({ x: 1390, y: 1980 });

            do {
                var size = Array.isArray(tile.size) ?
                    { width: tile.size[0], height: tile.size[1] } :
                    { width: tile.size,    height: tile.size    };

                draw.rect(size.width, size.height)
                    .addClass('artwork-border')
                    .stroke(this.config.artwork.border).fill({ opacity: 0 })
                    .attr({
                        x: 1400 + tile.shift[variant][i][0],
                        y: 1990 + tile.shift[variant][i][1]
                    });

                draw.image(this.config.artwork.images[i].src)
                    .addClass('artwork art-no-' + i)
                    .size(size.width, size.height)
                    .orElse('dummy')
                    .attr({
                        x: 1400 + tile.shift[variant][i][0],
                        y: 1990 + tile.shift[variant][i][1]
                    });
            } while(++i < style);

            draw.add(this.defs);
            (renderFx || defaultRenderFx).call(this, draw);
            (callback || $.noop).call(this);
        };

        Page.prototype.toString = function() {
            return this.config.year + '_' + this.config.month;
        };

        Page.prototype.toJSON = function() {
            return {
                config: this.config
            };
        };
    
        function createDate(y, m, d) {
            return new Date(y, m - 1, d, 1);
        }
    
        function getDayOfWeek(y, m, d) {
            return (createDate(y, m, d).getDay() + 13) % 7;
        }
    
        function getMonthLength(y, m) {
            return 31 - (m == 2 ? 3 - !((y % 4) || ((y % 100 == 0) && (y % 400))) : (m - 1) % 7 % 2);
        }
    
        function getWeekOfMonth(y, m) {
            var firstDay = getDayOfWeek(y, m, 1);
            var lenMonth = getMonthLength(y, m);
            var firstWeek = 7 - firstDay;
            var lastWeek = (lenMonth + firstDay - 7) % 7;
            var restMonth = lenMonth - (firstWeek + lastWeek);
            return restMonth / 7 + (firstWeek != 0) + (lastWeek != 0);
        }
    
        function getLastWeekLength(y, m) {
            return (getMonthLength(y, m) + getDayOfWeek(y, m, 1) - 7) % 7;
        }

        function getLastDayOfWeek(y, m, dayOfWeek) {
            var monthLength = getMonthLength(y, m);
            var shift = dayOfWeek - getDayOfWeek(y, m, monthLength);
            if (shift > 0)
                shift -= 7;
            return createDate(y, m, monthLength + shift);
        }
    
        function getEasterDay(y) {
            var a = y % 19;
            var b = Math.floor(y / 100);
            var c = y % 100;
            var d = Math.floor(b / 4);
            var e = b % 4;
            var f = Math.floor((b + 8) / 25);
            var g = Math.floor((b - f + 1) / 3);
            var h = (19 * a + b - d - g + 15) % 30;
            var i = Math.floor(c / 4);
            var j = c % 4;
            var k = (32 + 2 * e + 2 * i - h - j) % 7;
            var l = Math.floor((a + 11 * h + 22 * k) / 451);
            var m = (h + k - 7 * l + 114) % 31;
            
            var day = m + 1;
            var month = Math.floor((h + k - 7 * l + 114) / 31);
            return createDate(y, month, day);
        }

        function addDays(date, days) {
            date.setHours(24 * days + 1);
        }
        
        function isHoliday(y, m, d) {
            if (typeof holiday === 'undefined' || (typeof holiday !== 'undefined' && holiday.year != y)) {
                holiday = {
                    year: y,
                    dates: $.extend(true, { }, locale[globalConfig.lang].holiday)
                };

                var easter = getEasterDay(y);
                var shift = locale['global'].movingHolidayShift;

                for (var i = 0; i < shift.length; i++) {
                    var date = new Date(easter);
                    addDays(date, shift[i]);
                    holiday.dates[date.getMonth()].push([
                        date.getDate(),
                        locale[globalConfig.lang].movingHoliday[i],
                        true
                    ]);
                }

                for (var i = 0; i < locale[globalConfig.lang].timeChange.length; i++) {
                    var timeChangeDate = getLastDayOfWeek(y, locale[globalConfig.lang].timeChange[i].month, 6);
                    holiday.dates[timeChangeDate.getMonth()].push([
                        timeChangeDate.getDate(),
                        locale[globalConfig.lang].timeChange[i].name,
                        false
                    ]);
                }
            }
            
            var tab = [];
            for (var i = 0; i < holiday.dates[m - 1].length; i++) {
                if (holiday.dates[m - 1][i][0] == d) {
                    tab.push({
                        name:    holiday.dates[m - 1][i][1],
                        special: holiday.dates[m - 1][i][2]
                    });
                }
            }
            
            if (tab.length == 0)
                return { value: false };
            else
                return { value: true, tab: tab };
        }

        return Page;
    })();

    return CalGen;
})();

var ImageEditor = (function() {
    /*
    Move Rotate       Resize  Paintbrush
         Rotate Axis  Crop    Eraser
    */

    function ImageEditor(img, options) {
        $.snackbar('show', 'Image editor is not implemented yet.');
        /*var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        $(canvas).css({ position: 'absolute' });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        $(parent).append(canvas);
        //new ElemScaler(canvas, { scale: { init: 1 } });*/
    }

    return ImageEditor;
})();

var Font = (function() {
    var formats = [
        { ext: '.ttf',  mime: 'application/x-font-ttf'  },
        { ext: '.otf',  mime: 'application/x-font-otf'  },
        { ext: '.woff', mime: 'application/x-font-woff' }
    ];

    function Font(name, src) {
        this.name = name;
        this.src = src || 'built-in';
        this.loaded = src === 'built-in';
    }

    Font.prototype.check = function() {
        if (this.name == null || this.name == '')
            return false;

        if (this.name.indexOf('serif') != -1)
            return true;
            
        if (!$(document.head).has(this.options.append).length)
            $(document.head).append(this.options.append);

        function render(name) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = 400;
            canvas.height = 150;

            ctx.fillStyle = 'White';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '100px "' + name + '"';
            ctx.fillStyle = 'Black';
            ctx.fillText('QAPS', 10, 100);

            return canvas.toDataURL();
        }

        return render('serif') != render(this.name);
    };

    Font.prototype.load = function(options) {
        if ($.isFunction(options))
            options = { success: options };
        else if (!$.isPlainObject(options))
            options = { };

        this.options = $.extend({ }, Font.defaults, options);
        if ($.isUndefined(this.id))
            this.id = $.hash(name + Date.now());

        if (typeof this.src === 'string') {
            if (this.loaded || this.src == 'built-in') {
                if (this.src == 'built-in' && !this.check())
                    console.log("Unsupported font '" + this.name + "'");
                
                loadEnd.call(this, this.loaded = true);
            } else if (this.src instanceof File) {
                loadFile.call(this);
            } else if (this.src.indexOf(';base64,') > 0 || Font.isSupportedExtension(this.src)) {
                loadURL.call(this);
            } else if (this.src.indexOf('css') > 0) {
                loadLink.call(this);			
            }
        } else {
            loadEnd.call(this);
        }
    };

    Font.prototype.remove = function() {
        $('#' + this.id, this.options.append).remove();
    };

    Font.defaults = {
        success: $.noop,
        failure: $.noop,
        after: $.noop,
        append: document.head
    };

    Font.isSupportedExtension = function(src) {
        src = src.toUpperCase();
        return formats.some(function(format) {
            return src.length - src.lastIndexOf(format.ext.toUpperCase()) == format.ext.length;
        });
    };

    Font.getMime = function(src) {
        var format = formats.find(function(format) {
            return src.substr(src.lastIndexOf('.') - src.length) == format.ext;
        });

        return $.isUndefined(format) ? '' : format.mime;
    };

    function loadEnd(force) {
        if (force || (this.loaded = this.check()))
            this.options.success(this);
        else
            this.options.failure(this);
        this.options.after(this);
    }

    function loadFile() {
        var that = this;
        this.src.load(function() {
			that.src = this.result.replace('application/octet-stream', Font.getMime(that.src.name));
            addStyle.call(that, false);
        });
    }

    function loadLink() {
        var that = this;
        var $link = $('<link>', {
            id: this.id,
            href: this.src,
            type: 'text/css',
            rel: 'stylesheet'
        });
        
        var loadFx = function() {
            $link.off('load', loadFx);
            loadEnd.call(that);
        };
        
        $link.on('load', loadFx);
        $(this.options.append).append($link);
    }

    function loadURL() {
        addStyle.call(this, true);
    }

    function addStyle(isLoadingAPI) {
        var that = this;
        var $style = $('<style>', {
            id: this.id,
            text:
            '@font-face {' +
                'font-family: "' + this.name + '";' +
                'src: url(' + this.src + ');' +
            '}'
        });

		if (!isLoadingAPI || $.detectIE()) {
			var loadFx = function() {
				$style.off('load', loadFx);
				loadEnd.call(that);
			};

			$style.on('load', loadFx);
		} else {
			var buffer = $.base64ToBuffer(that.src);
			var font = new FontFace(that.name, buffer);
			document.fonts.add(font);
			font.load().then(function(result) {
				that.loaded = true;
				that.options.success(that);
			}, function(error) {
				that.loaded = false;
				that.options.failure(that);
			});
		}

        $(this.options.append).append($style);
    }
    
    Font.prototype.toString = function() {
        return this.name;
    };

    Font.prototype.toJSON = function() {
        return {
            name: this.name,
            src: this.src
        }
    };

    return Font;
})();

var FileChooser = (function() {
    FileChooser.defaults = {
        format: '*',
        multiple: false
    };

    var $button = null;

    function FileChooser(callback, config) {
        if (config == null && $.isPlainObject(callback)) {
            config = callback;
            callback = null;
        }

        callback = callback || $.noop;
        config = $.extend(true, { }, FileChooser.defaults, config);

        var $input = $('<input>', { type: 'file', accept: config.format })
            .change(function() { callback(config.multiple ? this.files : this.files[0]) });

        if (config.multiple)
            $input.attr('multiple', '');

        $button = $('<button>').click(function() { $input.click() });
    }

    FileChooser.prototype.open = function() {
        if ($button != null)
            $button.click();
    };

    return FileChooser;
})();

// https://tc39.github.io/ecma262/#sec-array.prototype.fill
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function(value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

File.prototype.load = function(callback, type) {
    if (!FileReader)
        return;

    type = (type == null || type == 'url') ? 'readAsDataURL' :
           (type == 'text') ? 'readAsText' :
           (type == 'array') ? 'readAsArrayBuffer' : 'abort';

    var fr = new FileReader();
    fr.addEventListener('loadend', callback);
    fr[type](this);
};

File.prototype.toJSON = function() {
    return {
        lastModified: this.lastModified,
        name: this.name,
        size: this.size,
        type: this.type
    };
};

Image.prototype.loaded = false;

Image.prototype.load = function(fx) {
    var onload = function() {
        this.loaded = true;
        if (fx != null)
            fx(this);
    };

    if (this.src == '' || this.src.indexOf(document.URL) >= 0) {
        $(this).attr('src', null);
        onload.call(this);
    } else {
        this.src = this.src;
        if (!$(this).data('listening'))
            $(this).data('listening', true).on('load', onload);
    }
};

Image.prototype.toJSON = function() {
    return this.src == '' ? { } : { src: this.src };
};

function measureText(text, fontFamily, fontSize, fontUnit) {
    if (text == null || text == '' || fontFamily == null || fontSize == null)
        return { width: 0, height: 0, margin: { x: 0, y: 0 } };

    fontUnit = fontUnit || 'px';
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = fontSize * text.length;
    canvas.height = 2 * fontSize;

    ctx.font = fontSize + fontUnit + ' "' + fontFamily + '"';
    ctx.fillStyle = 'White';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'Black';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 0, 0);

    var min = { x: canvas.width, y: canvas.height }, max = { x: 0, y: 0 };
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            if (imgData.data[4 * (y * canvas.width + x)] != 255) {
                if (min.x > x) min.x = x;
                if (min.y > y) min.y = y;
                if (max.x < x) max.x = x;
                if (max.y < y) max.y = y;
            }
        }
    }

    return {
        width: max.x - min.x + 1,
        height: max.y - min.y + 1,
        margin: {
            x: min.x,
            y: min.y
        }
    };
}

/** https://stackoverflow.com/a/5717133 **/
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
    return pattern.test(str);
}
