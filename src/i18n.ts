export const translations = {
    es: {
        nav_home: 'Inicio',
        nav_new: 'Novedades',
        nav_offers: 'Ofertas',
        hero_title: 'Catálogo',
        hero_title_highlight: 'Exclusivo',
        hero_subtitle: 'Descubre nuestra selección curada de fragancias de lujo. Calidad premium con entrega rápida en toda la República Dominicana.',
        cat_men: 'Hombres',
        cat_women: 'Mujeres',
        cat_unisex: 'Unisex',
        buy_whatsapp: 'Comprar vía WhatsApp',
        see_more: 'Ver más productos',
        footer_desc: 'Los mejores perfumes originales en Santo Domingo, Santiago y todo el país. Calidad garantizada en cada atomización.',
        footer_rights: 'Todos los derechos reservados',
        floating_catalog: 'Catálogo',
        hello_whatsapp: 'Hola, me interesa el perfume'
    },
    en: {
        nav_home: 'Home',
        nav_new: 'New Arrivals',
        nav_offers: 'Offers',
        hero_title: 'Exclusive',
        hero_title_highlight: 'Catalog',
        hero_subtitle: 'Discover our curated selection of luxury fragrances. Premium quality with fast delivery throughout the Dominican Republic.',
        cat_men: 'Men',
        cat_women: 'Women',
        cat_unisex: 'Unisex',
        buy_whatsapp: 'Buy via WhatsApp',
        see_more: 'See more products',
        footer_desc: 'The best original perfumes in Santo Domingo, Santiago and nationwide. Guaranteed quality in every spray.',
        footer_rights: 'All rights reserved',
        floating_catalog: 'Catalog',
        hello_whatsapp: 'Hi, I am interested in the perfume'
    }
};

export type Language = 'en' | 'es';

export function getBrowserLanguage(): Language {
    if (typeof navigator === 'undefined') return 'es';
    const lang = navigator.language || (navigator as any).userLanguage;
    if (lang && lang.toLowerCase().startsWith('en')) {
        return 'en';
    }
    return 'es'; // Default to Spanish for this store
}

export function t(lang: Language, key: keyof typeof translations['es']): string {
    return translations[lang][key] || translations['es'][key] || key;
}
