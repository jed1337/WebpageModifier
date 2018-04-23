// ==UserScript==
// @name        Google Shortcuts
// @author      Jed Caychingco
// @include     *

// @require     https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.js
// @require     https://raw.githubusercontent.com/ccampbell/mousetrap/master/plugins/bind-dictionary/mousetrap-bind-dictionary.js

// ==/UserScript==

var CONTEXT_CLASS   = "contextArea";

var HIGHLIGHT_CLASS = "highlight";
addCss('.'+HIGHLIGHT_CLASS+'{\
    background: rgba(52, 152, 219,0.8) ! important; \
    border: none ! important; \
    color: #fff ! important; \
    -webkit-transition: linear 0.1s ! important; \
    -o-transition: linear 0.1s ! important; \
    transition: linear 0.1s ! important; \
}');

addCss("."+HIGHLIGHT_CLASS+" a{color:#fff!important ;outline:none}");

function addCss(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function checkSelector(selector, findPath=''){
    var sel = $(selector);

    if(findPath.length){
        sel = sel.find(findPath);
    }
    if(sel.length===0){             //0 selector length
        alert("$('"+selector+"') doesn't work anymore!");
    }
    return sel;
}

function click(selector, findPath="", index=0){
    checkSelector(selector, findPath)[index].click();
}

function clickInContext(findPath){
    //If there's no highlited item, pass it on to click to click the first matching item in general
    if($("."+CONTEXT_CLASS).length === 0){
        click(findPath);
    }
    // Else, find the findPath from the highlighted, then click the one inside
    else{
        // click("."+CONTEXT_CLASS, findPath)
        click("."+CONTEXT_CLASS, findPath)
        // hl.find(findPath)[0].click();
    }
}

function bindJK(selContext, selHighlight, selFocus){
    Mousetrap.bind({
        'j': function(){highLight('j', selContext, selHighlight, selFocus);},
        'k': function(){highLight('k', selContext, selHighlight, selFocus);}
    });
}

/**
* :param: selHighlight which item to highlight in the context
* :param: selFocus which item to bring focus to
*/
function highLight(letter, selContext, selHighlight, selFocus) {
    checkSelector(selContext);
    checkSelector(selHighlight);
    checkSelector(selFocus);

    var context = $(selContext);
    var index   = context.index($("."+CONTEXT_CLASS));

    //So that we can see more of the results. Explained more below (when .focus() is used)
    var nextIndex;

    context.eq(index).find(selHighlight).removeClass(HIGHLIGHT_CLASS);
    context.eq(index).removeClass(CONTEXT_CLASS);

    // alert("before, index="+index+" nextIndex="+nextIndex);
    var old = index;
    if ( letter === 'k' ) {
        if(index >= 0){
            index--;
        }
        nextIndex = index-1;
    } else if ( letter === 'j' ) {
        index++;
        if(index === context.length){
            index = 0;
        }
        nextIndex = index+1;
    }
    // alert("after, index="+index+" nextIndex="+nextIndex);

    //So that we can see more of context.eq(index)
    //If we go down, it'll move 2 places down (nextIndex), go back to the original spot, then go down 1 place (index)
    context.eq(nextIndex).find(selFocus).focus();

    //We just put it in a currentContext so we don't keep referencing context.eq(...)
    var currentContext = context.eq(index);
    currentContext.addClass(CONTEXT_CLASS).find(selFocus).focus();
    currentContext.find(selHighlight).addClass(HIGHLIGHT_CLASS).find(selFocus).focus();
}
