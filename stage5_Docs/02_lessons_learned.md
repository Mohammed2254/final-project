# Stage 5 — Lessons Learned

This looks back at the whole project — Stage 1 (idea) through the final
deploy — not just the last sprint. Stage 4's own retrospective is
[here](../stage4_Docs/03_retrospectives.md); this document builds on it
rather than repeating it.

---

## What went well

**The idea-selection process paid off.** We didn't pick the wedding
platform idea by default. [Stage 1](../stage1_report.md) scored 15
ideas against feasibility, learning value, and market gap, and ruled out
all but one for concrete reasons (legal risk, tools we hadn't studied,
markets already well served by existing platforms). The one we kept had
a real differentiator: two people planning together. That feature is
the one thing every teammate points to as the reason the idea was worth
building.

**The architecture held for the whole project, not just one sprint.**
Routes → schemas → services → repositories → models on the backend,
feature folders on the frontend. Decided in Stage 3, still intact at
Stage 5. Three people worked on different features at the same time
without stepping on each other, and the Stage 3 documentation was clear
enough that we didn't need constant back-and-forth to stay aligned.

**We shipped every objective in the Charter.** All three (multi-category
booking, a provider dashboard, and the shared couple workspace) are live
in production. See the [results summary](01_results_summary.md).

**The team adapted when it shrank.** The Charter's own risk log
(Section 4) called out "time pressure with a part-time team" and
planned for the MVP to survive on two people in the worst case. That
plan was tested for real: one of four members was inactive from Stage 4
onward, and the other three absorbed the work and still delivered.

**Deploy-and-fix-forward became a real skill.** By the fourth production
issue, the team had a repeatable loop: reproduce in a clean environment
(fresh virtualenv, fresh `git clone`), fix, verify, then push. That habit
outlasted Stage 4: the two feature additions made after the retrospective
was written (`3aaa0a3`, `712b9a4`) were each verified with a clean clone,
a from-scratch `npm install`/`pip install`, and a real `gunicorn` boot
before touching `main`, with no incidents.

---

## What didn't go well — and why

**We wrote a mitigation in Stage 2 and didn't follow it.** The Charter's
Risk 4 was "team not meeting timeline commitments," and the mitigation
was "weekly standups with explicit deadlines... progress tracked on
GitHub." In practice, the Jira board set up for backend tasks stopped
being updated, and there was no single place tracking deadlines. The
team's actual rhythm (WhatsApp plus weekly calls) worked well enough to
ship, but it left no record anyone could check *during* the project,
only reconstructible from Git history *after* the fact.

**Stage boundaries blurred.** The Charter gave Stage 4 four weeks (June
18–July 16). The shared workspace feature and all of production
hardening happened between July 17 and July 26, ten days into what was
nominally Stage 5. This wasn't a hidden slip; the [sprint
plan](../stage4_Docs/01_sprint_plan.md) dates show it plainly. The
underlying cause is the same one as above: without a tracked plan, there
was no early warning that the schedule was sliding until the date had
already passed.

**QA was never anyone's job, from Stage 1 onward.** One member was
assigned "Developer + QA" in the Charter, but was inactive by Stage 4
and nobody replaced the role. The first automated test was written in
the final sprint — not because testing wasn't valued, but because it
had no owner and always lost to feature work when nobody was
responsible for pushing back.

**Three deployment bugs were the same root cause, three times.**
`flask_cors` missing from `requirements.txt`, a `.gitignore` rule that
silently dropped a required frontend file, and a hardcoded
`localhost` API URL. All three worked locally because of state that
existed only on one machine and was never in the repository. None were
caught before the first deploy because nothing had ever been run
somewhere that wasn't a developer's own laptop.

**Security was fitted in afterward instead of built in.** JWT was set
up early, but write endpoints for services, halls, and photographers
went live without `@jwt_required()` and stayed that way until a review
in the final sprint caught it. It was a review that found it, not a
process that prevented it.

**`main` was 55+ commits behind for most of the project.** The team
worked almost entirely on `Dev` and didn't look at `main` until
deployment forced the question. `main` is the branch Render deploys
from and the one a new contributor would see first. For most of the
project's life, it didn't reflect the real state of the work.

**Our own documentation went stale twice, and we only caught it by
checking.** The landing page advertised counts for API endpoints,
database tables, and passing tests. Both times the project changed
underneath those numbers — once when features were added, once when the
payment feature was removed from production — and both times the page
kept claiming the old figures. Nothing warned us; we found it by
recounting from the source. Any number written by hand is a claim with
an expiry date, and a reviewer can check it in seconds.

**We validated the type of a value and thought we had validated the
value.** The signup and plan forms had thorough client-side rules, and
the backend schemas declared each numeric field as a decimal. That
looked like two layers of protection. It wasn't: a budget of `-5000` and
a wedding date in the year 2020 were both accepted by the API, because
declaring a field a decimal says nothing about its range. The
client-side rules are JavaScript — turn them off, or skip the browser
entirely with `curl`, and nothing was left. Ranges are now enforced
server-side on every numeric field, with tests that fail if they are
ever removed.

---

## Checking our own risk log

The Charter listed five risks with planned mitigations. Looking back at
each one with real evidence:

| Risk | Mitigation planned | Did it hold? |
|---|---|---|
| Time pressure, part-time team | MVP survivable by 2 people worst case | **Yes.** Tested for real when the team dropped to 3 active members; the MVP still shipped complete. |
| Scope creep | Freeze scope after Stage 2 | **Mostly.** No feature outside the Charter's "in scope" list shipped. Favorites was the only addition beyond the three core objectives, and it's small enough not to count as creep. |
| Shared workspace complexity | Simple polling/approval state first; real-time sync only if time allowed | **Yes.** The approval-state model (`PENDING` → approved/rejected) was built and never upgraded to real-time sync — exactly the fallback the Charter described, not a shortcut taken under pressure. |
| Team not meeting timelines | Weekly standups, deadlines tracked on GitHub | **No.** This is the risk that actually materialized (see above). |
| Technical disagreements | Final call rests with the Team Lead | **Untested, and that's fine.** No major technical conflict came up. The architecture staying consistent for three months suggests either the mitigation worked quietly or the risk was smaller than expected. |

Four of five held up. The one exception, timeline tracking, is the
common thread behind most of the "what didn't go well" section above.

---

## What we'd do differently next time

- Track deadlines in one place that's actually kept current — not
  because Jira is special, but because *some* single source of truth
  needs to exist before a slip can be caught early instead of noticed
  after the date has passed.
- Assign QA every sprint, regardless of who's available that week.
  Write the first test alongside the first feature, not after the
  feature works.
- Add the auth check when writing the endpoint. Treat "does this need
  `@jwt_required()`" as part of defining the route, not a follow-up.
- The moment a package is `pip install`ed or `npm install`ed, add it to
  `requirements.txt` / `package.json` in the same commit.
- Deploy something, anything, in week one, even broken. Every
  deployment bug this project hit would have been caught cheaply on day
  one instead of expensively at the end.
- Merge to `main` on a fixed schedule so it's never more than a few
  commits away from what's actually deployable.
- Validate the *value*, not just the type. "Is this a number" and "is
  this a number that makes sense" are different questions, and only the
  second one protects anything.
- Derive counts instead of writing them down. Any figure typed by hand
  into a document or a page is a claim that will quietly go stale.

---

## Team retrospective (Stage 5)

The team held this discussion directly, separate from the technical
retrospective above.

**What worked well as a team — not just technically, but in how we
communicated and split work?**

A real sense of mutual understanding and responsibility. Each person
carried their own part and delivered on the timeline they'd committed
to, without needing to be chased. Alongside the work itself, the team
also made time to just mix and spend time together outside of tasks —
that closeness made coordinating the actual work easier, not harder.

**What challenges came up, and did we actually resolve them or just
route around them?**

Two, and we resolved both rather than routing around them:

- *Personal circumstances.* More than one member went through
  situations outside the project that pulled them away from it
  temporarily. The team's answer was to rebalance the workload in the
  moment: when someone had to step back, the rest picked up what they'd
  been carrying; when they came back, they returned the favor by
  carrying for someone else in turn. This is the same pattern the
  Charter's risk log anticipated in the abstract ("part-time team,"
  Section 4) — living through it for real is what's new here.
- *Project-management complexity.* Early attempts to formalize process
  (a Jira board, more structured tracking) added overhead without
  adding clarity. What actually worked was simpler: less process, more
  direct coordination. The lesson wasn't "we need more structure," it
  was that the structure we'd reached for wasn't the right size for a
  three-person team.

**What would we change about how we work together, specifically, if we
started a new project tomorrow?**

Start earlier, and run real sprints — fixed-length, with a defined
scope going in, not a rolling to-do list. "Stage boundaries blurred"
earlier in this document and "no single place tracked deadlines" are
two sides of the same gap; starting the sprint rhythm on day one instead
of easing into it is the concrete fix the team agreed on.
