var globalAuthheader = "";

$(document).on('click','#register-btn-register', function() {	
	handleRegister();	
})

// De login pagina laden
$(document).on('pagebeforeshow','#page-login', function() {
	if(checkLogin()){
		$.mobile.changePage("#page-main", {transition : "slideup"});
	}
});




// Functie om te controleren of een gebruike  is ingelogd
// Dit wordt gedaan op basis van localStorage variable 'gebruikersnaam'
// Deze wordt geset bij login, en geunset bij logout
function checkLogin(){
	var gebruikersnaam = localStorage.getItem("gebruikersnaam");
	if(gebruikersnaam === null  || globalAuthheader === null){
		return false;
	}
	else if( gebruikersnaam.length>0 || globalAuthheader.length>0){
		getAuthHeader();
		return true;
		
	}
	else{
		return false;
	}
}




function handleRegister(){
	var inputUserName = $('#register-text-gebruikersnaam').val();
	var inputPassword = $('#register-text-wachtwoord').val();
	var inputPassword2 = $('#register-text-wachtwoord2').val();
	if(inputUserName === "" || inputPassword === "" || inputPassword2 === ""){
		alert("voer alle velden");
	}
	else if(inputPassword !== inputPassword2){
		alert('wachtwoorden komen niet overeen');
	}
	else{
		postData = {
			username : inputUserName,
			password : inputPassword
		}
		$.ajax( {
			url : globalServerUrl + '/users',
			dataType : 'json',
			data : postData,
			type : "Post",
			error : function(xhr, ajaxOptions, thrownError) {
				if (thrownError === "Unauthorized"){
					console.log('unauthorized');
				}
				else{
					console.log('Something went wrong : '+thrownError);
				}
				// Fout weergeven op login scherm
				$('#login-errors').html("Invalid login !");
				$('#login-text-gebruikersnaam').val("");
				$('#login-text-wachtwoord').val("");
			},
			success : function(model) {
			  $.mobile.changePage("#page-login", {transition : "slideup"});;
			}
		});
	}	
}

function login(){
	if($('#login-text-gebruikersnaam').val() == "" || $('#login-text-wachtwoord').val() == "")
	{
		alert("Voer alle velden in");
	}
	else
	{
		var inputUserName = $('#login-text-gebruikersnaam').val();
		var inputPassword = $('#login-text-wachtwoord').val();

		// Auth header is nodig bij het zenden van requests.
		// Deze wordt gegenereerd uit het username en password
		var authHeader = "Basic " + $.base64.encode(inputUserName + ":" + inputPassword);
		
		// 
		$.ajax( {
			url : globalServerUrl + '/login',
			dataType : 'json',
			type : "Post",
			beforeSend : function(xhr) {
		          //var bytes = Crypto.charenc.Binary.stringToBytes(inputUserName + ":" + inputPassword);
		          //var base64 = Crypto.util.bytesToBase64(bytes);
		          xhr.setRequestHeader("Authorization", authHeader);
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
			  	// Auth header opslaan in local storage, deze moet gebruikt worden bij requests
			  	setAuthHeader(authHeader);
			  	
			  	loadGroups();
			  	//gebruikersnaam opslaan voor weergaven
			  	localStorage.setItem("gebruikersnaam", $('#login-text-gebruikersnaam').val());
			  	$.mobile.changePage("#page-main", {transition : "slideup"});
			  	clearMessages();
			  	$('#login-text-gebruikersnaam').val("");
				$('#login-text-wachtwoord').val("");

			}
		});
    }	
}

function logout(){
	localStorage.clear();
	globalGroupsLoaded = false;

	selectedGroup = 0;
	$.mobile.changePage("#page-login", {transition : "slideup"});
}

 function getUsername(){
 	var username = "";
 	username = localStorage.getItem("gebruikersnaam");
 	return username;
 }

 function getAuthHeader(){
 	var scopeAuthHeader = "";
 	scopeAuthHeader = localStorage.getItem("authHeader");
 	globalAuthheader = scopeAuthHeader;
 	return scopeAuthHeader;
 }

function setAuthHeader(auth){
	var newAuthheader = 'authHeader' + auth;
	localStorage.setItem('authHeader' , newAuthheader);
	globalAuthheader =newAuthheader;
}