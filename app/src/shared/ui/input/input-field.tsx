type InputFieldProps = {
    title: string;
    placeholder: string;
    value: string,
    onChange: (value: string) => void;
}

const InputField = ({ ...params }: InputFieldProps) => {
    return (
        <div className='flex items-center w-full md:w-auto p-4 gap-2 rounded-xl border border-border bg-elevated text-p-md text-primary outline-none'>
            <p className="text-p-md-bold text-secondary">{params.title}</p>
            <input
                className="placeholder:text-p-md placeholder:text-secondary bg-transparent focus:outline-none text-p-md"
                placeholder={params.placeholder}
                value={params.value}
                onChange={(e) => params.onChange(e.target.value)}
            />
        </div>
    )
}

export default InputField
