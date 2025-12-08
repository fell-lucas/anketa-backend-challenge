import { Injectable, Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import { AppConfigService } from '../config/app.config.service';
import { inngest } from './inngest';

@Injectable()
export class InngestService {
  private logger = new Logger(InngestService.name);
  inngest: Inngest;

  constructor(private configService: AppConfigService) {
    this.logger.log('🤖 Starting Inngest Service...', {
      INNGEST_SIGNING_KEY: !!process.env['INNGEST_SIGNING_KEY'],
      INNGEST_EVENT_KEY: !!process.env['INNGEST_EVENT_KEY'],
      INNGEST_PROD_MODE: process.env['INNGEST_PROD_MODE'] === 'true',
    });
    this.initialize();
  }

  private initialize() {
    this.inngest = inngest;
  }

  /**
   * Send an event to Inngest
   */
  async sendEvent<TEvent extends string>(
    eventName: TEvent,
    data: Record<string, any>,
    when?: Date,
    id?: string,
  ) {
    return this.inngest.send({
      name: eventName,
      data,
      ts: when ? when.getTime() : undefined,
      id,
    });
  }

  /**
   * Send an event that is processed at max every X minutes.
   * IF multiple events are sent in the same time slot, only the first data will be processed.
   */
  async sendEventDebounced<TEvent extends string>(
    eventName: TEvent,
    data: Record<string, any>,
    when: Date,
    debounceIntervalMinutes: number = 10,
  ) {
    // Round 'when' down to the nearest debounceIntervalMinutes the ensure that multiple
    // events in the same time slot will run together.
    const intervalMs = debounceIntervalMinutes * 60 * 1000;
    const roundedTime = Math.ceil(when.getTime() / intervalMs) * intervalMs;
    const id = `${eventName}-d-${roundedTime}`;
    return this.inngest.send({
      id,
      name: eventName,
      data, // NB: only the last data sent will be processed. If not ok use batching.
      ts: roundedTime,
    });
  }

  async sendEventUnique<TEvent extends string>(
    eventName: TEvent,
    data: Record<string, any>,
    when?: Date,
    id?: string,
  ) {
    return this.inngest.send({
      id,
      name: eventName,
      data,
      when,
    });
  }

  /**
   * Get the Inngest client instance
   */
  getClient() {
    return this.inngest;
  }
}
