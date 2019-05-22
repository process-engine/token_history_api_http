import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/token_history_api_contracts';

import {wrap} from 'async-middleware';

import {TokenHistoryApiController} from './token_history_api_controller';

export class TokenHistoryApiRouter extends BaseRouter {

  private tokenHistoryApiRestController: TokenHistoryApiController;

  constructor(tokenHistoryApiRestController: TokenHistoryApiController) {
    super();
    this.tokenHistoryApiRestController = tokenHistoryApiRestController;
  }

  public get baseRoute(): string {
    return 'api/token_history/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get(
      restSettings.paths.getTokensForFlowNode,
      wrap(this.tokenHistoryApiRestController.getTokensForFlowNode.bind(this.tokenHistoryApiRestController)),
    );
  }

}
