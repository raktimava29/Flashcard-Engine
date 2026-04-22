import { useEffect, useState } from "react";
import { Brain, CheckCircle, AlertCircle, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Questions() {
  const [card, setCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });

  const navigate = useNavigate();

  const BACKEND_URL = "https://flashcard-engine-5zbb.onrender.com";

  const loadCard = async () => {
    setLoading(true);
    setWaiting(false);

    try {
      const res = await fetch(`${BACKEND_URL}/next`);
      const data = await res.json();

      if (data.message) {
        setCard(null);
        setWaiting(true);
      } else {
        setCard(data);
        setShowAnswer(false);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error(" Error in loadCard:", err);
    }

    setLoading(false);
  };

  const rateCard = async (rating) => {
    setStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));

    try {
      const res = await fetch(`${BACKEND_URL}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      await res.json();
      loadCard();
    } catch (err) {
      console.error(err);
    }
  };

  const endSession = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/end`, {
        method: "POST",
      });

      await res.json();

      setCard(null);
      setWaiting(false);
      setStats({ easy: 0, medium: 0, hard: 0 });
    } catch (err) {
      console.error(" Error ending session:", err);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsFlipped(true);
  };

  useEffect(() => {
    loadCard();
  }, []);

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(() => {
        loadCard();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [waiting]);

  const totalCards = stats.easy + stats.medium + stats.hard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              🏠
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Flashcard Practice
                </h1>
                <p className="text-sm text-gray-600">
                  Master your concepts with spaced repetition
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={endSession}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            End Session
          </button>
        </div>

        {/* Stats Bar */}
        {totalCards > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Progress Today</span>
              <span className="text-sm font-bold text-gray-900">{totalCards} cards reviewed</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.easy}</div>
                <div className="text-xs text-gray-500">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
                <div className="text-xs text-gray-500">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.hard}</div>
                <div className="text-xs text-gray-500">Hard</div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <p className="text-gray-600 font-medium">Generating your next card...</p>
          </div>
        )}

        {/* Flashcards */}
        {card && card.question && !loading && (
          <div className="perspective-1000">
            <div
              className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${
                isFlipped ? "animate-flip" : ""
              }`}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm font-medium">
                    Card #{card.index}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm">Active</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!showAnswer ? (
                  <>
                    <div className="mb-6">
                      <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-4">
                        Question
                      </div>
                      <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                        {card.question}
                      </p>
                    </div>

                    <button
                      onClick={handleShowAnswer}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reveal Answer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-3">
                        Question
                      </div>
                      <p className="text-lg text-gray-700 font-medium">
                        {card.question}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-3">
                        Answer
                      </div>
                      <p className="text-xl text-gray-900 leading-relaxed">
                        {card.answer}
                      </p>
                    </div>

                    {/* Rating Buttons */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        How well did you know this?
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => rateCard("easy")}
                          className="group bg-green-50 hover:bg-green-500 text-green-700 hover:text-white py-4 px-4 rounded-xl transition-all duration-200 border-2 border-green-200 hover:border-green-500 hover:shadow-lg transform hover:-translate-y-1"
                        >
                          <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm font-semibold">Easy</span>
                        </button>
                        <button
                          onClick={() => rateCard("medium")}
                          className="group bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white py-4 px-4 rounded-xl transition-all duration-200 border-2 border-yellow-200 hover:border-yellow-500 hover:shadow-lg transform hover:-translate-y-1"
                        >
                          <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm font-semibold">Medium</span>
                        </button>
                        <button
                          onClick={() => rateCard("hard")}
                          className="group bg-red-50 hover:bg-red-500 text-red-700 hover:text-white py-4 px-4 rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-500 hover:shadow-lg transform hover:-translate-y-1"
                        >
                          <XCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm font-semibold">Hard</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {!loading && !card && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            {waiting ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                  <RotateCcw className="w-10 h-10 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Great work!
                </h2>
                <p className="text-gray-600 mb-4">
                  You've reviewed all available cards. Next cards will appear soon based on spaced repetition.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  Checking for new cards...
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Session Complete! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  Excellent work! You've completed your study session. Upload a new PDF or take a break.
                </p>
                {totalCards > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <p className="text-sm text-gray-600 mb-2">Session Summary</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{totalCards} cards reviewed</p>
                    <div className="flex justify-center gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-green-600">{stats.easy}</span>
                        <span className="text-gray-500"> easy</span>
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-600">{stats.medium}</span>
                        <span className="text-gray-500"> medium</span>
                      </div>
                      <div>
                        <span className="font-semibold text-red-600">{stats.hard}</span>
                        <span className="text-gray-500"> hard</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Questions;