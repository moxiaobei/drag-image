var EventUtil = {
    //给元素绑定相应的事件，以及设置回调函数
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            //false为冒泡
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent("on"+type. handler);
        } else {
            element["on" + type] = handler;
        }
    },

    //给元素解除事件绑定
    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent) {
            element.detachEvent("on"+type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    //获取事件
    getEvent: function(event) {
        return event ? event : window.event;
    },

    //获取目标元素
    getTarget: function(event) {
        return event.target || event.srcElement;
    },

    //阻止默认事件
    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    //阻止冒泡
    stopPropogation: function(event) {
        if(event.stopPropogation) {
            event.stopPropogation();
        } else {
            event.cancleBubble = true;
        }
    }

};
