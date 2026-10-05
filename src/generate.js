// ユーザーの回答だけを材料にする。資格・実績・数字を推測して補わない。
export function compact(value, max = 36) {
  const text = String(value).trim().replace(/\s+/g, ' ');
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : text;
}
export function generateProfile(name, answers) {
  if (!name.trim() || answers.length !== 7 || answers.some(a => !a.trim())) {
    throw new Error('お名前と7つの回答を入力してください。');
  }
  const [work, audience, problem, service, future, strength, personality] = answers.map(a => compact(a));
  const n = compact(name, 12);
  const short = (v, len = 18) => compact(v, len);
  const cleanPhrase = (v, len = 18) => {
  let text = String(v || '')
    .trim()
    .replace(/[。！？!?]/g, '')
    .replace(/^(私は|わたしは|自分は)/, '')
    .replace(/ことができる/g, '')
    .replace(/できます/g, '')
    .replace(/できる/g, '')
    .replace(/\s+/g, ' ');

  const chars = Array.from(text);
  return chars.length > len ? chars.slice(0, len).join('') : text;
};

const names = [
  `${n}｜${cleanPhrase(service, 18)}`,
  `${n}｜${cleanPhrase(audience, 12)}の魅力サポート`,
  `${n}｜${cleanPhrase(strength, 18)}`,
].map(v => compact(v, 30));
  const bioPhrase = (v, len = 28) => {
  let text = String(v || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[。]+$/g, '');

  const chars = Array.from(text);
  return chars.length > len ? chars.slice(0, len).join('') : text;
};

const bios = [
  [
    `${bioPhrase(audience, 28)}へ`,
    `${bioPhrase(service, 30)}`,
    `目指す未来：${bioPhrase(future, 28)}`,
    `強み：${bioPhrase(strength, 26)}`,
    `お気軽にDMでご相談ください`
  ],
  [
    `${bioPhrase(problem, 28)}と感じる方へ`,
    `${bioPhrase(service, 30)}`,
    `${bioPhrase(future, 28)}を目指します`,
    `経験・強み：${bioPhrase(strength, 26)}`,
    `まずは投稿をご覧ください`
  ],
  [
    `${bioPhrase(audience, 28)}のために`,
    `${bioPhrase(service, 30)}`,
    `未来：${bioPhrase(future, 28)}`,
    `大切にすること：${bioPhrase(personality, 24)}`,
    `お気軽にDMでご相談ください`
  ],
].map(lines => lines.join('\n'));
  // Instagram自己紹介の150文字以内に収め、CTAの行を残す。
  const limitBio = bio => {
    const lines = bio.split('\n');
    while (Array.from(lines.join('\n')).length > 150) {
      const index = lines.slice(0, -1).reduce((best, line, i) => Array.from(line).length > Array.from(lines[best]).length ? i : best, 0);
      lines[index] = compact(lines[index], Array.from(lines[index]).length - 1);
    }
    return lines.join('\n');
  };
  return {
    summary: [audience, service, future, strength],
    names,
    bios: bios.map(limitBio),
    catchphrase: `${cleanPhrase(audience, 16)}へ。${cleanPhrase(service, 22)}を通して、${cleanPhrase(future, 26)}未来へ。`,
  };
}
