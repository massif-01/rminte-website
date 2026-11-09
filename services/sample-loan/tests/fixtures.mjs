export const application = {
  applicant: {
    type: "company",
    name: "集成验证经销商",
    contactName: "龚睿",
    phone: "+86 13800000000",
    email: "loan@example.com",
    creditCode: "91510100MA00000000",
    registeredAddress: "成都高新区测试注册地址",
    contactAddress: "成都测试联系地址",
  },
  shipping: {
    recipientName: "龚睿",
    recipientPhone: "+86 13800000000",
    address: "成都收货地址",
  },
  modelKey: "rm01-t5000-128g",
  requestedDays: 15,
};
export function draft() {
  const day = new Date().toISOString().slice(0, 10);
  return {
    ...structuredClone(application),
    requestedDays: undefined,
    identity: { notes: "隔离样本，已核对主体及授权", verified: true },
    schedule: {
      startsAt: day + "T01:00:00.000Z",
      dueAt: new Date(
        Date.parse(day + "T15:59:59Z") + 15 * 86400000,
      ).toISOString(),
    },
    quote: { deposit: { currency: "CNY" }, fx: null },
    payment: {
      expectedPayer: application.applicant.name,
      thirdPartyNotes: null,
    },
    billingBasis: { value: { currency: "CNY", amountMinor: "5000000" } },
    equipment: {
      card: { specification: "测试存储卡 1TB PCIe", serial: "CARD-001" },
      defaultAccountInfo: "用户：test\n密码： a | $& <xx> ",
      accessories: "机器、卡、电源、包装",
      outboundInspection: "无划伤、配件齐全",
    },
    outbound: {
      carrier: "顺丰",
      trackingNumber: "TEST-001",
      insuranceReference: "TEST-INS-001",
      inspectedAt: null,
    },
    returnTo: {
      recipientName: "样机收件处",
      phone: "13800000000",
      address: "成都测试厂家地址",
    },
    lender: {
      name: "测试出借方",
      representative: null,
      phone: "13800000000",
      email: "support@example.com",
      address: "成都厂家地址",
    },
    agreementDate: day,
    approval: { note: null },
    attachments: { note: null },
  };
}
