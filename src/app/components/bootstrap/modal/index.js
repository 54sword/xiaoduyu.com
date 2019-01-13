import React from 'react'

export default ({ id = '', header = null, title = '', body = '', footer = '', position = '', size = '' }) => {

  let className = 'modal-dialog';

  if (!position) {
    className += ' modal-dialog-centered';
  } else if (position == 'top') {
  }

  if (size) {
    className += ' modal-lg';
  }

  return (
    <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className={className} role="document">
        <div className="modal-content">

          {title ?
            <div className="modal-header">
              {title}
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            : null}

          {header && <div className="modal-header" style={{border:'none',paddingBottom:'0px'}}>
              <div>
                {header}
              </div>
              <div>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>}

          <div className="modal-body">{body}</div>

          {footer ?
            <div className="modal-footer">{footer}</div>
            : null}
        </div>
      </div>
    </div>
  )
}
