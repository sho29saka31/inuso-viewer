export default function FeatureDisabled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-6 text-center">
      <p className="text-5xl">🔒</p>
      <h1 className="text-lg font-bold text-[var(--color-text-main)]">この機能は現在利用できません</h1>
      <p className="text-sm text-[var(--color-text-sub)]">しばらくお待ちください。</p>
    </div>
  );
}
