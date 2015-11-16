var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.titan_gantry/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      static: {
        files: [
          {
            expand: true,
            src: '**',
            dest: './',
            cwd: 'static/'
          }
        ],
      },
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    clean: ['pa', modPath],
    // copy files from PA, transform, and put into mod
    proc: {
      unit_list: {
        src: [
          'pa_ex1/units/unit_list.json',
        ],
        cwd: media,
        dest: 'pa/units/unit_list.json',
        process: function(spec) {
          spec.units.push('/pa/units/land/titan_gantry/titan_gantry.json')
          return spec
        }
      },
      titan_gantry: {
        src: [
          'pa_ex1/units/land/vehicle_factory_adv/vehicle_factory_adv.json',
        ],
        cwd: media,
        dest: 'pa/units/land/titan_gantry/titan_gantry.json',
        process: function(spec) {
          spec.display_name = 'Titan Gantry'
          spec.description = 'Advanced manufacturing- Builds most titans.'
          spec.si_name = 'metal_storage_adv'
          spec.buildable_types = "Mobile & Titan"
          spec.placement_size = [60, 100]
          spec.unit_types = spec.unit_types.filter(function(type) {
            return type != 'UNITTYPE_Tank'
          })
          spec.unit_types.push('UNITTYPE_FabAdvBuild')
          spec.tools[0].spec_id = '/pa/units/land/titan_gantry/titan_gantry_tool_build_arm.json'
          return spec
        }
      },
      build_arm: {
        src: [
          'pa_ex1/units/land/vehicle_factory_adv/vehicle_factory_adv_build_arm.json',
        ],
        cwd: media,
        dest: 'pa/units/land/titan_gantry/titan_gantry_tool_build_arm.json',
        process: function(spec) {
          spec.construction_demand.energy = 3000
          spec.construction_demand.metal = 300
          return spec
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:static', 'copy:mod']);

};

