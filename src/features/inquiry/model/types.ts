export interface Inquiry {
  id: number;
  title: string;
  createdAt: string;
  status: 'WAITING' | 'COMPLETED';
}

export interface InquiryDetailItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  status: 'WAITING' | 'COMPLETED';
  answer: {
    adminName: string;
    content: string;
    createdAt: string;
  } | null;
}
