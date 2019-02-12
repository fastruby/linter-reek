'use babel';

import * as path from 'path';
import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach,
} from 'jasmine-fix';

const { lint } = require('../lib/linter-reek.js').provideLinter();

const goodFile = path.join(__dirname, 'fixtures', 'good.rb');
const badFile = path.join(__dirname, 'fixtures', 'bad.rb');

describe('The reek provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('language-ruby');
    await atom.packages.activatePackage('linter-reek');
  });

  it('checks a file with issues and reports the correct message', async () => {
    const excerpt = 'IrresponsibleModule: Dirty has no descriptive comment';
    const url = 'https://github.com/troessner/reek/blob/v5.3.1/docs/Irresponsible-Module.md';
    const editor = await atom.workspace.open(badFile);
    const messages = await lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toEqual('warning');
    expect(messages[0].url).toEqual(url);
    expect(messages[0].excerpt).toEqual(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 11]]);
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodFile);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });
});
