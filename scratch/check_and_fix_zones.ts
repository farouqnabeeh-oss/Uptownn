
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrnvflosxoocawfynsbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnZmbG9zeG9vY2F3Znluc2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg5NjY0MCwiZXhwIjoyMDkxNDcyNjQwfQ.Iz8jMfphWYbTpTnGx_f3-pEAg0u3wjPtY4WH4JZzdAY';

const supabase = createClient(supabaseUrl, supabaseKey);

const mockZones = [
      { name: "الارسال", fee: 10 },
      { name: "سطح مرحبا", fee: 18 },
      { name: "شارع القدس", fee: 15 },
      { name: "الامعري", fee: 15 },
      { name: "الشرفة", fee: 15 },
      { name: "وسط البلد", fee: 12 },
      { name: "البالوع", fee: 10 },
      { name: "المصايف", fee: 10 },
      { name: "شارع نابلس", fee: 10 },
      { name: "جبل الطويل - البيرة", fee: 12 },
      { name: "سردا", fee: 16 },
      { name: "ابو قش", fee: 25 },
      { name: "الريحان", fee: 25 },
      { name: "الدبلوماسي", fee: 20 },
      { name: "بيرزيت", fee: 30 },
      { name: "بير نبالا", fee: 40 },
      { name: "خارجي", fee: 15 },
      { name: "مفرق 17 بيتونيا", fee: 25 },
      { name: "صناعة بيتونيا", fee: 17 },
      { name: "بيتونيا السنابل", fee: 17 },
      { name: "مفرق الحتو بيتونيا", fee: 20 },
      { name: "البلدة القديمة بيتونيا", fee: 30 },
      { name: "دوار الفواكه بيتونيا", fee: 20 },
      { name: "بيتونيا دوار المدارس", fee: 25 },
      { name: "بيتونيا ملاهي مخماس", fee: 18 },
      { name: "شارع المعبر بيتونيا", fee: 22 },
      { name: "بالوع بيتونيا", fee: 22 },
      { name: "بلدية البيرة", fee: 13 },
      { name: "حي الجنان البيرة", fee: 15 },
      { name: "اسعاد الطفولة البيرة", fee: 13 },
      { name: "المدرسة الهاشمية البيرة", fee: 13 },
      { name: "الجلزون", fee: 20 },
      { name: "رافات", fee: 25 },
      { name: "دوار رافات", fee: 20 },
      { name: "قلنديا البلد", fee: 30 }
    ];

async function checkAndFixZones() {
    console.log('🔍 Checking Delivery Zones...');
    const { data: branches, error } = await supabase.from('branches').select('id, name_ar, delivery_zones');
    
    if (error) {
        console.error('❌ Error fetching branches:', error);
        return;
    }

    for (const b of branches) {
        console.log(`Branch: ${b.name_ar} (ID: ${b.id})`);
        
        if (!b.delivery_zones || b.delivery_zones.length === 0) {
            console.log(`⚠️ Zones empty for ${b.name_ar}. Restoring mock zones...`);
            const { error: updateError } = await supabase.from('branches').update({
                delivery_zones: mockZones
            }).eq('id', b.id);
            
            if (updateError) console.error(`❌ Failed to update ${b.name_ar}:`, updateError);
            else console.log(`✅ Restored zones for ${b.name_ar}`);
        } else {
            console.log(`✅ Zones found: ${b.delivery_zones.length} zones.`);
            // Check mapping
            const sample = b.delivery_zones[0];
            console.log(`Sample: ${JSON.stringify(sample)}`);
            if (!sample.name && !sample.nameAr) {
                console.log('⚠️ Warning: Zone names might be missing in JSON keys.');
            }
        }
    }

    console.log('🎯 Done.');
}

checkAndFixZones();
