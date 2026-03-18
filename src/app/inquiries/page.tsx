import { InquiryHero } from '@/features/inquiry/ui/InquiryHero';
import { InquiryListSection } from '@/widgets/inquiry';

export default function page() {
  return (
    <>
      <InquiryHero />
      <InquiryListSection />
    </>
  );
}
