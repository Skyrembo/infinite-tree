import { useState, useCallback } from 'react'
import { VariableSizeGrid as Grid } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";

const DEMO_DATA = [
  { items: [1, 2, 3] },
  { items: [1] },
  { items: [3, 4, 5, 6] },
  { items: [3, 5, 6] },
]

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));



const Example = () => {
  const [{ items, moreItemsLoading, hasNextPage }, setItems] = useState({
    items: DEMO_DATA,
    moreItemsLoading: false,
    hasNextPage: true
  })

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const row = items[rowIndex]
    return row && row.items[columnIndex] && (
      <div style={style} >
        <div style={{
          margin: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'calc(100% - 8px)',
          height: 'calc(100% - 8px)',
          border: '1px solid black',
          borderRadius: '50%'
        }}>
          Item {rowIndex},{columnIndex}
        </div>
      </div>)
  };

  const loadMore = useCallback(
    () => {
      console.log('loadMore')
      setItems(prev => ({ ...prev, moreItemsLoading: true }))
      setTimeout(() => {
        console.log('timeout')
        setItems(prev => ({
          items: [...prev.items].concat(prev.items),
          moreItemsLoading: false,
          hasNextPage: true
        }))
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
          height={300}
          rowCount={items.length}
          rowHeight={index => 100}
          width={500}
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
