import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

interface NavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Navigation = ({ activeCategory, onCategoryChange }: NavigationProps) => {
  const categories = [
    { id: "all", label: "Home" },
    { id: "anime", label: "Anime" },
    { id: "music", label: "Music" },
    { id: "movies", label: "Movies" },
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
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover-glow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
