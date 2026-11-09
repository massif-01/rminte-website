export function latestRejectionReason(events) {
  return (
    events.filter((event) => event.action === "progress.reject").at(-1)
      ?.details.reason || ""
  );
}

export function emailLanguage(language = "zh") {
  return language.toLowerCase().split("-")[0] === "zh" ? "zh" : "en";
}

export function rejectionEmail({ publicNo, original, reason }, language = "zh") {
  if (emailLanguage(language) === "en")
    return {
      recipient: original.email,
      subject: `[RMinte] Demo unit application not approved — ${publicNo}`,
      body: [
        `Dear ${original.company},`,
        "",
        "Your demo unit loan application has not been approved following review. The details are below:",
        "",
        `Application number: ${publicNo}`,
        `Requested model: ${original.model}`,
        "",
        "Reason:",
        reason,
        "",
        "For questions, please contact support@rminte.com.",
        "",
        "RMinte",
      ].join("\n"),
    };
  return {
    recipient: original.email,
    subject: `【RMinte 样机申请未通过】${publicNo}`,
    body: [
      `${original.company}，您好：`,
      "",
      "您的样机借用申请本次审核未通过，相关信息如下：",
      "",
      `申请编号：${publicNo}`,
      `申请型号：${original.model}`,
      "",
      "未通过原因：",
      reason,
      "",
      "如有疑问，请联系 support@rminte.com。",
      "",
      "RMinte",
    ].join("\n"),
  };
}
