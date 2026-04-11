-- 1. Branches
CREATE TABLE public.branches (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    banner_image_path TEXT,
    discount_percent NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    latitude NUMERIC,
    longitude NUMERIC,
    opening_time TEXT,
    closing_time TEXT,
    delivery_fee NUMERIC DEFAULT 0,
    delivery_zones JSONB DEFAULT '[]',
    promo_video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE public.categories (
    id BIGSERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT UNIQUE NOT NULL,
    branch_id BIGINT REFERENCES public.branches(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    icon_class TEXT,
    image_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products
CREATE TABLE public.products (
    id BIGSERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT UNIQUE NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    base_price NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    image_path TEXT,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
    branch_id BIGINT REFERENCES public.branches(id) ON DELETE SET NULL,
    all_branches BOOLEAN DEFAULT TRUE,
    has_meal_option BOOLEAN DEFAULT FALSE,
    has_doneness_option BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product Sizes
CREATE TABLE public.product_sizes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price NUMERIC NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- 5. Product Types
CREATE TABLE public.product_types (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- 6. Addon Groups
CREATE TABLE public.addon_groups (
    id BIGSERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    group_type TEXT NOT NULL, -- 'sizes', 'types', 'addons', 'without', 'Doneness'
    is_required BOOLEAN DEFAULT FALSE,
    allow_multiple BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name_en, category_id, product_id)
);

-- 7. Addon Group Items
CREATE TABLE public.addon_group_items (
    id BIGSERIAL PRIMARY KEY,
    addon_group_id BIGINT REFERENCES public.addon_groups(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(addon_group_id, name_en)
);

-- 8. Site Settings
CREATE TABLE public.site_settings (
    id BIGSERIAL PRIMARY KEY,
    site_name TEXT DEFAULT 'UPTOWN',
    site_name_ar TEXT DEFAULT 'أبتاون',
    logo_url TEXT,
    currency_symbol TEXT DEFAULT '₪',
    primary_color TEXT DEFAULT '#8B0000',
    secondary_color TEXT DEFAULT '#1a1a1a',
    footer_text TEXT,
    og_image_url TEXT,
    meta_description_ar TEXT,
    meta_description_en TEXT,
    tiktok_url TEXT,
    instagram_uptown_url TEXT,
    facebook_uptown_url TEXT,
    facebook_pasta_url TEXT,
    instagram_pasta_url TEXT,
    site_email TEXT,
    site_phone TEXT,
    site_address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial settings
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 9. Menu Banners
CREATE TABLE public.menu_banners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image_path TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    last_order_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Orders
CREATE TABLE public.orders (
    id BIGSERIAL PRIMARY KEY,
    branch_id BIGINT REFERENCES public.branches(id),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    order_type TEXT NOT NULL, -- 'Delivery', 'Table', 'Pickup'
    address TEXT,
    table_number TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT DEFAULT 'Cash',
    payment_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Order Items
CREATE TABLE public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT,
    product_name_ar TEXT NOT NULL,
    product_name_en TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    addon_details TEXT
);

-- 13. Admin Users (Compatible with legacy ASP.NET Identity mapping)
CREATE TABLE public.aspnet_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT UNIQUE NOT NULL,
    normalized_user_name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    normalized_email TEXT UNIQUE NOT NULL,
    email_confirmed BOOLEAN DEFAULT FALSE,
    password_hash TEXT NOT NULL,
    security_stamp TEXT,
    concurrency_stamp TEXT,
    phone_number TEXT,
    phone_number_confirmed BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    lockout_end TIMESTAMP WITH TIME ZONE,
    lockout_enabled BOOLEAN DEFAULT TRUE,
    access_failed_count INTEGER DEFAULT 0,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_addon_groups_updated_at BEFORE UPDATE ON public.addon_groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_menu_banners_updated_at BEFORE UPDATE ON public.menu_banners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
