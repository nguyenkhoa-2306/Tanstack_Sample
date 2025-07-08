import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import QuestionModal from "../components/QuestionModal";
import http from "../utils/http";
import Swal from "sweetalert2";

const fetchQuiz = (quizId: string) => http.get(`/quizzes/${quizId}`);
const fetchQuestion = (questionId: string) =>
  http.get(`/questions/${questionId}`);
const createQuestion = ({ quizId, data }: { quizId: string; data: any }) =>
  http.post(`/quizzes/${quizId}/question`, data);
const updateQuestion = ({
  questionId,
  data,
}: {
  questionId: string;
  data: any;
}) => http.put(`/questions/${questionId}`, data);
const deleteQuestion = (questionId: string) =>
  http.delete(`/questions/${questionId}`);

const QuizDetailPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  // Fetch quiz detail (có cả questions)
  const quizQuery = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz(quizId!),
    enabled: !!quizId,
  });

  // Fetch question detail khi sửa
  const questionDetailQuery = useQuery({
    queryKey: ["question", editQuestionId],
    queryFn: () => fetchQuestion(editQuestionId!),
    enabled: !!editQuestionId,
  });

  // Mutation tạo câu hỏi
  const createQuestionMutation = useMutation({
    mutationFn: (data: any) => createQuestion({ quizId: quizId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      setModalOpen(false);
    },
  });

  // Mutation sửa câu hỏi
  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: any }) =>
      updateQuestion({ questionId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      setEditQuestionId(null);
      setModalOpen(false);
    },
  });

  // Mutation xóa câu hỏi
  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });

  const handleCreateQuestion = (data: any) => {
    createQuestionMutation.mutate(data);
  };

  const handleEditQuestion = (q: any) => {
    setEditQuestionId(q._id || q.id);
    setModalOpen(true);
  };

  const handleUpdateQuestion = (data: any) => {
    if (editQuestionId) {
      updateQuestionMutation.mutate({ questionId: editQuestionId, data });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận xoá",
      text: "Bạn có chắc chắn muốn xoá câu hỏi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#a0aec0",
    });
    if (result.isConfirmed) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  // Hiện thông báo thành công/thất bại cho mutation
  React.useEffect(() => {
    if (createQuestionMutation.isSuccess) {
      Swal.fire({
        title: "Thành công",
        text: "Tạo câu hỏi thành công!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (createQuestionMutation.isError) {
      Swal.fire({
        title: "Thất bại",
        text: "Tạo câu hỏi thất bại!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }, [createQuestionMutation.isSuccess, createQuestionMutation.isError]);

  React.useEffect(() => {
    if (updateQuestionMutation.isSuccess) {
      Swal.fire({
        title: "Thành công",
        text: "Cập nhật câu hỏi thành công!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (updateQuestionMutation.isError) {
      Swal.fire({
        title: "Thất bại",
        text: "Cập nhật câu hỏi thất bại!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }, [updateQuestionMutation.isSuccess, updateQuestionMutation.isError]);

  React.useEffect(() => {
    if (deleteQuestionMutation.isSuccess) {
      Swal.fire({
        title: "Thành công",
        text: "Xoá câu hỏi thành công!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (deleteQuestionMutation.isError) {
      Swal.fire({
        title: "Thất bại",
        text: "Xoá câu hỏi thất bại!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }, [deleteQuestionMutation.isSuccess, deleteQuestionMutation.isError]);

  const quiz = quizQuery.data?.data;
  const questions = quiz?.questions || [];

  // Chuẩn bị dữ liệu cho modal khi sửa
  const initialData =
    editQuestionId && questionDetailQuery.data?.data
      ? {
          text: questionDetailQuery.data.data.text,
          options: questionDetailQuery.data.data.options,
          correctAnswerIndex: questionDetailQuery.data.data.correctAnswerIndex,
          keywords: questionDetailQuery.data.data.keywords,
        }
      : undefined;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "32px 0" }}>
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              padding: 24,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                borderRadius: 10,
                border: "none",
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ←
            </button>
            {quizQuery.isLoading && (
              <p style={{ color: "#3182ce", textAlign: "center" }}>
                Đang tải...
              </p>
            )}
            {quizQuery.isError && (
              <p style={{ color: "#e53e3e", textAlign: "center" }}>
                Lỗi tải dữ liệu!
              </p>
            )}
            {quiz && (
              <>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: 8,
                  }}
                >
                  {quiz.title}
                </h2>
                <p style={{ color: "#4a5568", marginBottom: 24 }}>
                  {quiz.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#2d3748",
                      margin: 0,
                    }}
                  >
                    Danh sách câu hỏi
                  </h3>
                  <button
                    onClick={() => {
                      setEditQuestionId(null);
                      setModalOpen(true);
                    }}
                    style={{
                      background: "#3182ce",
                      color: "white",
                      padding: "8px 20px",
                      border: "none",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    + Tạo câu hỏi
                  </button>
                </div>
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
                          padding: 10,
                          borderBottom: "2px solid #e2e8f0",
                          textAlign: "left",
                          fontWeight: 700,
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          padding: 10,
                          borderBottom: "2px solid #e2e8f0",
                          textAlign: "left",
                          fontWeight: 700,
                        }}
                      >
                        Nội dung câu hỏi
                      </th>
                      <th
                        style={{
                          padding: 10,
                          borderBottom: "2px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            textAlign: "center",
                            color: "#888",
                            padding: 18,
                          }}
                        >
                          Chưa có câu hỏi nào
                        </td>
                      </tr>
                    )}
                    {questions.map((q: any, idx: number) => (
                      <tr
                        key={q._id || q.id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <td style={{ padding: 10 }}>{idx + 1}</td>
                        <td style={{ padding: 10 }}>{q.text}</td>
                        <td style={{ padding: 10, textAlign: "center" }}>
                          <button
                            onClick={() => handleEditQuestion(q)}
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
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q._id || q.id)}
                            style={{
                              color: "#e53e3e",
                              background: "none",
                              border: "none",
                              fontWeight: 600,
                              fontSize: 15,
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            disabled={deleteQuestionMutation.isPending}
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <QuestionModal
                  visible={modalOpen}
                  onClose={() => {
                    setModalOpen(false);
                    setEditQuestionId(null);
                  }}
                  onSubmit={
                    editQuestionId ? handleUpdateQuestion : handleCreateQuestion
                  }
                  isLoading={
                    editQuestionId
                      ? updateQuestionMutation.isPending
                      : createQuestionMutation.isPending
                  }
                  initialData={initialData}
                  isEdit={!!editQuestionId}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizDetailPage;
