import React from "react";
import { useForm } from "react-hook-form";
import { Quiz } from "../types/quiz.types";

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Quiz, "id">) => void;
  initialData?: Omit<Quiz, "id">;
  isEdit?: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Quiz, "id">>({
    defaultValues: initialData || { title: "", description: "" },
  });

  React.useEffect(() => {
    reset(initialData || { title: "", description: "" });
  }, [initialData, visible, reset]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "32px 28px 24px 28px",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "none",
            border: "none",
            fontSize: 26,
            color: "#888",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 22,
            textAlign: "center",
            color: "#2d3748",
          }}
        >
          {isEdit ? "Sửa Quiz" : "Thêm Quiz"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <div style={{ marginBottom: errors.title ? 6 : 18 }}>
            <input
              {...register("title", {
                required: "Tên quiz không được để trống",
              })}
              placeholder="Tiêu đề quiz"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: errors.title
                  ? "1.5px solid #e53e3e"
                  : "1px solid #cbd5e1",
                borderRadius: 7,
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
            {errors.title && (
              <div style={{ color: "#e53e3e", fontSize: 14, marginTop: 4 }}>
                {errors.title.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 24 }}>
            <textarea
              {...register("description")}
              placeholder="Mô tả quiz"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: 7,
                fontSize: 16,
                minHeight: 60,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                background: "#3182ce",
                color: "white",
                padding: "10px 28px",
                border: "none",
                borderRadius: 7,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
              }}
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#a0aec0",
                color: "white",
                padding: "10px 28px",
                border: "none",
                borderRadius: 7,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
