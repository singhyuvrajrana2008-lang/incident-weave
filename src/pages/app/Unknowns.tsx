import { useEffect,useState } from "react";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { Page } from "../../components/shell/Page";
import { UnknownCard } from "../../components/investigation/panels";
export default function Unknowns(){const [inv,setInv]=useState<Investigation>();useEffect(()=>{investigationService.list().then(x=>setInv(x[0]))},[]);return <Page eyebrow="Analysis" title="Unknowns" subtitle="Evidence gaps that the current record cannot establish with confidence."><div className="space-y-3">{inv?.unknowns.map(u=><UnknownCard key={u.id} unknown={u} onSelect={()=>{}}/>)}</div></Page>}
