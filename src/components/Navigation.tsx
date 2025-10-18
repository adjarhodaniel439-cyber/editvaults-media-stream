import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactDialog from "@/components/ContactDialog";

const Navigation = () => {
  const location = useLocation();
  const [contactOpen, setContactOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/admin" className="w-full cursor-pointer">
                  Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContactOpen(true)}>
                Contact Us
              </DropdownMenuItem>
              <DropdownMenuItem onClick={scrollToAbout}>
                About Us
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </nav>
  );
};

export default Navigation;
