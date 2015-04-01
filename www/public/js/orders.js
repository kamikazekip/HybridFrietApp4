// Een groep aanmaken
$(document).on('tap','.group-button-place-order', function() {
	newOrder($(this));
	return false;
})

$(document).on('tap','#group-button-order', function() {
	$.mobile.changePage("#page-newOrder", {transition : "slideup"});
	return false;
})

// Inloggen
$(document).on('tap','#orderDoneButton', function() {
	console.log(globalSelectedOrder);
	$.ajax( {
		url : globalServerUrl + '/orders/'+globalSelectedOrder,
		dataType : 'json',
		type : "Put",
		beforeSend : function(xhr) {
	          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
	          //var base64 = Crypto.util.bytesToBase64(bytes);
	          xhr.setRequestHeader("Authorization", globalAuthheader);
		 	$.mobile.loading('show');
		},
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		error : function(xhr, ajaxOptions, thrownError) {
			if (thrownError === "Unauthorized"){
				console.log('unauthorized');
			}
			else{
				console.log('Something went wrong');
			}
			
		},
		success : function(model) {
			$("body").find("[data-id='" + globalSelectedOrder + "']").removeClass('group-btn-order-active');
			navigator.notification.vibrate(2000);
			 history.back();
		}
	});
	return false;
})

// Een bestelling bekijken.
$(document).on('tap','.group-btn-order', function() {	
	var title = $(this).html();
	var orderId = $(this).data("id");
	if($(this).hasClass('group-btn-order-active')){
		$('#orderPlaatsenInputFields').show();
		$('#orderDoneButton').show();
	}
	else{
		$('#orderDoneButton').hide();
		$('#orderPlaatsenInputFields').hide();
	}
	if(orderId !== globalSelectedOrder){
		$('#order-table-orders tbody').empty();
		globalSelectedOrder = orderId;
		$("#order-title-name").html(title);
		//Groeps informatie ophalen
		
		$.ajax( {
			url : globalServerUrl + '/orders/'+globalSelectedOrder+'/dishes',
			dataType : 'json',
			type : "get",
			beforeSend : function(xhr) {
		          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
		          //var base64 = Crypto.util.bytesToBase64(bytes);
		          xhr.setRequestHeader("Authorization", globalAuthheader);
			 	$.mobile.loading('show');
			},
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			error : function(xhr, ajaxOptions, thrownError) {
				if (thrownError === "Unauthorized"){
					console.log('unauthorized');
				}
				else{
					console.log('Something went wrong');
				}
				
			},
			success : function(model) {
				orders = model;
				for(i = 0; i < orders.length; i++) {
					$('#order-table-orders tbody').append('<tr><td>'+orders[i].creator +'</td><td>'+orders[i].dish+'</td></tr>');
				}
			}
		});
	}
	else{
		console.log("Bestellling was al geopend");
	}
	
	$.mobile.changePage("#page-order", {transition : "slide"});	
	return false;
})


function newOrder(taper){
	var snackBarNaam = taper.data("snackbarnaam");
	var snackBarWeb = taper.data("snackbarweb");
	var postData = {
			snackbar : snackBarNaam,
			url : snackBarWeb
		

	}

	var r = confirm("Nieuwe bestelling halen ?");
	if (r == true) {
	    $.ajax( {
			url : globalServerUrl + '/groups/'+globalSelectedGroup+"/order",
			dataType : 'json',
			data : postData,
			type : "Post",
			beforeSend : function(xhr) {
		          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
		          //var base64 = Crypto.util.bytesToBase64(bytes);
		          xhr.setRequestHeader("Authorization", globalAuthheader);
			 	$.mobile.loading('show');
			},
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			error : function(xhr, ajaxOptions, thrownError) {
				if (thrownError === "Unauthorized"){
					console.log('unauthorized');
				}
				else{
					console.log('Something went wrong');
				}
				
			},
			success : function(model) {
				$('#group-list-orders').append('<button class="ui-btn  group-btn-order group-btn-order-active" data-id="'+model.order._id+'">'+ readAbleDate(model.order.date) +' - '+ model.order.creator+'</button>');	
				$.mobile.changePage("#page-group", {transition : "slideup"});
			}
		});
	} 
}


// Load orders die bij een groep horen.
function loadOrders(){

}



// Het juiste gerecht krijgen
function getDish(dishId){
	for(x = 0; x < dishes.length; x++) {
		if(dishes[x].id === dishId)
		{
			return dishes[x];

		}
	}
}



function getOrders(groupId){
	var returnArray = [];
	for(i = 0; i < orders.length; i++) {
		if(orders[i].groups_id === groupId){
			returnArray.push(orders[i]);
		}
	}
	return returnArray;

}

function getOrder(orderId){
	for(i = 0; i < orders.length; i++) {
		if(orders[i].id === orderId)
		{
			return orders[i];
		}
	}
	return false;
}

// Functie om de bestellins inhoud in te laden uit de json array orderDetails
function getOrderDetails(orderId){
	var returnArray = [];
	for(i = 0; i < orderDetails.length; i++) {
		if(orderDetails[i].orders_id === orderId){
			returnArray.push(orderDetails[i]);
		}
	}
	return returnArray;
}

function placeOrder(){
	$('.popupOrderProducts-product').each(function(i, obj) {
		    orderDetails.push(
		    	{"dishes_id": $(obj).data("dishid"), "orders_id" : 2, "username" : getUsername()}
			);
			var gerecht = getDish($(obj).data("dishid"));
			$('#order-table-orders tbody').append('<tr><td>'+localStorage.getItem("gebruikersnaam") +'</td><td>'+gerecht.name+'</td></tr>');
		});

}