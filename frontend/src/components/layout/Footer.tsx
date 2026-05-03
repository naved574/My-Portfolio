import Logo from "@/assets/icons/logo.svg";
export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[color:var(--color-muted)] md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <a href="#home">
            <div className="grid place-items-center w-30 rounded-md cursor-pointer">
              <img src={Logo} alt="logo" className="object-contain" />
            </div>
          </a>
          <span>© {new Date().getFullYear()} Mohmad Naved. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#home" className="hover:text-[color:var(--color-text)]">Home</a>
          <a href="#projects" className="hover:text-[color:var(--color-text)]">Projects</a>
          <a href="#contact" className="hover:text-[color:var(--color-text)]">Contact</a>
        </div>
      </div>
    </footer>
  );
}