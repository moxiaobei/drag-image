/**
*@author donghualei
*@file drag-image
*@date 2015-07-13
**/


define(function() {

    function start(){

        var dragImage = new DragImage();
        dragImage.init({
            id : "drag-move"
        });


    };


    function DragImage() {

        this.obj = null;

        this.oUl = null;

        this.oLis = null;

        this.EventUtil = require("event").EventUtil;

        this.OperateClass = require("class").OperateClass;

        //记录上一个有红色边框的节点
        this.beforeActiveNode = null;

        this.beforeBg = -1;

        this.oPositions = new Array();

    }

    DragImage.prototype.init = function(opt) {

        //获取可以排列图标的区域的节点
        this.obj = document.getElementById(opt.id);

        //在div下面获取ul节点
        this.oUl = this.obj.getElementsByTagName("ul")[0];

        //获取ul节点下面的所有li节点
        this.oLis = this.oUl.getElementsByTagName("li");

        //自动获取div区域的宽度和高度，获取高度和宽度以后设置div的宽度和高度
        this.obj.style.width = this.obj.offsetWidth + "px";

        //获取每个节点的位置信息，保存在oPositions中，并给每个li节点添加index
        for(var i = 0; i < this.oLis.length; i++) {

            this.oPositions[i] = {

                left: this.oLis[i].offsetLeft,

                top: this.oLis[i].offsetTop
            };

            this.oLis[i].index = i;
        }

        this.fnDown();
    };

    DragImage.prototype.fnDown = function() {

        var _this = this;

        //遍历每个节点，并给节点添加拖拽事件
        for(var i = 0; i < this.oLis.length; i++) {

            //给li节点添加鼠标按下事件
            this.EventUtil.addHandler(this.oLis[i], "mousedown", function(ev) {

                var thisLi = this;

                var event = _this.EventUtil.getEvent(ev);
                var data = {

                    obj: thisLi,

                    //用以标记该元素是否进行了移动，flag = false表示节点没有移动， flag = true 表示节点进行了移动
                    flag: false,

                    //获取被鼠标按下的节点的相对位置
                    left: thisLi.offsetLeft,

                    top: thisLi.offsetTop,

                    //获取鼠标被按下时鼠标相对于被按下的元素左边的位置
                    disX: event.clientX - thisLi.offsetLeft,

                    disY: event.clientY - thisLi.offsetTop,

                    //记录与被移动的节点的最近的节点的距离以及index
                    minDis: {

                        flag: -1,

                        dis: Number.MAX_VALUE
                    }
                };
                //记录上一个有背景的节点的index
                _this.beforeBg = -1;

                /*
                EventUtil.addHandler(document, "mousemove", _this.m);

                EventUtil.addHandler(document, "mouseup", _this.u);


                _this.m = function(ev) {

                    _this.move(ev, data);

                };

                _this.u = function(ev) {

                    _this.up(ev, data);
                }

                */
                //鼠标被按下时，给document添加鼠标移动事件
                document.onmousemove = function(ev) {

                    _this.move(ev, data);

                }

                //鼠标松开时，给document添加鼠标抬起事件
                document.onmouseup = function(ev) {

                    _this.up(ev, data);
                }
            });
        }
    };

    DragImage.prototype.move = function(ev, data) {

        var event = this.EventUtil.getEvent(ev);

        //如果鼠标是被按下后第一次移动
        if(data.flag == false) {

            //修改被移动的元素的位置，以及改为绝对定位
            data.obj.style.position = "absolute";

            data.obj.style.left = data.left - 5 + "px";

            data.obj.style.top = data.top - 5 + "px";

            //修改层级比其他层级高，这样可以让其在其他的元素上面移动；
            data.obj.style.zIndex = 1;

            //同时修改flag = true，表示已经不是第一次移动
            data.flag = true;

            //其他的元素位置已经改变，重新获取一次元素的位置
            for(var j = 0; j < this.oLis.length; j++) {

                this.oPositions[j] = {

                    left: this.oLis[j].offsetLeft,

                    top: this.oLis[j].offsetTop
                };
            }
        }

        //移动过程中改变位置
        data.obj.style.left = event.clientX - data.disX + "px";

        data.obj.style.top = event.clientY - data.disY + "px";

        data.minDis.dis = Number.MAX_VALUE;

        //找到距离最近的元素节点
        for(var j = 0; j < this.oLis.length; j++) {

            //如果不是当前元素，计算当前元素与每个元素的距离，找到距离最近的元素
            if(this.oLis[j] != data.obj) {

                //当前移动的节点与其他节点的距离
                var tempDis = (this.oPositions[j].left - data.obj.offsetLeft) * (this.oPositions[j].left - data.obj.offsetLeft)
                + (this.oPositions[j].top - data.obj.offsetTop) * (this.oPositions[j].top - data.obj.offsetTop);

                //如果当前距离比最小距离还小，则更新最小距离
                if(tempDis < data.minDis.dis) {

                    data.minDis.dis = tempDis;

                    data.minDis.flag = j;
                }

            }
        }

        //找到距离最近的元素节点，则修改该节点的背景
        //如果距离最近的节点与前一个距离最近的不是一个节点
        if(data.minDis.flag != this.beforeBg) {

            if(this.beforeBg == -1) {

                //修改距离被移动的元素最近的节点的背景
                this.OperateClass.addClass(this.oLis[data.minDis.flag].getElementsByTagName("div")[0], "bg");

                this.beforeBg = data.minDis.flag;

            } else {

                this.OperateClass.addClass(this.oLis[data.minDis.flag].getElementsByTagName("div")[0], "bg");

                //移除上一个距离最近的节点的背景
                this.OperateClass.removeClass(this.oLis[this.beforeBg].getElementsByTagName("div")[0], "bg");

                this.beforeBg = data.minDis.flag;
            }
        }

        this.EventUtil.stopPropogation(event);

        //阻止默认事件
        this.EventUtil.preventDefault(event);
    };

    //鼠标抬起执行up函数
    DragImage.prototype.up = function(ev, data) {

        //如果鼠标按下后进行了拖动, else 是鼠标按下后没有进行拖动
        if(data.flag == true) {

            //鼠标抬起时，将该节点移除，同时插入到要添加的节点前
            var bN = this.oLis[data.minDis.flag];

            var node = this.oUl.removeChild(data.obj);

            var newNode = this.oUl.insertBefore(node, bN);

            //修改被移动的节点的定位方式
            newNode.style.position = "relative";

            newNode.style.left = "";

            newNode.style.top = "";

            newNode.style.zIndex = 0;

            //同时移除节点的背景
            this.OperateClass.removeClass(bN.getElementsByTagName("div")[0], "bg");
        } else {

            //如果第一次点击的话，直接添加class，如果不是第一次则添加class，同时移除上一个边框的class
            if(this.beforeActiveNode == null) {

                this.OperateClass.addClass(data.obj, "active");

                this.beforeActiveNode = data.obj;

            } else if(this.beforeActiveNode != data.obj) {

                this.OperateClass.addClass(data.obj, "active");

                this.OperateClass.removeClass(this.beforeActiveNode, "active");

                this.beforeActiveNode = data.obj;
            }
        }

        //移除鼠标移动事件
        document.onmousemove = null;
        //移除鼠标抬起事件
        document.onmouseup = null;
       // alert(this.m);
       // EventUtil.removeHandler(document, "mousemove", this.m);

     //   EventUtil.removeHandler(document, "mouseup", this.u);
    };

    return {
        start: start
    };
});


