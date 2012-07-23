/**
 *Cubee��ҳ�ؼ�
 *kongyan@taobao.com
 */
YUI.namespace('Y.Pagenation');
YUI.add('pagenation', function (Y) {
    var Lang = Y.Lang,
        Widget = Y.Widget,
        Node = Y.Node;
    function Pagenation(config) {
        Pagenation.superclass.constructor.apply(this, arguments);
    }
    Pagenation.NAME = 'pagenation';
    Pagenation.ATTRS = {
        step: {
            value: 7
        },
        index: {
            value: 1
        },
        max: {
            value: 7
        },
        jump: {
            value: false
        }
    };
    Y.extend(Pagenation, Widget, {
        initializer: function () {
            this.publish('trigger');
            this._eventHandles = {
                delegate: null
            };
            this.render();
        },
        destructor: function () {

        },
        renderUI: function () {
            this._renderMarkup();
            this._renderPage();
        },
        bindUI: function () {
            this._bindDelegate();
        },
        syncUI: function () {
            //this._updatePage();
        },
		setMax: function(max){
			this.set('max', max);
			this.renderUI();
		},
		setStep: function(step){
			this.set('step', step);	
			this.renderUI();
		},
		setIndex: function(index){
			this.set('index', index);		  
			this.renderUI();
		},
        _renderMarkup: function () {
            this.get('contentBox').append('<span></span>');
            if (this.get('jump')) {
                this.get('contentBox').append('<ins>����<input type="text" />ҳ<button>��ת</button></ins>');
            }
        },
        _renderPage: function () {
            var step = this.get('step'),
                index = this.get('index'),
                max = this.get('max'),
                contentBox = this.get('contentBox');
            var pageMain = [];
            //render Left;
            if (index === 1) {
                pageMain.push('<a href="#" title="��һҳ" class="page-prev-disabled">��һҳ</a>');
            } else {
                pageMain.push('<a href="#" title="��һҳ" class="page-prev">��һҳ</a>');
            }
            pageMain.push('<span class="page-main">');
            //render Middle
            if (step >= max) {
                for (var i = 1; i <= max; i++) {
                    pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current"' : '') + ' title="��' + i + 'ҳ">' + i + '</a>');
                }
            } else {
                if (index < step) {
                    for (var i = 1; i <= step; i++) {
                        pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current"' : '') + ' title="��' + i + 'ҳ">' + i + '</a>');
                    }
                    pageMain.push('<em>...</em>');
                    pageMain.push('<a href="#page-' + max + '" title="��' + max + 'ҳ">' + max + '</a>');
                } else if (index > max - step) {
                    pageMain.push('<a href="#page-1" title="��1ҳ">1</a>');
                    pageMain.push('<em>...</em>');
                    for (var i = max - step; i <= max; i++) {
                        pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current"' : '') + ' title="��' + i + 'ҳ">' + i + '</a>');
                    }
                } else {
                    pageMain.push('<a href="#page-1" title="��1ҳ">1</a>');
                    pageMain.push('<em>...</em>');
                    for (var i = index - Math.floor(step / 2); i <= index + Math.floor(step / 2) - (step % 2 ? 0 : 1); i++) {
                        pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current"' : '') + ' title="��' + i + 'ҳ">' + i + '</a>');
                    }
                    pageMain.push('<em>...</em>');
                    pageMain.push('<a href="#page-' + max + '" title="��' + max + 'ҳ">' + max + '</a>');
                }
            }
            pageMain.push('</span>');
            //render Right
            if (index === max) {
                pageMain.push('<a href="#" title="��һҳ" class="page-next-disabled">��һҳ</a>');
            } else {
                pageMain.push('<a href="#" title="��һҳ" class="page-next">��һҳ</a>');
            }
            contentBox.one('span').setContent(pageMain.join(''));
        },
        _bindDelegate: function () {
            var eventHandles = this._eventHandles;
            if (eventHandles.delegate) {
                eventHandles.delegate.detach();
                eventHandles.delegate = null;
            }
            eventHandles.delegate = Y.on('click', Y.bind(this._onDelegateClick, this), this.get('contentBox'));
            if (this.get('jump')) {
                this._bindJump();
            }
        },
        _bindJump: function () {
            var s = this;
            var contentBox = this.get('contentBox'),
                jumpbtn = contentBox.one('button'),
                jumpinput = contentBox.one('input');
            if (Y.UA.ie === 6) {
                jumpbtn.on('mouseover', function (e) {
                    this.addClass('jumpbtn-hover');
                });
				jumpbtn.on('mouseout', function (e) {
                    this.removeClass('jumpbtn-hover');
                });
            }
            jumpinput.on('focus', function (e) {
                this.select();
            });
            jumpinput.on('keydown', function (e) {
                if (e.keyCode === 13) {
                    s._jumpPage();
                    this.select();
                }
            });
        },
        _onDelegateClick: function (e) {
            e.halt();
            var target = e.target;
            if (target.hasClass('page-prev')) {
                this._goPrevPage();
            } else if (target.hasClass('page-next')) {
                this._goNextPage();
            } else if (target.get('tagName') === 'A' && target.get('parentNode').get('className') === 'page-main') {
                this._goToPage(parseInt(target.get('innerHTML')));
            }
            if (this.get('jump') && target.get('tagName') === 'BUTTON') {
                this._jumpPage();
            }
        },
        _goPrevPage: function () {
            var page = this.get('index') - 1;
            this.set('index', page);
            this._renderPage();
            this.fire('trigger', {
                'page': page,
				'max': this.get('max')
            });
        },
        _goNextPage: function () {
            var page = this.get('index') + 1;
            this.set('index', page);
            this._renderPage();
            this.fire('trigger', {
                'page': page,
				'max': this.get('max')
            });
        },
        _goToPage: function (page) {
            this.set('index', page);
            this._renderPage();
            this.fire('trigger', {
                'page': page,
				'max': this.get('max')
            });
        },
        _jumpPage: function () {
            var jumpinputVal = parseInt(this.get('contentBox').one('input').get('value'));
            if (this._validatePage(jumpinputVal)) {
                this._goToPage(jumpinputVal);
            }
        },
        _validatePage: function (val) {
            var max = this.get('max');
            return (Lang.isNumber(val) && val >= 1 && val <= max);
        }
    });
	Y.Pagenation = Pagenation;
}, '3.4.1', {requires: ['widget', 'pagenation-skin']});
