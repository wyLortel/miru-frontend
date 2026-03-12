'use client';

import Link from 'next/link';
import { AlarmItem as AlarmItemType } from '../model/types';

interface AlarmItemProps {
  item: AlarmItemType;
  onDelete?: (itemId: number) => void;
}

export const AlarmItem = ({ item, onDelete }: AlarmItemProps) => {
  return (
    <div
      className={`border-b border-gray-200 p-4 hover:bg-gray-50 transition ${
        !item.isRead ? 'bg-blue-50' : ''
      } flex gap-3 items-start group`}
    >
      <Link href={item.targetUrl} className="flex-1 cursor-pointer">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm text-gray-900">
                {item.senderNickname}
              </span>
              <span className="text-xs text-gray-500">
                {item.type === 'COMMENT' ? '댓글' : item.type === 'INQUIRY' ? '문의' : item.type}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{item.content}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">{item.createdAt}</span>
            {!item.isRead && <div className="h-2 w-2 rounded-full bg-red-500"></div>}
          </div>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(item.id);
          }}
          className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium whitespace-nowrap transition opacity-0 group-hover:opacity-100"
          title="삭제"
        >
          삭제
        </button>
      )}
    </div>
  );
};
