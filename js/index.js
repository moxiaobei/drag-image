window.onload = function() {
    //获取可以排列图标的区域的节点
    var oDragMove = document.getElementById("drag-move");
    //在div下面获取ul节点
    var oUl = oDragMove.getElementsByTagName("ul")[0];
    //获取ul节点下面的所有li节点
    var oLis = oUl.getElementsByTagName("li");
    //用来存放每个图片的位置，方便计算移动的节点跟每个节点的位置
    var oPositions = new Array();

    //自动获取div区域的宽度和高度，获取高度和宽度以后设置div的宽度和高度
    oDragMove.style.width = oDragMove.offsetWidth + "px";
    oDragMove.style.height = oDragMove.offsetHeight + "px";

    //获取每个节点的位置信息，保存在oPositions中，并给每个li节点添加index
    for(var i = 0; i < oLis.length; i++) {
        oPositions[i] = {left: oLis[i].offsetLeft, top: oLis[i].offsetTop};
        oLis[i].index = i;
    }

    //记录上一个有背景的节点的index
    var beforeBg = -1;
    //记录上一个有红色边框的节点
    var beforeActiveNode = null;
    //遍历每个节点，并给节点添加拖拽事件
    for(var i = 0; i < oLis.length; i++) {

        //给li节点添加鼠标按下事件
        EventUtil.addHandler(oLis[i], "mousedown", function(ev) {
            var event = EventUtil.getEvent(ev);
            //用以标记该元素是否进行了移动，flag = false表示节点没有移动， flag = true 表示节点进行了移动
            var flag = false;
            //获取被鼠标按下的节点的相对位置
            var left = this.offsetLeft;
            var top = this.offsetTop;
            //获取鼠标被按下时鼠标相对于被按下的元素左边的位置
            var disX = event.clientX - this.offsetLeft;
            var disY = event.clientY - this.offsetTop;
            //保存this值
            var _this = this;
            //记录与被移动的节点的最近的节点的距离以及index
            var minDis = {flag: -1, dis: Number.MAX_VALUE};

            //鼠标被按下时，给document添加鼠标移动事件
            EventUtil.addHandler(document, "mousemove", move);

            //鼠标松开时，给document添加鼠标抬起事件
            EventUtil.addHandler(document, "mouseup", up);
            

            //移动时执行的函数
            function move(ev) {
                var event = EventUtil.getEvent(ev);
                //如果鼠标是被按下后第一次移动
                if(flag == false) {
                    //修改被移动的元素的位置，以及改为绝对定位
                    _this.style.position = "absolute";
                    _this.style.left = left - 5 + "px";
                    _this.style.top = top - 5+ "px";
                    //修改层级比其他层级高，这样可以让其在其他的元素上面移动；
                    _this.style.zIndex = 1;
                    //同时修改flag = true，表示已经不是第一次移动
                    flag = true;
                    //其他的元素位置已经改变，重新获取一次元素的位置
                    for(var j = 0; j < oLis.length; j++) {
                        oPositions[j] = {left: oLis[j].offsetLeft, top: oLis[j].offsetTop};
                        oLis[j].index = j;
                    }
                }
                //移动过程中改变位置
                _this.style.left = event.clientX - disX + "px";
                _this.style.top = event.clientY - disY + "px";
                minDis.dis = Number.MAX_VALUE;
                //找到距离最近的元素节点
                for(var j = 0; j < oLis.length; j++) {
                    //如果不是当前元素，计算当前元素与每个元素的距离，找到距离最近的元素
                    if(oLis[j] != _this) {
                        //this表示document，而_this表示被移动的元素
                        //当前移动的节点与其他节点的距离
                        var tempDis = (oPositions[j].left - _this.offsetLeft)*(oPositions[j].left - _this.offsetLeft) 
                                        + (oPositions[j].top - _this.offsetTop)*(oPositions[j].top - _this.offsetTop);
                        //如果当前距离比最小距离还小，则更新最小距离
                        if(tempDis < minDis.dis) {
                            minDis.dis = tempDis;
                            minDis.flag = j;
                        }
                    }
                }
                //找到距离最近的元素节点，则修改该节点的背景
                //如果距离最近的节点与前一个距离最近的不是一个节点
                if(minDis.flag != beforeBg) {
                    if(beforeBg == -1) {
                        //修改距离被移动的元素最近的节点的背景
                        addClass(oLis[minDis.flag].getElementsByTagName("div")[0], "bg");
                        beforeBg = minDis.flag;
                    } else {
                        addClass(oLis[minDis.flag].getElementsByTagName("div")[0], "bg");
                        //移除上一个距离最近的节点的背景
                        removeClass(oLis[beforeBg].getElementsByTagName("div")[0], "bg");
                        beforeBg = minDis.flag;
                    }
                }
                EventUtil.stopPropogation(event);
                //阻止默认事件
                EventUtil.preventDefault(event);
            }

            //鼠标抬起执行up函数
            function up(ev) {
                //如果鼠标按下后进行了拖动, else 是鼠标按下后没有进行拖动
                if(flag == true) {
                    //鼠标抬起时，将该节点移除，同时插入到要添加的节点前
                    var bN = oLis[minDis.flag];
                    var node = oUl.removeChild(_this);
                    var newNode = oUl.insertBefore(node, bN);
                    //修改被移动的节点的定位方式
                    newNode.style.position = "relative";
                    newNode.style.left = "";
                    newNode.style.top = "";
                    newNode.style.zIndex = 0;
                    //同时移除节点的背景
                    removeClass(bN.getElementsByTagName("div")[0], "bg");
                } else {
                    //如果第一次点击的话，直接添加class，如果不是第一次则添加class，同时移除上一个边框的class
                    if(beforeActiveNode == null) {
                        addClass(_this, "active");
                        beforeActiveNode = _this;
                    } else if(beforeActiveNode != _this) {
                        addClass(_this, "active");
                        removeClass(beforeActiveNode, "active");
                        beforeActiveNode = _this;
                    }
                }
                //移除鼠标移动事件
                EventUtil.removeHandler(document, "mousemove", move);
                //移除鼠标抬起事件
                EventUtil.removeHandler(document, "mouseup", up);
            }
        });
    }
}