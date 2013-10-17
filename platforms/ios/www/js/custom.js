// This file contains all the javascript logic!

// -----------------
// GLOBAL VARIABLES
// -----------------

/* Page Routing */
var loadedPage;
var usedOCR;
var didSplitEvenly;
var didAssignItem;

/* Business Logic Variables */
var g_subtotal;
var g_taxes;
var totalFaces;

var peopleNamesArr;
var peopleItemsArr;
var peoplePricesArr;

var person1ItemsArr;
var person2ItemsArr;
var person3ItemsArr;
var person4ItemsArr;
var person5ItemsArr;
var person6ItemsArr;

var person1PricesArr;
var person2PricesArr;
var person3PricesArr;
var person4PricesArr;
var person5PricesArr;
var person6PricesArr;

var itemsArr;
var pricesArr;

/* Settings Page */
var currencyChoose;

/* Split Unevenly Page */
var fixedItemsNamesArr;
var selectedItemIndex;
var selectedItemPrice;
var selectedItemName;
var anItemWasSelected;
// -----------------
// FIRST BOOTUP
// -----------------

$(document).ready(function() {
	restart();
	$('.non-js-wrapper').load('app-homepage.html');
});

// -------------------
// FUNCTIONAL BUTTONS
// -------------------

$(document).on('click touchstart', '#add-people-plus-button', function (e){
	var count = parseInt($('.addpeople-counter').text()) + 1;
	if (count < 7){
		$('.addpeople-counter').text(count);
		$('.face-container').append(					
			"<div class='face-box' id='face-box-"+ count +"'>"
				+ "<input type='text' class='initials' value='"+ peopleNamesArr[count-1] +"' maxlength='6' disabled='true' onblur='updateName(" + count + ", this.value)'></input>"
				+ "<br/>"
				+ "<div class='singleface'>"
					+ "<img src='img/face-3.png' class='face' id='cartoonface-" + count + "'>"
				+ "</div>"
				+ "<div class='single-pot-container'>"
					+ "$<span id='remaining-pot-" + count + "'></span>"
				+ "</div>"
			+ "</div>"
		);
		totalFaces = count;
	}
});

$(document).on('click touchstart', '#add-people-minus-button', function (e){
	var count = parseInt($('.addpeople-counter').text()) - 1;
	if (count > 1){
		$('.addpeople-counter').text(count);
		$(".face-container div[class^='face-box']").filter(":last").remove();
		totalFaces = count;
	}
});


















// tap to dismiss
$(document).on('click touchstart', function (e){

	if (loadedPage == "add-initial"){
	    var container = $("div[class^='face-box']");

	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        //container.removeClass("hover_effect");
	        if ($(".singleface", container).hasClass("wiggle")) {
	        	var foundContainer = $("div[class*='wiggle']").closest("div[id^='face-box-']");
	        	/* alert(foundContainer.attr("class")); */
	        	var id = foundContainer.attr("id");
	        	var toRemove = 'face-box-';
				var personNumber = id.replace(toRemove,'');

				peopleNamesArr[parseInt(personNumber) - 1] = $(foundContainer).find("input").val();	
	        	$(".singleface", this).removeClass('wiggle');
	        	
	    	}
	    	
		    
			
			
	        container.find("input").prop('disabled', true);
	        /*$(this).find("input").blur();*/
	    }
	}

	if (loadedPage == "split-unevenly"){
		var container = $("div[id^='split-unevenly-each-bill-item-container-']");

		if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        //container.removeClass("hover_effect");
	        container.removeClass('glowing');

	        selectedItemIndex = -1;
			selectedItemPrice = 0;
			selectedItemName = "";
			anItemWasSelected = false;
	    }
	}
});


// ---------------
// MISC FUNCTIONS!
// ---------------
function restart() {
	/* Reset Everything */
	g_subtotal = 0;
	g_taxes = 0;
	totalFaces = 2;
	loadedPage = 'homepage';

	usedOCR = false;
	didSplitEvenly = true;
	didAssignItem = false;

	peopleNamesArr = new Array();
	peopleItemsArr = new Array();
	peoplePricesArr = new Array();

	person1ItemsArr = new Array();
	person2ItemsArr = new Array();
	person3ItemsArr = new Array();
	person4ItemsArr = new Array();
	person5ItemsArr = new Array();
	person6ItemsArr = new Array();

	person1PricesArr = new Array();
	person2PricesArr = new Array();
	person3PricesArr = new Array();
	person4PricesArr = new Array();
	person5PricesArr = new Array();
	person6PricesArr = new Array();


	itemsArr = new Array();
	pricesArr = new Array();

	currencyChoose = "sgd-currency";

	fixedItemsNamesArr = new Array();
	selectedItemIndex = -1;
	selectedItemPrice = "";
	selectedItemName = "";
	anItemWasSelected = false;

	/* Moving Forward */
	peopleItemsArr[0] = person1ItemsArr;
	peopleItemsArr[1] = person2ItemsArr;
	peopleItemsArr[2] = person3ItemsArr;
	peopleItemsArr[3] = person4ItemsArr;
	peopleItemsArr[4] = person5ItemsArr;
	peopleItemsArr[5] = person6ItemsArr;

	peoplePricesArr[0] = person1PricesArr;
	peoplePricesArr[1] = person2PricesArr;
	peoplePricesArr[2] = person3PricesArr;
	peoplePricesArr[3] = person4PricesArr;
	peoplePricesArr[4] = person5PricesArr;
	peoplePricesArr[5] = person6PricesArr;

	peopleNamesArr[0] = "You";
	peopleNamesArr[1] = "2";
	peopleNamesArr[2] = "3";
	peopleNamesArr[3] = "4";
	peopleNamesArr[4] = "5";
	peopleNamesArr[5] = "6";
}

function updateName(personNumber, newName){
	/*alert(personNumber);
	alert(newName);
	*/
	peopleNamesArr[parseInt(personNumber) - 1] = newName;
}

function updateSinglePot(newTotal, personNumber){
	$("#remaining-pot-" + personNumber).text(newTotal);
}

//Function
function loadPot() {
	var subtotal = g_subtotal;
	//alert(subtotal);
	$('#remaining-pot').text(subtotal);
}

//Function to load the number of faces selected.
function loadFaces(){
	var count = totalFaces;
	if (count == undefined){
		count = 2;
	} 
	
	if (count > 1) {
		for (var i = 2; i <= count; i++){
			$('.face-container').append(					
				"<div class='face-box' id='face-box-"+ i +"'>"
				+ "<input type='text' class='initials' value='"+ peopleNamesArr[i-1] +"' maxlength='6' disabled='true' onblur='updateName(" + i + ", this.value)'></input>"
				+ "<br/>"
				+ "<div class='singleface'>"
					+ "<img src='img/face-3.png' class='face' id='cartoonface-" + i + "'>"
				+ "</div>"
				+ "<div class='single-pot-container'>"
					+ "$<span id='remaining-pot-" + i + "'></span>"
				+ "</div>"
				+ "</div>"
			);
		}
	}
}

function loadItems(){
	var skipIndex = parseInt(selectedItemIndex) - 1;
	for (var i = 0; i < itemsArr.length; i++) {
		billitem = itemsArr[i];
		billprice = pricesArr[i];

		$('.split-unevenly-container').append (
		"<div class='split-unevenly-each-bill-item-container' id='split-unevenly-each-bill-item-container-" + (i+1) + "'>"
			+ "<div class='split-unevenly-each-bill-item-title' id='split-unevenly-each-bill-item-title-" +  (i+1) + "'>"
				+ (i+1) + ". " + billitem
				+ "</div>"
				+ "<div class='split-unevenly-each-bill-item-price'>"
				+ "$" + billprice
			+ "</div>"
		+ "</div>"
		);	
	}
}


//Function to populate the list of bill item
$(document).delegate('#next-bill-item', 'click' ,function(){
	var billitem = $('#enter-bill-item-field').val();
	var billprice = $('#enter-bill-price-field').val();
	var oldRemainingPot = Number($('#remaining-pot').text());
	var newRemainingPot = oldRemainingPot - Number(billprice);
	
	if (newRemainingPot < 0) {
		alert("This item has exceeded the bill!");
	} else {
		$('#remaining-pot').text(newRemainingPot.toFixed(2));
		itemsArr[itemsArr.length] = billitem;
		pricesArr[pricesArr.length] = billprice;
	
		$('.enter-bill-item-list').append (
			"<div class='billitem-each-bill-item-container' id='billitem-each-bill-item-container-'" + (itemsArr.length) + "'>"
				+ "<div class='billitem-each-bill-item-title' id='billitem-each-bill-item-title-'" +  (itemsArr.length) + "'>"
					+ (itemsArr.length) + ". " + itemsArr[itemsArr.length -1]
					+ "</div>"

					+ "<div class='billitem-each-bill-item-price'>"
					+	"$<input type='text' class='textfield-bill-items' id='textfield-bill-items-'" + (pricesArr.length) +"' value='" + pricesArr[pricesArr.length -1] +"'>"
				+ "</div>"
			+ "</div>"
		);
		
		if(newRemainingPot == 0) {
			showDoneButton();
		} 
	}
});

function showDoneButton() {
	$('#goto-splitting-choice-no-ocr').css("display", "inline-block");
	$('#next-bill-item').css("display", "none");
}


//Function to update the currency based on user selection
function changeCurr(e){
	var currency = $(e).attr('id');
	if (currency == "aud-currency"){
		$('.current-currency').html('AUD');
		$('.current-currency-name').html('AUSTRALIAN DOLLAR ($)');
		currencyChoose = "aud-currency";
	} else if (currency == "euro-currency"){
		$('.current-currency').html('EUR');
		$('.current-currency-name').html('EURO (€)');
		currencyChoose = "euro-currency";
	} else if (currency == "jpy-currency"){
		$('.current-currency').html('JPY');
		$('.current-currency-name').html('JAPANESE YEN (¥)');
		currencyChoose = "jpy-currency";
	} else if (currency == "sgd-currency"){
		$('.current-currency').html('SGD');
		$('.current-currency-name').html('SINGAPORE DOLLAR ($)');
		currencyChoose = "sgd-currency";
	} else if (currency == "usd-currency"){
		$('.current-currency').html('USD');
		$('.current-currency-name').html('UNITED STATES DOLLAR ($)');
		currencyChoose = "usd-currency";
	}
}

//Function to store changes to currency
function storeCurrency(){
	if (currencyChoose == "aud-currency"){
		$('.current-currency').append('AUD');
		$('.current-currency-name').append('AUSTRALIAN DOLLAR ($)');
	} else if (currencyChoose == "euro-currency"){
		$('.current-currency').append('EUR');
		$('.current-currency-name').append('EURO (€)');
	} else if (currencyChoose == "jpy-currency"){
		$('.current-currency').append('JPY');
		$('.current-currency-name').append('JAPANESE YEN (¥)');
	} else if (currencyChoose == "sgd-currency"){
		$('.current-currency').append('SGD');
		$('.current-currency-name').append('SINGAPORE DOLLAR ($)');
	} else if (currencyChoose == "usd-currency"){
		$('.current-currency').append('USD');
		$('.current-currency-name').append('UNITED STATES DOLLAR ($)');
	}
}

// -------------------------------
// NAVIGATIONAL BUTTONS - GOTO!
// -------------------------------


// #goto-view-previous-bill
// #goto-settings
// #goto-add-people
// #goto-add-initial
// #goto-billinputchoice
// #goto-photo-snap
// #goto-photo-confirm
// #goto-ocr-result
// #goto-enter-subtotal
// #goto-enter-taxes
// #goto-enter-bill-item
// #goto-splitting-choice
// #goto-split-unevenly

//tap for help
$(document).delegate('.help-button', 'click' ,function(){
	$('#myModal').removeClass( "hide" ).addClass( "show" );
});

//tap to close help
$(document).delegate('.help-cross', 'click' ,function(){
	$('#myModal').removeClass( "show" ).addClass( "hide" );
});


//--From Homepage -> View Previous Bills
$(document).delegate('#goto-view-previous-bill', 'click', function(){
	$('non-js-wrapper').load('app-view-previous-bill.html');
	loadedPage = 'view-previous-bill';
	
	g_subtotal = 0;
	g_taxes = 0;
});

//--From Homepage -> Settings
$(document).delegate('#goto-settings', 'click', function(){
	$('.non-js-wrapper').load('app-settings.html',function(){
		storeCurrency();
	});
	loadedPage = 'settings';
});

//--From Homepage -> Add People
$(document).delegate('#goto-add-people', 'click' ,function(){
	$('.non-js-wrapper').load('app-add-people.html', function(){
		loadFaces();
	});
	loadedPage = "add-people";
});

//--From Add People -> Add Initial
$(document).delegate('#goto-add-initial', 'click' ,function(){
	$('.bs-bottom-container').load('app-add-initial.html');
	loadedPage = "add-initial";
	$('#backto-homepage').attr('id', 'backto-add-people');
});
	
//-- From Add Initial -> Bill Input Choice
$(document).delegate('#goto-billinputchoice', 'click' ,function(){
	$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	$('.bs-bottom-container').load('app-billinputchoice.html');
	loadedPage = "split-option";
	$('#backto-add-people').attr('id', 'backto-add-initial');
});

//---------------------------
// CHOICE: MANUAL BILL INPUT


//--From Bill Input Choice -> Enter Subtotal
$(document).delegate('#goto-enter-subtotal', 'click' ,function(){
	$('.bs-bottom-container').load('app-enter-subtotal.html', function(){
		$('#subtotal-field').val(g_subtotal);
	});
	loadedPage = "enter-subtotal";
	$('#backto-add-initial').attr('id', 'backto-billinputchoice');
});

//--From Enter Subtotal -> Enter Taxes
$(document).delegate('#goto-enter-taxes', 'click' ,function(){
	var subtotal= $('#subtotal-field').val();
	g_subtotal = subtotal
	
	$('.bs-bottom-container').load('app-enter-taxes.html', function(){
		$('#taxes-field').val(g_taxes);
	});
	loadedPage = "enter-taxes";
	$('#backto-billinputchoice').attr('id', 'backto-enter-subtotal');
});

//--From Enter Taxes -> Enter Bill Item
$(document).delegate('#goto-enter-bill-item', 'click' ,function(){
	var taxes= $('#taxes-field').val();
	g_taxes = taxes

	$('.non-js-wrapper').load('app-enter-bill-item.html', function() {
		loadedPage = "enter-bill-item";
		itemsArr = new Array();
		pricesArr = new Array();
		loadPot();
	});
	$('#backto-enter-subtotal').attr('id', 'backto-enter-taxes');
});

//------------------------
// CHOICE: SNAP PHOTO + OCR BILL INPUT


//-- From Bill Input Choice -> Snap Photo
$(document).delegate('#goto-photo-snap', 'click' ,function(){
	$('.non-js-wrapper').load('app-photo-snap.html');
	var timer = setTimeout(function(){
		$('.non-js-wrapper').load('app-photo-confirm.html');
		clearTimeout(timer);
	},1000);
	loadedPage = "photo-snap";
	$('#backto-add-initial').attr('id', 'backto-billinputchoice');
});

//--From Confirmed OCR Photo -> OCR Results Page
$(document).delegate('#goto-ocr-result', 'click' ,function(){
	$('.non-js-wrapper').load('app-ocr-result.html');
	loadedPage = "ocr-result";
});


//------------------------
// START SPLITTING!

//--From OCR Results Page -> Splitting Choice Type (Unevenly or Evenly)
$(document).delegate('#goto-splitting-choice', 'click' ,function(){
	$('.non-js-wrapper').load('app-splitting-choice.html', function(){
		loadFaces();
	});
	loadedPage = "splitting-choice";
});







//--From Manual Bill Input Item Page -> Splitting Choice Type (Unevenly or Evenly)
$(document).delegate('#goto-splitting-choice-no-ocr', 'click' ,function(){
	$('.non-js-wrapper').load('app-splitting-choice.html', function(){
		loadFaces();
		$('#backto-billinputchoice').attr('id', 'backto-enter-bill-item');
	});
	loadedPage = "splitting-choice";
});

//------------------------
// FINISH SPLITTING!


//--From Splitting Choice Type (Unevenly or Evenly) -> Split Evenly - Summary Page
$(document).delegate('#goto-summary', 'click' ,function(){
	$('.non-js-wrapper').load('app-summary.html', function(){
		loadFaces();
	});
	loadedPage = "summary";
});

// -------------------------------
// NAVIGATIONAL BUTTONS - BACKTO!
// -------------------------------

// #backto-add-people
// #backto-add-initial
// #backto-billinputchoice
// #backto-enter-subtotal
// #backto-enter-taxes

//--From Settings == BACK TO == Homepage
$(document).delegate('#backto-homepage', 'click', function(){
	$('.non-js-wrapper').load('app-homepage.html');
	restart();
})

//--From Enter Initial == BACK TO == Add People
$(document).delegate('#backto-add-people', 'click' ,function(){
	$('.non-js-wrapper').load('app-add-people.html', function(){
		$('.addpeople-counter').html(totalFaces);
		loadFaces();
	});
	loadedPage = "add-people";
	$('#backto-add-people').attr('id', 'backto-homepage');
});

//--From Bill Input Choice == BACK TO == Enter Initial
$(document).delegate('#backto-add-initial', 'click' ,function(){
	$('.bs-bottom-container').load('app-add-initial.html');
	loadedPage = "add-initial";
	$('#backto-add-initial').attr('id', 'backto-add-people');
});

//--From Enter Subtotal == BACK TO == Bill Input Choice
$(document).delegate('#backto-billinputchoice', 'click' ,function(){
	$('.non-js-wrapper').load('app-add-people.html', function(){
		$('.addpeople-counter').html(totalFaces);
		loadFaces();
		$('.bs-bottom-container').load('app-billinputchoice.html');
		$('#backto-homepage').attr('id', 'backto-add-initial');
	});
	loadedPage = "billinputchoice";
	$('#backto-billinputchoice').attr('id', 'backto-add-initial');
});

//--From Enter Taxes == BACK TO == Enter Subtotal
$(document).delegate('#backto-enter-subtotal', 'click' ,function(){
	$('.bs-bottom-container').load('app-enter-subtotal.html', function(){
		$('#subtotal-field').val(g_subtotal);
	});
	loadedPage = "enter-subtotal";
	$('#backto-enter-subtotal').attr('id', 'backto-billinputchoice');
	
});

//--From Enter Bill Item == BACK TO == Enter Taxes
$(document).delegate('#backto-enter-taxes', 'click' ,function(){
	$('.non-js-wrapper').load('app-add-people.html', function(){
		$('.addpeople-counter').html(totalFaces);
		loadFaces();
		$('.bs-bottom-container').load('app-enter-taxes.html', function(){
			$('#taxes-field').val(g_taxes);
		});
		$('#backto-homepage').attr('id', 'backto-enter-subtotal');
	});
	loadedPage = "enter-taxes";
});

//--From Splitting choice == BACK TO == Enter Bill Item
$(document).delegate('#backto-enter-bill-item', 'click' ,function(){
	$('.non-js-wrapper').load('app-enter-bill-item.html', function(){
		loadedPage = "enter-bill-item";
		var newRemainingPot = 0;
		$('#remaining-pot').text(newRemainingPot.toFixed(2));

		for (var i = 0; i < itemsArr.length; i++) {
			billitem = itemsArr[i];
			billprice = pricesArr[i];

			$('.enter-bill-item-list').append (
			"<div class='billitem-each-bill-item-container' id='billitem-each-bill-item-container-'" + (i+1) + "'>"
				+ "<div class='billitem-each-bill-item-title' id='billitem-each-bill-item-title-'" +  (i+1) + "'>"
					+ (i+1) + ". " + billitem
					+ "</div>"
					+ "<div class='billitem-each-bill-item-price'>"
					+	"$<input type='text' class='textfield-bill-items' id='textfield-bill-items-'" + (i+1) +"' value='" + billprice +"'>"
				+ "</div>"
			+ "</div>"
			);	
		}
		
		
		$('#backto-enter-bill-item').attr('id', 'backto-enter-taxes');
	});

});



//--From Summary == BACK TO == Homepage
$(document).delegate('#backto-homepage', 'click' ,function(){
	$('.non-js-wrapper').load('app-homepage.html');
	//loadedPage = "enter-taxes";
});

//-- Prompt Email Sent Alert
$(document).delegate('.summary-each-diner-email', 'click' ,function(){
	alert('Email Sent!');
});

//-- Prompt SMS Sent Alert
$(document).delegate('.summary-each-diner-sms', 'click' ,function(){
	alert('SMS Sent!');
});


//-- From SUMMARY of EACH DINER to SPECIFIC DINERS
$(document).delegate('#diner1-detailed-summary', 'click' ,function(){
	$('.non-js-wrapper').load('app-detailed-summary.html');
});

//-- From SUMMARY of EACH DINER to SPECIFIC DINERS
$(document).delegate('#diner2-detailed-summary', 'click' ,function(){
	$('.non-js-wrapper').load('app-detailed-summary.html');
});

//-- From SUMMARY of EACH DINER to SPECIFIC DINERS
$(document).delegate('#diner3-detailed-summary', 'click' ,function(){
	$('.non-js-wrapper').load('app-detailed-summary.html');
});






























//--From Splitting Choice Type (Unevenly or Evenly) -> Split Unevenly Page
$(document).delegate('#goto-split-unevenly', 'click' ,function(){
	$('.non-js-wrapper').load('app-split-unevenly.html', function(){
		loadFaces();
		loadItems();
	});
	loadedPage = "split-unevenly";
	$('#backto-homepage').attr('id', 'backto-splitting-choice');
});



// 'touchstart touchend'
$(document).delegate("div[id^='split-unevenly-each-bill-item-container-']", 'click touchstart' ,function(){
	//$("div[class^='face-box-']").removeClass("hover_effect");
	
	if (loadedPage == "split-unevenly"){
		$("div[id^='split-unevenly-each-bill-item-container-']").removeClass("glowing");
	    
	    //$(this).toggleClass('hover_effect');
	    $(this).toggleClass('glowing');
	    anItemWasSelected = true;


	    selectedItemName = $(".split-unevenly-each-bill-item-title", this).text();
	    selectedItemPrice = $(".split-unevenly-each-bill-item-price", this).text();
	    
	    selectedItemIndex = selectedItemName.substring(0,selectedItemName.indexOf("."));
	    //alert(selectedItemIndex);

	    /*alert(selectedItemName);
	    alert(selectedItemPrice);*/
	    /*$(this).find("input").prop('disabled', false);
	    $(this).find("input").focus();*/
	}
});










// 'touchstart touchend'
$(document).delegate("div[class^='face-box']", 'click touchstart' ,function(){
	//$("div[class^='face-box-']").removeClass("hover_effect");
	
	if (loadedPage == "add-initial"){
		$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	    
	    //$(this).toggleClass('hover_effect');
	    $(".singleface", this).toggleClass('wiggle');

	    $(this).find("input").prop('disabled', false);
	    $(this).find("input").focus();
	}

	if (loadedPage == "split-unevenly" && anItemWasSelected == true){
		$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	    
	    //$(this).toggleClass('hover_effect');
	    //$(".singleface", this).toggleClass('wiggle');
	    /*alert("ok!");*/
	    
	    var id = $(this).attr('id');
	    /*alert(id);*/

		var toRemove = 'face-box-';
		var personNumber = id.replace(toRemove,'');

		/*alert(personNumber);*/

		var currentPersonPrices = peoplePricesArr[parseInt(personNumber) - 1];
		var currentPersonItems = peopleItemsArr[parseInt(personNumber) - 1];

		toRemove = '$';
		selectedItemPrice = selectedItemPrice.replace(toRemove,'');

		/*
		alert(selectedItemName);
	    alert(parseInt(selectedItemPrice));
		*/
		currentPersonPrices[currentPersonPrices.length] = parseInt(selectedItemPrice);
		currentPersonItems[currentPersonItems.length] = selectedItemName;

		/*alert(currentPersonPrices.join('\n'));
		alert(currentPersonItems.join('\n'));*/
		
		var newTotal = 0;
		for(var i=0; i < currentPersonPrices.length; i++){
    		newTotal += currentPersonPrices[i]
		}
		updateSinglePot(newTotal, personNumber);
		
		var targetToRemove = $('#split-unevenly-each-bill-item-container-' + selectedItemIndex);
		targetToRemove.hide('slow', function(){ targetToRemove.remove(); });
	    //$(this).find("input").prop('disabled', false);
	    //$(this).find("input").focus();

	}
});
