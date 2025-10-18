import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AboutSection = () => {
  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/edit.vaults?igsh=MWZneHMzemFuMDBxbQ%3D%3D&utm_source=qr" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@editsvault1st?si=2HgbH-Spdp82s4FW" },
    { name: "TikTok", icon: MessageCircle, url: "https://www.tiktok.com/@edits.vault0?_t=ZS-90f2txXnVJ9&_r=1" },
  ];

  return (
    <section className="bg-gradient-to-b from-background to-muted py-16 px-4 border-t border-border">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient">
          About EDITVAULTS
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          EDITVAULTS is a free entertainment space that curates Anime, Music, and Movie edits 
          directly from YouTube. We don't host videos — we just share them. Our mission is to 
          bring you the best curated content from across the web, all in one beautiful platform.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover-glow"
            >
              Contact Me
            </Button>
          </DialogTrigger>
          <DialogContent className="card-glow">
            <DialogHeader>
              <DialogTitle className="text-2xl font-orbitron text-gradient">
                Connect With Us
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-all hover-glow"
                >
                  <social.icon className="w-6 h-6 text-primary" />
                  <span className="font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} EDITVAULTS. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
