var $ = require('jquery')
require('jquery-mousewheel')($)

var defaults = {
	container: '.slide-container',
	slide: '.slide',
	slideTime: 1000,
	active: 0
}

function Slider(options) {
	var opts = this.opts = $.extend({}, defaults, options)
	var $el = this.$el = $(opts.container)
	var slides = this.slides = this.$el.children(opts.slide)

	var active = this.active = opts.active
	slides.slice(0, active).addClass('slide-up')
	slides.eq(active).addClass('slide-active')
	slides.slice(active + 1).addClass('slide-down')
	this.enableScroll()
	this.enableNavBar()
}

Slider.prototype.enableScroll = function () {
	var self = this
	var slideTime = this.opts.slideTime

	this.$el.mousewheel(function (e) {
		if (self.sliding) return

		var isUp = e.deltaY > 0
		var prev = self.active
		var next = isUp ? prev - 1 : prev + 1
		if (next < 0) return
		if (next >= self.slides.length) return

		var currentSlide = self.slides.eq(prev)
		var nextSlide = self.slides.eq(next)

		self.sliding = true
		self.active = next

		currentSlide
			.addClass('slide-out')
			.addClass(isUp ? 'slide-down' : 'slide-up')
			.removeClass('slide-active')
		nextSlide
			.addClass('slide-in')
			.removeClass(isUp ? 'slide-up' : 'slide-down')
			.addClass('slide-active')

		setTimeout(function () {
			self.sliding = false
			currentSlide.removeClass('slide-out')
			nextSlide.removeClass('slide-in')

			self.navs.eq(prev).removeClass('slide-nav-active')
			self.navs.eq(next).addClass('slide-nav-active')
		}, slideTime)
	})
}

Slider.prototype.enableNavBar = function () {
	var total = this.slides.length
	var $bar = $('<ul class="slide-nav-bar"></ul>')
	for (var i = 0; i < total; i++) {
		$bar.append('<li class="slide-nav"></li>')
	}

	$bar.appendTo(this.$el)

	var navs = this.navs = $bar.find('li')
	navs.eq(this.active).addClass('slide-nav-active')
}

module.exports = Slider