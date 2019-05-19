import React from 'react';

/*
    $('.toast').toast({
      animation: true,
      autohide: true,
      delay: 6000
    }).toast('show')
*/

export default function() {

  return (<div className="toast" style={{position: 'fixed', top: 55, right: 10, zIndex: 999 }}>
  <div className="toast-header">
    <img src="..." className="rounded mr-2" alt="..." />
    <strong className="mr-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div className="toast-body">
    Hello, world! This is a toast message.
    Hello, world! This is a toast message.
    Hello, world! This is a toast message.
    Hello, world! This is a toast message.
  </div>
</div>)

}