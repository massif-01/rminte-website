# 首页推理引擎与整机协同预览

本目录是放入完整首页的独立设计预览，尚未确认用于生产，也没有发布。正式站点源码与设计规范没有修改。

从仓库根目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，打开：

- 中文：`http://127.0.0.1:8765/design-preview/engine-system/?lang=zh#engine`
- 整机协同：桌面左侧放标题、原有说明与四个功能标签，右侧为紧凑芯片场景。推理与应用计算芯片经各自 MAC / PHY 接入板载交换机，ESP32-S3 经 W5500 接入；两台计算机各有从属的存储元素。
- 图形使用 SVG 绘制平面芯片、透明内层、细颗粒与引脚；去掉厚度、阴影和透视。芯片错位分布，线束沿留白折返；推理阵列、应用芯片分区、交换矩阵、MCU 与网卡采用不同内部示意。图形不是实际裸片版图、封装脚数或 PCB 布局。手机重新安排位置与线路，保持连接关系。
- ESP32-S3 增加自己的配置存储，安全配置包保存在其中的事实由用户明确补充。功能对应：配置驱动硬件强调 ESP32-S3；安全配置包强调配置存储；南北向控制强调网络线路；OTA 与自动化强调 ESP32-S3 和网络线路。
- 桌面图内 CUDA / x86 为 17px，TianshanOS 为 21px（SVG 设计坐标字号；手机有单独补偿字号），缩小文字后让内部结构成为视觉主体。
- 推理引擎保留上一版已认可的图形和交互，只将 `RMinte Inference` 中的 `RMinte` 改为现有 Quantify RM 品牌字体；KV Cache 主题的标签保持原样。
- 首页原有三段引擎说明、四段系统说明直接读取生产 `assets/site-data.js`，不改写生产文案。
- 原首页视频、结构分解、宝石点亮、工艺与页脚保留。新增图形与交互样式只在 `.visual-preview` 下生效。

`build-preview.py` 从生产首页生成 `index.html` 和隔离的 `page-main.js`；章节来自 `sections.html`，新增样式和行为位于 `preview.css` / `preview.js`。

## 架构证据与限制

用户提供：[RMinte/RM-MB-V1](https://github.com/RMinte/RM-MB-V1/tree/main/RM-MB-V1)。本次核对提交 `8148cb860aafbf414d0102298ec3dcf13b47f839`。该提交文件树中未找到独立 BOM 表格；核对的是器件原理图、17 页原理图 PDF、PCB 总览与 STEP 文件。

原理图：[PT-15-V1.0.PDF](https://github.com/RMinte/RM-MB-V1/blob/8148cb860aafbf414d0102298ec3dcf13b47f839/RM-MB-V1/PT-15-V1.0.PDF)。以下页码为 PDF 物理页序：

| 页面 | 可核实关系 |
| --- | --- |
| 5 | Orin 的 RGMII / RTL8211FDI 电路；MDI 侧串联电阻 R207-R215（不含未使用编号）标为 NC |
| 6 | Orin 的 PCIe / RTL8111H 网络接口 |
| 7、9 | N100 应用模组的 PCIe / RTL8111H 网络接口 |
| 10 | ESP32-S3 通过 SPI 连接 W5500；W5500 连接以太网收发线路 |
| 14 | RTL8367RB-VB-CG 交换芯片；P1 对应 N100，P3 对应 W5500，P4 对应 Orin；Orin 端同时保留 RTL8211 与 RTL8111 网络名 |

图中采用原理图里没有标 NC 断开的 RTL8111H 路径作为参考连接，不把两种备选接口画成同时工作的两条连接。这是依据公开原理图的推断，不能替代实际装配 BOM 或证明所有硬件批次相同。图中只表达本次讨论的三条内部链路，不枚举 USB 网络和扩展接口，也不表示真实元件位置、PCB 走线或所有供电 / GPIO 控制路径。

[WIZnet W5500 官方资料](https://docs.wiznet.io/Product/Chip/Ethernet/W5500)确认其集成 Ethernet MAC / PHY，并通过 SPI 连接 MCU。

另外核对 [RMinte-AI/TianshanOS](https://github.com/RMinte-AI/TianshanOS/tree/d6ed947a592265fa12754828bc79803fc50c1db2)：

- `boards/rm01_esp32s3/board.json`：ESP32-S3 与 W5500 外设。
- `boards/rm01_esp32s3/pins.json`：GPIO 17 的 `RTL8367_RST` 定义。
- `components/ts_net/src/ts_eth.c`：W5500 驱动初始化。
- `components/ts_drivers/src/ts_device_ctrl.c`：计算模组的 GPIO 电源 / 复位控制独立于网络互联。

两台计算机各有存储的归属关系来自用户本次明确说明。当前页面不引用之前生成的任何模组或芯片图片；`media/` 与 `references/image-prompt.md` 只保留已放弃方案的讨论材料。

## 验证记录

2026-09-06，本轮实际浏览器检查：

- 默认桌面 1280 × 720：中英文的标题、芯片关系与功能说明可在一屏内同时查看。1440px 桌面、768px 平板以及 390px / 320px 手机的代表中英文状态无整页水平溢出；手机图形重新排布。
- 计算后的字体与字体加载状态确认 `RMinte` 使用 Quantify RM / 700，`Inference` 使用 Geist；引擎主题切换后仍正确。三个引擎入口与 Enter 切换保持可用。
- 四个系统标签、方向键与焦点同步，只有一个内容面板显示；图形强调随当前标签更新，切换语言保留选中项。补充配置存储后逐项检查：配置驱动对应 MCU、安全配置包对应存储、南北向对应线路、OTA 对应 MCU 与线路，计算后的透明度符合映射。
- `?motion=reduce` 下新图形的计算后 transition-duration 为 0s，内容可见；CSS 同时支持系统 `prefers-reduced-motion`。未修改用户系统偏好。
- 浏览器控制台无 error / warn。JavaScript 语法和差异空白检查通过。正式站点没有本次修改。

同一预览的上轮已检查首页视频播放、结构分解起止 / 中间 / 回退、宝石由暗到亮与全部四段工艺切换。本轮保持这些章节、媒体和主脚本生成方式不变，没有重复整套未受影响的媒体检查。

这些验证针对本地预览，不表示已上线验证或设计已获批准。
