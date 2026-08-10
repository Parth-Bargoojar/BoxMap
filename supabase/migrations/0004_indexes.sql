-- Database Indexes per TRD.md
CREATE INDEX IF NOT EXISTS idx_boxes_user_id ON public.boxes(user_id);
CREATE INDEX IF NOT EXISTS idx_boxes_box_code ON public.boxes(box_code);
CREATE INDEX IF NOT EXISTS idx_boxes_location_id ON public.boxes(location_id);
CREATE INDEX IF NOT EXISTS idx_boxes_created_at ON public.boxes(created_at);

CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_box_id ON public.items(box_id);
CREATE INDEX IF NOT EXISTS idx_items_name ON public.items(name);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at);

CREATE INDEX IF NOT EXISTS idx_locations_user_id ON public.locations(user_id);

-- Case-insensitive search index on items.name using pg_trgm (GIN index with gin_trgm_ops)
-- Choice Rationale: pg_trgm GIN index allows fast case-insensitive ILIKE '%term%' pattern matching 
-- as well as fuzzy string search, matching the PRD/TRD requirement for item search performance (<500ms).
CREATE INDEX IF NOT EXISTS idx_items_name_trgm ON public.items USING gin (name gin_trgm_ops);
