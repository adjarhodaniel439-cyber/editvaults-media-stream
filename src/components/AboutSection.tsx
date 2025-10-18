const AboutSection = () => {
  return (
    <section id="about-section" className="bg-gradient-to-b from-background to-muted py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient">
          About EDITVAULTS
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          EDITVAULTS is a free entertainment space that curates Anime, Music, and Movie edits 
          directly from YouTube. We don't host videos — we just share them. Our mission is to 
          bring you the best curated content from across the web, all in one beautiful platform.
        </p>

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

