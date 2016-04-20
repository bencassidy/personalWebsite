var hapi = require('hapi');
var inert = require('inert');
var nodemon = require('nodemon');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://ben.cassidy11%40gmail.com:APPPASSWORD@smtp.gmail.com');

var server = new hapi.Server();
server.connection({ port: 80 });

server.start( function () {
    console.log('Server running at:', server.info.uri);
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
        path: '/mail',
        handler: function (request, reply) {
            var mailOptions = {
                from: request.payload.email, // sender address
                to: 'ben.cassidy11@gmail.com', // list of receivers
                subject: 'Email from bencassidy.com', // Subject line
                text: 'From: ' +request.payload.email + '\n\n' +
                      'Name: ' + request.payload.name + '\n\n' +
                      'Message: ' + request.payload.message
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            reply("Success");
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
