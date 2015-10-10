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

var defaults = {
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
	classSlideNavActive: 'slide-nav-active'
}

function Slider(options) {
	var opts = this.opts = $.extend({}, defaults, options)
	var $el = this.$el = $(opts.container)
	var slides = this.slides = this.$el.children(opts.slide)
	var total = this.total = this.slides.length

	// no slide
	if (total === 0) return

	var active = opts.active

	// check active
	if (active < 0) {
		active = 0
	} else if (active >= total) {
		active = total - 1
	}

	this.active = active

	// init all slides' state class
	slides.slice(0, active).addClass(opts.classSlidePrev)
	slides.eq(active).addClass(opts.classSlideActive)
	slides.slice(active + 1).addClass(opts.classSlideNext)

	// enable nav functions on demand
	if (opts.scrollNav) this.enableScrollNav()
	if (opts.keyNav) this.enableKeyNav()
	if (opts.navBar) this.enableNavBar()
}

Slider.prototype.prev = function () {
	this.nav(this.active - 1)
}

Slider.prototype.next = function () {
	this.nav(this.active + 1)
}

/*
 * nav to the 'target' slide with given index
 * @param {number} target
 */
Slider.prototype.nav = function (target) {
	if (this.sliding ||
		typeof target !== 'number' ||
		target < 0 || target === this.active || target >= this.total) {
		return
	}

	var opts = this.opts
	var self = this
	var slideTime = this.opts.slideTime

	var current = self.active
	var isUp = target < current

	// current - between - target
	var currentSlide = self.slides.eq(current)
	var betweenSlides = isUp ? self.slides.slice(target, current) : self.slides.slice(current, target)
	var targetSlide = self.slides.eq(target)

	self.sliding = true
	self.active = target

	var classSlideIn = opts.classSlideIn
	var classSlideOut = opts.classSlideOut
	var classSlidePrev = opts.classSlidePrev
	var classSlideNext = opts.classSlideNext
	var classSlideActive = opts.classSlideActive
	var classSlideNavActive = opts.classSlideNavActive

	currentSlide
		.addClass(classSlideOut)
		.addClass(isUp ? classSlideNext : classSlidePrev)
		.removeClass(classSlideActive)
	betweenSlides
		.removeClass(isUp ? classSlidePrev : classSlideNext)
		.addClass(isUp ? classSlideNext : classSlidePrev)
	targetSlide
		.addClass(classSlideIn)
		.removeClass(isUp ? classSlidePrev : classSlideNext)
		.addClass(classSlideActive)

	if (self.navs) {
		self.navs.eq(current).removeClass(classSlideNavActive)
		self.navs.eq(target).addClass(classSlideNavActive)
	}

	setTimeout(function () {
		self.sliding = false
		currentSlide.removeClass(classSlideOut)
		targetSlide.removeClass(classSlideIn)
	}, slideTime)
}


Slider.prototype.enableScrollNav = function () {
	var self = this
	this.$el.mousewheel(function (e) {
		var isUp = e.deltaY > 0
		if (isUp) {
			self.prev()
		} else {
			self.next()
		}
	})
}

var KEY_LEFT = 37
var KEY_UP = 38
var KEY_RIGHT = 39
var KEY_DOWN = 40

Slider.prototype.enableKeyNav = function () {
	var self = this
	$(document).keydown(function (e) {
		if (e.which === KEY_UP || e.which === KEY_LEFT) {
			self.prev()
		} else if (e.which === KEY_DOWN || e.which === KEY_RIGHT) {
			self.next()
		}
	})
}

Slider.prototype.enableNavBar = function () {
	var opts = this.opts
	var total = this.total
	var $bar = $('<ul class="' + opts.classSlideNavBar + '"></ul>')
	for (var i = 0; i < total; i++) {
		$bar.append('<li class="' + opts.classSlideNav + '" data-index=' + i + '></li>')
	}

	$bar.appendTo(this.$el)

	var navs = this.navs = $bar.find('li')
	navs.eq(this.active).addClass(opts.classSlideNavActive)

	var self = this
	$bar.on('click', 'li', function (e) {
		var index = e.currentTarget.getAttribute('data-index')
		self.nav(parseInt(index, 10))
	})
}

return Slider
})