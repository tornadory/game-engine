Entity = require('./core/Entity');

var Core = Entity.extend({
	_classId: 'Core',

	init: function(ctx)
	{
		this._register = [];
		this._ctx = ctx;
		this.isServer = (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined');
		engine = this;

		Entity.prototype.init.call(this);
	},

	/**
	 * Set rate in MH
	 * setRequestAnimationFrame(22) results in 22 iterations per second
	 */
	setRequestAnimationFrame: function(rate){
		if(rate === undefined) {
			return false;
		}

		if(this.isServer) {
			requestAnimFrame = function(callback, element){
				setTimeout(function () { callback(new Date().getTime()); }, 1000 / rate);
			};
		} else {
			window.requestAnimFrame = function(callback, element){
				setTimeout(function () { callback(new Date().getTime()); }, 1000 / rate);
			};
		}
	},

	/**
	 * Register an entity
	 * Late can be find using find()
	 */
	register: function(entity) {
		this.unRegister(entity);
		this._register[entity.id()]  = entity;
		return this;
	},

	/**
	 * Unregister an entity
	 */
	unRegister: function(entity) {
		this._register.pull(entity.id());
		return this;
	},

	getEntityById: function( entityId ) {
		return this._register[entity.id()];
	},

	//TODO: Get entity by id

	//TODO: Get entities by group

	/**
	 * Set class by classId
	 */
	registerClass: function (classId, obj) {
		ClassRegister[classId] = obj;
	},

	/**
	 * Get class by classId
	 */
	getRegisteredClass: function (classId) {
		return ClassRegister[classId];
	},

	/**
	 * Get a new instance of a registeted class by it's id
	 */
	getRegisteredClassNewInstance: function (classId, options) {
		return new ClassRegister[classId](options);
	},

	start: function(callback) {
		this.engineStep(new Date().getTime(), this._ctx)

		if(this.isServer) {
			this.setRequestAnimationFrame(22);
		}

		if(!this.isServer) {
			//A list of recent server updates we interpolate across
			//This is the buffer that is the driving factor for our networking
            this.server_updates = [];
		}

		// Fire callback
		if (typeof(callback) === 'function') {
			callback(true);
		}

	},

	engineStep: function (timeStamp, ctx) {
		//schedule the next update
		this.updateid = requestAnimationFrame(engine.engineStep.bind(this), ctx);

		// Update the engine + its childrens
		this.updateSceneGraph();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Core; }