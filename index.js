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

return Slider
})