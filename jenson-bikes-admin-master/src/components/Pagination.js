import React from 'react'
import {usePagination, DOTS} from '../helpers/usePagination';
import {CPagination, CPaginationItem} from '@coreui/react'

function Pagination({currentPage, totalCount, changePage}) {

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount: 2,
        pageSize: 40
      });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    function renderNumberings(){
        return paginationRange.map(pageNumber => {
         
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === DOTS) {
              return <CPaginationItem>&#8230;</CPaginationItem>
            }
            
            // Render our Page Pills
            return (
                <CPaginationItem active={pageNumber === currentPage ? true: false} onClick={()=>changePage(pageNumber)} style={{cursor:'pointer'}}>{pageNumber}</CPaginationItem>
            );
        })
    }

    let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <CPagination aria-label="Page navigation">
        <CPaginationItem aria-label="Previous" onClick={()=>changePage(currentPage - 1)} disabled={currentPage === 1 ? true : false}>
            <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {renderNumberings()}
        <CPaginationItem aria-label="Next" onClick={()=>changePage(currentPage + 1)} disabled={currentPage === lastPage ? true : false}>
            <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
    </CPagination>
  )
}

export default Pagination