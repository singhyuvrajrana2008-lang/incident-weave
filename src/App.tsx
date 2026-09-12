import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AppProvider, useApp } from "./store/AppContext";
import { AppLayout } from "./components/shell/AppLayout";
import { Button } from "./components/ui";
import { Logo } from "./components/Logo";
import Landing from "./pages/Landing";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/app/Dashboard";
import Investigations from "./pages/app/Investigations";
import NewInvestigation from "./pages/app/NewInvestigation";
import InvestigationWorkspace from "./pages/app/InvestigationWorkspace";
import EvidencePage from "./pages/app/Evidence";
import TimelinePage from "./pages/app/TimelinePage";
import Contradictions from "./pages/app/Contradictions";
import Unknowns from "./pages/app/Unknowns";
import SearchPage from "./pages/app/SearchPage";
import Notifications from "./pages/app/Notifications";
import Profile from "./pages/app/Profile";
import Settings from "./pages/app/Settings";

function Protected({children}:{children:React.ReactNode}){const {session,authReady}=useApp();if(!authReady)return <div className="grid min-h-screen place-items-center bg-bg font-mono text-xs text-fg-dim">Loading workspace…</div>;return session?<>{children}</>:<Navigate to="/sign-in" replace/>}
function NotFound(){return <div className="grid min-h-screen place-items-center bg-bg px-6 text-center"><div><Logo/><h1 className="mt-6 font-display text-6xl font-extrabold">404</h1><p className="mt-2 text-fg-dim">This page is not part of the workspace.</p><Link to="/"><Button className="mt-6">Return home</Button></Link></div></div>}
export default function App(){return <AppProvider><BrowserRouter><Routes><Route path="/" element={<Landing/>}/><Route path="/sign-in" element={<SignIn/>}/><Route path="/sign-up" element={<SignUp/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/app" element={<Protected><AppLayout/></Protected>}><Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="investigations" element={<Investigations/>}/><Route path="investigations/new" element={<NewInvestigation/>}/><Route path="investigations/:id" element={<InvestigationWorkspace/>}/><Route path="evidence" element={<EvidencePage/>}/><Route path="timeline" element={<TimelinePage/>}/><Route path="contradictions" element={<Contradictions/>}/><Route path="unknowns" element={<Unknowns/>}/><Route path="search" element={<SearchPage/>}/><Route path="notifications" element={<Notifications/>}/><Route path="profile" element={<Profile/>}/><Route path="settings" element={<Settings/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter></AppProvider>}
