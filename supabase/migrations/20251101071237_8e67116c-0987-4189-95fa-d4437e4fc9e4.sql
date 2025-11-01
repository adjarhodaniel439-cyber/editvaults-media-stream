-- Create character requests table
CREATE TABLE public.character_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.character_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for character requests
CREATE POLICY "Anyone can view character requests"
ON public.character_requests
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert character requests"
ON public.character_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update character requests"
ON public.character_requests
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_character_requests_status ON public.character_requests(status, created_at DESC);