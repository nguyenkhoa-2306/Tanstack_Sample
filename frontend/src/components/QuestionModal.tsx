import React from "react";
import { useForm, Controller } from "react-hook-form";

interface QuestionForm {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  keywords?: string;
}

interface QuestionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    text: string;
    options: string[];
    correctAnswerIndex: number;
    keywords?: string[];
  }) => void;
  isLoading?: boolean;
  initialData?: Partial<{
    text: string;
    options: string[];
    correctAnswerIndex: number;
    keywords: string[];
  }>;
  isEdit?: boolean;
}

const defaultOptions = ["", "", "", ""];

const QuestionModal: React.FC<QuestionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  isEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuestionForm>({
    defaultValues: {
      text: initialData?.text || "",
      options: initialData?.options || defaultOptions,
      correctAnswerIndex: initialData?.correctAnswerIndex ?? 0,
      keywords: initialData?.keywords?.join(", ") || "",
    },
  });

  React.useEffect(() => {
    if (visible) {
      reset({
        text: initialData?.text || "",
        options: initialData?.options || defaultOptions,
        correctAnswerIndex: initialData?.correctAnswerIndex ?? 0,
        keywords: initialData?.keywords?.join(", ") || "",
      });
    }
  }, [visible, initialData, reset]);

  if (!visible) return null;

  const options = watch("options");

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
          maxWidth: 420,
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
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 22,
            textAlign: "center",
            color: "#2d3748",
          }}
        >
          {isEdit ? "Sửa câu hỏi" : "Thêm câu hỏi"}
        </h2>
        <form
          onSubmit={handleSubmit((data) => {
            const keywordsArr = data.keywords
              ? data.keywords
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean)
              : undefined;
            onSubmit({
              text: data.text,
              options: data.options,
              correctAnswerIndex: Number(data.correctAnswerIndex),
              keywords:
                keywordsArr && keywordsArr.length > 0 ? keywordsArr : undefined,
            });
          })}
          style={{ width: "100%" }}
        >
          <div style={{ marginBottom: errors.text ? 6 : 18 }}>
            <input
              {...register("text", {
                required: "Nội dung câu hỏi không được để trống",
              })}
              placeholder="Nội dung câu hỏi"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: errors.text
                  ? "1.5px solid #e53e3e"
                  : "1px solid #cbd5e1",
                borderRadius: 7,
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
            {errors.text && (
              <div style={{ color: "#e53e3e", fontSize: 14, marginTop: 4 }}>
                {errors.text.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 6,
                display: "block",
              }}
            >
              Đáp án
            </label>
            {options.map((opt, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <input
                  {...register(`options.${idx}`, {
                    required: "Không được để trống đáp án",
                  })}
                  placeholder={`Đáp án ${idx + 1}`}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: errors.options?.[idx]
                      ? "1.5px solid #e53e3e"
                      : "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 15,
                    marginRight: 10,
                  }}
                />
                <input
                  type="radio"
                  {...register("correctAnswerIndex", { required: true })}
                  value={idx}
                  checked={Number(watch("correctAnswerIndex")) === idx}
                  onChange={() => setValue("correctAnswerIndex", idx)}
                  style={{ marginLeft: 4, marginRight: 2 }}
                />
                <span style={{ fontSize: 14, color: "#2d3748" }}>Đúng</span>
              </div>
            ))}
            {errors.options &&
              typeof errors.options === "object" &&
              Array.isArray(errors.options) &&
              errors.options.some(Boolean) && (
                <div style={{ color: "#e53e3e", fontSize: 14, marginTop: 4 }}>
                  {errors.options.find((e) => e)?.message}
                </div>
              )}
          </div>
          <div style={{ marginBottom: 18 }}>
            <input
              {...register("keywords")}
              placeholder="Từ khóa (phân cách bởi dấu phẩy, optional)"
              style={{
                width: "100%",
                padding: "8px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: "#3182ce",
                color: "white",
                padding: "10px 28px",
                border: "none",
                borderRadius: 7,
                fontWeight: 600,
                fontSize: 16,
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
              }}
            >
              {isEdit
                ? isLoading
                  ? "Đang cập nhật..."
                  : "Cập nhật"
                : isLoading
                ? "Đang thêm..."
                : "Thêm mới"}
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

export default QuestionModal;
