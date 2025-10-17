import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="EDITVAULTS" className="w-12 h-12 rounded-lg" />
            <h1 className="text-2xl font-orbitron font-bold text-gradient">
              EDITVAULTS
            </h1>
          </Link>

          <div className="flex gap-2 md:gap-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={location.pathname === link.path ? "default" : "outline"}
                  className={
                    location.pathname === link.path
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      : ""
                  }
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
