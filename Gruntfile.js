module.exports = function (grunt) {

	grunt.initConfig({
		browserify: {
			options: {
				alias: {
					'jquery': './lib/jquery.min.js'
				}
			},
			1: {
				src: '1/index.js',
				dest: '1/index.bundle.js'
			}
		},
		less: {
			1: {
				src: '1/index.less',
				dest: '1/index.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-less')

	grunt.registerTask('default', ['browserify', 'less'])
}