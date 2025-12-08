import { Injectable } from '@nestjs/common';
import { GlobalConfigService } from '@repo/system/config/global.config.service';
import 'dotenv/config';

/**
 * This is the config for this service, other services will have their own configs
 */
@Injectable()
export class AppConfigService extends GlobalConfigService {
  serviceName = this.get('SERVICE_NAME', 'pollpapa-core');
  port = this.get<number>('PORT');

  auth = {
    jwtSecret: this.getOrThrow('JWT_SECRET'),
    jwtExpiration: this.get('JWT_EXPIRATION') || '30m',
    refreshTokenSecret: this.getOrThrow('REFRESH_TOKEN_SECRET'),
    refreshTokenExpiration: this.get('REFRESH_TOKEN_EXPIRATION') || '7d',

    // Phone verification
    phoneVerificationAttemptExpiration:
      this.get('PHONE_VERIFICATION_ATTEMPT_EXPIRATION') || '30m',
    phoneVerificationRetryInterval:
      this.get('PHONE_VERIFICATION_RETRY_INTERVAL') || '1m',
    phoneVerificationMaxAttemptsInDay:
      this.get('PHONE_VERIFICATION_MAX_ATTEMPTS_IN_DAY') || 3,

    simulateOtp: this.get('DANGER_SIMULATE_OTP') === 'true',

    demoAccountAppId:
      this.get('DEMO_ACCOUNT_APP_ID') || '00000000-0000-0000-0000-000000000000',

    // Founder email - signup is blocked until this email registers (production only)
    founderEmail: this.get('FOUNDER_EMAIL'),
  };

  firebaseEnabled = !!this.get('FIREBASE_PROJECT_ID');
  firebase = {
    simulate: this.get('SIMULATE_FIREBASE') === 'true',
    projectId: this.get('FIREBASE_PROJECT_ID'),
    clientEmail: this.firebaseEnabled
      ? this.getOrThrow('FIREBASE_CLIENT_EMAIL')
      : '',
    privateKey: this.firebaseEnabled
      ? this.getOrThrow('FIREBASE_PRIVATE_KEY')
      : '',
  };

  appleEnabled = !!this.get('APPLE_CLIENT_ID');
  apple = {
    clientId: this.get('APPLE_CLIENT_ID'),
  };

  googleEnabled = !!this.get('GOOGLE_CLIENT_ID');
  google = {
    clientId: this.get('GOOGLE_CLIENT_ID'),
  };

  cloudinaryEnabled = !!this.get('CLOUDINARY_API_KEY');
  cloudinary = {
    simulate: this.get('SIMULATE_CLOUDINARY') === 'true',
    apiKey: this.get('CLOUDINARY_API_KEY'),
    cloudName: this.cloudinaryEnabled
      ? this.getOrThrow('CLOUDINARY_CLOUD_NAME')
      : '',
    apiSecret: this.cloudinaryEnabled
      ? this.getOrThrow('CLOUDINARY_API_SECRET')
      : '',
    largeFileThreshold: this.get<number>('CLOUDINARY_LARGE_FILE_THRESHOLD', 90),
  };

  awsEnabled = !!this.get('AWS_ACCESS_KEY_ID');
  awsSesEnabled = !!this.get('AWS_SES_ENABLED');
  aws = {
    simulate: this.get('SIMULATE_AWS') === 'true',
    accessKeyId: this.awsEnabled && this.getOrThrow('AWS_ACCESS_KEY_ID'),
    secretAccessKey:
      this.awsEnabled && this.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    region: this.awsEnabled && this.getOrThrow('AWS_REGION'),
    smsOriginationNumber: this.get('AWS_SMS_ORIGINATION_NUMBER'),

    sesKey: this.awsSesEnabled && this.getOrThrow('SES_KEY'),
    sesSecret: this.awsSesEnabled && this.getOrThrow('SES_SECRET'),
    sesRegion: this.awsSesEnabled && this.getOrThrow('SES_REGION'),
    sesFromEmail: this.awsSesEnabled && this.getOrThrow('AWS_SES_FROM_EMAIL'),
  };

  contractsEnabled = this.get('SIMULATE_CONTRACTS') != 'true';
  contracts = {
    enableMintingBlockchain: this.get('ENABLE_MINTING_BLOCKCHAIN') === 'true',
    prefix: this.get('CONTRACTS_PREFIX') || 'anketa',
    denom: this.get('CONTRACTS_DENOM') || 'uanketa',
    endpoint: this.get('CONTRACTS_ENDPOINT') || 'http://localhost:26657',
    chainId: this.get('CONTRACTS_CHAIN_ID') || 'local-1',
    gasPrice: this.get('CONTRACTS_GAS_PRICE') || '0.025',
    tokensPrize: this.get('CONTRACTS_TOKENS_PRIZE') || '1000000', // 1 token with 6 decimals
    adminMnemonic:
      this.contractsEnabled && this.getOrThrow('CONTRACTS_ADMIN_MNEMONIC'),
    tokenModel: {
      address:
        this.contractsEnabled &&
        this.getOrThrow('TOKEN_MODEL_CONTRACT_ADDRESS'),
      codeId:
        this.contractsEnabled &&
        this.getOrThrow('TOKEN_MODEL_CONTRACT_CODE_ID'),
      checksum:
        this.contractsEnabled &&
        this.getOrThrow('TOKEN_MODEL_CONTRACT_CHECKSUM'),
    },
    dataOnchain: {
      address:
        this.contractsEnabled &&
        this.getOrThrow('DATA_ONCHAIN_CONTRACT_ADDRESS'),
      codeId:
        this.contractsEnabled &&
        this.getOrThrow('DATA_ONCHAIN_CONTRACT_CODE_ID'),
      checksum:
        this.contractsEnabled &&
        this.getOrThrow('DATA_ONCHAIN_CONTRACT_CHECKSUM'),
    },
  };

  streamEnabled = !!this.get('STREAM_API_KEY');
  stream = {
    simulate: this.get('SIMULATE_STREAM') === 'true',
    apiKey: this.streamEnabled ? this.getOrThrow('STREAM_API_KEY') : '',
    apiSecret: this.streamEnabled ? this.getOrThrow('STREAM_API_SECRET') : '',
  };

  integrations = {
    apiKey: this.get('INTEGRATIONS_API_KEY'),
  };
}
