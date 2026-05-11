import { LanguageDictionary } from '../language.types';
// TODO(@Janberk): Import tr-TR.json from a real json file and export securely here.
export const TR_DICTIONARY: LanguageDictionary = {
  'language.en': 'Ingilizce',
  'language.tr': 'Turkce',
  'auth.title': 'Giris',
  'auth.hint':
    'Herhangi bir e-posta/sifre kullanin. Ornek: hr@dotqit.dev / 123456',
  'auth.email': 'E-posta',
  'auth.password': 'Sifre',
  'auth.login': 'Giris',
  'auth.resendActivation': 'Aktivasyon kodunu yeniden gonder',
  'auth.loggingIn': 'Giris yapiliyor...',
  'auth.error.required': 'E-posta ve sifre zorunludur.',
  'outage.status.0': 'Tespit edildi',
  'outage.status.1': 'Onaylandi',
  'outage.status.2': 'Sevk edildi',
  'outage.status.3': 'Iyilestiriliyor',
  'outage.status.4': 'Iyilesti',
  'outage.status.5': 'Iptal edildi',
  'outage.status.unknown': 'Bilinmiyor',
};
