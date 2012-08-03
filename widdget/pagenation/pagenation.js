/**
 * 分页组件
 */
KISSY.add("pagenation",function(S){
	
	function PageNation(){
	    	this._init.apply(this,arguments);
	};	
	S.augment(PageNation,S.EventTarget, {
	    _init: function (config) {
	    	var self=this,
	    	cfg={
	          	step:7,
	          	index:1,
	          	max:7,
	          	jump:false
	          };
	          S.mix(cfg,config);
	          if(cfg.max<cfg.index){
	        	cfg.index=cfg.max;
	        }
	          S.mix(self,cfg);
	          self._eventHandles = {
	                delegate: null
	            };
	          self.renderUI();
	          self.bindUI();
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
			this.max=max;
			this.renderUI();
		},
		setStep: function(step){
			this.step=step;	
			this.renderUI();
		},
		setIndex: function(index){
			this.index=index;		  
			this.renderUI();
		},
	    _renderMarkup: function () {
	    	var self=this,
	    	contentBox=self.contentBox,
	    	jump=self.jump;
	        contentBox.append('<span></span>');
	        if (jump) {
	            contentBox.append('<ins>到第<input type="text" />页<button class="jump">跳转</button></ins>');
	        }
	    },
	    _renderPage: function () {
	        var step = parseInt(this.step),
	            index = parseInt(this.index),
	            max = parseInt(this.max),
	            contentBox = this.contentBox;
	        var pageMain = [];
	        
	        //render Left;
	        if (index === 1) {
	            pageMain.push('<a href="#" title="上一页" class="page-prev-disabled">上一页</a>');
	        } else {
	            pageMain.push('<a href="#" title="上一页" class="page-prev">上一页</a>');
	        }
	        pageMain.push('<span class="page-main">');
	        //render Middle
	        if (step >= max) {
	            for (var i = 1; i <= max; i++) {
	                pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current num"' : ' class="num"') + ' title="第' + i + '页">' + i + '</a>');
	            }
	        } else {
	            if (index < step) {
	                for (var i = 1; i <= step; i++) {
	                    pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current num"' : ' class="num"') + ' title="第' + i + '页">' + i + '</a>');
	                }
	                pageMain.push('<em>...</em>');
	                pageMain.push('<a href="#page-' + max + '" class="num" title="第' + max + '页">' + max + '</a>');
	            } else if (index > max - step) {
	                pageMain.push('<a href="#page-1"  class="num" title="第1页">1</a>');
	                pageMain.push('<em>...</em>');
	                for (var i = max - step; i <= max; i++) {
	                    pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current num"' : ' class="num"') + ' title="第' + i + '页">' + i + '</a>');
	                }
	            } else {
	                pageMain.push('<a href="#page-1"  class="num" title="第1页">1</a>');
	                pageMain.push('<em>...</em>');
	                for (var i = index - Math.floor(step / 2); i <= index + Math.floor(step / 2) - (step % 2 ? 0 : 1); i++) {
	                    pageMain.push('<a href="#page-' + i + '"' + (index === i ? ' class="current num"' : ' class="num"') + ' title="第' + i + '页">' + i + '</a>');
	                }
	                pageMain.push('<em>...</em>');
	                pageMain.push('<a href="#page-' + max + '"  class="num" title="第' + max + '页">' + max + '</a>');
	            }
	        }
	        pageMain.push('</span>');
	        //render Right
	        if (index ==max) {
	            pageMain.push('<a href="#" title="下一页" class="page-next-disabled">下一页</a>');
	        } else {
	            pageMain.push('<a href="#" title="下一页" class="page-next">下一页</a>');
	        }
	        contentBox.one('span').html(pageMain.join(''));
	    },
	    _bindDelegate: function () {
	    	var self=this;
	        var eventHandles =self._eventHandles,
	        contentBox=self.contentBox,
	        jump=self.jump;
	        if (eventHandles.delegate) {
	            eventHandles.delegate.detach();
	            eventHandles.delegate = null;
	        }
	        eventHandles.delegate =contentBox.on("click",function(e){
	        	self._onDelegateClick(e);
	        })
	        
	        if (this.jump) {
	            this._bindJump();
	        }
	    },
	    _bindJump: function () {
	        var s = this;
	        var contentBox = this.contentBox,
	            jumpbtn = contentBox.one('button'),
	            jumpinput = contentBox.one('input');
	        if (S.UA.ie === 6) {
	            jumpbtn.on('mouseenter', function (e) {
	                this.addClass('jumpbtn-hover');
	            });
				jumpbtn.on('mouseleave', function (e) {
	                this.removeClass('jumpbtn-hover');
	            });
	        }
	        jumpinput.on('focusin', function (e) {
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
	    	var self=this;
	        e.halt();
	        var target =S.one(e.target);
	        if (target.hasClass('page-prev')) {
	            self._goPrevPage();
	        } else if (target.hasClass('page-next')) {
	            self._goNextPage();
	        } else if (target.hasClass('num')&&!target.hasClass('current')) {
	           self._goToPage(parseInt(target.html()));
	        }
	        if (self.jump && target.hasClass("jump")) {
	            self._jumpPage();
	        }
	    },
	    _goPrevPage: function () {
	    	var self=this;
	        var page =self.index - 1;
	          self._goToPage(page);
	    },
	    _goNextPage: function () {
	    	var self=this;
	        var page =parseInt(self.index)  + 1;
	        self._goToPage(page);
	    },
	    _goToPage: function (page) {
	    	var self=this;
	        self.index=page;
	        self._renderPage();
	        self.fire('trigger', {
	            'page': page,
				'max': self.max
	        });
	    },
	    _jumpPage: function () {
	    	var self=this,
	    	contentBox=self.contentBox;
	        var jumpinputVal = parseInt(contentBox.one('input').val());
	        if (this._validatePage(jumpinputVal)) {
	            this._goToPage(jumpinputVal);
	        }
	    },
	    _validatePage: function (val) {
	        var max = this.max;
	        return (S.isNumber(val) && val >= 1 && val <= max);
	    }
	});
	S.PageNation=PageNation;
	return PageNation;
},{
	attach:"false",
	requires:['sizzle','pagenation.css']
});
