import test from 'node:test';
import assert from 'node:assert/strict';
import { compact, generateProfile } from '../src/generate.js';
const answers = ['アロマのセルフケア講師', '忙しい女性', '自分の時間がない', 'セルフケアレッスン', '笑顔で過ごせる', '話を丁寧に聞く', 'やさしい／丁寧／安心感'];
test('回答から3つずつの候補と魅力整理を生成する', () => {
  const result = generateProfile('はな', answers);
  assert.deepEqual(result.summary, [answers[1], answers[3], answers[4], answers[5]]);
  assert.equal(result.names.length, 3);
  assert.equal(result.bios.length, 3);
  assert.equal(new Set(result.bios).size, 3);
  for (const bio of result.bios) {
    assert.ok(bio.includes(answers[5]));
    assert.ok(bio.includes(answers[4]));
    assert.ok(!/資格|認定|人突破|年の実績/.test(bio));
    assert.ok(bio.split('\n').length >= 5);
  }
});
test('長い回答と絵文字でも名前欄30文字・自己紹介150文字以内', () => {
  const result = generateProfile('🌸'.repeat(30), Array(7).fill('あ🌸'.repeat(500)));
  assert.ok(result.names.every(n => Array.from(n).length <= 30));
  assert.ok(result.bios.every(b => Array.from(b).length <= 150));
  assert.ok(result.bios.every(b => /ください$/.test(b)));
  assert.equal(compact('🌸🌸🌸', 2), '🌸…');
});
test('空欄や不足した回答を受け付けない', () => {
  assert.throws(() => generateProfile(' ', answers));
  assert.throws(() => generateProfile('はな', answers.slice(0, 6)));
  assert.throws(() => generateProfile('はな', [...answers.slice(0, 6), '  ']));
});
