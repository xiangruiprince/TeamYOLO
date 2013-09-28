window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

// The dynamically built HTML pages. In a real-life app, In a real-life app, use Handlerbar.js, Mustache.js or another template engine
//var homePage = '<div>WHAT THE?!</div>';

var homePage;

$.ajax({
    type: 'POST',
    url: 'app-homepage.html',
    success: function(data) {
        homePage = data;
    },
    async: false
    // async to false so that we don't access an empty variable before the request is finished
});

//alert(homePage);

var addplayer;

$.ajax({
    type: 'POST',
    url: 'app-addplayer.html',
    success: function(data) {
        addplayer = data;
    },
    async: false
    // async to false so that we don't access an empty variable before the request is finished
});

var addinitial;

$.ajax({
    type: 'POST',
    url: 'app-addinitial.html',
    success: function(data) {
        addinitial = data;
    },
    async: false
});

var billinputchoice;

$.ajax({
    type: 'POST',
    url: 'app-billinputchoice.html',
    success: function(data) {
        billinputchoice = data;
    },
    async: false
});

var entersubtotal;

$.ajax({
    type: 'POST',
    url: 'app-entersubtotal.html',
    success: function(data) {
        entersubtotal = data;
    },
    async: false
});

var entertax;

$.ajax({
    type: 'POST',
    url: 'app-entertax.html',
    success: function(data) {
        entertax = data;
    },
    async: false
});

var enterbillitems;

$.ajax({
    type: 'POST',
    url: 'app-enterbillitems.html',
    success: function(data) {
        enterbillitems = data;
    },
    async: false
});

var splittingchoice;

$.ajax({
    type: 'POST',
    url: 'app-splittingchoice.html',
    success: function(data) {
        splittingchoice = data;
    },
    async: false
});

var splitbill;

$.ajax({
    type: 'POST',
    url: 'app-splitbill.html',
    success: function(data) {
        splitbill = data;
    },
    async: false
});


var splitbill2;

$.ajax({
    type: 'POST',
    url: 'app-splitbill2.html',
    success: function(data) {
        splitbill2 = data;
    },
    async: false
});


var finish;

$.ajax({
    type: 'POST',
    url: 'app-finish.html',
    success: function(data) {
        finish = data;
    },
    async: false
});


var ocrcamerascreen;

$.ajax({
    type: 'POST',
    url: 'app-ocrcamerascreen.html',
    success: function(data) {
        ocrcamerascreen = data;
    },
    async: false
});


var confirmphoto;

$.ajax({
    type: 'POST',
    url: 'app-confirmphoto.html',
    success: function(data) {
        confirmphoto = data;
    },
    async: false
});


var ocrresult;

$.ajax({
    type: 'POST',
    url: 'app-ocrresult.html',
    success: function(data) {
        ocrresult = data;
    },
    async: false
});

var usedOCR = false;
var didSplitEvenly = true;
var didAssignItem = false;

var slider = new PageSlider($("#container"));
$(window).on('hashchange', route);

// Basic page routing
function route(event) {
    var page,
        hash = window.location.hash;

    if (hash === "#addplayer") {
        page = addplayer;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#addinitial") {
        page = addinitial;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#billinputchoice") {
        page = billinputchoice ;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#entersubtotal") {
        usedOCR = false;
        page = entersubtotal;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#entertax") {
        page = entertax;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#enterbillitems") {
        page = enterbillitems;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#splittingchoice") {
        didSplitEvenly = false;
        page = splittingchoice;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#splitbill") {
        didSplitEvenly = false;
        page = splitbill;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#splitbill2") {
        didAssignItem = true;
        page = splitbill2;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#finish") {
        page = finish;
        slider.slidePageFrom($(page), "right");
    } else if (hash === "#ocrcamerascreen") {
        page = ocrcamerascreen;
        //slider.slidePageFrom($(page), "right");
        slider.slidePageFrom($(page), "up");
    } else if (hash === "#confirmphoto") {
        usedOCR = false;
        page = confirmphoto;
        //slider.slidePageFrom($(page), "right");
        slider.slidePageFrom($(page), "down");
    } else if (hash === "#ocrresult") {
        usedOCR = true;
        page = ocrresult;
        slider.slidePageFrom($(page), "right");
    }
    // SLIDE LEFT! 
    else if (hash === "#backtoaddplayer") {
        page = addplayer;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoaddinitial") {
        page = addinitial;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtobillinputchoice") {
        page = billinputchoice ;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoentersubtotal") {
        page = entersubtotal;
        usedOCR = false;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoentertax") {
        page = entertax;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoenterbillitems") {
        if (usedOCR == true) {
            page = ocrresult;
        } else {
            page = enterbillitems;
        }
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtosplittingchoice") {
        didSplitEvenly = true;
        didAssignItem = false;
        page = splittingchoice;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtosplitbill") {
        didAssignItem = false;
        page = splitbill;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtosplitbill2") {
        if (didSplitEvenly == true){
            page = splittingchoice;
        } else if (didAssignItem == true){
            page = splitbill2;
        } else {
            page = splitbill;    
        }
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoocrcamerascreen") {
        page = ocrcamerascreen;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoconfirmphoto") {
        page = confirmphoto;
        slider.slidePageFrom($(page), "left");
    } else if (hash === "#backtoocrresult") {
        page = ocrresult;
        slider.slidePageFrom($(page), "left");
    } else {
        page = homePage;
        didSplitEvenly = true;
        usedOCR = false;
        didAssignItem = false;
        slider.slidePageFrom($(page), "left");
    }

    //slider.slidePage($(page));

}

// Primitive template processing. In a real-life app, use Handlerbar.js, Mustache.js or another template engine
// tpl = HTML template
// data = JSON!
function merge(tpl, data) {
    return tpl.replace("{{img}}", data.img)
              .replace("{{name}}", data.name)
              .replace("{{description}}", data.description);
}

route();