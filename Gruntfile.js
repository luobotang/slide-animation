module.exports = function (grunt) {

	grunt.initConfig({
		browserify: {
			options: {
				alias: {
					'jquery': './jquery.js'
				}
			},
			test: {
				src: 'test/index.js',
				dest: 'test/index.bundle.js'
			}
		},
		less: {
			test: {
				src: 'test/index.less',
				dest: 'test/index.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-less')

	grunt.registerTask('default', ['browserify', 'less'])
}