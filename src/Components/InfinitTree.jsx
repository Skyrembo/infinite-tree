import { useState, useCallback } from 'react'
import { VariableSizeGrid as Grid } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import uniqueId from 'lodash/uniqueId'
import Xarrow from "react-xarrows";

const DEMO_DATA = [
  { items: [1, 2, 3] },
  { items: [1] },
  { items: [3, 4, 5, 6] },
  { items: [3, 5, 6] },
]

const START_ITEM = {
  prevItemId: null,
  id: uniqueId(),
  isMain: true,
}

const getPrevLine = (initItem) => {
  const itemsAmount = Math.floor(Math.random() * 10) || 1
  const newItems = new Array(itemsAmount).fill(0).map((item, index) => ({
    prevItemId: initItem.id,
    id: uniqueId(),
    isMain: index === 0,
  }))
  return newItems
}

const generateNewItems = (startItem, amount) => {
  const array = new Array(amount)
  for (let i = 0; i < amount; i++) {
    const initItem = i > 0 ? array[i - 1].items[0] : startItem
    array[i] = { items: [...getPrevLine(initItem)] }
  }
  return array
}

const Example = () => {
  const [{ data: items, moreItemsLoading, hasNextPage }, setItems] = useState({
    data: [{ items: [START_ITEM] }].concat(generateNewItems(START_ITEM, 4)),
    moreItemsLoading: false,
    hasNextPage: true
  })

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const row = items[rowIndex]
    const rowItem = row.items[columnIndex]
    console.log(60 * columnIndex)
    return row && rowItem && (
      <div style={style} >
        <div
          id={`item-${rowItem.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'calc(100% - 8px)',
            height: 'calc(100% - 8px)',
            border: '1px solid black',
            borderRadius: '50%'
          }}>
          id: {rowItem.id}<br />
          prevId: {rowItem.prevItemId}<br />
          isMain: {rowItem.isMain ? '+' : '-'}<br />
        </div>
        {rowItem.prevItemId &&
          <Xarrow
            start={`item-${rowItem.id}`}
            end={`item-${rowItem.prevItemId}`}
            path="straight"
            startAnchor={'top'}
            endAnchor={'bottom'}
            showHead={false}
            showTail={false}
          />
        }
      </div>)
  };

  const loadMore = useCallback(
    () => {
      console.log('loadMore')
      setItems(prev => ({ ...prev, moreItemsLoading: true }))
      setTimeout(() => {
        console.log('timeout')
        setItems(prev => {
          return ({
            data: [...prev.data].concat(generateNewItems(prev.data[prev.data.length - 1].items[0], 4)),
            moreItemsLoading: false,
            hasNextPage: true
          })
        })
      }, 1000)
    },
    [],
  )

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <Grid
          columnCount={Math.max(...DEMO_DATA.map(item => item.items.length))}
          columnWidth={index => 100}
          height={1000}
          rowCount={items.length}
          rowHeight={index => 100}
          width={1000}
          onItemsRendered={({
            visibleRowStartIndex,
            visibleRowStopIndex,
            overscanRowStopIndex,
            overscanRowStartIndex,
          }) => {
            onItemsRendered({
              overscanStartIndex: overscanRowStartIndex,
              overscanStopIndex: overscanRowStopIndex,
              visibleStartIndex: visibleRowStartIndex,
              visibleStopIndex: visibleRowStopIndex,
            });
          }}
          ref={ref}
        >
          {Cell}
        </Grid>
      )}

    </InfiniteLoader>
  )
};

export default Example
