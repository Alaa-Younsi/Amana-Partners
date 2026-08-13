import { Smartphone } from "lucide-react";

import { phonePreview, useInPhoneFrame } from "./state";

/**
 * PHONE PREVIEW — TEMPORARY recording rig. See ./README.md to delete it.
 *
 * Styled against LanguageToggle's chip (same height, border and light/dark
 * treatment) so it does not distort the bar it is borrowing space in — the
 * point of the preview is to film the header as it really is, and a button
 * that pushes the logo sideways would change the shot.
 */
export function PhonePreviewButton({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  const inFrame = useInPhoneFrame();

  // never inside the glass: it would be in the video
  if (inFrame) return null;

  const skin = light
    ? "border-ivory/30 text-ivory/70 hover:border-gold hover:text-ivory"
    : "border-gold/40 text-navy/70 hover:border-gold hover:text-navy";

  return (
    <button
      type="button"
      onClick={phonePreview.toggle}
      aria-label="Phone preview"
      title="Phone preview — temporary recording tool"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${skin} ${className}`}
    >
      <Smartphone className="h-4 w-4" />
    </button>
  );
}
