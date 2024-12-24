import { chart } from '../expendPlugins/chart/plugin'
import { print } from '../expendPlugins/print/plugin'
import { vchart } from '../expendPlugins/vchart/plugin'

const pluginsObj = {
    'chart': (data, isDemo) => {
        chart(data, isDemo)
        // vchart 的一些原始数据需要依赖 chartmix 的数据，所以 chartmix 先加载
        vchart(data, isDemo)
    },
    'print': print,
}

const isDemo = true

/**
 * Register plugins
 */
function initPlugins(plugins, data) {
    if (plugins.length) {
        plugins.forEach(plugin => {
            pluginsObj[plugin](data, isDemo)
        });
    }
}

export {
    initPlugins
}