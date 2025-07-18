/* global event */

import { select, pointer } from 'd3-selection'
import 'd3-transition'
import 'd3-dispatch'
import 'd3-ease'

function defaultLabel (d) {
    return d.data.name
}

export function defaultFlamegraphTooltip (rootHTMLElement) {
    var rootElement = rootHTMLElement ? select(rootHTMLElement) : select('body')
    console.info("creating defaultFlamegraphTooltip", rootElement)
    var tooltip = null
    // Function to get HTML content from data.
    var html = defaultLabel
    // Function to get text content from data.
    var text = defaultLabel
    // Whether to use d3's .html() to set content, otherwise use .text().
    var contentIsHTML = false

    function tip () {
        tooltip = tip.tooltip = rootElement
            .append('div')
            .style('display', 'none')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .attr('class', 'd3-flame-graph-tip')
        console.info("initialized tooltip", {tip, rootElement, tooltip })
        window.r = rootElement
        window.t = tooltip
        window.tip = tip
    }
    tip.rootElement = rootElement

    tip.move = function(x,y) {
        tooltip
            .style('display', 'block')
            .style('opacity', 1)
            .style('left', x + 'px')
            .style('top', y + 5 + 'px')
            .style('pointer-events', 'all')
    }
    
    tip.show = function (event, d) {
        window._event = event
        const rootBox = rootElement.node().getBoundingClientRect()
        const { x: rootX, y: rootY } = rootBox
        const p1 = pointer(event, rootElement)
        const p2 = pointer(event, rootElement.node())
        console.info("show", { rootBox, p1, p2 })
        tooltip
            .style('display', 'block')
            .style('left', p2[0] + 'px')
            .style('top', p2[1] + 'px')
            // .style('left', event.pageX + 5 + 'px')
            // .style('top', event.pageY + 5 + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('pointer-events', 'all')

        if (contentIsHTML) {
            tooltip.html(html(d))
        } else {
            tooltip.text(text(d))
        }

        return tip
    }

    tip.hide = function () {
        tooltip
            .style('display', 'none')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .style('pointer-events', 'none')

        return tip
    }

    /**
     * Gets/sets a function converting the d3 data into the tooltip's textContent.
     *
     * Cannot be combined with tip.html().
     */
    tip.text = function (_) {
        if (!arguments.length) return text
        text = _
        contentIsHTML = false
        return tip
    }

    /**
     * Gets/sets a function converting the d3 data into the tooltip's innerHTML.
     *
     * Cannot be combined with tip.text().
     *
     * @deprecated prefer tip.text().
     */
    tip.html = function (_) {
        if (!arguments.length) return html
        html = _
        contentIsHTML = true
        return tip
    }

    tip.destroy = function () {
        tooltip.remove()
    }

    return tip
}
