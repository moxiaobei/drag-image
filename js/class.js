function addClass(element, name) {
    name = name.trim();
    if(element.className == "") {
        element.className = name;
    } else {
        element.className = element.className + " " + name;
    }
}

function removeClass(element, name) {
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