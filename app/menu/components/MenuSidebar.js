"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { menuItems } from "./MenuList";

export default function MenuSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="menu-sidebar-panel">
      <div className="menu-sidebar-header">
        <p className="eyebrow">Browse dishes</p>
        <button
          type="button"
          className="secondary-button sidebar-toggle"
          onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>

      <nav className="menu-nav" aria-label="Menu section navigation">
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
      </nav>

      {isExpanded ? (
        <p className="sidebar-note">
          Your selection remains in this sidebar while you move between menu pages.
        </p>
      ) : null}
    </div>
  );
}
