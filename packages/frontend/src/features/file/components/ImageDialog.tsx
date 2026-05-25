import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';

export function ImageDialog({
  slides,
  index = 0,
  onClose,
}: {
  slides: Array<{ src: string; alt?: string }>;
  index?: number;
  onClose: () => void;
}) {
  const isSingleImage = slides.length === 1;

  return (
    <Lightbox
      open={true}
      close={onClose}
      slides={slides}
      index={index}
      plugins={[Zoom, Fullscreen, Download]}
      render={
        isSingleImage
          ? {
              buttonPrev: () => null,
              buttonNext: () => null,
            }
          : undefined
      }
    />
  );
}
