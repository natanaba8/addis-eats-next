import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  return (
    <nav className="top-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
