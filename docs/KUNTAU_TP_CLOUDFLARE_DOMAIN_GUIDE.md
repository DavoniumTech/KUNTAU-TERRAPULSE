# KUNTAU TP — GitHub, Cloudflare Pages, and Custom Domain

## How the deployment should work

Recommended flow:

`local files → Git feature branch → GitHub pull request → reviewed merge to main → Cloudflare Pages production deployment → custom domain`

GitHub stores the source. Cloudflare hosts the deployed website. A GitHub push only triggers a live deployment when the repository is connected to Cloudflare Pages (or another configured deployment pipeline).

## Important before connecting

- Confirm whether KUNTAU TP already has a Cloudflare Pages project or whether it is currently hosted as a Worker.
- Do not change an existing Worker route or root domain used by another application.
- Use a dedicated subdomain such as `terrapulse.davoniumtech.com` if `davoniumtech.com` already serves another product.
- Confirm the correct build output directory. The current project has an `app/` folder, but the existing Cloudflare build configuration must be checked before choosing it as the output directory.
- Do not publish raw HDF5, large intermediate GeoTIFFs, access tokens, `.netrc`, `.dodsrc`, or private credentials.

## Connect a repository to Cloudflare Pages

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages**.
3. Select **Create application → Pages → Connect to Git** (or open the existing KUNTAU TP Pages project if one already exists).
4. Authorise the correct GitHub account and select `DavoniumTech/KUNTAU-TERRAPULSE`.
5. Choose `main` as the production branch only after the reviewed pull request has been merged into `main`.
6. Set the build command and output directory to match the existing app. Do not guess these values; inspect the current app structure and test a preview deployment first.
7. Save and inspect the deployment URL ending in `pages.dev`.
8. Pushes to the configured production branch can then trigger production builds; feature branches can be used for preview deployments.

If there is already a Pages project, do not create a duplicate without checking its current Git connection and build settings.

## Connect a custom domain

1. In Cloudflare dashboard, open **Workers & Pages → your KUNTAU TP Pages project → Custom domains**.
2. Select **Set up a domain**.
3. Enter a dedicated subdomain, for example `terrapulse.davoniumtech.com`.
4. Follow the DNS instructions shown in Cloudflare. For a subdomain, this is typically a CNAME pointing to the Pages project hostname.
5. Wait for Cloudflare to verify DNS and issue HTTPS. Test both the custom domain and the `pages.dev` address.

For an apex/root domain such as `davoniumtech.com`, Cloudflare requires the domain to be added as a Cloudflare zone and its nameservers configured for Cloudflare. Do not change nameservers or root DNS records without checking what other services already use the domain.

## Safety and rollback

- Keep the last known-good production deployment available.
- Use a preview branch first.
- Merge to `main` only after the page and existing app have been tested.
- Never force-push to shared branches.
- Keep deployment secrets in Cloudflare settings, not in GitHub files.
