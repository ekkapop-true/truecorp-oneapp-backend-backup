import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

export interface IInterestCmpBody {
  cmpTransactionId: string;
  cmpCampaignId: string;
  cmpOfferPoId: string;
  osVersion: string;
}

@Injectable()
export class InterestCmpService {
  constructor(private readonly httpService: HttpService) {}

  async interestCmp({
    useMock,
    body,
    headers,
  }: {
    useMock: boolean;
    body: IInterestCmpBody;
    headers: any;
  }): Promise<any> {
    if (!useMock) {
      const headersRequest = {
        sourceSystemId: headers.sourcesystemid,
        sessionId: headers.sessionid,
        platform: headers.platform,
        version: headers.version,
        language: headers.language,
        deviceId: headers.deviceid,
        'Content-Type': headers['content-type'],
        Authorization: headers.authorization,
      };

      const { data } = await firstValueFrom(
        this.httpService
          .post(
            'http://trueapp-commonapi-dev.true.th/statistics/cmpstatistics/api/v1/interest',
            body,
            { headers: headersRequest },
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw new HttpException(
                error.response.data,

                HttpStatus.BAD_REQUEST,
              );
            }),
          ),
      );
      return data;
    }
  }
}
