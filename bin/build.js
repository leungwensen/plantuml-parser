#!/usr/bin/env node
'use strict';
/**
 * build module
 * @module build
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const path = require('path');
const peg = require('pegjs');

const REGEXP = {
  importStmt: /\/\/\s*@import\s*'[^']+';/g,
  srcPath: /'([^']+)';/,
};

// collecting grammars
function importing(content, resourcePath) {
  const match = content.match(REGEXP.importStmt);
  if (match) {
    lang.each(match, (m) => {
      const sourcePath = m.match(REGEXP.srcPath)[1];
      const absoluteSourcePath = path.resolve(path.dirname(resourcePath), sourcePath);
      const sourceOriginContent = fs.readFileSync(absoluteSourcePath, 'utf8');
      const sourceDistContent = importing(sourceOriginContent, absoluteSourcePath);
      content = content.replace(m, `\n/*-----------imported from '${sourcePath}'-----------*/\n${sourceDistContent}`);
    });
  }
  return content;
}

const grammarPath = path.resolve(__dirname, '../src/plantuml.pegjs');
const plantUMLGrammar = importing(fs.readFileSync(grammarPath, 'utf8'), grammarPath);

fs.writeFile(path.resolve(__dirname, '../src/plantuml-combined.pegjs'), plantUMLGrammar, (err) => {
  if (err) throw err;
  const parser = peg.generate(plantUMLGrammar, {
    //allowedStartRules: ['start'],
    format: 'commonjs',
    output: 'source',
  });
  fs.writeFile(path.resolve(__dirname, '../src/plantuml.js'), parser, (err) => {
    if (err) throw err;
  });
});
