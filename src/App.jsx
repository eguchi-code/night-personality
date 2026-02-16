import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from './data/questions'
import types from './data/types'

// ========== Intro Screen ==========
function IntroScreen({ onStart, onShowTypes, onShowAbout }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Logo */}
      <motion.img
        src="/logo.png"
        alt="夜の性格診断"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, type: 'spring', bounce: 0.3 }}
        className="w-72 md:w-96 mb-10"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="text-white/70 text-center max-w-md mb-12 text-sm md:text-base leading-relaxed"
      >
        あなたの夜の過ごし方には、<br className="md:hidden" />
        隠された<span className="text-purple-300 font-medium">本当の性格</span>が表れる。<br />
        <br />
        12の質問に答えるだけで、<br className="md:hidden" />
        全16タイプから<span className="text-pink-300 font-medium">あなたの夜型</span>を診断。
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
      >
        診断をはじめる
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="mt-6 text-white/30 text-xs"
      >
        所要時間：約2分 / 全12問
      </motion.p>

      {/* Sub navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="mt-8 flex gap-3"
      >
        <button
          onClick={onShowTypes}
          className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors"
        >
          16のタイプ
        </button>
        <button
          onClick={onShowAbout}
          className="glass-card px-5 py-2.5 text-sm text-white/60 hover:text-white/90 transition-colors"
        >
          診断とは？
        </button>
      </motion.div>
    </motion.div>
  )
}

// ========== Types Screen (16タイプ一覧) ==========
function TypesScreen({ onBack }) {
  const [expanded, setExpanded] = useState(null)
  const typeEntries = Object.entries(types)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-shimmer">全16タイプ</h1>
      </div>

      {/* Type cards */}
      <div className="space-y-3">
        {typeEntries.map(([code, data], i) => (
          <motion.div
            key={code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <button
              onClick={() => setExpanded(expanded === code ? null : code)}
              className="w-full text-left glass-card p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl flex-shrink-0">{data.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-300">{code}</span>
                    <span className="font-bold text-white/90 text-sm">{data.name}</span>
                  </div>
                  <p className="text-xs text-white/50 truncate">{data.subtitle}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${expanded === code ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.tags.map((tag, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </button>

            {/* Accordion detail */}
            <AnimatePresence>
              {expanded === code && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card p-5 mt-1 space-y-4 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white/40 tracking-wider mb-2">PERSONALITY</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{data.description}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-300 tracking-wider mb-2">NIGHT STYLE</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{data.nightStyle}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-pink-300 tracking-wider mb-2">LOVE HINT</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{data.loveHint}</p>
                    </div>
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

// ========== About Screen (診断とは？) ==========
function AboutScreen({ onBack, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-screen px-4 py-8 md:py-12 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-shimmer">診断とは？</h1>
      </div>

      <div className="space-y-5">
        {/* Section 1: About this quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold text-purple-300 tracking-wider mb-4">この診断について</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            この診断は、あなたの夜の過ごし方から性格タイプを分析します。以下の4つの軸であなたの傾向を測定します。
          </p>
          <div className="space-y-3">
            {[
              { axis: '主導権', desc: 'リードする（L）か、委ねる（F）か', color: 'text-purple-300' },
              { axis: 'テンポ', desc: 'じっくり（S）か、スピーディー（Q）か', color: 'text-pink-300' },
              { axis: '表現', desc: '言葉で伝える（V）か、雰囲気で伝える（A）か', color: 'text-amber-300' },
              { axis: '冒険度', desc: '刺激を求める（T）か、安定を好む（C）か', color: 'text-teal-300' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`text-xs font-bold ${item.color} flex-shrink-0 mt-0.5`}>{item.axis}</span>
                <span className="text-xs text-white/50">{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 2: How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold text-pink-300 tracking-wider mb-4">診断の仕組み</h3>
          <div className="space-y-3 text-sm text-white/70 leading-relaxed">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">1</span>
              <span>全12問の質問に5段階で回答</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-xs font-bold text-pink-300 flex-shrink-0">2</span>
              <span>4つの軸それぞれのスコアを集計</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-300 flex-shrink-0">3</span>
              <span>スコアから4文字のタイプコードを決定</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xs font-bold text-teal-300 flex-shrink-0">4</span>
              <span>全16タイプからあなたの夜型を特定</span>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Type code reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold text-amber-300 tracking-wider mb-4">タイプコードの読み方</h3>
          <p className="text-xs text-white/50 mb-4">4文字のコードが、あなたの夜の性格を表します。</p>
          <div className="space-y-2.5">
            {[
              { pos: '1文字目', a: 'L = Lead（リードする）', b: 'F = Follow（委ねる）' },
              { pos: '2文字目', a: 'S = Slow（じっくり）', b: 'Q = Quick（スピーディー）' },
              { pos: '3文字目', a: 'V = Verbal（言葉で）', b: 'A = Atmosphere（雰囲気で）' },
              { pos: '4文字目', a: 'T = Thrill（刺激派）', b: 'C = Comfort（安定派）' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3">
                <span className="text-xs font-bold text-white/60 block mb-1">{item.pos}</span>
                <div className="flex flex-col gap-0.5 text-xs text-white/50">
                  <span>{item.a}</span>
                  <span>{item.b}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <button
            onClick={onStart}
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
          >
            診断をはじめる
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ========== Quiz Screen ==========
// 5-point scale: +2 (strongly A), +1 (slightly A), 0 (neutral), -1 (slightly B), -2 (strongly B)
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
      if (current < questions.length - 1) {
        setCurrent(current + 1)
        setSelected(null)
      } else {
        const type = calculateType(newScores)
        onComplete(type, newScores)
      }
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-12 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-xs text-white/40">
        <span>Q{current + 1} / {questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col"
        >
          {/* Question */}
          <div className="mb-8">
            <p className="text-xs text-purple-300 mb-3 tracking-wider">
              {question.axis === 'initiative' && '// 主導権'}
              {question.axis === 'tempo' && '// テンポ'}
              {question.axis === 'expression' && '// 表現スタイル'}
              {question.axis === 'adventure' && '// 冒険度'}
            </p>
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
              {question.text}
            </h2>
          </div>

          {/* Option A label */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-300">A</span>
              <span className="text-sm md:text-base text-white/80">{question.optionA.text}</span>
            </div>
          </div>

          {/* 5-point scale */}
          <div className="flex items-center justify-between gap-2 mb-6 px-2">
            {scaleOptions.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(opt.value)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  selected !== null && selected !== opt.value ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  selected === opt.value
                    ? `${opt.color} ${opt.ring} ring-2 scale-110 shadow-lg`
                    : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }`}>
                  {selected === opt.value && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 text-white"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-[10px] md:text-xs text-white/40 whitespace-nowrap">{opt.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Option B label */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-xs font-bold text-pink-300">B</span>
              <span className="text-sm md:text-base text-white/80">{question.optionB.text}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function calculateType(scores) {
  const l1 = scores.initiative >= 0 ? 'L' : 'F'
  const l2 = scores.tempo >= 0 ? 'S' : 'Q'
  const l3 = scores.expression >= 0 ? 'V' : 'A'
  const l4 = scores.adventure >= 0 ? 'T' : 'C'
  return l1 + l2 + l3 + l4
}

// ========== Result Screen ==========
const axes = [
  { key: 'initiative', label: '主導権', left: 'L', right: 'F', leftLabel: 'リード', rightLabel: '委ねる' },
  { key: 'tempo',      label: 'テンポ', left: 'S', right: 'Q', leftLabel: 'じっくり', rightLabel: '激しく' },
  { key: 'expression', label: '表現',   left: 'V', right: 'A', leftLabel: '言葉で', rightLabel: '雰囲気で' },
  { key: 'adventure',  label: '冒険度', left: 'T', right: 'C', leftLabel: '刺激派', rightLabel: '安定派' },
]

function ResultScreen({ typeCode, scores, onRestart }) {
  const data = types[typeCode] || types['LSVT']
  const compatData = types[data.compatibility]
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const shareText = `【夜の性格診断】\n私の夜タイプは「${data.name}」${data.emoji}でした！\n${data.subtitle}\n\n#夜の性格診断 #NightPersonality`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '夜の性格診断', text: shareText })
      } catch (e) { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText)
      alert('コピーしました！SNSに貼り付けてシェアしてください')
    }
  }

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-16 max-w-lg mx-auto">
      {/* Reveal animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.5 }}
          className="text-7xl md:text-8xl mb-4"
        >
          {data.emoji}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 text-sm tracking-widest mb-2"
        >
          YOUR NIGHT TYPE
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-lg font-mono text-purple-300 tracking-[0.3em] mb-2">{typeCode}</p>
          <h1 className="text-3xl md:text-4xl font-black text-shimmer mb-3">{data.name}</h1>
          <p className="text-white/60 text-sm md:text-base">{data.subtitle}</p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            {/* Score bars */}
            {scores && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white/50 tracking-wider mb-4">YOUR SCORE</h3>
                <div className="space-y-3">
                  {axes.map((axis) => {
                    const raw = scores[axis.key] || 0
                    const pct = ((raw + 6) / 12) * 100
                    return (
                      <div key={axis.key}>
                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                          <span>{axis.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-purple-300 w-16 text-right">{axis.leftLabel}</span>
                          <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                          </div>
                          <span className="text-xs font-mono text-pink-300 w-16">{axis.rightLabel}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Type card */}
            <div className={`glass-card-strong p-6 bg-gradient-to-br ${data.color} bg-opacity-10`}>
              <h3 className="text-sm font-bold text-white/50 tracking-wider mb-3">PERSONALITY</h3>
              <p className="text-white/90 leading-relaxed text-sm md:text-base">{data.description}</p>
            </div>

            {/* Night style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-bold text-purple-300 tracking-wider mb-3">🌙 NIGHT STYLE</h3>
              <p className="text-white/70 leading-relaxed text-sm">{data.nightStyle}</p>
            </motion.div>

            {/* Love hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-bold text-pink-300 tracking-wider mb-3">💕 LOVE HINT</h3>
              <p className="text-white/70 leading-relaxed text-sm">{data.loveHint}</p>
            </motion.div>

            {/* Compatibility */}
            {compatData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <h3 className="text-sm font-bold text-amber-300 tracking-wider mb-3">✨ BEST MATCH</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{compatData.emoji}</span>
                  <div>
                    <p className="font-bold text-white/90">{compatData.name}</p>
                    <p className="text-xs text-white/50 font-mono">{data.compatibility}</p>
                    <p className="text-xs text-white/50 mt-1">{compatData.subtitle}</p>
                  </div>
                </div>
                {data.compatReason && (
                  <p className="text-xs text-white/50 mt-3 leading-relaxed">{data.compatReason}</p>
                )}
              </motion.div>
            )}

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-2"
            >
              {data.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="pt-4 space-y-3"
            >
              <button
                onClick={handleShareX}
                className="w-full py-3.5 rounded-xl bg-black border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Xでシェアする
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                結果をシェアする
              </button>

              <button
                onClick={onRestart}
                className="w-full py-3 rounded-xl text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                もう一度診断する
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== Main App ==========
export default function App() {
  const [screen, setScreen] = useState('intro') // intro, quiz, result, types, about
  const [resultType, setResultType] = useState(null)
  const [resultScores, setResultScores] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <IntroScreen
          key="intro"
          onStart={() => setScreen('quiz')}
          onShowTypes={() => setScreen('types')}
          onShowAbout={() => setScreen('about')}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          key="quiz"
          onComplete={(type, scores) => {
            setResultType(type)
            setResultScores(scores)
            setScreen('result')
          }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          key="result"
          typeCode={resultType}
          scores={resultScores}
          onRestart={() => {
            setResultType(null)
            setResultScores(null)
            setScreen('intro')
          }}
        />
      )}
      {screen === 'types' && (
        <TypesScreen key="types" onBack={() => setScreen('intro')} />
      )}
      {screen === 'about' && (
        <AboutScreen key="about" onBack={() => setScreen('intro')} onStart={() => setScreen('quiz')} />
      )}
    </AnimatePresence>
  )
}
