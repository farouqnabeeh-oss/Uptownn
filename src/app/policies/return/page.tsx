import { BodyClassName } from "@/components/body-class-name";
import { cookies } from "next/headers";

export default async function ReturnPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const content = {
    title: isAr ? "سياسة الإرجاع والتبديل" : "Return & Exchange Policy",
    tagline: isAr ? "نحن مهتمون برضاكم التام عن كل وجبة" : "Your satisfaction is our top priority",
    sections: [
      {
        icon: "clock",
        title: isAr ? "نطاق الإرجاع والتبديل" : "Return & Exchange Window",
        text: isAr 
          ? "نظراً لطبيعة المنتجات الغذائية، يجب الإبلاغ عن أي مشكلة في الطلب فور استلامه. نقبل المراجعات والتبديل خلال 15 دقيقة من وقت استلام الطلب لضمان الجودة."
          : "Due to the nature of food products, any issue with the order must be reported immediately upon receipt. We accept reviews and exchanges within 15 minutes of receipt to ensure quality."
      },
      {
        icon: "alert-circle",
        title: isAr ? "حالات استحقاق التبديل" : "Eligible Cases",
        text: isAr 
          ? "يتم قبول طلبات التبديل في حال استلام وجبة غير صحيحة، أو وجود نقص في الطلب، أو في حال وجود ملاحظة جوهرية على جودة المنتج."
          : "Exchange requests are accepted if an incorrect meal is received, if there's a missing item, or if there's a substantial quality concern."
      },
      {
        icon: "credit-card",
        title: isAr ? "آلية التعويض" : "Refund & Resolution",
        text: isAr 
          ? "في حال قبول طلبك، سنقوم بتبديل الوجبة فوراً، أو إضافة رصيد لحسابك لاستخدامه في الطلب القادم، أو استرداد المبلغ حسب نوع الدفع الأصلي."
          : "If your request is accepted, we will immediately exchange the meal, add credit to your account for future use, or provide a refund based on the original payment method."
      },
      {
        icon: "phone-call",
        title: isAr ? "التواصل للمطالبات" : "Contact for Claims",
        text: isAr 
          ? "لأي مطالبة تتعلق بالطلب، يرجى التواصل معنا فوراً عبر رقم الهاتف المعتمد 022950505 أو عبر الواتساب الخاص بالفرع المعني."
          : "For any order claims, please contact us immediately via our verified number 022950505 or via the branch WhatsApp."
      }
    ],
    footer: isAr ? "آخر تحديث: أبريل 2026" : "Last Updated: April 2026"
  };

  return (
    <div className="policy-premium-wrapper" style={{ background: '#fff', color: '#000', minHeight: '100vh', fontFamily: 'var(--font-outfit)' }}>
      <BodyClassName className="premium-policy" />
      
      {/* 📄 MINIMALIST HEADER */}
      <section style={{ padding: '160px 24px 80px', textAlign: 'center', background: '#fafafa', borderBottom: '1px solid #eee' }}>
        <div className="animate-fade-down">
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '12px', fontWeight: 900, color: '#999', display: 'block', marginBottom: '15px' }}>
            {isAr ? "سياسة مطاعمنا" : "Our Terms"}
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: 'var(--font-playfair)', fontWeight: 900, marginBottom: '20px' }}>
            {content.title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>{content.tagline}</p>
        </div>
      </section>

      {/* 🖋️ CONTENT SECTION */}
      <section style={{ padding: '100px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '80px' }}>
          {content.sections.map((section, idx) => (
            <div key={idx} className="animate-fade-up" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: '60px', height: '60px', background: '#000', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <i data-lucide={section.icon} style={{ width: '28px' }} />
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px', fontFamily: 'var(--font-playfair)' }}>{section.title}</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#444', textAlign: 'justify' }}>{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '120px', padding: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '14px' }}>{content.footer}</p>
          <p style={{ color: '#000', fontWeight: 900, fontSize: '15px', marginTop: '10px' }}>Uptown & Pasta Signature</p>
        </div>
      </section>
    </div>
  );
}
