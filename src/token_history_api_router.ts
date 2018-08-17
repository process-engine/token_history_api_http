import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/token_history_api_contracts';

import {wrap} from 'async-middleware';

import {TokenHistoryApiController} from './token_history_api_controller';

export class LoggingApiRouter extends BaseRouter {

  private _tokenHistoryApiRestController: TokenHistoryApiController;

  constructor(tokenHistoryApiRestController: TokenHistoryApiController) {
    super();
    this._tokenHistoryApiRestController = tokenHistoryApiRestController;
  }

  private get tokenHistoryApiRestController(): TokenHistoryApiController {
    return this._tokenHistoryApiRestController;
  }

  public get baseRoute(): string {
    return 'api/token_history/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const controller: TokenHistoryApiController = this.tokenHistoryApiRestController;

    this.router.get(restSettings.paths.getTokensForFlowNode, wrap(controller.getTokensForFlowNode.bind(controller)));
  }
}
