am.build = (function(prefix, enter, transform, undefined) {
	"use strict";

	function hackStyle(elm) {
		getComputedStyle(elm[0], null).display;
	}

	function doTransition(elm, initial, target, transition, cb) {
		// hack: access style to apply transition
		hackStyle(elm);

		if (target) {
			elm.addClass(target);
		}

		elm.addClass(transition);

		if (initial) {
			elm.removeClass(initial);
		}
		elm.one(prefix.TRANSITION_END_EVENT, function() {
			elm.removeClass(transition);
			cb && cb();
		});
	}

	return function(elm, type, param) {
		var s, run, initial;

		//console.log('animation start ' + initial);

		if (type === 'enter') {
			return function(cb) {
				s = enter(param);
				elm.addClass(s.initial);
				doTransition(elm, s.initial, null, s.transition, function() {
					//console.log('animation end ' + initial);
					cb && cb();
				});
			};
		} else if (type === 'transform') {
			return function(cb) {
				s = transform(param);
				doTransition(elm, null, s.target, s.transition, function() {
					//console.log('animation end ' + initial);
					cb && cb();
				});
			};
		} else { // only animate for now
			return function(cb) {

				hackStyle(elm);

				var initial = param + ' animated';

				elm
					.addClass(initial)
					.one(prefix.ANIMATION_END_EVENT, function() {
						//console.log('animation end : ' + initial);
						elm.removeClass(initial);
						cb && cb();
					});
			};
		}
	};

})(am.prefix, am.enter, am.transform);