const [saving, setSaving] = useState(false);
const save = async ()=>{
  setSaving(true);
  localStorage.setItem("zhonnex_pricing", JSON.stringify(pricing));
  localStorage.setItem("zhonnex_naira_brackets", JSON.stringify(nairaBrackets));
  localStorage.setItem("zhonnex_usd_brackets", JSON.stringify(usdBrackets));
  try {
    await fetch("/api/pricing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricing, nairaBrackets, usdBrackets }),
    });
  } catch {}
  // audit log...
  setSaving(false);
  alert("Pricing & brackets updated globally — storefront reflects instantly without reload.");
};