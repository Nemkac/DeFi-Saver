import * as Radix from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

export const DropdownMenu = Radix.Root
export const DropdownMenuTrigger = Radix.Trigger
export const DropdownMenuGroup = Radix.Group
export const DropdownMenuPortal = Radix.Portal
export const DropdownMenuSub = Radix.Sub
export const DropdownMenuRadioGroup = Radix.RadioGroup

export function DropdownMenuContent({
  className = '',
  sideOffset = 6,
  ...props
}: Radix.DropdownMenuContentProps) {
  return (
    <Radix.Portal>
      <Radix.Content
        sideOffset={sideOffset}
        style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}
        className={[
          'z-50 overflow-hidden rounded-lg',
          'border border-border bg-elevated',
          'p-1 shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        ].join(' ')}
        {...props}
      />
    </Radix.Portal>
  )
}

export function DropdownMenuSubContent({
  className = '',
  ...props
}: Radix.DropdownMenuSubContentProps) {
  return (
    <Radix.SubContent
      className={[
        'z-50 min-w-32 overflow-hidden rounded-lg',
        'border border-border bg-elevated',
        'p-1 shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function DropdownMenuSubTrigger({
  className = '',
  inset,
  children,
  ...props
}: Radix.DropdownMenuSubTriggerProps & { inset?: boolean }) {
  return (
    <Radix.SubTrigger
      className={[
        'flex cursor-default select-none items-center gap-2 rounded-md px-3 py-1.5',
        'text-p-sm text-primary outline-none',
        'focus:bg-hover data-[state=open]:bg-hover',
        inset ? 'pl-8' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-3.5 w-3.5 text-secondary" />
    </Radix.SubTrigger>
  )
}

export function DropdownMenuItem({
  className = '',
  inset,
  ...props
}: Radix.DropdownMenuItemProps & { inset?: boolean }) {
  return (
    <Radix.Item
      className={[
        'relative flex cursor-default select-none items-center gap-2 rounded-md px-3 py-1.5',
        'text-p-sm text-primary outline-none transition-colors',
        'focus:bg-hover focus:text-primary',
        'data-disabled:pointer-events-none data-disabled:opacity-40',
        inset ? 'pl-8' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function DropdownMenuCheckboxItem({
  className = '',
  children,
  checked,
  ...props
}: Radix.DropdownMenuCheckboxItemProps) {
  return (
    <Radix.CheckboxItem
      className={[
        'relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-3',
        'text-p-sm text-primary outline-none transition-colors',
        'focus:bg-hover focus:text-primary',
        'data-disabled:pointer-events-none data-disabled:opacity-40',
        className,
      ].join(' ')}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Radix.ItemIndicator>
          <Check className="h-3.5 w-3.5 text-action" />
        </Radix.ItemIndicator>
      </span>
      {children}
    </Radix.CheckboxItem>
  )
}

export function DropdownMenuRadioItem({
  className = '',
  children,
  ...props
}: Radix.DropdownMenuRadioItemProps) {
  return (
    <Radix.RadioItem
      className={[
        'relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-3',
        'text-p-sm text-primary outline-none transition-colors',
        'focus:bg-hover focus:text-primary',
        'data-disabled:pointer-events-none data-disabled:opacity-40',
        className,
      ].join(' ')}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Radix.ItemIndicator>
          <Circle className="h-2 w-2 fill-action text-action" />
        </Radix.ItemIndicator>
      </span>
      {children}
    </Radix.RadioItem>
  )
}

export function DropdownMenuLabel({
  className = '',
  inset,
  ...props
}: Radix.DropdownMenuLabelProps & { inset?: boolean }) {
  return (
    <Radix.Label
      className={[
        'px-3 py-1.5 text-p-xsm-bold text-secondary uppercase tracking-widest',
        inset ? 'pl-8' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className = '',
  ...props
}: Radix.DropdownMenuSeparatorProps) {
  return (
    <Radix.Separator
      className={['mx-1 my-1 h-px bg-border', className].join(' ')}
      {...props}
    />
  )
}

export function DropdownMenuShortcut({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={['ml-auto text-p-xsm text-secondary tracking-widest', className].join(' ')}
      {...props}
    />
  )
}