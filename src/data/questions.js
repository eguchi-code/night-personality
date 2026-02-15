// 4軸: lead/follow, slow/quick, verbal/atmosphere, thrill/comfort
// 各軸3問 = 計12問

const questions = [
  // === Axis 1: Lead vs Follow (主導権) ===
  {
    id: 1,
    axis: 'initiative',
    text: '二人きりの夜。ムードが高まってきた時、あなたは…',
    optionA: { text: '自分から空気を変える一手を打つ', value: 'lead' },
    optionB: { text: '相手の出方をじっくり見守る', value: 'follow' },
  },
  {
    id: 2,
    axis: 'initiative',
    text: '夜のデートプラン、どっちが自分らしい？',
    optionA: { text: 'サプライズ込みで完璧に段取りする', value: 'lead' },
    optionB: { text: '「どこ行きたい？」って聞いちゃう', value: 'follow' },
  },
  {
    id: 3,
    axis: 'initiative',
    text: '深夜のドライブ。BGMの選曲権は？',
    optionA: { text: '自分の勝負プレイリストをかける', value: 'lead' },
    optionB: { text: '相手の好みに合わせて流す', value: 'follow' },
  },

  // === Axis 2: Slow vs Quick (テンポ) ===
  {
    id: 4,
    axis: 'tempo',
    text: '最高の夜ごはんを作るなら？',
    optionA: { text: '3時間煮込んだ渾身のビーフシチュー', value: 'slow' },
    optionB: { text: '15分で完成する絶品パスタ', value: 'quick' },
  },
  {
    id: 5,
    axis: 'tempo',
    text: '気になる人と急接近するのは…',
    optionA: { text: '何度も会って少しずつ距離を縮める', value: 'slow' },
    optionB: { text: '直感で「この人だ」と一気に進む', value: 'quick' },
  },
  {
    id: 6,
    axis: 'tempo',
    text: '夜のお風呂タイム、あなたは？',
    optionA: { text: '入浴剤入れてキャンドルで1時間コース', value: 'slow' },
    optionB: { text: 'シャワーでサッと済ませて次の楽しみへ', value: 'quick' },
  },

  // === Axis 3: Verbal vs Atmosphere (表現) ===
  {
    id: 7,
    axis: 'expression',
    text: '大切な人に気持ちを伝えるなら？',
    optionA: { text: '目を見て言葉でちゃんと伝える', value: 'verbal' },
    optionB: { text: 'さりげない行動で感じてもらう', value: 'atmosphere' },
  },
  {
    id: 8,
    axis: 'expression',
    text: '深夜2時のLINE。恋人から「寝れない」と来た。',
    optionA: { text: '「何があったの？」と長文トークが始まる', value: 'verbal' },
    optionB: { text: 'かわいいスタンプ → 通話ボタンぽちっ', value: 'atmosphere' },
  },
  {
    id: 9,
    axis: 'expression',
    text: 'お酒が入っていい感じの夜。盛り上がるのは？',
    optionA: { text: '本音トークで深い話に没入', value: 'verbal' },
    optionB: { text: '音楽とお酒の空気感にただ浸る', value: 'atmosphere' },
  },

  // === Axis 4: Thrill vs Comfort (冒険度) ===
  {
    id: 10,
    axis: 'adventure',
    text: '金曜の夜、急に予定が空いた！',
    optionA: { text: '行ったことない街のバーを開拓する', value: 'thrill' },
    optionB: { text: '行きつけの店でいつものマスターと語る', value: 'comfort' },
  },
  {
    id: 11,
    axis: 'adventure',
    text: '理想のベッドルーム、どっち寄り？',
    optionA: { text: '間接照明やアロマを気分で変える', value: 'thrill' },
    optionB: { text: '最高の寝心地を追求した安眠特化', value: 'comfort' },
  },
  {
    id: 12,
    axis: 'adventure',
    text: '記憶に残る最高の夜とは？',
    optionA: { text: '想定外の展開で人生観が変わった夜', value: 'thrill' },
    optionB: { text: '大切な人と穏やかに笑い合えた夜', value: 'comfort' },
  },
]

export default questions
