import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from './data/questions'
import types from './data/types'

// ========== Intro Screen ==========
function IntroScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Moon decoration */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
        className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-200 mb-8 relative animate-pulse-glow"
      >
        <div className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 opacity-30" />
        <div className="absolute top-8 left-4 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 opacity-20" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl md:text-6xl font-black text-center mb-3 text-shimmer tracking-tight"
      >
        夜の性格診断
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-base md:text-lg text-white/50 font-light tracking-widest mb-10"
      >
        YOUR NIGHT PERSONALITY TYPE
      </motion.p>

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
        onComplete(type)
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
function ResultScreen({ typeCode, onRestart }) {
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
  const [screen, setScreen] = useState('intro') // intro, quiz, result
  const [resultType, setResultType] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <IntroScreen key="intro" onStart={() => setScreen('quiz')} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          key="quiz"
          onComplete={(type) => {
            setResultType(type)
            setScreen('result')
          }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          key="result"
          typeCode={resultType}
          onRestart={() => {
            setResultType(null)
            setScreen('intro')
          }}
        />
      )}
    </AnimatePresence>
  )
}
