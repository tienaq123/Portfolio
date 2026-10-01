import type { ProjectSection } from "../schema";

// Case study bodies (Markdown, rendered without raw HTML). Generated once from
// the reviewed drafts; edit here directly from now on (M7 moves this to Supabase).
export const caseStudySections: Record<string, ProjectSection[]> = {
  prep4u: [
    {
      type: "context",
      title: null,
      body: {
        en: `Prep4u is a Protean Studios product: a test-prep platform centred on the **Digital SAT** (plus IELTS, the national high-school exam and university aptitude tests), with a web app and a mobile app, sold as Start / Focus / Master subscriptions. It runs on a large Laravel monolith in production — about 535 routes, 178 models, 411 Livewire components and ~6,800 commits since 2023 from more than ten developers.

I worked on it from January to August 2026 and owned the features for **skill diagnostics, learning analytics and retention**.`,
        vi: `Prep4u là sản phẩm của Protean Studios: nền tảng luyện thi trọng tâm **Digital SAT** (thêm IELTS, Tốt nghiệp THPT, ĐGNL), có web và mobile app, kinh doanh theo gói subscription Start / Focus / Master. Hệ thống là một monolith Laravel lớn đang vận hành — khoảng 535 route, 178 model, 411 Livewire component, ~6.800 commit từ 2023 với hơn 10 developer từng tham gia.

Tôi tham gia từ 01/2026 đến 08/2026 và nhận trọn nhóm tính năng về **chẩn đoán năng lực, phân tích học tập và retention**.`,
      },
      media: [],
      sortOrder: 1,
    },
    {
      type: "problem",
      title: null,
      body: {
        en: `Three gaps, on three sides of the product:

- **Learners** practised a lot without knowing how ready they were, what score to expect or which skills held them back — so practice was scattered and motivation dropped.
- **New users** had no quick way to find their level, which weakened onboarding and the path to a paid plan.
- **Sales and product** could not measure retention consistently, did not know which subscribers were about to churn, and sales had no way to decide who to contact today, what to say, or whether the outreach worked.`,
        vi: `Ba khoảng trống, ở ba phía khác nhau của sản phẩm:

- **Học sinh** luyện nhiều nhưng không biết mình đã sẵn sàng tới đâu, điểm dự kiến bao nhiêu và yếu ở kỹ năng nào → luyện lan man, dễ nản.
- **Người dùng mới** không có cách nhanh để biết trình độ → onboarding yếu, khó dẫn tới gói trả phí.
- **Team sale và product** không đo được retention một cách nhất quán, không biết subscriber nào sắp rời bỏ, sale không biết hôm nay nên liên hệ ai, nói gì, và liên hệ có hiệu quả không.`,
      },
      media: [],
      sortOrder: 2,
    },
    {
      type: "responsibility",
      title: null,
      body: {
        en: `I researched, designed the algorithms for, and built end to end six features — business analysis, algorithm and database design, backend and APIs, Livewire UI, GA4 tracking, production deployment and hotfixes:

- **Readiness Engine** — a 0–100 SAT readiness score and a 400–1600 score prediction.
- **Weakness Map** — weakness analysis over the skill tree.
- **Placement Test** — a multistage adaptive entry test in the Digital SAT format, plus a 16-question **Quick Diagnostic**.
- **Retention Metrics Dashboard** — D1/D7/D30 cohort retention.
- **Sale Retention CRM** — my own proposal: a prioritised daily outreach queue for the sales team.

I also led two developers: splitting tasks, reviewing code and designing solutions.`,
        vi: `Tôi tự nghiên cứu, thiết kế thuật toán và làm end-to-end 6 tính năng — từ phân tích nghiệp vụ, thiết kế thuật toán và database, backend/API, UI Livewire, GA4 tracking đến deploy production và hotfix:

- **Readiness Engine** — điểm sẵn sàng thi SAT (0–100) và dự đoán điểm 400–1600.
- **Weakness Map** — phân tích điểm yếu theo cây kỹ năng.
- **Placement Test** — bài test đầu vào multistage adaptive theo format Digital SAT, và **Quick Diagnostic** 16 câu.
- **Retention Metrics Dashboard** — retention theo cohort D1/D7/D30.
- **Sale Retention CRM** — tính năng tôi tự đề xuất: hàng đợi liên hệ ưu tiên cho team sale.

Tôi lead một nhóm 2 developer: chia task, review code và thiết kế giải pháp.`,
      },
      media: [],
      sortOrder: 3,
    },
    {
      type: "constraints",
      title: null,
      body: {
        en: `- **Sparse data:** many users had only taken a few tests, and raw accuracy is noisy (3 out of 3 correct is "100%").
- **Gameable inputs:** clicking through quickly or guessing can still produce good-looking numbers.
- **One engine, many consumers:** the web dashboard, the analytics services and the mobile API had to show the same number.
- **A large production codebase** shared by many developers, so reusing existing infrastructure (the SAT exam room) beat writing new.
- **Infrastructure:** Redis was shared by cache and sessions (flushing it would log everyone out), and no cron job updated subscription status.
- **The full diagnostic takes 134 minutes**, so dropped connections, closed tabs and timeouts mid-test were expected.`,
        vi: `- **Dữ liệu thưa:** nhiều người mới chỉ làm vài bài; accuracy thô rất nhiễu (3/3 câu đúng = 100%).
- **Có thể "hack" điểm:** click thật nhanh hoặc đoán bừa vẫn tạo ra số liệu trông đẹp.
- **Một engine, nhiều nơi dùng:** dashboard web, các service phân tích và mobile API phải ra cùng một con số.
- **Codebase lớn đang chạy production**, nhiều người cùng sửa → ưu tiên tái sử dụng hạ tầng có sẵn (phòng thi SAT) thay vì viết mới.
- **Hạ tầng:** Redis dùng chung cho cache và session (không được flush), không có cron cập nhật trạng thái gói.
- **Bài full diagnostic dài 134 phút** → rủi ro mất mạng, đóng tab, hết giờ giữa chừng.`,
      },
      media: [],
      sortOrder: 4,
    },
    {
      type: "architecture",
      title: null,
      body: {
        en: `- The **Readiness Engine** is a singleton service that reads a learner's last 10 completed tests and caches the result in Redis for 60 minutes. A model observer on \`UserQuiz\` clears that cache **only when** \`is_completed\` flips to \`true\`. Results are stored in \`user_readiness_cache\` (unique per user × exam type), a table shared with the Placement Test. The same engine serves the web dashboard, \`StudyInsightService\`, \`AdvancedAnalyticsService\` and the mobile API.
- The **Weakness Map** reads the last 20 tests over a two-level skill tree. Every weak-skill card links straight to the test library filtered to that skill; the learner practises, and the new attempts flow back into the engine — a closed *diagnose → practise* loop.
- The **Placement Test** runs inside the existing SAT exam room: Reading & Writing Module 1 → Module 2 (Easy or Hard) → 10-minute break → Math Module 1 → Module 2 (Easy or Hard). Its result is upserted into \`user_readiness_cache\` with \`assessment_source = 'full_diagnostic'\`, and dashboards prefer the placement score over the practice-based estimate. The Quick Diagnostic branches off the same infrastructure with \`exam_type = 'quick'\`.
- **Retention and CRM:** cohort queries feed nine dashboard endpoints; five segment rules feed a priority score, the priority-queue API, sales assignment and a Zalo deep link; a middleware records logins of contacted users so reactivation can be measured.`,
        vi: `- **Readiness Engine** là service singleton đọc 10 bài thi hoàn thành gần nhất, kết quả cache trên Redis 60 phút. Một Model Observer trên \`UserQuiz\` xoá cache **chỉ khi** \`is_completed\` chuyển sang \`true\`. Kết quả lưu vào bảng \`user_readiness_cache\` (unique theo user × exam_type) — bảng này dùng chung với Placement Test. Một engine phục vụ dashboard web, \`StudyInsightService\`, \`AdvancedAnalyticsService\` và mobile API.
- **Weakness Map** đọc 20 bài gần nhất theo cây kỹ năng 2 cấp. Mỗi thẻ điểm yếu link thẳng tới thư viện đề đã lọc đúng kỹ năng → học sinh luyện → dữ liệu mới quay lại engine. Vòng lặp *chẩn đoán → luyện tập* khép kín.
- **Placement Test** chạy trên phòng thi SAT có sẵn: RW Module 1 → RW Module 2 (Easy/Hard) → nghỉ 10 phút → Math Module 1 → Math Module 2 (Easy/Hard). Kết quả upsert vào \`user_readiness_cache\` với \`assessment_source = 'full_diagnostic'\`, và dashboard ưu tiên điểm placement hơn điểm ước tính từ luyện tập. Quick Diagnostic rẽ nhánh trên cùng hạ tầng bằng \`exam_type = 'quick'\`.
- **Retention & CRM:** truy vấn cohort → 9 endpoint dashboard; 5 segment rule → priority score → priority queue API → phân công sale → Zalo deep link → middleware ghi event login của người đã được liên hệ → đo reactivation.`,
      },
      media: [
        {
          src: "/images/projects/prep4u/architecture.svg",
          alt: {
            en: `Diagram: learner attempts feed the Readiness Engine, whose cached results serve the web dashboard and the mobile API; the Weakness Map sends learners to practice filtered by skill; the Placement Test writes into the same readiness cache; activity data drives five segment rules, a sales priority queue and outreach, and logins of contacted users feed the reactivation metrics.`,
            vi: `Sơ đồ: bài làm của học viên đi vào Readiness Engine, kết quả được cache và phục vụ dashboard web cùng mobile API; Weakness Map dẫn học viên tới bài luyện lọc theo kỹ năng; Placement Test ghi vào cùng bảng readiness cache; dữ liệu hoạt động đi qua 5 segment rule, hàng đợi ưu tiên cho sale và bước liên hệ, rồi lượt đăng nhập của người đã được liên hệ dùng để đo reactivation.`,
          },
          width: 960,
          height: 560,
        },
      ],
      sortOrder: 5,
    },
    {
      type: "decisions",
      title: null,
      body: {
        en: `### Cautious score prediction: Wilson lower bound + Bayesian smoothing

- **Problem:** with few answers, raw accuracy swings wildly and inflates the predicted score.
- **Decision:** combine the **Wilson score lower bound** (95% confidence) with **Bayesian (Laplace) smoothing**, blended by data confidence \`c = min(1, N/50)\`, with a bonus or penalty from hard-question accuracy. The predicted range **narrows from ±150 to ±30** over the first 100 questions, with five confidence levels.
- **Why:** learners with little data get a cautious estimate and a wide range; learners with plenty get a score close to reality — and both can see how confident it is.
- **Trade-off:** new learners see a lower score and a wider range than they hoped. I answered that with specific guidance ("answer N more questions to unlock a higher score") instead of loosening the formula.

### Anti-gaming built into the formula

- **Problem:** fast clicking or guessing must not push the score up.
- **Decision:** \`Readiness = Accuracy×0.55 + Volume×0.15 + HardAccuracy×0.25 + Time×0.05\`, with weights in \`config/readiness.php\`.
  - Accuracy penalties: below 50% ×0.3, below 60% ×0.5.
  - Volume counts **correct** answers only (target 68.6 = 98 questions × 70%), with a confidence factor for the number of tests.
  - The time score only uses time spent on correct answers, weighted by difficulty (0.5 / 1.0 / 1.5).
  - A **five-step volume ceiling:** under 20 questions caps readiness at 20 … only 200+ questions can reach 100.
- **Why:** each way of gaming the score is neutralised by one component, instead of a separate check that can be worked around.
- **Trade-off:** the formula is harder to explain, so I also built an admin **Readiness Debug** tool: every score component, penalty and ceiling, per-test accuracy, and a response-time histogram (the ≤5-second bucket flags spam clicking). Support uses it to explain scores; I used it to tune the weights.

### Event-driven cache instead of a short TTL

- **Problem:** computing readiness takes many queries, yet learners must see the new score right after finishing a test.
- **Decision:** cache in Redis for 60 minutes and **invalidate from a model observer when a test becomes completed**.
- **Trade-off:** one more place where the invalidation logic must stay right; in return there is no wasted recomputation and no stale score.

### Placement Test: multistage adaptive rather than per-question adaptive

- **Problem:** the diagnostic had to feel like the real Digital SAT and still estimate ability.
- **Decision:** **two-stage multistage adaptive testing**, like the real exam. After each Module 1, ability **θ (−3 to +3)** is estimated from difficulty-weighted accuracy (easy 0.8, medium 1.0, hard 1.25); θ ≥ 0.5 routes to the Hard Module 2. URLs never reveal the branch (users only see \`rw-module-2\`; the server maps it to Easy or Hard) and earlier modules cannot be revisited.
- **Why:** it matches the real format, reuses the existing exam room (timer, review, highlighting, Desmos) and needs no per-question IRT calibration.
- **Trade-off:** the estimate is less precise than CAT/IRT, and the pool currently matches the blueprint exactly, so every user gets the same questions.

### No race conditions on submission

- **Problem:** double submits, multiple tabs and flaky networks while saving answers and finishing modules.
- **Decision:** save answers and finish modules inside a DB transaction with **\`lockForUpdate\` on the session row**; reject duplicate answers and check session ownership. **Batch submit:** answers stay in localStorage and are sent once at the end of the module, each saved in its own transaction to reduce lock contention. Blank answers count as wrong.
- **Trade-off:** unsent answers live on the client until the module ends, covered by auto-submit on timeout, resume from the intro, dashboard or URL, and cleanup of stale state.

### CRM: explainable rules and a priority score, not a model

- **Problem:** sales needed to know who to call first today, and why.
- **Decision:** five ordered segment rules (CANCEL_RECENT, EXPIRED_RECENT, CHURN_RISK, SILENT_SUBSCRIBER, POTENTIAL_BUYER) and a business-value priority score (days inactive, recent cancellation, plan tier and price, low practice, declining activity); POTENTIAL_BUYER gets its own formula that favours active users. Scores are computed in bulk with **four pre-fetch queries** to avoid N+1.
- **Why:** there was not enough data for machine learning, and sales and managers can read and adjust rules.
- **Trade-off:** weights have to be tuned by hand from sales feedback.

### Retention on a fixed cohort

- **Problem:** naive calculations produced D30 above D7, or counted cohorts that had not been observed long enough.
- **Decision:** **rolling retention on one fixed cohort** — users whose first test was 31–61 days ago — so every D-value uses the same cohort, D1 ≤ D7 ≤ D30 always holds, and **right-censoring** is handled; alongside GA-style **exact retention** (D1/D7/D14/D30) and a 12-week trend.

### Log only what the metric needs

- **Decision:** a middleware records a login event **only for users sales has contacted**, once per session (\`last_login_at\` is always updated).
- **Why:** the event table stays small while still measuring "action after contact" and 7-day reactivation.`,
        vi: `### Dự đoán điểm thận trọng: Wilson score lower bound + Bayesian smoothing

- **Vấn đề:** với ít câu, accuracy thô dao động mạnh và dễ cho điểm dự kiến ảo.
- **Lựa chọn:** dùng **Wilson score lower bound** (khoảng tin cậy 95%) và **Bayesian (Laplace) smoothing**, blend theo độ tin cậy \`c = min(1, N/50)\`; điều chỉnh bonus/penalty theo accuracy câu khó. Khoảng điểm dự kiến **co hẹp dần từ ±150 xuống ±30** trong 100 câu đầu, kèm 5 mức confidence.
- **Lý do:** người ít dữ liệu nhận ước lượng thận trọng với khoảng rộng; người nhiều dữ liệu nhận điểm sát thực tế — và cả hai đều thấy rõ độ tin cậy.
- **Trade-off:** người mới thấy điểm thấp và khoảng rộng hơn kỳ vọng. Tôi bù bằng thông điệp chẩn đoán cụ thể ("cần làm thêm N câu để mở khoá điểm cao hơn") thay vì nới công thức.

### Chống điểm ảo nằm ngay trong công thức

- **Vấn đề:** click nhanh hoặc đoán bừa không được phép đẩy điểm lên.
- **Lựa chọn:** \`Readiness = Accuracy×0.55 + Volume×0.15 + HardAccuracy×0.25 + Time×0.05\` (trọng số trong \`config/readiness.php\`).
  - Hệ số phạt theo accuracy: dưới 50% ×0.3, dưới 60% ×0.5.
  - Volume chỉ đếm **câu đúng** (mục tiêu 68,6 = 98 câu × 70%), có hệ số độ tin cậy theo số bài.
  - Time score chỉ tính thời gian của câu đúng, trọng số theo độ khó (0.5 / 1.0 / 1.5).
  - **Volume ceiling 5 mức:** dưới 20 câu thì trần 20 điểm … từ 200 câu trở lên mới tới 100.
- **Lý do:** mỗi cách gian lận đều bị một thành phần vô hiệu hoá, thay vì một lớp kiểm tra riêng dễ bị lách.
- **Trade-off:** công thức khó giải thích hơn → tôi xây thêm **tool admin Readiness Debug**: xem từng thành phần điểm, mức phạt, trần, accuracy từng bài và histogram thời gian trả lời (bucket ≤5 giây để phát hiện spam click) — để CS giải thích điểm cho học viên và để tôi tinh chỉnh trọng số.

### Cache theo sự kiện thay vì TTL ngắn

- **Vấn đề:** tính readiness tốn nhiều query, nhưng sau khi làm xong bài học sinh phải thấy điểm mới ngay.
- **Lựa chọn:** cache Redis 60 phút + **Model Observer invalidate khi bài chuyển sang hoàn thành**.
- **Trade-off:** thêm một nơi phải giữ đúng logic invalidation; đổi lại không tính lại thừa và không trả số liệu cũ.

### Placement Test: multistage adaptive thay vì adaptive từng câu

- **Vấn đề:** cần bài chẩn đoán đúng trải nghiệm Digital SAT và ước lượng được năng lực.
- **Lựa chọn:** **multistage adaptive 2 stage** như Digital SAT thật. Sau mỗi Module 1, ước lượng năng lực **θ (−3 đến +3)** từ accuracy có trọng số độ khó (easy 0.8, medium 1.0, hard 1.25); θ ≥ 0,5 → Module 2 Hard. URL không lộ nhánh (người dùng chỉ thấy \`rw-module-2\`, server tự map Easy/Hard) và không thể quay lại module trước.
- **Lý do:** đúng format thi thật, tái sử dụng được phòng thi SAT có sẵn (timer, review, highlight, Desmos) và không cần calibrate tham số IRT cho từng câu hỏi.
- **Trade-off:** ước lượng kém chính xác hơn CAT/IRT; pool hiện bằng đúng blueprint nên mọi người dùng nhận cùng một bộ câu hỏi.

### Chống race condition khi nộp bài

- **Vấn đề:** double submit, nhiều tab, mạng chập chờn khi nộp đáp án và chuyển module.
- **Lựa chọn:** lưu đáp án và kết thúc module trong DB transaction với **\`lockForUpdate\` trên session**; chặn đáp án trùng; kiểm tra quyền sở hữu session. **Batch submit:** đáp án giữ trong localStorage và gửi một lần khi hết module, mỗi đáp án lưu trong transaction riêng để giảm lock contention. Câu bỏ trống tính là sai.
- **Trade-off:** đáp án chưa gửi nằm phía client tới cuối module → bù bằng tự nộp khi hết giờ, resume từ intro/dashboard/URL và dọn state cũ.

### CRM: rule + priority score có thể giải thích, thay vì mô hình học máy

- **Vấn đề:** sale cần biết hôm nay gọi ai trước và vì sao.
- **Lựa chọn:** 5 segment rule theo thứ tự ưu tiên (CANCEL_RECENT, EXPIRED_RECENT, CHURN_RISK, SILENT_SUBSCRIBER, POTENTIAL_BUYER) và priority score theo giá trị kinh doanh (số ngày không hoạt động, vừa huỷ gói, tier, giá trị gói, mức luyện tập, xu hướng giảm); POTENTIAL_BUYER dùng công thức riêng, ưu tiên người đang hoạt động. Chấm điểm hàng loạt bằng **4 query pre-fetch** để tránh N+1.
- **Lý do:** dữ liệu chưa đủ cho ML; sale và quản lý hiểu và chỉnh được rule.
- **Trade-off:** trọng số phải tinh chỉnh tay theo phản hồi của sale.

### Retention trên cohort cố định

- **Vấn đề:** cách tính ngây thơ cho ra D30 > D7 hoặc cohort chưa đủ ngày quan sát.
- **Lựa chọn:** **rolling retention trên một cohort cố định** — người có lần làm bài đầu tiên cách đây 31–61 ngày — để mọi mốc D dùng cùng một cohort, luôn có D1 ≤ D7 ≤ D30, có xử lý **right-censoring**; song song **exact retention** kiểu GA (D1/D7/D14/D30) và trend 12 tuần.

### Chỉ log những gì cần để đo

- **Lựa chọn:** middleware ghi event login **chỉ cho người đã được sale liên hệ**, mỗi session một lần (luôn cập nhật \`last_login_at\`).
- **Lý do:** bảng event gọn mà vẫn đo được tỷ lệ "có hành động sau liên hệ" và reactivation trong 7 ngày.`,
      },
      media: [],
      sortOrder: 6,
    },
    {
      type: "tradeoffs",
      title: null,
      body: {
        en: `- **Multistage vs CAT/IRT:** simple, faithful to the format and reuses the exam room, at the cost of estimate precision.
- **Rules vs machine learning** for segments and priority: transparent and workable with little data, but tuned by hand.
- **Trigger Engine, phase 1:** four condition types and four action types are designed, but the Zalo, email and voucher actions only log for now, and Zalo outreach is semi-automatic (a personalised message plus a deep link) — faster to launch, not yet fully automated.
- **Tier gating on the results page** supports upselling (Weakness Map and roadmap for paid plans, AI Coach for Focus/Master), while free users still get the predicted score and level.
- **Now vs later:** rolling retention still runs \`exists()\` per user — fine at the current scale, worth optimising as it grows.`,
        vi: `- **Multistage vs CAT/IRT:** đơn giản, đúng format, tái dùng phòng thi — đổi lại độ chính xác ước lượng thấp hơn.
- **Rule-based vs ML** cho segment và priority: minh bạch, chạy được với ít dữ liệu — đổi lại phải tinh chỉnh tay.
- **Trigger Engine giai đoạn 1:** thiết kế đủ 4 loại điều kiện và 4 loại hành động, nhưng các action gửi Zalo/email/voucher hiện chỉ ghi log; gửi Zalo là bán tự động (render tin cá nhân hoá rồi mở deep link) — ra mắt nhanh, chưa tự động hoàn toàn.
- **Tier gating trên trang kết quả** phục vụ upsell (Weakness Map và roadmap cho gói trả phí, AI Coach cho Focus/Master), nhưng người dùng free vẫn nhận điểm dự kiến và mức độ.
- **Ngắn hạn vs mở rộng:** rolling retention đang chạy \`exists()\` theo từng user — đủ cho quy mô hiện tại, cần tối ưu khi lớn hơn.`,
      },
      media: [],
      sortOrder: 7,
    },
    {
      type: "implementation",
      title: null,
      body: {
        en: `- **Readiness:** accuracy by difficulty comes from **a single grouped SQL query** over \`user_quiz_details ⨝ questions\`; ideal answer times are derived from the real test structure (\`quiz_sections\`), with a 1.13 medium factor calibrated on measured data (93 s vs 82 s). A planning layer estimates weekly score gains, rates a target as "achievable" or "stretch" against the exam date, and generates a three-phase roadmap and coach comments.
- **Weakness Map:** accuracy weighted by difficulty (1 / 1.5 / 2) and by recency (linear decay from 2× to 0.5×); a **four-level mastery ceiling** (only easy questions caps mastery at 50%, …) with the reason shown in the UI ("needs more hard questions (1/3)"); a 0–100 risk score; five skill states; categories with under 30% coverage marked critical; noise thresholds. Sub-skills lazy-load in Livewire, and **ten GA4 events** measure the funnel from view to skill click to practice.
- **Placement Test:** a six-module blueprint spread across eight SAT skill domains, a 147-question pool with no overlap; 98 questions (27/27/22/22) in 134 minutes; section score \`200 + 600 × weighted accuracy\` (±80). A seeder builds the pool from the 300 newest tests, over-samples 3× per blueprint cell and prints a verification report; every calculation on the results page has a fallback. The **Quick Diagnostic** reuses the sessions, exam room and submission pipeline and shipped in about a week.
- **Sale Retention CRM:** five new tables (~20 indexes) and nine event types; a priority queue with nine filters; a configurable playbook (scripts per segment, four target KPIs, six Zalo templates with 16 variables); \`retention:auto-assign --dry-run --segment\`; \`retention:validate-data --sync --fix\` for go/no-go checks and a correlated-UPDATE backfill of \`last_login_at\`; an \`ExcludesTestAccounts\` trait reused in eight classes; role-based access middleware; **30 REST endpoints**.
- **Retention Dashboard:** nine JSON endpoints and four Chart.js tabs that load on open; pagination runs on IDs first and enriches only the current page, avoiding N+1; test accounts and unfinished attempts are excluded.`,
        vi: `- **Readiness:** accuracy theo độ khó lấy bằng **một câu SQL group by** trên \`user_quiz_details ⨝ questions\`; thời gian lý tưởng suy từ cấu trúc đề thật (\`quiz_sections\`), hệ số medium 1,13 hiệu chỉnh từ dữ liệu đo thực tế (93s so với 82s). Lớp lập kế hoạch: ước tính điểm tăng mỗi tuần, đánh giá mục tiêu "khả thi" hay "thử thách" theo ngày thi, roadmap 3 giai đoạn và coach comment tự động.
- **Weakness Map:** accuracy có trọng số độ khó (1 / 1,5 / 2) nhân trọng số thời gian giảm tuyến tính từ 2× xuống 0,5×; **mastery ceiling 4 mức** (chỉ làm câu dễ thì tối đa 50%…), UI ghi rõ lý do ("cần thêm câu khó (1/3)"); risk score 0–100; 5 trạng thái kỹ năng; category có coverage dưới 30% bị đánh critical; ngưỡng lọc nhiễu. Livewire lazy-load sub-skill; **10 sự kiện GA4** đo funnel view → click kỹ năng → bắt đầu luyện.
- **Placement Test:** blueprint 6 module, phân bổ đều 8 domain kỹ năng, pool 147 câu không trùng; mỗi lượt 98 câu (27/27/22/22), 134 phút; điểm section \`200 + 600 × weighted accuracy\` (±80); seeder dựng pool từ 300 đề mới nhất, lấy dư ×3 mỗi ô blueprint và in báo cáo kiểm chứng; mọi tính toán trang kết quả có try/catch và fallback. **Quick Diagnostic** 16 câu dùng chung session, phòng thi và pipeline nộp bài → hoàn thành trong khoảng một tuần.
- **Sale Retention CRM:** 5 bảng mới (~20 index), 9 loại event; priority queue với 9 bộ lọc; playbook cấu hình được (kịch bản theo segment, 4 KPI mục tiêu, 6 mẫu tin Zalo với 16 biến); \`retention:auto-assign --dry-run --segment\`; \`retention:validate-data --sync --fix\` kiểm tra go/no-go và backfill \`last_login_at\` bằng correlated UPDATE; trait \`ExcludesTestAccounts\` dùng lại ở 8 class; middleware phân quyền theo role; **30 REST endpoint**.
- **Retention Dashboard:** 9 JSON endpoint, 4 tab Chart.js chỉ tải khi mở; phân trang trên danh sách ID trước rồi enrich một lần để tránh N+1; loại tài khoản test và lượt thi chưa hoàn thành.`,
      },
      media: [],
      sortOrder: 8,
    },
    {
      type: "results",
      title: null,
      body: {
        en: `- Everything runs in production on prep4u.vn for 12,400+ registered users.
- One Readiness Engine serves the web dashboard, the analytics services and the mobile API.
- The Placement Test and Quick Diagnostic became the **onboarding and upsell funnel** (tier gating, a \`placement_test_complete\` event).
- Sales gets a prioritised daily outreach queue and can measure reactivation after contact.`,
        vi: `- Toàn bộ chạy production trên prep4u.vn với 12.400+ người dùng đăng ký.
- Một Readiness Engine dùng chung cho dashboard web, các service phân tích và mobile API.
- Placement Test và Quick Diagnostic trở thành **phễu onboarding và upsell** (tier gating, event \`placement_test_complete\`).
- Team sale có hàng đợi liên hệ ưu tiên hằng ngày và đo được reactivation sau liên hệ.`,
      },
      media: [],
      sortOrder: 9,
    },
    {
      type: "learnings",
      title: null,
      body: {
        en: `- With sparse data, **cautious but explainable** beats falsely precise: a narrowing range and "answer N more questions" made learners trust the number.
- Anti-gaming belongs **inside the model**, not in a check bolted on afterwards.
- A debug tool built alongside the algorithm speeds up tuning for operations and for me.
- Measurement — GA4 funnels, post-contact events — has to be designed with the feature, not added later.
- Next steps I would take: randomise the placement pool, optimise rolling retention and the "action after contact" filter, and automate the Trigger Engine.`,
        vi: `- Với dữ liệu thưa, **thận trọng nhưng giải thích được** tốt hơn chính xác giả tạo: khoảng điểm co dần và thông điệp "cần thêm N câu" giúp học sinh tin con số.
- Chống gian lận nên nằm **trong mô hình**, không phải một lớp kiểm tra đắp thêm.
- Tool debug xây song song với thuật toán giúp cả vận hành lẫn chính mình tinh chỉnh nhanh.
- Đo lường (GA4 funnel, event sau liên hệ) cần thiết kế cùng tính năng, không bổ sung sau.
- Hướng tiếp theo: random hoá pool Placement Test, tối ưu rolling retention và bộ lọc "action after contact", tự động hoá Trigger Engine.`,
      },
      media: [],
      sortOrder: 10,
    },
  ],
  edly: [
    {
      type: "context",
      title: null,
      body: {
        en: `Edly (edly.vn) is a Protean Studios EdTech / LMS platform, built partly on the Prep4u codebase: prep for all four IELTS skills, the Digital SAT and university aptitude tests, plus video courses, online classrooms for teachers and mini-games. Its users are students, teachers, parents, sales staff, content editors and admins.

The codebase is large and runs two frontend stacks side by side — **Inertia + Vue 3 with TypeScript** for newer areas and **Livewire** for the CMS and older pages — with content data in **MongoDB** and transactional data in **MySQL**. I worked on it from May to September 2026.`,
        vi: `Edly (edly.vn) là nền tảng EdTech / LMS của Protean Studios, phát triển một phần từ nền tảng Prep4u: luyện thi IELTS 4 kỹ năng, Digital SAT và kỳ thi Đánh giá năng lực, kèm khoá học video, lớp học trực tuyến cho giáo viên và mini-game. Người dùng gồm học sinh, giáo viên, phụ huynh, sale, nhân viên nhập liệu và admin.

Codebase lớn và có hai stack frontend song song: **Inertia + Vue 3 TypeScript** cho các khu vực mới và **Livewire** cho CMS và trang cũ; dữ liệu nội dung nằm trên **MongoDB**, dữ liệu giao dịch trên **MySQL**. Tôi tham gia từ 05/2026 đến 09/2026.`,
      },
      media: [],
      sortOrder: 1,
    },
    {
      type: "problem",
      title: null,
      body: {
        en: `- **Existing IELTS Listening tests were only used for exams.** Students had no way to practise listening actively, sentence by sentence, and the product lacked a free channel for organic traffic.
- **Students entered the exam room cold.** A short warm-up was needed before each test — without lowering the share of students who actually start it.
- **Assigning SAT work to classes had to respect scope:** admins share tests with teachers per module, and teachers may only assign the modules they hold.
- **The 61,000+ question bank needed transcripts, difficulty levels and categories**, far too many to do by hand.`,
        vi: `- **Đề IELTS Listening có sẵn chỉ dùng để thi.** Học sinh thiếu cách luyện nghe chủ động từng câu, và sản phẩm thiếu một kênh thu hút traffic miễn phí.
- **Học sinh vào phòng thi "nguội".** Cần một bước khởi động ngắn trước khi thi — nhưng không được làm giảm tỷ lệ bắt đầu thi.
- **Giao bài SAT cho lớp học** phải tôn trọng phạm vi: admin chia sẻ đề cho giáo viên theo module, giáo viên chỉ giao được những module mình đang sở hữu.
- **Ngân hàng 61.000+ câu hỏi** cần transcript, độ khó và danh mục — làm tay không xuể.`,
      },
      media: [],
      sortOrder: 2,
    },
    {
      type: "responsibility",
      title: null,
      body: {
        en: `- **Dictation practice — 100%, my own proposal:** idea → backend and APIs → MongoDB data model → Vue UI → progress tracking → AI translation and vocabulary → SEO and SSR → release.
- **Warm-up mini-game — 100%, my own proposal:** business rules → database → APIs → frontend game integration → tests → documentation → release.
- **Module-based assignment:** analysed the requirements and designed how tests are shared and assigned per module.
- **AI question analysis with OpenAI (GPT-5.5) — 100%:** transcripts, difficulty levels and categories.
- Contributed to the SAT exam-room logic, Classroom / LMS, several IELTS modules, analytics and the CMS, and optimised APIs, queries and caching in the flows I owned.
- Led a group of two developers: splitting tasks, reviewing code and designing solutions.`,
        vi: `- **Nghe chép chính tả — 100%, tự đề xuất:** ý tưởng → backend/API → cấu trúc dữ liệu MongoDB → UI Vue → lưu tiến độ → AI dịch và sinh từ vựng → SEO/SSR → release.
- **Warm-up mini-game — 100%, tự đề xuất:** business rules → database → API → tích hợp game frontend → test → tài liệu → release.
- **Giao bài theo module:** tự phân tích requirement và thiết kế luồng chia sẻ đề và giao bài theo module.
- **AI phân tích câu hỏi bằng OpenAI (GPT-5.5) — 100%:** sinh transcript, phân loại độ khó và danh mục.
- Tham gia logic phòng thi SAT, Classroom / LMS, một số module IELTS, analytics và CMS; tối ưu API, query và cache ở các luồng mình phụ trách.
- Lead nhóm 2 developer: chia task, review code, thiết kế giải pháp.`,
      },
      media: [],
      sortOrder: 3,
    },
    {
      type: "constraints",
      title: null,
      body: {
        en: `- A large production codebase with two frontend stacks and data split between MongoDB and MySQL.
- Dictation had to **work without signing in** (it is an SEO channel) without losing progress when a user signs in halfway.
- Pages meant for search had to be server-rendered (Inertia SSR).
- Bulk AI generation is unreliable: outputs vary and long requests time out.
- The warm-up is an extra step and **must not block the exam** when something fails — unless the business explicitly requires it.`,
        vi: `- Codebase lớn đang vận hành, hai stack frontend, dữ liệu chia giữa MongoDB và MySQL.
- Nghe chép chính tả phải **dùng được không cần đăng nhập** (để làm kênh SEO) nhưng không được mất tiến độ khi người dùng đăng nhập giữa chừng.
- Trang cần SEO phải render phía server (Inertia SSR).
- AI sinh nội dung hàng loạt: output không ổn định, request dài dễ timeout.
- Warm-up là bước phụ — **không được chặn luồng thi chính** khi có lỗi, trừ khi nghiệp vụ yêu cầu bắt buộc.`,
      },
      media: [],
      sortOrder: 4,
    },
    {
      type: "architecture",
      title: null,
      body: {
        en: `- **Dictation:** each section of a Listening test becomes a practice lesson. The transcript is split into segments with timestamps (start – end), speaker, translation and vocabulary (word, meaning, IPA); admins adjust segments directly in the Listening test editor. An artisan command runs AI enrichment in batches. Lesson pages are rendered with Inertia SSR; progress is stored in MongoDB for signed-in users and in localStorage for guests; section data is cached, and an observer clears the cache whenever the test or its questions change.
- **Warm-up:** \`WarmupConfig\` (one per test: mode, version, cooldown, blocks → items) and \`WarmupAttempt\` (status, results per block and item, first and last answers, attempts, response times) in MongoDB. The API flows \`decision → start → complete / skip\`; the \`EnforceWarmupRequired\` middleware sits in front of the exam room; on the frontend a TypeScript mapper turns backend data into the formats the existing mini-game engine expects.
- **Module-based assignment:** admins share tests with teachers per module → teachers assign to classes or students within the modules they hold → the system filters questions to the assigned modules and keeps each assignment's modules in sync.
- **AI question analysis:** OpenAI (GPT-5.5) generates transcripts, difficulty levels and categories for questions in the bank.`,
        vi: `- **Nghe chép chính tả:** mỗi section của đề Listening trở thành một bài luyện. Transcript chia thành segment có timestamp (từ – đến), người nói, bản dịch và từ vựng (từ, nghĩa, IPA); admin chỉnh segment ngay trong trình soạn đề Listening. Một artisan command chạy AI enrichment theo batch. Trang luyện tập render bằng Inertia SSR; tiến độ lưu MongoDB cho người đăng nhập và localStorage cho khách; dữ liệu section được cache và một Observer xoá cache khi đề hoặc câu hỏi thay đổi.
- **Warm-up:** \`WarmupConfig\` (mỗi đề một cấu hình: chế độ, version, cooldown, block → item) và \`WarmupAttempt\` (trạng thái, kết quả theo block/item, lần trả lời đầu/cuối, số lần thử, thời gian phản hồi) trên MongoDB. API \`decision → start → complete / skip\`; middleware \`EnforceWarmupRequired\` đứng trước phòng thi; frontend dùng lớp mapper TypeScript chuyển dữ liệu backend sang engine mini-game có sẵn.
- **Giao bài theo module:** admin chia sẻ đề cho giáo viên theo module → giáo viên giao cho lớp / học sinh trong phạm vi module được sở hữu → hệ thống lọc câu hỏi theo module được giao và đồng bộ module của bài tập.
- **AI phân tích câu hỏi:** OpenAI (**GPT-5.5**) sinh transcript, độ khó, danh mục cho câu hỏi trong ngân hàng.`,
      },
      media: [
        {
          src: "/images/projects/edly/architecture.svg",
          alt: {
            en: `Diagram: IELTS Listening tests are split into timestamped segments, enriched by OpenAI in batches and checked by QA rules, then served as server-rendered dictation lessons with progress stored in MongoDB or localStorage. For the warm-up, starting an exam calls the decision API, then the mini-game and the idempotent complete API before the exam room; a skip or a fail-open goes straight to the exam room.`,
            vi: `Sơ đồ: đề IELTS Listening được chia thành segment có timestamp, được OpenAI bổ sung nội dung theo batch và kiểm tra bằng rule, rồi trở thành bài nghe chép render phía server, tiến độ lưu ở MongoDB hoặc localStorage. Với warm-up, khi bắt đầu thi hệ thống gọi decision API, tới mini-game và complete API idempotent rồi mới vào phòng thi; bỏ qua hoặc fail-open thì vào thẳng phòng thi.`,
          },
          width: 960,
          height: 520,
        },
      ],
      sortOrder: 5,
    },
    {
      type: "decisions",
      title: null,
      body: {
        en: `### Turn existing content into a new product

- **Problem:** the product needed a new listening feature without producing new content from scratch.
- **Decision:** reuse the IELTS Listening tests — **each section becomes a sentence-by-sentence dictation lesson**, free and without sign-in.
- **Why:** content cost is close to zero, and every lesson doubles as a search landing page.
- **Trade-off:** lesson quality depends on the original transcript, so admins can edit segments right in the test editor.

### Batched AI enrichment with rule-based quality checks

- **Problem:** translating and extracting vocabulary for thousands of segments with an LLM — unstable output, and long requests time out.
- **Decision:**
  - Call OpenAI in **batches of 10 segments**, **retry with backoff**, and split requests to avoid timeouts.
  - **Check every translation:** the Vietnamese/English length ratio must fall between 0.6 and 3.0; failing sentences are re-requested one by one.
  - Detect and fix **two adjacent translations that came back swapped**.
  - Keep only vocabulary that actually appears in the transcript.
  - Run offline with \`dictation:generate-metadata --dry-run\` to preview before writing.
- **Why:** LLM output is never trusted blindly; rules are cheaper and faster than reviewing everything by hand.
- **Trade-off:** rules catch formal errors, not wrong meanings, so admins can still edit by hand.

### Guest-first without losing progress

- **Decision:** guests keep progress in localStorage; the API returns **200 with empty data instead of 401** so the experience never breaks; signing in halfway (auth modal + redirect) keeps the progress. Signed-in users save each sentence and in batches to MongoDB.
- **Trade-off:** a guest's progress is lost when browser data is cleared or the device changes — accepted, so the SEO channel has no sign-in wall.

### Technical SEO for every lesson

- **Decision:** canonical slug URLs \`/nghe-chep-chinh-ta/{slug}.html\` with **301 redirects** from old URLs; Inertia SSR with a title and description per section; **JSON-LD** BreadcrumbList, HowTo, FAQ, ItemList, LearningResource and AudioObject; sitemap entries, crawlability fixes and tuned og:image.

### Warm-up: fail-open or fail-closed is a business decision

- **Problem:** the warm-up must not break the exam flow, yet some tests require it.
- **Decision:** three modes, each with its own failure strategy:
  - **Required — fail-closed:** the server returns 403 on skip attempts, and the \`EnforceWarmupRequired\` middleware blocks direct access to the exam-room URL.
  - **Recommended — fail-open:** skipping is allowed, and if the API fails the student still enters the exam.
  - **Off.**
- **Why:** each mode is a different promise to the student; writing it into the business rules before coding kept the whole team aligned.

### Versioned configuration and exact cooldowns

- **Decision:** one configuration per test; **the version only increases when content (blocks or questions) changes**, not metadata. The default 24-hour cooldown is computed as \`completed_at + cooldown_hours\`; **only completions of the same version** count, while skipped or abandoned attempts (started over 30 minutes ago and unfinished) do not. A **compound index** \`{user_id, warmup_config_id, warmup_version, status, completed_at}\` serves exactly the cooldown query.
- **Trade-off:** more complex attempt data, in return for students warming up again whenever the content changes.

### Idempotent \`complete\`, scored on the server

- **Decision:** calling \`complete\` repeatedly (flaky network, double taps) returns the same result and creates no duplicates; scoring happens entirely on the server and **only counts the first answer** — students may retry to learn, but retries do not score, and no pass/fail is shown.

### Phased rollout with KPIs defined up front

- **Decision:** phase 1 was a demo on mock data reusing the existing mini-game engine; phase 2 connected the real API through a TypeScript mapper, an answer collector and a local scoring fallback. **Pilot KPIs** were set before launch: exam start rate may drop by at most 5 percentage points, completion ≥ 50%, skips ≤ 40%, abandonment ≤ 10%; latency targets below 100 ms for \`decision\` and below 300 ms for \`complete\`.

### Assignment scoped to the modules a teacher holds

- **Problem:** teachers may only assign the SAT modules they have rights to, and admins need to share tests per module rather than as a whole.
- **Decision:** assignment rights are tied to the modules a teacher holds; the system filters questions to the assigned modules and keeps each assignment's modules in sync.`,
        vi: `### Biến nội dung có sẵn thành sản phẩm mới

- **Vấn đề:** cần một tính năng luyện nghe mới mà không phải tạo nội dung từ đầu.
- **Lựa chọn:** tái sử dụng đề IELTS Listening — **mỗi section thành một bài nghe chép từng câu**, miễn phí, không cần đăng nhập.
- **Lý do:** chi phí nội dung gần như bằng 0, mỗi bài luyện đồng thời là một trang SEO.
- **Trade-off:** chất lượng bài luyện phụ thuộc chất lượng transcript gốc → admin chỉnh được segment ngay trong trình soạn đề.

### AI enrichment theo batch, có kiểm soát chất lượng bằng rule

- **Vấn đề:** dịch và sinh từ vựng cho hàng nghìn segment bằng LLM — output không ổn định, request dài dễ timeout.
- **Lựa chọn:**
  - Gọi OpenAI theo **batch 10 segment**, **retry với backoff**, chia nhỏ request tránh timeout.
  - **Kiểm tra bản dịch:** tỷ lệ độ dài câu Việt/Anh phải trong khoảng 0,6–3,0; câu không đạt được gọi lại riêng lẻ.
  - Tự phát hiện và sửa **2 câu dịch liền kề bị đảo vị trí**.
  - Lọc từ vựng: chỉ giữ từ thực sự xuất hiện trong transcript.
  - Chạy offline bằng \`dictation:generate-metadata --dry-run\` để xem trước khi ghi.
- **Lý do:** không tin tuyệt đối output LLM; rule rẻ và nhanh hơn review tay toàn bộ.
- **Trade-off:** rule chỉ bắt được lỗi hình thức, không bắt được lỗi nghĩa → vẫn để admin chỉnh tay.

### Guest-first nhưng không mất tiến độ

- **Lựa chọn:** khách lưu tiến độ trong localStorage; API trả **200 với dữ liệu rỗng thay vì 401** để không gián đoạn trải nghiệm; có luồng đăng nhập giữa chừng (auth modal + redirect) mà không mất tiến độ. Người đăng nhập lưu từng câu và theo batch trên MongoDB.
- **Trade-off:** tiến độ của khách mất khi xoá dữ liệu trình duyệt hoặc đổi thiết bị — đổi lại không có rào cản đăng nhập ở kênh SEO.

### SEO kỹ thuật cho từng bài luyện

- **Lựa chọn:** URL slug chuẩn \`/nghe-chep-chinh-ta/{slug}.html\` với **redirect 301** từ URL cũ; Inertia SSR với title/description riêng từng section; **JSON-LD** BreadcrumbList, HowTo, FAQ, ItemList, LearningResource, AudioObject; đưa vào sitemap, sửa lỗi crawlability, tối ưu og:image.

### Warm-up: fail-open hay fail-closed là quyết định nghiệp vụ

- **Vấn đề:** warm-up không được làm hỏng luồng thi, nhưng một số đề cần bắt buộc khởi động.
- **Lựa chọn:** 3 chế độ với chiến lược lỗi khác nhau:
  - **Bắt buộc — fail-closed:** server trả 403 nếu cố bỏ qua; middleware \`EnforceWarmupRequired\` chặn truy cập thẳng URL phòng thi.
  - **Khuyến nghị — fail-open:** được bỏ qua; nếu API lỗi vẫn cho vào thi.
  - **Tắt.**
- **Lý do:** mỗi chế độ là một cam kết khác nhau với người dùng; viết rõ trong business rules trước khi code để cả team thống nhất.

### Versioning cấu hình và cooldown chính xác

- **Lựa chọn:** mỗi đề một cấu hình; **version chỉ tăng khi nội dung (block/câu hỏi) thay đổi**, sửa metadata không tăng. Cooldown mặc định 24h tính theo \`completed_at + cooldown_hours\`; **chỉ lượt hoàn thành cùng version** mới được tính; lượt bỏ qua hoặc bỏ dở (bắt đầu quá 30 phút chưa xong) không tính. **Compound index** \`{user_id, warmup_config_id, warmup_version, status, completed_at}\` phục vụ đúng truy vấn cooldown.
- **Trade-off:** thêm độ phức tạp cho dữ liệu attempt, đổi lại khi nội dung warm-up đổi thì học sinh được khởi động lại với nội dung mới.

### API \`complete\` idempotent, chấm điểm phía server

- **Lựa chọn:** \`complete\` gọi nhiều lần (mạng chập chờn, bấm lại) vẫn cho cùng kết quả, không tạo bản ghi trùng; điểm tính hoàn toàn ở server và **chỉ theo lần trả lời đầu tiên** — học sinh được thử lại để học nhưng không tính điểm, và không hiển thị đạt/trượt.

### Ra mắt theo phase, KPI định nghĩa trước

- **Lựa chọn:** phase 1 làm demo bằng dữ liệu mock, tái dùng engine mini-game có sẵn; phase 2 nối API thật qua lớp mapper TypeScript, lớp thu thập câu trả lời và fallback chấm điểm local. **KPI pilot** đặt trước khi ra mắt: tỷ lệ bắt đầu thi giảm không quá 5 điểm %, hoàn thành ≥ 50%, bỏ qua ≤ 40%, bỏ dở ≤ 10%; latency mục tiêu dưới 100ms cho \`decision\`, dưới 300ms cho \`complete\`.

### Giao bài theo phạm vi module sở hữu

- **Vấn đề:** giáo viên chỉ được giao những module SAT mình có quyền; admin cần chia sẻ đề cho giáo viên theo từng module, không bắt buộc cả đề.
- **Lựa chọn:** quyền giao bài gắn với module giáo viên sở hữu; hệ thống lọc câu hỏi theo module được giao và đồng bộ module của bài tập.`,
      },
      media: [],
      sortOrder: 6,
    },
    {
      type: "tradeoffs",
      title: null,
      body: {
        en: `- **Fail-open vs fail-closed** chosen per warm-up mode instead of one strategy for everything.
- **First attempt vs best attempt:** scoring the first answer reflects real ability, while retries still help learning.
- **localStorage for guests:** no barrier, but progress is tied to one browser.
- **Rule-based QA for AI translations:** cheap and fast, blind to wrong meanings.
- **Warm-up scope in phase 1** is IELTS Reading and Listening only; the roadmap extends it to lessons, the SAT and spaced repetition.`,
        vi: `- **Fail-open vs fail-closed** theo từng chế độ warm-up, thay vì một chiến lược cho tất cả.
- **Tính điểm lần đầu vs lần tốt nhất:** chọn lần đầu để điểm phản ánh trình độ thật, vẫn cho thử lại để học.
- **localStorage cho khách:** không rào cản, nhưng tiến độ gắn với một trình duyệt.
- **QA bằng rule cho bản dịch AI:** rẻ, nhanh, không bắt lỗi nghĩa.
- **Phạm vi warm-up giai đoạn 1** chỉ IELTS Reading & Listening; roadmap mở rộng sang bài học, SAT, spaced repetition.`,
      },
      media: [],
      sortOrder: 7,
    },
    {
      type: "implementation",
      title: null,
      body: {
        en: `- **Dictation experience:** Easy and Hard modes, progressive hints (reveal the correct start, mask the rest), playback speed control, global shortcuts (Enter to check and move on), shadowing that only appears after the transcript is revealed, text-to-speech with the Web Speech API (0.72× slow mode), and handling for mobile audio latency.
- **Dictation data:** the catalogue counts segments with a **MongoDB aggregation** and leaves out introductions ("Speaker 0"); a star-rating and feedback modal feeds the review system and notifies admins; dictation has its own event tracking.
- **Warm-up:** four game formats (match pairs, quick choice, fill in the blank, listen and choose) with instant right/wrong feedback; the API \`/api/v1/ielts/warmup/{decision,start,complete,skip}\` with proposed per-endpoint rate limits; feature tests for the decision logic and the attempt lifecycle; documentation covering business rules, the API contract, the database schema, a test guide and rollout phases; integration fixes for a missing \`configId\`, CSRF 419 errors and a fill-in-the-blank format mismatch.`,
        vi: `- **Trải nghiệm nghe chép:** chế độ Dễ / Khó, gợi ý tăng dần (hiện phần đầu đúng, che phần còn lại), chỉnh tốc độ phát, phím tắt toàn cục (Enter để kiểm tra / qua câu), phần shadowing chỉ hiện sau khi xem transcript, text-to-speech bằng Web Speech API (chế độ chậm 0,72×), xử lý độ trễ audio trên mobile.
- **Dữ liệu nghe chép:** catalog đếm segment bằng **MongoDB aggregation** và loại phần giới thiệu ("Speaker 0"); modal đánh giá sao và góp ý riêng, lưu vào hệ thống review và báo cho admin; event tracking riêng cho dictation.
- **Warm-up:** 4 dạng game (ghép cặp, chọn nhanh, điền chỗ trống, nghe và chọn), phản hồi đúng/sai ngay; API \`/api/v1/ielts/warmup/{decision,start,complete,skip}\` có đề xuất rate limit từng endpoint; feature test cho logic quyết định và vòng đời lượt chơi; bộ tài liệu business rules, API contract, database schema, hướng dẫn test và các phase triển khai; xử lý các lỗi tích hợp (thiếu \`configId\`, CSRF 419, lệch định dạng fill-blank).`,
      },
      media: [],
      sortOrder: 8,
    },
    {
      type: "results",
      title: null,
      body: {
        en: `- Runs in production on edly.vn for 3,200+ registered users.
- Dictation practice is free without sign-in, and every section is a search landing page with structured data.
- The warm-up shipped with written business rules, documentation and pilot KPIs.`,
        vi: `- Chạy production trên edly.vn (3.200+ người dùng đăng ký).
- Nghe chép chính tả: luyện miễn phí không cần đăng nhập, mỗi section là một trang SEO có structured data.
- Warm-up ra mắt với business rules, tài liệu và KPI pilot định sẵn.`,
      },
      media: [],
      sortOrder: 9,
    },
    {
      type: "learnings",
      title: null,
      body: {
        en: `- Turning existing assets into a new product is often far cheaper and faster than creating new content.
- For bulk AI generation, rule-based QA and a dry run before writing are not optional.
- Fail-open vs fail-closed is a business decision; writing business rules and KPIs before coding keeps everyone aligned.
- Idempotency and versioning belong in the first design, especially for scoring APIs.`,
        vi: `- Biến tài sản có sẵn thành sản phẩm mới thường rẻ và nhanh hơn nhiều so với tạo nội dung mới.
- Với AI sinh nội dung hàng loạt, QA bằng rule và chạy dry-run trước khi ghi là bắt buộc.
- Fail-open hay fail-closed là quyết định nghiệp vụ; viết business rules và KPI trước khi code giúp cả team thống nhất.
- Idempotency và versioning nên có ngay từ thiết kế đầu, nhất là với API chấm điểm.`,
      },
      media: [],
      sortOrder: 10,
    },
  ],
  "ai-slack-check": [
    {
      type: "context",
      title: null,
      body: {
        en: `Every morning a Slackbot posts three messages to the company attendance channel: **OFF** (day off), **LATE** (late arrival or early leave) and **REMOTE** (working remotely). Employees reply in each thread in free-form Vietnamese — with @mentions of their mentor, emoji and abbreviations: *"Anh @Thuận em xin về sớm lúc 17h15 vì có việc gia đình ạ"* ("leaving early at 17:15 for a family matter"), *"em đi muộn 15p kẹt xe"* ("15 minutes late, traffic jam"), *"em off chiều nay và ngày mai"* ("off this afternoon and tomorrow").

AI Slack Check is an internal tool I proposed at Protean Studios to turn those messages into structured attendance data for HR.`,
        vi: `Mỗi sáng, Slackbot đăng ba tin nhắn vào kênh điểm danh của công ty: **OFF** (nghỉ), **LATE** (đi muộn / về sớm) và **REMOTE** (làm từ xa). Nhân viên reply vào từng thread bằng tiếng Việt tự do — kèm @mention mentor, emoji và viết tắt: *"Anh @Thuận em xin về sớm lúc 17h15 vì có việc gia đình ạ"*, *"em đi muộn 15p kẹt xe"*, *"em off chiều nay và ngày mai"*.

AI Slack Check là internal tool tôi tự đề xuất tại Protean Studios để biến những tin nhắn này thành dữ liệu chấm công có cấu trúc cho bộ phận HR.`,
      },
      media: [],
      sortOrder: 1,
    },
    {
      type: "problem",
      title: null,
      body: {
        en: `HR read every thread by hand each day and re-typed it into the attendance sheet:

- Slow, error-prone and hard to roll up by month.
- Messages have no fixed format: one sentence can request several days, speak for several people, or blur "leaving early" with "taking the afternoon off".
- No number in a report could be traced back to the original message.`,
        vi: `HR phải đọc tay từng thread mỗi ngày rồi nhập lại vào bảng chấm công:

- Tốn thời gian, dễ sai, khó tổng hợp theo tháng.
- Tin nhắn không có định dạng cố định: một câu có thể xin nghỉ nhiều ngày, nói thay cho nhiều người, hoặc lẫn giữa "về sớm" và "nghỉ".
- Không có cách truy ngược một con số trong báo cáo về tin nhắn gốc.`,
      },
      media: [],
      sortOrder: 2,
    },
    {
      type: "responsibility",
      title: null,
      body: {
        en: `I built it alone end to end: requirements with HR, system design, the Fastify + TypeScript backend, the PostgreSQL database, the LLM prompts, the React dashboard for HR, tests, deployment and running it in production on Vercel, Railway and Supabase.`,
        vi: `Tôi làm một mình toàn bộ: phân tích yêu cầu cùng HR, thiết kế hệ thống, backend Fastify + TypeScript, database PostgreSQL, viết prompt cho LLM, frontend React cho HR, test, deploy và vận hành production trên Vercel, Railway và Supabase.`,
      },
      media: [],
      sortOrder: 3,
    },
    {
      type: "constraints",
      title: null,
      body: {
        en: `- **Free-form Vietnamese** with diacritics, abbreviations, emoji and Slack markup.
- **A wrong record means a wrong leave balance or payslip**, so the LLM could not be trusted blindly and HR had to be able to verify every entry.
- **Real data broke assumptions:** the bot did not post at 7 a.m. as designed (once at 12:50), and replies kept arriving after a thread had been processed.
- **Small budget and infrastructure:** Supabase free tier, Vercel Hobby and Railway Starter (~$5/month); Railway's proxy cuts long-running requests.
- **Slack display names** differ from official names and can change at any time.`,
        vi: `- **Ngôn ngữ tự nhiên tiếng Việt** không theo mẫu, có dấu, viết tắt, emoji và markup của Slack.
- **Sai một bản ghi là sai lương/phép** → không thể tin tuyệt đối vào LLM; HR phải kiểm tra được.
- **Dữ liệu thật lệch giả định:** Slackbot không đăng đúng 7h sáng như thiết kế ban đầu (có lúc 12h50), reply có thể tới sau khi thread đã xử lý.
- **Chi phí và hạ tầng nhỏ:** Supabase free tier, Vercel Hobby, Railway Starter (~$5/tháng); proxy của Railway cắt request chạy lâu.
- **Tên hiển thị Slack** khác tên chính thức và có thể đổi bất kỳ lúc nào.`,
      },
      media: [],
      sortOrder: 4,
    },
    {
      type: "architecture",
      title: null,
      body: {
        en: `- The **Fastify backend** is layered — \`SlackService → PreprocessService → LLMService → AttendanceService\`, orchestrated by \`DailyCollectorJob\` — plus \`RosterService\`, \`ReportService\`, \`CalendarService\` and \`AlertService\`.
- **Scheduling:** \`node-cron\` runs every 30 minutes from 8:00 to 16:30, Monday to Friday (18 runs a day). HR can also trigger a day manually, reprocess a day, or sync a date range.
- **Database:** \`bot_messages\` (threads and sync state), \`raw_slack_data\` (original messages), \`attendance_logs\` (attendance records), \`employee_roster\`, \`failed_processing\` and \`hr_users\`.
- The **React frontend** (seven pages) is on Vercel; \`vercel.json\` rewrites \`/api/*\` to the Railway backend, so the browser calls the API on the same origin with no CORS setup.`,
        vi: `- **Backend Fastify** tổ chức theo layer: \`SlackService → PreprocessService → LLMService → AttendanceService\`, điều phối bởi \`DailyCollectorJob\`; thêm \`RosterService\`, \`ReportService\`, \`CalendarService\`, \`AlertService\`.
- **Lịch chạy:** \`node-cron\` mỗi 30 phút từ 8h đến 16h30, thứ 2 – thứ 6 (18 lượt/ngày); HR kích hoạt tay một ngày, xử lý lại một ngày, hoặc sync theo khoảng ngày.
- **Database:** \`bot_messages\` (thread + trạng thái sync), \`raw_slack_data\` (tin nhắn gốc), \`attendance_logs\` (dữ liệu chấm công), \`employee_roster\`, \`failed_processing\`, \`hr_users\`.
- **Frontend React** 7 trang trên Vercel; \`vercel.json\` rewrite \`/api/*\` sang backend Railway để frontend gọi API cùng origin, không vướng CORS.`,
      },
      media: [
        {
          src: "/images/projects/ai-slack-check/architecture.svg",
          alt: {
            en: `Diagram: Slack threads are collected every 30 minutes, preprocessed with Vietnamese rules, extracted by Claude one message at a time and validated, then upserted into PostgreSQL with review flags and shown on the HR dashboard; failures go to failed_processing and are surfaced to HR.`,
            vi: `Sơ đồ: thread Slack được thu thập mỗi 30 phút, tiền xử lý bằng rule tiếng Việt, Claude trích xuất từng tin nhắn một và được validate, rồi upsert vào PostgreSQL kèm cờ review và hiển thị trên dashboard HR; lỗi được ghi vào failed_processing và hiển thị cho HR.`,
          },
          width: 960,
          height: 420,
        },
      ],
      sortOrder: 5,
    },
    {
      type: "decisions",
      title: null,
      body: {
        en: `### Rules for what must be exact, the LLM for meaning

- **Problem:** the LLM miscalculated minutes from "leaving at 17:15", and spent tokens on messages that were not requests at all.
- **Decision:** Vietnamese preprocessing with rules before any LLM call:
  - Strip Slack markup (mentions, URLs, emoji codes and Unicode emoji, \`<!here>\`…).
  - **Filter out non-requests:** bot reminders, managers' confirmations, "ok em", "vâng", "thanks".
  - Regexes extract early-leave times (\`lúc 17h15\`, \`về 5 chiều\`, \`5pm\`…) and convert them with \`minutes early = 18:00 − leave time\`; "1 tiếng rưỡi" (an hour and a half) becomes 90.
  - Append a **\`[X phút]\`** ("X minutes") hint to the text sent to the LLM: regexes compute the number, the LLM only classifies.
- **Why:** arithmetic needs certainty; only intent needs a language model.
- **Trade-off:** a Vietnamese regex set to maintain (for example \`[^\\d]*\` instead of a whitespace class, so it matches accented letters such as "ớ" in "sớm").

### One message, one LLM call

- **Problem:** sending a whole thread in one call made the LLM mix reasons and names between employees.
- **Decision:** one call per message, with results mapped back to the sender by **Slack \`ts\`** (unique and stable) and a fallback on accent-stripped names.
- **Trade-off:** more calls, run sequentially, so slower — acceptable for one channel's volume, and the noise filter cuts the number of calls.

### A prompt per thread type

- **Decision:** a short, fixed system prompt (skip rules, date rules, confidence scale, JSON only) and a **separate user prompt for OFF, LATE and REMOTE** with keywords, an IF → THEN decision tree and **few-shot examples** with their exact JSON output; \`temperature = 0.1\`.
- Hard cases covered: early leave belongs to LATE, not OFF; **multi-day leave** ("off from the 5th to the 9th" → five records); one message covering several people; a reason only comes from that person's own message.

### Treat LLM output as untrusted input

- **Decision:**
  - A tolerant parser that reads JSON inside code fences, plain JSON and **truncated JSON** (cut back to the last valid \`}\` or \`]\`).
  - Field-by-field validation: confidence clamped to [0, 1], dates normalised (\`YYYY-MM-DD\`, \`D/M\`, "today", "tomorrow"), impossible dates (31 April) dropped, duplicates removed by name + date + session, results below 0.2 confidence discarded.
  - Up to three retries per message when the API fails or the JSON is invalid.

### Human in the loop instead of full automation

- **Decision:** records are flagged \`needs_review\` with a reason when confidence is below 0.8, a LATE record has no minutes, or the employee is not in the roster. Every record on the dashboard opens a **panel with that person's original Slack message**; HR clears flags one by one or per day and can mark a message invalid. Thread failures, and cases where "the LLM returned nothing although there were valid messages", go to \`failed_processing\` with a likely cause.
- **Why:** HR owns the final attendance data; the system's job is to surface exactly the records worth checking.

### Incremental sync and idempotent writes

- **Problem:** late replies were missed, and reruns must not create duplicates or call the LLM again.
- **Decision:** threads are recognised by **content**, not posting time, within a 06:50–23:59 window; every run re-reads all threads and compares \`reply_ts\` with \`last_reply_ts\` to **process only new replies**; \`attendance_logs\` is upserted on \`(employee_slack_id, date, type, duration)\` with \`RETURNING (xmax = 0)\` to count inserts versus updates. Because the key includes \`duration\`, one person can be OFF in the afternoon and REMOTE in the morning of the same day.

### Identity by Slack ID, not by name

- **Decision:** \`employee_roster\` is keyed by \`slack_id\`; channel members are synced from Slack (cursor pagination, bots and deleted accounts excluded), HR assigns official names one by one or in bulk, and Vietnamese names are normalised (Unicode NFD, accents stripped, lowercase). Once assigned, mapping employees never depends on the LLM's judgement.

### SSE for long jobs behind a proxy

- **Problem:** syncing 31 days was cut off by Railway's proxy timeout.
- **Decision:** process **three days in parallel** (\`Promise.allSettled\`, so one failed day does not sink the batch) and **stream progress with Server-Sent Events** (\`X-Accel-Buffering: no\`). The frontend reads the stream with \`fetch\` + \`ReadableStream\`, because \`EventSource\` cannot send a POST with a JWT header.`,
        vi: `### Rule-based cho phần chắc chắn, LLM cho phần ngữ nghĩa

- **Vấn đề:** LLM tính sai số phút từ "về lúc 17h15", và tốn token cho cả những tin nhắn không phải yêu cầu.
- **Lựa chọn:** tiền xử lý tiếng Việt bằng rule trước khi gọi LLM:
  - Làm sạch markup Slack (mention, URL, emoji code và emoji unicode, \`<!here>\`…).
  - **Lọc tin nhắn không phải yêu cầu**: reminder của bot, câu xác nhận của quản lý, "ok em", "vâng", "thanks".
  - Regex trích giờ về sớm (\`lúc 17h15\`, \`về 5 chiều\`, \`5pm\`…) và quy đổi \`phút về sớm = 18:00 − giờ về\`; "1 tiếng rưỡi" → 90.
  - Gắn hint **\`[X phút]\`** vào text gửi LLM: con số do regex tính, LLM chỉ lo phân loại.
- **Lý do:** phần tính toán cần kết quả chắc chắn; phần hiểu ý định mới cần LLM.
- **Trade-off:** phải bảo trì bộ regex tiếng Việt (ví dụ dùng \`[^\\d]*\` để khớp được chữ có dấu như "sớm").

### Một tin nhắn, một lần gọi LLM

- **Vấn đề:** gửi cả thread trong một lần gọi, LLM trộn lý do và tên giữa các nhân viên.
- **Lựa chọn:** mỗi tin nhắn một lần gọi; map kết quả về người gửi theo **Slack \`ts\`** (duy nhất, ổn định), fallback so tên đã bỏ dấu.
- **Trade-off:** nhiều lần gọi hơn, chạy tuần tự nên chậm hơn — chấp nhận được với khối lượng một kênh và nhờ bước lọc nhiễu giảm số lần gọi.

### Prompt riêng cho từng loại thread

- **Lựa chọn:** system prompt ngắn, cố định (luật bỏ qua, luật ngày tháng, thang confidence, chỉ trả JSON); user prompt **riêng cho OFF / LATE / REMOTE** với từ khoá, cây quyết định IF → THEN và **few-shot examples** kèm JSON đầu ra; \`temperature = 0.1\`.
- Xử lý ca khó: "về sớm" thuộc LATE chứ không phải OFF; **nghỉ nhiều ngày** ("off từ ngày 5 đến 9" → 5 bản ghi); một tin nhắn cho nhiều người; lý do chỉ lấy từ tin nhắn của chính người đó.

### Output của LLM là dữ liệu không đáng tin

- **Lựa chọn:**
  - Parser chịu lỗi: lấy được JSON trong code fence, JSON thuần và **JSON bị cắt cụt** (cắt tới dấu \`}\` / \`]\` hợp lệ cuối cùng).
  - Validate từng field, giới hạn confidence trong [0, 1], chuẩn hoá ngày (\`YYYY-MM-DD\`, \`D/M\`, "hôm nay", "ngày mai"), loại ngày không tồn tại (31/04), khử trùng lặp theo tên + ngày + buổi, bỏ kết quả confidence < 0.2.
  - Retry tối đa 3 lần cho mỗi tin nhắn khi API lỗi hoặc JSON không hợp lệ.

### Human-in-the-loop thay vì tự động 100%

- **Lựa chọn:** tự gắn cờ \`needs_review\` kèm lý do khi confidence < 0.8, bản ghi LATE thiếu số phút, hoặc không tìm thấy nhân viên trong roster. Mỗi bản ghi trên dashboard mở được **panel tin nhắn Slack gốc** của đúng người đó; HR gỡ cờ từng bản ghi hoặc theo ngày, đánh dấu tin nhắn không hợp lệ. Lỗi xử lý thread và trường hợp "LLM trả rỗng dù có tin nhắn hợp lệ" ghi vào \`failed_processing\` kèm gợi ý nguyên nhân.
- **Lý do:** HR chịu trách nhiệm cuối cùng với dữ liệu chấm công; hệ thống chỉ cần đưa đúng những bản ghi đáng nghi lên trước.

### Sync tăng dần và ghi idempotent

- **Vấn đề:** reply tới muộn bị bỏ sót; chạy lại không được tạo bản ghi trùng hay gọi lại LLM.
- **Lựa chọn:** nhận diện thread theo **nội dung** (không theo giờ đăng), quét khung 06:50–23:59; luôn đọc lại mọi thread và so \`reply_ts\` với \`last_reply_ts\` để **chỉ xử lý reply mới**; upsert \`attendance_logs\` với khoá \`(employee_slack_id, date, type, duration)\` và \`RETURNING (xmax = 0)\` để đếm thêm mới / cập nhật. Khoá có \`duration\` nên một người vẫn có thể vừa OFF buổi chiều vừa REMOTE buổi sáng.

### Định danh bằng Slack ID, không bằng tên

- **Lựa chọn:** \`employee_roster\` lấy \`slack_id\` làm khoá; đồng bộ thành viên kênh từ Slack (phân trang cursor, loại bot / tài khoản đã xoá), HR gán tên chuẩn hoặc import hàng loạt; tên tiếng Việt chuẩn hoá (Unicode NFD, bỏ dấu, lowercase). Sau khi gán, việc map nhân viên không phụ thuộc phán đoán của LLM.

### SSE cho tác vụ dài sau proxy

- **Vấn đề:** sync 31 ngày bị proxy của Railway cắt do timeout.
- **Lựa chọn:** chạy **3 ngày song song** (\`Promise.allSettled\`, một ngày lỗi không hỏng cả lô) và **stream tiến độ bằng Server-Sent Events** (\`X-Accel-Buffering: no\`). Frontend đọc bằng \`fetch\` + \`ReadableStream\` vì \`EventSource\` không gửi được POST kèm header JWT.`,
      },
      media: [],
      sortOrder: 6,
    },
    {
      type: "tradeoffs",
      title: null,
      body: {
        en: `- **Sequential LLM calls per message:** correct and easy to debug, but slower; the way forward is bounded parallelism, prompt caching or a batch API.
- **node-cron inside the process:** simple for a single instance, not suited to horizontal scaling.
- **Plain SQL with \`pg\`, no ORM:** full control of queries (\`COUNT(*) FILTER\`, upserts, partial indexes), at the cost of writing my own migration runner.
- **An \`LLMProvider\` interface** (Anthropic SDK or an OpenAI-compatible endpoint) switchable by environment variable — a small abstraction that let me test against a cheaper proxy without code changes.
- Some values are still fixed (18:00 end of day) — fine for one company, configurable if it were used more widely.`,
        vi: `- **Gọi LLM tuần tự từng tin nhắn:** đúng và dễ debug, đổi lại chậm hơn; hướng mở rộng là chạy song song có giới hạn, prompt caching hoặc batch API.
- **node-cron trong process:** đơn giản cho một instance, không phù hợp nếu scale ngang.
- **SQL thuần với \`pg\`, không ORM:** kiểm soát truy vấn (\`COUNT(*) FILTER\`, upsert, partial index), đổi lại tự viết migration runner.
- **Tách interface \`LLMProvider\`** (Anthropic SDK / OpenAI-compatible) để đổi provider bằng biến môi trường — thêm một lớp trừu tượng nhỏ, đổi lại test được với proxy rẻ hơn mà không sửa code.
- Một số giá trị còn cố định (giờ tan làm 18:00) — đủ cho một công ty, cần cấu hình nếu dùng rộng hơn.`,
      },
      media: [],
      sortOrder: 7,
    },
    {
      type: "implementation",
      title: null,
      body: {
        en: `- **Slack:** three retries with 1–30 s exponential backoff and jitter; the bot joins channels itself; user profiles cached in memory (5-minute TTL); @mentions parsed in both \`<@U123|Name>\` and \`<@U123>\` forms and stored as the request's mentors; a fix for parent messages being skipped, using \`thread_ts !== ts\` — found while testing with real data.
- **Performance:** the roster loads once per run into a \`Map\` (O(1) lookups) instead of one query per record.
- **Reports for HR:** monthly roll-ups with \`COUNT(*) FILTER (WHERE …)\`; a **calendar-style attendance matrix** (employees × days, each cell showing OFF / LATE / REMOTE at once); most-late rankings and 7-day trends; CSV export by any filter. Every filter uses parameterised queries.
- **Seven-page dashboard:** KPIs, Recharts charts, daily detail with the original messages, monthly roll-ups, the attendance matrix, employee management synced from Slack, and failures; a shared \`FilterBar\` with debounce; a typed API client.
- **Database:** a custom migration runner; the schema evolved over eight migrations — a partial index \`WHERE needs_review = TRUE\`, **removing duplicates before adding a unique constraint**, and moving from the old \`employees\` table to \`employee_roster\`.
- **Operations:** multi-stage Docker builds; a three-service Docker Compose setup for local work (Postgres with a health check that runs migrations on start); DB and Slack checks at startup, \`/api/health\`, graceful shutdown, structured logs with pino; continuous deployment from GitHub across eight pull requests.
- **Tests:** 32 unit tests (19 for preprocessing, 13 for timezone handling) with fixtures from real Slack messages.`,
        vi: `- **Slack:** retry 3 lần với exponential backoff 1s–30s có jitter; bot tự \`conversations.join\`; cache profile người dùng trong bộ nhớ (TTL 5 phút); parse @mention cả \`<@U123|Tên>\` và \`<@U123>\` và lưu thành danh sách mentor; sửa lỗi bỏ nhầm tin nhắn cha bằng điều kiện \`thread_ts !== ts\` — phát hiện khi chạy thử với dữ liệu thật.
- **Hiệu năng:** nạp roster một lần mỗi lượt chạy vào \`Map\` (tra cứu O(1)) thay vì truy vấn cho từng bản ghi.
- **Báo cáo cho HR:** tổng hợp tháng bằng \`COUNT(*) FILTER (WHERE …)\`; **bảng chấm công dạng lịch** (nhân viên × ngày, mỗi ô thể hiện cùng lúc OFF / LATE / REMOTE); top đi muộn, xu hướng 7 ngày; xuất CSV theo bộ lọc. Mọi bộ lọc dùng truy vấn có tham số.
- **Dashboard 7 trang:** thống kê, biểu đồ Recharts, chi tiết hằng ngày có xem tin nhắn gốc, tổng hợp tháng, bảng chấm công, quản lý nhân viên đồng bộ từ Slack, danh sách lỗi; \`FilterBar\` dùng chung có debounce; API client typed.
- **Database:** tự viết migration runner; schema tiến hoá qua 8 migration — thêm partial index \`WHERE needs_review = TRUE\`, **xoá bản ghi trùng rồi mới thêm unique constraint**, chuyển bảng \`employees\` cũ sang \`employee_roster\`.
- **Vận hành:** Docker multi-stage; Docker Compose 3 service cho local (postgres có healthcheck, tự chạy migration); kiểm tra DB + Slack lúc khởi động, \`/api/health\`, graceful shutdown, log có cấu trúc bằng pino; auto-deploy từ GitHub qua 8 PR.
- **Test:** 32 unit test (tiền xử lý 19, timezone 13) với fixture tin nhắn Slack thật.`,
      },
      media: [],
      sortOrder: 8,
    },
    {
      type: "results",
      title: null,
      body: {
        en: `- Ran in production on Vercel, Railway and Supabase for about $5 a month in infrastructure.
- HR no longer read and re-typed every thread; monthly reports per employee exported in one click.
- Every attendance record traced back to its original Slack message, and suspicious records surfaced for review automatically.
- The tool was retired in May 2026.`,
        vi: `- Chạy production trên Vercel, Railway và Supabase với chi phí hạ tầng khoảng $5/tháng.
- HR không còn đọc tay và nhập lại từng thread; báo cáo tháng theo nhân viên xuất bằng một click.
- Mọi bản ghi chấm công truy được về tin nhắn Slack gốc; bản ghi đáng nghi tự lên danh sách cần review.
- Ngừng vận hành từ 05/2026.`,
      },
      media: [],
      sortOrder: 9,
    },
    {
      type: "learnings",
      title: null,
      body: {
        en: `- Run on real data as early as possible: the bot's posting time, the parent/child thread structure and late replies all differed from the initial assumptions.
- Give the parts that must be **exact** (minutes, dates) to rules and the parts that need **understanding** to the LLM — more accurate and cheaper.
- Treat LLM output like user input: parse defensively, validate, normalise, and always keep the source data for comparison.
- Idempotency and the ability to reprocess (rerun a day, backfill a range) have to exist from day one in any scheduled pipeline.`,
        vi: `- Chạy với dữ liệu thật càng sớm càng tốt: giờ đăng của bot, cấu trúc thread cha/con và reply đến muộn đều khác giả định ban đầu.
- Tách phần cần **chính xác** (tính phút, ngày tháng) cho rule, phần cần **hiểu ngữ nghĩa** cho LLM — vừa đúng hơn vừa rẻ hơn.
- Coi output của LLM như input từ người dùng: parse chịu lỗi, validate, chuẩn hoá và luôn giữ dữ liệu gốc để đối chiếu.
- Idempotency và khả năng xử lý lại (reprocess, sync khoảng ngày) phải có từ đầu với mọi pipeline chạy theo lịch.`,
      },
      media: [],
      sortOrder: 10,
    },
  ],
  benerio: [
    {
      type: "context",
      title: null,
      body: {
        en: `Benerio is a multi-tenant B2B SaaS for the Japanese market that lets businesses with many locations manage their **Google Business Profile** listings and **Instagram / Facebook / Threads** accounts from one dashboard, with AI built in. Services run on the platform as separate modules: GBP Manager, SNS Manager, a tool that lets partner agencies manage many clients, and a few industry-specific modules.

It is built with Next.js 14 (App Router), TypeScript and Supabase, deployed on Vercel, with a Japanese interface and business content in Japanese, English and Chinese. It is a large codebase developed by about fifteen people since late 2024. I worked on Benerio at Protean Studios from June to December 2025.`,
        vi: `Benerio là nền tảng SaaS B2B multi-tenant cho thị trường Nhật Bản, giúp doanh nghiệp có nhiều chi nhánh quản lý hồ sơ **Google Business Profile** và tài khoản **Instagram / Facebook / Threads** từ một bảng điều khiển, có tích hợp AI. Các dịch vụ chạy trên nền tảng như những module riêng: GBP Manager, SNS Manager, công cụ cho agency đối tác quản lý hộ nhiều khách hàng, và một số module theo ngành.

Hệ thống dùng Next.js 14 (App Router) + TypeScript + Supabase, triển khai trên Vercel, giao diện tiếng Nhật và nội dung doanh nghiệp Nhật / Anh / Trung. Đây là một codebase lớn do khoảng 15 người cùng phát triển từ cuối 2024. Tôi làm việc trên Benerio tại Protean Studios từ tháng 6 đến tháng 12/2025.`,
      },
      media: [],
      sortOrder: 1,
    },
    {
      type: "problem",
      title: null,
      body: {
        en: `- Multi-location businesses had to post, reply to reviews, update details and track metrics **on every Google profile and every social account separately**.
- Agencies managing many clients needed to do the same **across all their clients**, but only on the locations assigned to them.
- The platform had to isolate each company's data, enforce permissions per company and per location, and charge by plan and usage.`,
        vi: `- Doanh nghiệp nhiều chi nhánh phải đăng bài, trả lời đánh giá, cập nhật thông tin và theo dõi số liệu **trên từng hồ sơ Google và từng tài khoản mạng xã hội riêng lẻ**.
- Agency quản lý hộ nhiều khách hàng cần làm cùng những việc đó cho **tất cả khách hàng** của mình, nhưng chỉ trên những chi nhánh được giao.
- Nền tảng phải cách ly dữ liệu của từng công ty, phân quyền theo công ty và theo chi nhánh, và tính phí theo gói dịch vụ và mức sử dụng.`,
      },
      media: [],
      sortOrder: 2,
    },
    {
      type: "responsibility",
      title: null,
      body: {
        en: `I worked full stack across every layer: PostgreSQL migrations and Row Level Security, server-side API routes and React interfaces. Four main areas:

- **GBP Manager:** business information editing, review management, scheduled posts, analytics and PDF reports, AI translation, sync jobs.
- **Partner agency tool:** client management, GBP posts with drafts and scheduling, failed-post handling, media management.
- **Plans and usage:** Google accounts bound to plans, per-location permissions, RLS for agency-supported locations.
- **Google sync:** the OAuth flow for linking and unlinking GBP, plus syncing posts and reviews.

In 2025: 619 commits (459 code commits), 59 merged pull requests and about 60 feedback tickets from Japanese clients — through feature branches, pull requests and code review, communicating in English and Japanese.`,
        vi: `Tôi làm Full-stack trên toàn bộ tầng: migration và Row Level Security trong PostgreSQL, API route phía server và giao diện React. Bốn mảng chính:

- **GBP Manager:** chỉnh sửa thông tin doanh nghiệp, quản lý review, bài đăng có lên lịch, phân tích và báo cáo PDF, dịch bằng AI, cron đồng bộ.
- **Công cụ cho agency đối tác:** quản lý khách hàng, đăng bài GBP có nháp và lên lịch, xử lý bài lỗi, quản lý media.
- **Gói dịch vụ và mức sử dụng:** tài khoản Google gắn theo gói, phân quyền theo từng chi nhánh, RLS cho chi nhánh được agency hỗ trợ.
- **Đồng bộ với Google:** luồng OAuth liên kết / gỡ liên kết GBP, đồng bộ bài đăng và review.

Trong năm 2025: 619 commit (459 commit code), 59 pull request đã merge và khoảng 60 ticket phản hồi từ khách hàng Nhật — làm theo quy trình feature branch, pull request và code review, giao tiếp bằng tiếng Anh và tiếng Nhật.`,
      },
      media: [],
      sortOrder: 3,
    },
    {
      type: "constraints",
      title: null,
      body: {
        en: `- **A large shared codebase** (~185,000 lines of TypeScript): every change had to follow the existing module architecture and migration process.
- **Isolation had to hold even if app code was wrong:** one company must never see another company's data.
- **Agencies act on behalf of clients:** access has to cross tenants, but only for the locations they support.
- **External APIs:** Google OAuth tokens expire, APIs have quotas and rate limits, and data on Google can be edited or deleted outside the system.
- **Japanese clients** reported issues as numbered tickets; three environments (local, staging, production), with a manual confirmation step for production deploys.`,
        vi: `- **Codebase lớn, nhiều người cùng sửa** (~185.000 dòng TypeScript): mọi thay đổi phải theo kiến trúc module và quy trình migration có sẵn.
- **Cách ly dữ liệu phải đúng ngay cả khi code phía app sai:** một công ty không bao giờ được thấy dữ liệu của công ty khác.
- **Agency làm việc thay khách hàng:** quyền phải đi xuyên tenant nhưng chỉ trong phạm vi chi nhánh được hỗ trợ.
- **API bên ngoài:** token OAuth của Google hết hạn, có quota và rate limit; dữ liệu trên Google có thể bị sửa hoặc xoá ngoài hệ thống.
- **Khách hàng Nhật** gửi phản hồi theo ticket đánh số; ba môi trường local / staging / production, production cần xác nhận tay khi deploy.`,
      },
      media: [],
      sortOrder: 4,
    },
    {
      type: "architecture",
      title: null,
      body: {
        en: `- **Next.js 14 on Vercel is the only middle layer:** users and cron jobs both pass through it before touching Supabase or the Google, Meta and LLM provider APIs.
- **Services are plugins** (built by the platform team): each module declares its routes in a \`manifest.json\`, and one catch-all route loads a module only when that service is enabled for the company.
- **Data is hierarchical — Company → Location → User;** one user can belong to several companies with different permission groups. Integration settings live in a service catalogue and a table of services enabled per company.
- **Protection lives in the database:** 71 tables, 144 RLS policies and 73 PostgreSQL functions isolate data by company and permission group.
- **Background work:** 10 Vercel cron jobs — scheduled posts every 5 minutes, daily and weekly GBP and social metrics sync.

In the diagram, the highlighted blocks are the parts I built directly; the rest is the platform the team built.`,
        vi: `- **Next.js 14 trên Vercel là lớp trung gian duy nhất:** người dùng và cron job đều đi qua nó trước khi chạm Supabase hoặc API của Google, Meta và các nhà cung cấp LLM.
- **Dịch vụ là plugin** (do nền tảng xây): mỗi module khai báo route trong \`manifest.json\`; một catch-all route chỉ nạp module khi dịch vụ đó được bật cho công ty.
- **Dữ liệu phân cấp Công ty → Chi nhánh → Người dùng;** một người có thể thuộc nhiều công ty với nhóm quyền khác nhau. Cấu hình tích hợp nằm ở danh mục dịch vụ và bảng dịch vụ được bật cho từng công ty.
- **Bảo vệ ở tầng database:** 71 bảng, 144 RLS policy và 73 hàm PostgreSQL cách ly dữ liệu theo công ty và nhóm quyền.
- **Tác vụ nền:** 10 Vercel cron job — đăng bài đã lên lịch mỗi 5 phút, đồng bộ số liệu GBP và SNS hằng ngày / hằng tuần.

Trong sơ đồ, các khối được tô màu là phần tôi trực tiếp xây dựng; phần còn lại là nền tảng do cả đội phát triển.`,
      },
      media: [
        {
          src: "/images/projects/benerio/architecture.svg",
          alt: {
            en: `Diagram: owners, staff and agencies use a Next.js 14 app on Vercel whose service loader enables modules per company. Highlighted as built by me: the GBP Manager (business info, reviews, posts, analytics and PDF reports), the agency tool (drafts, schedules, media) and plans with per-location access and RLS. Vercel Cron triggers scheduled posts and sync; data lives in Supabase Postgres with 71 tables and 144 RLS policies; the modules talk to the Google Business Profile API, Meta and LLM providers.`,
            vi: `Sơ đồ: chủ doanh nghiệp, nhân viên và agency dùng ứng dụng Next.js 14 trên Vercel, service loader bật module theo từng công ty. Phần tôi xây dựng được tô màu: GBP Manager (thông tin doanh nghiệp, review, bài đăng, phân tích và báo cáo PDF), công cụ cho agency (nháp, lên lịch, media) và gói dịch vụ kèm phân quyền theo chi nhánh và RLS. Vercel Cron chạy đăng bài theo lịch và đồng bộ; dữ liệu nằm trong Supabase Postgres với 71 bảng và 144 RLS policy; các module gọi Google Business Profile API, Meta và nhà cung cấp LLM.`,
          },
          width: 960,
          height: 430,
        },
      ],
      sortOrder: 5,
    },
    {
      type: "decisions",
      title: null,
      body: {
        en: `### Plans and usage live in the data model

- **Problem:** linked Google and social accounts must count against the active plan, and features should only open for locations on a suitable plan.
- **Decision:** an \`integrated_service_usage\` model that binds each linked account to the active plan; flows to link and unlink GBP accounts per plan; a per-location plan check before a feature runs; an RPC function that disconnects a service in a single call; a page that tracks AI usage.
- **Why:** plan limits are enforced in data, not by whether the UI hides a button.
- **Trade-off:** more checks whenever a feature opens, and unlinking has to clean up consistently.

### Two permission layers: the UI for experience, the database for security

- **Decision:** access granted per location for each user; a frontend permission hook that shows or hides sidebar items and actions; **RLS** in PostgreSQL as the real barrier.
- **Why:** UI checks keep users from seeing actions they cannot take; RLS makes sure an app-level bug still cannot leak data.
- **Trade-off:** both layers have to encode the same rules.

### RLS for agency-supported locations

- **Problem:** agencies need to work on their clients' locations — which means crossing tenants.
- **Decision:** RLS policies that grant access only to supported locations, together with an agency client-management page and an access-transfer flow.
- **Why:** the agency model keeps the isolation guarantee at the database level.

### Syncing posts with Google: upsert and clean up deletions

- **Problem:** posts can be created, edited or deleted directly on Google, outside the system.
- **Decision:** a sync job that **upserts** posts from Google and **deletes local posts that no longer exist on Google**, tied to the client's plan.
- **Why:** reruns never create duplicates, and no "ghost" posts linger in the system.

### A clear post lifecycle for agencies

- **Decision:** GBP posts move through draft → scheduled → published / CANCELLED / failed, with failed-post handling, media stored in Supabase Storage, and CRUD for keywords, hashtags and post templates.
- **Why:** agencies prepare content ahead for many clients and need to see at once which posts did not go out.

### Fit the existing architecture

- **Decision:** move the GBP APIs into the service module, following the plugin architecture; route every database change through migrations and regenerate the TypeScript types from the schema.
- **Why:** in a codebase many people change, new features must not break core routing or let DB and code types drift apart.`,
        vi: `### Gói dịch vụ và mức sử dụng nằm trong mô hình dữ liệu

- **Vấn đề:** tài khoản Google / mạng xã hội mà khách liên kết phải được tính theo gói đang dùng, và tính năng chỉ mở khi chi nhánh có gói phù hợp.
- **Lựa chọn:** mô hình \`integrated_service_usage\` gắn từng tài khoản đã liên kết vào gói đang dùng; luồng gắn / gỡ tài khoản GBP theo gói; kiểm tra gói theo chi nhánh trước khi dùng tính năng; hàm RPC để ngắt kết nối dịch vụ gọn trong một lần gọi; trang theo dõi mức dùng AI.
- **Lý do:** giới hạn của gói được áp ở dữ liệu, không phụ thuộc giao diện có ẩn nút hay không.
- **Trade-off:** nhiều bước kiểm tra hơn mỗi khi mở tính năng, và việc gỡ liên kết phải dọn dữ liệu nhất quán.

### Hai lớp phân quyền: giao diện cho trải nghiệm, database cho bảo mật

- **Lựa chọn:** quyền truy cập theo từng chi nhánh cho mỗi người dùng; một hook kiểm tra quyền phía frontend để ẩn / hiện sidebar và thao tác; còn **RLS** trong PostgreSQL là lớp chặn thật.
- **Lý do:** kiểm tra phía giao diện giúp người dùng không thấy thao tác họ không được làm; RLS đảm bảo lỗi ở tầng app cũng không làm lộ dữ liệu.
- **Trade-off:** hai lớp phải giữ cùng một quy tắc.

### RLS cho chi nhánh được agency hỗ trợ

- **Vấn đề:** agency cần thao tác trên chi nhánh của khách hàng — tức là đi xuyên tenant.
- **Lựa chọn:** RLS policy chỉ cấp quyền trên những chi nhánh được hỗ trợ, kèm trang quản lý khách hàng của agency và luồng chuyển quyền truy cập.
- **Lý do:** mô hình agency vẫn giữ được nguyên tắc cách ly ở tầng database.

### Đồng bộ bài đăng với Google: upsert và dọn bài đã bị xoá

- **Vấn đề:** bài đăng có thể được tạo, sửa hoặc xoá trực tiếp trên Google, ngoài hệ thống.
- **Lựa chọn:** cron đồng bộ **upsert** bài đăng từ Google và **xoá bài không còn tồn tại trên Google**; gắn cron với gói dịch vụ.
- **Lý do:** chạy lại bao nhiêu lần cũng không tạo bản trùng, và không còn "bài ma" trong hệ thống.

### Vòng đời bài đăng rõ ràng cho agency

- **Lựa chọn:** bài GBP có các trạng thái nháp → lên lịch → đã đăng / CANCELLED / lỗi, có xử lý bài đăng lỗi, media lưu trên Supabase Storage, cùng CRUD từ khoá, hashtag và mẫu bài đăng.
- **Lý do:** agency chuẩn bị nội dung trước cho nhiều khách hàng và cần thấy ngay bài nào chưa đăng được.

### Đi theo kiến trúc sẵn có

- **Lựa chọn:** refactor các API GBP vào module dịch vụ theo kiến trúc plugin; mọi thay đổi database đi qua migration và sinh lại TypeScript types từ schema.
- **Lý do:** trong codebase nhiều người cùng làm, thêm tính năng không được làm hỏng routing lõi hay lệch kiểu dữ liệu giữa DB và code.`,
      },
      media: [],
      sortOrder: 6,
    },
    {
      type: "tradeoffs",
      title: null,
      body: {
        en: `- **Two permission layers** (UI + RLS): good experience and safety, at the cost of rules living in two places.
- **Cron-based sync** instead of webhooks: simple and easy to rerun, at the cost of data lagging until the next run.
- **Plan limits enforced in data:** more reliable, at the cost of an extra check on every action.
- **A large team codebase:** following the existing architecture and review process is slower than working alone, in return for a consistent system.`,
        vi: `- **Hai lớp phân quyền** (giao diện + RLS): trải nghiệm tốt và an toàn, đổi lại quy tắc bị lặp ở hai nơi.
- **Đồng bộ bằng cron** thay vì webhook: đơn giản và dễ chạy lại, đổi lại dữ liệu có độ trễ tới lần chạy kế tiếp.
- **Giới hạn gói áp ở dữ liệu:** chắc chắn hơn, đổi lại thêm kiểm tra cho mỗi thao tác.
- **Codebase lớn của cả đội:** đi theo kiến trúc và quy trình review có sẵn chậm hơn làm riêng, đổi lại hệ thống nhất quán.`,
      },
      media: [],
      sortOrder: 7,
    },
    {
      type: "implementation",
      title: null,
      body: {
        en: `- **GBP business information:** sub-categories, address, service area and opening hours; review management with listing, filtering, replies, reply deletion and review sync.
- **GBP posts:** a post screen with image upload and cancelling or deleting scheduled posts; AI translation of content.
- **Analytics and reports:** top search keywords, review counts, star rating and map pin; report settings and PDF export (logo, keyword table).
- **Shared platform pieces:** a company and location picker, file uploads to Supabase Storage, the integrated-service detail screen, and shared support modules for the agency tools.
- **Google integration:** the GBP OAuth flow, account linking and unlinking, and logging of Google API errors.
- **Database:** my own migrations (new columns, dropped unique constraints, RLS, RPC functions) and regenerated TypeScript types.
- **Working with clients:** about 60 feedback tickets from Japanese clients; changes revised through code review.`,
        vi: `- **Thông tin doanh nghiệp trên GBP:** danh mục phụ, địa chỉ, khu vực phục vụ, giờ mở cửa; quản lý review gồm danh sách, lọc, trả lời, xoá câu trả lời và đồng bộ review.
- **Bài đăng GBP:** màn hình bài đăng có upload ảnh, huỷ / xoá bài đã lên lịch; dịch nội dung bằng AI.
- **Phân tích và báo cáo:** từ khoá tìm kiếm hàng đầu, số review, điểm sao, ghim bản đồ; cài đặt và xuất báo cáo PDF (logo, bảng từ khoá).
- **Nền tảng dùng chung:** bộ chọn công ty / chi nhánh, upload file lên Supabase Storage, màn hình chi tiết dịch vụ tích hợp, module hỗ trợ dùng chung cho các công cụ agency.
- **Tích hợp Google:** luồng OAuth GBP, liên kết / gỡ liên kết tài khoản, ghi log lỗi Google API.
- **Database:** tự viết migration (thêm cột, bỏ unique constraint, RLS, hàm RPC) và sinh lại TypeScript types.
- **Làm việc với khách hàng:** khoảng 60 ticket phản hồi từ khách hàng Nhật; sửa theo góp ý code review.`,
      },
      media: [],
      sortOrder: 8,
    },
    {
      type: "results",
      title: null,
      body: {
        en: `- Delivered four feature areas in 2025: GBP Manager, the partner agency tool, plans with per-location permissions, and Google sync.
- 619 commits (459 code commits), about +116,000 / −45,000 lines, 413 new files and 59 merged pull requests.
- Resolved about 60 feedback tickets directly from Japanese clients.`,
        vi: `- Bàn giao bốn mảng tính năng trong năm 2025: GBP Manager, công cụ cho agency, gói dịch vụ và phân quyền theo chi nhánh, đồng bộ với Google.
- 619 commit (459 commit code), khoảng +116.000 / −45.000 dòng, 413 file mới và 59 pull request đã merge.
- Xử lý khoảng 60 phản hồi trực tiếp từ khách hàng Nhật Bản.`,
      },
      media: [],
      sortOrder: 9,
    },
    {
      type: "learnings",
      title: null,
      body: {
        en: `- Isolation between customers belongs in the database; app-level checks only serve the experience.
- Plans, usage metering and feature toggles are data-model problems before they are UI problems.
- Syncing with external APIs needs upserts, cleanup of deleted data, and handling of expiring tokens and rate limits.
- In a large team, following the architecture and process (modules, migrations, review) matters more than a clever solution of my own.`,
        vi: `- Cách ly dữ liệu giữa các khách hàng phải nằm ở database; kiểm tra phía app chỉ để phục vụ trải nghiệm.
- Gói dịch vụ, đo mức dùng và bật / tắt tính năng là bài toán mô hình dữ liệu trước khi là bài toán giao diện.
- Đồng bộ với API bên ngoài cần upsert, dọn dữ liệu đã bị xoá, và xử lý token hết hạn cùng giới hạn gọi API.
- Trong đội lớn, đi đúng kiến trúc và quy trình (module, migration, review) quan trọng hơn một giải pháp riêng thông minh.`,
      },
      media: [],
      sortOrder: 10,
    },
  ],
};
