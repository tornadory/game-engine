define(['socket.io', 'node-uuid'], function   (io, UUID) {
    var NetworkClient = {
        _classId: 'NetworkClient',

        _pendingCallback: {},
        _io: io,
        _socket: null,

        _latency: 0,
        _roundTrip: 0,

        connect: function(address) {
            this._socket = io.connect(address);

            var self = this;
            this._socket.on('connect', function(socket){
                self.emit('connect');

                self._socket.on('message', self._onMessage.bind(self));
                self._socket.on('disconnect', self.onDisconnect.bind(self));
                self.onConnect();
            });

            return this;
        },

        _onMessage: function(smessage) {
            var message = this._deserialize(smessage);
            return this.onMessage(message);
        },

        _sendMessage: function(message, callback) {
            //check if callback is needed
            if(undefined != callback) {
                message['callback_pending'] = true;
                this._pendingCallback[message.id] = callback;
            }

            var sMessage = this._serialize(message);
            this._socket.send(sMessage);

            return this;
        },

        /**
         * Get/Set latency
         * @param val
         * @returns this|latency in MS
         */
        latency: function(val) {
            if(undefined === val) {
                return this._latency || 0;
            }

            this._latency = val;

            return this;
        },

        /**
         * Get/Set round trip
         * @param val
         * @returns this|round trip in MS
         */
        roundTrip: function(val) {
            if(undefined === val) {
                return this._roundTrip || 0;
            }

            this._roundTrip = val;

            return this;
        },

        /**
         * Called when a connection is made
         */
        onConnect: function() {
            if(this._pingPongTimeSyncInterval) {
                this.startPingPongTimeSync();
            }
        },

        /**
         *
         * @param message {id, type, data, is_callback || callback_pending}
         * @returns {*}
         */
        onMessage: function(message) {
            //Server response
            if(true == message.is_callback) {
                if( ! message.id ||
                    ! this._pendingCallback ||
                    ! this._pendingCallback[message.id]) {

                    this.log('Invalid callback; socket: message: [' + JSON.stringify(message) + ']');
                    return false; //Invalid callback
                }

                //Call callback
                this._pendingCallback[message.id](message.data, message.sent_uptime/*, message.processed_uptime*/, message.id);

                //Remove callback
                delete this._pendingCallback[message.id];

                return this;
            }

            //Server request
            try {
                //var processedUptime = engine.getUptime();
                var response = this.callDefinedMessage(message.type, message.data, message.sent_uptime, message.id);

                if(true === message.callback_pending) {
                    //Send response to client
                    this._sendMessage({
                        id: message.id,
                        data: response,
                        sent_uptime: message.sent_uptime,
                        //processed_uptime: processedUptime,
                        is_callback: true
                    });
                }
            } catch (Exc) {
                this.log(Exc.message + '; message: [' + JSON.stringify(message) + ']');
            }

            return this;
        },

        onDisconnect: function() {
            if(this._pingPongTimeSyncInterval) {
                clearInterval(this._pingPongTimeSyncTimer);
            }
        },

        sendMessage: function(type, data, callback) {
            //Prepare message
            var message = {
                id: UUID.v4(),
                type: type,
                data: data,
                sent_uptime: engine.getUptime()
            };

            this._sendMessage(message, callback);

            return message.id;
        }
    };

//    if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = NetworkClient; }

    return NetworkClient;
});