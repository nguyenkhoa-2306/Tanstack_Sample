
import { axiosInstance } from "./axiosInstance";
import { Questions } from "../types/question.types";

export const getQuestions = async (): Promise<Questions[]> => {
  const res = await axiosInstance.get("/questions");
  return res.data;
};

export const createQuestion = async (question: Questions): Promise<Questions> => {
  const res = await axiosInstance.post("/questions", question);
  return res.data;
};

export const updateQuestion = async (id: number, question: Questions): Promise<Questions> => {
  const res = await axiosInstance.put(`/questions/${id}`, question);
  return res.data;
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/questions/${id}`);
};
