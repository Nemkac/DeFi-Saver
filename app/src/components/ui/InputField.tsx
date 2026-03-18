type InputFieldProps = {
    title: string;
    placeholder: string;
}

const InputField = ({ title, placeholder }: InputFieldProps) => {
    return (
        <div className='flex items-center w-full md:w-auto p-4 gap-2 rounded-xl border border-border bg-elevated text-p-md text-primary outline-none'>
            <p className="text-p-md-bold text-secondary">{title}</p>
            <input className="placeholder:text-p-md placeholder:text-secondary bg-transparent focus:outline-none text-p-md" placeholder={placeholder} />
        </div>
    )
}

export default InputField
