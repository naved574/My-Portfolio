import Logo from "@/assets/icons/navLogo.svg";
import SkillsMenu from "@/components/layout/SkillsMenu";
export default function Footer() {
  return (
    <footer className=" border-t border-[color:var(--color-border)] dark:bg-[color:var(--color-text)] text-[color:var(--sec-color-text)] transition-colors duration-700">
      <div className="mx-auto grid grid-cols-2 max-w-6xl items-center justify-between gap-4 md:gap-40 px-5 py-8 text-sm text-center text-[color:var(--color-muted)] md:flex-row md:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          <a href="/">
            <div className="grid place-items-center w-30 rounded-md cursor-pointer">
              <img src={Logo} alt="logo" className="object-contain" />
            </div>
          </a>
          <span>© {new Date().getFullYear()} Mohmad Naved. All rights reserved.</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
          <a href="#home" className="hover:text-[color:var(--color-text)]">Home</a>
          <a href="#projects" className="hover:text-[color:var(--color-text)]">Projects</a>
          <a href="#contact" className="hover:text-[color:var(--color-text)]">Contact</a>
        </div>
      </div>
    </footer>
  );
}