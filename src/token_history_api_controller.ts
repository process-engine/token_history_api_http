import {ITokenHistoryService, TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class TokenHistoryApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _identityService: IIdentityService;
  private _tokenHistoryApiService: ITokenHistoryService;

  constructor(identityService: IIdentityService, tokenHistoryApiService: ITokenHistoryService) {
    this._identityService = identityService;
    this._tokenHistoryApiService = tokenHistoryApiService;
  }

  private get identityService(): IIdentityService {
    return this._identityService;
  }

  private get tokenHistoryApiService(): ITokenHistoryService {
    return this._tokenHistoryApiService;
  }

  public async getTokensForFlowNodeInstance(request: Request, response: Response): Promise<void> {
    const flowNodeInstanceId: string = request.params.flow_node_instance_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<TokenHistoryEntry> = await this.tokenHistoryApiService.getTokensForFlowNodeInstance(identity, flowNodeInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  private async _resolveIdentity(request: Request): Promise<IIdentity> {
    const bearerToken: string = request.get('authorization');

    if (!bearerToken) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const token: string = bearerToken.substr('Bearer '.length);
    const identity: IIdentity = await this.identityService.getIdentity(token);

    return identity;
  }
}
