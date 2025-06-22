import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import QuizPage from "./pages/QuizPage";
// import QuestionPage from "./pages/QuestionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quizzes" />} />
      <Route path="/quizzes" element={<QuizPage />} />
      {/* <Route path="/questions" element={<QuestionPage />} /> */}
    </Routes>
  );
}

export default App;
