import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./components/Upload";
import Questions from "./components/Questions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/practice" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
}