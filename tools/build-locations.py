#!/usr/bin/env python3
"""Builds the state service-area pages (/locations/<state>/index.html) from one template.

Run from the repo root after editing the copy below:  python3 tools/build-locations.py
Copy rules (Proven Claims Register): IVO Group on screen, 'technician', no ratings, reviews, stats, license numbers,
response-time promises, 'licensed', 'bonded' or 'general contractor', and no California service claims.
"""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://ivoservgroup.com"

STATES = [
    {
        "slug": "washington", "code": "WA", "name": "Washington", "hero": "ivo-36.webp",
        "regions": "Puget Sound, Southwest &amp; Eastern Washington",
        "cities": ["Kent", "Seattle", "Bellevue", "Tacoma", "Renton", "Auburn", "Federal Way", "Everett", "Olympia",
                   "Vancouver", "Spokane", "Bellingham", "Yakima", "Tri-Cities"],
        "intro": "IVO Group is based in Kent, Washington, and works with property managers, facilities managers, "
                 "commercial landlords, HOAs, and retail and restaurant teams across the state, starting with Puget Sound. "
                 "One IVO contact scopes the work, coordinates the technicians and trade contractors involved, and keeps "
                 "a written record through closeout.",
        "office_note": "Our office is in Kent, in the Puget Sound region. Coverage for a specific property is confirmed "
                       "before work is accepted.",
    },
    {
        "slug": "oregon", "code": "OR", "name": "Oregon", "hero": "ivo-21.webp",
        "regions": "Portland metro, Willamette Valley &amp; Central Oregon",
        "cities": ["Portland", "Beaverton", "Hillsboro", "Salem", "Eugene", "Corvallis", "Bend", "Medford"],
        "intro": "IVO Group supports commercial properties in Oregon for property managers, facilities managers, "
                 "commercial landlords, HOAs, and retail and restaurant teams. One IVO contact scopes the work, "
                 "coordinates the technicians and trade contractors involved, and keeps a written record through closeout.",
        "office_note": "Our office is in Kent, Washington. For an Oregon property, send the address and scope and IVO "
                       "confirms coverage for that property before work is accepted.",
    },
    {
        "slug": "idaho", "code": "ID", "name": "Idaho", "hero": "ivo-76.webp",
        "regions": "Treasure Valley &amp; North Idaho",
        "cities": ["Boise", "Meridian", "Nampa", "Caldwell", "Coeur d’Alene", "Twin Falls", "Idaho Falls", "Pocatello"],
        "intro": "IVO Group supports commercial properties in Idaho for property managers, facilities managers, "
                 "commercial landlords, HOAs, and retail and restaurant teams. One IVO contact scopes the work, "
                 "coordinates the technicians and trade contractors involved, and keeps a written record through closeout.",
        "office_note": "Our office is in Kent, Washington. For an Idaho property, send the address and scope and IVO "
                       "confirms coverage for that property before work is accepted.",
    },
]

SERVICES = [
    ("Tenant improvements &amp; renovations", "../../commercial-construction/", "Commercial construction",
     "Interior repairs, renovations and tenant-improvement scopes planned around how the space operates, with the trades involved coordinated through one IVO contact."),
    ("Repairs &amp; turnovers", "../../property-services/", "Property services",
     "Doors, hardware, walls, ceilings, flooring, paint, suite turnovers and make-ready that keep commercial spaces leasable, safe and running."),
    ("Emergency property response", "../../emergency-property-response/", "Emergency response",
     "Temporary securing, board-up, make-safe and protection after unexpected damage, and coordination of the path to permanent repair."),
    ("Compliance-driven repairs", "../../property-services/", "Property services",
     "Items called out by an inspection, a lease requirement or an insurance review, scoped as a request and coordinated with the appropriate trade, with photos and closeout documents kept on record."),
    ("Multi-trade coordination", "../../specialty-services/", "Specialty",
     "Property modifications and scopes that need more than one trade or do not fit a single service label, coordinated through one IVO contact."),
]

SERVICE_TYPES = ["Tenant improvements", "Renovations", "Commercial repairs", "Suite turnovers and make-ready",
                 "Emergency property response", "Compliance-driven repairs", "Multi-trade coordination"]


def esc(s):
    return html.escape(s, quote=True)


def jsonld(st, url, title):
    org = {
        "@type": ["Organization", "LocalBusiness"],
        "@id": f"{SITE}/#org",
        "name": "IVO Group",
        "legalName": "IVO Serv Group",
        "url": f"{SITE}/",
        "logo": f"{SITE}/assets/img/icon-512.png",
        "image": f"{SITE}/assets/img/og-image.jpg",
        "telephone": "+1-206-539-9549",
        "email": "office@ivoservgroup.com",
        "description": "Commercial property services and multi-trade coordination for Washington, Oregon, and Idaho.",
        "address": {"@type": "PostalAddress", "addressLocality": "Kent", "addressRegion": "WA", "addressCountry": "US"},
        "areaServed": [{"@type": "State", "name": n} for n in ("Washington", "Oregon", "Idaho")],
    }
    service = {
        "@type": "Service",
        "@id": f"{url}#service",
        "name": f"Commercial property services in {st['name']}",
        "serviceType": SERVICE_TYPES,
        "provider": {"@id": f"{SITE}/#org"},
        "areaServed": {"@type": "State", "name": st["name"]},
        "url": url,
    }
    page = {"@type": "WebPage", "@id": url, "url": url, "name": title, "about": {"@id": f"{url}#service"},
            "isPartOf": {"@type": "WebSite", "name": "IVO Group", "url": f"{SITE}/"}}
    crumbs = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": "Service area", "item": f"{SITE}/about-ivo/#service-area"},
        {"@type": "ListItem", "position": 3, "name": st["name"], "item": url},
    ]}
    return json.dumps({"@context": "https://schema.org", "@graph": [org, service, page, crumbs]}, ensure_ascii=False)


def page(st):
    url = f"{SITE}/locations/{st['slug']}/"
    title = f"Commercial Property Services in {st['name']} | IVO Group"
    desc = (f"Repairs, turnovers, tenant improvements, emergency make-safe and multi-trade coordination for commercial "
            f"properties in {st['name']}. Request service online.")
    req = f"../../?state={st['code']}#request"
    others = [s for s in STATES if s is not st]
    cards = "".join(
        f'<a class="rel rv" href="{href}"><div><small>{esc(tag)}</small><h3>{name}</h3><p>{text}</p></div></a>'
        for name, href, tag, text in SERVICES)
    cities = "".join(f"<li>{esc(c)}</li>" for c in st["cities"])
    state_links = "".join(f'<a class="btn line sm" href="../{s["slug"]}/">{s["name"]}</a>' for s in others)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="preload" href="../../assets/fonts/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 any">
<link rel="icon" href="/assets/img/favicon-48.png" type="image/png" sizes="48x48">
<link rel="icon" href="/assets/img/favicon-96.png" type="image/png" sizes="96x96">
<link rel="icon" href="/assets/img/favicon-192.png" type="image/png" sizes="192x192">
<link rel="icon" href="/assets/img/favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="../../site.webmanifest">
<meta name="theme-color" content="#061d2a">
<meta name="view-transition" content="same-origin">
<meta property="og:type" content="website">
<meta property="og:site_name" content="IVO Group">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{SITE}/assets/img/og-image.jpg">
<link rel="canonical" href="{url}">
<link rel="stylesheet" href="../../assets/css/site.css?v=prod9">
<script type="application/ld+json">{jsonld(st, url, title)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<div class="topbar"><div class="wrap">
  <span class="tl">Commercial property services · {st['name']}</span>
  <a href="tel:+12065399549" class="em">Property emergency? Call (206) 539-9549</a>
</div></div>

<header class="site"><div class="wrap">
  <a href="../../" class="brand" aria-label="IVO GROUP home">
    <img src="../../assets/img/ivo-mark-navy.png" alt="" width="46" height="46">
    <span class="wm"><b>IVO</b><span>GROUP</span></span>
  </a>
  <nav class="main" id="nav" aria-label="Main">
    <div class="dd"><a href="../../commercial-construction/">Services<span class="car" aria-hidden="true">▾</span></a>
      <div class="dd-menu"><a href="../../commercial-construction/">Commercial Construction</a><a href="../../property-services/">Property Services</a><a href="../../emergency-property-response/">Emergency Property Response</a><a href="../../specialty-services/">Specialty Services</a></div></div>
    <a href="../../our-work/">Our work</a>
    <a href="../../about-ivo/" aria-current="page">About</a>
    <div class="dd"><a href="../../how-to-work-with-ivo/">How it works<span class="car" aria-hidden="true">▾</span></a>
      <div class="dd-menu"><a href="../../how-to-work-with-ivo/">How to work with IVO</a><a href="../../our-apps/">Our apps</a><a href="../../how-to-work-with-ivo/#faq">FAQ</a><a href="../../portal/">Portal sign-in</a></div></div>
    <a href="../../partner-with-ivo/">Partner with IVO</a>
    <a href="../../portal/" class="nav-login">Portal sign-in</a>
    <a href="{req}" class="btn sm">Start a request</a>
  </nav>
  <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
</div></header>

<main id="main">
<section class="phero" style="background-image:url(../../assets/img/{st['hero']})">
  <div class="wrap">
    <div class="crumb"><a href="../../">Home</a> / <a href="../../about-ivo/#service-area">Service area</a> / {st['name']}</div>
    <div class="eyebrow">Service area · {st['name']}</div>
    <h1>Commercial property services<b>in {st['name']}.</b></h1>
    <p class="lead">{esc(st['intro'])}</p>
    <div class="ctas"><a href="{req}" class="btn">Start a request <span class="arr">→</span></a><a href="tel:+12065399549" class="btn ghost">Call (206) 539-9549</a></div>
  </div>
</section>

<div class="facts"><div class="wrap"><div><small>Office</small><b>Kent, Washington</b></div><div><small>Regions in {st['name']}</small><b>{st['regions']}</b></div><div><small>Start with</small><b>The address, photos and a description of the condition</b></div><div><small>Emergencies</small><b>Call (206) 539-9549. A form does not dispatch a crew.</b></div></div></div>

<section>
  <div class="wrap">
    <div class="sec-head rv"><div><div class="eyebrow">Services</div><h2>What IVO Group handles<br><em>in {st['name']}.</em></h2></div><p class="lead">Commercial property work, from a single repair to a multi-trade scope. Each request is reviewed so the right path, technicians and timing are confirmed before you commit.</p></div>
    <div class="rel-grid">{cards}</div>
  </div>
</section>

<section class="mist">
  <div class="wrap">
    <div class="sec-head rv"><div><div class="eyebrow">Communities</div><h2>Where we work<br><em>in {st['name']}.</em></h2></div><p class="lead">{st['regions']}, including the communities below and the areas around them. {esc(st['office_note'])}</p></div>
    <ul class="loc-list rv" aria-label="Communities in {st['name']}">{cities}</ul>
    <p class="rv" style="margin-top:22px;color:var(--muted)">IVO Group also works in {others[0]['name']} and {others[1]['name']}.</p>
    <div class="loc-states rv">{state_links}<a class="btn line sm" href="../../about-ivo/#service-area">Full service area</a></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head rv"><div><div class="eyebrow">How it works</div><h2>One contact,<br><em>a written record.</em></h2></div><p class="lead">Property teams get the same steps on every request, so it is clear where the work stands and who has the next action.</p></div>
    <ol class="path rv"><li><h3>Share the need</h3><p>Send the property address, the condition, photos and the timing you need.</p></li><li><h3>Written scope &amp; price</h3><p>You get a written scope and price, or a not-to-exceed limit, before work starts.</p></li><li><h3>Changes approved first</h3><p>If something changes, you approve the change and its cost before that work is done.</p></li><li><h3>Closeout on record</h3><p>Photos, notes and closeout documents stay with the request.</p></li></ol>
  </div>
</section>

<section class="faq-sec mist">
  <div class="wrap">
    <div class="faq-grid">
      <div class="rv"><div class="eyebrow">Start a request</div><h2>Ready when<br><em>you are.</em></h2><p class="lead" style="margin-top:18px">Submit a request online, email <a class="link" href="mailto:office@ivoservgroup.com">office@ivoservgroup.com</a>, or call <a class="link" href="tel:+12065399549">(206) 539-9549</a>. Bid invitations go to <a class="link" href="mailto:bid@ivoservgroup.com">bid@ivoservgroup.com</a>.</p></div>
      <div class="rv">
        <details open><summary>What should I send with a request?</summary><p>The property address, what is happening and where, the result you want, and any timing or access limits. Photos help the team understand the condition before the first conversation.</p></details>
        <details><summary>What if it is an emergency?</summary><p>Call (206) 539-9549. A submitted form does not dispatch a crew. You can send photos and details through the form after the call.</p></details>
        <details><summary>Do you work with multi-site portfolios?</summary><p>Yes. Send the addresses and the way your organization issues work orders. Each location and scope is kept separate so site contacts, approvals and records are not mixed up between properties.</p></details>
        <details><summary>Is my property in your area?</summary><p>{esc(st['office_note'])}</p></details>
      </div>
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <div><div class="eyebrow">{st['name']} commercial properties</div><h2>Tell us what the property needs.<br><em>We'll help with the next step.</em></h2></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="{req}">Start a request <span class="arr">→</span></a><a class="btn ghost" href="../../?service=Bid%20invitation&amp;priority=Planned&amp;state={st['code']}#request">Invite IVO to bid</a><a class="btn ghost" href="tel:+12065399549">(206) 539-9549</a></div>
  </div>
</section>
</main>

<footer class="site">
  <div class="wrap">
    <div class="foot-grid">
      <div><a href="../../" class="brand"><img src="../../assets/img/ivo-mark-white.png" alt="" width="46" height="46"><span class="wm"><b>IVO</b><span>GROUP</span></span></a>
        <p style="margin-top:18px;max-width:300px">One call. Every solution. Commercial property services for Washington, Oregon and Idaho. Based in Kent, Washington.</p></div>
      <div><h5>Services</h5><ul><li><a href="../../commercial-construction/">Commercial Construction</a></li><li><a href="../../property-services/">Property Services</a></li><li><a href="../../emergency-property-response/">Emergency Property Response</a></li><li><a href="../../specialty-services/">Specialty Services</a></li></ul></div>
      <div><h5>Service area</h5><ul><li><a href="../washington/">Washington</a></li><li><a href="../oregon/">Oregon</a></li><li><a href="../idaho/">Idaho</a></li><li><a href="../../about-ivo/#service-area">Full service area</a></li><li><a href="../../about-ivo/">About IVO</a></li><li><a href="../../how-to-work-with-ivo/#faq">FAQ</a></li></ul></div>
      <div><h5>Start a conversation</h5><ul><li><a href="{req}">Start a request</a></li><li><a href="tel:+12065399549">(206) 539-9549</a></li><li><a href="mailto:office@ivoservgroup.com">office@ivoservgroup.com</a></li><li><a href="mailto:bid@ivoservgroup.com">bid@ivoservgroup.com</a></li><li><a href="../../portal/">Portal sign-in</a></li><li><a href="../../partner-with-ivo/#apply">Contractor &amp; vendor application</a></li></ul></div>
    </div>
    <div class="foot-bot"><span>© 2026 IVO Group · Kent, Washington · Serving Washington, Oregon and Idaho</span><span><a href="../../privacy/">Privacy</a> · <a href="../../unsubscribe/">Email preferences</a></span></div>
  </div>
</footer>

<div class="menu-scrim"></div>
<nav class="mbar" aria-label="Mobile shortcuts">
  <button type="button" class="mbar-btn" data-open-menu aria-controls="nav" aria-expanded="false"><span class="mbar-ico" aria-hidden="true"></span>Menu</button>
  <a href="tel:+12065399549" class="mbar-btn">Call</a>
  <a href="{req}" class="mbar-cta">Start a request</a>
</nav>
<script src="../../assets/js/attribution.js?v=1" defer></script>
<script src="../../assets/js/site.js?v=prod9" defer></script>
</body>
</html>
"""


for st in STATES:
    out = ROOT / "locations" / st["slug"] / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(st), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))
