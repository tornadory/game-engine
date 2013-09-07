define(['engine/components/Network/SocketNetworkDriver', 'socket.io', 'node-uuid'], function(SocketNetworkDriver, io, UUID) {
    var NetworkServer = SocketNetworkDriver.extend({
        _classId: 'NetworkServer',

        _clientSockets: {},
        _io: null,
        _sockets: null,

        init: function() {
            SocketNetworkDriver.prototype.init.call(this);
            this._io = io;
        },

        _addClient: function(socket) {
            this._clientSockets[socket.id] = {
                socket: socket,
                pendingCallback: {}
            };
        },

        _removeClient: function(socket) {
            delete this._clientSockets[socket.id];
        },


        _onMessage: function(socket, smessage) {
            var message = this._deserialize(smessage);
            return this.onMessage(socket, message);
        },

        _sendMessage: function(message, callback, socketId) {
            //check if callback is neded
            if(undefined != callback) {
                message['callback_pending'] = true;
                this._clientSockets[socketId]['pendingCallback'][message.id] = callback;
            }

            var sMessage = this._serialize(message);
            this._clientSockets[socketId].socket.send(sMessage);

            return this;
        },

        listen: function(port) {
            var self = this;

            this._sockets = this._io.listen(port);

            this._sockets.on('connection', function(socket){
                    self.onConnection(socket);
                });

            return this;
        },

        onConnection: function(socket) {
            var self = this;
            this._addClient(socket);

            socket.on('disconnect', function(){
                self.onDisconnect(socket);
            });

            socket.on('message', function(message, callback){
                self._onMessage(socket, message, callback);
            });
        },


        onDisconnect: function(socket) {
            this._removeClient(socket);
        },

        /**
         *
         * @param socket {id}
         * @param message {id, type, data, is_callback || callback_pending}
         * @returns {*}
         */
        onMessage: function(socket, message) {
            //Client response
            if(true == message.is_callback) {
                if( ! message.id ||
                    ! this._clientSockets[socket.id] ||
                    ! this._clientSockets[socket.id]['pendingCallback'] ||
                    ! this._clientSockets[socket.id]['pendingCallback'][message.id]) {

                    this.log('Invalid callback; socket: [' + socket.id +'], message: [' + JSON.stringify(message) + ']');
                    return false; //Invalid callback
                }

                //Call callback
                this._clientSockets[socket.id]['pendingCallback'][message.id](message.data, socket.id, message.id);

                //Remove callback
                delete this._clientSockets[socket.id]['pendingCallback'][message.id];

                return this;
            }

            //Client request
            if(undefined == this._messageTypes[message.type]) {
                this.log('Invalid message type; socket: [' + socket.id +'], message: [' + JSON.stringify(message) + ']');
                return false;
            }

            try {
                var response = this.callDefinedMessage(message.type, {message: message, socketId: socket.id});

                if(true === message.callback_pending) {
                    //Send response to client
                    this._sendMessage({
                            id: message.id,
                            data: response,
                            is_callback: true
                        },
                        undefined
                        , socket.id);
                }
            } catch (Exc) {
                this.log(Exc.message + '; socket: [' + socket.id +'], message: [' + JSON.stringify(message) + ']');
            }

            return this;
        },

        /**
         * Send message to given socketIds
         * @param type - on of the defineMessageType
         * @param data - data to send to sockets
         * @param callback - run this callback on each client response
         * @param socketIds - undefined|array|string undefined - all clients, array list of sockets, string - a single client
         * @returns string - message ID
         */
        sendMessage: function(type, data, callback, socketIds) {
            //Prepare message
            var message = {
                id: UUID.v4(),
                type: type,
                data: data,
                timestamp: new Date().getTime()
            };

            //Broadcast to all
            if(!socketIds) {
                for(var socketId in this._clientSockets) {
                    this._sendMessage(message, callback, socketId);
                }
            }

            //Send to spesific clients
            if(socketIds instanceof Array) {
                for(var i in clientIds) {
                    this._sendMessage(message, callback, socketIds[i]);
                }
            }

            //Send to 1 client
            this._sendMessage(message, callback, socketIds);

            return message.id;
        }
    });

//    if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NetworkServer; }

    return NetworkServer;
});