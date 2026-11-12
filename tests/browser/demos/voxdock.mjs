import {expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

export default async function({page,frame,caseName,reopen,language,width}){
  expect(caseName).toBe(language==='zh'?'AI录音卡片会议总结':'AI Recording Card Meeting Summaries');
  const heading=frame.locator('h1');
  const dialog=frame.locator('#dialog');
  const details=frame.locator('#recordDialog');
  const button=(name,root=frame)=>root.getByRole('button',{name,exact:true});
  const nav=async(id,title)=>{
    const menu=frame.getByRole('button',{name:'打开导航'});
    if(await menu.isVisible())await menu.click();
    await frame.locator(`#navigation [data-page="${id}"]`).click();
    await expect(heading).toHaveText(title);
  };
  const openRecord=id=>frame.locator(`button[data-record="${id}"]`).first().click();
  const closeDetails=()=>button('关闭详情',details).click();
  const toast=text=>expect(frame.locator('#toast')).toContainText(text);
  await expect(heading).toHaveText('录音接入');
  await expect(frame.locator('#connectionStatus')).toHaveText('演示数据');
  await openRecord('meeting-01');
  await expect(details).toContainText('会议录音卡片');
  if(reopen){await closeDetails();return;}
  await button('查看逐字稿',details).click();
  await expect(heading).toHaveText('归档文件');
  await expect(frame.locator('#transcriptReader')).toContainText('会议总结（演示）');
  await button('目录说明').click();
  await expect(dialog).toBeVisible();
  await dialog.getByText('技术接线与目录',{exact:true}).click();
  await expect(dialog.getByText('/demo/archive',{exact:true})).toBeVisible();
  await dialog.locator('#dialogTitle').press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('#case-demo-modal')).toBeVisible();
  await nav('devices','录音设备');
  await frame.locator('.page-head [data-action="add-device"]').click();
  await expect(dialog.getByLabel('设备名称')).toBeVisible();
  await button('取消',dialog).click();
  await nav('connections','服务连接');
  await expect(frame.getByLabel('Speakr 访问地址')).toHaveValue('https://speakr.example');
  await nav('events','运行记录');
  await frame.locator('.event-row [data-record="meeting-03"]').click();
  await expect(details).toContainText('培训执行例会');await closeDetails();
  if(language!=='zh'||width!==1440)return;

  await nav('recordings','录音接入');
  await frame.locator('#recordSearch').fill('培训物料检查');
  await expect(frame.locator('#recordRows .record-title')).toHaveCount(1);
  await frame.locator('#recordSearch').fill('');
  await frame.locator('#ownerFilter').selectOption('2');
  await expect(frame.locator('#recordRows .record-title')).toHaveCount(3);
  await frame.locator('#ownerFilter').selectOption('all');
  await frame.locator('[data-filter="failed"]').click();
  await expect(frame.locator('#recordRows .record-title')).toHaveCount(2);
  await frame.locator('[data-filter="all"]').click();
  await openRecord('meeting-03');
  await button('重转写原录音',details).click();await expect(details.locator('#recordFeedback')).toContainText('可查看归档');
  await closeDetails();
  await openRecord('meeting-05');await button('为此录音分配人员',details).click();
  await dialog.locator('#recordingUser').selectOption('1');await dialog.locator('#folder').selectOption('2');
  await button('保存人员归属',dialog).click();await expect(details).toContainText('演示人员甲');await closeDetails();
  await openRecord('meeting-06');await details.locator('#remoteId').fill('106');
  await button('核实引用并关联',details).click();await expect(details).not.toBeVisible();
  await openRecord('meeting-07');await button('修正此录音分类',details).click();
  await dialog.locator('#folder').selectOption('2');await button('保存此录音分类',dialog).click();
  await expect(details).toContainText('项目例会');await button('投递此录音',details).click();
  await expect(details.locator('#recordFeedback')).toContainText('可查看归档');await closeDetails();

  await nav('devices','录音设备');
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await button('复制地址').click();await toast('地址已复制');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('http://voxdock.example:8766');
  await frame.locator('.page-head [data-action="add-device"]').click();
  await dialog.getByLabel('设备名称').fill('演示新卡');
  await dialog.locator('#deviceUser').selectOption('2');
  await dialog.locator('#folder').selectOption('1');
  await dialog.getByLabel('待跟进').check();
  await button('登记设备并生成凭证',dialog).click();
  await expect(dialog.locator('#deviceCredential')).toHaveValue('00000001');await button('完成',dialog).click();
  const card=frame.locator('.device-card').filter({hasText:'演示新卡'});
  await card.locator('[data-edit-device]').click();await dialog.getByLabel('设备名称').fill('演示新卡（已编辑）');
  await button('保存设备设置',dialog).click();await expect(card).toContainText('已编辑');
  await card.locator('[data-edit-device]').click();await dialog.getByText('设备凭证与编号',{exact:true}).click();
  await button('更换设备凭证',dialog).click();await expect(dialog.locator('#deviceCredential')).toHaveValue('00000002');await button('完成',dialog).click();
  await card.locator('[data-remove-device]').click();await button('取消',dialog).click();await expect(card).toBeVisible();
  await card.locator('[data-remove-device]').click();await button('确认移除',dialog).click();await expect(card).toHaveCount(0);
  await frame.locator('[data-associate="1"]').click();
  await button('查看演示授权',dialog).click();await expect(dialog.getByText(/授权码 demo-person 已填入/)).toBeVisible();
  await button('核实姓名',dialog).click();await expect(dialog.locator('#personPreview')).toContainText('演示人员甲');
  await button('确认更新授权',dialog).click();await toast('该人员授权已更新');
  await button('关联已有人员').click();await button('核实姓名',dialog).click();await button('确认关联',dialog).click();
  await expect(frame.locator('.person-row').filter({hasText:'演示人员 3'})).toBeVisible();
  await frame.locator('[data-assign="3"]').click();await expect(dialog.locator('#deviceUser')).toHaveValue('3');await button('取消',dialog).click();
  await frame.locator('[data-unlink-person="3"]').click();await button('确认解除关联',dialog).click();
  await expect(frame.locator('.person-row').filter({hasText:'演示人员 3'})).toHaveCount(0);

  await nav('connections','服务连接');
  await frame.getByLabel('部署备注（不会修改推理配置）').fill('验收用演示配置');
  await button('保存连接设置').click();await toast('已保存到本次演示');
  await frame.getByText('查看归档目录与部署说明',{exact:true}).click();await expect(frame.getByLabel('归档根目录（只读）')).toHaveValue('/demo/archive');
  await button('查看人员和设备').click();await expect(heading).toHaveText('录音设备');
  await nav('connections','服务连接');await expect(frame.getByLabel('部署备注（不会修改推理配置）')).toHaveValue('验收用演示配置');

  await nav('archive','归档文件');
  await frame.locator('[data-archive="2/meeting-08"]').click();await expect(frame.locator('.document-body h2')).toHaveText('培训准备会');
  await frame.getByText('来源与内容校验',{exact:true}).click();await expect(frame.getByText('AAC SHA-256',{exact:true})).toBeVisible();
  for(const [label,extension] of [['下载文本','.md'],['下载音频','.aac']]){
    const pending=page.waitForEvent('download');await button(label).click();const download=await pending;
    expect(download.suggestedFilename()).toMatch(new RegExp(extension.replace('.','\\.')+'$'));
    const content=await readFile(await download.path());
    if(extension==='.md')expect(content.toString()).toContain('会议总结（演示）');
    else {expect(content.length).toBeGreaterThan(1000);expect(content[0]).toBe(255);}
  }
  await button('目录说明').click();await button('检查全部录音任务',dialog).click();await toast('已检查全部录音任务');
  await dialog.locator('#dialogTitle').press('Escape');
  await nav('events','运行记录');await expect(frame.locator('.event-row').first()).toContainText('已检查当前演示录音');

  await frame.locator('.topbar [data-action="about"]').click();await button('刷新状态',dialog).click();
  await expect(dialog.locator('#refreshFeedback')).toContainText('已刷新演示状态');
  await button('管理员账号',dialog).click();await button('修改密码',dialog).click();
  await dialog.locator('#currentPassword').fill('demo-access');
  await dialog.locator('#newPassword').fill('demo-updated');await dialog.locator('#confirmPassword').fill('demo-updated');
  await button('保存新密码',dialog).click();await expect(dialog.locator('#dialogTitle')).toHaveText('密码已更新');await button('完成',dialog).click();
  await button('demo · 账号设置').click();await button('退出登录',dialog).click();await expect(heading).toHaveText('管理员登录');
  await frame.locator('#password').fill('demo-updated');await button('登录').click();await expect(heading).toHaveText('运行记录');
  expect(await frame.locator('body').evaluate(()=>performance.getEntriesByType('resource').filter(e=>['fetch','xmlhttprequest'].includes(e.initiatorType)).map(e=>e.name))).toEqual([]);
}
