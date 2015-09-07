require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('jquery')
require('jquery-mousewheel')($)

var defaults = {
	container: '.slide-container',
	slide: '.slide',
	slideTime: 1000,
	active: 0,
	scrollNav: true,
	keyNav: true,
	navBar: true,

	classSlideIn: 'slide-in',
	classSlideOut: 'slide-out',
	classSlideUp: 'slide-up',
	classSlideDown: 'slide-down',
	classSlideActive: 'slide-active',

	classSlideNavBar: 'slide-nav-bar',
	classSlideNav: 'slide-nav',
	classSlideNavActive: 'slide-nav-active'
}

function Slider(options) {
	var opts = this.opts = $.extend({}, defaults, options)
	var $el = this.$el = $(opts.container)
	var slides = this.slides = this.$el.children(opts.slide)

	var active = this.active = opts.active
	slides.slice(0, active).addClass(opts.classSlideUp)
	slides.eq(active).addClass(opts.classSlideActive)
	slides.slice(active + 1).addClass(opts.classSlideDown)

	if (opts.scrollNav) this.enableScrollNav()
	if (opts.keyNav) this.enableKeyNav()
	if (opts.navBar) this.enableNavBar()
}

Slider.prototype.enableScrollNav = function () {
	var self = this
	this.$el.mousewheel(function (e) {
		var isUp = e.deltaY > 0
		self.nav(isUp)
	})
}

var KEY_UP = 38
var KEY_DOWN = 40

Slider.prototype.enableKeyNav = function () {
	var self = this
	$(document).keydown(function (e) {
		if (e.which === KEY_UP) {
			self.nav(true)
		} else if (e.which === KEY_DOWN) {
			self.nav(false)
		}
	})
}

Slider.prototype.nav = function (isUp) {
	var opts = this.opts
	var self = this
	var slideTime = this.opts.slideTime

	if (self.sliding) return

	var prev = self.active
	var next = isUp ? prev - 1 : prev + 1
	if (next < 0) return
	if (next >= self.slides.length) return

	var currentSlide = self.slides.eq(prev)
	var nextSlide = self.slides.eq(next)

	self.sliding = true
	self.active = next

	var classSlideIn = opts.classSlideIn
	var classSlideOut = opts.classSlideOut
	var classSlideUp = opts.classSlideUp
	var classSlideDown = opts.classSlideDown
	var classSlideActive = opts.classSlideActive
	var classSlideNavActive = opts.classSlideNavActive

	currentSlide
		.addClass(classSlideOut)
		.addClass(isUp ? classSlideDown : classSlideUp)
		.removeClass(classSlideActive)
	nextSlide
		.addClass(classSlideIn)
		.removeClass(isUp ? classSlideUp : classSlideDown)
		.addClass(classSlideActive)

	setTimeout(function () {
		self.sliding = false
		currentSlide.removeClass(classSlideOut)
		nextSlide.removeClass(classSlideIn)

		self.navs.eq(prev).removeClass(classSlideNavActive)
		self.navs.eq(next).addClass(classSlideNavActive)
	}, slideTime)
}

Slider.prototype.enableNavBar = function () {
	var opts = this.opts
	var total = this.slides.length
	var $bar = $('<ul class="' + opts.classSlideNavBar + '"></ul>')
	for (var i = 0; i < total; i++) {
		$bar.append('<li class="' + opts.classSlideNav + '"></li>')
	}

	$bar.appendTo(this.$el)

	var navs = this.navs = $bar.find('li')
	navs.eq(this.active).addClass(opts.classSlideNavActive)
}

module.exports = Slider
},{"jquery":"jquery","jquery-mousewheel":2}],2:[function(require,module,exports){
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

},{}],3:[function(require,module,exports){
var Slider = require('../')
new Slider()
},{"../":1}],"jquery":[function(require,module,exports){
if (!window.jQuery) {
	throw new Error('require jQuery')
}
module.exports = window.jQuery
},{}]},{},[3]);
