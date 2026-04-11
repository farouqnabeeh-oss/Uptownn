
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log('🚀 Overhauling menu addons...');

    // 1. Side Dishes for Main Meals
    const { data: cat } = await supabase.from('categories').select('id').ilike('name_ar', '%الوجبات الرئيسية%').maybeSingle();
    if (cat) {
        await supabase.from('addon_groups').delete().eq('category_id', cat.id).eq('name_en', 'Side Dishes');
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'إضافات جانبية', name_en: 'Side Dishes', category_id: cat.id, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 5, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert({ addon_group_id: g.id, name_ar: 'صحن أرز', name_en: 'Rice Plate', price: 10, sort_order: 1, is_active: true });
        }
        console.log('✅ Side Dishes synced.');
    }

    // 2. Steak Doneness
    const { data: p } = await supabase.from('products').select('id, category_id').ilike('name_ar', '%ستيك اللحمة%').maybeSingle();
    if (p) {
        await supabase.from('addon_groups').delete().eq('product_id', p.id).eq('name_en', 'Doneness');
        const { data: g } = await supabase.from('addon_groups').insert({
            name_ar: 'درجة الاستواء', name_en: 'Doneness', category_id: p.category_id, product_id: p.id, group_type: 'doneness', is_required: true, allow_multiple: false, sort_order: 1, is_active: true
        }).select().single();
        if (g) {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: g.id, name_ar: 'ميديوم', name_en: 'Medium', price: 0, sort_order: 1 },
                { addon_group_id: g.id, name_ar: 'ويل دون', name_en: 'Well Done', price: 0, sort_order: 2 }
            ]);
        }
        console.log('✅ Steak Doneness synced.');
    }

    console.log('🎯 Overhaul complete!');
}

sync();
