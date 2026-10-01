"""Generate conceptual architecture diagrams (SVG) for the case studies.

Boxes: (id, x, y, w, h, title, [sub lines], kind)  kind: default | accent | store
Edges: (from, from_side, to, to_side, label, dashed, waypoints)
Sides: l r t b (midpoint of that side) or e.g. "b@0.3" for 30% along the side.
"""
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent / "public" / "images" / "projects"
FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
STYLE = {
    "default": ("#FFFFFF", "#D3D8E4", "#0E1225", "#646A80", 1),
    "accent": ("#EBF0FF", "#2E5BF0", "#1F3FB8", "#3F4559", 1.5),
    "store": ("#F2F4F9", "#C9CFDD", "#0E1225", "#646A80", 1),
}


def anchor(box, side):
    _, x, y, w, h, *_ = box
    frac = 0.5
    if "@" in side:
        side, f = side.split("@")
        frac = float(f)
    return {
        "l": (x, y + h * frac),
        "r": (x + w, y + h * frac),
        "t": (x + w * frac, y),
        "b": (x + w * frac, y + h),
    }[side]


def render(name, title, width, height, lanes, boxes, edges):
    by_id = {b[0]: b for b in boxes}
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-labelledby="t">',
        f"<title id=\"t\">{escape(title)}</title>",
        "<defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"#8A90A6\"/></marker></defs>",
        f'<rect x="0.5" y="0.5" width="{width-1}" height="{height-1}" rx="16" fill="#F8F9FC" stroke="#E4E7F0"/>',
    ]
    for label, y in lanes:
        out.append(
            f'<text x="30" y="{y}" font-family="{FONT}" font-size="11" font-weight="700" letter-spacing="1.5" fill="#646A80">{escape(label)}</text>'
        )
    # edges first, so boxes sit on top of line ends
    labels = []
    for frm, fs, to, ts, label, dashed, via in edges:
        p0 = anchor(by_id[frm], fs)
        p1 = anchor(by_id[to], ts)
        pts = [p0, *via, p1]
        d = "M" + " L".join(f"{px:.1f} {py:.1f}" for px, py in pts)
        dash = ' stroke-dasharray="5 4"' if dashed else ""
        out.append(
            f'<path d="{d}" fill="none" stroke="#8A90A6" stroke-width="1.5"{dash} marker-end="url(#a)"/>'
        )
        if label:
            # label at the midpoint of the longest segment
            segs = list(zip(pts, pts[1:]))
            (ax, ay), (bx, by) = max(segs, key=lambda s: abs(s[1][0] - s[0][0]) + abs(s[1][1] - s[0][1]))
            labels.append(((ax + bx) / 2, (ay + by) / 2, label))
    for bid, x, y, w, h, t, subs, kind in boxes:
        fill, stroke, tc, sc, sw = STYLE[kind]
        out.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
        )
        lines = 1 + len(subs)
        top = y + h / 2 - (lines - 1) * 9 + 5
        out.append(
            f'<text x="{x + w/2}" y="{top:.1f}" text-anchor="middle" font-family="{FONT}" font-size="14.5" font-weight="700" fill="{tc}">{escape(t)}</text>'
        )
        for i, s in enumerate(subs):
            out.append(
                f'<text x="{x + w/2}" y="{top + 19 + i*16:.1f}" text-anchor="middle" font-family="{FONT}" font-size="12" fill="{sc}">{escape(s)}</text>'
            )
    for lx, ly, label in labels:
        wpx = len(label) * 6.1 + 12
        out.append(
            f'<rect x="{lx - wpx/2:.1f}" y="{ly - 10:.1f}" width="{wpx:.1f}" height="18" rx="9" fill="#F8F9FC"/>'
        )
        out.append(
            f'<text x="{lx:.1f}" y="{ly + 3.5:.1f}" text-anchor="middle" font-family="{FONT}" font-size="11" fill="#646A80">{escape(label)}</text>'
        )
    out.append("</svg>")
    path = ROOT / name / "architecture.svg"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(out) + "\n")
    print(path, width, height)


# ---------------------------------------------------------------- Prep4u
render(
    "prep4u",
    "Prep4u: diagnostics and retention architecture",
    960,
    560,
    [("DIAGNOSE → PRACTISE", 40), ("RETAIN", 318)],
    [
        ("att", 30, 62, 180, 74, "Learner attempts", ["web + mobile app"], "store"),
        ("eng", 270, 62, 210, 74, "Readiness Engine", ["Wilson + Bayesian", "anti-gaming formula"], "accent"),
        ("cache", 540, 62, 180, 74, "Readiness cache", ["Redis 60 min", "event invalidation"], "store"),
        ("dash", 780, 62, 150, 74, "Dashboard", ["web + mobile API"], "default"),
        ("prac", 30, 190, 180, 74, "Filtered practice", ["test library by skill"], "default"),
        ("weak", 270, 190, 210, 74, "Weakness Map", ["skill tree", "mastery ceiling"], "accent"),
        ("place", 540, 190, 180, 74, "Placement Test", ["multistage adaptive", "row-locked submits"], "accent"),
        ("act", 30, 340, 180, 74, "Activity & plans", ["logins, tests, subs"], "store"),
        ("seg", 270, 340, 210, 74, "5 segment rules", ["+ business-value priority"], "accent"),
        ("queue", 540, 340, 180, 74, "Sales priority queue", ["30 REST APIs, playbook"], "default"),
        ("out", 780, 340, 150, 74, "Outreach", ["Zalo deep link"], "default"),
        ("ret", 30, 462, 180, 74, "Retention dashboard", ["D1/D7/D30 cohorts"], "default"),
        ("react", 270, 462, 210, 74, "Reactivation metrics", ["action after contact"], "default"),
        ("logins", 540, 462, 180, 74, "Contacted-user logins", ["middleware, once / session"], "store"),
    ],
    [
        ("att", "r", "eng", "l", "", False, []),
        ("eng", "r", "cache", "l", "", False, []),
        ("cache", "r", "dash", "l", "", False, []),
        ("att", "r@0.8", "weak", "l@0.25", "last 20 tests", False, [(240, 121.2), (240, 208.5)]),
        ("weak", "l@0.7", "prac", "r@0.7", "", False, []),
        ("prac", "t", "att", "b@0.5", "", False, []),
        ("place", "t", "cache", "b", "upsert", False, []),
        ("act", "r", "seg", "l", "", False, []),
        ("seg", "r", "queue", "l", "", False, []),
        ("queue", "r", "out", "l", "", False, []),
        ("act", "b", "ret", "t", "", False, []),
        ("out", "b", "logins", "r", "", False, [(855, 499)]),
        ("logins", "l", "react", "r", "", False, []),
    ],
)

# ---------------------------------------------------------------- Edly
render(
    "edly",
    "Edly: dictation and warm-up architecture",
    960,
    520,
    [("DICTATION", 40), ("WARM-UP", 300)],
    [
        ("tests", 30, 62, 190, 74, "IELTS Listening tests", ["existing content", "MongoDB"], "store"),
        ("seg", 270, 62, 180, 74, "Segments", ["timestamps, speaker"], "default"),
        ("ai", 500, 62, 190, 74, "AI enrichment", ["OpenAI, batches of 10", "retry + backoff"], "accent"),
        ("qa", 740, 62, 190, 74, "QA rules", ["length ratio, swap fix", "vocab in transcript"], "default"),
        ("editor", 270, 180, 180, 74, "Admin editor", ["fix segments by hand"], "default"),
        ("lesson", 500, 180, 190, 74, "Dictation lesson", ["Inertia SSR, JSON-LD"], "accent"),
        ("prog", 740, 180, 190, 74, "Progress", ["MongoDB for users", "localStorage for guests"], "store"),
        ("start", 30, 322, 190, 74, "Start exam", ["IELTS Reading / Listening"], "default"),
        ("dec", 270, 322, 180, 74, "decision API", ["mode, cooldown", "config version"], "accent"),
        ("game", 500, 322, 190, 74, "Mini-game", ["4 formats", "first answer scores"], "default"),
        ("done", 740, 322, 190, 74, "complete API", ["idempotent", "server-side scoring"], "accent"),
        ("room", 500, 430, 190, 74, "Exam room", ["middleware gate"], "default"),
    ],
    [
        ("tests", "r", "seg", "l", "", False, []),
        ("seg", "r", "ai", "l", "", False, []),
        ("ai", "r", "qa", "l", "", False, []),
        ("qa", "b", "lesson", "t", "", False, [(835, 160), (595, 160)]),
        ("editor", "t", "seg", "b", "", False, []),
        ("lesson", "r", "prog", "l", "", False, []),
        ("start", "r", "dec", "l", "", False, []),
        ("dec", "r", "game", "l", "", False, []),
        ("game", "r", "done", "l", "", False, []),
        ("done", "b", "room", "r", "", False, [(835, 467)]),
        ("dec", "b", "room", "l", "skip or fail-open", True, [(360, 467)]),
    ],
)

# ---------------------------------------------------------------- AI Slack Check
render(
    "ai-slack-check",
    "AI Slack Check: attendance pipeline",
    960,
    420,
    [("PIPELINE", 40), ("STORAGE & REVIEW", 196)],
    [
        ("slack", 30, 62, 170, 80, "Slack threads", ["OFF / LATE / REMOTE"], "store"),
        ("job", 250, 62, 210, 80, "Collector job", ["Slack Web API, every 30 min", "new replies only"], "default"),
        ("pre", 510, 62, 200, 80, "Preprocess", ["Vietnamese rules", "[X phút] time hints"], "accent"),
        ("llm", 760, 62, 170, 80, "LLM extraction", ["Claude, 1 call / message"], "accent"),
        ("dash", 30, 218, 170, 80, "HR dashboard", ["review, calendar, CSV"], "accent"),
        ("db", 250, 218, 210, 80, "PostgreSQL", ["idempotent upserts", "raw messages for audit"], "store"),
        ("ups", 510, 218, 200, 80, "Attendance upsert", ["roster by Slack ID", "needs_review flags"], "default"),
        ("val", 760, 218, 170, 80, "Validate", ["tolerant JSON, dates", "3 retries"], "default"),
        ("fail", 760, 330, 170, 64, "failed_processing", [], "store"),
    ],
    [
        ("slack", "r", "job", "l", "", False, []),
        ("job", "r", "pre", "l", "", False, []),
        ("pre", "r", "llm", "l", "", False, []),
        ("llm", "b", "val", "t", "", False, []),
        ("val", "l", "ups", "r", "", False, []),
        ("ups", "l", "db", "r", "", False, []),
        ("db", "l", "dash", "r", "", False, []),
        ("val", "b", "fail", "t", "", False, []),
        ("fail", "l", "dash", "b", "failures shown to HR", True, [(115, 362)]),
    ],
)

# ---------------------------------------------------------------- Benerio
# Highlighted (accent) blocks are the parts the owner built; the rest is the
# platform the team built.
render(
    "benerio",
    "Benerio: platform architecture, with the parts I built highlighted",
    960,
    430,
    [("PLATFORM · HIGHLIGHTED = PARTS I BUILT", 40), ("DATA & INTEGRATIONS", 300)],
    [
        ("users", 30, 62, 180, 74, "Owners, staff, agencies", ["Japanese UI"], "store"),
        ("app", 270, 62, 210, 74, "Next.js 14 on Vercel", ["route handlers, middleware"], "default"),
        ("loader", 540, 62, 180, 74, "Service loader", ["modules per company"], "default"),
        ("cron", 30, 190, 180, 74, "Vercel Cron", ["scheduled posts, sync"], "default"),
        ("gbp", 270, 190, 210, 74, "GBP Manager", ["info, reviews, posts", "analytics, PDF reports"], "accent"),
        ("agency", 540, 190, 180, 74, "Agency tool", ["drafts, schedules, media"], "accent"),
        ("sns", 780, 190, 150, 74, "SNS Manager", ["IG / FB / Threads"], "default"),
        ("plans", 30, 322, 180, 80, "Plans & access", ["accounts per plan", "per-location RLS"], "accent"),
        ("db", 270, 322, 210, 80, "Supabase Postgres", ["71 tables, 144 RLS policies", "Auth, Storage"], "store"),
        ("google", 540, 322, 180, 80, "Google API", ["Business Profile, OAuth", "post & review sync"], "default"),
        ("ext", 780, 322, 150, 80, "Meta & LLM APIs", ["social + AI providers"], "default"),
    ],
    [
        ("users", "r", "app", "l", "", False, []),
        ("app", "r", "loader", "l", "", False, []),
        ("loader", "b@0.2", "gbp", "t", "", False, [(576, 163), (375, 163)]),
        ("loader", "b", "agency", "t", "", False, []),
        ("loader", "b@0.8", "sns", "t", "", False, [(684, 163), (855, 163)]),
        ("cron", "r", "gbp", "l", "", False, []),
        ("gbp", "b", "db", "t", "", False, []),
        ("gbp", "r@0.75", "google", "l@0.25", "", False, [(510, 245.5), (510, 342)]),
        ("agency", "b", "google", "t", "", False, []),
        ("sns", "b", "ext", "t", "", False, []),
        ("plans", "r", "db", "l", "", False, []),
    ],
)
