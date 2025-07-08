import React from "react";

const Sidebar: React.FC = () => (
  <aside
    style={{
      width: 200,
      background: "#f1f5f9",
      minHeight: "calc(100vh - 60px)",
      padding: "32px 0",
      boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }}
  >
    <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <a
        href="#"
        style={{
          color: "#2d3748",
          fontWeight: 600,
          fontSize: 17,
          textDecoration: "none",
          padding: "8px 24px",
          borderRadius: 6,
          background: "#e2e8f0",
          transition: "background 0.2s",
          marginLeft: 8,
        }}
      >
        Quản lý Quiz
      </a>
    </nav>
  </aside>
);

export default Sidebar;
