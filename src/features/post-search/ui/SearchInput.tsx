'use client';

import { Search } from 'lucide-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/input-group';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (keyword: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '글 제목을 입력해주세요',
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value || '');
    }
  };

  return (
    <InputGroup className="h-11 rounded-full px-1">
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <Search className="size-5 text-muted-foreground" />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="text-sm"
      />
    </InputGroup>
  );
}
