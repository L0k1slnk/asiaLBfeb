module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'index.css': 'src/styles/index.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')(),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'index.css'
            }
        },
        concat: {
            scripts: {
                files: {
                    'main.js': [
                        'src/scripts/vendor/modernizr.min.js',
                        'src/scripts/vendor/detectizr.min.js',
                        'src/scripts/vendor/parallax.min.js',
                        'src/scripts/main.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    'main.min.js': ['main.js']
                }
            }
        },
        watch: {
            styles: {
                files: ['src/styles/**/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['src/scripts/**/*.js'],
                tasks: ['concat']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('@lodder/grunt-postcss');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask("default", ["newer:sass", "newer:concat", "newer:postcss", "watch"]);
    grunt.registerTask("all", ["sass", "concat", "postcss"]);
    grunt.registerTask("dist", ["uglify"]);

};