/* Shared topology and behavior for the two independent material review pages. */
window.RMReviewGraph = (() => {
  const layouts = {
    desktop: {
      width:700,height:500,
      nodes:[
        ['cuda',130,155,144,140,'CUDA','compute'],
        ['mcu',535,80,96,80,'ESP32-S3','management'],
        ['ethernet',385,70,68,58,'W5500','interface'],
        ['switch',305,280,116,100,'RTL8367RB','switch'],
        ['nic-cuda',90,350,58,54,'MAC/PHY','interface'],
        ['nic-x86',510,185,58,54,'MAC/PHY','interface'],
        ['x86',520,345,144,140,'x86','compute'],
        ['storage-cuda',260,142,72,34,'','storage'],
        ['storage-x86',648,433,72,34,'','storage'],
        ['config',645,135,70,32,'','config']
      ],
      // Every first/last segment is perpendicular to its package edge.
      routes:[
        ['bus','management-spi',[[487,80],[456,80],[446,70],[419,70]]],
        ['bus','management-config',[[583,80],[611,80],[645,114],[645,119]]],
        ['network','management-network',[[385,99],[385,137],[315,207],[315,230]]],
        ['bus','cuda-pcie',[[130,225],[130,263],[90,303],[90,323]]],
        ['network','cuda-network',[[119,350],[176,350],[232,294],[247,294]]],
        ['bus','x86-pcie',[[510,212],[510,239],[496,253],[496,275]]],
        ['network','x86-network',[[481,185],[430,185],[397,218],[397,246],[373,270],[363,270]]],
        ['bus','cuda-storage',[[202,155],[209,155],[222,142],[224,142]]],
        ['bus','x86-storage',[[592,350],[609,350],[648,389],[648,416]]]
      ],
      captions:[[130,61,'inference','title'],[535,14,'TianshanOS','brand'],[305,368,'network','small'],[520,462,'application','title'],[260,182,'storage','small'],[648,486,'storage','small'],[645,176,'config','small'],[159,257,'PCIe','bus'],[544,247,'PCIe','bus'],[455,54,'SPI','bus']]
    },
    mobile: {
      width:430,height:590,
      nodes:[
        ['mcu',275,90,90,80,'ESP32-S3','management'],
        ['ethernet',120,100,58,48,'W5500','interface'],
        ['cuda',95,220,118,110,'CUDA','compute'],
        ['switch',250,340,100,88,'RTL8367RB','switch'],
        ['nic-cuda',80,375,54,48,'MAC/PHY','interface'],
        ['nic-x86',325,210,54,48,'MAC/PHY','interface'],
        ['x86',270,475,118,112,'x86','compute'],
        ['storage-cuda',220,225,72,32,'','storage'],
        ['storage-x86',125,520,70,30,'','storage'],
        ['config',365,135,60,28,'','config']
      ],
      routes:[
        ['bus','management-spi',[[230,90],[184,90],[174,100],[149,100]]],
        ['bus','management-config',[[320,90],[341,90],[365,114],[365,121]]],
        ['network','management-network',[[120,124],[120,133],[171,133],[230,192],[277,192],[277,267],[250,294],[250,296]]],
        ['bus','cuda-pcie',[[95,275],[95,320],[80,335],[80,351]]],
        ['network','cuda-network',[[107,375],[145,375],[185,335],[200,335]]],
        ['bus','x86-pcie',[[352,210],[366,210],[378,222],[378,399],[348,429],[329,429]]],
        ['network','x86-network',[[298,210],[289,210],[289,283],[280,292],[280,296]]],
        ['bus','cuda-storage',[[154,220],[172,220],[177,225],[184,225]]],
        ['bus','x86-storage',[[211,491],[191,491],[162,520],[160,520]]]
      ],
      captions:[[275,25,'TianshanOS','brand'],[95,151,'inference','title'],[250,411,'network','small'],[270,570,'application','title'],[220,265,'storage','small'],[125,559,'storage','small'],[365,176,'config','small'],[118,312,'PCIe','bus'],[399,306,'PCIe','bus'],[191,72,'SPI','bus']]
    }
  };

  // Offset each segment along its normal. The two endpoint normals run along
  // package edges, so a parallel bundle cannot translate into a chip body.
  function offsetPath(points, offset) {
    const normals = points.slice(1).map((point,i) => {
      const dx=point[0]-points[i][0],dy=point[1]-points[i][1],length=Math.hypot(dx,dy);
      return [-dy/length,dx/length];
    });
    return points.map((point,i) => {
      let nx,ny;
      if(i===0) [nx,ny]=normals[0];
      else if(i===points.length-1) [nx,ny]=normals[i-1];
      else {
        const a=normals[i-1],b=normals[i],scale=1+a[0]*b[0]+a[1]*b[1];
        nx=(a[0]+b[0])/scale;ny=(a[1]+b[1])/scale;
      }
      return `${i?'L':'M'}${(point[0]+offset*nx).toFixed(2)} ${(point[1]+offset*ny).toFixed(2)}`;
    }).join(' ');
  }

  function render(lang) {
    const en=lang==='en', silicon=document.body.dataset.material==='silicon';
    const words={inference:en?'Inference computer':'推理计算机',application:en?'Application computer':'应用计算机',storage:en?'Dedicated storage':'独立存储',network:en?'Onboard Ethernet switch':'板载以太网交换机',config:en?'Config storage':'配置存储'};
    function scene(size) {
      const layout=layouts[size];
      const nodes=layout.nodes.map(([key,x,y,w,h,name,type]) => {
        if (!silicon && key==='mcu') name='ESP32';
        const owner=key.endsWith('-cuda')?words.inference:key.endsWith('-x86')?words.application:'';
        const partLabel=name||words[type==='config'?'config':'storage'];
        const details=en?`Inspect ${partLabel}${owner?` · ${owner}`:''}`:`查看${owner?`${owner}的`:''}${partLabel}细节`;
        const pattern=!silicon ? ({mcu:'controller',ethernet:'ethernet',switch:'switch','nic-cuda':'phy','nic-x86':'phy'}[key]||'') : '';
        const blocks=pattern ? {controller:3,ethernet:4,switch:5,phy:3}[pattern] : key==='cuda'?3:2;
        const image=silicon&&type==='compute' ? `<div class="part-image" aria-hidden="true">${key==='cuda'?'<div class="part-gold-crop"><img src="media/soc-gold-assembly.png" alt="" width="1254" height="1254"></div>':'<img src="media/soc-package-cutout.png" alt="" width="1254" height="1254">'}</div>` : `<div class="part-interior${pattern?` interior-${pattern}`:''}" aria-hidden="true">${'<i></i>'.repeat(blocks)}</div>`;
        return `<foreignObject x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" class="part-frame" data-node="${key}"><button xmlns="http://www.w3.org/1999/xhtml" type="button" class="review-part part-${type}" data-part="${key}" aria-label="${details}" aria-pressed="false">${image}<span class="part-frost" aria-hidden="true"></span>${name?`<span class="part-name">${name}</span>`:''}</button></foreignObject>`;
      }).join('');
      const wires=layout.routes.map(([type,route,points])=>[-2,0,2].map(offset=>`<path class="review-${type}-wire" data-route="${route}" d="${offsetPath(points,offset)}"/>`).join('')).join('');
      const captions=layout.captions.map(([x,y,key,type])=>`<text x="${x}" y="${y}" class="review-label label-${type}" aria-hidden="true">${words[key]||key}</text>`).join('');
      return `<div class="network-${size}"><svg viewBox="0 0 ${layout.width} ${layout.height}" role="group" aria-label="${en?'Device architecture':'设备架构'}"><g aria-hidden="true">${wires}${captions}</g>${nodes}</svg></div>`;
    }
    const graph=document.getElementById('networkGraph');
    graph.innerHTML=scene('desktop')+scene('mobile');
    graph.querySelectorAll('[data-part]').forEach(button=>button.addEventListener('click',()=>{
      const pressed=button.getAttribute('aria-pressed')!=='true';
      clearInspection();
      graph.querySelectorAll(`[data-part="${button.dataset.part}"]`).forEach(item=>item.setAttribute('aria-pressed',String(pressed)));
    }));
    const other=document.querySelector('[data-review-other]');
    other.href=`review-${silicon?'a':'b'}.html?lang=${lang}#tianshanos`;
  }
  function clearInspection() {
    document.querySelectorAll('#networkGraph [aria-pressed=true]').forEach(button=>button.setAttribute('aria-pressed','false'));
  }
  const topics = [
    {parts:['mcu'],routes:[]},
    {parts:['ethernet','switch','nic-cuda','nic-x86'],routes:['management-network','cuda-network','x86-network']},
    {parts:['config'],routes:[]},
    {parts:['mcu','ethernet','switch'],routes:['management-spi','management-network']}
  ];
  function setFocus(index) {
    if(document.body.dataset.material!=='abstract') return;
    const topic=topics[index];
    document.querySelectorAll('#networkGraph [data-part]').forEach(part=>{
      part.dataset.lit=String(topic.parts.includes(part.dataset.part));
    });
    document.querySelectorAll('#networkGraph [data-route]').forEach(wire=>{
      wire.dataset.lit=String(topic.routes.includes(wire.dataset.route));
    });
  }
  return {render,clearInspection,setFocus};
})();
