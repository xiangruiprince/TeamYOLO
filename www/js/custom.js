

// This file contains all the javascript logic!

// -----------------
// GLOBAL VARIABLES
// -----------------

/* Page Routing */
var loadedPage;
var usedOCR;
var didSplitEvenly;
var didAssignItem;
var ocrSubTotalPrice;
var ocrTotalPrice;
var ocrTaxPercentage;

/* Business Logic Variables */
var g_subtotal;
var g_taxes;
var g_taxPercentage;
var totalFaces;

/* People's Names, Items, Paid Varialbes */
var peopleNamesArr;
var peopleItemsArr;
var peopleItemsIndexArr;
var peoplePaidArr;
var peoplePricesArr;
var peoplePricesPotArr;

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

var person1ItemsIndexArr;
var person2ItemsIndexArr;
var person3ItemsIndexArr;
var person4ItemsIndexArr;
var person5ItemsIndexArr;
var person6ItemsIndexArr;

var itemsArr;
var pricesArr;
var numberOfSharesForItemsArr;

/* Settings Page */
var currencyChoose;
var currencySymbol;

/* Split Unevenly Page */
var remainingItemsIndex;
var remainingItemsArr;
var remainingPricesArr;
var selectedItemIndex;
var selectedItemPrice;
var selectedItemName;
var anItemWasSelected;
var facesAreWiggling;
var facesWigglingArr;
var hasFinishedSplitting;




// -----------------
// FIRST BOOTUP
// -----------------
$(document).ready(function() {
	
	loadDefaultCurrency();
	restart();
	$('.non-js-wrapper').load('app-homepage.html');
});


// -------------------
// FUNCTIONAL BUTTONS
// -------------------

// Adding People (+)
$(document).on('click touchstart', '#add-people-plus-button', function (e){
	
	// Increment Number
	var count = parseInt($('.addpeople-counter').text()) + 1;

	// Limiting to 6 people, for now.
	if (count < 7){
		
		// Update text box
		$('.addpeople-counter').text(count);

		// Update Face Container
		$('.face-container').append(					
			"<div class='face-box' id='face-box-"+ count +"'>"
				+ "<input type='text' class='initials' value='"+ peopleNamesArr[count-1] +"' maxlength='6' disabled='true' onblur='updateName(" + count + ", this.value)'></input>"
				+ "<br/>"
				+ "<div class='singleface'>"
					+ "<img src='img/face-3.png' class='face' id='cartoonface-" + count + "'>"
				+ "</div>"
				+ "<div class='single-pot-container'>"
					+ "<span class='currency-symbol'>" + currencySymbol + "</span><span id='remaining-pot-" + count + "'></span>"
				+ "</div>"
			+ "</div>"
		);

		totalFaces = count;
	} // end if (count)
}); // end add-people-plus-button


// Adding People (-)
$(document).on('click touchstart', '#add-people-minus-button', function (e){
	var count = parseInt($('.addpeople-counter').text()) - 1;
	
	if (count > 1) {
		$('.addpeople-counter').text(count);
		$(".face-container div[class^='face-box']").filter(":last").remove();
		totalFaces = count;
	} // end if (count)
}); // end add-people-minus-button


// tap to dismiss
$(document).on('click touchstart', function (e){

	// Check if it's at add-initial page to dismiss wiggles
	if (loadedPage == "add-initial"){

	    var container = $("div[class^='face-box']");

	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        //container.removeClass("hover_effect");
	        if ($(".singleface", container).hasClass("wiggle")) {
	        	var foundContainer = $("div[class*='wiggle']").closest("div[id^='face-box-']");
	        	
	        	var id = foundContainer.attr("id");
	        	var toRemove = 'face-box-';
				var personNumber = id.replace(toRemove,'');

				peopleNamesArr[parseInt(personNumber) - 1] = $(foundContainer).find("input").val();	
	        	$(".singleface", this).removeClass('wiggle');
	    	} // end if singleface class
	    				
	        container.find("input").prop('disabled', true);
	    } // end if
	} // end if (loadedPage == "add-initials")

	// Logic for Split Unevenly's Tap Dismiss
	if (loadedPage == "split-unevenly"){
		var container = $("div[id^='split-unevenly-each-bill-item-container-']");

		if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        
	        if (facesAreWiggling == false){
		        container.removeClass('glowing');
		        if (remainingItemsArr == 0){
		        	$('#split-unevenly-instruction').text("TAP 'FINISH' TO CONTINUE!");
		        } else {
		        	$('#split-unevenly-instruction').text('TAP AN ITEM TO START');	
		        }

		        selectedItemIndex = -1;
				selectedItemPrice = 0;
				selectedItemName = "";
				anItemWasSelected = false;
			} // end if (facesAreWiggling == false)
	    } // end if (containers)
	} // end if(loadedPage == "split-unevenly"); 
}); // end Tap to Dismiss 




//Function to populate the list of bill item
$(document).delegate('#next-bill-item', 'click' ,function(){
	var billitem = $('#enter-bill-item-field').val();
	var billprice = $('#enter-bill-price-field').val();
	
	// If ITEM VALUE is empty, we will use the placeholder as VALUE
	if (billitem == 0 || billitem == "" || billitem == undefined) {
		billitem = $('#enter-bill-item-field').attr("placeholder");
	}


	var oldRemainingPot = Number($('#remaining-pot').text());
	var newRemainingPot = oldRemainingPot - Number(billprice);
	
	if (newRemainingPot < 0) {
		alert("This item has exceeded the bill!");
	} else if (billprice == 0 || billprice == "") {
		alert("You need to set a price first!");
	} else {

		// Next placeholder item number
		var nextItemNumber = itemsArr.length + 2;


		//$('#enter-bill-item-field').val('Item ' + nextItemNumber);

		$('#remaining-pot').text(newRemainingPot.toFixed(2));
		itemsArr[itemsArr.length] = billitem;
		pricesArr[pricesArr.length] = billprice;
	
		$('.enter-bill-item-list').append (
			"<div class='billitem-each-bill-item-container' id='billitem-each-bill-item-container-'" + (itemsArr.length) + "'>"
				+ "<div class='billitem-each-bill-item-title' id='billitem-each-bill-item-title-'" +  (itemsArr.length) + "'>"
					+ (itemsArr.length) + ". " + itemsArr[itemsArr.length -1]
					+ "</div>"

					+ "<div class='billitem-each-bill-item-price'>"
					+ "<span class='currency-symbol'>" + currencySymbol + "</span><input type='text' class='textfield-bill-items' id='textfield-bill-items-'" + (pricesArr.length) +"' value='" + pricesArr[pricesArr.length -1] +"'>"
					//+ "<span class='currency-symbol'>" + currencySymbol + "</span><input type='text' class='textfield-bill-items' id='textfield-bill-items-'" + (pricesArr.length) +"' placeholder='0.00'>"
				+ "</div>"
			+ "</div>"
		);
		
		if(newRemainingPot == 0) {
			showDoneButton();
		}

		//Resetting
		$('#enter-bill-item-field').val("");
		$('#enter-bill-price-field').val(""); 

		// Set placeholder to next item
		$('#enter-bill-item-field').attr("placeholder", "Item " + nextItemNumber);
	} // end else
});

function showDoneButton() {
	$('#goto-splitting-choice-no-ocr').css("display", "inline-block");
	$('#next-bill-item').css("display", "none");
}


//Function to update the currency based on user selection
function changeCurr(e){
	var currency = $(e).attr('id');
	if (currency == "uk-currency"){
		$('.current-currency').html('GBP');
		$('.current-currency-name').html('BRITISH POUND (£)');
		currencyChoose = "uk-currency";
		currencySymbol = "£";
	} else if (currency == "euro-currency"){
		$('.current-currency').html('EUR');
		$('.current-currency-name').html('EURO (€)');
		currencyChoose = "euro-currency";
		currencySymbol = "€";
	} else if (currency == "sgd-currency"){
		$('.current-currency').html('SGD');
		$('.current-currency-name').html('SINGAPORE DOLLAR ($)');
		currencySymbol = "$";
		currencyChoose = "sgd-currency";
	} else if (currency == "usd-currency"){
		$('.current-currency').html('USD');
		$('.current-currency-name').html('UNITED STATES DOLLAR ($)');
		currencyChoose = "usd-currency";
		currencySymbol = "$";
	}
}

//Function to store changes to currency
function storeCurrency(){
	if (currencyChoose == "uk-currency"){
		$('.current-currency').append('UK');
		$('.current-currency-name').append('BRITISH POUND (£)');
	} else if (currencyChoose == "euro-currency"){
		$('.current-currency').append('EUR');
		$('.current-currency-name').append('EURO (€)');
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

	// Change Body CSS to White
	$("body").css('background-color', '#ffffff');
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
	for (var i = 0; i < totalFaces; i++){
		peoplePricesPotArr[i] = 0.0;	
	}

	$('.header').text('ENTER INITIALS');
	$('.bs-bottom-container').load('app-add-initial.html');
	loadedPage = "add-initial";
	$('#backto-homepage').attr('id', 'backto-add-people');
});
	
//-- From Add Initial -> Bill Input Choice
$(document).delegate('#goto-billinputchoice', 'click' ,function(){
	$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	$('.header').text('INPUT OPTIONS');
	$('.bs-bottom-container').load('app-billinputchoice.html');
	loadedPage = "split-option";
	$('.header').text('INPUT CHOICE');
	$('#backto-add-people').attr('id', 'backto-add-initial');
});

//---------------------------
// CHOICE: MANUAL BILL INPUT


//--From Bill Input Choice -> Enter Subtotal
$(document).delegate('#goto-enter-subtotal', 'click' ,function(){
	$('.header').text('ENTER SUBTOTAL');

	$('.bs-bottom-container').load('app-enter-subtotal.html', function(){
		//$('.currency-symbol').text(currencySymbol);
	
		if(g_subtotal != 0) {
			$('#subtotal-field').val(g_subtotal);
		} else {
			$('#subtotal-field').val("");
		}
	});
	loadedPage = "enter-subtotal";
	usedOCR = false; // added Jeremy
	$('#backto-add-initial').attr('id', 'backto-billinputchoice');
});

//--From Enter Subtotal -> Enter Taxes
$(document).delegate('#goto-enter-taxes', 'click' ,function(){
	var subtotal= $('#subtotal-field').val();
	g_subtotal = subtotal;

	// Logic to check if SUBTOTAL is ZERO
	if(g_subtotal == 0 || g_subtotal == 0.0 || g_subtotal < 0) {
		alert('Please enter a valid subtotal.')
	} else {
		try {
			parseFloat(g_subtotal);

			$('.header').text('ENTER TAXES');
			$('.bs-bottom-container').load('app-enter-taxes.html', function(){
				//$('.currency-symbol').text(currencySymbol);
				
				if(g_taxes != 0) {
					$('#taxes-field').val(g_taxes);
				} else {
					$('#taxes-field').val("");
				} // end else
			}); // end try
			loadedPage = "enter-taxes";
			$('#backto-billinputchoice').attr('id', 'backto-enter-subtotal');

		} catch (err) {
			alert('Please enter a valid subtotal.')
		}
	} // end else
}); // 

//--From Enter Taxes -> Enter Bill Item
$(document).delegate('#goto-enter-bill-item', 'click' ,function(){

	var taxes = $('#taxes-field').val();

	// Default it to 
	if(taxes == "" || taxes == undefined) {
		taxes = 0;
	}

	g_taxes = taxes;


	// Logic to check if SUBTOTAL is ZERO
	if(g_taxes < 0) {
		alert('Please enter a valid tax amount.')
	} else {
		try {
			//parseFloat(g_taxes);

			//g_taxPercentage = parseInt(g_taxes) / parseInt(g_subtotal);
			g_taxPercentage = parseFloat(g_taxes) / parseFloat(g_subtotal);
			$('.non-js-wrapper').load('app-enter-bill-item.html', function() {
				//$('.currency-symbol').text(currencySymbol);
				loadedPage = "enter-bill-item";
				itemsArr = new Array();
				pricesArr = new Array();
				loadPot();
			});
			$('#backto-enter-subtotal').attr('id', 'backto-enter-taxes');
		} catch (err) {
			alert('Please enter a valid tax amount.')
		} // end catch
	} // end else



	
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

	// Change Body CSS to White
	$("body").css('background-color', '#0AB7B2');
	usedOCR = true; // for proper redirection
});


//--From Confirmed OCR Photo -> OCR Results Page
$(document).delegate('#goto-ocr-result', 'click' ,function(){
	$('.non-js-wrapper').load('app-ocr-result.html', function() {
		g_subtotal = Number($('#ocr-subtotal').val());
		ocrTotalPrice = Number($('#ocr-total').val());
		//$('.currency-symbol').text(currencySymbol);

		var difference = ocrTotalPrice - g_subtotal;
		g_taxPercentage = difference / g_subtotal;
		
	});
	loadedPage = "ocr-result";

	// Change Body CSS to White
	$("body").css('background-color', '#ffffff');
	usedOCR = true; // for proper redirection
	
});



//------------------------
// START SPLITTING!

//--From OCR Results Page -> Splitting Choice Type (Unevenly or Evenly)
$(document).delegate('#goto-splitting-choice', 'click' ,function(){
	// --------------
	// OCR PORTION
	// --------------

	if (usedOCR) {

		ocrSubTotalPrice = $('#ocr-subtotal').val();
		ocrTotalPrice = $('#ocr-total').val();

		// Calculating Tax
		ocrTaxPercentage = (ocrTotalPrice - ocrSubTotalPrice) / ocrSubTotalPrice;

		// Hardcoding 3 Item Title
		itemsArr[0] = $("#ocr-bill-item-title-1-text").text();
		itemsArr[1] = $("#ocr-bill-item-title-2-text").text();
		itemsArr[2] = $("#ocr-bill-item-title-3-text").text();

		// Hardcoding 3 Item Prices with TAX
		//pricesArr[0] = 15.00 * (1 + ocrTaxPercentage);
		//pricesArr[1] = 12.50 * (1 + ocrTaxPercentage);
		//pricesArr[2] = 6.20 * (1 + ocrTaxPercentage);
		
		pricesArr[0] = Number($("#ocr-bill-item-price-1").val());
		pricesArr[1] = Number($("#ocr-bill-item-price-2").val());
		pricesArr[2] = Number($("#ocr-bill-item-price-3").val());


	}

	for (var i = 0; i < itemsArr.length; i++){
		numberOfSharesForItemsArr[i] = 0;
	}

	$('.non-js-wrapper').load('app-splitting-choice.html', function(){
		loadFaces();
	});

	// Change Body CSS to Default
	$("body").css('background-color', '#0AB7B2');
	
	loadedPage = "splitting-choice";
});







//--From Manual Bill Input Item Page -> Splitting Choice Type (Unevenly or Evenly)
$(document).delegate('#goto-splitting-choice-no-ocr', 'click' ,function(){
	usedOCR = false;

	for (var i = 0; i < itemsArr.length; i++){
		numberOfSharesForItemsArr[i] = 0;
	}
	$('.non-js-wrapper').load('app-splitting-choice.html', function(){
		loadFaces();
		$('#backto-billinputchoice').attr('id', 'backto-enter-bill-item');
	});
	// 
	loadedPage = "splitting-choice-no-ocr";
});

//------------------------
// FINISH SPLITTING!


//--From Splitting Choice Type (Unevenly or Evenly) -> Split Evenly - Summary Page
$(document).delegate('#goto-summary', 'click' ,function(){
// Perform Redirection
	$('.non-js-wrapper').load('app-summary.html', function(){
		// -------------------------------
		// SPLIT EVENLY LOGIC via OCR
		// -------------------------------
		hasFinishedSplitting = true;

		// if user clicks on Split Evenly right away on Splitting Choice Page
		if(loadedPage == "splitting-choice" || loadedPage == "splitting-choice-no-ocr") {
			
			didSplitEvenly = true;

			// OCR Only :: Victor have to duplicate/share logic for Split Evenly 
			if(usedOCR) {
				var ocrEachPersonTotalPrice = ocrTotalPrice / totalFaces; 

				for (var i = 0; i < itemsArr.length; i++) {

					var splitPriceOfEachItem = pricesArr[i] / totalFaces;
					
					for (var j = 0; j < totalFaces; j++) {

						var retrievedPersonItemsArr = peopleItemsArr[j];
						retrievedPersonItemsArr[retrievedPersonItemsArr.length] = itemsArr[i];

						var retrievedPersonPricesArr = peoplePricesArr[j];
						retrievedPersonPricesArr[retrievedPersonPricesArr.length] = pricesArr[i] / totalFaces;
					};
				};

				// ---------------------------
				// PRINT EVERYONE'S PRICES
				// ---------------------------

				for (var i = 0; i < totalFaces; i++) {
					
					// Check if this person has paid
					var hasThisPersonPaid = peoplePaidArr[i];

					if(hasThisPersonPaid == "unpaid") {
						// if unpaid, ignore checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"

									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "'>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrEachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						);
					} else {
						// if paid, add in checked for checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"
									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "' checked>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrEachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						); // end append
					} // end else (paid)
				}; // end for

				$('.summary-main-container').append(
					"<div class='summary-total-container'>"
						+ "<div class='summary-each-diner-checkbox'>"
						+ "</div>"
						+ "<div class='summary-clickable-detailed-summary'>"
							+ "<div class='summary-each-diner-name'>TOTAL"
							+ "</div>"
							+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrTotalPrice + "</div>"
						+ "</div>" // end of summary-clickable-detailed-summary
						+ "<div class='summary-each-diner-email'></div>"
						+ "<div class='summary-each-diner-sms'></div>"
					+ "</div>"
				);

				$('.summary-main-container').append(
					"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
				);



				// -----------------------------------------
				// Calculate Number of SHARES for EACH Item
				// Very Inefficient  n^3
				// -----------------------------------------

				// Loop through ALL Items
				for (var i = 0; i < itemsArr.length; i++) {
					
					var currentItemCheck = itemsArr[i];
					var currentItemCount = 0;

					// Loop through everyone's itemsArr
					for (var j = 0; j < totalFaces; j++) {
						var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr

						// Loop through EACH Item of Everyone's ItemArr
						for (var k = 0; k < retrievedPersonItemArr.length; k++) {
							//if(currentItemCheck == retrievedPersonItemArr[k]) {
							if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {
								currentItemCount++; // count++
							}
						}; // end k for-loop
					}; // end j for-loop
/*
					if(currentItemCount == 1) {
						currentItemCount = 1;
					} // end if
*/

					numberOfSharesForItemsArr[i] = currentItemCount;
				}; // end for-loop of ALL Items
			} // end of usedOCR
			else {
				//var grandTotal = parseInt(g_subtotal) + parseInt(g_taxes);
				var grandTotal = parseFloat(g_subtotal) + parseFloat(g_taxes);
				var eachPersonTotalPrice = grandTotal / totalFaces; 
				
				for (var i = 0; i < itemsArr.length; i++) {

					var splitPriceOfEachItem = pricesArr[i] / totalFaces;
					
					for (var j = 0; j < totalFaces; j++) {

						var retrievedPersonItemsArr = peopleItemsArr[j];
						retrievedPersonItemsArr[retrievedPersonItemsArr.length] = itemsArr[i];

						var retrievedPersonPricesArr = peoplePricesArr[j];
						retrievedPersonPricesArr[retrievedPersonPricesArr.length] = pricesArr[i] / totalFaces;
					};
				};

				// ---------------------------
				// PRINT EVERYONE'S PRICES
				// ---------------------------

				for (var i = 0; i < totalFaces; i++) {

					// Check if this person has paid
					var hasThisPersonPaid = peoplePaidArr[i];

					if(hasThisPersonPaid == "unpaid") {
						// if unpaid, ignore checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"

									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "'>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						);
					} else {
						// if paid, add in checked for checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"
									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "' checked>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						); // end append
					} // end else (paid)
				}; // end for

				$('.summary-main-container').append(
					"<div class='summary-total-container'>"
						+ "<div class='summary-each-diner-checkbox'>"
						+ "</div>"
						+ "<div class='summary-clickable-detailed-summary'>"
							+ "<div class='summary-each-diner-name'>TOTAL"
							+ "</div>"
							+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ grandTotal.toFixed(2) + "</div>"
						+ "</div>" // end of summary-clickable-detailed-summary
						+ "<div class='summary-each-diner-email'></div>"
						+ "<div class='summary-each-diner-sms'></div>"
					+ "</div>"
				);

				$('.summary-main-container').append(
					"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
				);


				// -----------------------------------------
				// Calculate Number of SHARES for EACH Item
				// Very Inefficient: n^3
				// -----------------------------------------

				// Loop through ALL Items
				for (var i = 0; i < itemsArr.length; i++) {
					
					var currentItemCheck = itemsArr[i];


					var currentItemCount = 0;

					// Loop through everyone's itemsArr
					for (var j = 0; j < totalFaces; j++) {
						var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr

						// Loop through EACH Item of Everyone's ItemArr
						for (var k = 0; k < retrievedPersonItemArr.length; k++) {
							//if(currentItemCheck == retrievedPersonItemArr[k]) {
							if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {
								currentItemCount++; // count++
							}
						}; // end k for-loop
					}; // end j for-loop
/*
					if(currentItemCount == 1) {
						currentItemCount = 1;
					} // end if
*/
					numberOfSharesForItemsArr[i] = currentItemCount;
				}; // end for-loop of ALL Items
			} // end of else
		} // end of loadedPage = "splittingChoice"
		else {

			// *************************
			// SPLIT UNEVENLY FOR BOTH!
			// *******************

			var grandTotal = 0;

			if (usedOCR){
				grandTotal = ocrTotalPrice;
			} else {
				//grandTotal = parseInt(g_subtotal) + parseInt(g_taxes);	
				grandTotal = parseFloat(g_subtotal) + parseFloat(g_taxes);
			}
			

			// ---------------------------
			// PRINT EVERYONE'S PRICES
			// ---------------------------

			for (var i = 0; i < totalFaces; i++) {

				// Calculate total prices
				var eachPersonTotalPrice = 0;

				var currentPersonPrices = peoplePricesArr[i];
				var currentPersonItems = peopleItemsArr[i];

				for (var z = 0; z < currentPersonPrices.length; z++) {
					eachPersonTotalPrice += currentPersonPrices[z];
				};
				var taxPercentage = 0.0;
				if (usedOCR){
					taxPercentage = ocrTaxPercentage;
				} else {
					taxPercentage = g_taxPercentage;
				}
				eachPersonTotalPrice = eachPersonTotalPrice * (1 + taxPercentage);
				
				
				// Check if this person has paid
				var hasThisPersonPaid = peoplePaidArr[i];

				if(hasThisPersonPaid == "unpaid") {
					// if unpaid, ignore checkbox
					$('.summary-main-container').append(
						"<div class='summary-each-diner-container' id='person-detailed-summary-" + (i+1) + "'>"
							+ "<div class='summary-each-diner-checkbox'>"

								+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-" + (i+1) + "'>"
							+ "</div>"
							+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-" + (i+1) + "'>"
								+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
									+ peopleNamesArr[i]
								+ "</div>"
								+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
							+ "</div>" // end of summary-clickable-detailed-summary
							+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
							+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
						+ "</div>"
					);
				} else {
					// if paid, add in checked for checkbox
					$('.summary-main-container').append(
						"<div class='summary-each-diner-container' id='person-detailed-summary-" + (i+1) + "'>"
							+ "<div class='summary-each-diner-checkbox'>"
								+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-" + (i+1) + "' checked>"
							+ "</div>"
							+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-" + (i+1) + "'>"
								+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
									+ peopleNamesArr[i]
								+ "</div>"
								+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
							+ "</div>" // end of summary-clickable-detailed-summary
							+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
							+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
						+ "</div>"
					); // end append
				} // end else (paid)
			}; // end for

			$('.summary-main-container').append(
				"<div class='summary-total-container'>"
					+ "<div class='summary-each-diner-checkbox'>"
					+ "</div>"
					+ "<div class='summary-clickable-detailed-summary'>"
						+ "<div class='summary-each-diner-name'>TOTAL"
						+ "</div>"
						+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ grandTotal + "</div>"
					+ "</div>" // end of summary-clickable-detailed-summary
					+ "<div class='summary-each-diner-email'></div>"
					+ "<div class='summary-each-diner-sms'></div>"
				+ "</div>"
			);

			$('.summary-main-container').append(
				"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
			);


			// -----------------------------------------
			// Calculate Number of SHARES for EACH Item
			// Very Inefficient: n^3
			// -----------------------------------------

			// Loop through ALL Items
			for (var i = 0; i < itemsArr.length; i++) {
				
				var currentItemCheck = itemsArr[i];
				
				var currentItemCount = 0;

				// Loop through everyone's itemsArr
				for (var j = 0; j < totalFaces; j++) {
					var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr
					// Loop through EACH Item of Everyone's ItemArr
					for (var k = 0; k < retrievedPersonItemArr.length; k++) {
						//if(currentItemCheck == retrievedPersonItemArr[k]) {
						if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {	
							currentItemCount++; // count++
						}
					}; // end k for-loop
				}; // end j for-loop

				
/*
				if(currentItemCount == 1) {
					currentItemCount = 1;
				} // end if
*/
				numberOfSharesForItemsArr[i] = currentItemCount;

			}; // end for-loop of ALL Items

		} // end of ELSE loadedPage = "SplitUnevenly"

		loadedPage = "summary";

		// Change Body CSS to White
		$("body").css('background-color', '#ffffff');
	});
});


function showDetailedSummary(personNumber) {
	//$(document).delegate("div[id^='person-detailed-summary-']", 'click touchstart' ,function(){

	$('.non-js-wrapper').load('app-detailed-summary.html', function(){
		if (hasFinishedSplitting == false){
			$('#backto-summary').attr('id', 'backto-split-unevenly-unfinished');
		}

		//alert("Detailed Summary Loaded!");
		var retrievedPersonName = peopleNamesArr[personNumber];
		var retrievedPersonPricesArr = peoplePricesArr[personNumber];
		var retrievedPersonItemsArr = peopleItemsArr[personNumber];
		var retrievedPersonItemsIndex = peopleItemsIndexArr[personNumber];

		//alert(retrievedPersonName.length);
		//alert(retrievedPersonPricesArr.length);
		//alert(retrievedPersonItemsArr.length);
		
		// ----------------------
		// Printing Face & Name
		// ----------------------	

		$('.detailed-summary-main-container').text("");
		
		$('.detailed-summary-main-container').before(
			"<div class='detailed-summary-face-name-container'>"
				+ "<img src='img/face-1.png' class='detailed-summary-face' />" + retrievedPersonName
			+ "</div>"
		);

		// -------------------------
		// PRINTING ALL ITEMS
		// -------------------------

		var eachPersonSubTotal = 0.0;


		for (var i = 0; i < retrievedPersonItemsArr.length; i++) {
			
			// Add each item's price to SubTotal
			eachPersonSubTotal += retrievedPersonPricesArr[i]

			// Get index of item using inArray()
			//var indexOfItemInItemArr = $.inArray(retrievedPersonItemsArr[i], itemsArr);
			var indexOfItemInItemArr = retrievedPersonItemsIndex[i] - 1; // Vic Edit
			//alert(indexOfItemInItemArr);
			//alert(numberOfSharesForItemsArr.join('\n'));
			//alert(numberOfSharesForItemsArr[parseInt(indexOfItemInItemArr)]);

			
			if(numberOfSharesForItemsArr[parseInt(indexOfItemInItemArr)] == 1) {

				// -------------------------------------
				// IF NO SHARERS FOR AN ITEM
				// -------------------------------------

				var outputItemName = "";

				$('.detailed-summary-main-container').append(
					"<div class='detailed-summary-each-item-container'>"
						+ "<div class='detailed-summary-each-bill-item-title'>" + (i+1) + ". " + retrievedPersonItemsArr[i]
						+ "</div>"
						+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + retrievedPersonPricesArr[i].toFixed(2) + "</div>"
						+ "<div class='detailed-summary-each-bill-item-close'></div>"
					+ "</div>"
				); // end after
			} else {
				var sharers = numberOfSharesForItemsArr[parseInt(indexOfItemInItemArr)];
				

				if (sharers == undefined){
					sharers = totalFaces;
				}



/*
				// -------------------------------------
				// IF THERE ARE SHARERS FOR AN ITEM
				// -------------------------------------
				$('.detailed-summary-main-container').append(
					"<div class='detailed-summary-each-item-container'>"
						+ "<div class='detailed-summary-each-bill-item-title'>" + (i+1) + ". " + retrievedPersonItemsArr[i]
							+ "<span class='number-of-sharers'>(1/" + totalFaces
							+ ")</span>"
						+ "</div>"
						+ "<div class='detailed-summary-each-bill-item-price'>$" + retrievedPersonPricesArr[i].toFixed(2) + "</div>"
						+ "<div class='detailed-summary-each-bill-item-close'></div>"
					+ "</div>"
				); // end after
*/

				// ****************************************************
				// JEREMY'S EDIT IS DIFFERENCE, HAS TOTALFACES INSTEAD OF SHARERS
				// *************************************************

				// -------------------------------------
				// IF THERE ARE SHARERS FOR AN ITEM
				// -------------------------------------
				$('.detailed-summary-main-container').append(
					"<div class='detailed-summary-each-item-container'>"
						+ "<div class='detailed-summary-each-bill-item-title'>" + (i+1) + ". " + retrievedPersonItemsArr[i]
							+ "<span class='number-of-sharers'>(1/" + sharers
							+ ")</span>"
						+ "</div>"
						+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + retrievedPersonPricesArr[i].toFixed(2) + "</div>"
						+ "<div class='detailed-summary-each-bill-item-close'></div>"
					+ "</div>"
				); // end after
			} // end else
		}; // end for loop

		// ---------------------
		// Printing of SUBTOTAL
		// ---------------------
		
		$('.detailed-summary-main-container').append(
			//"<div class='detailed-summary-each-item-container'>"
			"<div class='detailed-summary-total-container'>"
				+ "<div class='detailed-summary-each-bill-item-title'>SUBTOTAL</div>"
				+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + eachPersonSubTotal.toFixed(2) + "</div>"
				+ "<div class='detailed-summary-each-bill-item-close'></div>"
			+ "</div>"
		); // end after


		// --------------------------------
		// Calculate & Printing of TOTAL
		// --------------------------------

		var taxPercentage = 0.0;
		var totalPrice = 0.0;
		
		if (usedOCR){
			taxPercentage = ocrTaxPercentage;
		} else {
			taxPercentage = g_taxPercentage;
		}
		var eachPersonTotalPrice = eachPersonSubTotal * (1 + taxPercentage);


		$('.detailed-summary-main-container').append(
			//"<div class='detailed-summary-each-item-container'>"
			"<div class='detailed-summary-total-container'>"
				+ "<div class='detailed-summary-each-bill-item-title'>TOTAL</div>"
				+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + eachPersonTotalPrice.toFixed(2) + "</div>"
				+ "<div class='detailed-summary-each-bill-item-close'></div>"
			+ "</div>"
		); // end after

	}); // end non-js-wrapper
} // end showDetailedSummary








// -------------------------------
// NAVIGATIONAL BUTTONS - BACKTO!
// -------------------------------

// #backto-add-people
// #backto-add-initial
// #backto-billinputchoice
// #backto-enter-subtotal
// #backto-enter-taxes

//--From ANYWHERE == CLICK ON HOME BUTTON == PROMPT ALERT

// XIANG, CODE HERE PLEAAAZE

$(document).delegate('.home-button', 'click', function(){
	$('.non-js-wrapper').load('app-homepage.html');
	restart();
	$('.single-pot-container').hide();
})


//--From Settings == BACK TO == Homepage
$(document).delegate('#backto-homepage', 'click', function(){
	$('.non-js-wrapper').load('app-homepage.html');
	restart();
	$('.single-pot-container').hide();

	// Change Body CSS to default color
	$("body").css('background-color', '#0AB7B2');
})

//--From Enter Initial == BACK TO == Add People
$(document).delegate('#backto-add-people', 'click' ,function(){
	$('.non-js-wrapper').load('app-add-people.html', function(){
		$('.addpeople-counter').html(totalFaces);
		loadFaces();
	});
	loadedPage = "add-people";
	$('#backto-add-people').attr('id', 'backto-homepage');
	$('.header').text('ADD PEOPLE');
});

//--From Bill Input Choice == BACK TO == Enter Initial
$(document).delegate('#backto-add-initial', 'click' ,function(){
	$('.header').text('ENTER INITIALS');
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
		$('.header').text('INPUT CHOICE');
	});
	loadedPage = "billinputchoice";
	$('#backto-billinputchoice').attr('id', 'backto-add-initial');
});

//--From Enter Taxes == BACK TO == Enter Subtotal
$(document).delegate('#backto-enter-subtotal', 'click' ,function(){
	$('.header').text('ENTER SUBTOTAL');
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
		$('.header').text('ENTER TAXES');
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
					+	"<span class='currency-symbol'>" + currencySymbol + "</span><input type='text' class='textfield-bill-items' id='textfield-bill-items-'" + (i+1) +"' value='" + billprice +"'>"
				+ "</div>"
			+ "</div>"
			);	
		};

		if(newRemainingPot == 0) {
			showDoneButton();
		} 
		
		
		$('#backto-enter-bill-item').attr('id', 'backto-enter-taxes');
	});

});


//--From Summary == BACK TO == Splitting Choice
$(document).delegate('#back-from-summary', 'click' ,function(){

	//Reset everyone's items, prices and numberOfSharers
	resetBillAllocation();

	// Check "Split Evenly" or "Unevenly"
	if(didSplitEvenly) {
		
		loadedPage = "splitting-choice";  // split-evenly

		// Perform redirection
		$('.non-js-wrapper').load('app-splitting-choice.html', function(){
			loadFaces();
		});
	} else {
		// If user chose to Split Unevenly
		// Bring them back to Unevenly UI

		$('.non-js-wrapper').load('app-split-unevenly.html', function(){
			loadFaces();
			loadItems();
			$('.single-pot-container').show();
			$('#backto-homepage').attr('id', 'backto-splitting-choice');
		});
	
		loadedPage = "split-unevenly";
		didSplitEvenly = false;
	} // end else

	// Change CSS to Default
	$("body").css('background-color', '#0AB7B2');
}); // end back-from-summary


//-- Prompt Email Sent Alert
$(document).delegate('.summary-each-diner-email', 'click' ,function(){
	alert('Email Sent!');
});

//-- Prompt SMS Sent Alert
$(document).delegate('.summary-each-diner-sms', 'click' ,function(){
	alert('SMS Sent!');
});


//--From DETAILED SUMMARY == BACK TO == SUMMARY PAGE
$(document).delegate('#backto-summary', 'click touchstart' ,function(){
	
	// Perform Redirection
	$('.non-js-wrapper').load('app-summary.html', function(){
		// -------------------------------
		// SPLIT EVENLY LOGIC via OCR
		// -------------------------------
		// if user clicks on Split Evenly right away on Splitting Choice Page
		//if(loadedPage == "splitting-choice") {

		if(didSplitEvenly) {
			// SPLIT EVEN LOGIC
			// OCR Only :: Victor have to duplicate/share logic for Split Evenly 
			if(usedOCR) {
				var ocrEachPersonTotalPrice = ocrTotalPrice / totalFaces; 
				
				// ---------------------------
				// PRINT EVERYONE'S PRICES
				// ---------------------------

				for (var i = 0; i < totalFaces; i++) {

					// Check if this person has paid
					var hasThisPersonPaid = peoplePaidArr[i];

					if(hasThisPersonPaid == "unpaid") {
						// if unpaid, ignore checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"

									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "'>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrEachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						);
					} else {
						// if paid, add in checked for checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"
									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "' checked>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrEachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						); // end append
					} // end else (paid)
				}; // end for

				$('.summary-main-container').append(
					"<div class='summary-total-container'>"
						+ "<div class='summary-each-diner-checkbox'>"
						+ "</div>"
						+ "<div class='summary-clickable-detailed-summary'>"
							+ "<div class='summary-each-diner-name'>TOTAL"
							+ "</div>"
							+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ ocrTotalPrice.toFixed(2) + "</div>"
						+ "</div>" // end of summary-clickable-detailed-summary
						+ "<div class='summary-each-diner-email'></div>"
						+ "<div class='summary-each-diner-sms'></div>"
					+ "</div>"
				);

				$('.summary-main-container').append(
					"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
				);


				// -----------------------------------------
				// Calculate Number of SHARES for EACH Item
				// Very Inefficient: n^3
				// -----------------------------------------

				// Loop through ALL Items
				for (var i = 0; i < itemsArr.length; i++) {
					
					var currentItemCheck = itemsArr[i];
					var currentItemCount = 0;

					// Loop through everyone's itemsArr
					for (var j = 0; j < totalFaces; j++) {
						var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr

						// Loop through EACH Item of Everyone's ItemArr
						for (var k = 0; k < retrievedPersonItemArr.length; k++) {
							//if(currentItemCheck == retrievedPersonItemArr[k]) {
							if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {
								currentItemCount++; // count++
							}
						}; // end k for-loop
					}; // end j for-loop
/*
					if(currentItemCount == 1) {
						currentItemCount = 1;
					} // end if
*/
					numberOfSharesForItemsArr[i] = currentItemCount;
				}; // end for-loop of ALL Items
			} // end of usedOCR
			else {
				//var grandTotal = parseInt(g_subtotal) + parseInt(g_taxes);
				var grandTotal = parseFloat(g_subtotal) + parseFloat(g_taxes);
				var eachPersonTotalPrice = grandTotal / totalFaces; 
				
				// ---------------------------
				// PRINT EVERYONE'S PRICES
				// ---------------------------

				for (var i = 0; i < totalFaces; i++) {

					// Check if this person has paid
					var hasThisPersonPaid = peoplePaidArr[i];

					if(hasThisPersonPaid == "unpaid") {
						// if unpaid, ignore checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"

									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "'>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						);
					} else {
						// if paid, add in checked for checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-'" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"
									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-'" + (i+1) + "' checked>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-'" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						); // end append
					} // end else (paid)
				}; // end for

				$('.summary-main-container').append(
					"<div class='summary-total-container'>"
						+ "<div class='summary-each-diner-checkbox'>"
						+ "</div>"
						+ "<div class='summary-clickable-detailed-summary'>"
							+ "<div class='summary-each-diner-name'>TOTAL"
							+ "</div>"
							+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ grandTotal.toFixed(2) + "</div>"
						+ "</div>" // end of summary-clickable-detailed-summary
						+ "<div class='summary-each-diner-email'></div>"
						+ "<div class='summary-each-diner-sms'></div>"
					+ "</div>"
				);

				$('.summary-main-container').append(
					"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
				);


				// -----------------------------------------
				// Calculate Number of SHARES for EACH Item
				// Very Inefficient: n^3
				// -----------------------------------------

				// Loop through ALL Items
				for (var i = 0; i < itemsArr.length; i++) {
					
					var currentItemCheck = itemsArr[i];
					var currentItemCount = 0;

					// Loop through everyone's itemsArr
					for (var j = 0; j < totalFaces; j++) {
						var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr

						// Loop through EACH Item of Everyone's ItemArr
						for (var k = 0; k < retrievedPersonItemArr.length; k++) {
							//if(currentItemCheck == retrievedPersonItemArr[k]) {
							if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {
								currentItemCount++; // count++
							}
						}; // end k for-loop
					}; // end j for-loop
/*
					if(currentItemCount == 1) {
						currentItemCount = 1;
					} // end if
*/
					numberOfSharesForItemsArr[i] = currentItemCount;
				}; // end for-loop of ALL Items
			} // end of else

		} else {
				// SPLIT UNEVEN LOGIC
				
				var grandTotal = 0;

				if (usedOCR){
					grandTotal = ocrTotalPrice;
				} else {
					//grandTotal = parseInt(g_subtotal) + parseInt(g_taxes);
					grandTotal = parseFloat(g_subtotal) + parseFloat(g_taxes);	
				}
				

				// ---------------------------
				// PRINT EVERYONE'S PRICES
				// ---------------------------

				for (var i = 0; i < totalFaces; i++) {

					// Calculate total prices
					var eachPersonTotalPrice = 0;

					var currentPersonPrices = peoplePricesArr[i];
					var currentPersonItems = peopleItemsArr[i];

					for (var z = 0; z < currentPersonPrices.length; z++) {
						eachPersonTotalPrice += currentPersonPrices[z];
					};
					var taxPercentage = 0.0;
					if (usedOCR){
						taxPercentage = ocrTaxPercentage;
					} else {
						taxPercentage = g_taxPercentage;
					}
					eachPersonTotalPrice = eachPersonTotalPrice * (1 + taxPercentage);
					//alert('eachPersonTotalPrice: ' + eachPersonTotalPrice);

					
					// Check if this person has paid
					var hasThisPersonPaid = peoplePaidArr[i];

					if(hasThisPersonPaid == "unpaid") {
						// if unpaid, ignore checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"

									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-" + (i+1) + "'>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						);
					} else {
						// if paid, add in checked for checkbox
						$('.summary-main-container').append(
							"<div class='summary-each-diner-container' id='person-detailed-summary-" + (i+1) + "'>"
								+ "<div class='summary-each-diner-checkbox'>"
									+ "<input type='checkbox' onclick='togglePaidStatus(" + i + ")' id='person-checkbox-" + (i+1) + "' checked>"
								+ "</div>"
								+ "<div class='summary-clickable-detailed-summary' onclick='showDetailedSummary(" + i + ")' id='person-detailed-summary-" + (i+1) + "'>"
									+ "<div class='summary-each-diner-name' id='person-name-" + (i+1) + "'>"
										+ peopleNamesArr[i]
									+ "</div>"
									+ "<div class='summary-each-diner-total-price' id='person-total-price-"+ (i+1) + "'><span class='currency-symbol'>" + currencySymbol + "</span>"+ eachPersonTotalPrice.toFixed(2) + "</div>"
								+ "</div>" // end of summary-clickable-detailed-summary
								+ "<div class='summary-each-diner-email' id='person-email-" + (i+1) + "'>IMG</div>"
								+ "<div class='summary-each-diner-sms' id='person-sms-" + (i+1) + "'>SMS</div>"
							+ "</div>"
						); // end append
					} // end else (paid)
				}; // end for

				$('.summary-main-container').append(
					"<div class='summary-total-container'>"
						+ "<div class='summary-each-diner-checkbox'>"
						+ "</div>"
						+ "<div class='summary-clickable-detailed-summary'>"
							+ "<div class='summary-each-diner-name'>TOTAL"
							+ "</div>"
							+ "<div class='summary-each-diner-total-price'><span class='currency-symbol'>" + currencySymbol + "</span>"+ grandTotal + "</div>"
						+ "</div>" // end of summary-clickable-detailed-summary
						+ "<div class='summary-each-diner-email'></div>"
						+ "<div class='summary-each-diner-sms'></div>"
					+ "</div>"
				);

				$('.summary-main-container').append(
					"<div class='one-middle-button' id='backto-homepage' onclick=''>START AGAIN?</div>"
				);


				// -----------------------------------------
				// Calculate Number of SHARES for EACH Item
				// Very Inefficient: n^3
				// -----------------------------------------

				// Loop through ALL Items
				for (var i = 0; i < itemsArr.length; i++) {
					
					var currentItemCheck = itemsArr[i];
					var currentItemCount = 0;

					// Loop through everyone's itemsArr
					for (var j = 0; j < totalFaces; j++) {
						var retrievedPersonItemArr = peopleItemsArr[j]; // retrieve each person's itemsArr

						// Loop through EACH Item of Everyone's ItemArr
						for (var k = 0; k < retrievedPersonItemArr.length; k++) {
							//if(currentItemCheck == retrievedPersonItemArr[k]) {
							if($.trim(currentItemCheck) == $.trim(retrievedPersonItemArr[k])) {
								currentItemCount++; // count++
							}
						}; // end k for-loop
					}; // end j for-loop
/*
					if(currentItemCount == 1) {
						currentItemCount = 1;
					} // end if
*/
					numberOfSharesForItemsArr[i] = currentItemCount;
				}; // end for-loop of ALL Items





		} // end else (split-uneven logic)
		//} // end of loadedPage = "splittingChoice"
	}); // end of non-js-wrapper
}); // end of backto-summary
















// -------------------------------------
// LOGIC OF TALLY OCR SUBTOTAL & TOTAL
// -------------------------------------
$(document).delegate('.textfield-bill-items', 'change' ,function(){
	var price1 = $('#ocr-bill-item-price-1').val();
	var price2 = $('#ocr-bill-item-price-2').val();
	var price3 = $('#ocr-bill-item-price-3').val();
	
	var calculatedSubtotal = (Number(price1) + Number(price2) + Number(price3)).toFixed(2);
	$('#ocr-subtotal').val(calculatedSubtotal);
	
	var calculatedTaxes = (calculatedSubtotal * (g_taxPercentage));
	var calculatedTotal = (Number(calculatedSubtotal) + Number(calculatedTaxes)).toFixed(2);
	$('#ocr-total').val(calculatedTotal);
});

$(document).delegate('#ocr-subtotal', 'change' ,function(){
	var price1 = $('#ocr-bill-item-price-1').val();
	var price2 = $('#ocr-bill-item-price-2').val();
	var price3 = $('#ocr-bill-item-price-3').val();
	
	var calculatedSubtotal = (Number(price1) + Number(price2) + Number(price3)).toFixed(2);
	var enteredSubtotal = $('#ocr-subtotal').val();
	
	if(calculatedSubtotal != enteredSubtotal) {
		alert("Uh-oh! Subtotal does not match with bill items! Please correct the individual bill prices first");
		$('#ocr-subtotal').val(calculatedSubtotal);
	} else {
		$('#ocr-subtotal').val(calculatedSubtotal);
	}
});

$(document).delegate('#ocr-total', 'change' ,function(){
	var enteredTotal = $('#ocr-total').val();
	var price1 = $('#ocr-bill-item-price-1').val();
	var price2 = $('#ocr-bill-item-price-2').val();
	var price3 = $('#ocr-bill-item-price-3').val();
	
	var calculatedSubtotal = (Number(price1) + Number(price2) + Number(price3)).toFixed(2);
	var difference = enteredTotal - calculatedSubtotal;
	g_taxPercentage = (difference/calculatedSubtotal);
	
});




































//--From Splitting Choice Type (Unevenly or Evenly) -> Split Unevenly Page
$(document).delegate('#goto-split-unevenly', 'click' ,function(){
	$('.non-js-wrapper').load('app-split-unevenly.html', function(){
		loadFaces();
		loadItems();
		$('.single-pot-container').show();
		$('#backto-homepage').attr('id', 'backto-splitting-choice');
	});
	loadedPage = "split-unevenly";
	didSplitEvenly = false;
});



// 'touchstart touchend'
$(document).delegate("div[id^='split-unevenly-each-bill-item-container-']", 'click touchstart' ,function(){
	//$("div[class^='face-box-']").removeClass("hover_effect");
	
	if (loadedPage == "split-unevenly"){
		$("div[id^='split-unevenly-each-bill-item-container-']").removeClass("glowing");
	    
	    //$(this).toggleClass('hover_effect');
	    $(this).toggleClass('glowing');
	    anItemWasSelected = true;

		$('#split-unevenly-instruction').text('TAP ON THE FACES TO ASSIGN!');

	    //selectedItemName = $(".split-unevenly-each-bill-item-title", this).text();
	    var selectedItemListName = $(".split-unevenly-each-bill-item-title", this).text();
	    selectedItemName = selectedItemListName.substring(selectedItemListName.indexOf(".") + 1);
	    selectedItemPrice = $(".split-unevenly-each-bill-item-price", this).text();
	    
	    selectedItemIndex = selectedItemListName.substring(0,selectedItemListName.indexOf("."));
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
		$(".singleface", this).toggleClass('wiggle');
		//$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	    
	    // CHECK if your tapped face is wiggling
	    if ($(".singleface", this).hasClass('wiggle')) {
	    	
	    	/*
	    	var id = $(this).attr('id');
	    	//alert($(this).attr('id'));
			var toRemove = 'face-box-';
			var personNumber = id.replace(toRemove,'');
	    	facesWigglingArr[facesWigglingArr.length] = personNumber;
	    	*/

	    	facesAreWiggling = true;	
	    	$('#split-status').text("ASSIGN!");
	    	$('#split-status').attr('id', 'assignToSelectedPeople');
	    
	    }

	    // RECHECK if any faces are wiggling
	    if ($(".singleface", $("div[id^='face-box-']")).hasClass('wiggle') == false){
	    	facesAreWiggling = false;
	    	$('#assignToSelectedPeople').attr('id', 'split-status');
	    	$('#split-status').text("SPLIT THE REST");
	    }	    
	}

	if (loadedPage == "split-unevenly" && facesAreWiggling == false){
		var id = $(this).attr('id');
		//alert($(this).attr('id'));
		var toRemove = 'face-box-';
		var personNumber = id.replace(toRemove,'');
		showDetailedSummaryUnfinished(parseInt(personNumber) - 1);

		hasFinishedSplitting = false;
	}
});






//--From Manual Bill Input Item Page -> Splitting Choice Type (Unevenly or Evenly)
$(document).delegate('#backto-splitting-choice', 'click' ,function(){
	$('.non-js-wrapper').load('app-splitting-choice.html', function(){
		loadFaces();
		$('.single-pot-container').hide();
		if (usedOCR == false){
			$('#backto-splitting-choice').attr('id', 'backto-enter-ocr-results');
			loadedPage = "splitting-choice-no-ocr";	
		} else {
			$('#backto-splitting-choice').attr('id', 'backto-enter-bill-item');
			loadedPage = "splitting-choice";
		}
		
	});
	
});


$(document).delegate("#assignToSelectedPeople", 'click touchstart' ,function(){
	
	var containers = $("div[id^='face-box-']");
	//alert(containers.length);

	// Get List of Wiggly Faces
	var listOfWiggles = new Array();
	for (var i = 0; i < containers.length; i++){
		tempContainer = containers.eq(i);
		if ($(".singleface", tempContainer).hasClass("wiggle")){
			var id = tempContainer.attr('id');
	    	/*alert(id);*/
			var toRemove = 'face-box-';
			var personNumber = id.replace(toRemove,'');

			listOfWiggles[listOfWiggles.length] = personNumber;
		}
	}

	//alert(listOfWiggles.join('\n'));
	assignItem(listOfWiggles);


	$(".singleface", $("div[id^='face-box-']")).removeClass("wiggle");
	facesAreWiggling = false;

	$('#assignToSelectedPeople').attr('id', 'split-status');

	if (remainingItemsArr.length == 0){
    	$('#split-status').text("FINISH!");
    	$('#split-unevenly-instruction').text('TAP FINISH TO CONTINUE!');
    	$('#split-status').attr('id', 'goto-summary');
    } else {
    	$('#split-status').text("SPLIT THE REST");
    }
});


$(document).delegate("#split-status", 'click touchstart' ,function(){
	splitTheRest();

	if (remainingItemsArr.length == 0){
    	$('#split-status').text("FINISH!");
    	$('#split-unevenly-instruction').text('TAP FINISH TO CONTINUE!');
    	$('#split-status').attr('id', 'goto-summary');
    } else {
    	$('#split-status').text("SPLIT THE REST");
    }
});


function assignItem(listOfWiggles){
	//$(this).toggleClass('hover_effect');
	//$(".singleface", this).toggleClass('wiggle');
	/*alert("ok!");*/
	//alert(listOfWiggles.length + " people assigned!");
    for(var i = 0; i < listOfWiggles.length; i++){

    	var personNumber = listOfWiggles[i];

		var currentPersonPrices = peoplePricesArr[parseInt(personNumber) - 1];
		var currentPersonItems = peopleItemsArr[parseInt(personNumber) - 1];
		var currentPersonItemsIndex = peopleItemsIndexArr[parseInt(personNumber) - 1];

		toRemove = '$';
		selectedItemPrice = selectedItemPrice.replace(toRemove,'');

		/* Jeremy's Plasters */
		// Future: use charAt(0);

			toRemove = '£';
			selectedItemPrice = selectedItemPrice.replace(toRemove,'');

			toRemove = '€';
			selectedItemPrice = selectedItemPrice.replace(toRemove,'');

		/* End of Jeremy's Plasters */

		// Prices must reflect the split among the number of people
		var assignedPrice = parseFloat(selectedItemPrice) / listOfWiggles.length;

		currentPersonPrices[currentPersonPrices.length] = assignedPrice;
		currentPersonItems[currentPersonItems.length] = selectedItemName;
		currentPersonItemsIndex[currentPersonItemsIndex.length] = selectedItemIndex;

		// UPDATE THE SINGLE PERSON'S TOTAL POT
		var newTotal = 0;
		for(var j=0; j < currentPersonPrices.length; j++){
    		newTotal += currentPersonPrices[j]
		}
		
		peoplePricesPotArr[parseInt(personNumber) - 1] = newTotal.toFixed(2);
		updateSinglePot(newTotal.toFixed(2), personNumber);

    }

    numberOfSharesForItemsArr[selectedItemIndex - 1] = listOfWiggles.length;
    var indexToSplice = remainingItemsIndex.indexOf(parseInt(selectedItemIndex));
    
    remainingItemsIndex.splice(indexToSplice, 1);
	remainingItemsArr.splice(indexToSplice, 1);
	remainingPricesArr.splice(indexToSplice, 1);

	var targetToRemove = $('#split-unevenly-each-bill-item-container-' + selectedItemIndex);
	targetToRemove.hide('slow', function(){ targetToRemove.remove(); });
	anItemWasSelected = false;

	$('#split-unevenly-instruction').text('TAP AN ITEM TO START');
}


function splitTheRest(){
	// For every person
	for(var i = 0; i < totalFaces; i++){
		var personNumber = i + 1;

		var currentPersonPrices = peoplePricesArr[personNumber - 1];
		var currentPersonItems = peopleItemsArr[personNumber - 1];
		var currentPersonItemsIndex = peopleItemsIndexArr[personNumber - 1];
		
		// For every remaining item
		for (var j = 0; j < remainingItemsArr.length; j++) {
			selectedItemName = remainingItemsArr[j];
			selectedItemPrice = remainingPricesArr[j];


			var assignedPrice = parseFloat(selectedItemPrice) / totalFaces;

			currentPersonPrices[currentPersonPrices.length] = assignedPrice;
			currentPersonItems[currentPersonItems.length] = selectedItemName;

			// ** BUGGY!
			// Assign the Actual Item Index after Split the Rest
			//currentPersonItemsIndex[currentPersonItemsIndex.length] = something;
			
			

			// Check position in ItemArr
		}
		
		// Update new pot
		var newTotal = 0;
		for(var k = 0; k < currentPersonPrices.length; k++){
    		newTotal += currentPersonPrices[k]
		}
		
		updateSinglePot(newTotal.toFixed(2), personNumber);


	}

	// Remove from Table
	
	for (var m = 0; m < remainingItemsArr.length; m++) {
		var sharingIndex = remainingItemsIndex[m];
		numberOfSharesForItemsArr[sharingIndex - 1] = totalFaces;

		/*
		remainingItemsIndex.splice(indexToSplice, 1);
		remainingItemsArr.splice(indexToSplice, 1);
		remainingPricesArr.splice(indexToSplice, 1);

		var targetToRemove = $('#split-unevenly-each-bill-item-container-' + selectedItemIndex);
		targetToRemove.hide('slow', function(){ targetToRemove.remove(); });
		*/
	}
	
	// REMOVE REMAINING FROM TABLE
	remainingItemsIndex = new Array();
	remainingItemsArr = new Array();
	remainingPricesArr = new Array();

	var targetToRemove = $("div[id^='split-unevenly-each-bill-item-container-']");
	//var targetToRemove = $('#split-unevenly-each-bill-item-container-' + selectedItemIndex);
	targetToRemove.hide('slow', function(){ targetToRemove.remove(); });
    //$(this).find("input").prop('disabled', false);
    //$(this).find("input").focus();
    anItemWasSelected = false;
    $('#split-unevenly-instruction').text("TAP 'FINISH' TO CONTINUE");

}




//--From Detailed Summary == BACK TO == Split Unevenly
$(document).delegate('#backto-split-unevenly-unfinished', 'click' ,function(){
	$('.non-js-wrapper').load('app-split-unevenly.html', function(){
		loadFaces();
		loadItems();
		$('.single-pot-container').show();
		$('#backto-homepage').attr('id', 'backto-splitting-choice');
		if (remainingItemsArr.length == 0){
	    	$('#split-status').text("FINISH!");
	    	$('#split-unevenly-instruction').text('TAP FINISH TO CONTINUE!');
	    	$('#split-status').attr('id', 'goto-summary');
	    } else {
	    	$('#split-status').text("SPLIT THE REST");
	    }
	});
	loadedPage = "split-unevenly";
});

function togglePaidStatus(personArrayIndex) {
	var currentPaymentStatus = peoplePaidArr[personArrayIndex];

	if(currentPaymentStatus == "unpaid") {
		peoplePaidArr[personArrayIndex] = "paid";
	} else {
		peoplePaidArr[personArrayIndex] = "unpaid";
	} // end else
} // end togglePaidStatus


function resetBillAllocation() {
	// Loop through everyone
	for (var i = 0; i < totalFaces ; i++) {
		peopleItemsArr[i].length = 0; //reset all items allocated to this person
		peoplePricesArr[i].length = 0; //reset all prices allocated to this person for each item
		peoplePaidArr[i] = "unpaid"; //reset all payment status
		peoplePricesPotArr[i] = 0.0;
	}; // end for

	// Loop through each item and set the number of shares to zero.
	for (var j = 0; j < itemsArr.length; j++) {
		numberOfSharesForItemsArr[j] = 0;
	}

} // end of resetBillAllocation





function showDetailedSummaryUnfinished(personNumber) {
	//$(document).delegate("div[id^='person-detailed-summary-']", 'click touchstart' ,function(){

	$('.non-js-wrapper').load('app-detailed-summary-unfinished.html', function(){
		if (hasFinishedSplitting == false){
			$('#backto-summary').attr('id', 'backto-split-unevenly-unfinished');
		}

		var retrievedPersonName = peopleNamesArr[personNumber];
		var retrievedPersonPricesArr = peoplePricesArr[personNumber];
		var retrievedPersonItemsArr = peopleItemsArr[personNumber];
		var retrievedPersonItemsIndex = peopleItemsIndexArr[personNumber];
		
		// ----------------------
		// Printing Face & Name
		// ----------------------	

		$('.detailed-summary-main-container').text("");
		
		$('.detailed-summary-main-container').before(
			"<div class='detailed-summary-face-name-container'>"
				+ "<img src='img/face-1.png' class='detailed-summary-face' />" + retrievedPersonName
			+ "</div>"
		);

		// -------------------------
		// PRINTING ALL ITEMS
		// -------------------------
		

		for (var i = 0; i < retrievedPersonItemsArr.length; i++) {

			// Get index of item using inArray()
			//var indexOfItemInItemArr = $.inArray(retrievedPersonItemsArr[i], itemsArr);
			var indexOfItemInItemArr = retrievedPersonItemsIndex[i] - 1;
			if(numberOfSharesForItemsArr[parseInt(indexOfItemInItemArr)] == 1) {
				// -------------------------------------
				// IF NO SHARERS FOR AN ITEM
				// -------------------------------------

				var outputItemName = "";

				$('.detailed-summary-main-container').append(
					"<div class='detailed-summary-each-item-container'>"
						+ "<div class='detailed-summary-each-bill-item-title'>" + (i+1) + ". " + retrievedPersonItemsArr[i]
						+ "</div>"
						+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + retrievedPersonPricesArr[i].toFixed(2) + "</div>"
						+ "<div class='detailed-summary-each-bill-item-close'><img src='img/close-icon.png' id='close-item-" + (i+1) + "' /></div>"
					+ "</div>"
				); // end after
			} else {
				// -------------------------------------
				// IF THERE ARE SHARERS FOR AN ITEM
				// -------------------------------------
				var sharers = numberOfSharesForItemsArr[parseInt(indexOfItemInItemArr)];
				if (sharers == undefined){
					sharers = totalFaces;
				}

				$('.detailed-summary-main-container').append(
					"<div class='detailed-summary-each-item-container'>"
						+ "<div class='detailed-summary-each-bill-item-title'>" + (i+1) + ". " + retrievedPersonItemsArr[i]
							+ "<span class='number-of-sharers'>(1/" + sharers
							+ ")</span>"
						+ "</div>"
						+ "<div class='detailed-summary-each-bill-item-price'><span class='currency-symbol'>" + currencySymbol + "</span>" + retrievedPersonPricesArr[i].toFixed(2) + "</div>"
						+ "<div class='detailed-summary-each-bill-item-close'><img src='img/close-icon.png' id='close-item-" + (i+1) + "' /></div>"
					+ "</div>"
				); // end after
			} // end else
		}; // end for loop
	}); // end non-js-wrapper
} // end showDetailedSummary









// ---------------
// MISC FUNCTIONS!
// ---------------

function loadDefaultCurrency() {
	currencyChoose = "sgd-currency";
	currencySymbol = "$";
}


function restart() {
	/* Reset Everything */
	g_subtotal = 0;
	g_taxes = 0;
	g_taxPercentage = 0.0;
	totalFaces = 2;
	loadedPage = 'homepage';

	usedOCR = false;
	didSplitEvenly = true;
	didAssignItem = false;

	peopleNamesArr = new Array();
	peopleItemsArr = new Array();
	peopleItemsIndexArr = new Array();
	peoplePaidArr = new Array();
	peoplePricesArr = new Array();
	peoplePricesPotArr = new Array();

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

	person1ItemsIndexArr = new Array();;
	person2ItemsIndexArr = new Array();;
	person3ItemsIndexArr = new Array();;
	person4ItemsIndexArr = new Array();;
	person5ItemsIndexArr = new Array();;
	person6ItemsIndexArr = new Array();;


	itemsArr = new Array();
	pricesArr = new Array();
	numberOfSharesForItemsArr = new Array();

	remainingItemsIndex = new Array();
	remainingItemsArr = new Array();
	remainingPricesArr = new Array();
	selectedItemIndex = -1;
	selectedItemPrice = "";
	selectedItemName = "";
	anItemWasSelected = false;
	facesAreWiggling = false;
	facesWigglingArr = new Array();
	hasFinishedSplitting = false;

	/* Moving Forward */
	peopleItemsArr[0] = person1ItemsArr;
	peopleItemsArr[1] = person2ItemsArr;
	peopleItemsArr[2] = person3ItemsArr;
	peopleItemsArr[3] = person4ItemsArr;
	peopleItemsArr[4] = person5ItemsArr;
	peopleItemsArr[5] = person6ItemsArr;

	peopleItemsIndexArr[0] = person1ItemsIndexArr;
	peopleItemsIndexArr[1] = person2ItemsIndexArr;
	peopleItemsIndexArr[2] = person3ItemsIndexArr;
	peopleItemsIndexArr[3] = person4ItemsIndexArr;
	peopleItemsIndexArr[4] = person5ItemsIndexArr;
	peopleItemsIndexArr[5] = person6ItemsIndexArr;

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

	peoplePaidArr[0] = "unpaid";
	peoplePaidArr[1] = "unpaid";
	peoplePaidArr[2] = "unpaid";
	peoplePaidArr[3] = "unpaid";
	peoplePaidArr[4] = "unpaid";
	peoplePaidArr[5] = "unpaid";

	// Change Body CSS to default color
	$("body").css('background-color', '#0AB7B2');
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
		$("#remaining-pot-1").text(peoplePricesPotArr[0]);
		for (var i = 2; i <= count; i++){
			$('.face-container').append(					
				"<div class='face-box' id='face-box-"+ i +"'>"
				+ "<input type='text' class='initials' value='"+ peopleNamesArr[i-1] +"' maxlength='6' disabled='true' onblur='updateName(" + i + ", this.value)'></input>"
				+ "<br/>"
				+ "<div class='singleface'>"
					+ "<img src='img/face-3.png' class='face' id='cartoonface-" + i + "'>"
				+ "</div>"
				+ "<div class='single-pot-container'>"
					+ "<span class='currency-symbol'>" + currencySymbol + "</span><span id='remaining-pot-" + i + "'>" + peoplePricesPotArr[i-1] + "</span>"
				+ "</div>"
				+ "</div>"
			);
		}
	}
}

function loadItems(){
	//var skipIndex = parseInt(selectedItemIndex) - 1;
	remainingItemsIndex = new Array();
	remainingItemsArr = new Array();
	remainingPricesArr = new Array();
	//remainingPricesArr = pricesArr;
	for (var i = 0; i < itemsArr.length; i++) {
		
		if (numberOfSharesForItemsArr[i] == 0){
			billitem = itemsArr[i];
			billprice = pricesArr[i];

			$('.split-unevenly-container').append (
			"<div class='split-unevenly-each-bill-item-container' id='split-unevenly-each-bill-item-container-" + (i+1) + "'>"
				+ "<div class='split-unevenly-each-bill-item-title' id='split-unevenly-each-bill-item-title-" +  (i+1) + "'>"
					+ (i+1) + ". " + billitem
					+ "</div>"
				+ "<div class='split-unevenly-each-bill-item-price'>"
					+ "<span class='currency-symbol'>" + currencySymbol + "</span>" + billprice
				+ "</div>"
			+ "</div>"
			);	

			remainingItemsIndex[remainingItemsIndex.length] = (i+1);
			remainingItemsArr[remainingItemsArr.length] = billitem; 
			remainingPricesArr[remainingPricesArr.length] = billprice;
		}
	}

}
