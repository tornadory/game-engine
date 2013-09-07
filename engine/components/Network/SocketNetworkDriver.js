//http://www.joezimjs.com/javascript/plugging-into-socket-io-advanced/
//http://stackoverflow.com/questions/8467784/sending-a-message-to-a-client-via-its-socket-id
define(['engine/core/Entity', 'engine/core/Exception'/*, 'bson'*/], function(Entity, Exception/*, bson*/) {
    var SocketNetworkDriver = Entity.extend({
        _classId: 'SocketNetworkDriver',
        _messageTypes: {},

        init: function() {
            Entity.prototype.init.call(this);
        },

        defineMessageType: function(name, callback) {
            this._messageTypes[name] = callback;
            return this;
        },

        callDefinedMessage: function(name, params) {
            if(undefined == this._messageTypes[name]) {
                throw new Exception('Socket: undefined message type is used')
            }

            return this._messageTypes[name](params);
        },

        _serialize: function(message) {
            /*if(engine.isServer) {
                return bson.BSONPure.BSON.serialize(message, false, true, false);
            }

            if(!engine.isServer) {
                return bson.BSON.serialize(message, false, true, false);
            }*/

            return JSON.stringify(message);
        },

        _deserialize: function(smessage) {
           /* if(engine.isServer) {
                return bson.BSONPure.BSON.deserialize(smessage);
            }

            if(!engine.isServer) {
                return bson.BSON.deserialize(smessage);
            }*/

            return JSON.parse(smessage, true);
        }
    });

//  if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SocketNetworkDriver; }
    return SocketNetworkDriver;
});