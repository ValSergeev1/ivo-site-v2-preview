/*
 * Sends the website forms to the IVO platform's public endpoints.
 *
 * CONFIG: set IVO_API_BASE to the platform's public URL (no trailing slash), e.g. "https://api.example.com".
 * Leave it empty to keep the email (mailto:) behavior only. A page may also set window.IVO_API_BASE before this file.
 * The platform must list this site's origin in PUBLIC_FORM_ORIGINS (CORS).
 *
 * Whenever the platform cannot be reached (not configured, offline, timeout, 404, 5xx), the forms fall back to
 * the existing mailto: flow, so nobody loses a request.
 */
(function(){
  var IVO_API_BASE = "https://app.ivoservgroup.com"; // the live IVO platform (production)

  // What the platform accepts (it checks the file contents too): photos, PDFs and Office documents.
  var LIMITS = { maxFiles: 10, maxFileBytes: 15 * 1024 * 1024, maxTotalBytes: 30 * 1024 * 1024 };
  var EXTENSIONS = ["pdf","jpg","jpeg","png","webp","heic","heif","doc","docx","xls","xlsx","ppt","pptx"];
  var TIMEOUT_MS = 90000;

  function base(){
    var b = String(window.IVO_API_BASE || IVO_API_BASE || "").trim().replace(/\/+$/, "");
    return /^https:\/\/[^\s/]+$/i.test(b) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(b) ? b : "";
  }
  function newKey(){
    if (window.crypto && crypto.randomUUID) return "web-" + crypto.randomUUID();
    return "web-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }
  /** True when every file can go to the platform. Otherwise the caller uses the email flow (people attach there). */
  function filesFit(files){
    if (files.length > LIMITS.maxFiles) return false;
    var total = 0;
    for (var i = 0; i < files.length; i++) {
      var f = files[i], ext = (f.name.split(".").pop() || "").toLowerCase();
      if (EXTENSIONS.indexOf(ext) < 0 || f.size === 0 || f.size > LIMITS.maxFileBytes) return false;
      total += f.size;
    }
    return total <= LIMITS.maxTotalBytes;
  }
  /**
   * Posts payload (a plain object) and files as multipart/form-data.
   * Resolves to {kind:"ok", ref, duplicate} | {kind:"rejected", status, message} | {kind:"unreachable"}.
   * "rejected" means the platform answered and refused the input (400/413/429): show the message, do not fall back.
   */
  function post(path, payload, files, key){
    var b = base();
    if (!b || !window.fetch || !window.FormData) return Promise.resolve({ kind: "unreachable" });
    var data = new FormData();
    data.append("payload", JSON.stringify(payload));
    (files || []).forEach(function(f){ data.append("files", f, f.name); });
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, TIMEOUT_MS) : null;
    return fetch(b + path, {
      method: "POST", body: data, mode: "cors", credentials: "omit", cache: "no-store",
      headers: { "Idempotency-Key": key }, signal: ctrl ? ctrl.signal : undefined
    }).then(function(res){
      return res.json().catch(function(){ return null; }).then(function(body){
        if (res.ok && body && body.ref) return { kind: "ok", ref: String(body.ref), duplicate: !!body.duplicate };
        if (res.status === 400 || res.status === 413 || res.status === 429) {
          var msg = body && body.error && body.error.message ? String(body.error.message) : "";
          if (res.status === 429) msg = "Too many submissions from this connection right now.";
          return { kind: "rejected", status: res.status, message: msg || "The form could not be accepted." };
        }
        return { kind: "unreachable" };
      });
    }).catch(function(){ return { kind: "unreachable" }; }).then(function(r){ if (timer) clearTimeout(timer); return r; });
  }

  window.IVO_API = { base: base, configured: function(){ return !!base(); }, newKey: newKey, filesFit: filesFit, post: post, limits: LIMITS };
})();
