define('BigCache', function BigCache() {
    'use strict';

    return function BigCacheConstructor(name, splitSize) {
        return {
            cache: nlapiGetCache(name),

            put: function put(key, data, ttl) {
                var step = splitSize || 100000;
                var actual = 0;
                var totalLength = data.length;

                while (step * actual < totalLength) {
                    this.cache.put(
                        key + actual,
                        data.substring(step * actual, Math.min(totalLength, step * (actual + 1))),
                        ttl
                    );

                    actual++;
                }
            },
            get: function get(key) {
                var i = 0;
                var data = '';
                var d = this.cache.get(key + i++);

                while (d) {
                    data += d;
                    d = this.cache.get(key + i++);
                }

                return data;
            },

            remove: function remove(key) {
                var i = 0;

                while (this.cache.get(key + i)) {
                    this.cache.remove(key + i++);
                }
            }
        };
    };
});
