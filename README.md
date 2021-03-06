# Titan Gantry

Factory that builds most titans.

Balance is a bit of a shot in the dark; it should be better than a bunch of fabs in some circumstances, but not too good. As it stands, it has 500 build power with high energy efficiency, and enough storage to build a titan outright if you need to save up to be able to turn it on.

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into server_mods
- copy:static - copy the static files into pa directory
- proc - mashup some stock units into the new unit
- default: proc, copy:static, copy:mod
