// Een groep aanmaken
$(document).on('click','#group-button-place-order', function() {
	newOrder();
})

$(document).on('click','#group-button-order', function() {
	$.mobile.changePage("#page-newOrder", {transition : "slideup"});
})

// Inloggen
$(document).on('click','#orderDoneButton', function() {
	console.log(globalSelectedOrder);
	$.ajax( {
		url : globalServerUrl + '/orders/'+globalSelectedOrder,
		dataType : 'json',
		type : "Put",
		beforeSend : function(xhr) {
	          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
	          //var base64 = Crypto.util.bytesToBase64(bytes);
	          xhr.setRequestHeader("Authorization", globalAuthheader);
		},
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
			 history.back();
		}
	});
})

// Een bestelling bekijken.
$(document).on('click','.group-btn-order', function() {	
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
			},
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
})


function newOrder(){
	var r = confirm("Nieuwe bestelling halen ?");
	if (r == true) {
	    $.ajax( {
			url : globalServerUrl + '/groups/'+globalSelectedGroup+"/order",
			dataType : 'json',
			type : "Post",
			beforeSend : function(xhr) {
		          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
		          //var base64 = Crypto.util.bytesToBase64(bytes);
		          xhr.setRequestHeader("Authorization", globalAuthheader);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				if (thrownError === "Unauthorized"){
					console.log('unauthorized');
				}
				else{
					console.log('Something went wrong');
				}
				// Fout weergeven op login scherm
				$('.message-error').html("Invalid login !");
				$('#login-text-gebruikersnaam').val("");
				$('#login-text-wachtwoord').val("");
				clearMessages();
				
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