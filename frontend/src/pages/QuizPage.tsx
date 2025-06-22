import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz } from "../apis/quizApi";
import { Quiz } from "../types/quiz.types";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQueryString } from "../utils/utils";

function QuizPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  const quizzesQuery = useQuery({
    queryKey: ['quizzes', page],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getQuizzes(page, 10, controller.signal)
    },
    
    
    retry: 0
  });
  console.log(quizzesQuery.data);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {/* {editingQuiz ? "Sửa Quiz" : "Thêm Quiz"} */}
      </h1>

      {quizzesQuery.isLoading && <p>Đang tải...</p>}

      <h2 className="text-xl font-semibold mb-2">Danh sách Quiz</h2>

      <ul className="space-y-2">
        {quizzesQuery.data?.data.map((quiz) => (
          <li
            key={quiz.id}
            className="border p-4 rounded shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{quiz.title}</h3>
              <p className="text-sm text-gray-600">{quiz.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:underline">Sửa</button>
              <button className="text-red-600 hover:underline">Xoá</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>Trang {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Trang sau
        </button>
      </div> */}
    </div>
  );
}

export default QuizPage;
