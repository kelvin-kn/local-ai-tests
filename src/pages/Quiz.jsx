import { useState } from 'react'

const questions = [
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    answer: 1,
  },
  {
    question: 'Which element has the chemical symbol "Fe"?',
    options: ['Fluorine', 'Iron', 'Francium', 'Fermium'],
    answer: 1,
  },
  {
    question: 'In what year did the Berlin Wall fall?',
    options: ['1987', '1989', '1991', '1985'],
    answer: 1,
  },
  {
    question: 'What is the smallest country in the world by area?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
    answer: 2,
  },
  {
    question: 'Which programming language was created by Brendan Eich?',
    options: ['Java', 'Python', 'JavaScript', 'C++'],
    answer: 2,
  },
  {
    question: 'What is the speed of light in vacuum (approx.)?',
    options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
    answer: 0,
  },
  {
    question: 'Who painted "The Starry Night"?',
    options: ['Monet', 'Van Gogh', 'Picasso', 'Dali'],
    answer: 1,
  },
  {
    question: 'What is the hardest natural substance on Earth?',
    options: ['Titanium', 'Quartz', 'Diamond', 'Graphene'],
    answer: 2,
  },
  {
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    answer: 3,
  },
  {
    question: 'What is the most abundant gas in Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    answer: 2,
  },
]

function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answered, setAnswered] = useState(false)

  const q = questions[current]

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === q.answer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAnswered(false)
  }

  const percentage = Math.round((score / questions.length) * 100)

  return (
    <div className="min-h-screen bg-[#0a1a12] text-emerald-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        <header className="mb-12">
          <a
            href="/"
            className="text-emerald-700 hover:text-emerald-500 transition-colors text-xs tracking-widest uppercase font-mono-editorial"
          >
            ← Back to Launcher
          </a>
          <h1 className="text-4xl font-light tracking-tight text-emerald-100 mt-4 mb-2">
            Trivia Quiz
          </h1>
          <p className="text-emerald-600 text-sm">
            {finished ? 'Quiz Complete' : `${current + 1} of ${questions.length} questions`}
          </p>
        </header>

        {!finished ? (
          <>
            <div className="mb-8">
              <div className="h-px bg-emerald-900/50 mb-8"></div>
              <p className="text-xl text-emerald-100 font-light leading-relaxed mb-8">
                {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((option, i) => {
                  let style = 'border-emerald-900/40 text-emerald-300 hover:border-emerald-700/60 hover:bg-emerald-900/20'
                  if (answered) {
                    if (i === q.answer) {
                      style = 'border-emerald-500 bg-emerald-900/30 text-emerald-100'
                    } else if (i === selected && i !== q.answer) {
                      style = 'border-red-900/60 bg-red-900/10 text-red-300'
                    } else {
                      style = 'border-emerald-900/20 text-emerald-700'
                    }
                  } else if (selected === i) {
                    style = 'border-emerald-500 bg-emerald-900/20 text-emerald-100'
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                      className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="text-sm">{option}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {answered && (
              <div className="flex items-center justify-between">
                <p className={`text-sm ${selected === q.answer ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selected === q.answer ? 'Correct!' : 'Incorrect'}
                </p>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-sm tracking-wide transition-colors"
                >
                  {current + 1 < questions.length ? 'Next →' : 'See Results'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-emerald-400 mb-6">{percentage >= 70 ? '◈' : percentage >= 40 ? '◇' : '○'}</div>
            <h2 className="text-3xl font-light text-emerald-100 mb-4">
              Score: {score} / {questions.length}
            </h2>
            <p className="text-emerald-600 mb-10">
              {percentage >= 90 ? 'Outstanding!' : percentage >= 70 ? 'Well done!' : percentage >= 40 ? 'Not bad.' : 'Keep trying!'}
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-sm tracking-wide transition-colors"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
