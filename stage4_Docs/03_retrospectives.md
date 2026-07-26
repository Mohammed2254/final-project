# Stage 4 — Retrospective

## What went well

**The architecture held up.** Three people worked on different features
in parallel and the structure stayed consistent — routes → schemas →
services → repositories → models on the backend, feature folders on the
frontend. The Stage 3 documentation was clear enough that we didn't need
constant coordination to stay aligned.

**Mentor reviews kept us on track.** The weekly sessions caught
direction issues early, before they cost us time.

**We shipped the feature that mattered.** The shared wedding planning
flow — invite a partner by code, both approve service selections — is
the reason we picked this idea in Stage 1, and it works.

## What didn't go well

**We didn't stick to our own process.** We created a Jira board for
backend tasks early on and stopped updating it. We never ran logged
sprint ceremonies with dates and outcomes. Team availability made that
hard, but the result is that our planning lived in our heads and in
chat, not anywhere we could point to later.

**Losing a team member left QA unassigned.** One member was inactive
during Stage 4. Nobody picked up the QA role formally, which led
directly to the next problem.

**We wrote our first test in the last sprint.** With no dedicated QA,
testing kept getting pushed back. We ended Stage 4 with 47 passing
tests, but we should have had the first ones in Sprint 1 — they would
have caught things earlier and cheaper.

**Three bugs only showed up in production.** All three were the same
kind of mistake: something worked locally because of state on our
machines that wasn't in the repository.

1. `Flask-Cors` was installed manually in each of our virtual
   environments but never added to `requirements.txt`. The first deploy
   crashed on startup.
2. A generic `lib/` rule in `.gitignore` (meant for Python virtual
   environments) also matched `frontend/src/lib/`. A utility file used
   by 26 components was never actually pushed to GitHub — it only ever
   existed on one laptop. The frontend build failed.
3. The frontend's API URL defaulted to `http://localhost:5000`. That's
   correct locally, but in production it pointed every visitor's browser
   at their own machine. The site loaded and every single action failed.

**Security came late.** We had JWT set up early but never enforced it.
A review in Sprint 4 found that write endpoints for services, halls, and
photographers were open to unauthenticated requests — anyone could have
created or deleted another provider's listings. That should have been
part of building those endpoints, not a fix at the end.

**`main` drifted 55 commits behind.** We worked on `Dev` and forgot
`main` existed until we needed it for deployment.

## What we'd do differently

- Deploy in week 1, even if it breaks. Every deployment bug we hit would
  have been trivial to fix early and was expensive to fix at the end.
- Add a dependency to `requirements.txt` the moment you install it.
- Assign QA every sprint, no matter who's available. Write the first
  test with the first feature.
- Add auth checks while writing an endpoint, not in a security pass later.
- Merge to `main` on a schedule so it always reflects something
  deployable.
- Keep task tracking in one place and actually update it. Git history
  turned out to be a decent record after the fact, but it doesn't help
  you plan *before* the work.

## Sprint 4 mini-retro: deployment day

Every deployment bug above was found and fixed in one session, in the
order a real deploy surfaces them:

1. Deploy → `ModuleNotFoundError: flask_cors` → fixed → redeploy.
2. Deploy → frontend build fails, `Cannot find module '@/lib/utils'` →
   traced to `.gitignore` → fixed → redeploy.
3. Deploy → site loads, every API call fails → traced to the hardcoded
   `localhost` URL → fixed → redeploy.
4. Deploy → works. Registered a real account on production and confirmed
   register → login → browse.

What we did right here: each fix was verified in a clean environment
before redeploying — a fresh virtual environment installed only from
`requirements.txt`, a fresh `git clone` built from scratch — instead of
pushing and hoping. That loop is the closest thing we had to a real QA
process this stage.
