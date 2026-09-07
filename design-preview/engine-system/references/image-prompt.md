# 模组视觉素材

生成方式：内置 ImageGen；依据产品结构图与拆解帧重新表现计算模组外形。

输出：`../media/compute-modules-v3.png`。网页用 CSS 取景分别展示两个模组，原始生成图片保留完整。

这是一张生成的产品示意素材，不是实拍，也不是逐器件或逐尺寸的 CAD 复刻。载板网络连接关系单独依据原理图绘制，未交给图片模型生成。

## 完整提示词

```text
Use case: precise-object-edit / product-mockup.
Create a premium photographic hardware illustration for the existing RM-01 black product website using the TWO referenced product exploded views as factual shape references. The output is a wide landscape 3:2 image containing ONLY TWO distinct REAL COMPUTER MODULE ASSEMBLIES from those images, separately isolated against exact pure black #000000.

LEFT HALF: faithfully extract and reconstruct the larger NVIDIA Jetson AGX inference module visible immediately left of the tall black carrier PCB, the UPPER of the two computing modules in the source. Preserve its recognizable rectangular SILVER thermal transfer plate / frame, four corner mounting points, exposed central package region and underlying thin dark PCB. It must look like a complete embedded computing MODULE, with metal frame, screws, board edges, and supporting electronic components, never a giant square microchip. Approximate real proportions 100 x 87mm. Do not add a heatsink fin tower.
RIGHT HALF: faithfully extract and reconstruct the smaller LattePanda Mu x86 module visible directly BELOW that larger module in the source. This is a compact landscape rectangle, black PCB with a central small silver processor package, supporting black memory components, tiny passive components, four small mounting holes, and a fine gold board-edge connector. It must clearly read as a complete circuit board computer and have a different silhouette from the left module. Approximate actual proportions 69.6 x 60mm. It is visibly smaller than the left module.

Both assemblies shown facing the viewer at a very shallow three-quarter product photography angle, nearly front-on, with subtle depth visible along bottom and right edges. Orient their board edges horizontal, no extreme isometric diamonds. Both centered vertically. Left assembly centered at x=25%, y=50%, fitting entirely inside x=5%-44%; right centered at x=75%, y=50%, fitting entirely inside x=59%-91%. Leave a wide pure black gap between them so the web layout can separate them. Fine soft platinum rim lighting; natural metal roughness; dark electronic packages; crisp real component detail. Quiet, exact, meticulous, high-end studio product rendering, no glowing circuitry, no fog, no blue/purple, no floor or pedestal.

Preserve the identity and construction of the two REAL modules in the references. REMOVE ALL housings, fan, carrier motherboard, LED panel, loose memory cards, caption text, annotation lines, logo, and other parts from the source images. Do not invent an alternative computer. Do not print any words, symbols, labels, numbers, circuitry trails, network connections, decorative boxes, or brand logo. ONLY the TWO real module assemblies on pure black. No storage drives are being requested in this asset.
```
