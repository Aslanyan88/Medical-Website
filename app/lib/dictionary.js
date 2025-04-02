import { en } from '@/app/[lang]/content/en';
import { hy } from '@/app/[lang]/content/hy';

export const getDictionary = (lang) => {
  switch (lang) {
    case 'en':
      return en;
    case 'hy':
      return hy;
    default:
      return en;
  }
};

export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  hy: { name: 'Հայերեն', flag: '🇦🇲' },
};