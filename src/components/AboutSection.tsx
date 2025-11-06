import { Instagram, Youtube, MessageCircle, MessageSquare } from "lucide-react";

const AboutSection = () => {
  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://www.instagram.com/edit.vaults?igsh=MWZneHMzemFuMDBxbQ%3D%3D&utm_source=qr",
      gradient: "from-pink-500 via-purple-500 to-orange-500"
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      url: "https://youtube.com/@editsvault1st?si=2HgbH-Spdp82s4FW",
      gradient: "from-red-600 to-red-500"
    },
    { 
      name: "TikTok", 
      icon: MessageCircle, 
      url: "https://www.tiktok.com/@edits.vault0?_t=ZS-90f2txXnVJ9&_r=1",
      gradient: "from-cyan-400 via-pink-500 to-red-500"
    },
    { 
      name: "WhatsApp", 
      icon: MessageSquare, 
      url: "https://wa.me/2349064235533",
      gradient: "from-green-500 to-green-600"
    },
  ];

  return (
    <section id="about-section" className="bg-gradient-to-b from-background to-muted py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient">
          About EDITVAULTS
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          EDITVAULTS is a free entertainment space that curates Anime, Music, and Movie edits 
          directly from YouTube. We don't host videos — we just share them. Our mission is to 
          bring you the best curated content from across the web, all in one beautiful platform.
        </p>

        {/* Video Preview */}
        <div className="my-8">
          <h3 className="text-xl md:text-2xl font-orbitron font-semibold mb-4 text-gradient">
            How It Works
          </h3>
          <div className="aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden card-glow">
            <iframe
              src="https://www.youtube.com/embed/rTVYjgcdjws"
              title="How EDITVAULTS Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Contact Links */}
        <div className="pt-8">
          <h3 className="text-xl md:text-2xl font-orbitron font-semibold mb-6 text-gradient">
            Connect With Us
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r ${social.gradient} hover:opacity-90 transition-all hover-glow group`}
              >
                <social.icon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border mt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EDITVAULTS. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

