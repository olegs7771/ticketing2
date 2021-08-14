// NextJS too finicky about updating code in browser
// This file load up automaticaly by NextJS whenever projects 
// starts up . Updates every file every 300ms
// 
// 
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
