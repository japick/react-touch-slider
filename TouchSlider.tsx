import React from 'react'
import ReactDOM from 'react-dom'

const TouchSlider = (props) => {
  const slider = React.useRef(null)
  const [dragStart, setDragStart] = React.useState(0)
  const [dragStartTime, setDragStartTime] = React.useState(new Date())
  const [index, setIndex] = React.useState(0)
  const [lastIndex, setLastIndex] = React.useState(0)
  const [transition, setTransition] = React.useState(false)
  const [slideWidth, setSlideWidth] = React.useState(0)

  const getDragX = (event, isTouch) => {
    return isTouch ?
      event.touches[0].pageX :
      event.pageX
  }

  const handleDragStart = (event, isTouch) => {
    const x = getDragX(event, isTouch)

    setDragStart(x)
    setDragStartTime(new Date())
    setTransition(false)
    setSlideWidth(ReactDOM.findDOMNode(slider.current).offsetWidth)
  }

  const handleDragMove = (event, isTouch) => {
    const x = getDragX(event, isTouch)
    const offset = dragStart - x
    const percentageOffset = offset / slideWidth
    const newIndex = lastIndex + percentageOffset
    const SCROLL_OFFSET_TO_STOP_SCROLL = 30

    // Stop scrolling if you slide more than 30 pixels
    if (Math.abs(offset) > SCROLL_OFFSET_TO_STOP_SCROLL) {
      event.stopPropagation()
      event.preventDefault()
    }

    setIndex(newIndex)
  }

  const handleDragEnd = () => {
    const timeElapsed = new Date().getTime() - dragStartTime.getTime()
    const offset = lastIndex - index
    const velocity = Math.round(offset / timeElapsed * 10000)

    let newIndex = Math.round(index)

    if (Math.abs(velocity) > 5)
      newIndex = velocity < 0 ? lastIndex + 1 : lastIndex - 1

    if (newIndex < 0)
      newIndex = 0
    else if (newIndex >= props.children.length)
      newIndex = props.children.length - 1

    setDragStart(0)
    setIndex(newIndex)
    setLastIndex(newIndex)
    setTransition(true)
  }

  const goToSlide = (index, event) => {
    if (event)
      event.stopPropagation()

    if (index < 0)
      index = props.loop ? props.children.length - 1 : 0
    else if (index >= props.children.length)
      index = props.loop ? 0 : props.children.length - 1

    setIndex(index)
    setLastIndex(index)
    setTransition(true)
  }

  const renderNav = () => {
    const nav = props.children.map((slide, i) => {
      return (
        <li
          className={(i === lastIndex) ? 'c-TouchSlider__navButton c-TouchSlider__navButton--active' : 'c-TouchSlider__navButton'}
          key={i}
          onClick={(event) => goToSlide(i, event)} />
      )
    })

    return (
      <ol className='c-TouchSlider__nav'>{nav}</ol>
    )
  }

  const renderArrows = () => {
    const arrowsClasses = props.showNav ? 'c-TouchSlider__arrows' : '[ c-TouchSlider__arrows c-TouchSlider__arrows--noNav ]'

    return (
      <div className={arrowsClasses}>
        {props.loop || lastIndex > 0 ?
          <button
            className='[ c-TouchSlider__arrow c-TouchSlider__arrow--left ]'
            onClick={(event) => goToSlide(lastIndex - 1, event)}></button> : null }
        {props.loop || lastIndex < props.children.length - 1 ?
          <button
            className='[ c-TouchSlider__arrow c-TouchSlider__arrow--right ]'
            onClick={(event) => goToSlide(lastIndex + 1, event)}></button> : null }
      </div>
    )
  }

  return (
    <div className='c-TouchSlider' ref={slider}>
      {props.showArrows ? renderArrows() : null}
      {props.showNav ? renderNav() : null}
      <div
        onTouchStart={event => handleDragStart(event, true)}
        onTouchMove={event => handleDragMove(event, true)}
        onTouchEnd={() => handleDragEnd()}>
        <div
          className={transition ? 'c-TouchSlider__slides c-TouchSlider__slides--transition' : 'c-TouchSlider__slides'}
          style={{
            width: `${ 100 * props.children.length }%`,
            transform: `translateX(${ -1 * index * (100 / props.children.length) }%)`}}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default TouchSlider