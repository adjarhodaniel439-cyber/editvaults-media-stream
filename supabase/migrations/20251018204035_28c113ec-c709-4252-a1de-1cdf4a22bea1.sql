-- Add a General category for videos that can appear in all sections
INSERT INTO public.categories (name) 
VALUES ('General')
ON CONFLICT DO NOTHING;