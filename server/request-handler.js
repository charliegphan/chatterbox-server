// import { start } from "repl";

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/plain'
};

var messageCount = 1;

var messages = [{
  username: 'Charlie',
  text: 'Do my bidding!',
  objectId: messageCount,
}];

var sendResponse = (statusCode, response, data) => {
  response.writeHead(statusCode, headers);
  data ? response.end(JSON.stringify(data)) : response.end();
};

var collectData = (request, callback) => {
  var body = '';
  request.on('data', chunk => {
    body += chunk;
  });

  request.on('end', () => {
    callback( JSON.parse(body) );
  });
};

var actions = {
  'GET': function(request, response) {
    var body = { results: messages };
    sendResponse(200, response, body);
  },
  'POST': function (request, response) {
    collectData(request, (message) => {
      messages.unshift(message);
      message.objectId = ++messageCount;
      sendResponse(201, response);
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(200, response);
  }
};

var requestHandler = function(request, response) {
  if (request.url === '/classes/messages' && actions[request.method]) {
    actions[request.method](request, response);
  } else {
    sendResponse(404, response);
  }
};

exports.requestHandler = requestHandler;

