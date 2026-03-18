'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth } from '@/entities/auth/useAuth';
import { useHasUnreadQuery } from '@/entities/alarm/model/useHasUnreadQuery';
import { useAlarmStore } from '@/app/store/useAlarmStore';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useLoginRequired } from '@/shared/lib/hooks/useLoginRequired';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { AlarmPanel } from '../../../widgets/alarm-panel/ui/AlarmPanel';

export const AlarmBell = () => {
  const router = useRouter();
  const { data: user } = useAuth();
  const { data: unreadData } = useHasUnreadQuery();
  const { isOpen, togglePanel, closePanel } = useAlarmStore();
  const isMobile = useIsMobile();
  const { checkAuth } = useLoginRequired();

  const hasUnread = user ? (unreadData?.hasUnread ?? false) : false;

  const handleBellClick = () => {
    if (isMobile) {
      // Mobile: require login with modal
      checkAuth(() => {
        router.push('/alarms');
      });
      return;
    }

    // PC: just toggle panel (show login message if not logged in)
    togglePanel();
  };

  return (
    <Popover open={isOpen && !isMobile} onOpenChange={(open) => {
      if (!open) closePanel();
    }}>
      <PopoverTrigger asChild>
        <button
          onClick={handleBellClick}
          className="flex items-center justify-center p-1 relative cursor-pointer transition hover:text-blue-600"
          title="알람"
        >
          <Bell size={24} strokeWidth={2} />
          {hasUnread && (
            <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></div>
          )}
        </button>
      </PopoverTrigger>

      {/* PC only - conditional JSX rendering to avoid CSS conflicts */}
      {!isMobile && (
        <PopoverContent className="w-auto p-0 border-gray-200" align="end">
          {user ? <AlarmPanel /> : <p className="p-4 text-sm text-gray-500">로그인 후 알람을 확인할 수 있습니다</p>}
        </PopoverContent>
      )}
    </Popover>
  );
};
