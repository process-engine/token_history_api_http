import {ITokenHistoryApi} from '@process-engine/token_history_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class TokenHistoryApiController {

  private httpCodeSuccessfulResponse = 200;

  private identityService: IIdentityService;
  private tokenHistoryApiService: ITokenHistoryApi;

  constructor(identityService: IIdentityService, tokenHistoryApiService: ITokenHistoryApi) {
    this.identityService = identityService;
    this.tokenHistoryApiService = tokenHistoryApiService;
  }

  public async getTokensForFlowNode(request: Request, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;
    const flowNodeId = request.params.flow_node_id;

    const identity = await this.resolveIdentity(request);

    const result = await this.tokenHistoryApiService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeByProcessInstanceId(request: Request, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const flowNodeId = request.params.flow_node_id;

    const identity = await this.resolveIdentity(request);

    const result = this.tokenHistoryApiService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForCorrelationAndProcessModel(request: Request, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;

    const identity = await this.resolveIdentity(request);

    const result = this.tokenHistoryApiService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForProcessInstance(request: Request, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;

    const identity = await this.resolveIdentity(request);

    const result = this.tokenHistoryApiService.getTokensForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  private async resolveIdentity(request: Request): Promise<IIdentity> {
    const bearerToken = request.get('authorization');

    if (!bearerToken) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const token = bearerToken.substr('Bearer '.length);
    const identity = await this.identityService.getIdentity(token);

    return identity;
  }

}
