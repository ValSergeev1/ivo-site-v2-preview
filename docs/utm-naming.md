# UTM naming convention (IVO Group)

For IVO Growth and Brand and anyone who posts a link to ivoservgroup.com. Tag every link we control so the IVO
platform can count requests and partner applications by channel. The site keeps the first and the latest tagged visit
in the visitor's browser and sends both with the form (see `assets/js/attribution.js`).

Paid ads: **budget cap $500 per month total across all ad platforms**, set by Val on Nov 20, 2026. Set the cap
inside each ad account as well as in the plan. No ad goes live without Val's approval.

## Rules

1. **Lowercase, hyphens, no spaces.** `winter-emergency`, not `Winter Emergency` or `winter_emergency`. (The site
   lowercases UTM values anyway, but keep reports clean.)
2. **Always set `utm_source`, `utm_medium` and `utm_campaign`.** `utm_term` and `utm_content` are optional.
3. **Never tag internal links** (one ivoservgroup.com page to another). It would overwrite the real source.
4. **Link to the most specific page:** the state page (`/locations/washington/`, `/locations/oregon/`,
   `/locations/idaho/`), a service page, or `/#request`. Never the sales demo or the platform walkthrough link.
5. **No personal data in UTMs** (no names, emails, phone numbers, property addresses).
6. **Do not use California** in any campaign, keyword or targeting. IVO is not licensed there.
7. Google Ads: turn on **auto-tagging** (adds `gclid`) and still add the UTMs below in the account's final URL suffix.
   Meta ads add `fbclid` automatically.

## Allowed values

| Field | Use | Allowed values |
| --- | --- | --- |
| `utm_source` | Who sends the visit | `google`, `bing`, `gbp` (Google Business Profile), `linkedin`, `facebook`, `instagram`, `nextdoor`, `yelp`, `email`, `bid-portal`, `directory-<name>` (e.g. `directory-bbb`), `qr` |
| `utm_medium` | What kind of link | `cpc` (paid search), `paid-social`, `social` (organic post), `profile` (GBP / directory / LinkedIn page link), `email`, `print`, `referral` |
| `utm_campaign` | Which initiative | `<topic>-<region>-<yyyymm>`, e.g. `winter-emergency-wa-202612`, `ti-puget-sound-202612`, `turnovers-or-202701`, `partner-recruiting-wa-202612`, `gbp-listing` (evergreen), `email-signature` (evergreen) |
| `utm_term` | Paid-search keyword or audience | the keyword or ad group, e.g. `commercial-board-up-kent` |
| `utm_content` | Which ad, post or link | `<format>-<variant>`, e.g. `rsa-a`, `post-photo-1`, `cta-button`, `footer-link` |

Regions: `wa`, `or`, `id`, `puget-sound`, `portland`, `boise`, `spokane`. Topics: `emergency`, `ti`,
`turnovers`, `repairs`, `compliance`, `multi-trade`, `partner-recruiting`, `brand`.

## Ready-made links

| Where | Link |
| --- | --- |
| Google Business Profile website button | `https://ivoservgroup.com/?utm_source=gbp&utm_medium=profile&utm_campaign=gbp-listing` |
| GBP appointment / request link | `https://ivoservgroup.com/?utm_source=gbp&utm_medium=profile&utm_campaign=gbp-listing&utm_content=request-link#request` |
| LinkedIn company page website | `https://ivoservgroup.com/?utm_source=linkedin&utm_medium=profile&utm_campaign=company-page` |
| LinkedIn organic post | `https://ivoservgroup.com/locations/washington/?utm_source=linkedin&utm_medium=social&utm_campaign=brand-wa-202612&utm_content=post-1` |
| Email signature | `https://ivoservgroup.com/?utm_source=email&utm_medium=email&utm_campaign=email-signature` |
| Outreach email (approved by Val) | `https://ivoservgroup.com/?utm_source=email&utm_medium=email&utm_campaign=outreach-puget-sound-202612` |
| Google Ads, winter emergency, WA | `https://ivoservgroup.com/emergency-property-response/?utm_source=google&utm_medium=cpc&utm_campaign=winter-emergency-wa-202612&utm_term={keyword}&utm_content=rsa-a` |
| Partner recruiting post | `https://ivoservgroup.com/partner-with-ivo/?utm_source=linkedin&utm_medium=social&utm_campaign=partner-recruiting-wa-202612#apply` |
| Printed flyer QR code | `https://ivoservgroup.com/?utm_source=qr&utm_medium=print&utm_campaign=<flyer-name>-202612` |

## Where to see the results

Each website request, lead and partner application in the IVO platform shows a **Website source** line (first and
latest visit). Requests without tags show the referring site or "direct".

## Log

Keep a row per campaign in the growth tracker: campaign name, source/medium, start and end dates, monthly budget,
landing page. The monthly total of all paid campaigns stays at or under $500 until Val changes it.
