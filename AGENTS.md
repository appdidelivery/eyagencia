<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deployment policy — prevent duplicate Vercel builds

This repository (`appdidelivery/eyagencia`) is already connected to the Vercel project `velo-delivery/eyagencia` via Git integration. This integration deploys pushes to the production branch `main` automatically.

**One commit SHA, one production deployment.** After pushing `main`, inspect the deployment created by Vercel's Git integration and confirm it becomes READY. Do not also run `vercel --prod`, `vercel deploy --prod`, a Vercel create-deployment API call, a deploy hook, or a redeploy of that same commit. An explicit extra deployment is allowed only if the automated Git deployment is confirmed unavailable/failed, or if the user expressly requests a redeploy after diagnosis.

Before any manual deployment, check the project's existing deployments for the same commit SHA and environment. When a matching production deployment is READY, reuse its URL and report that result; do not rebuild. When it is BUILDING or QUEUED, inspect its progress instead of launching another. Do not promote unrelated preview builds in place of the existing Git production deployment.

**Avoid unnecessary preview builds.** Develop and test locally as changes are made, batch related work into coherent commits, and push a development branch after its changes and basic validations are ready. Avoid rapid sequences of tiny branch pushes that automatically create or cancel Vercel previews. Preserve preview environments for meaningful acceptance testing. Do not disable the Git integration, production deployment, required CI checks, or project protection without explicit user authorization.

**CMS and scheduled content are not code deploys.** Publishing or changing posts, assets, images, or scheduled content through Sanity or another CMS must not trigger a Vercel redeploy unless application code or build-time configuration actually changed.

At handoff, report the Git commit, the *single existing* Vercel production deployment ID/URL, its actual READY status, and any tests performed. Do not claim deployment success without checking Vercel.
