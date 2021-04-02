import React from 'react'

/** A utility for lazy-loading a component
 * @param path The path to module/component. This path must be relative to src folder
 * @returns The component which can be rendered directly
 */
export default (path) => {
    return React.lazy(() => {
        return import(`../${path}`)
    })
}