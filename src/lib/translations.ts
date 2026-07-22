/**
 * All bilingual copy for the site lives here. `ar` is typed against `en`'s
 * exact shape (see the `satisfies` check at the bottom) so a missing key in
 * either language fails the build instead of silently falling back.
 *
 * Not covered here (deliberately, see AGENTS.md / deployment plan notes):
 * - Route `head()` meta (title/description/og:*) — stays English for SEO.
 * - `WorldMap` marker labels — decorative SVG, hand-tuned for LTR.
 */

const en = {
  common: {
    skipToContent: "Skip to content",
    homeAriaLabel: "Amana Partners — home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Primary",
    mobileNav: "Mobile",
  },
  nav: {
    home: "Home",
    whySpain: "Why Spain",
    services: "Services",
    opportunities: "Opportunities",
    about: "About",
    contact: "Contact",
    consultation: "Private Consultation",
  },
  footer: {
    blurb:
      "A private cross-border investment advisory firm helping GCC principals identify, evaluate and access strategic opportunities in Spain — from real estate and hospitality to M&A and market entry.",
    navigate: "Navigate",
    marketsServed: "Markets Served",
    markets: ["GCC", "Spain", "Europe"],
    rightsReserved: "All rights reserved.",
    tagline: "GCC · Spain · Europe",
  },
  home: {
    hero: {
      badge1: "Strategic Advisory",
      badge2: "Cross-Border Investment",
      titlePrefix: "What if Spain was your",
      titleEm: "smartest",
      titleSuffix: " investment?",
      subtitle:
        "Cross-border investment advisory for GCC principals. We identify, evaluate and secure strategic opportunities across Spain through trusted local partnerships.",
      ctaSpeak: "Speak with Nouar Chaker",
      ctaExpertise: "Our expertise",
      trust: ["GCC", "Spain", "Cross-Border Advisory"],
    },
    stats: [
      "Advised transaction volume",
      "Years operating in Spain",
      "Countries served",
      "Private client mandate",
    ],
    positioning: {
      eyebrow: "Our Mandate",
      titleLine1: "Institutional discipline.",
      titleLine2Gold: "Family-office intimacy.",
      body: "Amana Partners was built for a specific investor: the Gulf-based principal who values discretion, structural clarity and long-term capital preservation. We are advisors, not brokers. Our role is to sit on your side of the table across every vertical we cover — from real estate and hospitality to business acquisitions and market entry into Spain.",
      facts: [
        { label: "Focus", value: "Cross-border advisory" },
        { label: "Coverage", value: "Spain nationwide" },
        { label: "Clientele", value: "GCC families & offices" },
        { label: "Ticket size", value: "€3M – €50M+" },
      ],
    },
    pillars: {
      eyebrow: "Why Amana Partners",
      title: "A single point of trust, across every vertical.",
      items: [
        {
          title: "Strategic Guidance",
          body: "We help GCC principals define an investment thesis for Spain, then translate it into concrete, actionable opportunities across our verticals.",
        },
        {
          title: "Cross-Border Structuring",
          body: "Ownership vehicles, Sharia-conscious financing options, tax alignment and residency pathways designed for Gulf-based families and offices.",
        },
        {
          title: "Long-Term Representation",
          body: "We act as your permanent counterpart on the ground in Spain — independent, senior and free of seller-side commissions.",
        },
      ],
    },
    markets: {
      eyebrow: "Where We Operate",
      title: "Three markets we know intimately.",
      intro:
        "Coverage is nationwide, but depth compounds. These are the markets where our local network is deepest and most of our off-market flow originates.",
      items: [
        { city: "Marbella", note: "Coastal & branded residences" },
        { city: "Madrid", note: "Prime core & commercial" },
        { city: "Barcelona", note: "Hospitality & mixed use" },
      ],
    },
    verticals: {
      eyebrow: "Strategic Opportunities",
      title: "Six investment verticals.",
      intro:
        "Real estate is one of the verticals we advise on — not the identity of the firm. Every mandate is shaped by the principal's thesis, not a product to sell.",
      exploreLink: "Explore our advisory →",
      items: [
        { title: "Real Estate Investments", note: "Prime, coastal & yield assets" },
        { title: "Hospitality Investments", note: "Hotels & branded residences" },
        { title: "Business Acquisitions", note: "M&A across Spain" },
        { title: "Strategic Partnerships", note: "Co-investment & JV structuring" },
        { title: "Market Entry into Spain", note: "Platform, entity & team build" },
        { title: "Investor Representation", note: "Independent long-term counterpart" },
      ],
    },
    approach: {
      eyebrow: "Our Approach",
      title: "The investment journey, held end to end.",
      intro:
        "A single senior advisor accompanies you from the first confidential conversation to the long-term stewardship of your position in Spain.",
      steps: [
        {
          title: "Private Consultation",
          body: "A confidential first meeting to understand your objectives, horizon and constraints.",
        },
        {
          title: "Investment Strategy",
          body: "We define your thesis for Spain — vertical, geography, ticket size and risk profile.",
        },
        {
          title: "Opportunity Selection",
          body: "We source, screen and shortlist opportunities aligned with the mandate — most off-market.",
        },
        {
          title: "Legal & Commercial Coordination",
          body: "We coordinate due diligence, structuring, tax and legal counterparts on your behalf.",
        },
        {
          title: "Acquisition",
          body: "Negotiation, closing and hand-over — with a single senior advisor holding the pen throughout.",
        },
        {
          title: "Long-Term Partnership",
          body: "We remain your independent counterpart in Spain long after the transaction closes.",
        },
      ],
    },
    testimonial: {
      eyebrow: "A Word From Our Principals",
      quote:
        "“Amana Partners understood our family before they showed us a single opportunity. That order — trust first, strategy second, transaction last — is what makes them different.”",
      attribution: "— Principal, Riyadh-based family office",
    },
    finalCta: {
      eyebrow: "Begin the Conversation",
      title: "A private consultation, held in confidence.",
      body: "Introductory meetings are complimentary and typically held in Madrid, Dubai, or by secure video — in English or Arabic.",
      button: "Schedule a Private Consultation",
    },
  },
  about: {
    hero: {
      eyebrow: "About Amana Partners",
      title: "A private advisory firm, built for the long conversation.",
      intro:
        "Amana Partners is a cross-border investment advisory firm. We are not a brokerage. We help GCC principals identify, evaluate and access strategic opportunities in Spain — and remain their independent counterpart long after the transaction closes.",
    },
    mission: {
      eyebrow: "Our Mission",
      title: "The trusted strategic bridge between GCC investors and Spain.",
      paragraphs: [
        "Amana Partners was created to become the trusted strategic bridge between GCC investors and opportunities in Spain.",
        "We provide independent advisory, trusted local partnerships and long-term investment guidance — across real estate, hospitality, business acquisitions, strategic partnerships, market entry and investor representation.",
        '"Amana" — trust, in Arabic — is the standard we hold ourselves to on every mandate we accept.',
      ],
      quote:
        "“We do not sell assets. We help investors make the right strategic decisions — and stay by their side long after the decision is made.”",
      quoteAttribution: "Managing Partner",
    },
    values: {
      eyebrow: "Our Values",
      title: "Four commitments, held without exception.",
      items: [
        {
          title: "Discretion",
          body: "Every mandate is held in confidence. Names, structures and holdings remain with the family.",
        },
        {
          title: "Alignment",
          body: "We advise on a private-mandate basis, free of undisclosed commissions or referral fees from sellers.",
        },
        {
          title: "Longevity",
          body: "We measure success in decades, not deals. Most of our clients came through a personal introduction.",
        },
        {
          title: "Cultural Fluency",
          body: "We work in English, Spanish and Arabic — and understand what those languages carry beyond translation.",
        },
      ],
    },
  },
  services: {
    hero: {
      eyebrow: "Our Expertise",
      title: "Cross-border investment advisory, across six verticals.",
      intro:
        "We do not sell assets. We help GCC principals make the right strategic decisions in Spain — from initial thesis to long-term representation — with a single senior advisor holding the pen throughout.",
    },
    verticalLabel: "Vertical",
    items: [
      {
        title: "Real Estate Investments",
        body: "Advisory across prime residential, coastal estates and yield-generating assets — from thesis to acquisition to stewardship.",
        bullets: [
          "Off-market origination",
          "Institutional-grade underwriting",
          "Vehicle & ownership design",
        ],
      },
      {
        title: "Hospitality Investments",
        body: "Hotel, branded-residence and serviced-apartment investments, structured alongside institutional operators and independent brands.",
        bullets: [
          "Operator selection & JV structuring",
          "Repositioning & capex strategy",
          "Performance oversight",
        ],
      },
      {
        title: "Business Acquisitions (M&A)",
        body: "Buy-side advisory for GCC principals acquiring Spanish operating businesses — sourcing, valuation, negotiation and post-deal integration.",
        bullets: [
          "Target sourcing & screening",
          "Financial & legal due diligence",
          "SPA negotiation & closing",
        ],
      },
      {
        title: "Strategic Partnerships",
        body: "We introduce and structure partnerships with Spanish developers, operators and institutional co-investors aligned with your objectives.",
        bullets: [
          "Co-investment structuring",
          "Joint venture governance",
          "Alignment & incentive design",
        ],
      },
      {
        title: "Market Entry in Spain",
        body: "Full market-entry advisory for GCC groups establishing a Spanish or European platform — from regulatory setup to first hires.",
        bullets: [
          "Entity setup & tax alignment",
          "Regulatory & compliance mapping",
          "Local team & office build-out",
        ],
      },
      {
        title: "Investor Representation",
        body: "We act as your permanent counterpart on the ground in Spain — independent, senior, and free of seller-side commissions.",
        bullets: [
          "Bilingual reporting (EN/AR)",
          "Governance integration",
          "Sharia-conscious options",
        ],
      },
    ],
  },
  whySpain: {
    hero: {
      eyebrow: "The Investment Thesis",
      title: "Why Spain — and why now.",
      intro:
        "Spain has quietly become one of Europe's most compelling destinations for private capital. For GCC families, it offers a rare combination of yield, lifestyle and cultural affinity.",
    },
    perspective: {
      eyebrow: "Perspective",
      title: "A market that finally rewards patience and discernment.",
      paragraphs: [
        "After a decade of structural repricing, Spanish prime real estate today sits at a rare intersection: institutional transparency, favourable demographics, and pricing that still trails comparable European capitals by a meaningful margin.",
        "For the patient investor, the entry point is unusually attractive. For the family principal, the country itself is a destination worth belonging to.",
      ],
    },
    reasonsSection: {
      eyebrow: "Six Reasons",
      title: "The pillars of the thesis.",
    },
    reasons: [
      {
        title: "Macro Stability",
        body: "The eurozone's fastest-growing large economy, with tourism, tech and renewable-energy tailwinds anchoring long-term demand for prime real estate.",
      },
      {
        title: "Currency & Yield",
        body: "Euro-denominated hard assets offer a natural hedge and yields that consistently outperform Northern European gateway cities.",
      },
      {
        title: "Lifestyle Capital",
        body: "300 days of sun, world-class healthcare, education and gastronomy — a genuine second home, not just a portfolio line.",
      },
      {
        title: "Residency Pathways",
        body: "Advisory on non-lucrative, digital-nomad and family reunification routes, coordinated with specialist immigration counsel.",
      },
      {
        title: "Cultural Bridge",
        body: "Deep historic ties between the Iberian Peninsula and the Arab world make Spain among the most welcoming European markets for Gulf capital.",
      },
      {
        title: "Institutional Transparency",
        body: "EU-regulated title, notarial protection and mature financing markets deliver the clarity family offices require.",
      },
    ],
  },
  opportunities: {
    hero: {
      eyebrow: "Strategic Opportunities",
      title: "A representative sample. The best opportunities never reach a website.",
      intro:
        "What we show publicly is deliberately limited. Full memoranda — with financials, structure and diligence packs — are shared under NDA with qualified principals only. We advise on the decision; we do not sell the asset.",
    },
    dealParametersSr: "Deal parameters",
    ctaButton: "Schedule a Private Consultation",
    deals: [
      {
        tag: "Real Estate",
        city: "Marbella · Golden Mile",
        title: "Frontline residential repositioning",
        meta: ["€ 18 – 26M", "Value-add", "Off-market"],
        body: "Two adjoining frontline assets with combined redevelopment potential and unobstructed sea views. Sourced directly with the ownership.",
      },
      {
        tag: "Real Estate · Prime",
        city: "Madrid · Salamanca",
        title: "Classical building repositioning",
        meta: ["€ 32M", "Value-add", "Pre-market"],
        body: "Full-building acquisition of a listed 1920s asset for boutique branded-residence conversion, structured alongside an institutional operator.",
      },
      {
        tag: "Hospitality",
        city: "Barcelona · Eixample",
        title: "Serviced-apartment platform",
        meta: ["€ 12M", "6.4% yield", "Stabilised"],
        body: "Stabilised platform of 22 short-stay units with an in-place operator. Reviewed for GCC investors seeking euro-denominated recurring income.",
      },
      {
        tag: "Hospitality · JV",
        city: "Costa del Sol",
        title: "Marina-front hotel co-investment",
        meta: ["€ 45M ticket", "8-year hold", "Institutional JV"],
        body: "Co-investment alongside an institutional operator in a five-star marina redevelopment. Sharia-conscious structuring available.",
      },
      {
        tag: "M&A · Business Acquisition",
        city: "Spain · Services",
        title: "Buy-side mandate — mid-market operator",
        meta: ["€ 25 – 40M EV", "EBITDA-positive", "Buy-side"],
        body: "Sector-agnostic buy-side mandate on behalf of a GCC principal seeking a controlling stake in a Spanish operating business, with local management retention.",
      },
      {
        tag: "Market Entry",
        city: "Iberia · Platform build",
        title: "European platform for a GCC group",
        meta: ["Multi-phase", "Advisory retainer", "Confidential"],
        body: "End-to-end market-entry engagement: entity setup, regulatory mapping, local hires and first strategic partnerships in Spain and Portugal.",
      },
    ],
    advisoryRoom: {
      eyebrow: "Private Advisory Room",
      title: "Access the full pipeline.",
      body: "Qualified principals receive curated memoranda across our verticals directly. Introductions typically follow a brief initial call, held in confidence.",
      button: "Schedule a Private Consultation",
    },
  },
  contact: {
    hero: {
      eyebrow: "Private Consultation",
      title: "Begin the conversation, in confidence.",
      intro:
        "Introductory meetings are complimentary and typically held in Madrid, Dubai, or by secure video — in English or Arabic. Every enquiry is reviewed personally by a partner.",
    },
    offices: {
      eyebrow: "Offices & Contact",
      blocks: [
        {
          title: "Madrid — Headquarters",
          lines: ["Paseo de la Castellana", "28046 Madrid, Spain", "+34 910 000 000"],
        },
        {
          title: "Gulf Representation",
          lines: ["DIFC, Dubai", "By appointment only", "+971 4 000 0000"],
        },
        {
          title: "Correspondence",
          lines: ["partners@amanapartners.com", "Mon – Fri · 09:00 – 19:00 CET"],
        },
      ],
    },
    form: {
      eyebrow: "Request a Consultation",
      title: "Tell us a little about you.",
      fields: {
        name: "Full name",
        country: "Country",
        email: "Email",
        phone: "Phone",
      },
      interestLabel: "Area of interest",
      interests: [
        "Real Estate Investments",
        "Hospitality Investments",
        "Business Acquisitions (M&A)",
        "Strategic Partnerships",
        "Market Entry in Spain",
        "Investor Representation",
        "Undecided — exploratory",
      ],
      messageLabel: "Message",
      messagePlaceholder: "Anything you'd like us to know in advance.",
      honeypotLabel: "Company website",
      submit: "Request Consultation",
      confirmSent:
        "Thank you — your enquiry has been received. A partner will be in touch within one business day.",
      confirmDefault:
        "Your enquiry is confidential and reviewed personally by a partner within one business day.",
    },
  },
  notFound: {
    errorLabel: "Error 404",
    title: "Page not found",
    body: "The page you're looking for is no longer part of our advisory.",
    returnHome: "Return home",
  },
  errorPage: {
    eyebrow: "Something went wrong",
    title: "This page didn't load",
    body: "Please try again or return home.",
    tryAgain: "Try again",
    goHome: "Go home",
  },
};

const ar: typeof en = {
  common: {
    skipToContent: "تخطَّ إلى المحتوى",
    homeAriaLabel: "أمانة بارتنرز — الصفحة الرئيسية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    primaryNav: "التنقل الرئيسي",
    mobileNav: "قائمة الجوال",
  },
  nav: {
    home: "الرئيسية",
    whySpain: "لماذا إسبانيا",
    services: "الخدمات",
    opportunities: "الفرص",
    about: "من نحن",
    contact: "تواصل معنا",
    consultation: "استشارة خاصة",
  },
  footer: {
    blurb:
      "شركة استشارات استثمار خاصة عابرة للحدود، تساعد المستثمرين الرئيسيين الخليجيين على تحديد الفرص الاستراتيجية في إسبانيا وتقييمها والوصول إليها — من العقارات والضيافة إلى الاندماج والاستحواذ ودخول السوق.",
    navigate: "التصفح",
    marketsServed: "الأسواق التي نخدمها",
    markets: ["دول مجلس التعاون الخليجي", "إسبانيا", "أوروبا"],
    rightsReserved: "جميع الحقوق محفوظة.",
    tagline: "الخليج · إسبانيا · أوروبا",
  },
  home: {
    hero: {
      badge1: "استشارات استراتيجية",
      badge2: "استثمار عابر للحدود",
      titlePrefix: "ماذا لو كانت إسبانيا هي",
      titleEm: "استثمارك الأذكى",
      titleSuffix: "؟",
      subtitle:
        "استشارات استثمار عابرة للحدود للمستثمرين الرئيسيين من دول مجلس التعاون الخليجي. نحدد الفرص الاستراتيجية في جميع أنحاء إسبانيا ونقيّمها ونؤمّنها من خلال شراكات محلية موثوقة.",
      ctaSpeak: "تحدث مع نوار شاكر",
      ctaExpertise: "خبراتنا",
      trust: ["الخليج", "إسبانيا", "استشارات عابرة للحدود"],
    },
    stats: [
      "حجم الصفقات الاستشارية",
      "سنوات العمل في إسبانيا",
      "الدول التي نخدمها",
      "تفويضات عملاء خاصين حصراً",
    ],
    positioning: {
      eyebrow: "مهمتنا",
      titleLine1: "انضباط مؤسسي.",
      titleLine2Gold: "وقرب مكتب عائلي.",
      body: "تأسست أمانة بارتنرز من أجل مستثمر محدد: المستثمر الرئيسي الخليجي الذي يقدّر السرية ووضوح الهيكل والحفاظ على رأس المال على المدى الطويل. نحن مستشارون، لا وسطاء. دورنا أن نجلس إلى جانبكم على طاولة التفاوض في كل قطاع نعمل فيه — من العقارات والضيافة إلى الاستحواذات التجارية ودخول السوق الإسباني.",
      facts: [
        { label: "التركيز", value: "استشارات عابرة للحدود" },
        { label: "التغطية", value: "إسبانيا بالكامل" },
        { label: "العملاء", value: "عائلات ومكاتب خليجية" },
        { label: "حجم الاستثمار", value: "3 – 50+ مليون يورو" },
      ],
    },
    pillars: {
      eyebrow: "لماذا أمانة بارتنرز",
      title: "نقطة ثقة واحدة، في كل قطاع.",
      items: [
        {
          title: "التوجيه الاستراتيجي",
          body: "نساعد المستثمرين الرئيسيين الخليجيين على بلورة رؤية استثمارية لإسبانيا، ثم نترجمها إلى فرص ملموسة وقابلة للتنفيذ عبر قطاعاتنا.",
        },
        {
          title: "الهيكلة العابرة للحدود",
          body: "أدوات تملّك، وخيارات تمويل متوافقة مع الشريعة، ومواءمة ضريبية، ومسارات إقامة مصممة خصيصاً للعائلات والمكاتب الخليجية.",
        },
        {
          title: "التمثيل طويل الأمد",
          body: "نعمل كممثل دائم لكم على الأرض في إسبانيا — مستقلون، على مستوى إداري رفيع، وبلا عمولات من جهة البائع.",
        },
      ],
    },
    markets: {
      eyebrow: "أين نعمل",
      title: "ثلاثة أسواق نعرفها عن قرب.",
      intro:
        "تغطيتنا تشمل إسبانيا بالكامل، إلا أن العمق يتراكم مع الوقت. هذه هي الأسواق التي تتمتع فيها شبكتنا المحلية بأكبر عمق، والتي تنشأ منها معظم فرصنا خارج السوق المفتوحة.",
      items: [
        { city: "مربيا", note: "عقارات ساحلية ومساكن بعلامات تجارية" },
        { city: "مدريد", note: "مواقع مركزية متميزة وتجارية" },
        { city: "برشلونة", note: "ضيافة واستخدام مختلط" },
      ],
    },
    verticals: {
      eyebrow: "الفرص الاستراتيجية",
      title: "ستة قطاعات استثمارية.",
      intro:
        "العقارات هي أحد القطاعات التي نقدّم فيها الاستشارة — وليست هوية الشركة. كل تفويض يُصاغ وفق رؤية المستثمر، لا كمنتج جاهز للبيع.",
      exploreLink: "استكشف استشاراتنا ←",
      items: [
        { title: "استثمارات عقارية", note: "أصول متميزة وساحلية ومدرّة للدخل" },
        { title: "استثمارات ضيافة", note: "فنادق ومساكن بعلامات تجارية" },
        { title: "استحواذات تجارية", note: "اندماج واستحواذ في إسبانيا" },
        { title: "شراكات استراتيجية", note: "استثمار مشترك وهيكلة مشاريع مشتركة" },
        { title: "دخول السوق الإسباني", note: "بناء منصة وكيان وفريق عمل" },
        { title: "تمثيل المستثمرين", note: "شريك مستقل طويل الأمد" },
      ],
    },
    approach: {
      eyebrow: "منهجنا",
      title: "رحلة الاستثمار، من البداية إلى النهاية.",
      intro:
        "يرافقكم مستشار أول واحد منذ أول محادثة سرية وحتى الإدارة طويلة الأمد لاستثماركم في إسبانيا.",
      steps: [
        {
          title: "استشارة خاصة",
          body: "لقاء أول سري لفهم أهدافكم وأفقكم الزمني ومحدداتكم.",
        },
        {
          title: "استراتيجية الاستثمار",
          body: "نحدد رؤيتكم الاستثمارية لإسبانيا — القطاع، الموقع الجغرافي، حجم الاستثمار، ومستوى المخاطرة.",
        },
        {
          title: "اختيار الفرص",
          body: "نبحث عن الفرص المتوافقة مع التفويض ونفرزها وندرجها ضمن قائمة مختصرة — معظمها خارج السوق المفتوحة.",
        },
        {
          title: "التنسيق القانوني والتجاري",
          body: "ننسّق أعمال التدقيق الواجب، والهيكلة، والجوانب الضريبية والقانونية نيابة عنكم.",
        },
        {
          title: "الاستحواذ",
          body: "التفاوض، والإغلاق، والتسليم — مع مستشار أول واحد يتولى الملف من البداية إلى النهاية.",
        },
        {
          title: "شراكة طويلة الأمد",
          body: "نبقى ممثلكم المستقل في إسبانيا لفترة طويلة بعد إتمام الصفقة.",
        },
      ],
    },
    testimonial: {
      eyebrow: "شهادة من عملائنا",
      quote:
        "«فهمت أمانة بارتنرز عائلتنا قبل أن تعرض علينا فرصة واحدة. هذا الترتيب — الثقة أولاً، ثم الاستراتيجية، وأخيراً الصفقة — هو ما يميزهم.»",
      attribution: "— مستثمر رئيسي، مكتب عائلي مقره الرياض",
    },
    finalCta: {
      eyebrow: "ابدأوا الحوار",
      title: "استشارة خاصة، في سرية تامة.",
      body: "الاجتماعات التمهيدية مجانية وتُعقد عادة في مدريد أو دبي أو عبر مكالمة فيديو آمنة — باللغة الإنجليزية أو العربية.",
      button: "احجز استشارة خاصة",
    },
  },
  about: {
    hero: {
      eyebrow: "عن أمانة بارتنرز",
      title: "شركة استشارات خاصة، بُنيت من أجل حوار طويل الأمد.",
      intro:
        "أمانة بارتنرز شركة استشارات استثمار عابرة للحدود. نحن لسنا وسطاء عقاريين. نساعد المستثمرين الرئيسيين الخليجيين على تحديد الفرص الاستراتيجية في إسبانيا وتقييمها والوصول إليها — ونبقى ممثلهم المستقل لفترة طويلة بعد إتمام الصفقة.",
    },
    mission: {
      eyebrow: "مهمتنا",
      title: "الجسر الاستراتيجي الموثوق بين المستثمرين الخليجيين وإسبانيا.",
      paragraphs: [
        "تأسست أمانة بارتنرز لتكون الجسر الاستراتيجي الموثوق بين المستثمرين الخليجيين والفرص المتاحة في إسبانيا.",
        "نقدّم استشارات مستقلة، وشراكات محلية موثوقة، وتوجيهاً استثمارياً طويل الأمد — في مجالات العقارات، والضيافة، والاستحواذات التجارية، والشراكات الاستراتيجية، ودخول السوق، وتمثيل المستثمرين.",
        "«أمانة» — وهي كلمة الثقة بالعربية — هي المعيار الذي نلتزم به في كل تفويض نقبله.",
      ],
      quote:
        "«نحن لا نبيع الأصول. نساعد المستثمرين على اتخاذ القرارات الاستراتيجية الصحيحة — ونبقى إلى جانبهم لفترة طويلة بعد اتخاذ القرار.»",
      quoteAttribution: "الشريك الإداري",
    },
    values: {
      eyebrow: "قيمنا",
      title: "أربعة التزامات، بلا استثناء.",
      items: [
        {
          title: "السرية",
          body: "كل تفويض يُعامل بسرية تامة. تبقى الأسماء والهياكل والحيازات ضمن نطاق العائلة.",
        },
        {
          title: "التوافق",
          body: "نقدم الاستشارة على أساس تفويض خاص، دون عمولات غير معلنة أو رسوم إحالة من البائعين.",
        },
        {
          title: "الاستمرارية",
          body: "نقيس النجاح بالعقود لا بالصفقات. معظم عملائنا جاؤوا عبر توصية شخصية.",
        },
        {
          title: "الإلمام الثقافي",
          body: "نعمل بالإنجليزية والإسبانية والعربية — وندرك ما تحمله هذه اللغات إلى ما هو أبعد من الترجمة.",
        },
      ],
    },
  },
  services: {
    hero: {
      eyebrow: "خبراتنا",
      title: "استشارات استثمار عابرة للحدود، في ستة قطاعات.",
      intro:
        "نحن لا نبيع الأصول. نساعد المستثمرين الرئيسيين الخليجيين على اتخاذ القرارات الاستراتيجية الصحيحة في إسبانيا — من الرؤية الأولية إلى التمثيل طويل الأمد — مع مستشار أول واحد يتولى الملف من البداية إلى النهاية.",
    },
    verticalLabel: "القطاع",
    items: [
      {
        title: "استثمارات عقارية",
        body: "استشارات في العقارات السكنية المتميزة، والعقارات الساحلية، والأصول المدرّة للدخل — من الرؤية إلى الاستحواذ إلى الإدارة.",
        bullets: [
          "مصادر خارج السوق المفتوحة",
          "تحليل ائتماني بمعايير مؤسسية",
          "تصميم أدوات التملك",
        ],
      },
      {
        title: "استثمارات ضيافة",
        body: "استثمارات في الفنادق والمساكن ذات العلامات التجارية والشقق الفندقية، بالتنسيق مع مشغلين مؤسسيين وعلامات مستقلة.",
        bullets: [
          "اختيار المشغل وهيكلة المشاريع المشتركة",
          "إعادة التموضع واستراتيجية الإنفاق الرأسمالي",
          "متابعة الأداء",
        ],
      },
      {
        title: "استحواذات تجارية (اندماج واستحواذ)",
        body: "استشارات لصالح المشتري للمستثمرين الخليجيين الراغبين في الاستحواذ على شركات تشغيلية إسبانية — من البحث والتقييم إلى التفاوض والدمج بعد الصفقة.",
        bullets: [
          "البحث عن الأهداف وفرزها",
          "التدقيق الواجب المالي والقانوني",
          "التفاوض على اتفاقية الشراء وإغلاق الصفقة",
        ],
      },
      {
        title: "شراكات استراتيجية",
        body: "نقدّم ونهيكل شراكات مع مطورين ومشغلين ومستثمرين مؤسسيين مشاركين في إسبانيا، بما يتوافق مع أهدافكم.",
        bullets: [
          "هيكلة الاستثمار المشترك",
          "حوكمة المشاريع المشتركة",
          "تصميم آليات التوافق والحوافز",
        ],
      },
      {
        title: "دخول السوق الإسباني",
        body: "استشارات شاملة لدخول السوق للمجموعات الخليجية الراغبة في تأسيس منصة إسبانية أو أوروبية — من التأسيس التنظيمي إلى أول التعيينات.",
        bullets: [
          "تأسيس الكيان والمواءمة الضريبية",
          "رسم الخريطة التنظيمية والامتثال",
          "بناء الفريق والمكتب المحلي",
        ],
      },
      {
        title: "تمثيل المستثمرين",
        body: "نعمل كممثل دائم لكم على الأرض في إسبانيا — مستقلون، على مستوى إداري رفيع، وبلا عمولات من جهة البائع.",
        bullets: [
          "تقارير ثنائية اللغة (إنجليزي/عربي)",
          "دمج آليات الحوكمة",
          "خيارات متوافقة مع الشريعة",
        ],
      },
    ],
  },
  whySpain: {
    hero: {
      eyebrow: "الرؤية الاستثمارية",
      title: "لماذا إسبانيا — ولماذا الآن.",
      intro:
        "أصبحت إسبانيا بهدوء واحدة من أكثر الوجهات جاذبية في أوروبا لرأس المال الخاص. وهي تقدّم للعائلات الخليجية مزيجاً نادراً من العائد وأسلوب الحياة والتقارب الثقافي.",
    },
    perspective: {
      eyebrow: "منظور",
      title: "سوق يكافئ أخيراً الصبر وحسن التقدير.",
      paragraphs: [
        "بعد عقد من إعادة التسعير الهيكلي، تقف العقارات الإسبانية المتميزة اليوم عند تقاطع نادر: شفافية مؤسسية، وديموغرافيا مؤاتية، وأسعار لا تزال أقل بفارق ملموس مقارنة بالعواصم الأوروبية المماثلة.",
        "بالنسبة للمستثمر الصبور، تُعد نقطة الدخول جذابة بشكل استثنائي. أما بالنسبة لرب العائلة، فالبلد نفسه وجهة تستحق الانتماء إليها.",
      ],
    },
    reasonsSection: {
      eyebrow: "ستة أسباب",
      title: "ركائز الرؤية الاستثمارية.",
    },
    reasons: [
      {
        title: "الاستقرار الكلي",
        body: "أسرع اقتصاد كبير نمواً في منطقة اليورو، مدعوماً بزخم في السياحة والتكنولوجيا والطاقة المتجددة يرسّخ الطلب طويل الأمد على العقارات المتميزة.",
      },
      {
        title: "العملة والعائد",
        body: "توفر الأصول العينية المقومة باليورو تحوطاً طبيعياً وعوائد تتفوق باستمرار على مدن البوابة في شمال أوروبا.",
      },
      {
        title: "رأس مال أسلوب الحياة",
        body: "300 يوم مشمس، ورعاية صحية وتعليم وفن طهي على مستوى عالمي — منزل ثانٍ حقيقي، لا مجرد بند في المحفظة الاستثمارية.",
      },
      {
        title: "مسارات الإقامة",
        body: "استشارات حول مسارات الإقامة غير الربحية، والرحّل الرقميين، ولمّ شمل الأسرة، بالتنسيق مع مستشارين متخصصين في الهجرة.",
      },
      {
        title: "الجسر الثقافي",
        body: "الروابط التاريخية العميقة بين شبه الجزيرة الأيبيرية والعالم العربي تجعل إسبانيا من أكثر الأسواق الأوروبية ترحيباً برأس المال الخليجي.",
      },
      {
        title: "الشفافية المؤسسية",
        body: "الملكية المنظمة وفق معايير الاتحاد الأوروبي، والحماية التوثيقية، وأسواق التمويل الناضجة توفر الوضوح الذي تحتاجه المكاتب العائلية.",
      },
    ],
  },
  opportunities: {
    hero: {
      eyebrow: "الفرص الاستراتيجية",
      title: "عينة تمثيلية. أفضل الفرص لا تصل أبداً إلى موقع إلكتروني.",
      intro:
        "ما نعرضه علناً محدود عن قصد. تتم مشاركة المذكرات الكاملة — بما في ذلك البيانات المالية والهيكلة وحزم التدقيق — بموجب اتفاقية عدم إفصاح مع المستثمرين المؤهلين فقط. نحن نقدم الاستشارة بشأن القرار؛ ولا نبيع الأصل.",
    },
    dealParametersSr: "معايير الصفقة",
    ctaButton: "احجز استشارة خاصة",
    deals: [
      {
        tag: "عقارات",
        city: "مربيا · الميل الذهبي",
        title: "إعادة تموضع سكني على الواجهة البحرية",
        meta: ["18 – 26 مليون يورو", "قيمة مضافة", "خارج السوق"],
        body: "أصلان متجاوران على الواجهة البحرية بإمكانية إعادة تطوير مشتركة وإطلالة بحرية غير محجوبة. تم الحصول عليهما مباشرة من الملاك.",
      },
      {
        tag: "عقارات · متميزة",
        city: "مدريد · سالامانكا",
        title: "إعادة تموضع مبنى كلاسيكي",
        meta: ["32 مليون يورو", "قيمة مضافة", "قبل الطرح في السوق"],
        body: "استحواذ على مبنى كامل مُصنّف من عشرينيات القرن الماضي لتحويله إلى مساكن بوتيكية بعلامة تجارية، بالتنسيق مع مشغل مؤسسي.",
      },
      {
        tag: "ضيافة",
        city: "برشلونة · إكسامبل",
        title: "منصة شقق فندقية",
        meta: ["12 مليون يورو", "عائد 6.4%", "مستقرة تشغيلياً"],
        body: "منصة مستقرة تشغيلياً تضم 22 وحدة للإقامة القصيرة مع مشغل قائم. تمت مراجعتها للمستثمرين الخليجيين الباحثين عن دخل متكرر مقوّم باليورو.",
      },
      {
        tag: "ضيافة · مشروع مشترك",
        city: "كوستا ديل سول",
        title: "استثمار مشترك في فندق على الواجهة البحرية",
        meta: ["حصة 45 مليون يورو", "مدة احتفاظ 8 سنوات", "مشروع مشترك مؤسسي"],
        body: "استثمار مشترك مع مشغل مؤسسي في مشروع إعادة تطوير مرسى خمس نجوم. تتوفر خيارات هيكلة متوافقة مع الشريعة.",
      },
      {
        tag: "اندماج واستحواذ · استحواذ تجاري",
        city: "إسبانيا · خدمات",
        title: "تفويض شراء — مشغل من السوق المتوسطة",
        meta: ["قيمة مؤسسية 25 – 40 مليون يورو", "أرباح تشغيلية إيجابية", "تفويض شراء"],
        body: "تفويض شراء غير مقيد بقطاع معين نيابة عن مستثمر رئيسي خليجي يسعى للحصول على حصة مسيطرة في شركة تشغيلية إسبانية، مع الإبقاء على الإدارة المحلية.",
      },
      {
        tag: "دخول السوق",
        city: "شبه الجزيرة الأيبيرية · بناء منصة",
        title: "منصة أوروبية لمجموعة خليجية",
        meta: ["متعدد المراحل", "اتفاقية استشارة مستمرة", "سري"],
        body: "مشاركة شاملة لدخول السوق: تأسيس الكيان، ورسم الخريطة التنظيمية، والتوظيف المحلي، وأولى الشراكات الاستراتيجية في إسبانيا والبرتغال.",
      },
    ],
    advisoryRoom: {
      eyebrow: "غرفة الاستشارة الخاصة",
      title: "الاطلاع على كامل قائمة الفرص.",
      body: "يحصل المستثمرون المؤهلون على مذكرات منتقاة بعناية عبر جميع قطاعاتنا مباشرة. تُعقد التعريفات عادة بعد مكالمة أولية موجزة وسرية.",
      button: "احجز استشارة خاصة",
    },
  },
  contact: {
    hero: {
      eyebrow: "استشارة خاصة",
      title: "ابدأوا الحوار، في سرية تامة.",
      intro:
        "الاجتماعات التمهيدية مجانية وتُعقد عادة في مدريد أو دبي أو عبر مكالمة فيديو آمنة — باللغة الإنجليزية أو العربية. تتم مراجعة كل استفسار شخصياً من قبل أحد الشركاء.",
    },
    offices: {
      eyebrow: "المكاتب والتواصل",
      blocks: [
        {
          title: "مدريد — المقر الرئيسي",
          lines: ["Paseo de la Castellana", "28046 Madrid, Spain", "+34 910 000 000"],
        },
        {
          title: "التمثيل الخليجي",
          lines: ["DIFC, Dubai", "بموعد مسبق فقط", "+971 4 000 0000"],
        },
        {
          title: "المراسلات",
          lines: [
            "partners@amanapartners.com",
            "الاثنين – الجمعة · 09:00 – 19:00 بتوقيت وسط أوروبا",
          ],
        },
      ],
    },
    form: {
      eyebrow: "طلب استشارة",
      title: "أخبرونا قليلاً عن أنفسكم.",
      fields: {
        name: "الاسم الكامل",
        country: "الدولة",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
      },
      interestLabel: "مجال الاهتمام",
      interests: [
        "استثمارات عقارية",
        "استثمارات ضيافة",
        "استحواذات تجارية (اندماج واستحواذ)",
        "شراكات استراتيجية",
        "دخول السوق الإسباني",
        "تمثيل المستثمرين",
        "غير محدد — استكشافي",
      ],
      messageLabel: "الرسالة",
      messagePlaceholder: "أي شيء تودون إخبارنا به مسبقاً.",
      honeypotLabel: "الموقع الإلكتروني للشركة",
      submit: "طلب استشارة",
      confirmSent: "شكراً لكم — تم استلام استفساركم. سيتواصل معكم أحد الشركاء خلال يوم عمل واحد.",
      confirmDefault: "استفساركم سري ويُراجَع شخصياً من قبل أحد الشركاء خلال يوم عمل واحد.",
    },
  },
  notFound: {
    errorLabel: "خطأ 404",
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحثون عنها لم تعد جزءاً من موقعنا.",
    returnHome: "العودة إلى الصفحة الرئيسية",
  },
  errorPage: {
    eyebrow: "حدث خطأ ما",
    title: "لم يتم تحميل هذه الصفحة",
    body: "يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.",
    tryAgain: "المحاولة مرة أخرى",
    goHome: "الصفحة الرئيسية",
  },
};

export const translations = { en, ar };
export type Locale = keyof typeof translations;
export type Dictionary = typeof en;
