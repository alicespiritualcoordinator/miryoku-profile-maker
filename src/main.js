import './style.css';
import { generateProfile } from './generate.js';

const questions = [
  ['今、どんな活動・仕事をしていますか？', '資格・肩書きだけでなく、実際にどんなことをしているかを書いてください。', '例：アロマを使ったセルフケアを教えています'],
  ['どんな人の役に立ちたいですか？', '年齢だけではなく、どんな悩みや状況にいる人なのかを考えてみましょう。', '例：家族のことを優先して、自分の時間が取れない女性'],
  ['その人は、今どんなことで困っていますか？', '', '例：忙しくて、心と体を休める時間がない'],
  ['あなたは、その人に何を提供できますか？', '', '例：家で気軽にできるアロマのセルフケアレッスン'],
  ['あなたの商品・サービスを受けると、その人はどう変われますか？', '「何をするか」ではなく、その先にある未来を考えてみましょう。', '例：自分を大切にする時間ができ、笑顔で毎日を過ごせる'],
  ['あなた自身の経験・実績・強みは何ですか？', '資格だけではなく、これまで乗り越えてきたことや、人からよく褒められることも含めてください。', '例：子育てと仕事の両立経験があり、話を丁寧に聞くのが得意'],
  ['あなたらしさを表す言葉を3つ挙げるとしたら何ですか？', '例：明るい／安心感／行動力\nやさしい／丁寧／話しやすい', '例：やさしい／丁寧／話しやすい'],
];
const app = document.querySelector('#app');
const state = { step: 'start', answers: Array(7).fill(''), name: '' };
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let copyValues = [];
function move(step) {
  state.step = step;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.querySelector('h1, h2')?.focus();
}
function error(message) {
  document.querySelector('#error').textContent = message;
  const field = app.querySelector('textarea, input');
  field.setAttribute('aria-invalid', 'true');
  field.focus();
}
function candidate(label, value) {
  const index = copyValues.push(value) - 1;
  return `<article class="candidate"><div class="candidate-top"><h3>${label}</h3><button class="copy" data-copy="${index}" aria-label="${label}をコピーする">コピーする</button></div><p class="generated">${escape(value)}</p><span class="count">${Array.from(value).length}文字</span></article>`;
}
function render() {
  copyValues = [];
  if (state.step === 'start') {
    app.innerHTML = `<section class="hero"><span class="eyebrow">あなたの中に、魅力はもうある。</span><div class="flower" aria-hidden="true">✿</div><h1 tabindex="-1">魅力楽々<br>プロフィールメーカー</h1><p class="lead">7つの質問に答えて<br>「あなたは何の人？」が伝わる<br>Instagramプロフィールをつくりましょう</p><p class="description">あなたの中にある魅力や経験を、<br>お客様に伝わる「言葉」に整えていきます。</p><button class="primary" id="start">プロフィールづくりを始める <span aria-hidden="true">→</span></button><p class="small">正解はありません。あなたの言葉で大丈夫です。</p></section>`;
    document.querySelector('#start').onclick = () => move(0);
  } else if (typeof state.step === 'number') {
    const i = state.step;
    const [title, help, placeholder] = questions[i];
    app.innerHTML = `<section class="panel"><div class="progress-label"><span>あなたの魅力を見つける7つの質問</span><strong>${i + 1} / 7</strong></div><div class="progress" role="progressbar" aria-label="質問の進捗" aria-valuemin="0" aria-valuemax="7" aria-valuenow="${i + 1}"><div style="width:${(i + 1) / 7 * 100}%"></div></div><span class="eyebrow">QUESTION ${String(i + 1).padStart(2, '0')}</span><h2 tabindex="-1" id="question">${title}</h2><p id="help" class="help">${escape(help)}</p><label for="answer" class="field-label">あなたの回答</label><textarea id="answer" aria-labelledby="question" aria-describedby="help error" maxlength="1000" placeholder="${placeholder}">${escape(state.answers[i])}</textarea><p class="small">短い言葉でも大丈夫です。（1,000文字まで）</p><p id="error" class="error" role="alert"></p><div class="navigation"><button class="secondary" id="back">戻る</button><button class="primary" id="next">${i === 6 ? 'お名前の入力へ' : '次へ'} <span aria-hidden="true">→</span></button></div></section>`;
    document.querySelector('#answer').oninput = e => { state.answers[i] = e.target.value; e.target.removeAttribute('aria-invalid'); document.querySelector('#error').textContent = ''; };
    document.querySelector('#back').onclick = () => move(i === 0 ? 'start' : i - 1);
    document.querySelector('#next').onclick = () => state.answers[i].trim() ? move(i === 6 ? 'name' : i + 1) : error('回答を入力してから進みましょう。短い言葉でも大丈夫です。');
  } else if (state.step === 'name') {
    app.innerHTML = `<section class="panel"><span class="eyebrow">最後に、もうひとつ</span><h2 tabindex="-1">Instagramで使用する<br>お名前を教えてください</h2><p class="help">本名でなくても大丈夫です。活動名やニックネームを入力してください。</p><label class="field-label" for="name">Instagramで使用するお名前</label><input id="name" maxlength="30" autocomplete="nickname" aria-describedby="error" placeholder="例：はな" value="${escape(state.name)}"><p class="small">30文字まで入力できます。名前欄の案では短く整えます。</p><p id="error" class="error" role="alert"></p><div class="navigation"><button class="secondary" id="back">戻る</button><button class="primary" id="generate">プロフィールをつくる</button></div></section>`;
    document.querySelector('#name').oninput = e => { state.name = e.target.value; e.target.removeAttribute('aria-invalid'); document.querySelector('#error').textContent = ''; };
    document.querySelector('#back').onclick = () => move(6);
    document.querySelector('#generate').onclick = () => state.name.trim() ? move('result') : error('Instagramで使用するお名前を入力してください。');
  } else {
    const result = generateProfile(state.name, state.answers);
    const labels = ['誰のための人？', '何を提供する人？', 'どんな未来へ導く人？', 'あなたならではの強み'];
    app.innerHTML = `<section class="result-heading"><span class="eyebrow">YOUR PROFILE</span><h1 tabindex="-1">あなたの魅力が、<br>言葉になりました。</h1><p class="help">気に入った言葉を組み合わせて、<br>あなたらしいプロフィールに整えてください。</p></section><section class="result-section"><h2>① あなたの魅力整理</h2><dl class="summary">${result.summary.map((v, i) => `<div><dt>${labels[i]}</dt><dd>${escape(v)}</dd></div>`).join('')}</dl></section><section class="result-section"><h2>② Instagram「名前欄」候補</h2><p class="help">何をする人かが、一目で伝わる名前に。</p>${result.names.map((v, i) => candidate(`名前欄 案${i + 1}`, v)).join('')}</section><section class="result-section"><h2>③ Instagram自己紹介文</h2><p class="help">150文字以内で整えました。省略された部分や言い回し、DMの案内は、ご自身に合わせて調整してください。</p>${result.bios.map((v, i) => candidate(`自己紹介文 案${i + 1}`, v)).join('')}</section><section class="result-section"><h2>④「あなたは何の人？」</h2>${candidate('あなたを表すキャッチコピー', result.catchphrase)}</section><p id="copy-status" role="status" class="copy-status"></p><section class="result-actions"><button class="primary" id="edit">回答を修正する</button><button class="secondary" id="reset">最初からやり直す</button><p class="small">この画面を閉じると回答は消えます。<br>残したい文章はコピーして保存してください。</p></section>`;
    document.querySelector('#edit').onclick = () => move(0);
    document.querySelector('#reset').onclick = () => {
      if (window.confirm('回答と結果を消して、最初からやり直しますか？')) { state.answers.fill(''); state.name = ''; move('start'); }
    };
    app.querySelectorAll('[data-copy]').forEach(button => button.onclick = async () => {
      const text = copyValues[Number(button.dataset.copy)];
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
        else {
          const field = document.createElement('textarea'); field.value = text; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select();
          let success; try { success = document.execCommand('copy'); } finally { field.remove(); button.focus(); }
          if (!success) throw new Error('copy failed');
        }
        button.textContent = 'コピーしました';
        document.querySelector('#copy-status').textContent = 'コピーしました。Instagramやメモに貼り付けてください。';
      } catch {
        document.querySelector('#copy-status').textContent = 'コピーできませんでした。文章を長押し、または選択してコピーしてください。';
      }
    });
  }
}
render();
