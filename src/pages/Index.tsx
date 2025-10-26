import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import VideoCard from "@/components/VideoCard";
import AboutSection from "@/components/AboutSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface Video {
  id: string;
  youtube_link: string;
  title: string;
  category_id: string;
  character_id: string | null;
  created_at: string;
}

interface Character {
  id: string;
  name: string;
  image_url?: string;
  category_id: string;
}

interface CharacterWithVideos extends Character {
  videos: Video[];
}

interface Category {
  id: string;
  name: string;
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("edits");
  const [displayCount, setDisplayCount] = useState(12);
  const [videos, setVideos] = useState<Video[]>([]);
  const [charactersWithVideos, setCharactersWithVideos] = useState<CharacterWithVideos[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterWithVideos | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomizedCharacters, setRandomizedCharacters] = useState<CharacterWithVideos[]>([]);
  const observerTarget = useRef(null);

  useEffect(() => {
    loadData();
    subscribeToChanges();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*");
    
    if (categoriesData) {
      const categoriesMap: Record<string, Category> = {};
      categoriesData.forEach((cat) => {
        categoriesMap[cat.id] = cat;
      });
      setCategories(categoriesMap);
    }

    // Load characters and videos
    const { data: charactersData } = await supabase
      .from("characters")
      .select("*");
    
    const { data: videosData } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (charactersData && videosData) {
      // Group videos by character
      const charactersMap: Record<string, CharacterWithVideos> = {};
      charactersData.forEach((char) => {
        charactersMap[char.id] = {
          ...char,
          videos: []
        };
      });
      
      // Separate videos into character videos and standalone edits
      const characterVideos: Video[] = [];
      const standaloneVideos: Video[] = [];
      
      videosData.forEach((video) => {
        if (video.character_id && charactersMap[video.character_id]) {
          charactersMap[video.character_id].videos.push(video);
          characterVideos.push(video);
        } else {
          standaloneVideos.push(video);
        }
      });
      
      const allCharacters = Object.values(charactersMap).filter(char => char.videos.length > 0);
      setCharactersWithVideos(allCharacters);
      // Randomize characters
      const randomized = [...allCharacters].sort(() => Math.random() - 0.5);
      setRandomizedCharacters(randomized);
      setVideos(standaloneVideos);
    }

    setLoading(false);
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredVideos = activeCategory === "edits"
    ? videos
    : videos.filter((video) => {
        const category = categories[video.category_id];
        return category?.name.toLowerCase() === activeCategory.toLowerCase();
      });

  // Search across all categories
  const searchFilteredCharacters = searchQuery
    ? randomizedCharacters.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory === "edits" || activeCategory === "all"
    ? []
    : randomizedCharacters.filter((char) => {
        const category = categories[char.category_id];
        return category?.name.toLowerCase() === activeCategory.toLowerCase();
      });

  const displayedVideos = filteredVideos.slice(0, displayCount);
  const displayedCharacters = searchFilteredCharacters.slice(0, displayCount);
  const hasMoreVideos = displayCount < filteredVideos.length;
  const hasMoreCharacters = displayCount < searchFilteredCharacters.length;

  const loadMore = useCallback(() => {
    if (hasMoreCharacters || hasMoreVideos) {
      setDisplayCount(prev => prev + 12);
    }
  }, [hasMoreCharacters, hasMoreVideos]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedCharacter(null);
    setDisplayCount(12);
    setSearchQuery("");
  };

  const categoryButtons = [
    { id: "edits", label: "EDITS" },
    { id: "anime", label: "Anime" },
    { id: "music", label: "Music" },
    { id: "movies", label: "Movies" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search characters across all categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(12);
              }}
              className="pl-10 py-6 text-lg bg-card border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categoryButtons.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={
                activeCategory === category.id
                  ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover-glow"
                  : ""
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeCategory === "edits" ? (
          // EDITS Section - Standalone videos without characters
          filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-orbitron text-muted-foreground mb-4">
                No edits yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    youtubeLink={video.youtube_link}
                    title={video.title}
                    category={categories[video.category_id]?.name || "Unknown"}
                  />
                ))}
              </div>
              
              {hasMoreVideos && <div ref={observerTarget} className="h-10" />}
            </>
          )
        ) : selectedCharacter ? (
          // Character Detail View - Show selected character's videos
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedCharacter(null)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Characters
            </Button>
            
            {/* Character Header */}
            <div className="flex items-center gap-4 border-b border-border pb-4">
              {selectedCharacter.image_url && (
                <img 
                  src={selectedCharacter.image_url} 
                  alt={selectedCharacter.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                />
              )}
              <h2 className="text-4xl font-orbitron font-bold text-gradient">
                {selectedCharacter.name}
              </h2>
            </div>
            
            {/* Character Videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCharacter.videos.map((video) => (
                <VideoCard
                  key={video.id}
                  youtubeLink={video.youtube_link}
                  title={video.title}
                  category={categories[video.category_id]?.name || "Unknown"}
                  characterName={selectedCharacter.name}
                  characterImageUrl={selectedCharacter.image_url}
                />
              ))}
            </div>
          </div>
        ) : (
          // Character List View - Show character cards
          displayedCharacters.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-orbitron text-muted-foreground mb-4">
                {searchQuery ? "No characters found" : "No characters yet"}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Check back soon for new content!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedCharacters.map((character) => (
                  <div
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    className="group cursor-pointer card-glow rounded-lg overflow-hidden bg-card hover:scale-105 transition-transform"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      {character.image_url ? (
                        <img 
                          src={character.image_url} 
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-6xl font-orbitron text-muted-foreground">
                            {character.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-orbitron font-bold text-center text-gradient">
                        {character.name}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mt-1">
                        {character.videos.length} {character.videos.length === 1 ? 'video' : 'videos'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMoreCharacters && <div ref={observerTarget} className="h-10 mt-8" />}
            </>
          )
        )}
      </main>

      <AboutSection />
    </div>
  );
};

export default Index;
