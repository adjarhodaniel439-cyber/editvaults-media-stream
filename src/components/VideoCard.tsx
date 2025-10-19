import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VideoCardProps {
  youtubeLink: string;
  title: string;
  category: string;
  characterName?: string;
  characterImageUrl?: string;
}

const VideoCard = ({ youtubeLink, title, category, characterName, characterImageUrl }: VideoCardProps) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(youtubeLink);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = () => {
    window.open(`https://ytdown.io/en2/?url=${encodeURIComponent(youtubeLink)}`, '_blank');
  };

  const embedUrl = getYouTubeEmbedUrl(youtubeLink);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="card-glow rounded-xl p-4 hover-glow">
      <div className="aspect-video rounded-lg overflow-hidden mb-4">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <Badge variant="secondary" className="shrink-0">
            {category}
          </Badge>
        </div>

        {characterName && (
          <div className="flex items-center gap-3">
            {characterImageUrl && (
              <img 
                src={characterImageUrl} 
                alt={characterName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <p className="text-sm text-muted-foreground">
              {category} • {characterName}
            </p>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/50">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Download className="w-4 h-4" />
            How to Download
          </h4>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-primary mt-0.5">1.</span>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-2">Copy the video link:</p>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-primary mt-0.5">2.</span>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-2">Click to download:</p>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
