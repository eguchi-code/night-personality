// 4軸: lead/follow, slow/quick, verbal/atmosphere, thrill/comfort
// 各軸3問 = 計12問

const questions = [
  // === Axis 1: Lead vs Follow (主導権) ===
  {
    id: 1,
    axis: 'initiative',
    text: 'ホテルのスイートルームで二人きり。照明の明るさを決めるのは？',
    optionA: { text: '自分好みの暗さにそっと調整する', value: 'lead' },
    optionB: { text: '「お好きにどうぞ」と相手に委ねる', value: 'follow' },
  },
  {
    id: 2,
    axis: 'initiative',
    text: 'いい雰囲気の夜。次の展開を決めるのは？',
    optionA: { text: '自分から仕掛けて空気を変える', value: 'lead' },
    optionB: { text: '相手の出方をじっと待つ', value: 'follow' },
  },
  {
    id: 3,
    axis: 'initiative',
    text: '深夜、ふと目が合った。息がかかるくらいの距離で…',
    optionA: { text: '自分から距離を詰める', value: 'lead' },
    optionB: { text: 'じっと見つめて相手を誘い込む', value: 'follow' },
  },

  // === Axis 2: Slow vs Quick (テンポ) ===
  {
    id: 4,
    axis: 'tempo',
    text: '最高の夜に必要なのは？',
    optionA: { text: '何時間でもかける前戯のような駆け引き', value: 'slow' },
    optionB: { text: '火がついたら一気に燃え上がる勢い', value: 'quick' },
  },
  {
    id: 5,
    axis: 'tempo',
    text: '気になる人との初めての夜。理想は？',
    optionA: { text: 'お酒を飲みながらじっくり距離を縮める', value: 'slow' },
    optionB: { text: '目が合った瞬間に確信して一気に進む', value: 'quick' },
  },
  {
    id: 6,
    axis: 'tempo',
    text: 'キスのタイミング、あなたは？',
    optionA: { text: 'ここぞの瞬間まで焦らして焦らして…', value: 'slow' },
    optionB: { text: '「したい」と思ったその瞬間に', value: 'quick' },
  },

  // === Axis 3: Verbal vs Atmosphere (表現) ===
  {
    id: 7,
    axis: 'expression',
    text: '相手をドキッとさせるなら？',
    optionA: { text: '耳元で囁く甘い一言', value: 'verbal' },
    optionB: { text: '何も言わず見つめて、そっと触れる', value: 'atmosphere' },
  },
  {
    id: 8,
    axis: 'expression',
    text: 'ベッドの中で、より興奮するのは？',
    optionA: { text: '「好き」「もっと」と言葉で伝え合う', value: 'verbal' },
    optionB: { text: '言葉なしで呼吸と体温だけで通じ合う', value: 'atmosphere' },
  },
  {
    id: 9,
    axis: 'expression',
    text: '相手を落としたいとき、あなたの必殺技は？',
    optionA: { text: '本音を晒す深夜の告白', value: 'verbal' },
    optionB: { text: '計算し尽くした沈黙と視線', value: 'atmosphere' },
  },

  // === Axis 4: Thrill vs Comfort (冒険度) ===
  {
    id: 10,
    axis: 'adventure',
    text: '非日常の夜に誘われたら？',
    optionA: { text: '「面白そう」と即答でついていく', value: 'thrill' },
    optionB: { text: '信頼できる相手と安心できる場所がいい', value: 'comfort' },
  },
  {
    id: 11,
    axis: 'adventure',
    text: '忘れられない夜にするには？',
    optionA: { text: '初めての場所、初めての体験、未知への興奮', value: 'thrill' },
    optionB: { text: 'いつもの場所で、いつもより少しだけ大胆に', value: 'comfort' },
  },
  {
    id: 12,
    axis: 'adventure',
    text: '理想の夜の終わり方は？',
    optionA: { text: '朝まで続く終わらない夜', value: 'thrill' },
    optionB: { text: '腕の中で安心して眠りに落ちる', value: 'comfort' },
  },
]

export default questions
