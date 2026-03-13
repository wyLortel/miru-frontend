import { SERVICE_TEXT } from '@/shared/lib/termsContent';

export default function ServiceTermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">서비스 이용약관</h1>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {SERVICE_TEXT}
      </p>
    </main>
  );
}
