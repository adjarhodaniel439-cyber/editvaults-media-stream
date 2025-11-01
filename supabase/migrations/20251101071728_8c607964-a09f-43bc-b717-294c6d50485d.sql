-- Add unique constraint to prevent duplicate pending requests
CREATE UNIQUE INDEX unique_pending_character_request 
ON public.character_requests (character_name) 
WHERE status = 'pending';