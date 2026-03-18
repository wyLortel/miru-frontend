import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { AlertCircle, Lightbulb } from 'lucide-react';

interface ContentPart {
  text: string;
  highlight: boolean;
}

interface AnalysisTipCardProps {
  type: 'fail' | 'pass';
  badgeLabel: string;
  pointTitle: string;
  pointContent: string | ContentPart[];
  bottomTitle: string;
  bottomContent: string;
}

export function AnalysisTipCard({
  type,
  badgeLabel,
  pointTitle,
  pointContent,
  bottomTitle,
  bottomContent,
}: AnalysisTipCardProps) {
  const isFail = type === 'fail';

  const badgeStyles = isFail
    ? 'bg-pink-200 text-pink-800'
    : 'bg-primary text-white';

  const pointCardStyles = isFail
    ? 'bg-gray-50 border border-gray-200'
    : 'bg-white border';

  const bottomCardStyles = isFail
    ? 'bg-pink-100 border border-pink-200'
    : 'bg-blue-100 border border-blue-200';

  const bottomTextStyles = isFail
    ? 'text-pink-800'
    : 'text-blue-800';

  const bottomIconStyles = isFail
    ? 'text-pink-600'
    : 'text-blue-600';

  const BottomIcon = isFail ? AlertCircle : Lightbulb;

  return (
    <Card className="border h-full flex flex-col">
      <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
        {/* Point Section */}
        <div className="space-y-3 flex-1 flex flex-col">
          <Badge className={`${badgeStyles} px-5 py-2 text-sm w-fit`}>
            {badgeLabel}
          </Badge>
          <Card className={pointCardStyles}>
            <CardContent className="pt-4 pb-4 h-[180px] flex items-center justify-start">
              <p className="text-sm text-foreground/80 leading-relaxed text-left">
                {Array.isArray(pointContent) ? (
                  pointContent.map((part, idx) => (
                    <span
                      key={idx}
                      className={
                        part.highlight
                          ? isFail
                            ? 'text-destructive font-semibold'
                            : 'text-primary font-semibold'
                          : ''
                      }
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  pointContent
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <Card className={bottomCardStyles}>
          <CardContent className="pt-3 pb-3 px-4 flex gap-3 h-[60px] items-center">
            <BottomIcon className={`size-5 shrink-0 mt-0.5 ${bottomIconStyles}`} />
            <p className={`text-sm leading-relaxed ${bottomTextStyles}`}>
              {bottomContent}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
