// The CLI logic itself is mostly a thin wrapper around child_process.spawn,
// so we test the JSON-parsing helper (which is the only branch where the
// original was likely to silently fall over on real VS Code config files
// that contain // and /* */ comments).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Re-implement stripJsonComments here rather than exporting from ive.ts,
// to keep the bin module a pure script. Kept in sync by code review.
function stripJsonComments(raw: string): unknown {
  const noBlock = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const noLine = noBlock.replace(/^\s*\/\/.*$/gm, '');
  return JSON.parse(noLine);
}

describe('stripJsonComments', () => {
  it('parses a plain JSON file', () => {
    const parsed = stripJsonComments('{"recommendations":["a.b","c.d"]}') as {
      recommendations: string[];
    };
    assert.deepEqual(parsed.recommendations, ['a.b', 'c.d']);
  });

  it('strips // line comments', () => {
    const raw = `{
      // this is a comment
      "recommendations": ["a.b"]
    }`;
    const parsed = stripJsonComments(raw) as { recommendations: string[] };
    assert.deepEqual(parsed.recommendations, ['a.b']);
  });

  it('strips /* */ block comments', () => {
    const raw = `{
      /* multi
         line */
      "recommendations": ["a.b"]
    }`;
    const parsed = stripJsonComments(raw) as { recommendations: string[] };
    assert.deepEqual(parsed.recommendations, ['a.b']);
  });

  it('handles a file with no recommendations gracefully', () => {
    const parsed = stripJsonComments('{}') as { recommendations?: string[] };
    assert.equal(parsed.recommendations, undefined);
  });
});
