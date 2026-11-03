const STOP = new Set('a an the is are do does can i how what which who when where of to for and or in on at by with from as it its my me you your about please there be have has all now right tell describe published case application rm-01 rm01 tianshanos company use into this that contain machine current standard'.split(' '));
const CHINESE_STOP = new Set(['如何','怎么','怎样','什么','哪个','哪些','多少','是否','是不是','能否','可以','请问','介绍','一下','公司','目前','现在','我们','你们','一个','这个','当前','所有','标准','官方','完整','及其','公开','内容','是','的','了','吗','呢','和','与','有','都','都有']);
export function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/rm[‐‑–—-]?01/g, 'rm01');
}
const VOCABULARY: [RegExp,string][] = [
  [/\bwattage\b|功耗|功率/gi,'w 功率'],
  [/\bpower supply\b|供电|电源/gi,'power 供电'],
  [/\bconfigurations?\b|配置/gi,'configuration 配置'],
  [/\b(?:memory|vram)\b|显存/gi,'memory vram 显存'],
  [/\bhardware\b|硬件/gi,'hardware 硬件'],
  [/\bmodules?\b|模组/gi,'module 模组'],
  [/\blocal agents?\b/gi,'local agent 本地应用'],
  [/借用|合同|协议|\b(?:loan|agreement|contract)\b/gi,'loan agreement 借用 协议']
];
const segmenter = new Intl.Segmenter('zh', {granularity:'word'});
export function terms(text: string): string[] {
  text=normalize(text);
  for(const [pattern,replacement] of VOCABULARY)text=text.replace(pattern,' '+replacement+' ');
  const s = text.replace(/(\d+)\s*(gb|tb|mb|w|tops|tflops)\b/g,'$1 $2');
  const out: string[] = [];
  for (const word of s.match(/[a-z0-9]+(?:[._+-][a-z0-9]+)*|[\p{Script=Han}]+/gu) || []) {
    if (/\p{Script=Han}/u.test(word)) {
      let span='';const spanTerms=new Set<string>();
      const flush=()=>{
        if(span.length>=2&&span.length<=4)spanTerms.add(span);
        for(let i=0;i<span.length-1;i++)spanTerms.add(span.slice(i,i+2));
        out.push(...spanTerms);spanTerms.clear();span='';
      };
      for(const item of segmenter.segment(word)){
        const token=item.segment;
        if(CHINESE_STOP.has(token)){flush();continue;}
        if(token.length>1)spanTerms.add(token);
        span+=token;
        if(token.length>1)flush();
      }
      flush();
    } else if (!STOP.has(word)) out.push(word);
  }
  return out;
}
export const bytes = (s: string) => new TextEncoder().encode(s).length;
