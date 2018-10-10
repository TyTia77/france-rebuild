export const devEnv = window.location.hostname === 'localhost' ? true : false

export const contentPath = `${devEnv ? 'http://digitalproduction.coates.io': ''}/file/`
