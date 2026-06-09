export default function ThinkingAnimation({ text = 'Analysing...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      {/* Three pulsing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Glowing underline */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />

      {/* Status text */}
      <p className="text-text-secondary text-sm font-medium">{text}</p>
    </div>
  );
}
