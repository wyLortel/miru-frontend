import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'miru | 일본 취업 자기분석 서비스',
  description: '일본 취업을 준비하는 한국인을 위한 자기분석 서비스',
};

export default function Home() {
  redirect('/analysis');
}
