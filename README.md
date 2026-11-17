# IVO Group website, preview v2

Static multi-page preview of a redesigned ivoservgroup.com. It does not replace the live site.

Pages (one folder each, URLs mirror the live site): `/`, `/commercial-construction/`, `/property-services/`,
`/emergency-property-response/`, `/specialty-services/`, `/industries/`, `/our-work/`, `/about-ivo/`,
`/partner-with-ivo/`, `/how-to-work-with-ivo/`, `/portal-walkthrough/`.

- Shared styles/scripts: `assets/css/site.css`, `assets/js/site.js`
- The four-step request form lives only on the home page (`/#request`); every page links to it.
  Links can preselect the form with `?service=` / `?priority=` (e.g. `/?service=Emergency%20response&priority=Emergency#request`).
- Hero video: `assets/video/ivo-hero-1080.mp4` / `-720.mp4` + `ivo-hero-poster.jpg` (21 s loop)
- Explainer video: `assets/video/ivo-explainer.mp4` with English captions `ivo-explainer.vtt` and `ivo-explainer-poster.jpg`, embedded on `/how-to-work-with-ivo/` (#explainer) and the home page.
- Subpage copy is based on the live pages, rewritten into the v2 layout. Licensing details and numeric claims are removed.
- Photos and logo mark come from the current ivoservgroup.com
- The request form is UI only and posts nowhere
- Testimonials are SAMPLES (marked) to be replaced with real client quotes
- Response-time targets are proposed values for the owner to confirm
- `noindex` is set on every page so search engines skip the preview

## Cloud Run test container

`Dockerfile`, `nginx.conf`, and `.dockerignore` build a small nginx container for a test
deploy of this preview on Google Cloud Run (`ivo-website` in `us-west1`). The container
listens on port 8080, keeps `noindex`, and 301s the old `/portal-walkthrough`, `/faq`,
`/service-area`, and `/industries` paths to their current anchors. It does not map a
custom domain. See the Dockerfile and nginx.conf for the exact settings.
