import React from 'react'

export default ({ id = '', title = '', body = '', footer = '' }) => {
  return (
    <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {body}
          </div>
          {footer ?
            <div className="modal-footer">
              {footer}
            </div>
            : null}
        </div>
      </div>
    </div>
  )
}
