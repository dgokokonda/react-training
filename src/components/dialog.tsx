
import clsx from 'clsx'
import { createPortal } from 'react-dom';
/**
@param ({
width: 'md' | 'full',
className: string,
isOpen: boolean,
onClose: Function
}) props
@returns
 */
// 


export function Dialog({ width = 'md', className, children, isOpen = false, onClose }) {
  const handleClick = (e) => {
    const inModal = e.target.closest('"[data-id=modal]"');
    if (inModal) return;
    onClose()
  }

  if (!isOpen) return null;

  const modal = (
    <div onClick={handleClick} className="fixed inset-0 bg-slate-300/60 backdrop-blur pt-10 pb-10">
      <div className={clsx("bg-white rounded-lg min-h-[320px] mx-auto relative",
        "flex flex-col",
        {
          md: 'max-w-[600px] w-full',
          full: 'mx-5'
        }[width]
      )}>

        <button className='w-8 h-8 rounded flex items-center justify-center bg-white/10 hover:bg-white/40  absolute top-0 left-[calc(100%+12px)] transition-colors'>
          <CrossButton classes="w-4 h-4 text-white" />
        </button>
        {children}

      </div>
    </div>
  )

  return createPortal(modal, document.getElementById('modals') || null)
}

Dialog.Header = function DialogHeader({ children = '', className = '' }) {
  return (
    <div className={clsx(className, 'px-6 pt-6 pb-4 text-2xl text-black')}>{children}</div>
  )
}
Dialog.Body = function DialogBody({ children = '', className = '' }) {
  return (
    <div className={clsx(className, 'px-6 text-black')}>{children}</div>
  )
}
Dialog.Footer = function DialogFooter({ children = '', className = '' }) {
  return (
    <div className={clsx(className, 'mt-auto p-6 flex gap-4 justify-end pb-4 text-2xl text-black')}>{children}</div>
  )
}

function CrossButton({ classes = '' }) {
  return (
    <svg className={classes} xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false"><path d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"></path></svg>
  )
}
