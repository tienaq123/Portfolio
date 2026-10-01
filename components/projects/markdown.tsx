import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const heading = "mt-10 text-xl font-bold tracking-tight first:mt-0";

// Section titles are h2 on the page, so body headings start at h3.
// `node` is dropped from every renderer so it never reaches the DOM.
const components: Components = {
  h1: ({ node: _node, ...props }) => <h3 className={heading} {...props} />,
  h2: ({ node: _node, ...props }) => <h3 className={heading} {...props} />,
  h3: ({ node: _node, ...props }) => <h3 className={heading} {...props} />,
  h4: ({ node: _node, ...props }) => (
    <h4 className="mt-6 font-bold first:mt-0" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <p className="mt-4 leading-relaxed first:mt-0" {...props} />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 marker:text-muted first:mt-0 [&_ul]:mt-2"
      {...props}
    />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 marker:text-muted first:mt-0"
      {...props}
    />
  ),
  li: ({ node: _node, ...props }) => (
    <li className="pl-1 leading-relaxed" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  code: ({ node: _node, ...props }) => (
    <code
      // Long identifiers and paths may break anywhere instead of overflowing on phones.
      className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] wrap-anywhere text-ink"
      {...props}
    />
  ),
  pre: ({ node: _node, ...props }) => (
    <pre
      className="mt-4 overflow-x-auto rounded-card bg-night p-4 font-mono text-sm text-night-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="mt-4 border-l-2 border-accent pl-4 text-muted"
      {...props}
    />
  ),
  a: ({ node: _node, href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      />
    );
  },
};

/**
 * Renders trusted-but-stored Markdown (static data now, Supabase in M7).
 * Raw HTML is skipped and react-markdown already strips unsafe URLs.
 */
export function MarkdownContent({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("text-body", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </Markdown>
    </div>
  );
}
