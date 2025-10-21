import { useState } from "react";
import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const [raindrops, setRaindrops] = useState<Array<{ id: number; color: string; x: number }>>([]);

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://www.instagram.com/edit.vaults?igsh=MWZneHMzemFuMDBxbQ%3D%3D&utm_source=qr",
      gradient: "from-pink-500 via-purple-500 to-orange-500",
      rainColor: "#E1306C"
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      url: "https://youtube.com/@editsvault1st?si=2HgbH-Spdp82s4FW",
      gradient: "from-red-600 to-red-500",
      rainColor: "#FF0000"
    },
    { 
      name: "TikTok", 
      icon: MessageCircle, 
      url: "https://www.tiktok.com/@edits.vault0?_t=ZS-90f2txXnVJ9&_r=1",
      gradient: "from-cyan-400 via-pink-500 to-red-500",
      rainColor: "#00F2EA"
    },
  ];

  const handleClick = (e: React.MouseEvent, color: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const newDrops = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      color,
      x: x + (Math.random() - 0.5) * 100
    }));
    
    setRaindrops(prev => [...prev, ...newDrops]);
    
    setTimeout(() => {
      setRaindrops(prev => prev.filter(drop => !newDrops.find(d => d.id === drop.id)));
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-glow overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron text-gradient">
            Connect With Us
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 relative">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleClick(e, social.rainColor)}
              className={`relative flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r ${social.gradient} hover:opacity-90 transition-all hover-glow overflow-hidden group`}
            >
              <social.icon className="w-6 h-6 text-white relative z-10" />
              <span className="font-medium text-white relative z-10">{social.name}</span>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </a>
          ))}
          
          {/* Rain animation */}
          {raindrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-1 h-8 rounded-full animate-[slide-in-right_1s_ease-out] pointer-events-none"
              style={{
                backgroundColor: drop.color,
                left: `${drop.x}px`,
                top: '-32px',
                animation: 'rain 1s ease-in forwards',
                boxShadow: `0 0 10px ${drop.color}`
              }}
            />
          ))}
        </div>
        
        <style>{`
          @keyframes rain {
            from {
              transform: translateY(0) rotate(15deg);
              opacity: 1;
            }
            to {
              transform: translateY(400px) rotate(15deg);
              opacity: 0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
