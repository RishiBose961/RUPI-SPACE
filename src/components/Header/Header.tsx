import { Link } from "react-router";
import { ModeToggle } from "../mode-toggle";

const Header = () => {

  return (
    <header className="w-full border-b mb-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo Section */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Rupi Space Logo"
              className="size-12 object-contain"
            />
            <h1 className="text-xl font-mono font-bold tracking-wide ">
              RUPI SPACE
            </h1>
          </Link>

        </div>

        <div>
          <ModeToggle />
        </div>

      </div>
    </header>
  );
};

export default Header;
