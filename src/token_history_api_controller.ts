import {ITokenHistoryApi, TokenHistoryEntry, TokenHistoryGroup} from '@process-engine/token_history_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class TokenHistoryApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _identityService: IIdentityService;
  private _tokenHistoryApiService: ITokenHistoryApi;

  constructor(identityService: IIdentityService, tokenHistoryApiService: ITokenHistoryApi) {
    this._identityService = identityService;
    this._tokenHistoryApiService = tokenHistoryApiService;
  }

  private get identityService(): IIdentityService {
    return this._identityService;
  }

  private get tokenHistoryApiService(): ITokenHistoryApi {
    return this._tokenHistoryApiService;
  }

  public async getTokensForFlowNode(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<TokenHistoryEntry> =
      await this.tokenHistoryApiService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeByProcessInstanceId(request: Request, response: Response): Promise<void> {
    const processInstanceId: string = request.params.process_instance_id;
    const flowNodeId: string = request.params.flow_node_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: TokenHistoryGroup =
      await this.tokenHistoryApiService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForCorrelationAndProcessModel(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: TokenHistoryGroup =
      await this.tokenHistoryApiService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForProcessInstance(request: Request, response: Response): Promise<void> {
    const processInstanceId: string = request.params.process_instance_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: TokenHistoryGroup =
      await this.tokenHistoryApiService.getTokensForProcessInstance(identity, processInstanceId);

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
