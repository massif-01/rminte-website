// Keep the copy operation inside the click gesture, including in Safari dialogs.
export async function copyEmailText(text, dialog) {
  const previous = document.activeElement;
  const source = document.createElement("textarea");
  source.value = text;
  source.readOnly = true;
  source.setAttribute("aria-hidden", "true");
  source.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none";
  dialog.append(source);
  let copied = false;
  try {
    source.focus({ preventScroll: true });
    source.select();
    copied = document.execCommand?.("copy") === true;
  } finally {
    source.remove();
    previous?.focus({ preventScroll: true });
  }
  if (!copied) await navigator.clipboard.writeText(text);
}
