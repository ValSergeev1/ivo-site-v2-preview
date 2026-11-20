# IVO Group website

Marketing site for [ivoservgroup.com](https://ivoservgroup.com). Static HTML, CSS and JavaScript, served by nginx.

Pages: `/`, `/locations/washington/`, `/locations/oregon/`, `/locations/idaho/` (state service-area pages, built by `python3 tools/build-locations.py`), `/commercial-construction/`, `/property-services/`, `/emergency-property-response/`, `/specialty-services/`, `/our-work/`, `/about-ivo/`, `/how-to-work-with-ivo/`, `/our-apps/`, `/partner-with-ivo/`, `/portal/`.

- Shared styles and scripts: `assets/css/site.css`, `assets/js/site.js`
- Campaign attribution: `assets/js/attribution.js` (on every page) keeps the first and latest UTM / gclid / fbclid / referrer visit in localStorage, adds them as hidden fields to every form, and the request and partner forms send them to the platform as `attribution`. Tagging rules for links and ads: `docs/utm-naming.md`.
- Links can preselect the request form's state with `?state=WA|OR|ID`.
- The four-step request form lives only on the home page (`/#request`); every page links to it.
  Links can preselect the form with `?service=` / `?priority=` (e.g. `/?service=Emergency%20response&priority=Emergency#request`).
- The home-page request form opens an email to `office@ivoservgroup.com` (`window.IVO_FORM_ENDPOINT` in `index.html`). Change that value to a form-handler URL or a different `mailto:` address if the destination changes.
- Hero video: `assets/video/ivo-hero-1080.mp4` / `-720.mp4` + `ivo-hero-poster.jpg`
- Explainer video: `assets/video/ivo-explainer.mp4` with English captions `ivo-explainer.vtt` and `ivo-explainer-poster.jpg`, on `/how-to-work-with-ivo/` (#explainer) and the home page.
- Partner application and portal sign-in currently open the IVO platform prototype on GitHub Pages, until the live apps are hosted on IVO's domain.
- Canonical, Open Graph and sitemap URLs use `https://ivoservgroup.com/`.

## Container

`Dockerfile`, `nginx.conf`, and `.dockerignore` build an nginx container for Cloud Run (`ivo-website` in `us-west1`). The container listens on port 8080 and 301s retired paths to the current pages, including `/portal-walkthrough`, `/faq`, `/service-area`, `/industries`, old ChatGPT-site `/p_*.html` URLs, `/contact`, `/start-request`, `/request-bid`, and `/contractor-vendor-application`. The older `/v3/` tree is retained but not indexed. The GitHub Pages copy of this repo is published from the `gh-pages` branch with noindex tags so it is not confused with the live site. Domain mapping is handled separately and is not part of this repository.
