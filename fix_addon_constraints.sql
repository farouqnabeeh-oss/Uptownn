-- ============================================================
-- STEP 1: Fix addon_groups unique constraints
-- Run this in Supabase SQL Editor BEFORE re-seeding
-- ============================================================

-- Remove the old composite unique constraint that blocks correct upsert
ALTER TABLE public.addon_groups 
  DROP CONSTRAINT IF EXISTS addon_groups_name_en_category_id_product_id_key;

-- Add partial unique index for CATEGORY-level groups (no product)
DROP INDEX IF EXISTS addon_groups_category_unique;
CREATE UNIQUE INDEX addon_groups_category_unique 
  ON public.addon_groups (name_en, category_id) 
  WHERE product_id IS NULL;

-- Add partial unique index for PRODUCT-level groups
DROP INDEX IF EXISTS addon_groups_product_unique;
CREATE UNIQUE INDEX addon_groups_product_unique 
  ON public.addon_groups (name_en, product_id) 
  WHERE product_id IS NOT NULL;

-- ============================================================  
-- STEP 2: Clear old (possibly incomplete) addon data
-- ============================================================
TRUNCATE TABLE public.addon_group_items CASCADE;
TRUNCATE TABLE public.addon_groups CASCADE;

-- ============================================================
-- Now go back and trigger re-seed (see instructions below)
-- ============================================================
