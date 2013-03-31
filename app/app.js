
/**
 * Module dependencies.
 */

var express = require('express'), 
    socket  = require('socket.io');
    path    = require('path');


var Application = function() {
    this.initialize();
}

Application.prototype = {
  
    webapp: null, // express application
    io: null, // socket.io server


    _defaults: {
        port: process.env.PORT || 8888
    },

    initialize: function() {
        var options = arguments[0] || {};

        // merge defaults
        for (var k in this._defaults) {
          this[k] = options[k] || this._defaults[k];
        }

        this._init('webapp');
        this._init('io');

    },

    register: function(path) {
        console.log('registering path: ' + path)

        var self = this;

        this.io.sockets.on('connection', function(socket){
            
            socket.on(path + '_accel', function(data) {
                self.io.sockets.emit(path + '_accel_listen', data);
            });

            socket.on(path + '_gyro', function(data) {
                self.io.sockets.emit(path + '_gyro_listen', data);
            });
        });

        this.webapp.get('/' + path, function(request, response){
            if( !/iphone/gi.test(request.header('user-agent')) ) {
                response.send('this endpoint should be accessed on an iphone');
                return;
            }

            // serve it up.
            response.render('client', { 
                path: path, 
                port: self.port, 
                socket: (self.port + 1) 
            });

        });
    },

    _init: function(module) {
        this[module] = this['_init_' + module]()
    },

    _init_webapp: function() {
        var app     = express(),
            self    = this;

        app.configure(function(){
            app.set('port', self.port);
            app.set('views', __dirname + '/views');
            app.set('view engine', 'ejs');
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(app.router);
            app.use(express.static(path.join(__dirname, 'public')));
        });

        // the default route...
        app.get('/', function (request, response) {
            // if the request is made with an iphone -- that's not right!
            if( /iphone/gi.test(request.header('user-agent')) ) {
                response.send('access this enpoint on your desktop to recieve an app endpoint.');
                return;
            }

            // the path for an iphone to connect on...
            var path = 'test';

            // add the listener for socket.io and the path for express
            self.register(path);

            // serve it up.
            response.render('index', { 
                path: path, 
                port: self.port, 
                socket: (self.port + 1) 
            });
        });

        app.listen(app.get('port'), function(){
            console.log('webapp started on port: '+ app.get('port'));
        });

        return app;
    },

    _init_io: function() {
        return require('socket.io').listen((this.port + 1));
    }

}

// boom.
new Application();