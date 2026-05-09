export function RichText({ className = "", text }: { className?: string; text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className={className}>
      {blocks.map((block) => (
        <p className="mb-3 last:mb-0" key={block}>
          {renderInlineMarkdown(block)}
        </p>
      ))}
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}
