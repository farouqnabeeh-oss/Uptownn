
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('🔄 Syncing family meals and additions...');

    // 1. Products
    const products = [
        { name_ar: 'وجبة عائلية (4 برجر)', name_en: 'Family Meal (4 Burgers)', description_ar: '4 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 4 كولا', description_en: '4 Classic or Crispy Burgers, Large Fries, 4 Cola', base_price: 120, image_path: '/images/pro1.jpeg', category_id: 31, all_branches: true, has_meal_option: true, is_active: true },
        { name_ar: 'وجبة عائلية (5 برجر)', name_en: 'Family Meal (5 Burgers)', description_ar: '5 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 5 كولا', description_en: '5 Classic or Crispy Burgers, Large Fries, 5 Cola', base_price: 145, image_path: '/images/pro2.jpeg', category_id: 31, all_branches: true, has_meal_option: true, is_active: true },
        { name_ar: 'وجبة عائلية (6 برجر)', name_en: 'Family Meal (6 Burgers)', description_ar: '6 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 6 كولا', description_en: '6 Classic or Crispy Burgers, Large Fries, 6 Cola', base_price: 165, image_path: '/images/pro3.jpeg', category_id: 31, all_branches: true, has_meal_option: true, is_active: true },
        { name_ar: 'وجبة توفير كرسبي (12 قطعة)', name_en: 'Crispy Saving Meal (12 Pcs)', description_ar: '12 قطعة كرسبي، بطاطا كبير، كولسلو متومه، 3 خبز، كولا تشات', description_en: '12 Crispy Pieces, Large Fries, Coleslaw, 3 Bread, Cola', base_price: 60, image_path: '/images/pro4.jpeg', category_id: 31, all_branches: true, has_meal_option: true, is_active: true }
    ];

    await supabase.from('products').upsert(products, { onConflict: 'name_en' });
    console.log('✅ Products synced.');

    // 2. Clear old addon groups for Cat 31 to avoid constraint issues
    await supabase.from('addon_groups').delete().eq('category_id', 31);

    // 3. Add Addon Groups
    const { data: groups, error: gErr } = await supabase.from('addon_groups').insert([
        { name_ar: 'اختيار المشروب', name_en: 'Select Drink', category_id: 31, group_type: 'addons', is_required: true, allow_multiple: true, sort_order: 1, is_active: true },
        { name_ar: 'إضافات الطعام', name_en: 'Food Additions', category_id: 31, group_type: 'addons', is_required: false, allow_multiple: true, sort_order: 2, is_active: true }
    ]).select();

    if (gErr) {
        console.error('❌ Group Error:', gErr.message);
        return;
    }

    // 4. Add Items
    for (const group of groups || []) {
        if (group.name_en === 'Select Drink') {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: group.id, name_ar: 'كولا', name_en: 'Cola', price: 0, sort_order: 1 },
                { addon_group_id: group.id, name_ar: 'سبرايت', name_en: 'Sprite', price: 0, sort_order: 2 },
                { addon_group_id: group.id, name_ar: 'فانتا', name_en: 'Fanta', price: 0, sort_order: 3 }
            ]);
        } else {
            await supabase.from('addon_group_items').insert([
                { addon_group_id: group.id, name_ar: 'زيادة ثوم', name_en: 'Extra Garlic', price: 2, sort_order: 1 },
                { addon_group_id: group.id, name_ar: 'زيادة خبز', name_en: 'Extra Bread', price: 3, sort_order: 2 }
            ]);
        }
    }

    console.log('✨ All synced successfully!');
}

run();
