# Stage 4 — Retrospectives

## Overall retrospective

### What went well

- **Consistent architecture across contributors.** Despite three people
  working on different features in parallel, the layered pattern
  (routes → schemas → services → repositories → models on the backend;
  feature-based folders on the frontend) stayed consistent throughout —
  a sign the initial technical documentation (Stage 3) was clear enough
  to follow without constant coordination.
- **Mentor feedback loop.** Weekly mentor reviews caught direction
  issues early and kept the team aligned on scope.
- **The core differentiator shipped.** The shared wedding-planning
  workflow (invite a partner, joint approval of service selections) —
  the feature that justified choosing this idea in Stage 1 — was
  actually built and works.

### What didn't go well

- **Formal Agile tooling was under-used.** The Jira board created early
  for backend tasks was not kept up to date, and we did not run
  logged, timestamped sprint ceremonies. Team availability constraints
  ("ظروف") made consistent process discipline difficult.
- **Losing a team member mid-stage.** One member (originally assigned
  Developer + QA) was inactive for Stage 4, leaving no dedicated QA
  role. This is a direct cause of the next point.
- **Zero automated tests existed until the final sprint.** Because
  there was no dedicated QA function, testing was pushed to the very
  end instead of being integrated sprint-by-sprint as the rubric
  recommends.
- **"Works on my machine" bugs reached production.** Three real bugs
  only surfaced during deployment, not during local development:
  1. `Flask-Cors` was installed manually on developers' machines but
     never added to `requirements.txt` — deployment failed with
     `ModuleNotFoundError` until this was caught and fixed.
  2. A generic `lib/` rule in `.gitignore` (meant for Python virtual
     environments) accidentally excluded `frontend/src/lib/` for the
     entire project — a core utility file was never actually pushed to
     GitHub, so it only ever existed on one developer's machine.
  3. The frontend's API base URL defaulted to `http://localhost:5000`,
     which is only valid in local development. In production this
     silently pointed every visitor's browser at their own machine.
- **Security was retrofitted, not designed in from the start.** JWT
  authentication existed as infrastructure early on but was not
  actually enforced (`@jwt_required()`) on write endpoints until late
  in Stage 4, when a review of the codebase found several unauthenticated
  write endpoints (services, halls, photographers) that had been open
  for most of the project.
- **`main` branch drifted from real progress.** The team worked
  primarily on `Dev` but `main` (the GitHub default branch) fell 55
  commits behind and had to be brought back in sync near the end of the
  stage — a process/discipline gap, not a technical one.

### What we'd do differently next time

- Add `Flask-Cors` (and any manually-installed package) to
  `requirements.txt` **immediately** at install time, not after a
  deploy failure surfaces it.
- Deploy early and often — even a broken first deploy in week 1 would
  have caught the `.gitignore` and hardcoded-URL bugs weeks earlier,
  when they'd have been cheaper to fix.
- Assign QA explicitly every sprint regardless of team size changes,
  and write the first tests alongside the first feature, not at the end.
- Treat `main` as the branch that always reflects deployable state, and
  merge into it on a fixed cadence instead of only at the end.
- Keep sprint tracking in one tool (even a simple one) updated in real
  time — the Git history proved to be a reliable record after the
  fact, but it is not a substitute for planning *before* the work
  happens.

## Sprint 4 mini-retro (deployment day)

This sprint is worth calling out specifically because every bug listed
above was found and fixed within the same session, in the order a real
production deploy would surface them:

1. Deploy → `ModuleNotFoundError: flask_cors` → fixed, redeployed.
2. Deploy → frontend build failed, `Cannot find module '@/lib/utils'`
   → traced to `.gitignore`, fixed, redeployed.
3. Deploy → site loaded but every API call failed with a network error
   → traced to the hardcoded `localhost` API URL, fixed, redeployed.
4. Deploy → succeeded. Registered a real account on production and
   confirmed the full flow (register → login → browse) works.

Each fix was verified against a **clean environment** (a fresh Python
venv installed only from `requirements.txt`; a fresh `git clone` built
with `npm run build`) before being pushed again, rather than re-deploying
on hope. This iterative "deploy, diagnose, verify in isolation, fix,
redeploy" loop is the concrete evidence of QA practice for this stage,
even without a dedicated QA role.
