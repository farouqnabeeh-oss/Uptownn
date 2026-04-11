
import { getSupabaseAdmin } from './src/lib/supabase.ts';

const supabase = getSupabaseAdmin();

async function checkZones() {
    const { data, error } = await supabase.from('branches').select('id, name_ar, delivery_zones');
    if (error) {
        console.error('Error:', error);
        return;
    }
    data.forEach(b => {
        console.log(`Branch: ${b.name_ar} (ID: ${b.id})`);
        console.log('Zones:', JSON.stringify(b.delivery_zones, null, 2));
    });
}

checkZones();
