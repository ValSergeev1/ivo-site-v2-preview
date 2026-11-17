/* IVO contractor trades: searchable multi-select picker.
   Catalog matches ivo-platform src/shared/vocab.ts (40 trades, 5 groups). */
(function(){
  const GROUPS = [
  {
    "id": "general",
    "label": "General & coordination",
    "trades": [
      "general_contracting",
      "project_management",
      "handyman"
    ]
  },
  {
    "id": "interiors",
    "label": "Interiors & finishes",
    "trades": [
      "carpentry",
      "drywall",
      "painting",
      "flooring",
      "tile",
      "ceilings",
      "doors_hardware",
      "millwork",
      "insulation",
      "storefront_glazing"
    ]
  },
  {
    "id": "structure",
    "label": "Structure, exterior & site",
    "trades": [
      "roofing",
      "concrete",
      "masonry",
      "demolition",
      "welding",
      "paving",
      "fencing",
      "signage"
    ]
  },
  {
    "id": "systems",
    "label": "Building systems",
    "trades": [
      "plumbing",
      "drain_jetting",
      "hvac",
      "refrigeration",
      "electrical",
      "low_voltage",
      "fire_life_safety",
      "appliance_repair"
    ]
  },
  {
    "id": "property",
    "label": "Property services & emergency",
    "trades": [
      "locksmith",
      "janitorial",
      "landscaping",
      "pressure_washing",
      "snow_removal",
      "pest_control",
      "restoration",
      "board_up",
      "environmental",
      "fire_watch",
      "security"
    ]
  }
];
  const LABELS = {
  "id": "property",
  "label": "Property services & emergency",
  "general_contracting": "General contracting",
  "project_management": "Project management",
  "handyman": "Handyman",
  "carpentry": "Carpentry",
  "drywall": "Drywall",
  "painting": "Painting",
  "flooring": "Flooring",
  "tile": "Tile",
  "ceilings": "Ceilings / ACT",
  "doors_hardware": "Doors & hardware",
  "millwork": "Millwork / cabinetry",
  "insulation": "Insulation",
  "storefront_glazing": "Storefront / glazing",
  "roofing": "Roofing",
  "concrete": "Concrete",
  "masonry": "Masonry",
  "demolition": "Demolition",
  "welding": "Welding / metal",
  "paving": "Paving / striping",
  "fencing": "Fencing",
  "signage": "Signage",
  "plumbing": "Plumbing",
  "drain_jetting": "Drain jetting & grease trap",
  "hvac": "HVAC",
  "refrigeration": "Refrigeration",
  "electrical": "Electrical",
  "low_voltage": "Low voltage",
  "fire_life_safety": "Fire / life safety",
  "appliance_repair": "Appliance repair",
  "locksmith": "Locksmith",
  "janitorial": "Janitorial",
  "landscaping": "Landscaping",
  "pressure_washing": "Pressure washing",
  "snow_removal": "Snow removal",
  "pest_control": "Pest control",
  "restoration": "Restoration",
  "board_up": "Board-up",
  "environmental": "Environmental / asbestos",
  "fire_watch": "Fire watch",
  "security": "Security coordination"
};
  const ALIASES = {
  "general_contracting": [
    "GC",
    "general contractor",
    "tenant improvement",
    "TI",
    "build-out",
    "renovation"
  ],
  "project_management": [
    "PM",
    "coordination",
    "multi-trade"
  ],
  "handyman": [
    "general repair",
    "maintenance",
    "punch list",
    "turnover"
  ],
  "carpentry": [
    "framing",
    "finish work",
    "trim"
  ],
  "drywall": [
    "sheetrock",
    "gypsum",
    "taping"
  ],
  "painting": [
    "paint",
    "coating"
  ],
  "flooring": [
    "carpet",
    "LVT",
    "vinyl",
    "wood floor"
  ],
  "tile": [
    "ceramic",
    "porcelain",
    "stone tile"
  ],
  "ceilings": [
    "ACT",
    "acoustical",
    "t-bar",
    "drop ceiling",
    "soffit"
  ],
  "doors_hardware": [
    "doors",
    "frames",
    "hardware",
    "storefront doors"
  ],
  "millwork": [
    "cabinetry",
    "cabinets",
    "casework",
    "custom wood"
  ],
  "insulation": [
    "thermal",
    "spray foam"
  ],
  "storefront_glazing": [
    "glass",
    "glazing",
    "windows",
    "curtain wall"
  ],
  "roofing": [
    "roof",
    "membrane",
    "shingle",
    "gutter"
  ],
  "concrete": [
    "slab",
    "flatwork",
    "sidewalk"
  ],
  "masonry": [
    "brick",
    "block",
    "CMU",
    "stone"
  ],
  "demolition": [
    "demo",
    "removal",
    "tear-out"
  ],
  "welding": [
    "metal",
    "steel",
    "misc metals"
  ],
  "paving": [
    "asphalt",
    "striping",
    "parking lot"
  ],
  "fencing": [
    "fence",
    "gates"
  ],
  "signage": [
    "signs",
    "installation",
    "division 10"
  ],
  "plumbing": [
    "pipe",
    "drain",
    "fixture",
    "water heater"
  ],
  "drain_jetting": [
    "grease trap",
    "jetting",
    "hydro jet",
    "drain clean"
  ],
  "hvac": [
    "mechanical",
    "heating",
    "cooling",
    "air conditioning",
    "RTU"
  ],
  "refrigeration": [
    "cooler",
    "freezer",
    "walk-in"
  ],
  "electrical": [
    "lighting",
    "power",
    "panel",
    "wiring"
  ],
  "low_voltage": [
    "data",
    "telecom",
    "security cabling",
    "AV",
    "access control wiring"
  ],
  "fire_life_safety": [
    "fire alarm",
    "sprinkler",
    "fire sprinkler",
    "life safety"
  ],
  "appliance_repair": [
    "restaurant equipment",
    "generators",
    "kitchen equipment"
  ],
  "locksmith": [
    "locks",
    "rekey",
    "keys"
  ],
  "janitorial": [
    "cleaning",
    "custodial",
    "post-construction cleaning"
  ],
  "landscaping": [
    "irrigation",
    "trees",
    "lawn",
    "grounds"
  ],
  "pressure_washing": [
    "power washing",
    "soft wash"
  ],
  "snow_removal": [
    "snow",
    "ice",
    "de-icing"
  ],
  "pest_control": [
    "exterminator",
    "pest"
  ],
  "restoration": [
    "water damage",
    "fire damage",
    "mitigation",
    "mold"
  ],
  "board_up": [
    "board up",
    "temporary securing",
    "emergency board-up"
  ],
  "environmental": [
    "asbestos",
    "lead",
    "hazmat",
    "abatement"
  ],
  "fire_watch": [
    "firewatch"
  ],
  "security": [
    "unarmed security",
    "guard"
  ]
};

  function searchText(id){
    return [id, LABELS[id]||"", ...(ALIASES[id]||[])].join(" ").toLowerCase();
  }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $$(sel, root){ return [...(root||document).querySelectorAll(sel)]; }

  function mount(el){
    if(el.dataset.mounted) return;
    el.dataset.mounted = "1";
    const name = el.getAttribute("data-name") || "trades";
    const required = el.hasAttribute("data-require-one") || el.dataset.require === "true";
    const search = document.createElement("input");
    search.type = "search";
    search.className = "trade-search";
    search.placeholder = "Search trades";
    search.setAttribute("aria-label", "Search trades");
    search.autocomplete = "off";
    const chips = document.createElement("div");
    chips.className = "trade-chips";
    chips.setAttribute("aria-live", "polite");
    const list = document.createElement("div");
    list.className = "trade-list";
    list.setAttribute("role", "group");
    list.setAttribute("aria-labelledby", el.getAttribute("data-labelledby") || "");

    const hidden = document.createElement("div");
    hidden.className = "trade-hidden";
    function picked(){ return el._picked || []; }
    function setPicked(ids){
      const seen = new Set();
      el._picked = ids.filter(id => LABELS[id] && !seen.has(id) && seen.add(id));
      hidden.innerHTML = "";
      el._picked.forEach(id => {
        const i = document.createElement("input");
        i.type = "hidden";
        i.name = name;
        i.value = id;
        hidden.appendChild(i);
      });
      renderChips();
      $$("input[type=checkbox]", list).forEach(box => {
        box.checked = el._picked.includes(box.value);
        box.closest("label")?.classList.toggle("on", box.checked);
      });
    }
    function renderChips(){
      const ids = picked();
      chips.innerHTML = "";
      ids.forEach(id => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "trade-chip";
        b.innerHTML = (LABELS[id]||id) + ' <span aria-hidden="true">×</span>';
        b.setAttribute("aria-label", "Remove " + (LABELS[id]||id));
        b.addEventListener("click", () => setPicked(ids.filter(x => x !== id)));
        chips.appendChild(b);
      });
      if(ids.length){
        const n = document.createElement("span");
        n.className = "trade-count";
        n.textContent = ids.length + " selected";
        chips.appendChild(n);
      }
    }
    function paint(q){
      const needle = (q||"").trim().toLowerCase();
      list.innerHTML = "";
      let shown = 0;
      GROUPS.forEach(g => {
        const trades = g.trades.filter(id => !needle || searchText(id).includes(needle));
        if(!trades.length) return;
        const wrap = document.createElement("div");
        wrap.className = "trade-group";
        const h = document.createElement("div");
        h.className = "trade-ghd";
        h.textContent = g.label;
        wrap.appendChild(h);
        trades.forEach(id => {
          const lab = document.createElement("label");
          lab.className = "trade-opt";
          const box = document.createElement("input");
          box.type = "checkbox";
          box.value = id;
          box.checked = picked().includes(id);
          box.addEventListener("change", () => {
            const next = new Set(picked());
            if(box.checked) next.add(id); else next.delete(id);
            setPicked([...next]);
            el.dispatchEvent(new Event("change", {bubbles:true}));
          });
          if(box.checked) lab.classList.add("on");
          lab.append(box, document.createTextNode(LABELS[id]||id));
          wrap.appendChild(lab);
          shown++;
        });
        list.appendChild(wrap);
      });
      if(!shown){
        const empty = document.createElement("div");
        empty.className = "trade-empty";
        empty.textContent = needle ? ('No trades match "' + needle + '"') : "No trades";
        list.appendChild(empty);
      }
      renderChips();
    }
    el._picked = $$("input[name='"+name+"']:checked", el).map(i => i.value);
    search.addEventListener("input", () => paint(search.value));
    el.append(chips, search, list, hidden);
    setPicked(el._picked);
    paint("");
  }

  function field(form, name){
    const el = form.elements[name];
    if(!el) return "";
    if(el instanceof RadioNodeList || (el.length && el[0] && el[0].type==="radio")){
      const v = $("[name='"+name+"']:checked", form);
      return v ? v.value : "";
    }
    return (el.value||"").trim();
  }
  function checked(form, name){
    return $$("input[name='"+name+"']:checked", form).map(i => i.value);
  }

  function partnerPayload(form){
    const trades = checked(form, "trades").map(id => LABELS[id]||id);
    const regions = checked(form, "regions");
    return {
      form: "ivo-partner-application",
      kind: field(form, "kind") || "contractor",
      company: field(form, "company"),
      name: field(form, "name"),
      email: field(form, "email"),
      phone: field(form, "phone"),
      years: field(form, "years"),
      crew: field(form, "crew"),
      trades: trades.join(", ") || "(none selected)",
      regions: regions.join(", ") || "(none selected)",
      capabilities: field(form, "capabilities")
    };
  }

  function showErr(form, id, msg){
    const box = $(id, form) || $(id);
    if(box){ box.textContent = msg||""; }
  }

  function validatePartner(form){
    let ok = true;
    const require = (name, errId, msg) => {
      const el = form.elements[name];
      const v = field(form, name);
      const bad = !v;
      if(el && el.setAttribute) el.setAttribute("aria-invalid", bad ? "true" : "false");
      showErr(form, errId, bad ? msg : "");
      if(bad) ok = false;
    };
    require("company", "#pa-co-err", "Enter the company name.");
    require("name", "#pa-nm-err", "Enter a contact name.");
    require("email", "#pa-em-err", "Enter a valid email.");
    const email = field(form, "email");
    if(email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      showErr(form, "#pa-em-err", "Enter a valid email.");
      ok = false;
    }
    const kind = field(form, "kind") || "contractor";
    const trades = checked(form, "trades");
    const tradeErr = $("#trades-err", form);
    if(kind !== "vendor" && trades.length === 0){
      if(tradeErr) tradeErr.textContent = "Choose at least one trade.";
      ok = false;
    } else if(tradeErr) tradeErr.textContent = "";
    const regions = checked(form, "regions");
    const regionErr = $("#regions-err", form);
    if(regions.length === 0){
      if(regionErr) regionErr.textContent = "Choose at least one state.";
      ok = false;
    } else if(regionErr) regionErr.textContent = "";
    require("capabilities", "#pa-caps-err", "Describe the work or products you provide.");
    return ok;
  }

  function summary(data){
    const lines = [
      "IVO partner application",
      "",
      "Kind: " + data.kind,
      "Company: " + data.company,
      "Contact: " + data.name,
      "Email: " + data.email,
      "Phone: " + (data.phone || "(not provided)"),
      "Years in business: " + (data.years || "(not provided)"),
      "Crew size: " + (data.crew || "(not provided)"),
      "Trades: " + data.trades,
      "States: " + data.regions,
      "",
      "Capabilities:",
      data.capabilities
    ];
    return lines.join("\n");
  }

  function endpoint(){
    return String(window.IVO_FORM_ENDPOINT || window.IVO_PARTNER_FORM_ENDPOINT || "").trim();
  }

  async function submitPartner(form){
    const status = $("[data-form-status]", form) || $("#pa-status", form);
    if(!validatePartner(form)){
      if(status){ status.hidden = false; status.textContent = "Please fix the highlighted fields."; }
      const bad = form.querySelector("[aria-invalid=true], .trade-picker .err:not(:empty), #trades-err:not(:empty)");
      if(bad && bad.scrollIntoView) bad.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }
    const data = partnerPayload(form);
    const ep = endpoint();
    if(/^mailto:/i.test(ep)){
      const addr = ep.replace(/^mailto:/i,"").split("?")[0];
      const subject = encodeURIComponent("IVO partner application – " + data.name + " – " + data.company);
      const body = encodeURIComponent(summary(data));
      window.location.href = "mailto:" + addr + "?subject=" + subject + "&body=" + body;
      const done = form.parentElement && form.parentElement.querySelector("[data-form-done]");
      if(done){
        form.hidden = true;
        done.hidden = false;
        done.focus && done.focus();
        const title = done.querySelector("h2,h3");
        const p = done.querySelector("[data-done-body]") || done.querySelector("p.t2, p");
        if(p && !p.dataset.keep) p.textContent = "Your email app should open with the application filled in. Send that message to finish. If it did not open, email office@ivoservgroup.com.";
      } else if(status){
        status.hidden = false;
        status.textContent = "Your email app should open with the application filled in. Send that message to finish.";
      }
      return;
    }
    if(status){ status.hidden = false; status.textContent = "Sending…"; }
    if(!ep){
      if(status) status.textContent = "This form is not connected yet. Please email office@ivoservgroup.com.";
      return;
    }
    try {
      const res = await fetch(ep, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(data)});
      if(!res.ok) throw new Error("failed");
      form.hidden = true;
      const done = form.parentElement && form.parentElement.querySelector("[data-form-done]");
      if(done){ done.hidden = false; done.focus && done.focus(); }
    } catch(err){
      if(status){ status.hidden = false; status.textContent = "We couldn't send that just now. Please try again, or email office@ivoservgroup.com."; }
    }
  }

  function init(){
    $$("[data-trade-picker]").forEach(mount);
    $$("form[data-ivo-form=partner]").forEach(form => {
      if (form.getAttribute("data-demo") === "true") return;
      form.addEventListener("submit", ev => { ev.preventDefault(); submitPartner(form); });
    });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.IVO_TRADE_CATALOG = { GROUPS, LABELS, ALIASES, mount };
})();
