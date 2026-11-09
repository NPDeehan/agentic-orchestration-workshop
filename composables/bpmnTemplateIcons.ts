/**
 * bpmn-js renderer add-on: draws Camunda element-template icons on tasks and
 * sub-processes, the way the Camunda Modeler does.
 *
 * Models exported from the Web Modeler carry the connector's logo inline as
 * `zeebe:modelerTemplateIcon` (a data: URI). Plain bpmn-js ignores the attribute,
 * so an AI agent, an MCP client and a HubSpot call all render as the same grey
 * service task. This module paints the icon over the default task-type marker.
 *
 * The icon is appended to the element group rather than to `.djs-visual`, so the
 * focus/dim rules in styles/bpmn.css (which target `.djs-visual > rect|circle|polygon`)
 * never repaint it. styles/bpmn.css dims and hides `.bpmn-template-icon` explicitly.
 */
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import { append as svgAppend, create as svgCreate } from 'tiny-svg'
import { CAMUNDA_AGENT_ICON } from './agentIcon'

/** above BpmnRenderer (1000) so we get the call and can decorate its output */
const HIGH_PRIORITY = 1500

/** icon box, in diagram units, matching the Modeler's placement */
const SIZE = 18
const INSET = 5

function iconUrl(element: any): string | undefined {
  const bo = element?.businessObject
  if (!bo) return undefined
  // Without zeebe-bpmn-moddle the attribute lands in $attrs; with it, in the property.
  const raw = bo.$attrs?.['zeebe:modelerTemplateIcon']
    ?? bo.$attrs?.modelerTemplateIcon
    ?? (typeof bo.get === 'function' ? bo.get('zeebe:modelerTemplateIcon') : undefined)
  if (typeof raw === 'string' && raw.length) return raw

  // Models drawn for the deck carry no element templates. In this deck an ad-hoc
  // sub-process is always an agent, which in Camunda always carries the agent
  // template, so show its icon rather than nothing.
  if (bo.$type === 'bpmn:AdHocSubProcess') return CAMUNDA_AGENT_ICON
  return undefined
}

export default function TemplateIconRenderer(this: any, eventBus: any, bpmnRenderer: any) {
  BaseRenderer.call(this, eventBus, HIGH_PRIORITY)

  this.canRender = (element: any) =>
    !element.labelTarget && !element.waypoints && !!iconUrl(element)

  this.drawShape = (parentGfx: any, element: any) => {
    const shape = bpmnRenderer.drawShape(parentGfx, element)
    const url = iconUrl(element)!

    // top-left, as in the Modeler. Expanded sub-processes centre their name at the
    // top, so the icon never lands on a label.
    const x = INSET
    const y = INSET

    const group = svgCreate('g')
    group.setAttribute('class', 'bpmn-template-icon')

    // opaque plate so the default service-task gear doesn't show through logos
    // with transparent backgrounds. A <path>, not a <rect>: the focus rules in
    // styles/bpmn.css recolour every rect inside a highlighted shape.
    const plate = svgCreate('path')
    plate.setAttribute('d', roundedSquare(x - 1, y - 1, SIZE + 2, 3))
    plate.setAttribute('fill', '#FFFFFF')
    plate.setAttribute('stroke', 'none')

    const img = svgCreate('image')
    img.setAttribute('x', String(x))
    img.setAttribute('y', String(y))
    img.setAttribute('width', String(SIZE))
    img.setAttribute('height', String(SIZE))
    img.setAttribute('href', url)
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url)
    img.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    svgAppend(group, plate)
    svgAppend(group, img)
    // the element <g>, so the icon sits above the shape and outside .djs-visual
    svgAppend(parentGfx.parentNode || parentGfx, group)

    return shape
  }

  this.getShapePath = (shape: any) => bpmnRenderer.getShapePath(shape)
}

TemplateIconRenderer.prototype = Object.create(BaseRenderer.prototype)
TemplateIconRenderer.$inject = ['eventBus', 'bpmnRenderer']

function roundedSquare(x: number, y: number, size: number, r: number) {
  return `M${x + r},${y}h${size - 2 * r}a${r},${r} 0 0 1 ${r},${r}`
    + `v${size - 2 * r}a${r},${r} 0 0 1 ${-r},${r}`
    + `h${-(size - 2 * r)}a${r},${r} 0 0 1 ${-r},${-r}`
    + `v${-(size - 2 * r)}a${r},${r} 0 0 1 ${r},${-r}z`
}

/** didi module, passed to the viewer's `additionalModules` */
export const templateIconModule = {
  __init__: ['templateIconRenderer'],
  templateIconRenderer: ['type', TemplateIconRenderer],
}
