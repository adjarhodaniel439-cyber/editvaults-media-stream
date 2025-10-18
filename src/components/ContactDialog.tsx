import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/edit.vaults?igsh=MWZneHMzemFuMDBxbQ%3D%3D&utm_source=qr" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@editsvault1st?si=2HgbH-Spdp82s4FW" },
    { name: "TikTok", icon: MessageCircle, url: "https://www.tiktok.com/@edits.vault0?_t=ZS-90f2txXnVJ9&_r=1" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default ContactDialog;
