(function() {
    scrollBox = function(obj) {
        this.container = obj.target;
        this.elements = this.container.children();
        this.showNum = obj.showNum;
        // this.stepBefore = obj.stepBefore;
        // this.stepAfter = obj.stepAfter;
        this.doneFn = obj.done;
        this.startFn = obj.start;
        this.beforeClickFn = obj.beforeClick;
    };

    var _startIndex = function(showNum) {
        return Math.floor(showNum / 2);
    };
    var _removeNoUse = function(noUse) {
        noUse.each(function() {
            $(this).remove();
        });
    };

    scrollBox.prototype.initDom = function() {
        this.elements = this.container.children();
        return this;
    }
    scrollBox.prototype.oneMove = function() {
        this.initDom();
        var one = this.elements.first();
        var height = parseInt(one.css("height")),
            marginBottom = parseInt(one.css("marginBottom"));
        return height + marginBottom;
    };

    scrollBox.prototype.ready = function() {
        this.initDom();
        var that = this,
            startIndex = _startIndex(this.showNum);
        this.elements.each(function(index) {
            $(this).attr("data-index", startIndex--).css("top", index * that.oneMove() + "px");
        });

        return this;
    };

    scrollBox.prototype.moveDownInit = function(index) {
        this.initDom();
        var last = this.elements.last(),
            oneMove = this.oneMove(),
            clone = "",
            flag = false,
            i = 1;
        index = Math.abs(index);
        while (index) {
            if (flag) {
                last = last.prev();
            }
            flag = true;
            clone = last.clone(true);
            clone.css("top", oneMove * i * (-1));
            this.container.prepend(clone);
            last.addClass("boxRemove");
            index--;
            i++;
        }
        this.initDom();
    };
    scrollBox.prototype.moveUpInit = function(index) { //debugger;
        this.initDom();
        var first = this.elements.first(),
            oneMove = this.oneMove(),
            clone = "",
            flag = false,
            i = 0,
            len = this.elements.length;

        index = Math.abs(index);
        while (index) {
            if (flag) {
                first = first.next();
            }
            flag = true;
            clone = first.clone(true);
            clone.css("top", oneMove * (len + i)); //debugger
            this.container.append(clone);
            first.addClass("boxRemove");
            index--;
            i++;
        }
        this.initDom();
    };

    scrollBox.prototype.move = function(index, target) {
        var that = this;
        var direction = index > 0; //true:down;false:up
        var distance = index * this.oneMove(); //婊氬姩鐨勮窛绂�
        var animateStartBug = true;
        var animateAfterBug = true;

        if (direction) {
            this.moveDownInit(index);
        } else {
            this.moveUpInit(index);
        }

        this.elements.animate({
            top: "+=" + distance
        }, {
            duration: 380,
            queue: true,
            easing: "easeOutCubic",
            start: function() {
                if(animateStartBug){
                    animateStartBug = false;
                    that.start(target);
                    that.container.unbind("click");
                    that.elements.css("cursor", "auto");
                }
            },
            done: function() {
                if(animateAfterBug){
                    animateAfterBug = false;
                    that.elements.css("cursor", "pointer");
                    _removeNoUse(that.container.find(".boxRemove")); //鍘绘帀澶氫綑鑺傜偣
                    that.done(target);
                    that.ready().buildBind();
                }
            }
        });
    };

    scrollBox.prototype.buildBind = function() {
        var that = this;
        this.container
            .unbind("click")
            .on("click", function(event) {
                var target = $(event.target),
                    index = target.attr("data-index");
                if (index == 0) {
                    return;
                }
                that.start().move(index, target);
            });
        return this;
    };
    scrollBox.prototype.start = function(target){
        this.initDom().startFn.call(this, target, this.elements);
        return this;
    };

    scrollBox.prototype.done = function(target){
        this.initDom().doneFn.call(this, target, this.elements);
        return this;
    };

    scrollBox.prototype.beforeClick = function(){
        this.initDom().beforeClickFn.call(this, this.elements);
        return this;
    };

    scrollBox.prototype.run = function() {
        this.ready().beforeClick().buildBind();
        return this;
    };
})();