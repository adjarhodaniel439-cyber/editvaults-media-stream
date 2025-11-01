import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquarePlus, Check } from "lucide-react";

interface CharacterRequest {
  id: string;
  character_name: string;
  status: string;
  created_at: string;
  fulfilled_at: string | null;
}

export const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requests, setRequests] = useState<CharacterRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from("character_requests")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading requests:", error);
      return;
    }

    setRequests(data || []);
  };

  useEffect(() => {
    if (open) {
      loadRequests();
    }
  }, [open]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestName.trim()) {
      toast.error("Please enter a character name");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("character_requests")
      .insert([{ character_name: requestName.trim() }]);

    if (error) {
      toast.error("Failed to submit request");
      console.error(error);
    } else {
      toast.success("Character request submitted!");
      setRequestName("");
      loadRequests();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Character</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter character name..."
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">All Requests</h3>
          <div className="space-y-2">
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No requests yet</p>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    request.status === "fulfilled"
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {request.status === "fulfilled" && (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    <span className={request.status === "fulfilled" ? "line-through opacity-60" : ""}>
                      {request.character_name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
