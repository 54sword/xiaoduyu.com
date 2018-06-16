
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

@withRouter
export class Pagination extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { location, count, pageSize, pageNumber } = this.props

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

    let previous = pageNumber > 1 ? produceLink(pageNumber-1) : '';
    let Next = pageNumber + 1 <= pageNumberTotal ? produceLink(pageNumber+1) : '';

    return (
      <nav aria-label="Page navigation" className="mt-3">
        <ul className="pagination justify-content-center">

          <li className={`page-item ${previous ? '' : 'disabled'}`}>
            <Link className="page-link" to={previous} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </Link>
          </li>

          {(()=>{
            let arr = []
            let min = pageNumber - 5 >= 1 ? pageNumber - 5 : 0,
                max = pageNumber + 4 >= pageNumberTotal ? pageNumberTotal : pageNumber + 4;

            for (let i = min; i < max; i++) {
              arr.push(<li className={`page-item ${pageNumber - 1 == i ? 'active' : ''}`} key={i}>
                <Link className="page-link" to={produceLink(i+1)}>{i+1}</Link>
                </li>)
            }
            return arr
          })()}

          <li className={`page-item ${Next ? '' : 'disabled'}`}>
            <Link className="page-link" to={Next} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </Link>
          </li>

        </ul>
      </nav>
    )

  }

}


export default Pagination
