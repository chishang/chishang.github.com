var _eventTarget = function (that) {
        var registry = {};
        that.fire = function (event, arg) {
            var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
            var args;
            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i += 1) {
                    handler = array[i];
                    func = handler.method;
                    if (typeof func === 'string') {
                        func = this[func];
                    }
                    if (!handler.parameters && arg) {
                        args = [arg];
                    }
                    if (handler.parameters && !arg) {
                        args = handler.parameters;
                    }
                    if (handler.parameters && arg) {
                        args = handler.parameters.concat([arg]);
                    }
                    func.apply(this, args || [event]);
                }
            }
            return this;
        };

        that.on = function (type, method, parameters) {
            var handler = {
                method:method,
                parameters:parameters
            };
            if (registry.hasOwnProperty(type)) {
                registry[type].push(handler);
            } else {
                registry[type] = [handler];
            }
            return this;

        };
        return that;
    };
