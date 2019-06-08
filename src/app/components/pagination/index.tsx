import React, { Component } from 'react';

interface Props {
  count: number,
  pageNumber: number,
  pageSize: number,
  onSelect: onSelect
}

type onSelect = (s: number) => void;

export default function({ count = 0, pageSize = 0, pageNumber = 0, onSelect }: Props) {

  let pageNumberTotal = Math.ceil(count/pageSize);

  if (!count || pageNumberTotal == 1) return null;

  let previous = pageNumber > 1 ? pageNumber-1 : 0;
  let Next = pageNumber + 1 <= pageNumberTotal ? pageNumber+1 : 0;

  return (
    <nav aria-label="Page navigation" className="border-top">
      <ul className="pagination justify-content-center mb-3">

        <li className={`page-item ${previous ? '' : 'disabled'}`}>
          <div className="page-link" aria-label="Previous" onClick={()=>{ onSelect(previous) }}>
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </div>
        </li>

        {(()=>{
          let arr = []
          let min = pageNumber - 5 >= 1 ? pageNumber - 5 : 0,
              max = pageNumber + 4 >= pageNumberTotal ? pageNumberTotal : pageNumber + 4;

          for (let i = min; i < max; i++) {
            arr.push(<li className={`page-item ${pageNumber - 1 == i ? 'active' : ''}`} key={i}>
              <div className="page-link" onClick={()=>{ onSelect(i+1) }}>{i+1}</div>
              </li>)
          }
          return arr
        })()}

        <li className={`page-item ${Next ? '' : 'disabled'}`}>
          <div className="page-link" aria-label="Next" onClick={()=>{ onSelect(Next) }}>
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </div>
        </li>

      </ul>
    </nav>
  )

}