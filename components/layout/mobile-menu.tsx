"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavLink } from "./nav-items";

type MobileMenuProps = {
  links: NavLink[];
  cta: NavLink;
  labels: { open: string; close: string; nav: string };
};

/**
 * Full-screen menu on a native modal <dialog>: the browser traps focus,
 * closes on Esc and makes the rest of the page inert.
 */
export function MobileMenu({ links, cta, labels }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={labels.open}
        onClick={() => dialogRef.current?.showModal()}
        className="flex size-11 items-center justify-center rounded-control border border-border bg-surface text-ink lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.nav}
        onClose={() => openerRef.current?.focus()}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-surface p-0 text-body backdrop:bg-ink/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="flex size-11 items-center justify-center rounded-control border border-border text-ink"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label={labels.nav} className="px-4">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-14 items-center border-b border-border text-xl font-semibold text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 pb-8">
            <Link
              href={cta.href}
              onClick={close}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              {cta.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
