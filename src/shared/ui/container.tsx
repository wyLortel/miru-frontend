export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6 lg:px-8">
      {children}
    </div>
  );
}
