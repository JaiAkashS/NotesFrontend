import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(v => !v)

  useImperativeHandle(refs, () => ({ toggleVisibility }))

  return (
    <div className="my-2">
      {!visible && (
        <button className="btn" onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
      {visible && (
        <div className="bg-white border border-[#eaeaea] rounded-xl p-5 my-3">
          {props.children}
          <button className="btn btn-ghost btn-sm mt-3" onClick={toggleVisibility}>Cancel</button>
        </div>
      )}
    </div>
  )
})

export default Togglable