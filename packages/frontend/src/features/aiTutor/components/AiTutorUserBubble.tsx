export function AiTutorUserBubble({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl bg-nexexam-soft px-5 py-3 text-base leading-relaxed text-nexexam-ink shadow-sm dark:bg-white/10 dark:text-white">
        {content}
      </div>
    </div>
  );
}
