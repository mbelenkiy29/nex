import { LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';

export function CopyToClipboardButton({
  text,
}: {
  text: string | null | undefined;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!text) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(dictionary.shared.copiedToClipboard);
    } catch (error) {
      toast.error(dictionary.shared.errors.copyToClipboard);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-muted-foreground inline-flex"
      type="button"
    >
      <LuCopy />
    </button>
  );
}
