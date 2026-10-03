"use client";

import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/analytics/track";
import type { Messages } from "@/messages/en";

// The panel (and react-markdown) is a separate chunk: it loads when the
// visitor shows intent (hover, focus, touch) or opens the chat — never with
// the page itself (M6 exit criterion, D32).
const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(() => loadPanel().then((mod) => mod.ChatPanel), {
  ssr: false,
});

type ChatLauncherProps = {
  locale: Locale;
  email: string;
  strings: Messages["chat"];
};

export function ChatLauncher({ locale, email, strings }: ChatLauncherProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const warm = () => void loadPanel();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        onClick={() => {
          setMounted(true);
          setOpen(true);
          track("chat_opened", { locale });
        }}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-12 items-center gap-2 rounded-full bg-night px-5 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-night-raised sm:right-6 sm:bottom-6 print:hidden"
      >
        <Sparkles aria-hidden="true" className="size-4 text-code-keyword" />
        {strings.launcher}
      </button>
      {mounted && (
        <ChatPanel
          open={open}
          locale={locale}
          email={email}
          strings={strings}
          onClose={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
        />
      )}
    </>
  );
}
