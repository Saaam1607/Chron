export default function SidebraItem({title, icon}){
    return(
        <div className="sidebar-item">
            <div className="sidebar-title">
                <span>
                    <i className={icon}></i>
                </span>
                <span className="item-text">
                    <i> {title} </i>
                </span>
            </div>
        </div>
    )
}