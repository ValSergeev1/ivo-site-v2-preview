# IVO Group website, preview v2

Static multi-page preview of a redesigned ivoservgroup.com. It does not replace the live site.

Pages (one folder each, URLs mirror the live site): `/`, `/commercial-construction/`, `/property-services/`,
`/emergency-property-response/`, `/specialty-services/`, `/industries/`, `/our-work/`, `/about-ivo/`,
`/partner-with-ivo/`, `/how-to-work-with-ivo/`, `/portal-walkthrough/`.

- Shared styles/scripts: `assets/css/site.css`, `assets/js/site.js`
- The four-step request form lives only on the home page (`/#request`); every page links to it.
  Links can preselect the form with `?service=` / `?priority=` (e.g. `/?service=Emergency%20response&priority=Emergency#request`).
- Hero video: `assets/video/ivo-hero-1080.mp4` / `-720.mp4` + `ivo-hero-poster.jpg`
- **Explainer video slot:** drop the animated "How IVO works" video at `assets/video/ivo-explainer.mp4`
  (optional captions: `assets/video/ivo-explainer.vtt`). The players on `/how-to-work-with-ivo/` and the home page
  switch on automatically once the file exists; until then they show `ivo-explainer-poster.jpg` with "Coming soon".
- Subpage copy is based on the live pages, rewritten into the v2 layout. Licensing details and numeric claims are removed.
- Photos and logo mark come from the current ivoservgroup.com
- The request form is UI only and posts nowhere
- Testimonials are SAMPLES (marked) to be replaced with real client quotes
- Response-time targets are proposed values for the owner to confirm
- `noindex` is set on every page so search engines skip the preview
