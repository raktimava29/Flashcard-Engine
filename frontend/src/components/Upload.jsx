import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      navigate("/practice");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-4">
          Upload PDF
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Generate Flashcards"}
        </button>

      </div>
    </div>
  );
}

export default Upload;