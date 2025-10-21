-- Add Edits category
INSERT INTO public.categories (name) 
VALUES ('Edits')
ON CONFLICT DO NOTHING;