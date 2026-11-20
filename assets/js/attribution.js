/*
 * Website attribution: where a visitor came from, kept in this browser only (localStorage, no cookies, nothing sent
 * anywhere until the person submits a form).
 *
 *   first touch  the visit that first brought this browser to the site (never overwritten)
 *   last touch   the latest visit that came from a campaign link, an ad click or another website
 *                (moving between pages on this site, or coming back directly, does not overwrite it)
 *
 * Captured: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, the landing page and the
 * referrer. Every form on the page gets the values as hidden fields (utm_*, gclid, fbclid, landing_page, referrer
 * for the last touch; first_* for the first touch), and the forms that post to the IVO platform also send them as
 * one "attribution" object (window.IVO_ATTR.payload()). Naming rules for campaign links: docs/utm-naming.md.
 */
(function(){
  var KEY = "ivo_attr_v1";
  var MAX_AGE_DAYS = 180; // a first touch older than this is replaced by the next visit
  var PARAMS = { utm_source: "source", utm_medium: "medium", utm_campaign: "campaign", utm_term: "term", utm_content: "content", gclid: "gclid", fbclid: "fbclid" };
  var OWN_HOSTS = /(^|\.)ivoservgroup\.com$/i;

  function clip(v, n){ return String(v == null ? "" : v).trim().slice(0, n); }
  function read(){
    try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); return v && typeof v === "object" ? v : {}; }
    catch (e) { return {}; }
  }
  function write(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode or storage full: forms still work */ } }
  function externalReferrer(){
    var r = document.referrer || "";
    if (!r) return "";
    try {
      var h = new URL(r).hostname;
      if (h === location.hostname || OWN_HOSTS.test(h)) return "";
    } catch (e) { return ""; }
    return clip(r, 500);
  }
  function touchFromThisVisit(){
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function(){ return null; } }; }
    var t = {}, tagged = false;
    Object.keys(PARAMS).forEach(function(p){
      var v = clip(q.get(p), 200);
      if (v) { t[PARAMS[p]] = v.toLowerCase && p.indexOf("utm_") === 0 ? v.toLowerCase() : v; tagged = true; }
    });
    var ref = externalReferrer();
    t.landingPage = clip(location.origin + location.pathname + location.search, 500);
    if (ref) t.referrer = ref;
    t.at = new Date().toISOString();
    return { touch: t, isNew: tagged || !!ref };
  }
  function stale(t){
    var at = t && Date.parse(t.at);
    return !at || (Date.now() - at) > MAX_AGE_DAYS * 864e5;
  }

  var state = read();
  var visit = touchFromThisVisit();
  if (!state.first || stale(state.first)) state.first = visit.touch;
  if (visit.isNew || !state.last) state.last = visit.touch;
  write(state);

  function payload(){
    var s = read();
    var out = {};
    if (s.first) out.first = s.first;
    if (s.last) out.last = s.last;
    return out.first || out.last ? out : undefined;
  }

  var FIELDS = [["source","utm_source"],["medium","utm_medium"],["campaign","utm_campaign"],["term","utm_term"],["content","utm_content"],["gclid","gclid"],["fbclid","fbclid"],["landingPage","landing_page"],["referrer","referrer"]];
  function setHidden(form, name, value){
    var el = form.querySelector("input[type=hidden][name='" + name + "']");
    if (!el) {
      el = document.createElement("input");
      el.type = "hidden";
      el.name = name;
      el.setAttribute("data-attribution", "");
      form.appendChild(el);
    }
    el.value = value || "";
  }
  /** Adds or refreshes the hidden attribution fields on every form (or the one passed in). */
  function fill(root){
    var s = read();
    var forms = root && root.tagName === "FORM" ? [root] : [].slice.call(document.querySelectorAll("form"));
    forms.forEach(function(f){
      if (f.hasAttribute("data-no-attribution")) return;
      FIELDS.forEach(function(p){
        setHidden(f, p[1], s.last && s.last[p[0]]);
        setHidden(f, "first_" + p[1], s.first && s.first[p[0]]);
      });
    });
  }
  /** Plain-text lines for the email (mailto:) fallback. */
  function summaryLines(){
    var s = read();
    function line(label, t){
      if (!t) return null;
      var tags = [t.source, t.medium, t.campaign].filter(Boolean).join(" / ");
      var extra = [t.term && ("term: " + t.term), t.content && ("content: " + t.content), t.gclid && "gclid", t.fbclid && "fbclid"].filter(Boolean).join(", ");
      return label + ": " + (tags || (t.referrer ? "referral from " + t.referrer : "direct")) + (extra ? " (" + extra + ")" : "") + (t.landingPage ? " · landed on " + t.landingPage : "");
    }
    return [line("First visit", s.first), line("Latest visit", s.last)].filter(Boolean);
  }

  window.IVO_ATTR = { payload: payload, fill: fill, summaryLines: summaryLines };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ fill(); });
  else fill();
})();
