import { useEffect,useState } from "react";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { Page } from "../../components/shell/Page";
import { ContradictionCard } from "../../components/investigation/panels";
export default function Contradictions(){const [inv,setInv]=useState<Investigation>();const [sel,setSel]=useState<string|null>(null);useEffect(()=>{investigationService.list().then(x=>setInv(x[0]))},[]);return <Page eyebrow="Analysis" title="Contradictions" subtitle="Competing claims are surfaced side by side for human review."><div className="space-y-3">{inv?.contradictions.map(c=><ContradictionCard key={c.id} contradiction={c} investigation={inv} selected={sel===c.id} onSelect={()=>setSel(c.id)}/>)}</div></Page>}
