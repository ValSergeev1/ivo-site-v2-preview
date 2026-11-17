# IVO Group website

Marketing site for [ivoservgroup.com](https://ivoservgroup.com). Static HTML, CSS and JavaScript, served by nginx.

Pages: `/`, `/commercial-construction/`, `/property-services/`, `/emergency-property-response/`, `/specialty-services/`, `/our-work/`, `/about-ivo/`, `/how-to-work-with-ivo/`, `/our-apps/`, `/partner-with-ivo/`, `/portal/`.

- Shared styles and scripts: `assets/css/site.css`, `assets/js/site.js`
- The four-step request form lives only on the home page (`/#request`); every page links to it.
  Links can preselect the form with `?service=` / `?priority=` (e.g. `/?service=Emergency%20response&priority=Emergency#request`).
- The home-page request form opens an email to `val@ivoservgroup.com` (`window.IVO_FORM_ENDPOINT` in `index.html`). Change that value to a form-handler URL or a different `mailto:` address if the destination changes.
- Hero video: `assets/video/ivo-hero-1080.mp4` / `-720.mp4` + `ivo-hero-poster.jpg`
- Explainer video: `assets/video/ivo-explainer.mp4` with English captions `ivo-explainer.vtt` and `ivo-explainer-poster.jpg`, on `/how-to-work-with-ivo/` (#explainer) and the home page.
- Partner application and portal sign-in currently open the IVO platform prototype on GitHub Pages, until the live apps are hosted on IVO's domain.
- Canonical, Open Graph and sitemap URLs use `https://ivoservgroup.com/`.

## Container

`Dockerfile`, `nginx.conf`, and `.dockerignore` build an nginx container for Cloud Run (`ivo-website` in `us-west1`). The container listens on port 8080 and 301s the old `/portal-walkthrough`, `/faq`, `/service-area`, and `/industries` paths to their current anchors. The older `/v3/` tree is retained but not indexed. Domain mapping is handled separately and is not part of this repository.
