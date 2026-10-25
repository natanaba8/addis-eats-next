import MenuSidebar from "./components/MenuSidebar";
import { listDishes } from "./lib/dishes";

export default function MenuLayout({ children }) {
  // Only name and slug are sent to the client sidebar.
  const menuItems = listDishes().map(({ name, slug }) => ({ name, slug }));

  return (
    <div className="menu-layout">
      <aside className="menu-sidebar" aria-label="Menu navigation sidebar">
        <MenuSidebar menuItems={menuItems} />
      </aside>
      <div className="menu-content">{children}</div>
    </div>
  );
}
