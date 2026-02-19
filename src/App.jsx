import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from './data/questions'
import types from './data/types'

// ========== Shared data ==========
const typeEntries = Object.entries(types)
const typeCodes = Object.keys(types)
const typeImageUrl = (code) => `${import.meta.env.BASE_URL}images/types/${code}.webp`

function TypeImage({ code, size = 'md', className = '' }) {
  const sizes = { xs: 'w-8 h-8', sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20', xl: 'w-32 h-32 md:w-40 md:h-40' }
  const borders = { xs: 'border', sm: 'border', md: 'border-2', lg: 'border-2', xl: 'border-2' }
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0 ${borders[size]} border-white/20 shadow-lg shadow-purple-500/10 ${className}`}>
      <img src={typeImageUrl(code)} alt={types[code]?.name || code} className="w-full h-full object-cover" loading="lazy" />
    </div>
  )
}

const rarityData = {
  LSVT: { pct: 4.2, tier: 'SSR', label: '超レア' },
  LSAT: { pct: 3.8, tier: 'SSR', label: '超レア' },
  FSAT: { pct: 4.0, tier: 'SSR', label: '超レア' },
  LQAT: { pct: 4.5, tier: 'SR', label: 'レア' },
  FQAT: { pct: 5.2, tier: 'SR', label: 'レア' },
  LSAC: { pct: 5.5, tier: 'SR', label: 'レア' },
  LQVT: { pct: 5.8, tier: 'SR', label: 'レア' },
  LQAC: { pct: 6.2, tier: 'R', label: 'やや珍しい' },
  FQVT: { pct: 6.5, tier: 'R', label: 'やや珍しい' },
  FSVT: { pct: 6.8, tier: 'R', label: 'やや珍しい' },
  LSVC: { pct: 7.1, tier: 'R', label: 'やや珍しい' },
  LQVC: { pct: 7.3, tier: 'R', label: 'やや珍しい' },
  FSAC: { pct: 7.5, tier: 'N', label: 'スタンダード' },
  FSVC: { pct: 8.2, tier: 'N', label: 'スタンダード' },
  FQVC: { pct: 8.5, tier: 'N', label: 'スタンダード' },
  FQAC: { pct: 8.9, tier: 'N', label: 'スタンダード' },
}

const tierColors = {
  SSR: { bg: 'bg-amber-400/20', border: 'border-amber-400/40', text: 'text-amber-300' },
  SR: { bg: 'bg-purple-400/20', border: 'border-purple-400/40', text: 'text-purple-300' },
  R: { bg: 'bg-sky-400/20', border: 'border-sky-400/40', text: 'text-sky-300' },
  N: { bg: 'bg-white/10', border: 'border-white/20', text: 'text-white/50' },
}

function getCompatibility(codeA, codeB) {
  if (codeA === codeB) return { score: 3, label: '同じタイプ', desc: '価値観が近いからこそ分かり合える。ただし刺激は少なめ——お互いの「当たり前」が同じだから。' }
  const a = types[codeA], b = types[codeB]
  if (!a || !b) return { score: 0, label: '—', desc: '' }
  if (a.compatibility === codeB) return { score: 5, label: '運命の相手', desc: a.compatReason }
  if (b.compatibility === codeA) return { score: 5, label: '運命の相手', desc: b.compatReason }
  if (a.compatibility2 === codeB) return { score: 4, label: '最高の相性', desc: a.compatReason2 }
  if (b.compatibility2 === codeA) return { score: 4, label: '最高の相性', desc: b.compatReason2 }
  if (a.compatibility3 === codeB) return { score: 3, label: '好相性', desc: a.compatReason3 }
  if (b.compatibility3 === codeA) return { score: 3, label: '好相性', desc: b.compatReason3 }
  let diff = 0
  for (let i = 0; i < 4; i++) if (codeA[i] !== codeB[i]) diff++
  if (diff >= 3) return { score: 2, label: '化学反応型', desc: '正反対だからこそ、ハマった時の爆発力は計り知れない。未知の快感を教え合える関係。' }
  return { score: 1, label: '穏やかな関係', desc: '似ている部分が多く安心感がある。新しい一面を見せ合えたら、一気に深まるかも。' }
}

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
  </button>
)

const hearts = (n) => '♥'.repeat(n) + '♡'.repeat(5 - n)

// ========== Intro Screen ==========
function IntroScreen({ onStart, onShowTypes, onShowAbout, onShowCompat, onShowMatrix }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.img src={`${import.meta.env.BASE_URL}logo.png`} alt="夜の性格診断" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.0, type: 'spring', bounce: 0.3 }} className="w-72 md:w-96 mb-10" />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.8 }} className="text-white/70 text-center max-w-md mb-12 text-sm md:text-base leading-relaxed">
        あなたの夜の過ごし方には、<br className="md:hidden" />隠された<span className="text-purple-300 font-medium">本当の性格</span>が表れる。<br /><br />12の質問に答えるだけで、<br className="md:hidden" />全16タイプから<span className="text-pink-300 font-medium">あなたの夜型</span>を診断。
      </motion.p>
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onStart} className="px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow">
        診断をはじめる
      </motion.button>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.6 }} className="mt-6 text-white/30 text-xs">所要時間：約2分 / 全12問</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }} className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={onShowTypes} className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors">16のタイプ</button>
        <button onClick={onShowCompat} className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors">相性診断</button>
        <button onClick={onShowMatrix} className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors">相性マトリクス</button>
        <button onClick={onShowAbout} className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors">診断とは？</button>
      </motion.div>
    </motion.div>
  )
}

// ========== Types Screen ==========
function TypesScreen({ onBack }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-8"><BackButton onClick={onBack} /><h1 className="text-2xl md:text-3xl font-black text-shimmer">全16タイプ</h1></div>
      <div className="space-y-3">
        {typeEntries.map(([code, data], i) => (
          <motion.div key={code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
            <button onClick={() => setExpanded(expanded === code ? null : code)} className="w-full text-left glass-card p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <TypeImage code={code} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-300">{code}</span>
                    <span className="font-bold text-white/90 text-sm">{data.name}</span>
                    {rarityData[code] && <span className={`text-[10px] px-1.5 py-0.5 rounded ${tierColors[rarityData[code].tier].bg} ${tierColors[rarityData[code].tier].text}`}>{rarityData[code].tier}</span>}
                  </div>
                  <p className="text-xs text-white/50 truncate">{data.subtitle}</p>
                </div>
                <svg className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${expanded === code ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">{data.tags.map((tag, j) => <span key={j} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px]">{tag}</span>)}</div>
            </button>
            <AnimatePresence>
              {expanded === code && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="glass-card p-5 mt-1 space-y-4 border-t border-white/5">
                    <div><h4 className="text-xs font-bold text-white/40 tracking-wider mb-2">PERSONALITY</h4><p className="text-sm text-white/70 leading-relaxed">{data.description}</p></div>
                    <div><h4 className="text-xs font-bold text-purple-300 tracking-wider mb-2">NIGHT STYLE</h4><p className="text-sm text-white/70 leading-relaxed">{data.nightStyle}</p></div>
                    <div><h4 className="text-xs font-bold text-pink-300 tracking-wider mb-2">LOVE HINT</h4><p className="text-sm text-white/70 leading-relaxed">{data.loveHint}</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ========== About Screen ==========
function AboutScreen({ onBack, onStart }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-8"><BackButton onClick={onBack} /><h1 className="text-2xl md:text-3xl font-black text-shimmer">診断とは？</h1></div>
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-sm font-bold text-purple-300 tracking-wider mb-4">この診断について</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">この診断は、あなたの夜の過ごし方から性格タイプを分析します。以下の4つの軸であなたの傾向を測定します。</p>
          <div className="space-y-3">
            {[{ axis: '主導権', desc: 'リードする（L）か、委ねる（F）か', color: 'text-purple-300' },{ axis: 'テンポ', desc: 'じっくり（S）か、スピーディー（Q）か', color: 'text-pink-300' },{ axis: '表現', desc: '言葉で伝える（V）か、雰囲気で伝える（A）か', color: 'text-amber-300' },{ axis: '冒険度', desc: '刺激を求める（T）か、安定を好む（C）か', color: 'text-teal-300' }].map((item, i) => (
              <div key={i} className="flex items-start gap-3"><span className={`text-xs font-bold ${item.color} flex-shrink-0 mt-0.5`}>{item.axis}</span><span className="text-xs text-white/50">{item.desc}</span></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-bold text-pink-300 tracking-wider mb-4">診断の仕組み</h3>
          <div className="space-y-3 text-sm text-white/70 leading-relaxed">
            {['全12問の質問に5段階で回答','4つの軸それぞれのスコアを集計','スコアから4文字のタイプコードを決定','全16タイプからあなたの夜型を特定'].map((s,i) => {
              const colors = ['purple','pink','amber','teal']
              return <div key={i} className="flex items-center gap-3"><span className={`w-7 h-7 rounded-full bg-${colors[i]}-500/20 border border-${colors[i]}-400/30 flex items-center justify-center text-xs font-bold text-${colors[i]}-300 flex-shrink-0`}>{i+1}</span><span>{s}</span></div>
            })}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-sm font-bold text-amber-300 tracking-wider mb-4">タイプコードの読み方</h3>
          <p className="text-xs text-white/50 mb-4">4文字のコードが、あなたの夜の性格を表します。</p>
          <div className="space-y-2.5">
            {[{ pos: '1文字目', a: 'L = Lead（リードする）', b: 'F = Follow（委ねる）' },{ pos: '2文字目', a: 'S = Slow（じっくり）', b: 'Q = Quick（スピーディー）' },{ pos: '3文字目', a: 'V = Verbal（言葉で）', b: 'A = Atmosphere（雰囲気で）' },{ pos: '4文字目', a: 'T = Thrill（刺激派）', b: 'C = Comfort（安定派）' }].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3"><span className="text-xs font-bold text-white/60 block mb-1">{item.pos}</span><div className="flex flex-col gap-0.5 text-xs text-white/50"><span>{item.a}</span><span>{item.b}</span></div></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-4">
          <button onClick={onStart} className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow">診断をはじめる</button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ========== Compat Screen (相性診断) ==========
function CompatScreen({ onBack }) {
  const [typeA, setTypeA] = useState(null)
  const [typeB, setTypeB] = useState(null)
  const [selectingFor, setSelectingFor] = useState('A') // A or B
  const result = typeA && typeB ? getCompatibility(typeA, typeB) : null

  const handleSelect = (code) => {
    if (selectingFor === 'A') { setTypeA(code); if (!typeB) setSelectingFor('B') }
    else { setTypeB(code); setSelectingFor(null) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6"><BackButton onClick={onBack} /><h1 className="text-2xl md:text-3xl font-black text-shimmer">相性診断</h1></div>
      <p className="text-sm text-white/50 mb-6">2つのタイプを選んで相性をチェック</p>

      {/* Selected types display */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setSelectingFor('A')} className={`flex-1 glass-card p-4 text-center transition-all ${selectingFor === 'A' ? 'ring-2 ring-purple-400' : ''}`}>
          {typeA ? <><div className="flex justify-center mb-1"><TypeImage code={typeA} size="lg" /></div><span className="text-xs text-purple-300 font-mono">{typeA}</span><p className="text-xs text-white/60 mt-1">{types[typeA].name}</p></> : <><span className="text-3xl block mb-1 opacity-30">？</span><span className="text-xs text-white/30">あなた</span></>}
        </button>
        <span className="text-2xl text-pink-400">×</span>
        <button onClick={() => setSelectingFor('B')} className={`flex-1 glass-card p-4 text-center transition-all ${selectingFor === 'B' ? 'ring-2 ring-pink-400' : ''}`}>
          {typeB ? <><div className="flex justify-center mb-1"><TypeImage code={typeB} size="lg" /></div><span className="text-xs text-pink-300 font-mono">{typeB}</span><p className="text-xs text-white/60 mt-1">{types[typeB].name}</p></> : <><span className="text-3xl block mb-1 opacity-30">？</span><span className="text-xs text-white/30">相手</span></>}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="glass-card-strong p-6 mb-6 text-center">
            <p className="text-2xl text-pink-400 tracking-widest mb-2">{hearts(result.score)}</p>
            <p className="text-xl font-black text-shimmer mb-2">{result.label}</p>
            <p className="text-sm text-white/60 leading-relaxed">{result.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type selector grid */}
      {selectingFor && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs text-white/40 mb-3">{selectingFor === 'A' ? 'あなた' : '相手'}のタイプを選択</p>
          <div className="grid grid-cols-4 gap-2">
            {typeEntries.map(([code, data]) => (
              <button key={code} onClick={() => handleSelect(code)} className={`glass-card p-2 flex flex-col items-center hover:bg-white/10 transition-colors ${(selectingFor === 'A' && typeA === code) || (selectingFor === 'B' && typeB === code) ? 'ring-2 ring-purple-400 bg-white/10' : ''}`}>
                <TypeImage code={code} size="sm" />
                <span className="text-[9px] font-mono text-white/40 block mt-1">{code}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ========== Matrix Screen (相性マトリクス) ==========
function MatrixScreen({ onBack }) {
  const [selected, setSelected] = useState(null)
  const selectedData = selected ? types[selected] : null

  const ranked = selected ? typeCodes
    .filter(c => c !== selected)
    .map(c => ({ code: c, ...getCompatibility(selected, c) }))
    .sort((a, b) => b.score - a.score)
    : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6"><BackButton onClick={onBack} /><h1 className="text-2xl md:text-3xl font-black text-shimmer">相性マトリクス</h1></div>
      <p className="text-sm text-white/50 mb-4">タイプを選ぶと、全タイプとの相性が見られます</p>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {typeEntries.map(([code, data]) => (
          <button key={code} onClick={() => setSelected(code)} className={`glass-card p-2 flex flex-col items-center hover:bg-white/10 transition-all ${selected === code ? 'ring-2 ring-purple-400 bg-white/10' : ''}`}>
            <TypeImage code={code} size="sm" />
            <span className="text-[9px] font-mono text-white/40 block mt-1">{code}</span>
          </button>
        ))}
      </div>

      {selectedData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={selected}>
          <div className="glass-card p-4 mb-4 flex items-center gap-3">
            <TypeImage code={selected} size="lg" />
            <div><p className="font-bold text-white/90">{selectedData.name}</p><p className="text-xs text-white/40 font-mono">{selected}</p></div>
          </div>
          <div className="space-y-2">
            {ranked.map((r, i) => {
              const t = types[r.code]
              return (
                <motion.div key={r.code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-3 flex items-center gap-3">
                  <span className="text-xs text-white/30 w-5 text-right flex-shrink-0">{i + 1}</span>
                  <TypeImage code={r.code} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white/80 text-sm">{t.name}</span>
                      <span className="text-[10px] font-mono text-white/30">{r.code}</span>
                    </div>
                    <p className="text-xs text-white/40">{r.label}</p>
                  </div>
                  <span className="text-pink-400 text-xs tracking-wider flex-shrink-0">{hearts(r.score)}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ========== Quiz Screen ==========
const scaleOptions = [
  { value: 2, label: 'Aに近い', color: 'bg-purple-500', ring: 'ring-purple-400' },
  { value: 1, label: 'ややA', color: 'bg-purple-400/60', ring: 'ring-purple-300' },
  { value: 0, label: '中間', color: 'bg-white/30', ring: 'ring-white/40' },
  { value: -1, label: 'ややB', color: 'bg-pink-400/60', ring: 'ring-pink-300' },
  { value: -2, label: 'Bに近い', color: 'bg-pink-500', ring: 'ring-pink-400' },
]

function QuizScreen({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState({ initiative: 0, tempo: 0, expression: 0, adventure: 0 })
  const [selected, setSelected] = useState(null)

  const question = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = (value) => {
    if (selected !== null) return
    setSelected(value)
    const newScores = { ...scores }
    newScores[question.axis] += value
    setScores(newScores)
    setTimeout(() => {
      if (current < questions.length - 1) { setCurrent(current + 1); setSelected(null) }
      else { onComplete(calculateType(newScores), newScores) }
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-12 max-w-lg mx-auto">
      <div className="mb-2 flex items-center justify-between text-xs text-white/40"><span>Q{current + 1} / {questions.length}</span><span>{Math.round(progress)}%</span></div>
      <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col">
          <div className="mb-8">
            <p className="text-xs text-purple-300 mb-3 tracking-wider">{question.axis === 'initiative' && '// 主導権'}{question.axis === 'tempo' && '// テンポ'}{question.axis === 'expression' && '// 表現スタイル'}{question.axis === 'adventure' && '// 冒険度'}</p>
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{question.text}</h2>
          </div>
          <div className="glass-card p-4 mb-6"><div className="flex items-center gap-3"><span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-300">A</span><span className="text-sm md:text-base text-white/80">{question.optionA.text}</span></div></div>
          <div className="flex items-center justify-between gap-2 mb-6 px-2">
            {scaleOptions.map((opt, i) => (
              <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => handleSelect(opt.value)} className={`flex flex-col items-center gap-2 transition-all duration-300 ${selected !== null && selected !== opt.value ? 'opacity-30' : ''}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selected === opt.value ? `${opt.color} ${opt.ring} ring-2 scale-110 shadow-lg` : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'}`}>
                  {selected === opt.value && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></motion.svg>}
                </div>
                <span className="text-[10px] md:text-xs text-white/40 whitespace-nowrap">{opt.label}</span>
              </motion.button>
            ))}
          </div>
          <div className="glass-card p-4"><div className="flex items-center gap-3"><span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-xs font-bold text-pink-300">B</span><span className="text-sm md:text-base text-white/80">{question.optionB.text}</span></div></div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function calculateType(scores) {
  return (scores.initiative >= 0 ? 'L' : 'F') + (scores.tempo >= 0 ? 'S' : 'Q') + (scores.expression >= 0 ? 'V' : 'A') + (scores.adventure >= 0 ? 'T' : 'C')
}

// ========== Result Screen ==========
const axes = [
  { key: 'initiative', label: '主導権', left: 'L', right: 'F', leftLabel: 'リード', rightLabel: '委ねる' },
  { key: 'tempo',      label: 'テンポ', left: 'S', right: 'Q', leftLabel: 'じっくり', rightLabel: '激しく' },
  { key: 'expression', label: '表現',   left: 'V', right: 'A', leftLabel: '言葉で', rightLabel: '雰囲気で' },
  { key: 'adventure',  label: '冒険度', left: 'T', right: 'C', leftLabel: '刺激派', rightLabel: '安定派' },
]

function generateResultImage(typeCode, data, scores) {
  const W = 1080, H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  const pad = 100
  const roundedRect = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath() }
  const text = (str, x, y, opts = {}) => { const { font = '36px sans-serif', color = '#fff', align = 'center', baseline = 'top' } = opts; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = baseline; ctx.fillText(str, x, y) }
  const wrapText = (str, x, y, maxW, lineH, font, color) => { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; const chars = [...str]; let line = '', cy = y; for (const ch of chars) { if (ctx.measureText(line + ch).width > maxW && line) { ctx.fillText(line, x, cy); line = ch; cy += lineH } else { line += ch } } if (line) ctx.fillText(line, x, cy); return cy + lineH }

  const bg = ctx.createLinearGradient(0,0,W,H); bg.addColorStop(0,'#0f0a1a'); bg.addColorStop(0.4,'#1a0e2e'); bg.addColorStop(1,'#12071f'); ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)
  const glow = ctx.createRadialGradient(W/2,500,0,W/2,500,600); glow.addColorStop(0,'rgba(139,92,246,0.12)'); glow.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle = glow; ctx.fillRect(0,0,W,H)
  const topLine = ctx.createLinearGradient(0,0,W,0); topLine.addColorStop(0,'#9333ea'); topLine.addColorStop(0.5,'#ec4899'); topLine.addColorStop(1,'#f97316'); ctx.fillStyle = topLine; ctx.fillRect(0,0,W,8)

  let y = 100
  text('あなたの夜の性格は…', W/2, y, { font: '600 36px sans-serif', color: 'rgba(255,255,255,0.4)' }); y += 80
  text(data.emoji, W/2, y, { font: '140px sans-serif' }); y += 180
  text(typeCode, W/2, y, { font: '600 52px monospace', color: '#c4b5fd' }); y += 80
  text(data.name, W/2, y, { font: '900 76px sans-serif' }); y += 100
  text(data.subtitle, W/2, y, { font: '400 36px sans-serif', color: 'rgba(255,255,255,0.5)' }); y += 90

  if (scores) {
    const barLeft = 220, barRight = W - 220, barW = barRight - barLeft, barH = 24
    const axesDef = [{ key:'initiative',leftLabel:'リード',rightLabel:'委ねる'},{key:'tempo',leftLabel:'じっくり',rightLabel:'激しく'},{key:'expression',leftLabel:'言葉で',rightLabel:'雰囲気で'},{key:'adventure',leftLabel:'刺激派',rightLabel:'安定派'}]
    const cardH = axesDef.length * 75 + 50; ctx.fillStyle = 'rgba(255,255,255,0.04)'; roundedRect(pad-20,y-30,W-(pad-20)*2,cardH,24); ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; roundedRect(pad-20,y-30,W-(pad-20)*2,cardH,24); ctx.stroke()
    y += 10
    for (const axis of axesDef) {
      const raw = scores[axis.key] || 0, pct = Math.max(0.03,(raw+6)/12)
      text(axis.leftLabel, barLeft-16, y+barH/2, { font:'500 28px sans-serif', color:'#c4b5fd', align:'right', baseline:'middle' })
      text(axis.rightLabel, barRight+16, y+barH/2, { font:'500 28px sans-serif', color:'#f9a8d4', align:'left', baseline:'middle' })
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; roundedRect(barLeft,y,barW,barH,barH/2); ctx.fill()
      const fillW = Math.max(barH, barW*pct), barGrad = ctx.createLinearGradient(barLeft,0,barLeft+fillW,0); barGrad.addColorStop(0,'#9333ea'); barGrad.addColorStop(1,'#ec4899'); ctx.fillStyle = barGrad; roundedRect(barLeft,y,fillW,barH,barH/2); ctx.fill()
      y += 75
    }
    y += 40
  }

  y = wrapText(data.description, W/2, y, W-pad*2, 60, '400 38px sans-serif', 'rgba(255,255,255,0.7)'); y += 50
  ctx.font = '400 28px sans-serif'; const tagRows = []; let currentRow = ''
  for (const tag of data.tags) { const test = currentRow ? currentRow+'   '+tag : tag; if (ctx.measureText(test).width > W-pad*2 && currentRow) { tagRows.push(currentRow); currentRow = tag } else currentRow = test }
  if (currentRow) tagRows.push(currentRow)
  for (const row of tagRows) { text(row, W/2, y, { font:'400 28px sans-serif', color:'rgba(255,255,255,0.25)' }); y += 42 }

  const brandY = H-130, brandGrad = ctx.createLinearGradient(W/2-200,0,W/2+200,0); brandGrad.addColorStop(0,'#9333ea'); brandGrad.addColorStop(0.5,'#ec4899'); brandGrad.addColorStop(1,'#f97316')
  text('夜の性格診断', W/2, brandY, { font:'700 42px sans-serif', color: brandGrad })
  text('#NightPersonality', W/2, brandY+56, { font:'400 28px sans-serif', color:'rgba(255,255,255,0.2)' })
  return canvas
}

function ResultScreen({ typeCode, scores, onRestart }) {
  const data = types[typeCode] || types['LSVT']
  const compatData = types[data.compatibility]
  const rarity = rarityData[typeCode]
  const tier = rarity ? tierColors[rarity.tier] : null
  const [phase, setPhase] = useState('analyze') // analyze -> reveal -> details

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 2200)
    const t2 = setTimeout(() => setPhase('details'), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const shareText = `【夜の性格診断】\n私の夜タイプは「${data.name}」${data.emoji}でした！\n${data.subtitle}\n\n#夜の性格診断 #NightPersonality`

  const handleShowImage = useCallback(() => {
    const canvas = generateResultImage(typeCode, data, scores)
    const dataUrl = canvas.toDataURL('image/png')
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.name} - 夜の性格診断</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0f0a1a;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;font-family:sans-serif}img{max-width:100%;max-height:85vh;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.5)}p{color:rgba(255,255,255,0.4);font-size:13px;margin-top:16px;text-align:center}</style></head><body><img src="${dataUrl}" alt="${data.name}"><p>画像を長押し（スマホ）または右クリック（PC）で保存できます</p></body></html>`)
      w.document.close()
    }
  }, [typeCode, data, scores])

  const handleShareX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
  const handleShareLINE = () => window.open(`https://line.me/R/share?text=${encodeURIComponent(shareText)}`, '_blank')
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: '夜の性格診断', text: shareText }) } catch {} }
    else { await navigator.clipboard.writeText(shareText); alert('コピーしました！SNSに貼り付けてシェアしてください') }
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-16 max-w-lg mx-auto">
      {/* Phase 1: Analyzing animation */}
      <AnimatePresence mode="wait">
        {phase === 'analyze' && (
          <motion.div key="analyze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            {/* Pulsing glow */}
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600/40 to-pink-500/40 blur-xl absolute" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 rounded-full border-2 border-transparent border-t-purple-400 border-r-pink-400 mb-8" />
            <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white/60 text-lg">
              あなたの夜を分析中...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2+3: Result reveal */}
      {phase !== 'analyze' && (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.5, rotateY: 90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }} className="text-center mb-8" style={{ perspective: '1000px' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5, type: 'spring', bounce: 0.5 }} className="mb-4">
              <TypeImage code={typeCode} size="xl" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/40 text-sm tracking-widest mb-2">YOUR NIGHT TYPE</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
              <p className="text-lg font-mono text-purple-300 tracking-[0.3em] mb-2">{typeCode}</p>
              <h1 className="text-3xl md:text-4xl font-black text-shimmer mb-3">{data.name}</h1>
              <p className="text-white/60 text-sm md:text-base">{data.subtitle}</p>
            </motion.div>
            {/* Rarity badge */}
            {rarity && tier && (
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0, type: 'spring', bounce: 0.5 }} className="mt-4 inline-flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tier.bg} ${tier.border} border ${tier.text}`}>
                  {rarity.tier} — {rarity.label}
                </span>
                <span className="text-xs text-white/30">全体の約{rarity.pct}%</span>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {phase === 'details' && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-5">
                {/* Score bars */}
                {scores && (
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold text-white/50 tracking-wider mb-4">YOUR SCORE</h3>
                    <div className="space-y-3">
                      {axes.map((axis) => {
                        const raw = scores[axis.key] || 0, pct = ((raw + 6) / 12) * 100
                        return (
                          <div key={axis.key}>
                            <div className="flex items-center justify-between text-[10px] text-white/40 mb-1"><span>{axis.label}</span></div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-purple-300 w-16 text-right">{axis.leftLabel}</span>
                              <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" /></div>
                              <span className="text-xs font-mono text-pink-300 w-16">{axis.rightLabel}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className={`glass-card-strong p-6 bg-gradient-to-br ${data.color} bg-opacity-10`}><h3 className="text-sm font-bold text-white/50 tracking-wider mb-3">PERSONALITY</h3><p className="text-white/90 leading-relaxed text-sm md:text-base">{data.description}</p></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6"><h3 className="text-sm font-bold text-purple-300 tracking-wider mb-3">🌙 NIGHT STYLE</h3><p className="text-white/70 leading-relaxed text-sm">{data.nightStyle}</p></motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6"><h3 className="text-sm font-bold text-pink-300 tracking-wider mb-3">💕 LOVE HINT</h3><p className="text-white/70 leading-relaxed text-sm">{data.loveHint}</p></motion.div>

                {/* Compatibility Top 3 */}
                {compatData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
                    <h3 className="text-sm font-bold text-amber-300 tracking-wider mb-4">✨ BEST MATCH</h3>
                    <div className="space-y-4">
                      {[
                        { code: data.compatibility, rank: 1, reason: data.compatReason, gold: true },
                        { code: data.compatibility2, rank: 2, reason: data.compatReason2 },
                        { code: data.compatibility3, rank: 3, reason: data.compatReason3 },
                      ].filter(m => m.code && types[m.code]).map((m, i) => {
                        const t = types[m.code]
                        return (
                          <div key={m.code}>
                            {i > 0 && <div className="border-t border-white/5 mb-4" />}
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${m.gold ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300' : 'bg-white/10 border border-white/20 text-white/50'}`}>{m.rank}</span>
                              <TypeImage code={m.code} size="md" />
                              <div className="min-w-0"><p className={`font-bold text-sm ${m.gold ? 'text-white/90' : 'text-white/70'}`}>{t.name}</p><p className="text-[10px] text-white/40 font-mono">{m.code} — {t.subtitle}</p></div>
                            </div>
                            {m.reason && <p className={`text-xs leading-relaxed ml-9 ${m.gold ? 'text-white/50' : 'text-white/40'}`}>{m.reason}</p>}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">{tag}</span>)}
                </motion.div>

                {/* Share buttons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="pt-4 space-y-3">
                  <button onClick={handleShowImage} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    ストーリー用の画像を作成
                  </button>

                  <div className="flex gap-3">
                    <button onClick={handleShareX} className="flex-1 py-3.5 rounded-xl bg-black border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      X
                    </button>
                    <button onClick={handleShareLINE} className="flex-1 py-3.5 rounded-xl bg-[#06C755] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                      LINE
                    </button>
                  </div>

                  <button onClick={handleShare} className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-bold text-sm hover:bg-white/10 transition-colors">結果をシェアする</button>
                  <button onClick={onRestart} className="w-full py-3 rounded-xl text-white/40 text-sm hover:text-white/60 transition-colors">もう一度診断する</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

// ========== Main App ==========
export default function App() {
  const [screen, setScreen] = useState('intro')
  const [resultType, setResultType] = useState(null)
  const [resultScores, setResultScores] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && <IntroScreen key="intro" onStart={() => setScreen('quiz')} onShowTypes={() => setScreen('types')} onShowAbout={() => setScreen('about')} onShowCompat={() => setScreen('compat')} onShowMatrix={() => setScreen('matrix')} />}
      {screen === 'quiz' && <QuizScreen key="quiz" onComplete={(type, scores) => { setResultType(type); setResultScores(scores); setScreen('result') }} />}
      {screen === 'result' && <ResultScreen key="result" typeCode={resultType} scores={resultScores} onRestart={() => { setResultType(null); setResultScores(null); setScreen('intro') }} />}
      {screen === 'types' && <TypesScreen key="types" onBack={() => setScreen('intro')} />}
      {screen === 'about' && <AboutScreen key="about" onBack={() => setScreen('intro')} onStart={() => setScreen('quiz')} />}
      {screen === 'compat' && <CompatScreen key="compat" onBack={() => setScreen('intro')} />}
      {screen === 'matrix' && <MatrixScreen key="matrix" onBack={() => setScreen('intro')} />}
    </AnimatePresence>
  )
}
