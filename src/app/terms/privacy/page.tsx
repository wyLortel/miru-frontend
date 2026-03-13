import { PRIVACY_TEXT } from '@/shared/lib/termsContent';

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">개인정보 처리방침</h1>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {PRIVACY_TEXT}
      </p>
    </main>
  );
}
