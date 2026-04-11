
import { getSupabaseAdmin } from '../src/lib/supabase';

const supabase = getSupabaseAdmin();

async function findIds() {
    const categories = ['الوجبات الرئيسية', 'أجنحة', 'وجبات الأطفال', 'السلطات', 'المبلات', 'المقبلات', 'حلويات', 'مشروبات باردة', 'قهوة باردة', 'سموذي طبيعي', 'ميلك شيك', 'مشروبات ساخنة', 'أرجيلة'];
    const products = ['ستيك اللحمة', 'ستيك الدجاج', 'كيدز بيرجر دجاج', 'عصير', 'اسبرسو', 'شاي', 'اصابع الموزاريلا'];

    console.log('--- Categories ---');
    for (const cat of categories) {
        const { data, error } = await supabase.from('categories').select('id, name_ar, name_en').ilike('name_ar', `%${cat}%`);
        if (data && data.length > 0) {
            data.forEach(c => console.log(`Category: ${c.name_ar} (EN: ${c.name_en}) - ID: ${c.id}`));
        } else {
            console.log(`Category: ${cat} - NOT FOUND`);
        }
    }

    console.log('\n--- Products ---');
    for (const prod of products) {
        const { data, error } = await supabase.from('products').select('id, name_ar, name_en, category_id').ilike('name_ar', `%${prod}%`);
        if (data && data.length > 0) {
            data.forEach(p => console.log(`Product: ${p.name_ar} (EN: ${p.name_en}) - ID: ${p.id} (Cat ID: ${p.category_id})`));
        } else {
            console.log(`Product: ${prod} - NOT FOUND`);
        }
    }
}

findIds();
