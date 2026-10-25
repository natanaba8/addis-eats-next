"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MenuSidebar({ menuItems }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="menu-sidebar-panel">
      <div className="menu-sidebar-header">
        <p className="eyebrow">Browse dishes</p>
        <button
          type="button"
          className="secondary-button sidebar-toggle"
          aria-expanded={isExpanded}
          aria-controls="menu-section-navigation"
          onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>

      <nav
        id="menu-section-navigation"
        className="menu-nav"
        aria-label="Menu section navigation"
        hidden={!isExpanded}
      >
        <Link
          href="/menu"
          className={pathname === "/menu" ? "menu-nav-link active" : "menu-nav-link"}
        >
          All dishes
        </Link>

        {menuItems.map((item) => (
          <Link
            key={item.slug}
            href={`/menu/${item.slug}`}
            className={
              pathname === `/menu/${item.slug}`
                ? "menu-nav-link active"
                : "menu-nav-link"
            }
          >
            {item.name}
          </Link>
        ))}

        <Link
          href="/menu/new"
          className={pathname === "/menu/new" ? "menu-nav-link active" : "menu-nav-link"}
        >
          + Add a dish (admin)
        </Link>
      </nav>

      {isExpanded ? (
        <p className="sidebar-note"></p>
      ) : null}
    </div>
  );
}
