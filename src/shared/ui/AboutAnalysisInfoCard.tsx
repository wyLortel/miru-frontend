interface AboutAnalysisInfoCardProps {
  title: string;
  description: string;
  iconSrc?: string;
  iconAlt?: string;
}

export function AboutAnalysisInfoCard({
  title,
  description,
  iconSrc,
  iconAlt,
}: AboutAnalysisInfoCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
      {iconSrc && (
        <img
          src={iconSrc}
          alt={iconAlt || ''}
          width={48}
          height={48}
          className="mb-4 object-contain"
        />
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground md:text-xl">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground md:text-base leading-relaxed leading-loose">
        {description}
      </p>
    </div>
  );
}
