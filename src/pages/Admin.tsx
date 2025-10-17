import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterImage, setNewCharacterImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  useEffect(() => {
    checkUser();
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCharacters(selectedCategory);
    }
  }, [selectedCategory]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    setLoading(false);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    if (error) {
      toast.error("Failed to load categories");
      return;
    }
    setCategories(data || []);
  };

  const loadCharacters = async (categoryId: string) => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");
    
    if (error) {
      toast.error("Failed to load characters");
      return;
    }
    setCharacters(data || []);
  };

  const handleCreateCharacter = async () => {
    if (!selectedCategory || !newCharacterName) {
      toast.error("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("characters")
      .insert({
        name: newCharacterName,
        category_id: selectedCategory,
        image_url: newCharacterImage || null,
      });

    if (error) {
      toast.error("Failed to create character");
      return;
    }

    toast.success("Character created successfully!");
    setNewCharacterName("");
    setNewCharacterImage("");
    loadCharacters(selectedCategory);
  };

  const handlePostVideo = async () => {
    if (!selectedCategory || !selectedCharacter || !videoLink || !videoTitle) {
      toast.error("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("videos")
      .insert({
        youtube_link: videoLink,
        title: videoTitle,
        character_id: selectedCharacter,
        category_id: selectedCategory,
      });

    if (error) {
      toast.error("Failed to post video");
      return;
    }

    toast.success("Video posted successfully!");
    setVideoLink("");
    setVideoTitle("");
    setSelectedCharacter("");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-gradient">
            Admin Panel
          </h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-gradient">
                Add New Character
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="char-category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="char-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="char-name">Character Name</Label>
                <Input
                  id="char-name"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  placeholder="Enter character name"
                />
              </div>

              <div>
                <Label htmlFor="char-image">Image URL (optional)</Label>
                <Input
                  id="char-image"
                  value={newCharacterImage}
                  onChange={(e) => setNewCharacterImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <Button
                onClick={handleCreateCharacter}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Create Character
              </Button>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-gradient">
                Post New Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video-category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="video-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-character">Character</Label>
                <Select 
                  value={selectedCharacter} 
                  onValueChange={setSelectedCharacter}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger id="video-character">
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-link">YouTube Link</Label>
                <Input
                  id="video-link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <Label htmlFor="video-title">Video Title</Label>
                <Textarea
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title/caption"
                  rows={3}
                />
              </div>

              <Button
                onClick={handlePostVideo}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Post Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
