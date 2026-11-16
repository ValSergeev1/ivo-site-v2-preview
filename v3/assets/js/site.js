// IVO Serv Group site: menu and the two public forms. No dependencies, no tracking.
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Mobile menu
  const btn = $(".menu-btn"), drawer = $("#drawer");
  if (btn && drawer) {
    btn.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) { drawer.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  // Forms
  $$("form[data-ivo-form]").forEach(setupForm);

  function setupForm(form) {
    const kind = form.dataset.ivoForm; // "request" | "partner"
    const demo = form.dataset.demo === "true";
    const msg = (k) => form.dataset["msg" + k] || "";
    const params = new URLSearchParams(location.search);

    if (kind === "request") {
      const pr = params.get("priority"), sv = params.get("service");
      if (pr) { const r = form.querySelector(`input[name=urgency][value="${CSS.escape(pr)}"]`); if (r) r.checked = true; }
      if (sv) { const s = form.querySelector("select[name=service]"); if (s && [...s.options].some((o) => o.value === sv)) s.value = sv; }
      const rg = params.get("region"), rs = form.querySelector("select[name=region]");
      if (rg && rs && [...rs.options].some((o) => o.value === rg)) rs.value = rg;
      const sync = () => {
        const em = form.querySelector("input[name=urgency]:checked")?.value === "emergency";
        const note = $("[data-emergency-note]", form); if (note) note.hidden = !em;
        const bid = form.querySelector("select[name=service]")?.value === "bid";
        $$("[data-bid-only]", form).forEach((el) => { el.hidden = !bid; });
      };
      form.addEventListener("change", sync); sync();
    }

    form.addEventListener("input", (e) => {
      const el = e.target;
      if (el.getAttribute && el.getAttribute("aria-invalid") && el.checkValidity()) {
        el.removeAttribute("aria-invalid");
        const err = $(`#${el.id}-err`, form); if (err) err.textContent = "";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("[data-form-status]", form);
      $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
      $$(".err", form).forEach((el) => { el.textContent = ""; });
      let firstBad = null;
      $$("input,select,textarea", form).forEach((el) => {
        if (el.closest(".hp") || el.closest("[hidden]")) return;
        if (!el.checkValidity()) {
          el.setAttribute("aria-invalid", "true");
          const err = $(`#${el.id}-err`, form); if (err) err.textContent = el.validationMessage;
          firstBad ||= el;
        }
      });
      const group = $("[data-require-one]", form);
      if (group && kind === "partner") {
        const supplier = form.querySelector("input[name=kind]:checked")?.value === "supplier";
        const need = group.dataset.requireOne;
        const any = $$(`input[name=${need}]:checked`, form).length > 0;
        if (!any && !supplier) { const err = $(`#${need}-err`, form); if (err) err.textContent = msg("Pickone"); firstBad ||= $(`input[name=${need}]`, form); }
      }
      const regionsBox = $("[data-require-regions]", form);
      if (regionsBox && !$$("input[name=regions]:checked", form).length) { const err = $("#regions-err", form); if (err) err.textContent = msg("Pickone"); firstBad ||= $("input[name=regions]", form); }
      if (firstBad) { status.className = "notice e"; status.textContent = msg("Fix"); status.hidden = false; firstBad.focus(); return; }

      const body = kind === "request" ? requestBody(form) : partnerBody(form);
      const submit = $("button[type=submit]", form);
      submit.disabled = true; const label = submit.textContent; submit.textContent = msg("Sending");
      status.hidden = true;
      try {
        let ref;
        if (demo) {
          await new Promise((r) => setTimeout(r, 400));
          ref = (kind === "request" ? "IVO-REQ-" : "IVO-APP-") + "DEMO00";
        } else {
          const res = await fetch(form.action, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.message || data.error || res.statusText);
          ref = data.ref;
        }
        const done = $("[data-form-done]", form.parentElement);
        $("[data-ref]", done).textContent = ref;
        form.hidden = true; done.hidden = false; done.scrollIntoView({ block: "center" }); done.focus({ preventScroll: true });
      } catch (err) {
        status.className = "notice e"; status.textContent = msg("Failed"); status.hidden = false;
      } finally { submit.disabled = false; submit.textContent = label; }
    });
  }

  const val = (f, n) => (f.elements[n]?.value || "").trim();
  const opt = (v) => (v ? v : undefined);
  const int = (v) => (v === "" ? undefined : Number.parseInt(v, 10));

  function requestBody(f) {
    const service = val(f, "service"), timing = val(f, "timing"), budget = val(f, "budget");
    const lines = [];
    const svcLabel = f.elements.service?.selectedOptions?.[0]?.textContent?.trim();
    if (svcLabel) lines.push(`Service: ${svcLabel}`);
    if (service === "bid") {
      if (val(f, "bidDue")) lines.push(`Bid due: ${val(f, "bidDue")}`);
      if (val(f, "bidLink")) lines.push(`Bid documents: ${val(f, "bidLink")}`);
    }
    if (timing) lines.push(`Timing: ${f.elements.timing.selectedOptions[0].textContent.trim()}`);
    if (budget) lines.push(`Budget: ${f.elements.budget.selectedOptions[0].textContent.trim()}`);
    lines.push(`Language: ${document.documentElement.lang}`);
    return {
      contactName: val(f, "contactName"), contactEmail: val(f, "contactEmail"), contactPhone: opt(val(f, "contactPhone")),
      companyName: opt(val(f, "companyName")), trade: val(f, "trade") || "general_contracting", region: val(f, "region"),
      city: val(f, "city"), addressLine1: opt(val(f, "addressLine1")),
      scope: `${val(f, "scope")}\n\n${lines.join("\n")}`.slice(0, 5000),
      urgency: f.querySelector("input[name=urgency]:checked")?.value || "standard",
      website: val(f, "website"),
    };
  }
  function partnerBody(f) {
    return {
      kind: f.querySelector("input[name=kind]:checked")?.value || "contractor",
      companyName: val(f, "companyName"), contactName: val(f, "contactName"), contactEmail: val(f, "contactEmail"),
      contactPhone: opt(val(f, "contactPhone")), city: opt(val(f, "city")),
      trades: $$("input[name=trades]:checked", f).map((i) => i.value), regions: $$("input[name=regions]:checked", f).map((i) => i.value),
      yearsInBusiness: int(val(f, "yearsInBusiness")), crewSize: int(val(f, "crewSize")), companyWebsite: opt(val(f, "companyWebsite")),
      capabilities: val(f, "capabilities"), website: val(f, "website"),
    };
  }
})();
