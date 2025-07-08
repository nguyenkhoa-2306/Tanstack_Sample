import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz } from "../apis/quizApi";
import { Quiz } from "../types/quiz.types";
import { useQueryString } from "../utils/utils";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import QuizModal from "../components/QuizModal";

function QuizPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  const queryClient = useQueryClient();
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<
    Omit<Quiz, "id"> | undefined
  >(undefined);

  // Query lấy danh sách quiz
  const quizzesQuery = useQuery({
    queryKey: ["quizzes", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const res = await getQuizzes(page, 10, controller.signal);
      // Map lại id cho mỗi quiz
      const data = Array.isArray(res.data)
        ? res.data.map((quiz: any) => ({ ...quiz, id: quiz._id || quiz.id }))
        : [];
      return { ...res, data };
    },
    retry: 0,
  });

  // Mutation tạo quiz
  const addQuizMutation = useMutation({
    mutationFn: addQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Mutation sửa quiz
  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Quiz, "id"> }) =>
      updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setEditingQuiz(null);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật quiz:", error);
    },
  });

  // Mutation xóa quiz
  const deleteQuizMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  // Mở modal thêm mới
  const openAddModal = () => {
    setModalEdit(false);
    setModalInitialData(undefined);
    setModalOpen(true);
  };

  // Mở modal sửa
  const openEditModal = (quiz: Quiz) => {
    setModalEdit(true);
    setModalInitialData({ title: quiz.title, description: quiz.description });
    setEditingQuiz(quiz);
    setModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingQuiz(null);
    setModalInitialData(undefined);
  };

  // Xử lý submit modal
  const handleModalSubmit = (data: Omit<Quiz, "id">) => {
    if (modalEdit && editingQuiz) {
      updateQuizMutation.mutate({ id: editingQuiz.id, data });
    } else {
      addQuizMutation.mutate(data);
    }
    closeModal();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "32px 0" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 24,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#2d3748",
                  margin: 0,
                }}
              >
                Danh sách Quiz
              </h2>
              <button
                onClick={openAddModal}
                style={{
                  background: "#3182ce",
                  color: "white",
                  padding: "10px 24px",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                + Thêm Quiz
              </button>
            </div>
            {quizzesQuery.isLoading && (
              <p style={{ color: "#3182ce", textAlign: "center" }}>
                Đang tải...
              </p>
            )}
            {quizzesQuery.isError && (
              <p style={{ color: "#e53e3e", textAlign: "center" }}>
                Lỗi tải dữ liệu!
              </p>
            )}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th
                    style={{
                      padding: 12,
                      borderBottom: "2px solid #e2e8f0",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: 12,
                      borderBottom: "2px solid #e2e8f0",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Tiêu đề
                  </th>
                  <th
                    style={{
                      padding: 12,
                      borderBottom: "2px solid #e2e8f0",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Mô tả
                  </th>
                  <th
                    style={{
                      padding: 12,
                      borderBottom: "2px solid #e2e8f0",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizzesQuery.data?.data.map((quiz, idx) => (
                  <tr
                    key={quiz.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: 12 }}>{idx + 1}</td>
                    <td style={{ padding: 12 }}>{quiz.title}</td>
                    <td style={{ padding: 12 }}>{quiz.description}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        onClick={() => openEditModal(quiz)}
                        style={{
                          color: "#3182ce",
                          background: "none",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          textDecoration: "underline",
                          marginRight: 12,
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteQuizMutation.mutate(quiz.id)}
                        style={{
                          color: "#e53e3e",
                          background: "none",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        disabled={deleteQuizMutation.isPending}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <QuizModal
              visible={modalOpen}
              onClose={closeModal}
              onSubmit={handleModalSubmit}
              initialData={modalInitialData}
              isEdit={modalEdit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizPage;
