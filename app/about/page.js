import Link from "next/link";

export const metadata = {
  title: "Our story",
  description:
    "Meet the people and family cooking traditions behind Addis Eats and our Ethiopian menu.",
};

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">A family story</p>
        <h1>About Addis Eats</h1>
        <p>
          Addis Eats offers traditional and popular Ethiopian dishes—give it a try!
        </p>
        <p>
          Addis Eats,  የኢትዮጵያውያን ባህላዊ እና ተወዳጅ ምግቦችን ለእናንተ ለተጠቃሚዎቹ ያቀርባ ይሞክሩት ይጠቀሙ !
        </p>
        <Link href="/menu" className="primary-button">
          Preview our dishes
        </Link>
      </section>
    </main>
  );
}
