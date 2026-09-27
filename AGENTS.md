<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Optimize admin-uploaded site photos in the browser to WebP before storage upload, with smaller hero dimensions, so hosted pages load faster without server image processing.
- Keep Home slots and Experience section photo destinations in the shared site-images module so admin controls and public pages use identical keys.
- Serve essential fallback brand imagery from public paths so non-Lovable hosts do not depend on preview-only asset URLs.
