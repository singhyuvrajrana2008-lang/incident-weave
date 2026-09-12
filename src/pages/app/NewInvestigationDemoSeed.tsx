import { useEffect } from "react";
import NewInvestigation from "./NewInvestigation";

export default function NewInvestigationDemoSeed() {
  useEffect(() => {
    window.localStorage.setItem("incidentweave-demo-seeded", "1");
  }, []);

  return <NewInvestigation />;
}
