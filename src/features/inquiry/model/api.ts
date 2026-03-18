import { apiClient } from '@/shared/api/apiClient';
import { Inquiry, InquiryDetailItem } from './types';

// 1. 문의글 목록 전체 조회 (GET)
export const fetchAllInquiries = async (): Promise<Inquiry[]> => {
  const response = await apiClient.get('/api/inquiries');
  return response.data.data.items;
};

// 2. 문의글 신규 등록 (POST)
export const createInquiry = async (data: {
  title: string;
  content: string;
}) => {
  const response = await apiClient.post('/api/inquiries', data);
  return response.data;
};

// 3. 문의글 상세 조회 (GET)
export const fetchInquiryById = async (id: string): Promise<InquiryDetailItem> => {
  const response = await apiClient.get(`/api/inquiries/${id}`);
  return response.data.data.items[0];
};

// 4. 문의글 삭제 (DELETE)
export const deleteInquiry = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/inquiries/${id}`);
};
