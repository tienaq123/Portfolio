/*
 * Runs inline at the top of <body>, before content is parsed, so nothing
 * flashes. It opts the page into scroll reveals only when the browser can
 * observe intersections and the visitor allows motion, then reveals each
 * [data-reveal] element once. A MutationObserver also covers elements that
 * client-side navigations add later. Kept dependency-free and tiny.
 */
const script = `(() => {
  const root = document.documentElement;
  if (!("IntersectionObserver" in window)) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.setAttribute("data-motion", "");
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute("data-revealed", "");
      io.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  const watch = (node) => {
    if (node.nodeType !== 1) return;
    if (node.matches("[data-reveal]:not([data-revealed])")) io.observe(node);
    node.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
  };
  new MutationObserver((records) => {
    for (const record of records) record.addedNodes.forEach(watch);
  }).observe(root, { childList: true, subtree: true });
})();`;

export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
