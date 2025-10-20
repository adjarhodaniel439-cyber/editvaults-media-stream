import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const characterSchema = z.object({
  name: z.string().trim().min(1, "Character name is required").max(100, "Character name must be less than 100 characters"),
  category_id: z.string().uuid("Invalid category selected"),
});

const videoSchema = z.object({
  title: z.string().trim().min(1, "Video title is required").max(500, "Video title must be less than 500 characters"),
  youtube_link: z.string().trim().url("Invalid URL").regex(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/, "Must be a valid YouTube URL"),
  character_id: z.string().uuid("Invalid character selected"),
  category_id: z.string().uuid("Invalid category selected"),
});

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterImage, setNewCharacterImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCharacters(selectedCategory);
    }
  }, [selectedCategory]);

  const handleLogin = () => {
    if (password === "editvaults") {
      setIsAuthenticated(true);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password");
    }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setNewCharacterImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCharacter = async () => {
    try {
      setUploadingImage(true);
      
      const validatedData = characterSchema.parse({
        name: newCharacterName,
        category_id: selectedCategory,
      });

      let imageUrl = null;

      // Upload image if provided
      if (newCharacterImage) {
        const fileExt = newCharacterImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('character-images')
          .upload(filePath, newCharacterImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          toast.error("Failed to upload image");
          console.error(uploadError);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('character-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("characters")
        .insert({
          name: validatedData.name,
          category_id: validatedData.category_id,
          image_url: imageUrl,
        });

      if (error) {
        toast.error("Failed to create character");
        return;
      }

      toast.success("Character created successfully!");
      setNewCharacterName("");
      setNewCharacterImage(null);
      setImagePreview("");
      loadCharacters(selectedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to create character");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePostVideo = async () => {
    try {
      const validatedData = videoSchema.parse({
        title: videoTitle,
        youtube_link: videoLink,
        character_id: selectedCharacter,
        category_id: selectedCategory,
      });

      const { error } = await supabase
        .from("videos")
        .insert({
          youtube_link: validatedData.youtube_link,
          title: validatedData.title,
          character_id: validatedData.character_id,
          category_id: validatedData.category_id,
        });

      if (error) {
        toast.error("Failed to post video");
        return;
      }

      toast.success("Video posted successfully!");
      setVideoLink("");
      setVideoTitle("");
      setSelectedCharacter("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to post video");
      }
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <Card className="w-full max-w-md card-glow">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-gradient text-center">
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-gradient text-center">
            Admin Panel
          </h1>
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
                <Label>Category</Label>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="grid-cols-2 gap-4 mt-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={cat.id} id={`char-cat-${cat.id}`} />
                      <Label htmlFor={`char-cat-${cat.id}`} className="cursor-pointer font-normal">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
                <Label htmlFor="char-image">Character Image (optional)</Label>
                <Input
                  id="char-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: 5MB. Supported formats: JPG, PNG, WEBP
                </p>
              </div>

              {imagePreview && (
                <div className="rounded-lg overflow-hidden border border-border p-4">
                  <Label className="mb-2 block">Image Preview</Label>
                  <img 
                    src={imagePreview} 
                    alt="Character preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                  />
                </div>
              )}

              <Button
                onClick={handleCreateCharacter}
                disabled={uploadingImage}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Create Character"
                )}
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
                <Label>Category</Label>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="grid-cols-2 gap-4 mt-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={cat.id} id={`video-cat-${cat.id}`} />
                      <Label htmlFor={`video-cat-${cat.id}`} className="cursor-pointer font-normal">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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

              {videoLink && getYouTubeEmbedUrl(videoLink) && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <div className="aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(videoLink) || ''}
                      title="Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

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
