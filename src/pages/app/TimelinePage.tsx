import { useEffect,useState } from "react";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { Page } from "../../components/shell/Page";
import { Timeline } from "../../components/investigation/Timeline";
export default function TimelinePage(){const [inv,setInv]=useState<Investigation>();const [event,setEvent]=useState<string|null>(null);useEffect(()=>{investigationService.list().then(x=>setInv(x[0]))},[]);return <Page eyebrow="Analysis" title="Timeline" subtitle="The reconstructed chronology, with confidence and source attribution for every event.">{inv&&<Timeline investigation={inv} selectedEvent={event} highlightedEvents={new Set()} onSelectEvent={setEvent}/>}</Page>}
