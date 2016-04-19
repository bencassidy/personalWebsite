var hapi = require('hapi');
var inert = require('inert');
var nodemon = require('nodemon');

var server = new hapi.Server();
server.connection({ port: 80 });

server.start( function (body) {
    console.log('Server running at:', server.info.uri);
    console.log(body);
});

server.register(inert, function (err) {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./public/index.html');
        }
    });

    server.route({
        method: 'POST',
        path: '/contact_me.php',
        handler: function (request, reply) {
            reply.file('./contact_me.php');
        }
    });

    server.route({
        method: 'GET',
        path: '/{filename*}',
        handler: function (request, reply) {
            reply.file('./public/' + request.params.filename);
        }
    });
});
