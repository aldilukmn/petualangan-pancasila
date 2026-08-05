import { Logger } from '@/core/utils/Logger';
import { EventBus } from '@/core/events/EventBus';

export enum ErrorSeverity {
  MINOR = 'MINOR',
  WARNING = 'WARNING',
  FATAL = 'FATAL'
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handle(error: Error, severity: ErrorSeverity, context?: string): void {
    const contextMsg = context ? ` [Context: ${context}]` : '';
    const message = `Error: ${error.message}${contextMsg}`;

    switch (severity) {
      case ErrorSeverity.MINOR:
        Logger.info(message, error);
        break;
      case ErrorSeverity.WARNING:
        Logger.warn(message, error);
        break;
      case ErrorSeverity.FATAL:
        Logger.error(`FATAL ${message}`, error);
        this.triggerFatalRecovery(error);
        break;
    }
  }

  private triggerFatalRecovery(error: Error): void {
    // Attempt graceful degradation or show error screen via EventBus
    EventBus.getInstance().emit('APP:FATAL_ERROR', error);
  }

  private setupGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      this.handle(
        event.error || new Error(event.message),
        ErrorSeverity.FATAL,
        'Global Window Error'
      );
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handle(new Error(event.reason), ErrorSeverity.FATAL, 'Unhandled Promise Rejection');
    });
  }
}
