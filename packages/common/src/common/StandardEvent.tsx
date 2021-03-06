
import { ComponentChildren, createElement, Fragment } from '../vdom'
import { BaseComponent } from '../vdom-util'
import { buildSegTimeText, EventMeta } from '../component/event-rendering'
import { EventRoot, MinimalEventProps } from './EventRoot'
import { Seg } from '../component/DateComponent'
import { DateFormatter } from '../datelib/DateFormatter'


export interface StandardEventProps extends MinimalEventProps {
  extraClassNames: string[]
  defaultTimeFormat: DateFormatter
  defaultDisplayEventTime?: boolean // default true
  defaultDisplayEventEnd?: boolean // default true
  disableDragging?: boolean // default false
  disableResizing?: boolean // default false
  defaultContent?: (hookProps: EventMeta) => ComponentChildren // not used by anyone yet
}


// should not be a purecomponent
export class StandardEvent extends BaseComponent<StandardEventProps> {

  render() {
    let { props, context } = this
    let { seg } = props
    let timeFormat = context.options.eventTimeFormat || props.defaultTimeFormat
    let timeText = buildSegTimeText(
      seg,
      timeFormat,
      context,
      props.defaultDisplayEventTime,
      props.defaultDisplayEventEnd
    )

    return (
      <EventRoot
        seg={seg}
        timeText={timeText}
        disableDragging={props.disableDragging}
        disableResizing={props.disableResizing}
        defaultContent={props.defaultContent || renderInnerContent}
        isDragging={props.isDragging}
        isResizing={props.isResizing}
        isDateSelecting={props.isDateSelecting}
        isSelected={props.isSelected}
        isPast={props.isPast}
        isFuture={props.isFuture}
        isToday={props.isToday}
      >
        {(rootElRef, classNames, innerElRef, innerContent, hookProps) => (
          <a
            className={props.extraClassNames.concat(classNames).join(' ')}
            style={{
              borderColor: hookProps.borderColor,
              backgroundColor: hookProps.backgroundColor
            }}
            ref={rootElRef}
            {...getSegAnchorAttrs(seg)}
          >
            <div className='fc-event-main' ref={innerElRef} style={{ color: hookProps.textColor }}>
              {innerContent}
            </div>
            {hookProps.isStartResizable &&
              <div className='fc-event-resizer fc-event-resizer-start' />
            }
            {hookProps.isEndResizable &&
              <div className='fc-event-resizer fc-event-resizer-end' />
            }
          </a>
        )}
      </EventRoot>
    )
  }

}


function renderInnerContent(innerProps: EventMeta) {
  return (
    <Fragment>
      {innerProps.timeText &&
        <div className='fc-event-time'>{innerProps.timeText}</div>
      }
      <div className='fc-event-title-frame'>
        <div className='fc-event-title fc-sticky'>
          {innerProps.event.title || <Fragment>&nbsp;</Fragment>}
        </div>
      </div>
    </Fragment>
  )
}


function getSegAnchorAttrs(seg: Seg) {
  let url = seg.eventRange.def.url
  return url ? { href: url } : {}
}
