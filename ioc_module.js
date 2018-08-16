'use strict'

const {
  TokenHistoryApiRouter,
  TokenHistoryApiController,
} = require('./dist/commonjs/index');

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {
  container.register('TokenHistoryApiRouter', TokenHistoryApiRouter)
    .dependencies('TokenHistoryApiController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('TokenHistoryApiController', TokenHistoryApiController)
    .dependencies('IdentityService', 'TokenHistoryApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
