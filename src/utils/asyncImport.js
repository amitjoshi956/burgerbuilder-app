import asyncComponent from '../hoc/asyncComponent/asyncComponent'

/** A utility for lazy-loading a component
 * @param path The path to module/component. This path must be relative to src folder
 */
export default (path) => {
    return asyncComponent(() => {
        return import(`../${path}`)
    })
}