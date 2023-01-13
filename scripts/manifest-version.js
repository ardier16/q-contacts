#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const MANIFEST_PATH = path.resolve(__dirname, '../public/manifest.json')

const pkg = require(path.resolve(__dirname, '../package.json'))
const manifest = require(MANIFEST_PATH)

const updatedManifest = Object.assign(manifest, { version: pkg.version })
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(updatedManifest, null, 2))
