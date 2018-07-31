import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Router from './router'
import reset from '@styles/reset.scss'
import vendor from '../vendor'


window.setup = () => {
    console.warn('running')

    // SB.setup({
    //     url: 'https://demo.fr.mcd.switchboardcms.com/',
    //     // environmentLocation: 'FRLAB',
    //     // content: 'SW_CORE.zip',
    //     sources: [
    //         // 'COD.GAMME.top-banner.csv',
	// 		// 'COD.gamme.item-rows.csv',
	// 		// 'COD.PLV.matin.csv',
	// 		// 'COD.PLV.repas.csv',
	// 		// 'COD.PLV.aprem.csv',
	// 		// 'mcd-pos6.xml.csv',
	// 		// 'Store.Display.Names.csv',
	// 		// 'product-map.csv',
	// 		// 'product-taste.csv',
	// 		// 'pos-items-categorised_complete.csv',
	// 		// 'suggestive-sweet-salty-items.csv',
    //     ],
    //     success: () => init()
    // })

    SB.setup({
        url: 'https://digitalproduction.coates.io/',
        environmentLocation: 'SYDLAB',
        channelScreenId: 1,
        content: 'SW_CORE.zip',
        // sources: [...getCsvList(contentName)],
        success: () => init()
    })
}

function init(data) {
    console.warn('rendering')
    ReactDOM.render(
        <Provider store={store}>
            <Router />
        </Provider>,
        document.getElementById('app')
    )
}

// ReactDOM.render(
//     <Provider store={store}>
//         <Router />
//     </Provider>,
//     document.getElementById('app')
// )
