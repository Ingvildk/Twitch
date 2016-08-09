module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'create-windows-installer': {
  		appDirectory: '..\\out\\Twitch-win32',
 		  outputDirectory: '..\\output\\',
  		authors: 'GRODT',
  		exe: 'Twitch.exe',
      iconUrl: 'https://raw.githubusercontent.com/atom/atom/master/resources/win/atom.ico'
    }
  });

  

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-electron-installer');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);

};