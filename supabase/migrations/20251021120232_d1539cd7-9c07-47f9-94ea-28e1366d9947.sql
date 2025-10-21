-- Make character_id nullable in videos table to support standalone edits
ALTER TABLE public.videos 
ALTER COLUMN character_id DROP NOT NULL;