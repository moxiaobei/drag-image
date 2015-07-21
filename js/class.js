define(function() {

    var OperateClass = {
        addClass: function (element, name) {
            name = name.trim();
            if(element.className == "") {
                element.className = name;
            } else {
                element.className = element.className + " " + name;
            }
        },

        removeClass: function(element, name) {
            var classes = element.className.split(" ");
            var first = true;
            var newClasses = "";
            for(var i = 0; i < classes.length; i++) {
                if(classes[i] != name) {
                    if(first == true) {
                        newClasses = classes[i];
                        first = false;
                    } else {
                        newClasses = newClasses + " " + classes[i];
                    }
                }
            }
            element.className = newClasses;
        }
    };

    return {
        OperateClass: OperateClass
    };
});

