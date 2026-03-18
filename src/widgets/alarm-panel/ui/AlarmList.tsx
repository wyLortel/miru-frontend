'use client';

import { AlarmItem } from '@/entities/alarm/ui/AlarmItem';
import { AlarmItemSkeleton } from '@/entities/alarm/ui/AlarmItemSkeleton';
import { AlarmItem as AlarmItemType } from '@/entities/alarm/model/types';

interface AlarmListProps {
  items?: AlarmItemType[];
  isLoading: boolean;
  isEmpty: boolean;
  onDelete?: (itemId: number) => void;
}

export const AlarmList = ({ items, isLoading, isEmpty, onDelete }: AlarmListProps) => {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <AlarmItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-sm">읽지 않은 알람이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {items?.map((item) => (
        <AlarmItem key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};
