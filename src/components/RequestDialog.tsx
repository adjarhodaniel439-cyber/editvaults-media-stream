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
    // Load all requests
    const { data: requests, error } = await supabase
      .from("character_requests")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading requests:", error);
      return;
    }

    // Load all existing characters
    const { data: characters } = await supabase
      .from("characters")
      .select("name");

    // Normalize character names for comparison
    const normalizedCharacterNames = (characters || []).map(char => 
      char.name.toLowerCase().replace(/[\s-]/g, '')
    );

    // Check for pending requests that match existing characters
    const pendingRequests = (requests || []).filter(req => req.status === 'pending');
    const requestsToFulfill: string[] = [];

    pendingRequests.forEach(request => {
      const normalizedRequestName = request.character_name.toLowerCase().replace(/[\s-]/g, '');
      if (normalizedCharacterNames.includes(normalizedRequestName)) {
        requestsToFulfill.push(request.id);
      }
    });

    // Auto-fulfill matching requests
    if (requestsToFulfill.length > 0) {
      await supabase
        .from("character_requests")
        .update({
          status: "fulfilled",
          fulfilled_at: new Date().toISOString()
        })
        .in("id", requestsToFulfill);

      // Reload requests after updating
      const { data: updatedRequests } = await supabase
        .from("character_requests")
        .select("*")
        .order("status", { ascending: true })
        .order("created_at", { ascending: false });

      setRequests(updatedRequests || []);
    } else {
      setRequests(requests || []);
    }
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

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from("character_requests")
      .select("*")
      .ilike("character_name", requestName.trim())
      .eq("status", "pending")
      .maybeSingle();

    if (existingRequest) {
      toast.error("This character has already been requested");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("character_requests")
      .insert([{ character_name: requestName.trim() }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error("This character has already been requested");
      } else {
        toast.error("Failed to submit request");
        console.error(error);
      }
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
