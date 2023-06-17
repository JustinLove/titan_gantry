var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.titan_gantry/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

var titan_cost = 30000
var build_power = 500
var energy_rate = 20
var construction_demand = {
  metal: build_power,
  energy: build_power * energy_rate
}

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
          spec.unit_name = 'Titan Gantry'
          spec.description = 'Advanced manufacturing- Builds most titans.'
          spec.build_metal_cost = 15000
          spec.unit_types = spec.unit_types.filter(function(type) {
            return type != 'UNITTYPE_Tank'
          })
          spec.unit_types.push('UNITTYPE_FabAdvBuild')
          spec.spawn_layers= "WL_AnyHorizontalGroundOrWaterSurface"

          spec.buildable_types = "Mobile & Titan & Custom58"
          spec.tools[0].spec_id = '/pa/units/land/titan_gantry/titan_gantry_tool_build_arm.json'
          spec.storage = {
            "energy": titan_cost / construction_demand.metal * construction_demand.energy,
            "metal": titan_cost
          }

          var scale = 2.5
          spec.model = {
            "filename": "/pa/units/land/titan_gantry/titan_gantry.papa",
            "animations": {
              "idle": "/pa/units/land/titan_gantry/titan_gantry_anim_build.papa",
              "build_start": "/pa/units/land/titan_gantry/titan_gantry_anim_start.papa",
              "build_loop": "/pa/units/land/titan_gantry/titan_gantry_anim_build.papa",
              "build_end": "/pa/units/land/titan_gantry/titan_gantry_anim_end.papa"
            },
            "animtree": "/pa/anim/anim_trees/factory_anim_tree.json",
            "skirt_decal": "/pa/units/land/titan_gantry/skirt_02.json"
          }
          spec.events.died.effect_scale = spec.events.died.effect_scale * scale
          spec.selection_icon.diameter = spec.selection_icon.diameter * scale
          var stretch = function(array) {
            for (var i in array) {array[i] = array[i] * scale}
          }
          stretch(spec.mesh_bounds)
          stretch(spec.placement_size)
          spec.area_build_separation = spec.area_build_separation * scale
          spec.TEMP_texelinfo = spec.TEMP_texelinfo * scale
          spec.lamps.forEach(function(lamp) {
            stretch(lamp.offset)
            lamp.radius = lamp.radius * scale
          })
          var hl = spec.headlights
          stretch(hl.offset)
          hl.near_width = hl.near_width * scale
          hl.near_height = hl.near_height * scale
          hl.near_distance = hl.near_distance * scale
          hl.far_distance = hl.far_distance * scale

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
          spec.construction_demand = construction_demand
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

  grunt.registerTask('printPath', function() {
    console.log(media)
  });

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:static', 'copy:mod', 'printPath']);

};

