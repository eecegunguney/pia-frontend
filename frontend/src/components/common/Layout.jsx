import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}