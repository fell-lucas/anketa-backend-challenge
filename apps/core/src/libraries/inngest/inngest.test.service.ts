import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Inngest } from 'inngest';
import { UserController } from 'src/iam/user/user.controller';
import { AppConfigService } from '../config/app.config.service';

// Event to controller mapping
interface EventHandler {
  controllerClass: any;
  handlerMethod: string;
}

interface DeferredTask {
  name: string;
  data: Record<string, any>;
  when: Date;
  id?: string;
  handler: EventHandler;
}

const EVENT_HANDLERS: Record<string, EventHandler> = {
  'app/user.created': {
    controllerClass: UserController,
    handlerMethod: 'handleUserCreated',
  },
  'app/user.scheduled-deletion': {
    controllerClass: UserController,
    handlerMethod: 'handleUserScheduledDeletion',
  },
  'app/user.scheduled-unsuspension': {
    controllerClass: UserController,
    handlerMethod: 'handleUserScheduledUnsuspension',
  },
};

/**
 * A dev service that allows to simulate Inngest events without a real Inngest account
 */
@Injectable()
export class InngestTestService {
  private logger = new Logger(InngestTestService.name);
  inngest: Inngest;

  // Store events in memory for test purposes
  private sentEvents: Array<{ name: string; data: Record<string, any> }> = [];

  // Store deferred tasks that are scheduled for later execution
  private deferredTasks: DeferredTask[] = [];

  constructor(
    private configService: AppConfigService,
    private moduleRef: ModuleRef,
  ) {
    if (!['development', 'test'].includes(process.env.NODE_ENV)) {
      throw new Error('InngestTestService is only available in development');
    }
    this.logger.log('🚧 Simulating Inngest Events');

    // Create a minimal mock implementation
    this.inngest = {
      send: (params: any) => this.mockSend(params),
    } as unknown as Inngest;
  }

  /**
   * Simulate Inngest events by calling directly the Controllers bypassing Inngest.
   */
  private async mockSend({
    name,
    data,
    when,
    id,
  }: {
    name: string;
    data: Record<string, any>;
    when?: Date;
    id?: string;
  }) {
    this.logger.debug(`Mock sending event: ${name}`, { data, when, id });

    // Store the event for potential assertions in tests
    this.sentEvents.push({ name, data });

    // Find the handler for this event
    const handler = EVENT_HANDLERS[name];
    if (!handler) {
      throw new Error(`No handler found for event: ${name}`);
    }

    // If 'when' is provided, queue the task for later execution
    if (when) {
      this.logger.debug(
        `Queueing deferred task: ${name} for ${when.toISOString()}`,
      );
      this.deferredTasks.push({
        name,
        data,
        when,
        id: id || crypto.randomUUID(),
        handler,
      });
      return { ids: [id || crypto.randomUUID()], status: 'queued' };
    }

    // Execute immediately if no 'when' parameter
    return await this.executeTask(name, data, handler, id);
  }

  /**
   * Execute a single task
   */
  private async executeTask(
    name: string,
    data: Record<string, any>,
    handler: EventHandler,
    id?: string,
  ) {
    // Get the controller instance from the NestJS container
    const controller = this.moduleRef.get(handler.controllerClass, {
      strict: false,
    });

    if (!controller) {
      throw new Error(`Controller not found: ${handler.controllerClass.name}`);
    }

    // Get the handler method
    const handlerMethod = controller[handler.handlerMethod];
    if (!handlerMethod || typeof handlerMethod !== 'function') {
      throw new Error(
        `Handler method not found: ${handler.handlerMethod} on ${handler.controllerClass.name}`,
      );
    }

    // Create the event context similar to what Inngest would provide
    const eventContext = {
      event: {
        name,
        data,
        when: Date.now(),
        id: id || crypto.randomUUID(),
      },
      step: {
        // Mock step functions that Inngest provides
        run: async (name: string, fn: Function) => fn(),
        sleep: async (duration: string) => {
          // Mock sleep - in real tests you might want to actually wait
          this.logger.debug(`Mock sleep: ${duration}`);
        },
        sendEvent: async (name: string, options: Record<string, any>) => {
          this.logger.debug(`Mock sending event: ${name}`, { options });
          this.sentEvents.push({ name, data: options.data });
        },
        waitForEvent: async (name: string, data: Record<string, any>) => {
          this.logger.debug(`Mock waiting for event: ${name}`, { data });
        },
      },
    };

    // Call the handler method
    this.logger.log(
      `Calling ${handler.controllerClass.name}.${handler.handlerMethod} for event: ${name}`,
    );
    const result = await handlerMethod.call(controller, eventContext);

    this.logger.log(`Event handler completed successfully: ${name}`, result);
    return { ids: [eventContext.event.id], status: 'success', result };
  }

  /**
   * Send an event to the mock Inngest
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
      when,
      id,
    });
  }

  async sendEventDebounced<TEvent extends string>(
    eventName: TEvent,
    data: Record<string, any>,
    when: Date,
    debounceIntervalMinutes: number = 10,
  ) {
    // Round 'when' up to the next debounceIntervalMinutes to ensure that multiple
    // events in the same time slot will run together.
    const intervalMs = debounceIntervalMinutes * 60 * 1000;
    const roundedTime = Math.ceil(when.getTime() / intervalMs) * intervalMs;
    const id = `${eventName}-d-${roundedTime}`;

    return this.inngest.send({
      name: eventName,
      data,
      when: new Date(roundedTime),
      id,
    });
  }

  async sendEventUnique<TEvent extends string>(
    eventName: TEvent,
    data: Record<string, any>,
    when?: Date,
    id?: string,
  ) {
    return this.inngest.send({
      name: eventName,
      data,
      when,
      id,
    });
  }

  /**
   * Execute all deferred tasks (for tests)
   */
  async executeDeferredEvents() {
    if (this.deferredTasks.length === 0) {
      this.logger.debug('No deferred tasks ready for execution');
      return [];
    }

    this.logger.log(`Executing ${this.deferredTasks.length} deferred tasks`);

    const results = [];
    // NB: we continue looping because tasks can trigger other tasks:
    while (this.deferredTasks.length > 0) {
      const task = this.deferredTasks.shift();
      if (!task) {
        break;
      }
      this.logger.debug(
        `Executing deferred task: ${task.name} (scheduled for ${task.when.toISOString()})`,
      );
      const result = await this.executeTask(
        task.name,
        task.data,
        task.handler,
        task.id,
      );
      results.push({ task, result });
    }

    // Clear all executed tasks
    this.deferredTasks = [];

    return results;
  }

  /**
   * Get all deferred tasks (for test purposes)
   */
  getDeferredTasks() {
    return [...this.deferredTasks];
  }

  /**
   * Clear all deferred tasks (for test purposes)
   */
  clearDeferredTasks() {
    this.deferredTasks = [];
  }

  /**
   * Get the count of deferred tasks
   */
  getDeferredTaskCount() {
    return this.deferredTasks.length;
  }

  /**
   * Get the Inngest client instance
   */
  getClient() {
    return this.inngest;
  }

  /**
   * Get all sent events (for test purposes)
   */
  getSentEvents() {
    return this.sentEvents;
  }

  /**
   * Clear sent events (for test purposes)
   */
  clearSentEvents() {
    this.sentEvents = [];
  }

  /**
   * Clear all events and deferred tasks (for test purposes)
   */
  clearAll() {
    this.clearSentEvents();
    this.clearDeferredTasks();
  }
}
