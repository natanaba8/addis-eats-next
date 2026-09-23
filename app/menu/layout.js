import MenuSidebar from "./components/MenuSidebar";

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout">
      <aside className="menu-sidebar" aria-label="Menu navigation sidebar">
        <MenuSidebar />
      </aside>
      <div className="menu-content">{children}</div>
    </div>
  );
}
