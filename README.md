# Titan Gantry

Factory that builds most titans.

Until the support mods improve, this mod is using `icon_si_metal_storage_adv.png` and build bar ["factory", 1]

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into server_mods
- copy:static - copy the static files into pa directory
- proc - mashup some stock units into the new unit
- default: proc, copy:static, copy:mod
