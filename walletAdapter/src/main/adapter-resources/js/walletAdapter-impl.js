function getCards() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getCards'
	};


	return WL.Server.invokeHttp(input);
}

function getLimit() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getLimit'
	};


	return WL.Server.invokeHttp(input);
}

function getMessages() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getMessages'
	};


	return WL.Server.invokeHttp(input);
}

function getCardTransactions(cardId) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getCardTransactions/' + cardId
	};


	return WL.Server.invokeHttp(input);
}

function setLimit(limit) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/setLimit'
	};


	return WL.Server.invokeHttp(input);
}


