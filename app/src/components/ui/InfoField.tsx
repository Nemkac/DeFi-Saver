type InfoFieldProps = {
    title: string
    orientation?: 'col' | 'row'
    children: React.ReactNode
}

const InfoField = ({ title, orientation = 'row', children }: InfoFieldProps) => {
    return (
        <div className={`flex flex-${orientation} gap-2 ${orientation === 'row' ? 'justify-between items-center' : ''}`}>
            <p className="text-p-xsm-bold text-secondary">
                {title}
            </p>
            <p className="text-p-md text-primary truncate">
                {children}
            </p>
        </div>
    )
}

export default InfoField