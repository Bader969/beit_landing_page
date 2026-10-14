import { ActiveLanguage } from '../types/telemetry';

export interface TranslationsSchema {
  nav: {
    brand: string;
    tagline: string;
    act1: string;
    act2: string;
    act3: string;
    act4: string;
    act5: string;
    ctaConsultation: string;
  };
  act1: {
    badge: string;
    title: string;
    subtitle: string;
    scrollHint: string;
    floatingSheetText1: string;
    floatingSheetText2: string;
    floatingSheetText3: string;
  };
  act2: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      energy: {
        title: string;
        category: string;
        description: string;
        metric: string;
        metricLabel: string;
      };
      health: {
        title: string;
        category: string;
        description: string;
        metric: string;
        metricLabel: string;
      };
      mobility: {
        title: string;
        category: string;
        description: string;
        metric: string;
        metricLabel: string;
      };
      telecom: {
        title: string;
        category: string;
        description: string;
        metric: string;
        metricLabel: string;
      };
    };
  };
  act3: {
    badge: string;
    title: string;
    subtitle: string;
    sliderLabel: string;
    personsLabel: string;
    savingsPrefix: string;
    savingsSuffix: string;
    savingsNote: string;
    brand3DText: string;
  };
  act4: {
    badge: string;
    title: string;
    subtitle: string;
    portalTitle: string;
    portalSubtitle: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
  act5: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    advisorQuote: string;
  };
  consultation: {
    title: string;
    subtitle: string;
    advisorName: string;
    advisorRole: string;
    advisorBio: string;
    channels: {
      whatsapp: string;
      callback: string;
      calendar: string;
    };
    form: {
      nameLabel: string;
      phoneLabel: string;
      emailLabel: string;
      householdLabel: string;
      submitBtn: string;
      successMessage: string;
    };
    closeBtn: string;
    securityNote: string;
  };
}

export const translations: Record<ActiveLanguage, TranslationsSchema> = {
  "de": {
    "nav": {
      "brand": "Beit Plus",
      "tagline": "Ihr mehrsprachiger Haushaltsmakler in Deutschland",
      "act1": "Das Chaos",
      "act2": "4 Säulen",
      "act3": "Ersparnis",
      "act4": "Portal",
      "act5": "Beratung",
      "ctaConsultation": "Kostenlose Beratung"
    },
    "act1": {
      "badge": "Akt I — Das bürokratische Rauschen",
      "title": "Verloren im deutschen Vertragsdschungel?",
      "subtitle": "Stromtarife, Krankenkassenwechsel, KFZ-Bürokratie und Internetverträge. Beit Plus bündelt Ihre Haushaltsverträge und schafft Sicherheit.",
      "scrollHint": "Nach unten scrollen, um das Heiligtum zu dekonstruieren",
      "floatingSheetText1": "Strompreiserhöhung +38%",
      "floatingSheetText2": "Krankenkassenzusatzbeitrag steigt",
      "floatingSheetText3": "Automatische Vertragsverlängerung"
    },
    "act2": {
      "badge": "Akt II — Die Dekonstruktion des Schutzes",
      "title": "Vier Säulen für Ihren optimalen Haushalt",
      "subtitle": "Berühren Sie die Satelliten, um Einsparpotenziale in Echtzeit zu analysieren.",
      "pillars": {
        "energy": {
          "title": "Strom & Gas",
          "category": "Energie-Optimierung",
          "description": "Garantiert günstigere Öko-Tarife ohne versteckte Preisfallen und automatische Kündigung beim Altversorger.",
          "metric": "bis zu 580 €",
          "metricLabel": "jährliche Ersparnis"
        },
        "health": {
          "title": "Krankenkasse",
          "category": "Gesundheitsvorsorge",
          "description": "Optimale Leistungen, Bonusprogramme für Familien und Wechsel zur Kasse mit niedrigstem Zusatzbeitrag.",
          "metric": "bis zu 420 €",
          "metricLabel": "Cashback & Ersparnis"
        },
        "mobility": {
          "title": "KFZ & Sachwerte",
          "category": "Mobilitätsschutz",
          "description": "Maßgeschneiderter Haftpflicht- & Kaskoschutz für Ihr Fahrzeug mit vollem Schutz bei Marderschaden und Glasbruch.",
          "metric": "bis zu 350 €",
          "metricLabel": "pro versichertem Fahrzeug"
        },
        "telecom": {
          "title": "DSL & Glasfaser",
          "category": "Digitale Vernetzung",
          "description": "Höchste Bandbreite zum Exklusivpreis inklusive moderner WLAN-Hardware für Ihr gesamtes Zuhause.",
          "metric": "bis zu 240 €",
          "metricLabel": "Vorteil im Neukundentarif"
        }
      }
    },
    "act3": {
      "badge": "Akt III — Der Ersparnisrechner",
      "title": "Echtzeit-Berechnung für Ihren Haushalt",
      "subtitle": "Passen Sie die Personenanzahl an und beobachten Sie die dynamische Resonanz des Hauses.",
      "sliderLabel": "Haushaltsgröße (Personen)",
      "personsLabel": "Personen",
      "savingsPrefix": "Ø Bis zu",
      "savingsSuffix": "€ / Jahr",
      "savingsNote": "Basierend auf echten Vergleichswerten von über 12.000 optimierten Haushalten in Deutschland.",
      "brand3DText": "BEIT PLUS"
    },
    "act4": {
      "badge": "Akt IV — Das Heiligtum des Flusses",
      "title": "Alle Verträge in einer gläsernen Schaltzentrale",
      "subtitle": "Bürokratie löst sich in goldenes Licht auf — verwaltet in Ihrem persönlichen Kundenportal.",
      "portalTitle": "Mein Beit Plus Portal",
      "portalSubtitle": "Aktive Verträge & Kündigungsschutz",
      "feature1": "Automatischer jährlicher Tarifcheck ohne Kosten",
      "feature2": "Digitaler Kündigungsservice mit Rechtsgarantie",
      "feature3": "Alle Policen und Rechnungen an einem sicheren Ort",
      "feature4": "Ein fester deutsch- und muttersprachlicher Ansprechpartner"
    },
    "act5": {
      "badge": "Akt V — Direkte Beratung",
      "title": "Ihr persönlicher Berater — in Ihrer Sprache",
      "subtitle": "Kostenlos, unabhängig und direkt über WhatsApp oder im Telefontermin erreichbar.",
      "ctaButton": "Jetzt kostenlose Beratung anfordern",
      "advisorQuote": "Wir prüfen Ihre Verträge Zeile für Zeile und senken Ihre Haushaltsausgaben dauerhaft."
    },
    "consultation": {
      "title": "Persönliche Beratung starten",
      "subtitle": "Wählen Sie Ihren bevorzugten Kontaktweg mit unserem Team in Deutschland.",
      "advisorName": "Maximilian Weber",
      "advisorRole": "Senior Haushalts- & Vertragsberater",
      "advisorBio": "Über 9 Jahre Erfahrung im deutschen Energiemarkt und Versicherungssektor. Spezialisiert auf ganzheitliche Haushaltsoptimierung.",
      "channels": {
        "whatsapp": "Direkt via WhatsApp schreiben",
        "callback": "Rückruf innerhalb von 15 Minuten",
        "calendar": "Video-Termin im Kalender buchen"
      },
      "form": {
        "nameLabel": "Vollständiger Name",
        "phoneLabel": "Telefonnummer",
        "emailLabel": "E-Mail-Adresse",
        "householdLabel": "Haushaltsgröße",
        "submitBtn": "Beratung unverbindlich anfordern",
        "successMessage": "Vielen Dank! Ein Berater meldet sich in Kürze bei Ihnen."
      },
      "closeBtn": "Schließen",
      "securityNote": "100% kostenfrei & DSGVO-konform. Ihre Daten werden niemals weiterverkauft."
    }
  },
  "ar": {
    "nav": {
      "brand": "بيت بلس",
      "tagline": "مستشارك المنزلي المتعدد اللغات في ألمانيا",
      "act1": "البيروقراطية",
      "act2": "الأركان الأربعة",
      "act3": "حاسبة التوفير",
      "act4": "بوابة العميل",
      "act5": "تواصل معنا",
      "ctaConsultation": "استشارة مجانية"
    },
    "act1": {
      "badge": "الفصل الأول — فوضى البيروقراطية الألمانية",
      "title": "هل أرهقتك فواتير العقود الألمانية المعقدة؟",
      "subtitle": "عقود الكهرباء والغاز، التأمين الصحي، تأمين السيارات، والإنترنت. بيت بلس يجمع كل عقودك ويحقق لك أقصى درجات التوفير والأمان القانوني.",
      "scrollHint": "قم بالتمرير للأسفل لتفكيك الصرح واكتشاف الحلول",
      "floatingSheetText1": "ارتفاع أسعار الكهرباء +38%",
      "floatingSheetText2": "زيادة رسوم التأمين الصحي",
      "floatingSheetText3": "تجديد العقود التلقائي غير المرغوب"
    },
    "act2": {
      "badge": "الفصل الثاني — تفكيك أركان الحماية",
      "title": "أربعة أركان متكاملة لحماية وتوفير منزلك",
      "subtitle": "المس الأقمار المدارية لتحليل فرص التوفير التلقائي في كل قطاع.",
      "pillars": {
        "energy": {
          "title": "الكهرباء والغاز",
          "category": "تحسين الطاقة المنزلية",
          "description": "عقود طاقة صديقة للبيئة بأفضل الأسعار المعتمدة مع إلغاء عقودك القديمة وتجنب أي غرامات.",
          "metric": "حتى 580 €",
          "metricLabel": "توفير سنوي مباشر"
        },
        "health": {
          "title": "التأمين الصحي",
          "category": "الرعاية الصحية والعائلية",
          "description": "خدمات مميزة لك ولعائلتك مع مكافآت سنوية واختيار الصندوق الأقل تكلفة والأعلى مزايا.",
          "metric": "حتى 420 €",
          "metricLabel": "استرداد نقدي وتوفير"
        },
        "mobility": {
          "title": "تأمين السيارات",
          "category": "حماية التنقل والأصول",
          "description": "تأمين شامل وضد الغير للسيارات بأفضل الأسعار وشروط تغطية استثنائية للحوادث.",
          "metric": "حتى 350 €",
          "metricLabel": "لكل مركبة مسجلة"
        },
        "telecom": {
          "title": "الإنترنت والألياف الضوئية",
          "category": "الاتصال الرقمي",
          "description": "سرعات فائقة تصل إلى 1 جيجابت مع راوتر حديث ودعم فني مستمر باللغة العربية.",
          "metric": "حتى 240 €",
          "metricLabel": "خصم حصري للعملاء الجدد"
        }
      }
    },
    "act3": {
      "badge": "الفصل الثالث — محرك حساب التوفير المباشر",
      "title": "احسب ما يمكنك توفيره لعائلتك الآن",
      "subtitle": "حرّك مؤشر عدد أفراد الأسرة وشاهد كيف يتوهج الصرح المعماري بانعكاس التوفير.",
      "sliderLabel": "عدد أفراد الأسرة",
      "personsLabel": "أفراد",
      "savingsPrefix": "متوسط يصل إلى",
      "savingsSuffix": "€ / سنوياً",
      "savingsNote": "محسوب بدقة بناءً على أكثر من 12,000 عائلة تم تحسين عقودها بنجاح في ألمانيا.",
      "brand3DText": "بيت بلس مستشارك المنزلي في ألمانيا"
    },
    "act4": {
      "badge": "الفصل الرابع — صرح السلاسة وبوابة العميل",
      "title": "كل عقودك في لوحة تحكم رقمية واحدة",
      "subtitle": "تتحول الأوراق والبيروقراطية إلى تدفق ذهبي يدير عقودك بدون أي جهد.",
      "portalTitle": "بوابة بيت بلس الرقمية",
      "portalSubtitle": "العقود النشطة والحماية التلقائية",
      "feature1": "فحص دوري سنوي لجميع العقود لضمان أقل الأسعار",
      "feature2": "خدمة إلغاء وتبديل العقود تلقائياً وبضمان قانوني",
      "feature3": "جميع بوالص التأمين والفواتير في تطبيق آمن وسهل",
      "feature4": "مستشار خاص يتحدث معك بلغتك العربية في أي وقت"
    },
    "act5": {
      "badge": "الفصل الخامس — استشارة فورية بلغتك",
      "title": "تحدث مع مستشارك المعتمد بلغتك الأم",
      "subtitle": "خدمة مجانية بالكامل ومستقلة عبر واتساب أو الاتصال الهاتفي المباشر.",
      "ctaButton": "تحدث مع مستشارك العربي الآن",
      "advisorQuote": "«ندرس عقودك بدقة بالغة ونضمن لك أفضل الأسعار والخدمات دون أي تعقيد بيروقراطي.»"
    },
    "consultation": {
      "title": "ابدأ استشارتك المجانية الآن",
      "subtitle": "اختر وسيلة التواصل الأنسب لك مع فريقنا المعتمد في ألمانيا.",
      "advisorName": "طارق المنصور",
      "advisorRole": "مستشار معتمد لشؤون العقود والتأمين في ألمانيا",
      "advisorBio": "خبرة تفوق 8 سنوات في مساعدة العائلات والمغتربين في ألمانيا لاختيار أفضل عقود الطاقة والتأمين والتوفير المالي.",
      "channels": {
        "whatsapp": "مراسلة فورية عبر واتساب",
        "callback": "طلب اتصال هاتفي خلال 15 دقيقة",
        "calendar": "حجز موعد عبر مكالمة فيديو"
      },
      "form": {
        "nameLabel": "الاسم الكامل",
        "phoneLabel": "رقم الهاتف",
        "emailLabel": "البريد الإلكتروني",
        "householdLabel": "عدد أفراد الأسرة",
        "submitBtn": "إرسال طلب الاستشارة المجانية",
        "successMessage": "تم استلام طلبك بنجاح! سيتواصل معك مستشارك في أقرب وقت."
      },
      "closeBtn": "إغلاق",
      "securityNote": "خدمة مجانية 100% ومتوافقة تماماً مع قوانين حماية البيانات الألمانية (DSGVO)."
    }
  },
  "en": {
    "nav": {
      "brand": "Beit Plus",
      "tagline": "Germany's Premier Multilingual Utility Broker",
      "act1": "The Noise",
      "act2": "4 Pillars",
      "act3": "Savings",
      "act4": "Portal",
      "act5": "Consultation",
      "ctaConsultation": "Free Consultation"
    },
    "act1": {
      "badge": "Act I — The Bureaucratic Noise",
      "title": "Lost in German Contract Paperwork?",
      "subtitle": "Electricity tariffs, public health insurance, vehicle insurance, and fiber internet. Beit Plus bundles your household contracts for maximum savings and clarity.",
      "scrollHint": "Scroll down to deconstruct the architectural sanctuary",
      "floatingSheetText1": "Electricity tariff hike +38%",
      "floatingSheetText2": "Public health supplement increase",
      "floatingSheetText3": "Automatic 12-month contract lock-in"
    },
    "act2": {
      "badge": "Act II — Deconstruction of Protection",
      "title": "Four Pillars of Complete Household Coverage",
      "subtitle": "Hover over the orbital satellites to inspect real-time savings opportunities.",
      "pillars": {
        "energy": {
          "title": "Electricity & Gas",
          "category": "Energy Optimization",
          "description": "Guaranteed lower eco-tariffs with automatic cancellation of your legacy contracts and zero hidden fees.",
          "metric": "up to 580 €",
          "metricLabel": "annual savings"
        },
        "health": {
          "title": "Health Insurance",
          "category": "Healthcare Optimization",
          "description": "Top-tier benefits, cashback bonus programs, and seamless transfer to low-supplement statutory funds.",
          "metric": "up to 420 €",
          "metricLabel": "cashback & savings"
        },
        "mobility": {
          "title": "Vehicle & Asset Cover",
          "category": "Mobility Protection",
          "description": "Tailored motor third-party and comprehensive insurance protecting against animal damage, glass breakage, and accidents.",
          "metric": "up to 350 €",
          "metricLabel": "per insured vehicle"
        },
        "telecom": {
          "title": "Fiber & High-Speed DSL",
          "category": "Digital Connectivity",
          "description": "Gigabit-grade speeds at special partner rates including premium Wi-Fi hardware for your home.",
          "metric": "up to 240 €",
          "metricLabel": "new customer advantage"
        }
      }
    },
    "act3": {
      "badge": "Act III — Real-Time Savings Engine",
      "title": "Live Savings Calculation For Your Household",
      "subtitle": "Adjust the household member slider and watch the architectural house respond dynamically.",
      "sliderLabel": "Household Size (Persons)",
      "personsLabel": "Persons",
      "savingsPrefix": "Avg. Up to",
      "savingsSuffix": "€ / Year",
      "savingsNote": "Calculated from real benchmark data across 12,000+ optimized households in Germany.",
      "brand3DText": "BEIT PLUS"
    },
    "act4": {
      "badge": "Act IV — The Sanctuary of Flow",
      "title": "All Household Contracts in One Clear Portal",
      "subtitle": "Paperwork dissolves into golden light streams — accessible in your dedicated client dashboard.",
      "portalTitle": "My Beit Plus Portal",
      "portalSubtitle": "Active Contracts & Auto-Switch Protection",
      "feature1": "Annual automatic tariff review with zero fees",
      "feature2": "Legally guaranteed one-click cancellation service",
      "feature3": "All policies, certificates, and invoices in one secure place",
      "feature4": "Dedicated personal advisor speaking your preferred language"
    },
    "act5": {
      "badge": "Act V — Direct Consultation",
      "title": "Your Dedicated Advisor — In Your Language",
      "subtitle": "100% free, independent, and accessible via WhatsApp or scheduled callback.",
      "ctaButton": "Request Free Consultation Now",
      "advisorQuote": "We review your contracts line by line and permanently reduce your household expenses."
    },
    "consultation": {
      "title": "Start Your Free Consultation",
      "subtitle": "Select your preferred way to speak with our certified advisors in Germany.",
      "advisorName": "Sarah Jenkins",
      "advisorRole": "Expat Utility & Insurance Specialist",
      "advisorBio": "Over 7 years specializing in expat contract transitions, energy switching, and statutory health insurance in Germany.",
      "channels": {
        "whatsapp": "Chat directly on WhatsApp",
        "callback": "Request phone callback within 15 min",
        "calendar": "Book video consultation in calendar"
      },
      "form": {
        "nameLabel": "Full Name",
        "phoneLabel": "Phone Number",
        "emailLabel": "Email Address",
        "householdLabel": "Household Size",
        "submitBtn": "Submit Consultation Request",
        "successMessage": "Thank you! An advisor will reach out to you shortly."
      },
      "closeBtn": "Close",
      "securityNote": "100% free & GDPR compliant. Your information will never be shared or sold."
    }
  },
  "tr": {
    "nav": {
      "brand": "Beit Plus",
      "tagline": "Almanya'nın Çok Dilli Hanehalkı ve Sigorta Danışmanı",
      "act1": "Bürokrasi",
      "act2": "4 Temel Direk",
      "act3": "Tasarruf",
      "act4": "Müşteri Portalı",
      "act5": "Danışmanlık",
      "ctaConsultation": "Ücretsiz Danışmanlık"
    },
    "act1": {
      "badge": "1. Bölüm — Bürokrasi Karmaşası",
      "title": "Almanya'daki Sözleşme Labirentinde Kayboldunuz mu?",
      "subtitle": "Elektrik ve gaz tarifeleri, sağlık sigortası, araç kaskosu ve internet sözleşmeleri. Beit Plus tüm sözleşmelerinizi birleştirerek maksimum tasarruf sağlar.",
      "scrollHint": "Tapınağı parçalarına ayırmak için aşağı kaydırın",
      "floatingSheetText1": "Elektrik fiyat artışı +%38",
      "floatingSheetText2": "Sağlık sigortası ek prim zammı",
      "floatingSheetText3": "Otomatik 12 aylık sözleşme uzatması"
    },
    "act2": {
      "badge": "2. Bölüm — Korumayı Yapılandırma",
      "title": "Eviniz İçin 4 Güçlü Koruma Direği",
      "subtitle": "Her alandaki gerçek zamanlı tasarruf fırsatlarını görmek için uyduların üzerine gelin.",
      "pillars": {
        "energy": {
          "title": "Elektrik & Gaz",
          "category": "Enerji Optimizasyonu",
          "description": "Eski sözleşmelerinizin otomatik iptali ve gizli ücret olmadan garantili uygun yeşil enerji.",
          "metric": "580 €'ya kadar",
          "metricLabel": "yıllık tasarruf"
        },
        "health": {
          "title": "Sağlık Sigortası",
          "category": "Sağlık Güvencesi",
          "description": "Aileler için bonus programları, nakit iadeler ve en düşük ek primli sigorta kasasına kolay geçiş.",
          "metric": "420 €'ya kadar",
          "metricLabel": "nakit iade ve tasarruf"
        },
        "mobility": {
          "title": "Araç & Kasko",
          "category": "Ulaşım Güvencesi",
          "description": "Aracınız için sansar hasarı, cam kırılması ve kaza durumlarını kapsayan özel trafik ve kasko sigortası.",
          "metric": "350 €'ya kadar",
          "metricLabel": "sigortalı araç başına"
        },
        "telecom": {
          "title": "Fiber İnternet & DSL",
          "category": "Dijital Bağlantı",
          "description": "Eviniz için en yeni Wi-Fi modem donanımıyla birlikte gigabit hızında kesintisiz internet.",
          "metric": "240 €'ya kadar",
          "metricLabel": "yeni müşteri avantajı"
        }
      }
    },
    "act3": {
      "badge": "3. Bölüm — Canlı Tasarruf Hesaplayıcı",
      "title": "Haneniz İçin Gerçek Zamanlı Tasarruf",
      "subtitle": "Kişi sayısını ayarlayın ve mimari evin tasarrufa nasıl tepki verdiğini izleyin.",
      "sliderLabel": "Hane Halkı Sayısı (Kişi)",
      "personsLabel": "Kişi",
      "savingsPrefix": "Ort. Yılda",
      "savingsSuffix": "€ Tasarruf",
      "savingsNote": "Almanya genelinde optimize edilen 12.000'den fazla hanenin gerçek verilerine dayanmaktadır.",
      "brand3DText": "BEIT PLUS"
    },
    "act4": {
      "badge": "4. Bölüm — Akış Tapınağı ve Portal",
      "title": "Tüm Sözleşmeleriniz Tek Bir Dijital Merkezde",
      "subtitle": "Bürokrasi altın ışık akışına dönüşerek dijital müşteri portalınızda birleşir.",
      "portalTitle": "Beit Plus Müşteri Portalı",
      "portalSubtitle": "Aktif Sözleşmeler ve Otomatik Fesih Koruması",
      "feature1": "Yıllık ücretsiz ve otomatik en uygun tarife kontrolü",
      "feature2": "Yasal garantili tek tıkla sözleşme fesih hizmeti",
      "feature3": "Tüm poliçeler ve faturalar tek bir güvenli yerde",
      "feature4": "Kendi ana dilinizde konuşan özel danışman desteği"
    },
    "act5": {
      "badge": "5. Bölüm — Doğrudan Danışmanlık",
      "title": "Kendi Dilinizde Kişisel Danışmanınız",
      "subtitle": "Tamamen ücretsiz, bağımsız ve doğrudan WhatsApp veya telefon ile ulaşılabilir.",
      "ctaButton": "Hemen Ücretsiz Danışmanlık Alın",
      "advisorQuote": "Sözleşmelerinizi satır satır inceliyor, hane giderlerinizi kalıcı olarak düşürüyoruz."
    },
    "consultation": {
      "title": "Ücretsiz Danışmanlığınızı Başlatın",
      "subtitle": "Almanya'daki uzman ekibimizle tercih ettiğiniz iletişim kanalını seçin.",
      "advisorName": "Emre Yılmaz",
      "advisorRole": "Almanya Hanehalkı ve Sigorta Danışmanı",
      "advisorBio": "Almanya enerji piyasası ve sigorta sektöründe 8 yılı aşkın deneyim. Hanehalkı tasarrufları ve Türk toplumuna özel danışmanlık uzmanı.",
      "channels": {
        "whatsapp": "WhatsApp üzerinden hemen mesaj atın",
        "callback": "15 dakika içinde geri arama talep edin",
        "calendar": "Takvimden görüntülü görüşme randevusu alın"
      },
      "form": {
        "nameLabel": "Ad Soyad",
        "phoneLabel": "Telefon Numarası",
        "emailLabel": "E-Posta Adresi",
        "householdLabel": "Hane Halkı Sayısı",
        "submitBtn": "Ücretsiz Danışmanlık Talebi Gönder",
        "successMessage": "Talebiniz alındı! Danışmanımız en kısa sürede sizinle iletişime geçecektir."
      },
      "closeBtn": "Kapat",
      "securityNote": "%100 ücretsiz ve KVKK/DSGVO uyumlu. Verileriniz asla üçüncü taraflarla paylaşılmaz."
    }
  }
};
