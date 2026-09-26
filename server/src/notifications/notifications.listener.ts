import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

// Generic event-listener skeleton for the in-app notification stream.
// The previous fitness-specific handlers (nutrition.created/edited/removed)
// were removed as part of the backend reset. Re-wire new domain events here
// with @OnEvent('your.event.name') — see NotificationsService.create() for
// the payload shape.

@Injectable()
export class NotificationsListener {
    constructor(private readonly notificationsService: NotificationsService) { }
}
