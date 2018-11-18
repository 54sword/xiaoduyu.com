
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

// styles
import './style.scss';


@withRouter
export class Pagination extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { location, count, pageSize, pageNumber, onChoose } = this.props

    if (!count) return ''

    let { pathname, search } = location
    let pageNumberTotal = Math.ceil(count/pageSize);

    if (pageNumberTotal == 1) return ''

    search = search.split('?')[1] || '';

    let searchArr = [];
    search.split('&').map(item=>{
      if (item && item.indexOf('page_number') == -1) {
        searchArr.push(item);
      }
    });

    search = search.replace('page_number='+pageNumber, '');

    const produceLink = (pageNumber) => {

      let s = pageNumber <= 1 ? '' : 'page_number='+pageNumber;

      if (searchArr.length == 0) {
        return pathname+(s ? '?'+s : '');
      } else {
        return pathname+'?'+([ ...searchArr, s ]).join('&');
      }
    }

    let previous = pageNumber > 1 ? pageNumber-1 : '';
    let Next = pageNumber + 1 <= pageNumberTotal ? pageNumber+1 : '';

    return (
      <nav aria-label="Page navigation" className="border-top">
        <ul className="pagination justify-content-center" styleName="pagination">

          <li className={`page-item ${previous ? '' : 'disabled'}`}>
            <div className="page-link" aria-label="Previous" onClick={()=>{ onChoose(previous) }}>
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
                <div className="page-link" onClick={()=>{ onChoose(i+1) }}>{i+1}</div>
                </li>)
            }
            return arr
          })()}

          <li className={`page-item ${Next ? '' : 'disabled'}`}>
            <div className="page-link" aria-label="Next" onClick={()=>{ onChoose(Next) }}>
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </div>
          </li>

        </ul>
      </nav>
    )

  }

}


export default Pagination
