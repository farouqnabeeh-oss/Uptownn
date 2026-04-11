const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(url, key);

async function run() {
    console.log('🔄 Bulk adding products to category 31...');

    const products = [
        {
            name_ar: 'وجبة عائلية (4 برجر)',
            name_en: 'Family Meal (4 Burgers)',
            description_ar: '4 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 4 كولا (مشروبات غازية)',
            description_en: '4 Classic or Crispy Burgers, Large Fries, 4 Cola',
            base_price: 120,
            image_path: '/images/pro1.jpeg',
            category_id: 31,
            all_branches: true,
            has_meal_option: true,
            is_active: true
        },
        {
            name_ar: 'وجبة عائلية (5 برجر)',
            name_en: 'Family Meal (5 Burgers)',
            description_ar: '5 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 5 كولا (مشروبات)',
            description_en: '5 Classic or Crispy Burgers, Large Fries, 5 Cola',
            base_price: 145,
            image_path: '/images/pro2.jpeg',
            category_id: 31,
            all_branches: true,
            has_meal_option: true,
            is_active: true
        },
        {
            name_ar: 'وجبة عائلية (6 برجر)',
            name_en: 'Family Meal (6 Burgers)',
            description_ar: '6 برجر كلاسيك أو كرسبي، بطاطا حجم كبير، 6 كولا (مشروبات)',
            description_en: '6 Classic or Crispy Burgers, Large Fries, 6 Cola',
            base_price: 165,
            image_path: '/images/pro3.jpeg',
            category_id: 31,
            all_branches: true,
            has_meal_option: true,
            is_active: true
        },
        {
            name_ar: 'وجبة توفير كرسبي (12 قطعة)',
            name_en: 'Crispy Saving Meal (12 Pcs)',
            description_ar: '12 قطعة كرسبي، بطاطا كبير، كولسلو متومه، 3 خبز، كولا تشات، تشكيلة صوصات',
            description_en: '12 Crispy Pieces, Large Fries, Coleslaw, 3 Bread, Cola, Sauces',
            base_price: 60,
            image_path: '/images/pro4.jpeg',
            category_id: 31,
            all_branches: true,
            has_meal_option: true,
            is_active: true
        }
    ];

    const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'name_en' });
    if (error) {
        console.error('❌ Error during bulk insert:', error.message);
    } else {
        console.log('✅ Successfully added all 4 products!');
    }
}

run().catch(err => console.error('🔥 Fatal Error:', err.message));
