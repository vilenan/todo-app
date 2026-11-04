import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasDraftChanged } from '../src/lib/todoDraft.ts';

const original = {
  text: 'Задача',
  description: '',
  dueDate: '',
  priority: 'medium',
  category: null,
};

test('detects changes in every editable field and allows reverting them', () => {
  assert.equal(hasDraftChanged(original, { ...original }), false);
  for (const [key, value] of Object.entries({
    text: 'Другая',
    description: 'Описание',
    dueDate: '2026-12-01',
    priority: 'high',
    category: 'work',
  })) {
    assert.equal(
      hasDraftChanged(original, { ...original, [key]: value }),
      true,
      key
    );
  }
});
