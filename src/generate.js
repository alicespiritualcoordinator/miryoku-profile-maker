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
  const names = [
    `${n}｜${short(work)}`,
    `${n}｜${short(audience, 10)}のための${short(service, 10)}`,
    `${n}｜${short(personality, 10)}・${short(work, 10)}`,
  ].map(v => compact(v, 30));
  const bios = [
    [`${short(audience, 23)}へ`, `${short(service, 25)}をお届け`, `目指す未来：${short(future, 25)}`, `私の強み：${short(strength, 25)}`, '気になる方はDMでお声がけください'],
    [`${short(problem, 23)}と感じる方へ`, `活動：${short(work, 23)}`, `提供：${short(service, 23)}`, `目指す未来：${short(future, 23)}`, `経験・強み：${short(strength, 23)}`, 'まずは投稿をご覧ください'],
    [`${short(audience, 23)}のためのアカウント`, `${short(service, 23)}でお手伝い`, `目指す未来：${short(future, 23)}`, `大切にすること：${short(personality, 20)}`, `私の強み：${short(strength, 23)}`, 'お気軽にDMでご相談ください'],
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
    catchphrase: `${short(audience, 20)}を、${short(future, 24)}という未来へ。`,
  };
}
