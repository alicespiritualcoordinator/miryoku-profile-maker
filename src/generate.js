// 魅力楽々プロフィールメーカー
// ユーザーが入力した7つの回答だけを材料にプロフィールを生成します。
// 入力されていない資格・実績・数字などは追加しません。

export function compact(value, max = 36) {
  const text = String(value || '')
    .trim()
    .replace(/\s+/g, ' ');

  const chars = Array.from(text);

  if (chars.length <= max) return text;

  return chars.slice(0, max - 1).join('') + '…';
}

export function generateProfile(name, answers) {
  if (
    !name.trim() ||
    answers.length !== 7 ||
    answers.some(answer => !String(answer || '').trim())
  ) {
    throw new Error('お名前と7つの回答を入力してください。');
  }

  const [
    work,
    audience,
    problem,
    service,
    future,
    strength,
    personality
  ] = answers.map(answer => String(answer).trim());

  const n = compact(name, 12);

  // 文末や不要な主語を整理する
  const clean = (value) => {
    return String(value || '')
      .trim()
      .replace(/[。！？!?]+$/g, '')
      .replace(/^(私は|わたしは|自分は)/, '')
      .replace(/\s+/g, ' ');
  };

  // プロフィール用に短く整える
  const phrase = (value, max = 30) => {
    let text = clean(value);

    text = text
      .replace(/ことができます/g, '')
      .replace(/ことができる/g, '')
      .replace(/できます/g, '')
      .replace(/できる/g, '')
      .replace(/してあげる/g, 'する')
      .replace(/教えること/g, 'サポート')
      .replace(/方法を教える/g, 'サポート');

    return compact(text, max);
  };

  const target = phrase(audience, 22);
  const offer = phrase(service, 24);
  const vision = phrase(future, 28);
  const strong = phrase(strength, 26);
  const character = phrase(personality, 22);
  const activity = phrase(work, 24);
  const concern = phrase(problem, 24);

  // 名前欄
  // 3案それぞれ役割を変える
  const names = [
    compact(`${n}｜${offer}`, 30),
    compact(`${n}｜${target}をサポート`, 30),
    compact(`${n}｜${strong}`, 30)
  ];

  // 自己紹介文を150文字以内に調整
  const limitBio = (lines) => {
    let result = [...lines];

    while (Array.from(result.join('\n')).length > 150) {
      let longestIndex = 0;

      for (let i = 1; i < result.length - 1; i++) {
        if (
          Array.from(result[i]).length >
          Array.from(result[longestIndex]).length
        ) {
          longestIndex = i;
        }
      }

      const current = Array.from(result[longestIndex]);

      if (current.length <= 12) break;

      result[longestIndex] =
        current.slice(0, current.length - 1).join('');
    }

    return result.join('\n');
  };

  // 案1：お客様・未来重視
  const bio1 = limitBio([
    `${target}へ`,
    `${offer}を通してサポート`,
    `目指す未来｜${vision}`,
    `私の強み｜${strong}`,
    `気になる方はDMでお声がけください`
  ]);

  // 案2：専門性・提供価値重視
  const bio2 = limitBio([
    `${concern}と感じる方へ`,
    `活動｜${activity}`,
    `提供｜${offer}`,
    `目指す未来｜${vision}`,
    `強み｜${strong}`,
    `まずは投稿をご覧ください`
  ]);

  // 案3：人柄・強み重視
  const bio3 = limitBio([
    `${target}のために`,
    `${offer}でお手伝い`,
    `目指す未来｜${vision}`,
    `大切にすること｜${character}`,
    `私の強み｜${strong}`,
    `お気軽にDMでご相談ください`
  ]);

  // 「あなたは何の人？」
  // ターゲット＋提供価値＋未来を一言にまとめる
  const catchphrase = compact(
    `${target}を、${offer}を通して、${vision}未来へ。`,
    70
  );

  return {
    summary: [audience, service, future, strength],
    names,
    bios: [bio1, bio2, bio3],
    catchphrase
  };
}
