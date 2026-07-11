import * as React from "react";

export type Locale = "en" | "hi" | "ml";

export interface TranslationDictionary {
    // General / Navbar
    logoText: string;
    navHome: string;
    navAbout: string;
    searchPlaceholder: string;
    cartTooltip: string;
    profileTooltip: string;
    mobileHelloGuest: string;
    mobileHelloUser: string;
    mobileSignInOut: string;
    mobileDemoUser: string;
    mobileSignup: string;
    mobileProfile: string;
    mobileOrders: string;
    mobileListings: string;
    mobileStartSelling: string;
    browseCategories: string;
    trendingNow: string;

    // Hero Section
    heroBadge: string;
    heroTitleFirst: string;
    heroTitleAccent: string;
    heroTitleEnd: string;
    heroDescription: string;
    heroBtnShop: string;
    heroBtnSell: string;
    statDrops: string;
    statSellers: string;
    statRating: string;

    // Value Props Section
    valueTitle: string;
    valueSubtitle: string;
    valueProp1Title: string;
    valueProp1Desc: string;
    valueProp2Title: string;
    valueProp2Desc: string;
    valueProp3Title: string;
    valueProp3Desc: string;

    // Categories Section
    catTitle: string;
    catSubtitle: string;
    catViewAll: string;
    catTeesTitle: string;
    catTeesDesc: string;
    catDenimTitle: string;
    catDenimDesc: string;
    catKnitsTitle: string;
    catKnitsDesc: string;
    catCargoTitle: string;
    catCargoDesc: string;

    // Newsletter Section
    newsTitle: string;
    newsDesc: string;
    newsPlaceholder: string;
    newsBtn: string;

    // Footer
    footerTagline: string;
    footerShopCol: string;
    footerShopLink1: string;
    footerShopLink2: string;
    footerShopLink3: string;
    footerShopLink4: string;
    footerCompanyCol: string;
    footerCompanyLink1: string;
    footerCompanyLink2: string;
    footerCompanyLink3: string;
    footerSupportCol: string;
    footerSupportLink1: string;
    footerSupportLink2: string;
    footerSupportLink3: string;
    footerLegal: string;

    // Carousel Details
    cardBadge: string;
    cardSize: string;
    cardPrice: string;
    cardBtnClaim: string;
    cardAlertAdded: string;

    // Product Names & Descriptions
    prod1Name: string;
    prod1Desc: string;
    prod2Name: string;
    prod2Desc: string;
    prod3Name: string;
    prod3Desc: string;
    prod4Name: string;
    prod4Desc: string;
    prod5Name: string;
    prod5Desc: string;
    prod6Name: string;
    prod6Desc: string;
    prod7Name: string;
    prod7Desc: string;
    prod8Name: string;
    prod8Desc: string;
    prod9Name: string;
    prod9Desc: string;
    prod10Name: string;
    prod10Desc: string;
    prod11Name: string;
    prod11Desc: string;
    prod12Name: string;
    prod12Desc: string;
    matCotton: string;
    matDenim: string;
    matCorduroy: string;
    matWool: string;
    matFleece: string;
    matNylon: string;
    condExcellent: string;
    condVeryGood: string;
    condGood: string;
    catalogTitle: string;
    filterBrand: string;
    filterSize: string;
    filterPrice: string;
    sortBy: string;
    ecoSavingsTitle: string;
    conditionTitle: string;
    prodDetailsTitle: string;
    measurementsTitle: string;
    returnWarningTitle: string;
    returnWarningDesc: string;
    relatedProductsTitle: string;

    // Redesign sections
    brandStripTitle: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    howStep1Title: string;
    howStep1Desc: string;
    howStep2Title: string;
    howStep2Desc: string;
    howStep3Title: string;
    howStep3Desc: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    review1Text: string;
    review1Author: string;
    review1Role: string;
    review2Text: string;
    review2Author: string;
    review2Role: string;
    review3Text: string;
    review3Author: string;
    review3Role: string;
    faqTitle: string;
    faqSubtitle: string;
    faqQ1: string;
    faqA1: string;
    faqQ2: string;
    faqA2: string;
    faqQ3: string;
    faqA3: string;
    faqQ4: string;
    faqA4: string;
    cartTitle: string;
    cartEmpty: string;
    cartEmptySub: string;
    cartReservedWarning: string;
    cartExpiryLabel: string;
    cartExpiryConfig: string;
    checkoutBtn: string;
    cartSubtotal: string;
    cartShipping: string;
    cartTotal: string;
    cartItemRemoved: string;
    checkoutSuccess: string;
    cartAbandonedAlert: string;
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
    en: {
        logoText: "next.in",
        navHome: "Home",
        navAbout: "About",
        searchPlaceholder: "Search vintage, brands, styles…",
        cartTooltip: "Shopping cart",
        profileTooltip: "User menu",
        mobileHelloGuest: "Hello, Guest!",
        mobileHelloUser: "Hello, {name}!",
        mobileSignInOut: "Sign out",
        mobileDemoUser: "Sign in (Demo)",
        mobileSignup: "Sign up",
        mobileProfile: "My Profile",
        mobileOrders: "My Orders",
        mobileListings: "My Listings",
        mobileStartSelling: "Start selling",
        browseCategories: "Browse categories",
        trendingNow: "Trending now",

        heroBadge: "100% Handpicked Eco-Friendly Clothing",
        heroTitleFirst: "Find Unique",
        heroTitleAccent: "Vintage",
        heroTitleEnd: "& Thrift Clothes.",
        heroDescription: "next.in is a handpicked digital thrift store. Find unique vintage pieces and sustainable everyday clothes, all checked and selected by hand.",
        heroBtnShop: "Shop Collection",
        heroBtnSell: "Start Selling",
        statDrops: "Unique Items",
        statSellers: "Trusted Sellers",
        statRating: "User Rating",

        valueTitle: "Thrifting Made Easy.",
        valueSubtitle: "We check every clothing piece by hand so you can buy vintage and streetwear with complete trust.",
        valueProp1Title: "Quality Checked By Hand",
        valueProp1Desc: "Every single item is checked for quality. No hidden stains, holes, or fake items.",
        valueProp2Title: "Good for the Planet",
        valueProp2Desc: "Buying thrifted clothes keeps them in use, reduces waste, and saves 80% carbon footprint.",
        valueProp3Title: "One-of-a-Kind Items",
        valueProp3Desc: "Stand out with clothes that are uniquely yours. Get rare vintage and brand clothing not sold in stores.",

        catTitle: "Shop Curated Catalog",
        catSubtitle: "Discover items categorized by style",
        catViewAll: "View all catalog",
        catTeesTitle: "Retro Tees",
        catTeesDesc: "90s Graphics & Band Merch →",
        catDenimTitle: "Denim & Jeans",
        catDenimDesc: "Classic Cuts & Heavyweight Denim →",
        catKnitsTitle: "Knits & Sweaters",
        catKnitsDesc: "Cozy Cardigans & Pullovers →",
        catCargoTitle: "Cargo & Outerwear",
        catCargoDesc: "Utility Pants & Field Jackets →",

        newsTitle: "Never Miss a Drop.",
        newsDesc: "Curated collections drops every Friday at 7:00 PM. Subscribe to email notifications to secure catalog access 10 minutes early.",
        newsPlaceholder: "Enter your email address...",
        newsBtn: "Notify Me",

        footerTagline: "Pre-loved fashion, planet-friendly future.",
        footerShopCol: "Shop",
        footerShopLink1: "Retro Tees",
        footerShopLink2: "Denim & Jeans",
        footerShopLink3: "Knits & Sweaters",
        footerShopLink4: "Cargo & Outerwear",
        footerCompanyCol: "Company",
        footerCompanyLink1: "About Us",
        footerCompanyLink2: "How It Works",
        footerCompanyLink3: "Sell With Us",
        footerSupportCol: "Support",
        footerSupportLink1: "FAQ",
        footerSupportLink2: "Shipping & Returns",
        footerSupportLink3: "Contact Us",
        footerLegal: "© 2025 next.in. All rights reserved.",

        cardBadge: "1 OF 1 VINTAGE",
        cardSize: "Size",
        cardPrice: "Price",
        cardBtnClaim: "Add to Cart",
        cardAlertAdded: "Added to cart!",

        prod1Name: "Vintage Graphic Tee",
        prod1Desc: "Curated 1994 authentic heavyweight cotton tee with a distressed front graphic print.",
        prod2Name: "Classic Denim 501 Jeans",
        prod2Desc: "Hard-to-find vintage wash Levi's 501s with premium straight-leg fit and copper rivets.",
        prod3Name: "Corduroy Worker Shirt",
        prod3Desc: "Ultra-durable, premium wale corduroy button-up with chest utility flap pockets.",
        prod4Name: "Military Cargo Pants",
        prod4Desc: "Eight-pocket utility military cargo trousers with adjustable drawstring waist and cuffs.",
        prod5Name: "90s Retro Sport Tee",
        prod5Desc: "Authentic single-stitch sportswear athletic t-shirt with classic swoosh embroidery.",
        prod6Name: "Heavyweight Denim Jacket",
        prod6Desc: "Classic 80s blanket-lined indigo denim jacket with brass buttons and dual chest pockets.",
        prod7Name: "Vintage Knit Cardigan",
        prod7Desc: "70s style cable-knit button cardigan crafted from organic wool for maximum cozy comfort.",
        prod8Name: "Synchilla Fleece Sweater",
        prod8Desc: "90s classic snap-T pullover fleece jacket featuring contrast color blocking.",
        prod9Name: "Nirvana Tour Tee",
        prod9Desc: "Extremely rare 1993 tour graphic tee with classic smiley face distressed print.",
        prod10Name: "Washed Slim Fit Jeans",
        prod10Desc: "Classic straight fit denim jeans with a natural distressed wash finish.",
        prod11Name: "Polo Knit Pullover",
        prod11Desc: "Premium cable-knit cotton pullover sweater featuring signature brand embroidery.",
        prod12Name: "Retro Sport Windbreaker",
        prod12Desc: "90s color-blocked lightweight nylon packable windbreaker jacket with zip pockets.",
        matCotton: "100% Organic Cotton",
        matDenim: "Heavyweight Indigo Denim",
        matCorduroy: "Premium Wale Corduroy",
        matWool: "100% Virgin Wool Knit",
        matFleece: "Recycled Synchilla Fleece",
        matNylon: "Ripstop Sport Nylon",
        condExcellent: "Grade A - Excellent (Pristine condition)",
        condVeryGood: "Grade B - Very Good (Light wear, no flaws)",
        condGood: "Grade C - Good (Vintage patina, minor fading)",
        catalogTitle: "Vintage Catalog",
        filterBrand: "Brands",
        filterSize: "Sizes",
        filterPrice: "Price Range",
        sortBy: "Sort By",
        ecoSavingsTitle: "Eco Savings",
        conditionTitle: "Condition",
        prodDetailsTitle: "Product Details",
        measurementsTitle: "Measurements",
        returnWarningTitle: "1-of-1 Return Policy",
        returnWarningDesc: "Please note that all sales are final as these are unique 1-of-1 vintage garments. Compare measurements carefully.",
        relatedProductsTitle: "You May Also Like",

        // Redesign sections
        brandStripTitle: "Curated from top vintage & street brands",
        howItWorksTitle: "How next.in Works",
        howItWorksSubtitle: "Three simple steps to high-quality, verified sustainable fashion.",
        howStep1Title: "1. Hand-Curated Pieces",
        howStep1Desc: "Our sellers find unique, high-quality, and authentic pre-loved apparel.",
        howStep2Title: "2. Rigorously Verified",
        howStep2Desc: "Every piece undergoes a multi-point physical check for defects, sizing accuracy, and authenticity.",
        howStep3Title: "3. Fast & Eco-Friendly Drop",
        howStep3Desc: "Purchased items are packed in 100% biodegradable packaging and shipped to you immediately.",
        testimonialsTitle: "What Our Community Says",
        testimonialsSubtitle: "Loved by thousands of thrift enthusiasts and style creators across India.",
        review1Text: "Absolute best place to buy authentic vintage. Found an 80s leather jacket in pristine condition!",
        review1Author: "Arjun Mehta",
        review1Role: "Vintage Enthusiast",
        review2Text: "Finally, a thrift app that checks quality. Every item has been exactly as described.",
        review2Author: "Priya Sharma",
        review2Role: "Sustainable Stylist",
        review3Text: "Super fast shipping, neat packaging, and amazing curation. Drop Fridays are my new ritual!",
        review3Author: "Rohan Nair",
        review3Role: "Streetwear Collector",
        faqTitle: "Frequently Asked Questions",
        faqSubtitle: "Got questions? We've got answers. Learn more about drops, shipping, and authenticity.",
        faqQ1: "When do the new drops happen?",
        faqA1: "Curated collections drop every Friday at 7:00 PM. Subscribe to our newsletter to get access 10 minutes early!",
        faqQ2: "Are all items authentic and quality-checked?",
        faqA2: "Yes! Every single item listed on next.in undergoes a strict inspection. We guarantee authenticity, accurate measurements, and grade quality details.",
        faqQ3: "How does shipping and returns work?",
        faqA3: "We ship within 24 hours of purchase using eco-friendly materials. Because items are 1-of-1, all sales are final, but we provide highly detailed measurements.",
        faqQ4: "Can I sell my own clothes here?",
        faqA4: "Absolutely. Click on 'Start Selling' in the menu, complete your seller profile, and upload photos of your curated pre-loved clothes to reach thousands of buyers.",
        cartTitle: "Your Cart",
        cartEmpty: "Your cart is empty",
        cartEmptySub: "Browse our collections and add unique vintage pieces to your cart.",
        cartReservedWarning: "These unique items are in your cart.",
        cartExpiryLabel: "Cart expires in",
        cartExpiryConfig: "Cart Timeout (Configurable)",
        checkoutBtn: "Proceed to Checkout",
        cartSubtotal: "Subtotal",
        cartShipping: "Shipping",
        cartTotal: "Total",
        cartItemRemoved: "Item removed from cart",
        checkoutSuccess: "Order placed successfully! Thank you for shopping with next.in.",
        cartAbandonedAlert: "Your cart has expired due to inactivity and the 1-of-1 items were returned to the shop.",
    },
    hi: {
        logoText: "नेक्स्ट.इन",
        navHome: "होम",
        navAbout: "हमारे बारे में",
        searchPlaceholder: "विंटेज, ब्रांड्स, स्टाइल खोजें…",
        cartTooltip: "शॉपिंग कार्ट",
        profileTooltip: "यूज़र मेनू",
        mobileHelloGuest: "नमस्ते, अतिथि!",
        mobileHelloUser: "नमस्ते, {name}!",
        mobileSignInOut: "साइन आउट",
        mobileDemoUser: "साइन इन (डेमो)",
        mobileSignup: "साइन अप",
        mobileProfile: "मेरी प्रोफाइल",
        mobileOrders: "मेरे ऑर्डर्स",
        mobileListings: "मेरी लिस्टिंग्स",
        mobileStartSelling: "बेचना शुरू करें",
        browseCategories: "श्रेणियां खोजें",
        trendingNow: "ट्रेंडिंग अब",

        heroBadge: "100% चुने हुए पर्यावरण-अनुकूल कपड़े",
        heroTitleFirst: "खोजें अनोखे",
        heroTitleAccent: "विंटेज",
        heroTitleEnd: "और थ्रिफ्ट कपड़े।",
        heroDescription: "नेक्स्ट.इन (next.in) एक हाथ से चुना हुआ ऑनलाइन थ्रिफ्ट स्टोर है। पुराने विंटेज पीस और टिकाऊ रोजाना पहनने वाले कपड़े खोजें—सभी हाथों से जांचे गए हैं।",
        heroBtnShop: "कपड़े देखें",
        heroBtnSell: "बेचना शुरू करें",
        statDrops: "अनोखे कपड़े",
        statSellers: "भरोसेमंद विक्रेता",
        statRating: "यूज़र रेटिंग",

        valueTitle: "थ्रिफ्टिंग हुई आसान।",
        valueSubtitle: "हम हर कपड़े को हाथ से जांचते हैं ताकि आप बिना किसी चिंता के पुराने विंटेज और स्ट्रीटवियर कपड़े खरीद सकें।",
        valueProp1Title: "क्वालिटी की पूरी गारंटी",
        valueProp1Desc: "हर कपड़ा हाथ से जांचा जाता है। कोई छिपे हुए दाग, छेद या नकली कपड़े नहीं।",
        valueProp2Title: "पर्यावरण के अनुकूल",
        valueProp2Desc: "पुराने कपड़े दोबारा इस्तेमाल करने से कचरा कम होता है और पर्यावरण प्रदूषण 80% तक बचता है।",
        valueProp3Title: "अनोखे वन-ऑफ-वन पीस",
        valueProp3Desc: "ऐसे कपड़े पहनें जो सिर्फ आपके पास हों। दुर्लभ विंटेज और ब्रांडेड कपड़े पाएं जो आम दुकानों में नहीं मिलते।",

        catTitle: "क्यूरेटेड कैटलॉग खरीदें",
        catSubtitle: "शैली के अनुसार वर्गीकृत आइटम खोजें",
        catViewAll: "पूरा कैटलॉग देखें",
        catTeesTitle: "रेट्रो टी-शर्ट",
        catTeesDesc: "90 के दशक के ग्राफिक्स और बैंड मर्च →",
        catDenimTitle: "डेनिम और जींस",
        catDenimDesc: "क्लासिक कट्स और भारी डेनिम →",
        catKnitsTitle: "बुनाई और स्वेटर",
        catKnitsDesc: "आरामदायक कार्डिगन और पुलओवर →",
        catCargoTitle: "कार्गो और आउटरवियर",
        catCargoDesc: "उपयोगिता पैंट और फील्ड जैकेट →",

        newsTitle: "कोई भी ड्रॉप कभी न चूकें।",
        newsDesc: "क्यूरेटेड संग्रह हर शुक्रवार शाम 7:00 बजे आते हैं। 10 मिनट पहले कैटलॉग एक्सेस सुरक्षित करने के लिए ईमेल सूचनाएं सब्सक्राइब करें।",
        newsPlaceholder: "अपना ईमेल पता दर्ज करें...",
        newsBtn: "सूचित करें",

        footerTagline: "पुराने कपड़े, पर्यावरण के लिए बेहतर भविष्य।",
        footerShopCol: "खरीदारी",
        footerShopLink1: "रेट्रो टी-शर्ट",
        footerShopLink2: "डेनिम और जींस",
        footerShopLink3: "बुनाई और स्वेटर",
        footerShopLink4: "कार्गो और आउटरवियर",
        footerCompanyCol: "कंपनी",
        footerCompanyLink1: "हमारे बारे में",
        footerCompanyLink2: "यह कैसे काम करता है",
        footerCompanyLink3: "हमारे साथ बेचें",
        footerSupportCol: "सहायता",
        footerSupportLink1: "अक्सर पूछे जाने वाले प्रश्न",
        footerSupportLink2: "शिपिंग और रिटर्न",
        footerSupportLink3: "संपर्क करें",
        footerLegal: "© 2025 next.in. सर्वाधिकार सुरक्षित।",

        cardBadge: "अनोखा विंटेज",
        cardSize: "आकार",
        cardPrice: "कीमत",
        cardBtnClaim: "कार्ट में जोड़ें",
        cardAlertAdded: "कार्ट में जोड़ा गया!",

        prod1Name: "विंटेज ग्राफिक टी",
        prod1Desc: "एक घिसे-पिटे सामने ग्राफिक प्रिंट के साथ क्यूरेटेड 1994 प्रामाणिक भारी वजन कॉटन टी।",
        prod2Name: "क्लासिक डेनिम 501 जींस",
        prod2Desc: "प्रीमियम स्ट्रेट-लेग फिट और तांबे के रिवेट्स के साथ लेवी की 501एस विंटेज वॉश मिलना मुश्किल।",
        prod3Name: "कॉरडरॉय वर्कर शर्ट",
        prod3Desc: "चेस्ट यूटिलिटी फ्लैप पॉकेट के साथ बेहद टिकाऊ, प्रीमियम वेल कॉरडरॉय बटन-अप।",
        prod4Name: "मिलिट्री कार्गो पैंट",
        prod4Desc: "समायोज्य ड्रॉस्ट्रिंग कमर और कफ के साथ आठ-पॉकेट उपयोगिता सैन्य कार्गो पतलून।",
        prod5Name: "90 के दशक की रेट्रो स्पोर्ट्स टी",
        prod5Desc: "क्लासिक कढ़ाई वाले क्लासिक स्वोश के साथ प्रामाणिक सिंगल-सिलाई स्पोर्ट्सवियर टी-शर्ट।",
        prod6Name: "हैवीवेट डेनिम जैकेट",
        prod6Desc: "पीतल के बटनों और दो चेस्ट पॉकेट्स के साथ क्लासिक 80 के दशक की इंडिगो डेनिम जैकेट।",
        prod7Name: "विंटेज निट कार्डिगन",
        prod7Desc: "70 के दशक की शैली का केबल-निट बटन कार्डिगन, आरामदायक गर्माहट के लिए जैविक ऊन से निर्मित।",
        prod8Name: "सिंचिला फ्लीस स्वेटर",
        prod8Desc: "विपरीत रंग के ब्लॉकिंग के साथ 90 के दशक का क्लासिक स्नैप-टी पुलओवर फ्लीस जैकेट।",
        prod9Name: "निर्वाण टूर टी",
        prod9Desc: "बेहद दुर्लभ 1993 टूर ग्राफिक टी, क्लासिक स्माइली फेस के घिसे-पिटे प्रिंट के साथ।",
        prod10Name: "वॉश स्लिम फिट जींस",
        prod10Desc: "नेचुरल डिस्ट्रेस्ड वॉश फिनिश के साथ क्लासिक स्ट्रेट फिट डेनिम जींस।",
        prod11Name: "पोलो निट पुलओवर",
        prod11Desc: "सिग्नेचर ब्रांड कढ़ाई की विशेषता वाला प्रीमियम केबल-निट कॉटन पुलओवर स्वेटर।",
        prod12Name: "रेट्रो स्पोर्ट्स विंडब्रेकर",
        prod12Desc: "ज़िप पॉकेट्स के साथ 90 के दशक का रंग-अवरुद्ध हल्का नायलॉन पैक करने योग्य विंडब्रेकर।",
        matCotton: "100% जैविक कपास",
        matDenim: "भारी वजन इंडिगो डेनिम",
        matCorduroy: "प्रीमियम वेल कॉरडरॉय",
        matWool: "100% वर्जिन ऊन बुनाई",
        matFleece: "पुनर्नवीनीकरण सिंचिला फ्लीस",
        matNylon: "रिपस्टॉप स्पोर्ट्स नायलॉन",
        condExcellent: "ग्रेड ए - उत्कृष्ट (नई जैसी स्थिति)",
        condVeryGood: "ग्रेड बी - बहुत अच्छा (हल्का पहनावा, कोई दोष नहीं)",
        condGood: "ग्रेड सी - अच्छा (विंटेज पुराना रंग, हल्का फीका)",
        catalogTitle: "विंटेज कैटलॉग",
        filterBrand: "ब्रांड्स",
        filterSize: "आकार",
        filterPrice: "मूल्य सीमा",
        sortBy: "क्रमबद्ध करें",
        ecoSavingsTitle: "पारिस्थितिकी बचत",
        conditionTitle: "स्थिति",
        prodDetailsTitle: "उत्पाद विवरण",
        measurementsTitle: "माप विवरण",
        returnWarningTitle: "अनोखे कपड़ों के लिए रिटर्न नीति",
        returnWarningDesc: "कृपया ध्यान दें कि चूंकि ये अनोखे विंटेज कपड़े हैं, इसलिए वापसी संभव नहीं है। कृपया मापों की सावधानीपूर्वक तुलना करें।",
        relatedProductsTitle: "आपको यह भी पसंद आ सकता है",

        // Redesign sections
        brandStripTitle: "शीर्ष विंटेज और स्ट्रीट ब्रांडों से चुनिंदा संग्रह",
        howItWorksTitle: "नेक्स्ट.इन कैसे काम करता है",
        howItWorksSubtitle: "उच्च गुणवत्ता, प्रमाणित और टिकाऊ फैशन के लिए तीन आसान चरण।",
        howStep1Title: "1. चुनिंदा कपड़े",
        howStep1Desc: "हमारे विक्रेता आपके लिए अनोखे, उच्च-गुणवत्ता और असली पुराने कपड़े खोजते हैं।",
        howStep2Title: "2. सख्त जांच प्रक्रिया",
        howStep2Desc: "प्रत्येक कपड़े की कमियों, सही माप और प्रामाणिकता के लिए भौतिक रूप से जांच की जाती है।",
        howStep3Title: "3. तेज और इको-फ्रेंडली डिलीवरी",
        howStep3Desc: "खरीदे गए सामान 100% बायोडिग्रेडेबल पैकेजों में पैक करके सीधे आपके पते पर भेजे जाते हैं।",
        testimonialsTitle: "हमारे समुदाय की राय",
        testimonialsSubtitle: "भारत भर के हजारों थ्रिफ्ट प्रेमियों और स्टाइल क्रिएटर्स द्वारा पसंदीदा।",
        review1Text: "असली विंटेज खरीदने के लिए सबसे बेहतरीन जगह। मुझे 80 के दशक की चमड़े की जैकेट बिल्कुल नई स्थिति में मिली!",
        review1Author: "अर्जुन मेहता",
        review1Role: "विंटेज प्रेमी",
        review2Text: "आखिरकार, एक थ्रिफ्ट ऐप जो गुणवत्ता की जांच करता है। हर एक सामान वैसा ही निकला जैसा बताया गया था।",
        review2Author: "प्रिया शर्मा",
        review2Role: "सस्टेनेबल स्टाइलिस्ट",
        review3Text: "सुपर फास्ट शिपिंग, बढ़िया पैकिंग और लाजवाब कलेक्शन। हर शुक्रवार के ड्रॉप्स का मुझे बेसब्री से इंतज़ार रहता है!",
        review3Author: "रोहन नायर",
        review3Role: "स्ट्रीटवियर कलेक्टर",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        faqSubtitle: "कोई सवाल है? हमारे पास जवाब हैं। ड्रॉप्स, शिपिंग और प्रामाणिकता के बारे में अधिक जानें।",
        faqQ1: "नए कलेक्शन कब ड्रॉप होते हैं?",
        faqA1: "क्यूरेटेड कलेक्शन्स हर शुक्रवार शाम 7:00 बजे आते हैं। 10 मिनट पहले एक्सेस पाने के लिए हमारे न्यूज़लेटर को सब्सक्राइब करें!",
        faqQ2: "क्या सभी सामान असली और जांचे हुए होते हैं?",
        faqA2: "हाँ! नेक्स्ट.इन पर लिस्ट किए गए हर एक कपड़े की सख्त जांच की जाती है। हम प्रामाणिकता और सही माप की पूरी गारंटी देते हैं।",
        faqQ3: "शिपिंग और रिटर्न कैसे काम करता है?",
        faqA3: "हम इको-फ्रेंडली पैकेट का उपयोग करके खरीदारी के 24 घंटे के भीतर भेजते हैं। चूंकि सभी आइटम अद्वितीय (1-ऑफ-1) हैं, इसलिए रिटर्न उपलब्ध नहीं है, लेकिन हम सटीक माप प्रदान करते हैं।",
        faqQ4: "क्या मैं अपने कपड़े भी यहाँ बेच सकता हूँ?",
        faqA4: "बिल्कुल। मेनू में 'बेचना शुरू करें' पर क्लिक करें, अपना सेलर प्रोफाइल पूरा करें और खरीदारों तक पहुँचने के लिए तस्वीरें अपलोड करें।",
        cartTitle: "आपका कार्ट",
        cartEmpty: "आपका कार्ट खाली है",
        cartEmptySub: "हमारे संग्रह देखें और अनोखे विंटेज कपड़े कार्ट में जोड़ें।",
        cartReservedWarning: "ये अनोखे कपड़े आपके कार्ट में हैं।",
        cartExpiryLabel: "कार्ट समाप्त होगा",
        cartExpiryConfig: "कार्ट का समय (कॉन्फ़िगर करने योग्य)",
        checkoutBtn: "चेकआउट करें",
        cartSubtotal: "उप-योग",
        cartShipping: "शिपिंग",
        cartTotal: "कुल",
        cartItemRemoved: "कार्ट से सामान हटा दिया गया",
        checkoutSuccess: "ऑर्डर सफलतापूर्वक सबमिट हो गया! next.in पर खरीदारी के लिए धन्यवाद।",
        cartAbandonedAlert: "अक्रियता के कारण आपका कार्ट समाप्त हो गया है और कपड़े वापस कैटलॉग में चले गए हैं।",
    },
    ml: {
        logoText: "next.in",
        navHome: "ഹോം",
        navAbout: "ഞങ്ങളെക്കുറിച്ച്",
        searchPlaceholder: "വിന്റേജ്, ബ്രാൻഡുകൾ, സ്റ്റൈലുകൾ തിരയുക...",
        cartTooltip: "ഷോപ്പിംഗ് കാർട്ട്",
        profileTooltip: "ഉപയോക്തൃ മെനു",
        mobileHelloGuest: "ഹലോ, അതിഥി!",
        mobileHelloUser: "ഹലോ, {name}!",
        mobileSignInOut: "ലോഗ് ഔട്ട് ചെയ്യുക",
        mobileDemoUser: "ലോഗിൻ ചെയ്യുക (ഡെമോ)",
        mobileSignup: "സൈൻ അപ്പ് ചെയ്യുക",
        mobileProfile: "എന്റെ പ്രൊഫൈൽ",
        mobileOrders: "എന്റെ ഓർഡറുകൾ",
        mobileListings: "എന്റെ ലിസ്റ്റിംഗുകൾ",
        mobileStartSelling: "വിൽക്കാൻ തുടങ്ങുക",
        browseCategories: "വിഭാഗങ്ങൾ ബ്രൗസ് ചെയ്യുക",
        trendingNow: "ഇപ്പോൾ ട്രെൻഡിംഗ്",

        heroBadge: "100% തിരഞ്ഞെടുത്ത പ്രകൃതിസൗഹൃദ വസ്ത്രങ്ങൾ",
        heroTitleFirst: "അപൂർവ്വമായ",
        heroTitleAccent: "വിന്റേജ്",
        heroTitleEnd: "& ത്രീഫ്റ്റ് വസ്ത്രങ്ങൾ കണ്ടെത്തൂ.",
        heroDescription: "next.in നിങ്ങളുടെ കൈകൊണ്ട് തിരഞ്ഞെടുത്ത ഓൺലൈൻ ത്രീഫ്റ്റ് സ്റ്റോറാണ്. വിന്റേജ് വസ്ത്രങ്ങളും പ്രകൃതിസൗഹൃദ വസ്ത്രങ്ങളും കണ്ടെത്തൂ - എല്ലാം നേരിട്ട് ഗുണനിലവാരം പരിശോധിച്ചവയാണ്.",
        heroBtnShop: "ശേഖരം കാണുക",
        heroBtnSell: "വിൽക്കാൻ തുടങ്ങുക",
        statDrops: "അപൂർവ്വ ശേഖരങ്ങൾ",
        statSellers: "വിശ്വസ്ത വിൽപനക്കാർ",
        statRating: "യൂസർ റേറ്റിംഗ്",

        valueTitle: "ത്രീഫ്റ്റിംഗ് ഇനി വളരെ എളുപ്പം.",
        valueSubtitle: "ഞങ്ങൾ ഓരോ വസ്ത്രവും നേരിട്ട് ഗുണനിലവാരം പരിശോധിക്കുന്നു, അതിനാൽ വിന്റേജ് വസ്ത്രങ്ങൾ പൂർണ്ണ വിശ്വാസത്തോടെ വാങ്ങാം.",
        valueProp1Title: "നേരിട്ട് പരിശോധിച്ച ഗുണനിലവാരം",
        valueProp1Desc: "ഓരോ വസ്ത്രവും നേരിട്ട് പരിശോധിച്ച് ഉറപ്പു വരുത്തിയവയാണ്. കറകളോ കീറലുകളോ വ്യാജ ഉൽപ്പന്നങ്ങളോ ഇല്ല എന്ന് ഞങ്ങൾ ഉറപ്പാക്കുന്നു.",
        valueProp2Title: "പരിസ്ഥിതി സൗഹൃദം",
        valueProp2Desc: "ത്രീഫ്റ്റ് വസ്ത്രങ്ങൾ വീണ്ടും ഉപയോഗിക്കുന്നത് വഴി വസ്ത്രങ്ങൾ പാഴായിപ്പോകുന്നത് തടയാനും പരിസ്ഥിതി മലിനീകരണം കുറയ്ക്കാനും സാധിക്കുന്നു.",
        valueProp3Title: "അപൂർവ്വമായ കളക്ഷനുകൾ",
        valueProp3Desc: "നിങ്ങൾക്ക് മാത്രം സ്വന്തമായ വസ്ത്രങ്ങളിലൂടെ വ്യത്യസ്തരാകൂ. മറ്റെങ്ങും ലഭിക്കാത്ത അപൂർവ്വമായ വിന്റേജ് വസ്ത്രങ്ങൾ ഞങ്ങളിൽ ലഭ്യമാണ്.",

        catTitle: "ക്യൂറേറ്റ് ചെയ്ത കാറ്റലോഗ്",
        catSubtitle: "നിങ്ങളുടെ സ്റ്റൈലിനനുസരിച്ച് തിരഞ്ഞെടുക്കൂ",
        catViewAll: "എല്ലാ കാറ്റലോഗും കാണുക",
        catTeesTitle: "റെട്രോ ടീഷർട്ടുകൾ",
        catTeesDesc: "90കളിലെ ഗ്രാഫിക്സ് & ബാൻഡ് മെർച്ചന്റൈസ് →",
        catDenimTitle: "ഡെനിമും ജീൻസും",
        catDenimDesc: "ക്ലാസിക് ഫിറ്റും കട്ടിയുള്ള ജീൻസും →",
        catKnitsTitle: "നിറ്റ്സ് & സ്വെറ്ററുകൾ",
        catKnitsDesc: "കംഫർട്ടബിൾ കാർഡിഗൻസ് & പുല്ലോവറുകൾ →",
        catCargoTitle: "കാർഗോ & ഔട്ടർവെയർ",
        catCargoDesc: "യൂട്ടിലിറ്റി പാൻ്റുകളും ജാക്കറ്റുകളും →",

        newsTitle: "ഒരു അപ്ഡേറ്റും നഷ്ടപ്പെടുത്തരുത്.",
        newsDesc: "ഓരോ വെള്ളിയാഴ്ചയും വൈകുന്നേരം 7:00 മണിക്ക് പുതിയ വസ്ത്രങ്ങൾ വരുന്നു. നേരത്തെ വിവരങ്ങൾ ലഭിക്കാൻ സബ്സ്ക്രൈബ് ചെയ്യുക.",
        newsPlaceholder: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക...",
        newsBtn: "എന്നെ അറിയിക്കൂ",

        footerTagline: "പഴയ വസ്ത്രങ്ങൾ, ഭൂമിക്ക് മെച്ചമായ ഭാവി.",
        footerShopCol: "ഷോപ്പ്",
        footerShopLink1: "റെട്രോ ടീഷർട്ടുകൾ",
        footerShopLink2: "ഡെനിമും ജീൻസും",
        footerShopLink3: "നിറ്റ്സ് & സ്വെറ്ററുകൾ",
        footerShopLink4: "കാർഗോ & ഔട്ടർവെയർ",
        footerCompanyCol: "കമ്പനി",
        footerCompanyLink1: "ഞങ്ങളെക്കുറിച്ച്",
        footerCompanyLink2: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
        footerCompanyLink3: "ഞങ്ങളോടൊപ്പം വിൽക്കുക",
        footerSupportCol: "സഹായം",
        footerSupportLink1: "പതിവ് ചോദ്യങ്ങൾ",
        footerSupportLink2: "ഷിപ്പിംഗ് & റിട്ടേൺ",
        footerSupportLink3: "ഞങ്ങളെ ബന്ധപ്പെടുക",
        footerLegal: "© 2025 next.in. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",

        cardBadge: "അപൂർവ്വമായ വിന്റേജ്",
        cardSize: "അളവ്",
        cardPrice: "വില",
        cardBtnClaim: "കാർട്ടിലേക്ക് ചേർക്കുക",
        cardAlertAdded: "കാർട്ടിലേക്ക് ചേർത്തു!",

        prod1Name: "വിന്റേജ് ഗ്രാഫിക് ടീഷർട്ട്",
        prod1Desc: "1994-ലെ ഹെവിവെയ്റ്റ് കോട്ടൺ ടീഷർട്ട്, മുന്നിൽ മനോഹരമായ ഗ്രാഫിക് പ്രിന്റോടുകൂടി ക്യൂറേറ്റ് ചെയ്തത്.",
        prod2Name: "ക്ലാസിക് ഡെനിം 501 ജീൻസ്",
        prod2Desc: "ലിവൈസിന്റെ അപൂർവ്വമായ വിന്റേജ് വാഷ് 501 ജീൻസ്, മികച്ച സ്ട്രെയിറ്റ്-ലെഗ് ഫിറ്റോടുകൂടി.",
        prod3Name: "കോർഡുറോയ് വർക്കർ ഷർട്ട്",
        prod3Desc: "വളരെ ഈടുനിൽക്കുന്ന പ്രീമിയം കോർഡുറോയ് ബട്ടൺ-അപ്പ് ഷർട്ട്, പോക്കറ്റുകളോടുകൂടി.",
        prod4Name: "മിലിട്ടറി കാർഗോ പാൻ്റ്സ്",
        prod4Desc: "ക്രമീകരിക്കാവുന്ന അരക്കെട്ടോടുകൂടിയ എട്ട് പോക്കറ്റുള്ള യൂട്ടിലിറ്റി കാർഗോ പാൻ്റ്സ്.",
        prod5Name: "90കളിലെ റെട്രോ സ്പോർട്സ് ടീഷർട്ട്",
        prod5Desc: "യഥാർത്ഥ സിംഗിൾ-സ്റ്റിച്ച് അത്ലറ്റിക് ടീഷർട്ട്, ക്ലാസിക് എംബ്രോയ്ഡറിയോടുകൂടി.",
        prod6Name: "ഹെവിവെയ്റ്റ് ഡെനിം ജാക്കറ്റ്",
        prod6Desc: "ക്ലാസിക് 80കളിലെ ഇൻഡിഗോ ഡെനിം ജാക്കറ്റ്, പോക്കറ്റുകളോടും ബട്ടണുകളോടും കൂടി.",
        prod7Name: "വിന്റേജ് നിറ്റ് കാർഡിഗൻ",
        prod7Desc: "70കളിലെ കേബിൾ-നിറ്റ് ബട്ടൺ കാർഡിഗൻ, ഓർഗാനിക് കമ്പിളി നൂലിൽ നെയ്തത്.",
        prod8Name: "സിഞ്ചില്ല ഫ്ലീസ് സ്വെറ്റർ",
        prod8Desc: "90കളിലെ ക്ലാസിക് സ്നാപ്പ്-ടി പുല്ലോവർ ഫ്ലീസ് ജാക്കറ്റ്, വ്യത്യസ്ത നിറങ്ങളോടുകൂടി.",
        prod9Name: "നിർവാണ ടൂർ ടീഷർട്ട്",
        prod9Desc: "അപൂർവ്വമായ 1993 ടൂർ ഗ്രാഫിക് ടീഷർട്ട്, ക്ലാസിക് സ്മൈലി പ്രിന്റോടുകൂടി.",
        prod10Name: "വാഷ്ഡ് സ്ലിം ഫിറ്റ് ജീൻസ്",
        prod10Desc: "നാച്ചുറൽ ഡിസ്ട്രെസ്സ് വാഷോടുകൂടിയ ക്ലാസിക് സ്ട്രെയിറ്റ് ഫിറ്റ് ജീൻസ്.",
        prod11Name: "പോളോ നിറ്റ് പുല്ലോവർ",
        prod11Desc: "ബ്രാൻഡ് ലോഗോയോടുകൂടിയ പ്രീമിയം കേബിൾ-നിറ്റ് കോട്ടൺ സ്വെറ്റർ.",
        prod12Name: "റെട്രോ സ്പോർട്സ് വിൻഡ്ബ്രേക്കർ",
        prod12Desc: "90കളിലെ ലൈറ്റ്‌വെയ്റ്റ് നൈലോൺ വിൻഡ്ബ്രേക്കർ ജാക്കറ്റ്, സിപ്പ് പോക്കറ്റുകളോടുകൂടി.",
        matCotton: "100% ഓർഗാനിക് കോട്ടൺ",
        matDenim: "ഹെവിവെയ്റ്റ് ഇൻഡിഗോ ഡെനിം",
        matCorduroy: "പ്രീമിയം കോർഡുറോയ്",
        matWool: "യഥാർത്ഥ കമ്പിളി നൂൽ",
        matFleece: "റീസൈക്കിൾ ചെയ്ത ഫ്ലീസ്",
        matNylon: "റിപ്സ്റ്റോപ്പ് നൈലോൺ",
        condExcellent: "ഗ്രേഡ് എ - മികച്ചത് (പുതിയത് പോലെ)",
        condVeryGood: "ഗ്രേഡ് ബി - വളരെ നല്ലത് (നേരിയ ഉപയോഗം, കേടുപാടുകൾ ഇല്ല)",
        condGood: "ഗ്രേഡ് സി - നല്ലത് (പഴയ വിന്റേജ് ലുക്ക്, നേരിയ മങ്ങൽ)",
        catalogTitle: "വിന്റേജ് കാറ്റലോഗ്",
        filterBrand: "ബ്രാൻഡുകൾ",
        filterSize: "അളവുകൾ",
        filterPrice: "വില നിലവാരം",
        sortBy: "ക്രമീകരിക്കുക",
        ecoSavingsTitle: "പ്രകൃതി സംരക്ഷണം",
        conditionTitle: "അവസ്ഥ",
        prodDetailsTitle: "ഉൽപ്പന്ന വിവരങ്ങൾ",
        measurementsTitle: "അളവുകളുടെ വിവരങ്ങൾ",
        returnWarningTitle: "റിട്ടേൺ പോളിസി",
        returnWarningDesc: "അപൂർവ്വമായ വസ്ത്രങ്ങൾ ആയതിനാൽ റിട്ടേൺ സാധ്യമല്ല. വസ്ത്രത്തിന്റെ അളവുകൾ കൃത്യമായി പരിശോധിച്ച് ഉറപ്പുവരുത്തുക.",
        relatedProductsTitle: "നിങ്ങൾക്ക് ഇഷ്ടപ്പെടാൻ സാധ്യതയുള്ളവ",

        // Redesign sections
        brandStripTitle: "പ്രമുഖ വിന്റേജ് & സ്ട്രീറ്റ് ബ്രാൻഡുകളിൽ നിന്നുള്ള ശേഖരങ്ങൾ",
        howItWorksTitle: "next.in എങ്ങനെ പ്രവർത്തിക്കുന്നു",
        howItWorksSubtitle: "ഗുണനിലവാരമുള്ളതും പരിസ്ഥിതി സൗഹൃദവുമായ ഫാഷനിലേക്കുള്ള മൂന്ന് ലളിതമായ ഘട്ടങ്ങൾ.",
        howStep1Title: "1. തിരഞ്ഞെടുക്കപ്പെട്ട വസ്ത്രങ്ങൾ",
        howStep1Desc: "ഞങ്ങളുടെ വിൽപനക്കാർ അപൂർവ്വവും മികച്ചതുമായ യഥാർത്ഥ വിന്റേജ് വസ്ത്രങ്ങൾ കണ്ടെത്തുന്നു.",
        howStep2Title: "2. കർശനമായ പരിശോധന",
        howStep2Desc: "ഓരോ വസ്ത്രത്തിന്റെയും അളവുകൾ, കേടുപാടുകൾ, വിശ്വാസ്യത എന്നിവ നേരിട്ട് പരിശോധിച്ച് ഉറപ്പു വരുത്തുന്നു.",
        howStep3Title: "3. സുരക്ഷിതവും വേഗതയേറിയതുമായ ഡെലിവറി",
        howStep3Desc: "വാങ്ങുന്ന ഉൽപ്പന്നങ്ങൾ 100% പ്രകൃതിദത്ത പാക്കറ്റുകളിൽ പാക്ക് ചെയ്ത് ഉടൻ തന്നെ അയക്കുന്നു.",
        testimonialsTitle: "ഞങ്ങളുടെ കമ്മ്യൂണിറ്റി പറയുന്നത്",
        testimonialsSubtitle: "ഇന്ത്യയിലുടനീളമുള്ള ആയിരക്കണക്കിന് ത്രീഫ്റ്റ് പ്രേമികളും സ്റ്റൈലിസ്റ്റുകളും ഇഷ്‌ടപ്പെടുന്ന ഇടം.",
        review1Text: "യഥാർത്ഥ വിന്റേജ് വസ്ത്രങ്ങൾ വാങ്ങാനുള്ള ഏറ്റവും നല്ല സ്ഥലം. എനിക്ക് 80കളിലെ ലതർ ജാക്കറ്റ് മികച്ച അവസ്ഥയിൽ ലഭിച്ചു!",
        review1Author: "അർജുൻ മേത്ത",
        review1Role: "വിന്റേജ് പ്രേമി",
        review2Text: "ഒടുവിൽ, ഗുണനിലവാരം നേരിട്ട് പരിശോധിക്കുന്ന ഒരു ത്രീഫ്റ്റ് ആപ്പ്. എല്ലാ ഉൽപ്പന്നങ്ങളും വിവരിച്ചതുപോലെ തന്നെയായിരുന്നു.",
        review2Author: "പ്രിയ ശർമ്മ",
        review2Role: "സസ്റ്റൈനബിൾ സ്റ്റൈലിസ്റ്റ്",
        review3Text: "വളരെ വേഗതയേറിയ ഷിപ്പിംഗ്, മികച്ച പാക്കിംഗ്. ഓരോ വെള്ളിയാഴ്ചയുമുള്ള ഡ്രോപ്പുകൾക്കായി ഞാൻ കാത്തിരിക്കുന്നു!",
        review3Author: "രോഹൻ നായർ",
        review3Role: "സ്ട്രീറ്റ്‌വെയർ കളക്ടർ",
        faqTitle: "പതിവ് ചോദ്യങ്ങൾ",
        faqSubtitle: "ചോദ്യങ്ങളുണ്ടോ? ഞങ്ങൾക്കുണ്ട് മറുപടികൾ. ഡ്രോപ്പുകൾ, ഷിപ്പിംഗ്, വിശ്വാസ്യത എന്നിവയെക്കുറിച്ച് ഇവിടെ വായിക്കാം.",
        faqQ1: "പുതിയ കളക്ഷനുകൾ എപ്പോഴാണ് വരുന്നത്?",
        faqA1: "എല്ലാ വെള്ളിയാഴ്ചയും വൈകുന്നേരം 7:00 മണിക്കാണ് പുതിയ കളക്ഷനുകൾ വരുന്നത്. 10 മിനിറ്റ് മുൻപ് ആക്സസ് ലഭിക്കാൻ സബ്സ്ക്രൈബ് ചെയ്യുക!",
        faqQ2: "വസ്ത്രങ്ങൾ യഥാർത്ഥവും പരിശോധിച്ചതുമാണോ?",
        faqA2: "അതെ! next.in-ൽ കാണിക്കുന്ന എല്ലാ വസ്ത്രങ്ങളും കർശനമായി പരിശോധിക്കുന്നു. കൃത്യമായ അളവുകളും മികച്ച ഗുണനിലവാരവും ഞങ്ങൾ ഉറപ്പു നൽകുന്നു.",
        faqQ3: "ഷിപ്പിംഗും റിട്ടേണും എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത്?",
        faqA3: "പരിസ്ഥിതി സൗഹൃദ പാക്കറ്റുകൾ ഉപയോഗിച്ച് 24 മണിക്കൂറിനുള്ളിൽ ഞങ്ങൾ അയക്കുന്നു. 1-ഓഫ്-1 വസ്ത്രങ്ങൾ ആയതിനാൽ റിട്ടേൺ സാധ്യമല്ല, എന്നാൽ അളവുകൾ വ്യക്തമായി നൽകിയിട്ടുണ്ട്.",
        faqQ4: "എനിക്ക് സ്വന്തം വസ്ത്രങ്ങൾ ഇവിടെ വിൽക്കാമോ?",
        faqA4: "തീർച്ചയായും. മെനുവിലെ 'വിൽക്കാൻ തുടങ്ങുക' ക്ലിക്ക് ചെയ്ത്, നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കിയ ശേഷം ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യാം.",
        cartTitle: "നിങ്ങളുടെ കാർട്ട്",
        cartEmpty: "നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്",
        cartEmptySub: "ഞങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ കണ്ട് മികച്ചവ കാർട്ടിലേക്ക് ചേർക്കൂ.",
        cartReservedWarning: "ഈ അപൂർവ്വ വസ്ത്രങ്ങൾ നിങ്ങളുടെ കാർട്ടിലുണ്ട്.",
        cartExpiryLabel: "കാർട്ട് കാലഹരണപ്പെടാൻ",
        cartExpiryConfig: "കാർട്ട് കാലാവധി (ക്രമീകരിക്കാവുന്നത്)",
        checkoutBtn: "ചെക്ക് ഔട്ട് ചെയ്യുക",
        cartSubtotal: "ആകെ തുക",
        cartShipping: "ഷിപ്പിംഗ്",
        cartTotal: "ആകെ",
        cartItemRemoved: "വസ്തു കാർട്ടിൽ നിന്ന് നീക്കംചെയ്തു",
        checkoutSuccess: "ഓർഡർ വിജയകരമായി പൂർത്തിയായി! next.in-ൽ ഷോപ്പ് ചെയ്തതിന് നന്ദി.",
        cartAbandonedAlert: "കാർട്ട് കാലാവധി കഴിഞ്ഞതിനാൽ വസ്ത്രങ്ങൾ വീണ്ടും സ്റ്റോറിലേക്ക് തിരികെപ്പോയി.",
    },
};

/**
 * Formats a numeric price into Indian Rupees (INR) currency format dynamically.
 * Example: 2900 -> ₹2,900
 */
export function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}
