import DashboardHeading from './view/dashboard-heading'
import DashboardTableSection from './view/dashboard-table'

const DashboardPage = () => {
    return (
        <div className="flex flex-col w-full h-full items-center gap-10 p-8">
            <DashboardHeading />
            <DashboardTableSection />
        </div>
    )
}

export default DashboardPage
