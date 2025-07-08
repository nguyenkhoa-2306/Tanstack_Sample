import http from "../utils/http";
import { Quiz, Quizzes } from "../types/quiz.types";

export const getQuizzes = (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal
) =>
  http.get<Quizzes>("/quizzes", {
    params: {
      _page: page,
      _limit: limit,
    },
    signal,
  });

export const getQuiz = (id: number | string) =>
  http.get<Quiz>(`/quizzes/${id}`);

export const addQuiz = (quiz: Omit<Quiz, "id">) =>
  http.post<Quiz>("/quizzes", quiz);

export const updateQuiz = (id: number | string, quiz: Omit<Quiz, "id">) =>
  http.put<Quiz>(`/quizzes/${id}`, quiz);

export const deleteQuiz = (id: number | string) =>
  http.delete(`/quizzes/${id}`);
