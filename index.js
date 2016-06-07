(function (factory) {
	
	if (typeof exports !== 'undefined') {
		var $ = require('jquery')
		require('jquery-mousewheel')($)
		module.exports = factory($)
	} else if (window.jQuery && window.jQuery.fn.mousewheel) {
		window.Slider = factory(window.jQuery)
	} else {
		throw new Error('require jQuery, jQuery-mousewheel')
	}

})(function ($) {

	var KEY_LEFT = 37
	var KEY_UP = 38
	var KEY_RIGHT = 39
	var KEY_DOWN = 40

	var defaultOptions = {
		container: '.slide-container',
		slide: '.slide',
		slideTime: 1000,
		active: 0, // index start from 0
		scrollNav: true,
		keyNav: true,
		navBar: true,

		classSlideIn: 'slide-in',
		classSlideOut: 'slide-out',
		classSlidePrev: 'slide-up',
		classSlideNext: 'slide-down',
		classSlideActive: 'slide-active',

		classSlideNavBar: 'slide-nav-bar',
		classSlideNav: 'slide-nav',
		classSlideNavActive: 'slide-nav-active',

		autoNav: false,
		autoNavInterval: 5000,
		autoNavPauseOnMouseenter: false
	}

	function EventEmitter() {
		this._eventCallbacks = {}
	}

	$.extend(EventEmitter.prototype, {

		on: function (event, callback) {
			if (typeof callback === 'function') {
				this._eventCallbacks[event] = this._eventCallbacks[event] || []
				this._eventCallbacks[event].push(callback)
			}
		},

		off: function (event, callback) {
			var callbacks = this._eventCallbacks[event]
			if (callbacks) {
				var i = 0
				var _callback
				while ((_callback = callbacks[i])) {
					if (_callback === callback) {
						callbacks.splice(i, 1)
					} else {
						i++
					}
				}
			}
		},

		trigger: function (event, args) {
			var callbacks = this._eventCallbacks[event]
			if (callbacks) {
				var i = 0
				var _callback
				while ((_callback = callbacks[i++])) {
					_callback.call(null, args)
				}
			}
		}
	})

	function Slider(options) {
		options = this.options = $.extend({}, defaultOptions, options)
		this.$el = $(options.container)
		this.initialize(options)
	}

	$.extend(Slider.prototype, {

		initialize: function (options) {
			var slides = this.slides = this.$el.find(options.slide)
			var total = this.total = this.slides.length

			this._event = new EventEmitter()

			// no slide
			if (total > 0) {

				var active = options.active

				// check active
				if (active < 0) {
					active = 0
				} else if (active >= total) {
					active = total - 1
				}

				this.active = active

				// init all slides' state class
				slides.slice(0, active).addClass(options.classSlidePrev)
				slides.eq(active).addClass(options.classSlideActive)
				slides.slice(active + 1).addClass(options.classSlideNext)

				// enable nav functions on demand
				if (options.scrollNav) {
					this.enableScrollNav()
				}
				if (options.keyNav) {
					this.enableKeyNav()
				}
				if (options.navBar) {
					this.enableNavBar()
				}
				if (options.autoNav) {
					this.enableAutoNav()
				}
			} else {
				// do nothing
			}
		},

		prev: function () {
			this.nav(this.active - 1)
		},

		next: function () {
			this.nav(this.active + 1)
		},

		/*
		 * nav to the 'target' slide with given index
		 * @param {number} target
		 */
		nav: function (target) {
			if (this.sliding || typeof target !== 'number' ||
				target < 0 || target === this.active || target >= this.total) {
				return false
			}

			var current = this.active
			var isUp = target < current

			this.trigger('beforeSlide', {
				current: current,
				target: target
			})

			/*
			 * e.g. direction: next to prev
			 *
			 * currnt state:
			 * - currentSlide.SlideActive
			 * - betweenSlides.SlideNext
			 * - targetSlide.SlideNext
			 *
			 * =>
			 *
			 * animation start:
			 * - currentSlide.SlidePrev.SlideOut
			 * - betweenSlides.SlidePrev
			 * - targetSlide.SlideActive.SlideIn
			 *
			 * =>
			 *
			 * animation stop:
			 * - currentSlide.SlidePrev
			 * - betweenSlides.SlidePrev
			 * - targetSlide.SlideActive
			 */

			var $currentSlide = this.slides.eq(current)
			var $betweenSlides = isUp ?
				this.slides.slice(target, current) :
				this.slides.slice(current, target)
			var $targetSlide = this.slides.eq(target)

			this.sliding = true
			this.active = target

			var options = this.options

			$currentSlide
				.addClass(options.classSlideOut)
				.addClass(isUp ? options.classSlideNext : options.classSlidePrev)
				.removeClass(options.classSlideActive)
			$betweenSlides
				.removeClass(isUp ? options.classSlidePrev : options.classSlideNext)
				.addClass(isUp ? options.classSlideNext : options.classSlidePrev)
			$targetSlide
				.addClass(options.classSlideIn)
				.removeClass(isUp ? options.classSlidePrev : options.classSlideNext)
				.addClass(options.classSlideActive)

			if (this.navs) {
				this.navs.eq(current).removeClass(options.classSlideNavActive)
				this.navs.eq(target).addClass(options.classSlideNavActive)
			}

			setTimeout($.proxy(function () {
				this.sliding = false
				$currentSlide.removeClass(options.classSlideOut)
				$targetSlide.removeClass(options.classSlideIn)

				this.trigger('slide', {
					from: current,
					current: target
				})
			}, this), options.slideTime)
		},


		enableScrollNav: function () {
			this.$el.mousewheel($.proxy(function (e) {
				var isUp = e.deltaY > 0
				if (isUp) {
					this.prev()
				} else {
					this.next()
				}
			}, this))
		},

		enableKeyNav: function () {
			$(document).keydown($.proxy(function (e) {
				if (e.which === KEY_UP || e.which === KEY_LEFT) {
					this.prev()
				} else if (e.which === KEY_DOWN || e.which === KEY_RIGHT) {
					this.next()
				}
			}, this))
		},

		enableNavBar: function () {
			var options = this.options
			var total = this.total
			var $bar = $('<ul class="' + options.classSlideNavBar + '"></ul>')
			for (var i = 0; i < total; i++) {
				$bar.append('<li class="' + options.classSlideNav + '" data-index=' + i + '></li>')
			}

			$bar.appendTo(this.$el)

			var navs = this.navs = $bar.find('li')
			navs.eq(this.active).addClass(options.classSlideNavActive)

			$bar.on('click', 'li', $.proxy(function (e) {
				var index = e.currentTarget.getAttribute('data-index')
				this.nav(parseInt(index, 10))
			}, this))
		},

		enableAutoNav: function () {
			this.startAutoNav()
			if (this.options.autoNavPauseOnMouseenter) {
				this.$el.on('hover', $.proxy(function () {
					this.stopAutoNav()
				}, this), $.proxy(function () {
					this.startAutoNav()
				}, this))
			}
		},

		startAutoNav: function () {
			if (this._autoNavTimer) {
				return
			} else {
				var interval = Math.max(this.options.autoNavInterval, this.options.slideTime)
				this._autoNavTimer = setInterval($.proxy(function () {
					this.nav(this.active + 1 >= this.total ? 0 : this.active + 1)
				}, this), interval)
			}
		},

		stopAutoNav: function () {
			if (this._autoNavTimer) {
				clearInterval(this._autoNavTimer)
				this._autoNavTimer = null
			} else {
				// do nothing
			}
		},

		/* event api */

		trigger: function (event, args) {
			this._event.trigger(event, args)
		},

		on: function (event, callback) {
			this._event.on(event, callback)
		},

		off: function (event, callback) {
			this._event.off(event, callback)
		}
	})

	return Slider
})