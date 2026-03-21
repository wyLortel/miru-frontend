'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { CheckIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { authApi, type User } from '@/shared/api/auth';
import { useModalStore } from '@/app/store/useModalStore';
import { PRIVACY_TEXT, SERVICE_TEXT } from '@/shared/lib/termsContent';

function Checkbox({ checked, onCheck }: { checked: boolean; onCheck: () => void }) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheck}
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px]',
      )}
    >
      <CheckboxPrimitive.Indicator className="grid place-content-center text-current transition-none">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface TermsSectionProps {
  title: string;
  content: string;
  checked: boolean;
  label: string;
  onCheck: () => void;
}

function TermsSection({ title, content, checked, label, onCheck }: TermsSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-[#191919]">{title}</p>
      <div className="h-40 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onCheck}
      >
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={checked} onCheck={onCheck} />
        </span>
        <span className="text-sm font-medium text-[#191919]">{label} (필수)</span>
      </div>
    </div>
  );
}

export function TermsFormContent() {
  const [checkedItems, setCheckedItems] = useState({ privacy: false, service: false });
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const qc = useQueryClient();

  const allChecked = checkedItems.privacy && checkedItems.service;

  const { mutate: agreeTerms, isPending } = useMutation({
    mutationFn: authApi.agreeTerms,
    onSuccess: () => {
      localStorage.removeItem('redirectAfterLogin');
      qc.setQueryData<User>(['auth', 'me'], (old) => old ? { ...old, status: 'ACTIVE' } : old);
      router.push('/analysis');
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) return;
      if (isAxiosError(err) && err.response?.status === 403) return;
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      openModal({
        title: '약관 동의 실패',
        description: message ?? '오류가 발생했습니다.',
        buttons: [{ label: '확인', onClick: closeModal }],
      });
    },
  });

  return (
    <section className="flex flex-col gap-6 w-full max-w-[500px] px-4 mx-auto my-16">
      <h1 className="text-2xl font-bold text-center">서비스 이용 동의</h1>
      <p className="text-sm text-muted-foreground text-center">
        서비스 이용을 위해 아래 약관을 확인하고 동의해주세요.
      </p>

      <TermsSection
        title="개인정보 처리방침"
        content={PRIVACY_TEXT}
        checked={checkedItems.privacy}
        label="개인정보 처리방침에 동의합니다"
        onCheck={() => setCheckedItems((prev) => ({ ...prev, privacy: !prev.privacy }))}
      />

      <TermsSection
        title="서비스 이용약관"
        content={SERVICE_TEXT}
        checked={checkedItems.service}
        label="서비스 이용약관에 동의합니다"
        onCheck={() => setCheckedItems((prev) => ({ ...prev, service: !prev.service }))}
      />

      <button
        onClick={() => agreeTerms()}
        disabled={!allChecked || isPending}
        className="w-full h-[52px] rounded-[12px] font-semibold text-white bg-main transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {isPending ? '처리 중...' : '동의하기'}
      </button>
    </section>
  );
}
