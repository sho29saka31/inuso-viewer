export default function FeatureDisabled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-6 text-center">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 dark:text-gray-500">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      <h1 className="text-lg font-bold text-[var(--color-text-main)]">この機能は現在利用できません</h1>
      <p className="text-sm text-[var(--color-text-sub)]">しばらくお待ちください。</p>
    </div>
  );
}
