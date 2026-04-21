import { useEffect, useState } from "react";

function Questions() {
  const [card, setCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [ratingsMap, setRatingsMap] = useState({});

  const BACKEND_URL = "http://127.0.0.1:8000";

  const loadCard = async () => {
    setLoading(true);
    setFeedback("");
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

        const prevRating = ratingsMap[data.question];
        if (prevRating) {
          console.log(`🔁 Repeated card | Previous rating: ${prevRating}`);
        } else {
          console.log("🆕 First time seeing this card");
        }
      }
    } catch (err) {
      console.error("❌ Error in loadCard:", err);
    }

    setLoading(false);
  };

  const rateCard = async (rating) => {
    try {
      const res = await fetch(`${BACKEND_URL}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();

      setRatingsMap(prev => ({
        ...prev,
        [card.question]: rating
      }));

      setFeedback(`Marked as ${rating.toUpperCase()}`);
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

      const data = await res.json();

      setCard(null);
      setWaiting(false);
    } catch (err) {
      console.error("❌ Error ending session:", err);
    }
  }

  useEffect(() => {
    loadCard();
  }, []);

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(() => {
        loadCard();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [waiting]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Flashcard Practice
        </h1>

        <button
          onClick={endSession}
          className="text-sm bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
        >
          End Session
        </button>
      </div>

        {loading && (
          <div className="text-center text-gray-600">
            Generating cards...
          </div>
        )}

        {feedback && (
          <div className="text-center text-green-600 mb-4">
            {feedback}
          </div>
        )}

        {card && card.question ? (
          <div className="bg-white shadow-md rounded-xl p-6 transition-all">

            <p className="text-sm text-gray-500 mb-2">Question {card.index}</p>
            <p className="text-lg font-medium mb-4">
              {card.question}
            </p>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Show Answer
              </button>
            ) : (
              <>
                <p className="text-sm text-gray-500 mt-4">Answer</p>
                <p className="text-gray-800 mb-4">
                  {card.answer}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => rateCard("easy")}
                    className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => rateCard("medium")}
                    className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => rateCard("hard")}
                    className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Hard
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          !loading && (
            <div className="text-center text-gray-600">
              {waiting ? (
              <p>
                ⏳ All cards reviewed — next ones will appear soon
              </p>
            ) : (
              <p>
                🎉 Session complete! You can upload a new file or restart.
              </p>
            )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Questions;