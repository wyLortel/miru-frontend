import { Card, CardContent } from '@/shared/ui/card';

interface QuestionBoxProps {
  question: string;
}

export function QuestionBox({ question }: QuestionBoxProps) {
  return (
    <Card className="bg-white shadow-sm border border-gray-300">
      <CardContent className="pt-4 pb-4">
        <p className="text-center text-sm text-foreground font-medium">
          {question}
        </p>
      </CardContent>
    </Card>
  );
}
