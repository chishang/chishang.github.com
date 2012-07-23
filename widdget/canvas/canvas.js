/**
 * @author dongzhu
 */
KISSY.add("canvas", function (S) {
	var E=S.Event;
    /**
	 * html5 Canvas ��ͼ
	 * @class S.Canvas
	 * @param cfg
	 */
    function Canvas() {
        this._init.apply(this, arguments);
    }
    S.augment(Canvas, S.EventTarget, {
        _init: function (cfg) {
            var self = this,
            config = {
                id: "J_Canvas",
                color: "#df4b26",
                lineWidth: 15,
                lineJoin: "round",
                width: 600,
                height: 600
            }; 
            S.mix(config, cfg, true);
            self.config=config;
            this.clickX = [];
            this.clickY = [];
            this.clickDrag = [];
            this.paint = false;
            this.point = {};
            this.point.notFirst = false;
            this._createCanvas(config.id);
            this.width(config.width);
            this.height(config.height);
            this.strokeStyle(config.color);
            this.lineJoin(config.lineJoin);
            self.lineWidth(config.lineWidth);
            self._bind();
        },
        /**
		 * ��������
		 * @name S.Canvas#_createCanvas
		 * @param id,
		 * @param width
		 * @param height
		 */
        _createCanvas: function (id) {
            var self = this;
            var canvasDiv = document.getElementById(id),
            canvas = document.createElement('canvas');
            canvas.setAttribute('id', id + 'canvas');
            canvasDiv.appendChild(canvas);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var context = canvas.getContext("2d"),
            nCanvas=S.one(canvas);
            self.canvas = canvas;
            self.nCanvas=nCanvas;
            self.context = context;
        },
        /**
		 * �¼���
		 */
        _bind: function () {
            var self = this, 
            nCanvas=self.nCanvas;
            //��갴��
            nCanvas.on("mousedown", function(e) {
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                self.paint = true;
                self._addClick(mouseX, mouseY,false);
                self.fire("mousedown",{
                	mouseX:mouseX,
                	mouseY:mouseY
                });
                self.redraw();
                
            });
            //����ƶ�
            nCanvas.on("mousemove", function (e) {
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                if (self.paint) {
                    self._addClick(mouseX, mouseY, true);
                    self.redraw();
                }
            });
            //����ɿ�
            nCanvas.on("mouseup", function (e) {
                self.paint = false;
            });
            //����뿪
            nCanvas.on("mouseleave", function (e) {
                self.paint = false;
            });

        },        
        /**
		 * �������·��
		 */
        _addClick: function (x, y, dragging) {
            var self = this;
            self.clickX.push(x);
            self.clickY.push(y);
            self.clickDrag.push(dragging);
        },
        /**
         * ���洢·��·��
         */
        redraw: function () {
            var self = this;
            while (self.clickX.length > 0) {
                self.point.bx = self.point.x;
                self.point.by = self.point.y;
                self.point.x = self.clickX.pop();
                self.point.y = self.clickY.pop();
                self.point.drag = self.clickDrag.pop();
                self.context.beginPath();
                if (self.point.drag && self.point.notFirst) {
                    self.context.moveTo(self.point.bx, self.point.by);
                } else {
                    self.point.notFirst = true;
                    self.context.moveTo(self.point.x+1, self.point.y);
                }
                self.context.lineTo(self.point.x, self.point.y);
                self.context.closePath();
                self.context.stroke();
            }
        },
        /**
	     * ���ƾ���
	     * @name S.Canvas#rawRect
		 * @param x ��ʼx����
		 * @param y ��ʼy����
		 * @param width ���
		 * @param height �߶�
	     */
        drawRect: function (x,y,width,height) {
            var self = this,
            context = self.context;
            self._addClick(x, y, true);
            self._addClick(x+width, y, true);
            self._addClick(x+width, y+height, true);
            self._addClick(x, y+height, true);
            self._addClick(x, y, false);
        },
        /**
		 * ���û������
		 * @name S.Canvas#width
		 */
        width: function (width) {
            var self = this,
            canvas = self.canvas;
            if (width) {
                canvas.setAttribute("width", width);
                return this;
            } else {
                return canvas.width;
            }
        },
        /**
		 * ���û����߶�
		 * @name S.Canvas#height
		 */
        height: function (height) {
            var self = this,
            canvas = self.canvas;
            if (height) {
                canvas.setAttribute("height", height);
                return this;
            } else {
                return canvas.height;
            }
        },

        /**
		 * ����/��ȡ�����ɫ
		 * @name S.Canvas#fillStyle
		 * @param color
		 */
        fillStyle: function (color) {
            var self = this,
            context = self.context;
            if (color) {
                context.fillStyle = color;
                return this;
            } else {
                return context.fillStyle;
            }

        },
        /**
		 * ����/��ȡ�߿���ɫ
		 * @name S.Canvas#strokeStyle
		 * @param color
		 */
        strokeStyle: function (color) {
            var self = this,
            context = self.context;
            if (color) {
                context.strokeStyle = color;
                return this;
            } else {
                return context.strokeStyle;
            }

        },
        /**
		 * ����/��ȡ���ʴ�С
		 * @name S.Canvas#lineWidth
		 * @param width
		 */
        lineWidth: function (width) {
            var self = this,
            context = self.context;
            if (width) {
                context.lineWidth = width;
                return this;
            } else {
                return context.lineWidth;
            }
        },
        /**
		 * ����/��ȡ������״
		 * @name S.Canvas#lineJoin
		 * @param width
		 */
        lineJoin: function (lineJoin) {
            var self = this,
            context = self.context;
            if (lineJoin) {
                context.lineJoin = lineJoin;
                return this;
            } else {
                return context.lineJoin;
            }
        },
        /**
		 * ��ȡ/����  ���/�߿�
		 * @name S.Canvas#type
		 * @param type
		 */
        type: function (type) {
            var self = this,
            context = self.context;
            if (type) {
                context.type = type;
                return this;
            } else {
                return context.type;
            }
        },

        /**
		 * ����
		 * @name S.Canvas#save
		 */
        save: function () {
            var self = this,
            canvas = self.canvas;
            window.open(canvas.toDataURL("image/jpeg"));
        },
        /**
		 * ����
		 * @name S.Canvas#save
		 * @param x ��ʼx����
		 * @param y ��ʼy����
		 * @param width ���
		 * @param height �߶�
		 */
        clear: function (x, y, width, height) {
            var self = this,
            context = self.context;
            context.clearRect(x, y, width, height);

        }

    });
    S.Canvas = Canvas;
    return Canvas;
});