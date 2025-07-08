import React from "react";

const Header: React.FC = () => (
  <header
    style={{
      width: "100%",
      background: "#2d3748",
      color: "white",
      padding: "18px 32px",
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      minHeight: 60,
    }}
  >
    <span style={{ fontWeight: 900, fontSize: 26, marginRight: 16 }}>
      QuizAdmin
    </span>
    <span style={{ opacity: 0.7, fontSize: 18 }}>Quản lý Quiz</span>
  </header>
);

export default Header;
