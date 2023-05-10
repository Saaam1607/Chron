import SidebarItem from "./SidebarItem"
import Logo from "./Logo"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

export default function Sidebar(){
    return(
        <div className="sidebar">
            <Logo/>
            <SidebarItem title="HOME" icon="bi bi-house"></SidebarItem>
            <SidebarItem title="GRUPPI" icon="bi bi-microsoft-teams"/>
            <SidebarItem title="TO-DO" icon="bi bi-clipboard-check"/>
            <SidebarItem title="TIMER" icon="bi bi-clock"/>
            <SidebarItem title="SALE STUDIO" icon="bi bi-map"/>
        </div>
    )
}