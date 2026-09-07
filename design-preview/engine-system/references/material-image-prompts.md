# 芯片材质样张素材

使用内置 imagegen，来源为用户指定的双计算模组参考插画。生成图只用于本地材质讨论。

选用资产：
- `../media/soc-gold-assembly.png`：完整金色边框、框内深色基底与中央硅片。生成结果没有真实 alpha，页面通过 CSS 取景到组件矩形边界，未作程序化位图编辑。
- `../media/soc-package-cutout.png`：绿色封装基板与银色顶盖，RGBA 透明背景。

## 左侧完整组件提取提示词

Use case: background-extraction. Edit target: the attached image of two computer modules. CORRECT EXTRACTION BOUNDARY: extract the ENTIRE CENTRAL GOLD-FRAMED PROCESSOR ASSEMBLY from the LEFT computer module. Include the LARGE gold/beige rectangular metal frame (roughly x282–562 y342–630 in the 1536x1024 reference), the complete dark gray square carrier inside the gold frame, all tiny contacts on that carrier, AND the small central exposed iridescent silicon die. The gold frame is REQUIRED and must remain fully intact around all four sides. This is the whole central processor assembly, NOT just the tiny silicon die. Remove only everything OUTSIDE that gold frame assembly: the much larger outer silver chassis/support bracket, silver screw holes, outer black memory packages, base PCB, and entire right module. Preserve original geometry, nearly square proportions, fine microcircuit texture, restrained pale gold frame and neutral dark carrier colors, with original straight-on overhead camera and soft studio illumination. A single standalone assembly cutout on REAL TRANSPARENT background, tightly centered on a square canvas with approximately 5 percent transparent margin, no extra shadow or environment. No labels, no added pins, no redesign. Keep the same nested structure of gold outer frame, dark inner square and small silicon die, rather than enlarging the die to fill the frame.

## 左侧背景处理提示词

Edit this exact gold-framed processor cutout. Keep the entire object COMPLETELY unchanged: gold outer frame, inner dark gray carrier, tiny components, central silicon die, original colors and proportions. Remove the light checkerboard background completely. It is currently painted into an RGB image and is NOT transparent. Deliver a PNG with a REAL alpha channel: all pixels outside the processor must have alpha zero, no checkerboard pixels, no white backdrop, no black backdrop, no outside shadow. Tightly crop the CANVAS framing so the object's long dimension occupies about 90 percent of the image, with equal transparent margins. Do not crop any part of the gold border. Do not redraw or alter the object. No other objects or text.

## 右侧组件提取提示词

Use case: background-extraction. Edit target: the attached image of two computer modules. Extract ONLY the processor package centered in the RIGHT module: the dark green rectangular small substrate with the tall brushed silver metal heat spreader in its center, including the minute contacts/components belonging to that green package (roughly x1038–1253 y455–687 in the 1536x1024 reference). Remove the outer full black PCB board, mounting holes, gold edge connector, outer memory chips, and the entire left module. Preserve the green package boundary and centered silver lid, brushed silver surface, fine component details, original portrait proportions, straight-on overhead camera, and original neutral studio illumination. Produce this SINGLE standalone processor cutout on REAL TRANSPARENT background, centered and as large as possible on a square canvas with about 5 percent transparent margin around the long dimension. No environment, no outside cast shadow, no text, no added pins or new components. This is an asset extraction for an interactive material study, not a new hardware design.
